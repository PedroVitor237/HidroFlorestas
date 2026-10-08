import assert from "node:assert/strict";
import { test } from "node:test";
import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { AccountService, type AccountDependencies } from "../../src/app/api/server/accounts/service";
import { AccountError } from "../../src/app/api/server/accounts/contracts";
import { maintainAccountRequests } from "../../src/app/api/server/accounts/maintenance";
import type { AccountPolicy } from "../../src/app/api/server/accounts/policy";
import { decryptMail } from "../../src/app/api/server/mail/crypto";
import { processMailBatch } from "../../src/app/api/server/mail/worker";
import { verifySessionToken } from "../../src/app/api/server/auth/session";
import type { PrismaClient, Prisma } from "../../src/generated/prisma";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";

// Synthetic proofs stay in this child process. No SMTP provider or public debug endpoint is used.
process.env.JWT_SECRET = randomBytes(48).toString("base64");
const initial = new Date("2030-01-01T12:00:00.000Z");
const password = "Synthetic password 42!", nextPassword = "Replacement password 43!";
const signupInput = (email = `${randomUUID()}@accounts.test.invalid`) => ({ firstName: "Synthetic", lastName: "Account", email, password });
const isError = (code: AccountError["code"]) => (error: unknown) => error instanceof AccountError && error.code === code;
function barrier() { let release!: () => void; const promise = new Promise<void>((resolve) => { release = resolve; }); return { promise, release }; }
function policy(): AccountPolicy {
  return { verificationTtlMs: 900_000, maxCodeAttempts: 5, cooldownMs: 60_000, verificationSendsPerHour: 5, resetTtlMs: 1_800_000, resetRequestsPerHour: 3, globalRequestsPerHour: 100,
    protection: { keys: new Map([["proof", randomBytes(32)]]), activeKeyId: "proof", requestKey: randomBytes(32) },
    mail: { keys: new Map([["mail", randomBytes(32)]]), activeKeyId: "mail", idempotencyKey: randomBytes(32), publicUrl: "https://accounts.example.invalid" }, testerAllowlist: null };
}
async function fixture(run: (f: ReturnType<typeof context>) => Promise<void>) {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => { await setupIHFRDiagnosisFixtures(client); await run(context(db)); });
}
function context(db: PrismaClient) {
  const settings = policy(); let now = initial; const resetTokens: string[] = [];
  const service = (overrides: Partial<AccountDependencies> = {}) => new AccountService({ db, policy: () => settings, now: () => now,
    hashPassword: (value) => bcrypt.hash(value, 4), comparePassword: bcrypt.compare, code: () => "000042",
    token: () => { const value = randomBytes(32).toString("base64url"); resetTokens.push(value); return value; }, ...overrides });
  const account = service();
  const signup = async (email?: string) => { const input = signupInput(email), key = randomUUID(), result = await account.signup(input, key, "test-ingress"); const userId = (await db.user.findUniqueOrThrow({ where: { email: input.email } })).id; return { input, key, result, userId }; };
  const challenge = (userId: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" = "EMAIL_VERIFICATION") => db.accountEmailChallenge.findFirstOrThrow({ where: { userId, purpose, consumedAt: null, invalidatedAt: null } });
  const verify = async (value: Awaited<ReturnType<typeof signup>>) => account.confirmVerification(value.result.token, { challengeId: (await challenge(value.userId)).id, code: "000042" }, "test-ingress");
  const reset = async (email: string) => { await account.requestReset({ email }, randomUUID(), "test-ingress"); return resetTokens.at(-1)!; };
  return { db, settings, service, account, signup, challenge, verify, reset, resetTokens, setNow: (value: Date) => { now = value; } };
}

test("accounts signup atomically stores commitments and encrypted mail; replay proves original ownership", async () => fixture(async (f) => {
  const value = await f.signup("Mixed.Case@accounts.test.invalid"), user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } });
  assert.equal(user.email, value.input.email); assert.equal(user.emailCanonical, value.input.email.toLowerCase()); assert.equal(user.verificationRequired, true); assert.equal(user.emailVerifiedAt, null);
  assert.equal(value.result.purpose, "email-verification"); assert.equal(value.result.destination, "/verify-email");
  assert.equal(await bcrypt.compare(password, user.password), true);
  const current = await f.challenge(user.id), outbox = await f.db.mailOutbox.findFirstOrThrow({ where: { challengeId: current.id } });
  assert.equal(current.proofDigest.includes("000042"), false); assert.equal(JSON.stringify(outbox.encryptedPayload).includes("000042"), false);
  const content = decryptMail(outbox.encryptedPayload, outbox.id, outbox.template, f.settings.mail) as { content: { code: string } };
  assert.equal(content.content.code === "000042", true);
  const replay = await f.account.signup(value.input, value.key, "test-ingress"); assert.equal(replay.reused, true); assert.equal(verifySessionToken(replay.token)?.userId, user.id);
  assert.deepEqual(Object.keys(replay.user).sort(), ["firstName", "image", "lastName"]);
  assert.equal(await f.db.accountEmailChallenge.count({ where: { userId: user.id } }), 1); assert.equal(await f.db.mailOutbox.count({ where: { challengeId: current.id } }), 1);
  await assert.rejects(f.account.signup({ ...value.input, password: nextPassword }, value.key, "test-ingress"), isError("IDEMPOTENCY_CONFLICT"));
  await assert.rejects(f.account.signup({ ...value.input, email: value.input.email.toLowerCase() }, randomUUID(), "test-ingress"), isError("ACCOUNT_EXISTS"));
}));

test("accounts rollback removes new identity, challenge, request and mail atomically", async () => fixture(async (f) => {
  const input = signupInput(); await assert.rejects(f.service({ beforeCommit: async () => { throw new Error("synthetic rollback"); } }).signup(input, randomUUID(), "rollback"), /synthetic rollback/);
  assert.equal(await f.db.user.count({ where: { email: input.email } }), 0); assert.equal(await f.db.accountRequest.count(), 0); assert.equal(await f.db.mailOutbox.count(), 0); assert.equal(await f.db.accountEmailChallenge.count(), 0);
}));

test("accounts concurrent identical signup and different-key canonical duplicates create one identity", async () => fixture(async (f) => {
  const input = signupInput(), key = randomUUID();
  const same = await Promise.all([f.account.signup(input, key, "same"), f.account.signup(input, key, "same")]);
  assert.equal(verifySessionToken(same[0].token)?.userId, verifySessionToken(same[1].token)?.userId); assert.equal(same.filter((r) => r.reused).length, 1);
  const alternate = signupInput(), outcomes = await Promise.allSettled([f.account.signup(alternate, randomUUID(), "other"), f.account.signup({ ...alternate, email: alternate.email.toUpperCase() }, randomUUID(), "other")]);
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1); assert.equal(await f.db.user.count({ where: { emailCanonical: alternate.email.toLowerCase() } }), 1);
}));

test("accounts invalid verification attempts survive errors, exhaust once and cancel encrypted mail", async () => fixture(async (f) => {
  const value = await f.signup(), challenge = await f.challenge(value.userId);
  for (let attempt = 1; attempt <= 5; attempt++) {
    await assert.rejects(f.account.confirmVerification(value.result.token, { challengeId: challenge.id, code: "000043" }, "attempt"), isError("INVALID_PROOF"));
    const persisted = await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: challenge.id } }); assert.equal(persisted.attemptCount, attempt); assert.equal(Boolean(persisted.invalidatedAt), attempt === 5);
  }
  await assert.rejects(f.account.confirmVerification(value.result.token, { challengeId: challenge.id, code: "000042" }, "attempt"), isError("INVALID_PROOF"));
  const mail = await f.db.mailOutbox.findFirstOrThrow({ where: { challengeId: challenge.id } }); assert.equal(mail.status, "CANCELLED"); assert.equal(mail.encryptedPayload, null);
  assert.equal((await f.db.user.findUniqueOrThrow({ where: { id: value.userId } })).emailVerifiedAt, null);
}));

test("accounts proofs belong to exact user, purpose, email and credential version", async () => fixture(async (f) => {
  const first = await f.signup(), other = await f.signup(), challenge = await f.challenge(first.userId);
  await f.reset(first.input.email); const reset = await f.challenge(first.userId, "PASSWORD_RESET");
  await assert.rejects(f.account.confirmVerification(first.result.token, { challengeId: reset.id, code: "000042" }, "ownership"), isError("INVALID_PROOF"));
  assert.equal((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: reset.id } })).attemptCount, 0);
  await assert.rejects(f.account.confirmVerification(other.result.token, { challengeId: challenge.id, code: "000042" }, "ownership"), isError("INVALID_PROOF"));
  assert.equal((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: challenge.id } })).attemptCount, 0);
  await f.db.user.update({ where: { id: first.userId }, data: { email: "changed@accounts.test.invalid", emailCanonical: "changed@accounts.test.invalid" } });
  await assert.rejects(f.account.confirmVerification(first.result.token, { challengeId: challenge.id, code: "000042" }, "ownership"), isError("INVALID_PROOF"));
  await f.db.user.update({ where: { id: other.userId }, data: { credentialVersion: { increment: 1 } } });
  await assert.rejects(f.account.verificationState(other.result.token), isError("UNAUTHENTICATED"));
}));

test("accounts successful verification is one-time and preserves active state, role and password", async () => fixture(async (f) => {
  const value = await f.signup(), challenge = await f.challenge(value.userId), before = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } });
  const outcomes = await Promise.allSettled([f.verify(value), f.verify(value)]); assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  const after = await f.db.user.findUniqueOrThrow({ where: { id: before.id } }); assert.deepEqual([after.status, after.role, after.password, after.credentialVersion], [before.status, before.role, before.password, before.credentialVersion]); assert.ok(after.emailVerifiedAt);
  assert.ok((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: challenge.id } })).consumedAt);
  await assert.rejects(f.account.signup(value.input, value.key, "same"), isError("ACCOUNT_EXISTS"));
}));

test("accounts resend honors cooldown, replay and invalidation without duplicating mail", async () => fixture(async (f) => {
  const value = await f.signup(), first = await f.challenge(value.userId), key = randomUUID();
  await assert.rejects(f.account.resend(value.result.token, {}, key, "resend"), isError("RATE_LIMITED"));
  f.setNow(new Date(initial.getTime() + 60_000)); const state = await f.account.resend(value.result.token, {}, key, "resend");
  assert.notEqual(state.challengeId, first.id); assert.equal((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: first.id } })).invalidatedAt?.getTime(), initial.getTime() + 60_000);
  assert.equal((await f.db.mailOutbox.findFirstOrThrow({ where: { challengeId: first.id } })).status, "CANCELLED");
  assert.equal((await f.account.resend(value.result.token, {}, key, "resend")).challengeId, state.challengeId); assert.equal(await f.db.accountEmailChallenge.count({ where: { userId: value.userId } }), 2);
  await assert.rejects(f.account.confirmVerification(value.result.token, { challengeId: first.id, code: "000042" }, "resend"), isError("INVALID_PROOF"));
}));

test("accounts retained proof key rotation consumes old proof; retired key fails closed", async () => fixture(async (f) => {
  const value = await f.signup(), old = f.settings.protection.keys.get("proof")!;
  f.settings.protection = { ...f.settings.protection, keys: new Map([["proof", old], ["next", randomBytes(32)]]), activeKeyId: "next" };
  assert.equal((await f.verify(value)).purpose, "session");
  const other = await f.signup(); f.settings.protection = { ...f.settings.protection, keys: new Map([["only", randomBytes(32)]]), activeKeyId: "only" };
  await assert.rejects(f.verify(other), isError("INVALID_PROOF"));
}));

test("accounts reset request is neutral for nonexistent, pending, blocked, inactive and throttled identities", async () => fixture(async (f) => {
  const value = await f.signup();
  for (const status of ["PENDING", "BLOCKED", "INACTIVE"] as const) { await f.db.user.update({ where: { id: value.userId }, data: { status } }); assert.equal(await f.account.requestReset({ email: value.input.email }, randomUUID(), "neutral"), undefined); }
  assert.equal(await f.account.requestReset({ email: "missing@accounts.test.invalid" }, randomUUID(), "neutral"), undefined); assert.equal(f.resetTokens.length, 0);
  await f.db.user.update({ where: { id: value.userId }, data: { status: "ACTIVE" } });
  for (let i = 0; i < 4; i++) assert.equal(await f.account.requestReset({ email: value.input.email }, randomUUID(), `neutral-${i}`), undefined);
  assert.equal(f.resetTokens.length, 0, "earlier attempts for disabled accounts must also spend the subject quota");
}));

test("accounts repeated reset key preserves current proof; new request invalidates previous proof", async () => fixture(async (f) => {
  const value = await f.signup(), key = randomUUID(); await f.account.requestReset({ email: value.input.email }, key, "reset"); const first = await f.challenge(value.userId, "PASSWORD_RESET");
  await f.account.requestReset({ email: value.input.email.toUpperCase() }, key, "reset"); assert.equal(f.resetTokens.length, 1);
  await f.reset(value.input.email); assert.equal(f.resetTokens.length, 2); assert.ok((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: first.id } })).invalidatedAt);
  await assert.rejects(f.account.confirmReset({ token: f.resetTokens[0], newPassword: nextPassword, confirmPassword: nextPassword }, "reset"), isError("INVALID_PROOF"));
}));

test("accounts reset is single-use, increments version, invalidates proofs and queues challenge-free notification", async () => fixture(async (f) => {
  const value = await f.signup(), token = await f.reset(value.input.email);
  const body = { token, newPassword: nextPassword, confirmPassword: nextPassword };
  const outcomes = await Promise.allSettled([f.account.confirmReset(body, "reset"), f.account.confirmReset(body, "reset")]); assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  const user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } }); assert.equal(user.credentialVersion, 1); assert.equal(user.emailVerifiedAt, null); assert.equal(user.status, "ACTIVE"); assert.equal(await bcrypt.compare(nextPassword, user.password), true);
  await assert.rejects(f.account.verificationState(value.result.token), isError("UNAUTHENTICATED"));
  const notice = await f.db.mailOutbox.findFirstOrThrow({ where: { template: "PASSWORD_CHANGED_V1" } }); assert.equal(notice.challengeId, null);
  const content = decryptMail(notice.encryptedPayload, notice.id, notice.template, f.settings.mail); assert.equal(JSON.stringify(content).includes(token), false); assert.equal(JSON.stringify(content).includes(nextPassword), false);
  let sends = 0; assert.equal((await processMailBatch({ db: f.db, protection: f.settings.mail, now: () => initial, transport: { async send() { sends++; } } })).accepted, 1); assert.equal(sends, 1);
  assert.equal((await f.account.login({ email: value.input.email, password: nextPassword }, "login")).purpose, "email-verification");
}));

test("accounts reset expiration during password hashing rejects without changing credentials", async () => fixture(async (f) => {
  const value = await f.signup(), token = await f.reset(value.input.email), entered = barrier(), resume = barrier();
  const service = f.service({ hashPassword: async (input) => { entered.release(); await resume.promise; return bcrypt.hash(input, 4); } });
  const operation = service.confirmReset({ token, newPassword: nextPassword, confirmPassword: nextPassword }, "expired"); const outcome = assert.rejects(operation, isError("INVALID_PROOF"));
  try { await entered.promise; f.setNow(new Date(initial.getTime() + f.settings.resetTtlMs)); } finally { resume.release(); }
  await outcome; const user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } }); assert.equal(user.credentialVersion, 0); assert.equal(await bcrypt.compare(password, user.password), true);
}));

function delayChallenge(db: PrismaClient) {
  const observed = barrier(), resume = barrier(); let delayed = false;
  const proxy = new Proxy(db, { get(target, name) {
    if (name !== "$transaction") return Reflect.get(target, name);
    return (callback: (tx: Prisma.TransactionClient) => Promise<unknown>, options: unknown) => target.$transaction(async (tx) => {
      const delegate = new Proxy(tx.accountEmailChallenge, { get(model, operation) { const fn = Reflect.get(model, operation); if (operation !== "findUnique") return fn; return async (...args: unknown[]) => { const result = await Reflect.apply(fn, model, args); if (!delayed) { delayed = true; observed.release(); await resume.promise; } return result; }; } });
      return callback(new Proxy(tx, { get(transaction, field) { return field === "accountEmailChallenge" ? delegate : Reflect.get(transaction, field); } }));
    }, options as Parameters<PrismaClient["$transaction"]>[1]);
  } });
  return { db: proxy, observed, resume };
}
for (const kind of ["verification", "reset"] as const) test(`accounts fresh consumption clock rejects delayed ${kind} read crossing expiry`, async () => fixture(async (f) => {
  const value = await f.signup(), token = kind === "reset" ? await f.reset(value.input.email) : undefined, delayed = delayChallenge(f.db), service = f.service({ db: delayed.db });
  const operation = kind === "reset" ? service.confirmReset({ token, newPassword: nextPassword, confirmPassword: nextPassword }, "clock") : service.confirmVerification(value.result.token, { challengeId: (await f.challenge(value.userId)).id, code: "000042" }, "clock");
  const outcome = assert.rejects(operation, isError("INVALID_PROOF"));
  try { await delayed.observed.promise; f.setNow(new Date(initial.getTime() + (kind === "reset" ? f.settings.resetTtlMs : f.settings.verificationTtlMs))); } finally { delayed.resume.release(); }
  await outcome; const user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } }); assert.equal(user.credentialVersion, 0); assert.equal(user.emailVerifiedAt, null);
}));

test("accounts login rechecks password and version after concurrent reset", async () => fixture(async (f) => {
  const value = await f.signup(); await f.verify(value); const token = await f.reset(value.input.email), entered = barrier(), resume = barrier();
  const delayed = f.service({ comparePassword: async (plain, hash) => { const matched = await bcrypt.compare(plain, hash); entered.release(); await resume.promise; return matched; } });
  const login = delayed.login({ email: value.input.email, password }, "race"), outcome = assert.rejects(login, isError("INVALID_CREDENTIALS"));
  try { await entered.promise; await f.account.confirmReset({ token, newPassword: nextPassword, confirmPassword: nextPassword }, "race"); } finally { resume.release(); }
  await outcome; assert.equal((await f.account.login({ email: value.input.email, password: nextPassword }, "race")).purpose, "session");
}));

test("accounts password change rechecks hash/version after concurrent reset and requires current password", async () => fixture(async (f) => {
  const value = await f.signup(); await f.verify(value);
  await assert.rejects(f.account.changePassword(value.userId, { currentPassword: "incorrect", newPassword: nextPassword, confirmPassword: nextPassword }, "change"), isError("INVALID_CREDENTIALS"));
  const token = await f.reset(value.input.email), entered = barrier(), resume = barrier();
  const delayed = f.service({ hashPassword: async (plain) => { entered.release(); await resume.promise; return bcrypt.hash(plain, 4); } });
  const operation = delayed.changePassword(value.userId, { currentPassword: password, newPassword: "Another synthetic password!", confirmPassword: "Another synthetic password!" }, "race"), outcome = assert.rejects(operation, isError("UNAUTHENTICATED"));
  try { await entered.promise; await f.account.confirmReset({ token, newPassword: nextPassword, confirmPassword: nextPassword }, "race"); } finally { resume.release(); }
  await outcome; assert.equal((await f.db.user.findUniqueOrThrow({ where: { id: value.userId } })).credentialVersion, 1);
}));

test("accounts password change transaction rollback preserves hash/version/proofs and removes notification", async () => fixture(async (f) => {
  const value = await f.signup(); await f.verify(value); const resetToken = await f.reset(value.input.email), before = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } });
  await assert.rejects(f.service({ beforeCommit: async () => { throw new Error("synthetic rollback"); } }).changePassword(before.id, { currentPassword: password, newPassword: nextPassword, confirmPassword: nextPassword }, "change"), /synthetic rollback/);
  const after = await f.db.user.findUniqueOrThrow({ where: { id: before.id } }); assert.equal(after.password === before.password, true); assert.equal(after.credentialVersion, 0); assert.equal(await f.db.mailOutbox.count({ where: { template: "PASSWORD_CHANGED_V1" } }), 0);
  await f.account.confirmReset({ token: resetToken, newPassword: nextPassword, confirmPassword: nextPassword }, "reset");
}));

test("accounts legacy cohort and administrative roles retain approved authentication destination", async () => fixture(async (f) => {
  const legacy = await f.db.user.create({ data: { email: "legacy@accounts.test.invalid", firstName: "Synthetic", lastName: "Legacy", password: await bcrypt.hash(password, 4), status: "ACTIVE", role: "ADMIN", verificationRequired: false } });
  const login = await f.account.login({ email: legacy.email, password }, "legacy"); assert.equal(login.purpose, "session"); assert.equal(login.destination, "/admin");
  const internal = await f.db.user.create({ data: { email: "internal@accounts.test.invalid", firstName: "Synthetic", lastName: "Internal", password: await bcrypt.hash(password, 4), status: "ACTIVE", role: "ADMIN" } });
  assert.equal((await f.account.login({ email: internal.email, password }, "internal")).purpose, "email-verification");
  assert.equal(await f.db.accountEmailChallenge.count({ where: { userId: internal.id } }), 1);
  await f.db.user.update({ where: { id: legacy.id }, data: { status: "BLOCKED" } }); await assert.rejects(f.account.login({ email: legacy.email, password }, "legacy"), isError("INVALID_CREDENTIALS"));
}));

test("accounts total budget100 is shared across workflows while reset response remains neutral", async () => fixture(async (f) => {
  const value = await f.signup(); // one global request
  await f.account.login({ email: value.input.email, password }, "budget"); // second, another workflow
  for (let i = 0; i < 98; i++) await f.account.requestReset({ email: `absent-${i}@accounts.test.invalid` }, randomUUID(), `budget-${i}`);
  await assert.rejects(f.account.resend(value.result.token, {}, randomUUID(), "budget"), isError("RATE_LIMITED"));
  const receipts = await f.db.accountRequest.count(), buckets = await f.db.mailRateLimitBucket.count();
  await f.account.requestReset({ email: value.input.email }, randomUUID(), "budget"); assert.equal(f.resetTokens.length, 0);
  assert.equal(await f.db.accountRequest.count(), receipts); assert.equal(await f.db.mailRateLimitBucket.count(), buckets);
  const rows = await f.db.mailRateLimitBucket.findMany({ where: { action: "account-global" } }); assert.equal(rows.length, 1); assert.equal(rows[0].count, 100);
}));

test("accounts invalid attempt delayed beyond validity does not spend a post-expiry attempt", async () => fixture(async (f) => {
  const value = await f.signup(), challenge = await f.challenge(value.userId), delayed = delayChallenge(f.db);
  const operation = f.service({ db: delayed.db }).confirmVerification(value.result.token, { challengeId: challenge.id, code: "000043" }, "expired-attempt"), outcome = assert.rejects(operation, isError("INVALID_PROOF"));
  try { await delayed.observed.promise; f.setNow(new Date(initial.getTime() + f.settings.verificationTtlMs)); } finally { delayed.resume.release(); }
  await outcome; assert.equal((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: challenge.id } })).attemptCount, 0);
}));

test("accounts reset rollback restores consumed proof and hash/version while dropping notification", async () => fixture(async (f) => {
  const value = await f.signup(), token = await f.reset(value.input.email), challenge = await f.challenge(value.userId, "PASSWORD_RESET");
  const body = { token, newPassword: nextPassword, confirmPassword: nextPassword };
  await assert.rejects(f.service({ beforeCommit: async () => { throw new Error("synthetic rollback"); } }).confirmReset(body, "rollback-reset"), /synthetic rollback/);
  const user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } }); assert.equal(user.credentialVersion, 0); assert.equal(await bcrypt.compare(password, user.password), true);
  assert.equal((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: challenge.id } })).consumedAt, null); assert.equal(await f.db.mailOutbox.count({ where: { template: "PASSWORD_CHANGED_V1" } }), 0);
  assert.equal((await f.db.mailOutbox.findFirstOrThrow({ where: { challengeId: challenge.id } })).status, "PENDING");
  await f.account.confirmReset(body, "rollback-reset");
}));

test("accounts commitment maintenance expires at24h in bounded batches and preserves future requests", async () => fixture(async (f) => {
  const createdAt = new Date(initial.getTime() - 86_400_000);
  await f.db.accountRequest.createMany({ data: Array.from({ length: 101 }, () => ({ action: "password-reset", keyMac: randomBytes(32).toString("hex"), requestMac: randomBytes(32).toString("hex"), createdAt, expiresAt: initial })) });
  await f.db.accountRequest.create({ data: { action: "password-reset", keyMac: randomBytes(32).toString("hex"), requestMac: randomBytes(32).toString("hex"), createdAt: initial, expiresAt: new Date(initial.getTime() + 86_400_000) } });
  assert.equal(await maintainAccountRequests(f.db, initial), 100); assert.equal(await f.db.accountRequest.count(), 2);
  assert.equal(await maintainAccountRequests(f.db, initial), 1); assert.equal(await maintainAccountRequests(f.db, initial), 0); assert.equal(await f.db.accountRequest.count(), 1);
}));

test("accounts throttled reset avoids new durable receipts and identity lookup while preserving neutral return", async () => fixture(async (f) => {
  const value = await f.signup(); for (let i = 0; i < 3; i++) await f.account.requestReset({ email: value.input.email }, randomUUID(), "same-origin");
  const receipts = await f.db.accountRequest.count();
  // A duplicate synthetic canonical identity would make lookup throw if the
  // throttled request reached it. The quota must finish before identity work.
  const denied = new Proxy(f.db, { get(target, field) {
    if (field !== "$transaction") return Reflect.get(target, field);
    return (callback: (tx: Prisma.TransactionClient) => Promise<unknown>, options: unknown) => target.$transaction((tx) => callback(new Proxy(tx, { get(transaction, name) {
      if (name !== "$queryRaw") return Reflect.get(transaction, name);
      return (...args: unknown[]) => { if (String((args[0] as { sql?: string })?.sql ?? "").includes('lower(btrim("email"))')) throw new Error("throttled identity lookup forbidden"); return Reflect.apply(transaction.$queryRaw, transaction, args); };
    } })), options as Parameters<PrismaClient["$transaction"]>[1]);
  } });
  assert.equal(await f.service({ db: denied }).requestReset({ email: value.input.email }, randomUUID(), "same-origin"), undefined);
  assert.equal(await f.db.accountRequest.count(), receipts); assert.equal(f.resetTokens.length, 3);
}));

test("accounts confirmation versus resend has one consistent serialized result", async () => fixture(async (f) => {
  const value = await f.signup(), original = await f.challenge(value.userId); f.setNow(new Date(initial.getTime() + 60_000));
  const [confirmation, resend] = await Promise.allSettled([
    f.account.confirmVerification(value.result.token, { challengeId: original.id, code: "000042" }, "race-resend"),
    f.account.resend(value.result.token, {}, randomUUID(), "race-resend"),
  ]);
  assert.equal(resend.status, "fulfilled");
  const user = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } });
  if (confirmation.status === "fulfilled") {
    assert.ok(user.emailVerifiedAt); assert.equal(resend.status === "fulfilled" && resend.value.status, "VERIFIED");
    assert.equal(await f.db.accountEmailChallenge.count({ where: { userId: value.userId, consumedAt: null, invalidatedAt: null } }), 0);
  } else {
    assert.equal(isError("INVALID_PROOF")(confirmation.reason), true); assert.equal(user.emailVerifiedAt, null);
    assert.ok((await f.db.accountEmailChallenge.findUniqueOrThrow({ where: { id: original.id } })).invalidatedAt);
    assert.notEqual(resend.status === "fulfilled" && resend.value.challengeId, original.id);
    await f.verify(value); assert.ok((await f.db.user.findUniqueOrThrow({ where: { id: value.userId } })).emailVerifiedAt);
  }
}));

test("accounts verification and reset never reactivate an account disabled after proof issuance", async () => fixture(async (f) => {
  for (const status of ["PENDING", "BLOCKED", "INACTIVE"] as const) {
    const value = await f.signup(), challenge = await f.challenge(value.userId), resetToken = await f.reset(value.input.email);
    const before = await f.db.user.update({ where: { id: value.userId }, data: { status, role: "ADMIN" } });
    await assert.rejects(f.account.confirmVerification(value.result.token, { challengeId: challenge.id, code: "000042" }, `disabled-${status}`), isError("UNAUTHENTICATED"));
    await assert.rejects(f.account.confirmReset({ token: resetToken, newPassword: nextPassword, confirmPassword: nextPassword }, `disabled-${status}`), isError("INVALID_PROOF"));
    const after = await f.db.user.findUniqueOrThrow({ where: { id: value.userId } });
    assert.deepEqual([after.status, after.role, after.password, after.credentialVersion, after.emailVerifiedAt], [before.status, before.role, before.password, before.credentialVersion, null]);
    assert.equal(await f.db.mailOutbox.count({ where: { template: "PASSWORD_CHANGED_V1" } }), 0);
  }
}));

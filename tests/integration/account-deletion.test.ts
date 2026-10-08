import assert from "node:assert/strict";
import { test } from "node:test";
import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { AccountService, type AccountDependencies } from "../../src/app/api/server/accounts/service";
import { AccountDeletionError, type AccountDeletionErrorCode } from "../../src/app/api/server/accounts/deletion.contracts";
import { signSessionToken } from "../../src/app/api/server/auth/session";
import type { AccountPolicy } from "../../src/app/api/server/accounts/policy";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { IHFR_ACTORS } from "../fixtures/ihfr-diagnosis-actors";
import { enqueueMail } from "../../src/app/api/server/mail/outbox";
import { processMailBatch, type MailDb } from "../../src/app/api/server/mail/worker";

process.env.JWT_SECRET = randomBytes(48).toString("base64");
const password = "Deletion synthetic password 42!";
const body = { currentPassword: password, confirmDeletion: true };
const errorCode = (code: AccountDeletionErrorCode) => (error: unknown) => error instanceof AccountDeletionError && error.code === code;
async function fixture(run: (f: { db: Parameters<Parameters<typeof withImp006PostgresqlSchema>[1]>[1]; service: AccountService; makeService: (deps: Partial<AccountDependencies>) => AccountService; signup: () => ReturnType<AccountService["signup"]>; policy: AccountPolicy }) => Promise<void>) {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const policy: AccountPolicy = { verificationTtlMs: 900_000, maxCodeAttempts: 5, cooldownMs: 60_000, verificationSendsPerHour: 5, resetTtlMs: 1_800_000, resetRequestsPerHour: 3, globalRequestsPerHour: 100,
      protection: { keys: new Map([["proof", randomBytes(32)]]), activeKeyId: "proof", requestKey: randomBytes(32) }, mail: { keys: new Map([["mail", randomBytes(32)]]), activeKeyId: "mail", idempotencyKey: randomBytes(32), publicUrl: "https://accounts.example.invalid" }, testerAllowlist: null };
    const makeService = (overrides: Partial<AccountDependencies> = {}) => new AccountService({ db, policy: () => policy, hashPassword: value => bcrypt.hash(value, 4), ...overrides });
    const service = makeService();
    const signup = () => service.signup({ firstName: "Synthetic", lastName: "Deletion", email: `${randomUUID()}@accounts.test.invalid`, password }, randomUUID(), "signup");
    await run({ db, service, makeService, signup, policy });
  });
}

test("deletion removes only own identity, proofs, receipts and encrypted mail; stale sessions fail", async () => fixture(async f => {
  const result = await f.signup(), other = await f.signup();
  const own = await f.db.user.findFirstOrThrow({ where: { firstName: "Synthetic" }, orderBy: { createdAt: "asc" } });
  const ownMail = await f.db.mailOutbox.findFirstOrThrow({ where: { accountUserId: own.id } });
  assert.ok(ownMail.accountUserId);
  await f.service.deleteAccount(result.token, body, "delete");
  assert.equal(await f.db.user.findUnique({ where: { id: own.id } }), null);
  assert.equal(await f.db.accountEmailChallenge.count({ where: { userId: own.id } }), 0);
  assert.equal(await f.db.mailOutbox.count({ where: { accountUserId: own.id } }), 0);
  assert.equal(await f.db.accountRequest.count({ where: { userId: own.id } }), 0);
  await assert.rejects(f.service.deletionState(result.token), errorCode("UNAUTHENTICATED"));
  assert.equal((await f.service.deletionState(other.token)).canDelete, true);
  const recreated = await f.service.signup({ firstName: own.firstName, lastName: own.lastName, email: own.email, password }, randomUUID(), "new-signup");
  assert.notEqual(recreated.token, result.token);
  assert.notEqual((await f.db.user.findUniqueOrThrow({ where: { email: own.email } })).id, own.id);
}));

test("deletion requires a live session, exact confirmation and password; failures are durably limited", async () => fixture(async f => {
  const result = await f.signup();
  await assert.rejects(f.service.deleteAccount(undefined, body, "delete"), errorCode("UNAUTHENTICATED"));
  await assert.rejects(f.service.deleteAccount(result.token, { ...body, confirmDeletion: false }, "delete"), errorCode("INVALID_REQUEST"));
  for (let i = 0; i < 5; i++) await assert.rejects(f.service.deleteAccount(result.token, { ...body, currentPassword: "incorrect" }, "delete"), errorCode("INVALID_CREDENTIALS"));
  await assert.rejects(f.service.deleteAccount(result.token, body, "delete"), errorCode("RATE_LIMITED"));
  assert.equal((await f.service.deletionState(result.token)).canDelete, true);
  assert.equal(await f.db.mailRateLimitBucket.count({ where: { action: "delete-account" } }), 2);
}));

test("deletion rollback restores identity and all authentication inputs", async () => fixture(async f => {
  const result = await f.signup();
  const before = [await f.db.user.count(), await f.db.mailOutbox.count(), await f.db.accountEmailChallenge.count(), await f.db.accountRequest.count()];
  await assert.rejects(f.makeService({ beforeCommit: async () => { throw new Error("synthetic rollback"); } }).deleteAccount(result.token, body, "delete"), /synthetic rollback/);
  assert.deepEqual([await f.db.user.count(), await f.db.mailOutbox.count(), await f.db.accountEmailChallenge.count(), await f.db.accountRequest.count()], before);
  assert.equal((await f.service.deletionState(result.token)).canDelete, true);
}));

test("scientific and administrative blockers are counted and unchanged on attempted deletion", async () => fixture(async f => {
  const owner = await f.db.user.update({ where: { id: IHFR_ACTORS.owner }, data: { password: await bcrypt.hash(password, 4) } });
  await f.db.administrativeAuditEvent.create({ data: { actorUserId: IHFR_ACTORS.outsider, targetUserId: owner.id, action: "ACCOUNT_STATUS_CHANGED", beforeValue: "INACTIVE", afterValue: "ACTIVE", reason: "Synthetic", targetRevision: 1 } });
  const token = signSessionToken(owner.id);
  const state = await f.service.deletionState(token);
  for (const code of ["LABORATORIES", "MEMBERSHIPS", "AREAS", "COLLECTIONS", "MEASUREMENTS", "IHFR_INPUTS", "IHFR_OPERATIONS", "IHFR_HISTORY", "ADMINISTRATIVE_HISTORY"]) assert.ok(state.blockers.some(b => b.code === code), code);
  const counts = [await f.db.collectionData.count(), await f.db.experimentalIHFRDiagnosis.count(), await f.db.administrativeAuditEvent.count()];
  await assert.rejects(f.service.deleteAccount(token, body, "delete"), errorCode("ACCOUNT_LINKED"));
  assert.deepEqual([await f.db.collectionData.count(), await f.db.experimentalIHFRDiagnosis.count(), await f.db.administrativeAuditEvent.count()], counts);
}));

test("last active administrator is protected, including concurrent self deletions", async () => fixture(async f => {
  const a = await f.db.user.create({ data: { email: "admin-a@accounts.test.invalid", firstName: "Synthetic", lastName: "Admin", password: await bcrypt.hash(password, 4), role: "ADMIN", status: "ACTIVE", verificationRequired: false } });
  const tokenA = signSessionToken(a.id);
  await assert.rejects(f.service.deleteAccount(tokenA, body, "admin-a"), errorCode("ACCOUNT_LINKED"));
  const b = await f.db.user.create({ data: { email: "admin-b@accounts.test.invalid", firstName: "Synthetic", lastName: "Admin", password: a.password, role: "ADMIN", status: "ACTIVE", verificationRequired: false } });
  const outcomes = await Promise.allSettled([f.service.deleteAccount(tokenA, body, "admin-a"), f.service.deleteAccount(signSessionToken(b.id), body, "admin-b")]);
  assert.equal(outcomes.filter(outcome => outcome.status === "fulfilled").length, 1);
  assert.equal(await f.db.user.count({ where: { role: "ADMIN", status: "ACTIVE" } }), 1);
}));

test("stale credential versions and inactive users cannot delete, even with a matching password", async () => fixture(async f => {
  const user = await f.db.user.create({ data: { email: "stale@accounts.test.invalid", firstName: "Synthetic", lastName: "Stale", password: await bcrypt.hash(password, 4), verificationRequired: false, credentialVersion: 1 } });
  await assert.rejects(f.service.deleteAccount(signSessionToken(user.id), body, "delete"), errorCode("UNAUTHENTICATED"));
  await f.db.user.update({ where: { id: user.id }, data: { status: "INACTIVE" } });
  await assert.rejects(f.service.deleteAccount(signSessionToken(user.id, undefined, 1), body, "delete"), errorCode("UNAUTHENTICATED"));
}));

test("unowned live legacy notices temporarily prevent deletion without touching other accounts", async () => fixture(async f => {
  const result = await f.signup();
  const notice = await f.db.$transaction(tx => enqueueMail(tx, { idempotencyKey: randomUUID(), recipient: "legacy@accounts.test.invalid", content: { template: "password-changed-v1", name: "Legacy" }, expiresAt: new Date(Date.now() + 86_400_000) }, f.policy.mail));
  await assert.rejects(f.service.deleteAccount(result.token, body, "delete"), errorCode("MAIL_CLEANUP_PENDING"));
  assert.ok(await f.db.mailOutbox.findUnique({ where: { id: notice.id } }));
  await f.db.mailOutbox.update({ where: { id: notice.id }, data: { status: "CANCELLED", encryptedPayload: (await import("../../src/generated/prisma")).Prisma.DbNull } });
  await f.service.deleteAccount(result.token, body, "delete");
  assert.ok(await f.db.mailOutbox.findUnique({ where: { id: notice.id } }));
}));

test("password notices have explicit ownership and delete with the updated credential version", async () => fixture(async f => {
  const result = await f.signup();
  const user = await f.db.user.findFirstOrThrow({ where: { firstName: "Synthetic" } });
  await f.db.user.update({ where: { id: user.id }, data: { verificationRequired: false } });
  const token = signSessionToken(user.id);
  await f.service.changePassword(user.id, { currentPassword: password, newPassword: "New deletion password 43!", confirmPassword: "New deletion password 43!" }, "change");
  const notice = await f.db.mailOutbox.findFirstOrThrow({ where: { template: "PASSWORD_CHANGED_V1" } });
  assert.equal(notice.accountUserId, user.id);
  await assert.rejects(f.service.deleteAccount(token, body, "delete"), errorCode("UNAUTHENTICATED"));
  const fresh = signSessionToken(user.id, undefined, 1);
  await f.service.deleteAccount(fresh, { ...body, currentPassword: "New deletion password 43!" }, "delete");
  assert.equal(await f.db.mailOutbox.count(), 0);
  await assert.rejects(f.service.deletionState(result.token), errorCode("UNAUTHENTICATED"));
}));

test("mail ownership preserves replay but rejects changing the owner or mismatching a challenge", async () => fixture(async f => {
  await f.signup(); await f.signup();
  const users = await f.db.user.findMany({ where: { firstName: "Synthetic" }, orderBy: { createdAt: "asc" } });
  const input = { accountUserId: users[0].id, idempotencyKey: randomUUID(), recipient: users[0].email, content: { template: "password-changed-v1" as const, name: users[0].firstName }, expiresAt: new Date(Date.now() + 86_400_000) };
  const first = await f.db.$transaction(tx => enqueueMail(tx, input, f.policy.mail));
  assert.equal((await f.db.$transaction(tx => enqueueMail(tx, input, f.policy.mail))).id, first.id);
  await assert.rejects(f.db.$transaction(tx => enqueueMail(tx, { ...input, accountUserId: users[1].id }, f.policy.mail)), { code: "IDEMPOTENCY_CONFLICT" });
  const challenge = await f.db.accountEmailChallenge.findFirstOrThrow({ where: { userId: users[0].id } });
  await assert.rejects(f.db.$transaction(tx => enqueueMail(tx, { ...input, idempotencyKey: randomUUID(), accountUserId: users[1].id, challengeId: challenge.id, content: { template: "email-verification-v1", name: users[0].firstName, code: "000042" } }, f.policy.mail)), { code: "INVALID_INPUT" });
}));

test("a password revision while comparison is pending prevents deletion", async () => fixture(async f => {
  const result = await f.signup();
  const user = await f.db.user.findFirstOrThrow({ where: { firstName: "Synthetic" } });
  const service = f.makeService({ comparePassword: async (value, hash) => {
    const matched = await bcrypt.compare(value, hash);
    await f.db.user.update({ where: { id: user.id }, data: { credentialVersion: { increment: 1 } } });
    return matched;
  } });
  await assert.rejects(service.deleteAccount(result.token, body, "delete"), errorCode("UNAUTHENTICATED"));
  assert.ok(await f.db.user.findUnique({ where: { id: user.id } }));
}));

test("a new scientific link after GET eligibility is rechecked at DELETE", async () => fixture(async f => {
  const result = await f.signup();
  const user = await f.db.user.findFirstOrThrow({ where: { firstName: "Synthetic" } });
  assert.equal((await f.service.deletionState(result.token)).canDelete, true);
  const service = f.makeService({ comparePassword: async (value, hash) => {
    const matched = await bcrypt.compare(value, hash);
    await f.db.laboratoryRoom.create({ data: { userId: user.id, name: "New link", accessCode: randomUUID(), researchersLinked: { create: { userId: user.id, role: "OWNER" } } } });
    return matched;
  } });
  await assert.rejects(service.deleteAccount(result.token, body, "delete"), errorCode("ACCOUNT_LINKED"));
  assert.equal(await f.db.laboratoryRoom.count({ where: { userId: user.id } }), 1);
}));

for (const inTransport of [false, true]) test(`R1 deletion ${inTransport ? "during authorized transport" : "before final send fence"} cannot restore deleted mail`, async () => fixture(async f => {
  const result = await f.signup();
  let entered!: () => void, resume!: () => void;
  const observed = new Promise<void>(resolve => { entered = resolve; });
  const released = new Promise<void>(resolve => { resume = resolve; });
  let sends = 0;
  const query = new Proxy(f.db.$queryRaw, { async apply(target, _receiver, args) {
    const value = await Reflect.apply(target, f.db, args);
    if (!inTransport && String(args[0]?.sql ?? "").includes('SELECT m."id" FROM "MailOutbox" m WHERE')) { entered(); await released; }
    return value;
  } });
  const db: MailDb = { $queryRaw: query, $executeRaw: f.db.$executeRaw.bind(f.db), mailOutbox: f.db.mailOutbox };
  const running = processMailBatch({ db, protection: f.policy.mail, transport: { async send() { sends++; if (inTransport) { entered(); await released; } } } });
  try {
    await observed;
    await f.service.deleteAccount(result.token, body, "delete");
    resume();
    assert.equal((await running).stale, 1);
    assert.equal(sends, inTransport ? 1 : 0);
    assert.equal(await f.db.mailOutbox.count(), 0);
    assert.equal(await f.db.accountEmailChallenge.count(), 0);
  } finally { resume(); await running; }
}));

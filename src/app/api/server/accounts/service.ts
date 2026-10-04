import "server-only";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { Prisma, type PrismaClient, type User, type AccountEmailChallenge } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { serializePublicUser } from "../auth/auth.contracts";
import { signSessionToken, verifySessionToken, type SessionPurpose } from "../auth/session";
import { enqueueMail, cancelChallengeMail, consumeMailRateLimit, type AccountRateAction } from "../mail/outbox";
import { AccountError, exactObject, normalizeEmail, parseSignup, requireIdempotencyKey, validatePasswordConfirmation, UUID_PATTERN, type VerificationState } from "./contracts";
import { readAccountPolicy, type AccountPolicy } from "./policy";
import { accountMac, emailBinding, generateResetToken, generateVerificationCode, resetDigest, safeDigestEqual, verificationDigest } from "./proof";

type Tx = Prisma.TransactionClient;
type Result<T> = { value: T } | { error: AccountError };
type SessionResult = { success: true; token: string; user: ReturnType<typeof serializePublicUser>; destination: "/admin" | "/workspace" | "/verify-email"; purpose: SessionPurpose; reused?: boolean };
export type AccountDependencies = {
  db: PrismaClient; policy?: () => AccountPolicy; now?: () => Date;
  hashPassword?: (password: string) => Promise<string>; comparePassword?: (password: string, hash: string) => Promise<boolean>;
  issueToken?: (user: User, purpose: SessionPurpose) => string;
  code?: () => string; token?: () => string; beforeCommit?: () => Promise<void>;
};
const failed = <T>(code: AccountError["code"], retry?: number): Result<T> => ({ error: new AccountError(code, retry) });

export class AccountService {
  private readonly db: PrismaClient;
  constructor(private readonly deps: AccountDependencies) { this.db = deps.db; }
  private policy() { return (this.deps.policy ?? readAccountPolicy)(); }
  private async time(tx: Tx): Promise<Date> {
    if (this.deps.now) return this.deps.now();
    return (await tx.$queryRaw<Array<{ now: Date }>>(Prisma.sql`SELECT clock_timestamp() AS now`))[0].now;
  }
  private async transaction<T>(run: (tx: Tx) => Promise<Result<T>>): Promise<T> {
    const result = await this.db.$transaction(run, { timeout: 20_000, maxWait: 20_000 });
    if ("error" in result) throw result.error;
    return result.value;
  }
  private async identityLock(tx: Tx, canonical: string) {
    await tx.$queryRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${`account-identity:${canonical}`}, 0))::text AS locked`);
  }
  private async requestLock(tx: Tx, action: string, keyMac: string) {
    await tx.$queryRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${`account-request:${action}:${keyMac}`}, 0))::text AS locked`);
  }
  private async lockedUser(tx: Tx, id: string): Promise<User | null> {
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "User" WHERE "id"=${id} FOR UPDATE`);
    return tx.user.findUnique({ where: { id } });
  }
  private async lookup(tx: Tx, canonical: string): Promise<User | null> {
    const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "User" WHERE lower(btrim("email"))=${canonical} LIMIT 2`);
    if (rows.length > 1) throw new AccountError("INVALID_CREDENTIALS");
    return rows.length ? tx.user.findUnique({ where: { id: rows[0].id } }) : null;
  }
  private eligible(policy: AccountPolicy, email: string): boolean { return !policy.testerAllowlist || policy.testerAllowlist.has(email.trim().toLowerCase()); }
  private session(user: User, purpose: SessionPurpose, reused?: boolean): SessionResult {
    const token = this.deps.issueToken ? this.deps.issueToken(user, purpose) : signSessionToken(user.id, undefined, user.credentialVersion, purpose);
    return { success: true, token, user: serializePublicUser(user), destination: purpose === "email-verification" ? "/verify-email" : user.role === "ADMIN" ? "/admin" : "/workspace", purpose, ...(reused !== undefined ? { reused } : {}) };
  }
  private async limit(tx: Tx, policy: AccountPolicy, action: AccountRateAction, subject: string, origin: string, limit: number, now: Date): Promise<boolean> {
    const start = new Date(Math.floor(now.getTime() / 3_600_000) * 3_600_000), end = new Date(start.getTime() + 3_600_000);
    let allowed = true;
    for (const [kind, value, ceiling] of [["origin", origin, limit], ["subject", subject, limit]] as const) {
      const result = await consumeMailRateLimit(tx, { subjectMac: accountMac(policy.protection, [kind, action, value]), action, windowStart: start, windowEnd: end, limit: ceiling });
      allowed = allowed && result.allowed;
    }
    return allowed;
  }
  private async globalGate(policy: AccountPolicy): Promise<boolean> {
    // A single action/key enforces the total across all workflows. Commit this
    // gate before identity/user locks, avoiding inversions between workflows.
    return this.transaction(async (tx) => {
      const now = await this.time(tx), start = new Date(Math.floor(now.getTime() / 3_600_000) * 3_600_000);
      return { value: (await consumeMailRateLimit(tx, { action: "account-global", subjectMac: accountMac(policy.protection, ["global", "all-account-requests"]), windowStart: start, windowEnd: new Date(start.getTime() + 3_600_000), limit: policy.globalRequestsPerHour })).allowed };
    });
  }
  private clock(): Prisma.Sql { return this.deps.now ? Prisma.sql`${this.deps.now()}::timestamptz` : Prisma.sql`clock_timestamp()`; }
  private async consumeChallenge(tx: Tx, challenge: AccountEmailChallenge): Promise<Date | null> {
    const clock = this.clock();
    const rows = await tx.$queryRaw<Array<{ consumedAt: Date }>>(Prisma.sql`
      WITH proof_clock AS MATERIALIZED (SELECT ${clock} AS now)
      UPDATE "AccountEmailChallenge" c SET "consumedAt"=t.now FROM proof_clock t
      WHERE c."id"=${challenge.id} AND c."purpose"=${challenge.purpose}::"AccountEmailPurpose" AND c."userId"=${challenge.userId}
        AND c."proofDigest"=${challenge.proofDigest} AND c."consumedAt" IS NULL AND c."invalidatedAt" IS NULL
        AND c."expiresAt">t.now AND c."attemptCount"<c."maxAttempts" RETURNING c."consumedAt"`);
    return rows[0]?.consumedAt ?? null;
  }
  private retry(now: Date) { return Math.max(1, Math.ceil((3_600_000 - now.getTime() % 3_600_000) / 1000)); }
  private async invalidate(tx: Tx, userId: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | undefined, now: Date) {
    const rows = await tx.accountEmailChallenge.findMany({ where: { userId, ...(purpose ? { purpose } : {}), consumedAt: null, invalidatedAt: null }, select: { id: true } });
    for (const row of rows) {
      await tx.accountEmailChallenge.update({ where: { id: row.id }, data: { invalidatedAt: now } });
      await cancelChallengeMail(tx, row.id, now);
    }
  }
  private async newVerification(tx: Tx, user: User, policy: AccountPolicy, now: Date): Promise<AccountEmailChallenge> {
    await this.invalidate(tx, user.id, "EMAIL_VERIFICATION", now);
    const id = randomUUID(), code = (this.deps.code ?? generateVerificationCode)();
    const expiresAt = new Date(now.getTime() + policy.verificationTtlMs), keyId = policy.protection.activeKeyId;
    const challenge = await tx.accountEmailChallenge.create({ data: { id, userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: emailBinding(policy.protection, keyId, user), proofDigest: verificationDigest(policy.protection, keyId, id, user, code), proofKeyId: keyId, expiresAt, maxAttempts: policy.maxCodeAttempts, createdAt: now } });
    await enqueueMail(tx, { idempotencyKey: accountMac(policy.protection, ["verification-mail", id]), recipient: user.email.trim(), content: { template: "email-verification-v1", name: user.firstName, code }, expiresAt, challengeId: id }, policy.mail, now);
    return challenge;
  }
  private state(user: User, challenge: AccountEmailChallenge | null, policy: AccountPolicy): VerificationState {
    return { success: true, status: user.emailVerifiedAt ? "VERIFIED" : "PENDING", challengeId: challenge?.id ?? null, expiresAt: challenge?.expiresAt.toISOString() ?? null,
      resendAvailableAt: challenge ? new Date(challenge.createdAt.getTime() + policy.cooldownMs).toISOString() : null, attemptsRemaining: challenge ? Math.max(0, challenge.maxAttempts - challenge.attemptCount) : 0 };
  }
  private async restricted(tx: Tx, token: string | undefined): Promise<User | null> {
    const payload = token ? verifySessionToken(token) : null;
    if (!payload || payload.purpose !== "email-verification") return null;
    const user = await this.lockedUser(tx, payload.userId);
    return user?.status === "ACTIVE" && user.credentialVersion === payload.credentialVersion ? user : null;
  }

  async signup(input: unknown, key: string, origin: string): Promise<SessionResult> {
    const data = parseSignup(input), policy = this.policy(); key = requireIdempotencyKey(key);
    if (!this.eligible(policy, data.email)) throw new AccountError("FORBIDDEN");
    if (!await this.globalGate(policy)) throw new AccountError("RATE_LIMITED");
    const keyMac = accountMac(policy.protection, ["sign-up", key]), requestMac = accountMac(policy.protection, ["signup", data]);
    const passwordHash = await (this.deps.hashPassword ?? ((value) => bcrypt.hash(value, 10)))(data.password);
    return this.transaction(async (tx) => {
      await this.requestLock(tx, "sign-up", keyMac);
      const previous = await tx.accountRequest.findUnique({ where: { action_keyMac: { action: "sign-up", keyMac } } });
      if (previous) {
        if (!safeDigestEqual(previous.requestMac, requestMac)) return failed("IDEMPOTENCY_CONFLICT");
        const user = previous.userId ? await this.lockedUser(tx, previous.userId) : null; const now = await this.time(tx);
        if (!user || previous.expiresAt <= now || user.status !== "ACTIVE" || user.emailVerifiedAt || user.credentialVersion !== previous.credentialVersion || !(await (this.deps.comparePassword ?? bcrypt.compare)(data.password, user.password))) return failed("ACCOUNT_EXISTS");
        return { value: this.session(user, "email-verification", true) };
      }
      const before = await this.time(tx);
      if (!await this.limit(tx, policy, "sign-up", data.emailCanonical, origin, 10, before)) return failed("RATE_LIMITED", this.retry(before));
      await this.identityLock(tx, data.emailCanonical);
      if (await this.lookup(tx, data.emailCanonical)) return failed("ACCOUNT_EXISTS");
      const now = await this.time(tx);
      if (!await this.limit(tx, policy, "email-verification", data.emailCanonical, origin, policy.verificationSendsPerHour, now)) return failed("RATE_LIMITED", this.retry(now));
      const user = await tx.user.create({ data: { firstName: data.firstName, lastName: data.lastName, email: data.email, emailCanonical: data.emailCanonical, password: passwordHash, status: "ACTIVE", verificationRequired: true } });
      const challenge = await this.newVerification(tx, user, policy, now);
      await tx.accountRequest.create({ data: { action: "sign-up", keyMac, requestMac, userId: user.id, challengeId: challenge.id, credentialVersion: user.credentialVersion, createdAt: now, expiresAt: new Date(now.getTime() + 86_400_000) } });
      await this.deps.beforeCommit?.();
      return { value: this.session(user, "email-verification", false) };
    });
  }

  async login(input: { email: string; password: string }, origin: string): Promise<SessionResult> {
    const canonical = normalizeEmail(input.email).canonical;
    const policy = this.policy();
    if (!await this.globalGate(policy)) throw new AccountError("RATE_LIMITED");
    const allowed = await this.transaction(async (tx) => { const now = await this.time(tx); return { value: await this.limit(tx, policy, "sign-in", canonical, origin, 20, now) }; });
    if (!allowed) throw new AccountError("RATE_LIMITED");
    const candidate = await this.db.$transaction((tx) => this.lookup(tx, canonical));
    // Real bcrypt work on misses limits trivial timing differences; never validate new-password policy on login.
    const hash = candidate?.password ?? "$2b$10$qZxvHsufaxchSC31rkxy1eDzgNg21RYWxwr06TY.U/TmoEbD2KMHe";
    const matched = await (this.deps.comparePassword ?? bcrypt.compare)(input.password, hash);
    if (!candidate || !matched || candidate.status !== "ACTIVE") throw new AccountError("INVALID_CREDENTIALS");
    return this.transaction(async (tx) => {
      const user = await this.lockedUser(tx, candidate.id);
      if (!user || user.status !== "ACTIVE" || user.password !== candidate.password || user.credentialVersion !== candidate.credentialVersion) return failed("INVALID_CREDENTIALS");
      const purpose = user.verificationRequired && !user.emailVerifiedAt ? "email-verification" : "session";
      if (purpose === "email-verification") {
        if (!this.eligible(policy, user.email)) return failed("INVALID_CREDENTIALS");
        const latest = await tx.accountEmailChallenge.findFirst({ where: { userId: user.id, purpose: "EMAIL_VERIFICATION", consumedAt: null, invalidatedAt: null }, orderBy: { createdAt: "desc" } });
        // First login of an internally-created account initializes its challenge.
        if (!latest) {
          const now = await this.time(tx);
          if (!await this.limit(tx, policy, "email-verification", canonical, origin, policy.verificationSendsPerHour, now)) return failed("RATE_LIMITED", this.retry(now));
          await this.newVerification(tx, user, policy, now);
        }
      }
      return { value: this.session(user, purpose) };
    });
  }

  async verificationState(token: string | undefined): Promise<VerificationState> {
    const policy = this.policy();
    return this.transaction(async (tx) => {
      const user = await this.restricted(tx, token); if (!user) return failed("UNAUTHENTICATED");
      const challenge = await tx.accountEmailChallenge.findFirst({ where: { userId: user.id, purpose: "EMAIL_VERIFICATION", consumedAt: null, invalidatedAt: null }, orderBy: { createdAt: "desc" } });
      return { value: this.state(user, challenge, policy) };
    });
  }

  async resend(token: string | undefined, input: unknown, key: string, origin: string): Promise<VerificationState> {
    exactObject(input, []); key = requireIdempotencyKey(key); const policy = this.policy();
    if (!await this.globalGate(policy)) throw new AccountError("RATE_LIMITED");
    return this.transaction(async (tx) => {
      const user = await this.restricted(tx, token); if (!user) return failed("UNAUTHENTICATED");
      if (user.emailVerifiedAt) return { value: this.state(user, null, policy) };
      const keyMac = accountMac(policy.protection, ["verification-resend", user.id, key]), requestMac = accountMac(policy.protection, ["resend", user.id, user.credentialVersion]);
      // User lock serializes this scope; no inverse idempotency/user lock order.
      const previous = await tx.accountRequest.findUnique({ where: { action_keyMac: { action: "verification-resend", keyMac } } });
      const now = await this.time(tx);
      if (previous) {
        if (!safeDigestEqual(previous.requestMac, requestMac) || previous.expiresAt <= now) return failed("IDEMPOTENCY_CONFLICT");
        const challenge = previous.challengeId ? await tx.accountEmailChallenge.findUnique({ where: { id: previous.challengeId } }) : null;
        return { value: this.state(user, challenge, policy) };
      }
      const latest = await tx.accountEmailChallenge.findFirst({ where: { userId: user.id, purpose: "EMAIL_VERIFICATION" }, orderBy: [{ createdAt: "desc" }, { id: "desc" }] });
      if (latest && latest.createdAt.getTime() + policy.cooldownMs > now.getTime()) return failed("RATE_LIMITED", Math.ceil((latest.createdAt.getTime() + policy.cooldownMs - now.getTime()) / 1000));
      if (!this.eligible(policy, user.email)) return failed("FORBIDDEN");
      if (!await this.limit(tx, policy, "email-verification", user.email.trim().toLowerCase(), origin, policy.verificationSendsPerHour, now)) return failed("RATE_LIMITED", this.retry(now));
      const challenge = await this.newVerification(tx, user, policy, now);
      await tx.accountRequest.create({ data: { action: "verification-resend", keyMac, requestMac, userId: user.id, challengeId: challenge.id, credentialVersion: user.credentialVersion, createdAt: now, expiresAt: new Date(now.getTime() + 86_400_000) } });
      await this.deps.beforeCommit?.();
      return { value: this.state(user, challenge, policy) };
    });
  }

  async confirmVerification(token: string | undefined, input: unknown, origin: string): Promise<SessionResult> {
    const body = exactObject(input, ["challengeId", "code"]);
    if (typeof body.challengeId !== "string" || !UUID_PATTERN.test(body.challengeId) || typeof body.code !== "string" || !/^[0-9]{6}$/.test(body.code)) throw new AccountError("INVALID_REQUEST");
    const policy = this.policy();
    if (!await this.globalGate(policy)) throw new AccountError("RATE_LIMITED");
    return this.transaction(async (tx) => {
      const user = await this.restricted(tx, token); if (!user) return failed("UNAUTHENTICATED");
      const now = await this.time(tx);
      if (!await this.limit(tx, policy, "verification-confirm", user.id, origin, 30, now)) return failed("RATE_LIMITED", this.retry(now));
      const challenge = await tx.accountEmailChallenge.findUnique({ where: { id: body.challengeId as string } });
      if (!challenge || challenge.userId !== user.id || challenge.purpose !== "EMAIL_VERIFICATION" || challenge.consumedAt || challenge.invalidatedAt || challenge.expiresAt <= now || challenge.attemptCount >= challenge.maxAttempts || user.emailVerifiedAt) return failed("INVALID_PROOF");
      let valid = false;
      try { valid = safeDigestEqual(challenge.emailBindingMac, emailBinding(policy.protection, challenge.proofKeyId, user)) && safeDigestEqual(challenge.proofDigest, verificationDigest(policy.protection, challenge.proofKeyId, challenge.id, user, body.code as string)); } catch { valid = false; }
      if (!valid) {
        const clock = this.clock();
        const changed = await tx.$queryRaw<Array<{ invalidatedAt: Date | null }>>(Prisma.sql`
          WITH proof_clock AS MATERIALIZED (SELECT ${clock} AS now)
          UPDATE "AccountEmailChallenge" c SET "attemptCount"=c."attemptCount"+1,
            "invalidatedAt"=CASE WHEN c."attemptCount"+1>=c."maxAttempts" THEN t.now ELSE NULL END FROM proof_clock t
          WHERE c."id"=${challenge.id} AND c."consumedAt" IS NULL AND c."invalidatedAt" IS NULL
            AND c."expiresAt">t.now AND c."attemptCount"<c."maxAttempts" RETURNING c."invalidatedAt"`);
        if (changed[0]?.invalidatedAt) await cancelChallengeMail(tx, challenge.id, changed[0].invalidatedAt);
        // Return rather than throw: the counter must survive the public error.
        return failed("INVALID_PROOF");
      }
      const consumedAt = await this.consumeChallenge(tx, challenge);
      if (!consumedAt) return failed("INVALID_PROOF");
      await cancelChallengeMail(tx, challenge.id, consumedAt);
      const verified = await tx.user.update({ where: { id: user.id }, data: { emailVerifiedAt: consumedAt } });
      await this.deps.beforeCommit?.();
      return { value: this.session(verified, "session") };
    });
  }

  async requestReset(input: unknown, key: string, origin: string): Promise<void> {
    const body = exactObject(input, ["email"]), canonical = normalizeEmail(body.email).canonical;
    key = requireIdempotencyKey(key); const policy = this.policy();
    if (!await this.globalGate(policy)) return; // Neutral denial without identity/receipt writes.
    const keyMac = accountMac(policy.protection, ["password-reset", canonical, key]), requestMac = accountMac(policy.protection, ["password-reset", canonical]);
    await this.transaction(async (tx): Promise<Result<void>> => {
      await this.requestLock(tx, "password-reset", keyMac);
      const previous = await tx.accountRequest.findUnique({ where: { action_keyMac: { action: "password-reset", keyMac } } });
      if (previous) return { value: undefined }; // No new mail or invalidation on retry.
      const before = await this.time(tx);
      if (!await this.limit(tx, policy, "password-reset", canonical, origin, policy.resetRequestsPerHour, before)) return { value: undefined };
      await this.identityLock(tx, canonical);
      const candidate = await this.lookup(tx, canonical), user = candidate ? await this.lockedUser(tx, candidate.id) : null;
      const now = await this.time(tx); let challengeId: string | undefined;
      if (user?.status === "ACTIVE" && this.eligible(policy, user.email)) {
        await this.invalidate(tx, user.id, "PASSWORD_RESET", now);
        const id = randomUUID(), token = (this.deps.token ?? generateResetToken)(), keyId = policy.protection.activeKeyId;
        const expiresAt = new Date(now.getTime() + policy.resetTtlMs);
        await tx.accountEmailChallenge.create({ data: { id, userId: user.id, purpose: "PASSWORD_RESET", emailBindingMac: emailBinding(policy.protection, keyId, user), proofDigest: resetDigest(policy.protection, keyId, token), proofKeyId: keyId, expiresAt, maxAttempts: 5, createdAt: now } });
        await enqueueMail(tx, { idempotencyKey: accountMac(policy.protection, ["reset-mail", id]), recipient: user.email.trim(), content: { template: "password-reset-v1", name: user.firstName, token }, expiresAt, challengeId: id }, policy.mail, now);
        challengeId = id;
      }
      await tx.accountRequest.create({ data: { action: "password-reset", keyMac, requestMac, userId: user?.id, challengeId, credentialVersion: user?.credentialVersion, createdAt: now, expiresAt: new Date(now.getTime() + 86_400_000) } });
      await this.deps.beforeCommit?.();
      return { value: undefined };
    });
  }

  private async passwordChanged(tx: Tx, user: User, hash: string, policy: AccountPolicy, now: Date) {
    const updated = await tx.user.update({ where: { id: user.id }, data: { password: hash, credentialVersion: { increment: 1 } } });
    await this.invalidate(tx, user.id, undefined, now);
    await enqueueMail(tx, { idempotencyKey: accountMac(policy.protection, ["password-changed", user.id, updated.credentialVersion]), recipient: user.email.trim(), content: { template: "password-changed-v1", name: user.firstName }, expiresAt: new Date(now.getTime() + 86_400_000) }, policy.mail, now);
    await this.deps.beforeCommit?.();
  }

  async confirmReset(input: unknown, origin: string): Promise<void> {
    const body = exactObject(input, ["token", "newPassword", "confirmPassword"]);
    validatePasswordConfirmation(body.newPassword, body.confirmPassword);
    if (typeof body.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(body.token)) throw new AccountError("INVALID_PROOF");
    const policy = this.policy(), token = body.token;
    if (!await this.globalGate(policy)) throw new AccountError("INVALID_PROOF");
    const digests = [...policy.protection.keys].map(([keyId]) => resetDigest(policy.protection, keyId, token));
    // Cheap durable limiter before the expensive bcrypt operation.
    const allowed = await this.transaction(async (tx) => { const now = await this.time(tx); return { value: await this.limit(tx, policy, "reset-confirm", accountMac(policy.protection, token), origin, 20, now) }; });
    if (!allowed) throw new AccountError("INVALID_PROOF");
    const candidate = await this.db.accountEmailChallenge.findFirst({ where: { purpose: "PASSWORD_RESET", proofDigest: { in: digests } } });
    if (!candidate) throw new AccountError("INVALID_PROOF");
    const hash = await (this.deps.hashPassword ?? ((value) => bcrypt.hash(value, 10)))(body.newPassword);
    await this.transaction(async (tx): Promise<Result<void>> => {
      const user = await this.lockedUser(tx, candidate.userId), now = await this.time(tx);
      const challenge = await tx.accountEmailChallenge.findUnique({ where: { id: candidate.id } });
      if (!user || user.status !== "ACTIVE" || !this.eligible(policy, user.email) || !challenge || challenge.purpose !== "PASSWORD_RESET" || challenge.consumedAt || challenge.invalidatedAt || challenge.expiresAt <= now || !safeDigestEqual(challenge.emailBindingMac, emailBinding(policy.protection, challenge.proofKeyId, user)) || !safeDigestEqual(challenge.proofDigest, resetDigest(policy.protection, challenge.proofKeyId, token))) return failed("INVALID_PROOF");
      const consumedAt = await this.consumeChallenge(tx, challenge);
      if (!consumedAt) return failed("INVALID_PROOF");
      await cancelChallengeMail(tx, challenge.id, consumedAt);
      await this.passwordChanged(tx, user, hash, policy, consumedAt);
      return { value: undefined };
    });
  }

  async changePassword(userId: string, input: unknown, origin: string): Promise<void> {
    const body = exactObject(input, ["currentPassword", "newPassword", "confirmPassword"]);
    validatePasswordConfirmation(body.newPassword, body.confirmPassword);
    if (typeof body.currentPassword !== "string" || !body.currentPassword || body.currentPassword.length > 4096) throw new AccountError("INVALID_REQUEST");
    const policy = this.policy();
    if (!await this.globalGate(policy)) throw new AccountError("RATE_LIMITED");
    const allowed = await this.transaction(async (tx) => { const now = await this.time(tx); return { value: await this.limit(tx, policy, "change-password", userId, origin, 10, now) }; });
    if (!allowed) throw new AccountError("RATE_LIMITED");
    const candidate = await this.db.user.findUnique({ where: { id: userId } });
    if (!candidate || candidate.status !== "ACTIVE" || (candidate.verificationRequired && !candidate.emailVerifiedAt) || !(await (this.deps.comparePassword ?? bcrypt.compare)(body.currentPassword, candidate.password))) throw new AccountError("INVALID_CREDENTIALS");
    const hash = await (this.deps.hashPassword ?? ((value) => bcrypt.hash(value, 10)))(body.newPassword);
    await this.transaction(async (tx): Promise<Result<void>> => {
      const user = await this.lockedUser(tx, userId), now = await this.time(tx);
      if (!user || user.status !== "ACTIVE" || user.password !== candidate.password || user.credentialVersion !== candidate.credentialVersion || (user.verificationRequired && !user.emailVerifiedAt)) return failed("UNAUTHENTICATED");
      await this.passwordChanged(tx, user, hash, policy, now);
      return { value: undefined };
    });
  }
}

export const accounts = new AccountService({ db: prisma });

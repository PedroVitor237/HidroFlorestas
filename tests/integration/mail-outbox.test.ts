import assert from "node:assert/strict";
import { test } from "node:test";
import { randomBytes, randomUUID } from "node:crypto";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { enqueueMail, cancelChallengeMail, consumeMailRateLimit } from "../../src/app/api/server/mail/outbox";
import { processMailBatch, claimMailBatch, maintainMailQueue, type MailDb, type MailWorkerDependencies } from "../../src/app/api/server/mail/worker";
import { MAIL_POLICY, MailError, type EnqueueMailInput } from "../../src/app/api/server/mail/contracts";
import { decryptMail, type MailProtection } from "../../src/app/api/server/mail/crypto";
import type { PrismaClient } from "../../src/generated/prisma";

const initial = new Date("2030-01-01T12:00:00.000Z");
const protection = (): MailProtection => ({ keys: new Map([["test", randomBytes(32)]]), activeKeyId: "test", idempotencyKey: randomBytes(32), publicUrl: "https://app.example.invalid" });
const input = (extra: Partial<EnqueueMailInput> = {}): EnqueueMailInput => ({ idempotencyKey: randomUUID().replaceAll("-", ""), recipient: "synthetic@mail.test.invalid", content: { template: "email-verification-v1", name: "Fixture", code: "000042" }, expiresAt: new Date(initial.getTime() + 3_600_000), ...extra });
const successful = { async send() {} };
function barrier() { let release!: () => void; const promise = new Promise<void>((resolve) => { release = resolve; }); return { promise, release }; }
async function withDatabase(run: (db: PrismaClient) => Promise<void>) {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => { await setupIHFRDiagnosisFixtures(client); await run(db); });
}
const enqueue = (db: PrismaClient, value: EnqueueMailInput, keys: MailProtection) => db.$transaction((tx) => enqueueMail(tx, value, keys, initial));
const deps = (db: PrismaClient, keys: MailProtection, overrides: Partial<MailWorkerDependencies> = {}): MailWorkerDependencies => ({ db, protection: keys, transport: successful, now: () => initial, jitter: () => 0, ...overrides });

// Execute real PostgreSQL first, then delay delivery of exactly one real result.
function delayQueryResult(db: PrismaClient, matches: (sql: string) => boolean) {
  const observed = barrier(), resume = barrier(); let delayed = false;
  const query = new Proxy(db.$queryRaw, { async apply(target, _this, args) {
    const result = await Reflect.apply(target, db, args);
    if (!delayed && matches(String(args[0]?.sql ?? ""))) {
      delayed = true; observed.release(); await resume.promise;
    }
    return result;
  } });
  const guardedDb: MailDb = { $queryRaw: query, $executeRaw: db.$executeRaw.bind(db), mailOutbox: db.mailOutbox };
  return { db: guardedDb, observed, resume };
}

for (const recovered of [false, true]) test(`R1 delayed pre-send result past lease${recovered ? " after another worker SENT" : " remains recoverable"}: old worker never starts SMTP`, async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('SELECT m."id" FROM "MailOutbox" m WHERE'));
    const { id } = await enqueue(db, input(), keys);
    let time = initial, oldSends = 0, newSends = 0;
    const old = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, transport: { async send() { oldSends++; } } }));
    try {
      await delayed.observed.promise;
      time = new Date(initial.getTime() + MAIL_POLICY.leaseMs + 1);
      if (recovered) {
        const current = await processMailBatch(deps(db, keys, { now: () => time, transport: { async send() { newSends++; } } }));
        assert.equal(current.recoveredLeases, 1); assert.equal(current.accepted, 1);
      }
      delayed.resume.release();
      assert.equal((await old).stale, 1);
      assert.equal(oldSends, 0, "a stale PostgreSQL result must not authorize a new SMTP effect");
      if (!recovered) {
        assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "PROCESSING");
        assert.equal((await processMailBatch(deps(db, keys, { now: () => time, transport: { async send() { newSends++; } } }))).accepted, 1);
      }
      const after = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
      assert.equal(newSends, 1); assert.equal(after.status, "SENT"); assert.equal(after.attempts, 2);
    } finally { delayed.resume.release(); await old; }
  });
});

test("R1 successful final fence response delayed past lease cannot start SMTP after recovery", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('RETURNING m."leaseUntil"'));
    const { id } = await enqueue(db, input(), keys);
    let time = initial, oldSends = 0;
    const old = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, transport: { async send() { oldSends++; } } }));
    try {
      await delayed.observed.promise;
      time = new Date(initial.getTime() + MAIL_POLICY.leaseMs + 1);
      const current = await processMailBatch(deps(db, keys, { now: () => time }));
      assert.equal(current.accepted, 1); assert.equal(current.recoveredLeases, 1);
      delayed.resume.release(); assert.equal((await old).stale, 1); assert.equal(oldSends, 0);
      assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "SENT");
    } finally { delayed.resume.release(); await old; }
  });
});

for (const finalFence of [false, true]) test(`R1 near-end lease refuses SMTP after delayed ${finalFence ? "final fence" : "early read"} and preserves finite recovery`, async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes(finalFence ? 'RETURNING m."leaseUntil"' : 'SELECT m."id" FROM "MailOutbox" m WHERE'));
    const { id } = await enqueue(db, input(), keys);
    let time = initial, sends = 0;
    const old = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, transport: { async send() { sends++; } } }));
    try {
      await delayed.observed.promise;
      time = new Date(initial.getTime() + MAIL_POLICY.leaseMs - MAIL_POLICY.smtpDeadlineMs - MAIL_POLICY.leaseSafetyMs + 1);
      delayed.resume.release(); assert.equal((await old).stale, 1); assert.equal(sends, 0);
      const refused = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
      assert.equal(refused.status, "PROCESSING"); assert.equal(refused.attempts, 1);
      assert.equal(refused.leaseUntil?.getTime(), initial.getTime() + MAIL_POLICY.leaseMs);
      assert.equal(refused.expiresAt.getTime(), input().expiresAt.getTime());
      time = new Date(refused.leaseUntil!.getTime() + 1);
      assert.equal((await processMailBatch(deps(db, keys, { now: () => time }))).accepted, 1);
      assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).attempts, 2);
    } finally { delayed.resume.release(); await old; }
  });
});

for (const state of ["cancel", "invalidate", "consume"] as const) test(`R1 ${state} challenge after early read but before final fence prevents SMTP`, async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('SELECT m."id" FROM "MailOutbox" m WHERE'));
    const user = await db.user.findFirstOrThrow();
    const challenge = await db.accountEmailChallenge.create({ data: { userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: "a".repeat(64), proofDigest: "b".repeat(64), proofKeyId: "test", maxAttempts: 5, createdAt: initial, expiresAt: input().expiresAt } });
    const { id } = await enqueue(db, input({ challengeId: challenge.id }), keys);
    let sends = 0;
    const running = processMailBatch(deps(db, keys, { db: delayed.db, transport: { async send() { sends++; } } }));
    try {
      await delayed.observed.promise;
      await db.$transaction(async (tx) => {
        await tx.accountEmailChallenge.update({ where: { id: challenge.id }, data: state === "consume" ? { consumedAt: initial } : { invalidatedAt: initial } });
        if (state === "cancel") await cancelChallengeMail(tx, challenge.id, initial);
      });
      delayed.resume.release(); assert.equal((await running).stale, 1); assert.equal(sends, 0);
      await maintainMailQueue(db, initial);
      const after = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
      assert.equal(after.status, "CANCELLED"); assert.equal(after.encryptedPayload, null);
    } finally { delayed.resume.release(); await running; }
  });
});

test("R1 valid final fence passes operational deadline separately from shorter challenge validity", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('SELECT m."id" FROM "MailOutbox" m WHERE'));
    const user = await db.user.findFirstOrThrow();
    const proofExpiry = new Date(initial.getTime() + 75_000);
    const challenge = await db.accountEmailChallenge.create({ data: { userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: "a".repeat(64), proofDigest: "b".repeat(64), proofKeyId: "test", maxAttempts: 5, createdAt: initial, expiresAt: input().expiresAt } });
    const { id } = await enqueue(db, input({ challengeId: challenge.id }), keys);
    // Preserve enqueue's validity invariant; independently exercise a subsequently shortened challenge.
    await db.accountEmailChallenge.update({ where: { id: challenge.id }, data: { expiresAt: proofExpiry } });
    let time = initial, sends = 0;
    const running = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, monotonicNow: () => 0, transport: { async send(value) {
      sends++;
      assert.equal(value.expiresAt.getTime(), proofExpiry.getTime());
      assert.equal(value.deadlineAt.getTime(), proofExpiry.getTime());
      assert.ok(value.deadlineAt.getTime() <= initial.getTime() + MAIL_POLICY.leaseMs - MAIL_POLICY.leaseSafetyMs);
      assert.equal(value.expiresAt.getTime(), value.deadlineAt.getTime());
      assert.match(value.message.text, /2030-01-01T12:01:15.000Z/);
    } } }));
    try {
      await delayed.observed.promise;
      time = new Date(initial.getTime() + 72_000); // 18s remains, including the conservative DB round-trip cost.
      delayed.resume.release(); assert.equal((await running).accepted, 1); assert.equal(sends, 1);
      const row = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
      assert.equal(row.status, "SENT"); assert.equal(row.expiresAt.getTime(), input().expiresAt.getTime());
    } finally { delayed.resume.release(); await running; }
  });
});

test("R1 production database clock fence permits an unexpired real-time claim", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), now = new Date();
    const { id } = await db.$transaction((tx) => enqueueMail(tx, input({ expiresAt: new Date(now.getTime() + 60_000) }), keys, now));
    let sends = 0;
    assert.equal((await processMailBatch({ db, protection: keys, transport: { async send(value) {
      sends++; assert.ok(value.deadlineAt > new Date()); assert.ok(value.deadlineAt < value.expiresAt);
    } } })).accepted, 1);
    assert.equal(sends, 1); assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "SENT");
  });
});

test("R1 monotonic elapsed time refuses delayed final fence even with application clock behind PostgreSQL", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('RETURNING m."leaseUntil"'));
    const { id } = await enqueue(db, input(), keys);
    let time = initial, monotonic = 0, sends = 0;
    const running = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, monotonicNow: () => monotonic, transport: { async send() { sends++; } } }));
    try {
      await delayed.observed.promise;
      // App wall clock lags eight seconds: it sees 17s but only 9s remains at the DB.
      monotonic = 81_000; time = new Date(initial.getTime() + 73_000);
      delayed.resume.release(); assert.equal((await running).stale, 1); assert.equal(sends, 0);
      time = new Date(initial.getTime() + MAIL_POLICY.leaseMs + 1);
      assert.equal((await processMailBatch(deps(db, keys, { now: () => time }))).accepted, 1);
      assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "SENT");
    } finally { delayed.resume.release(); await running; }
  });
});

for (const proof of ["message", "challenge"] as const) test(`R1 delayed final fence past ${proof} validity never starts SMTP`, async () => {
  await withDatabase(async (db) => {
    const keys = protection(), delayed = delayQueryResult(db, (sql) => sql.includes('RETURNING m."leaseUntil"'));
    const expiry = new Date(initial.getTime() + 10_000);
    const user = await db.user.findFirstOrThrow();
    const challenge = proof === "challenge" ? await db.accountEmailChallenge.create({ data: { userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: "a".repeat(64), proofDigest: "b".repeat(64), proofKeyId: "test", maxAttempts: 5, createdAt: initial, expiresAt: input().expiresAt } }) : undefined;
    const { id } = await enqueue(db, input({ expiresAt: proof === "message" ? expiry : input().expiresAt, ...(challenge ? { challengeId: challenge.id } : {}) }), keys);
    if (challenge) await db.accountEmailChallenge.update({ where: { id: challenge.id }, data: { expiresAt: expiry } });
    let time = initial, sends = 0;
    const running = processMailBatch(deps(db, keys, { db: delayed.db, now: () => time, transport: { async send() { sends++; } } }));
    try {
      await delayed.observed.promise; time = new Date(expiry.getTime() + 1);
      delayed.resume.release(); assert.equal((await running).stale, 1); assert.equal(sends, 0);
      await maintainMailQueue(db, time);
      assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, proof === "message" ? "EXPIRED" : "CANCELLED");
    } finally { delayed.resume.release(); await running; }
  });
});

test("R1 database failure at final fence preserves durable payload and recovery without SMTP", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), { id } = await enqueue(db, input(), keys);
    let sends = 0;
    const query = new Proxy(db.$queryRaw, { apply(target, _this, args) {
      if (String(args[0]?.sql ?? "").includes('RETURNING m."leaseUntil"')) return Promise.reject(new Error("synthetic final fence DB outage"));
      return Reflect.apply(target, db, args);
    } });
    await assert.rejects(processMailBatch(deps(db, keys, { db: { $queryRaw: query, $executeRaw: db.$executeRaw.bind(db), mailOutbox: db.mailOutbox }, transport: { async send() { sends++; } } })), /CONNECTION/);
    const row = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
    assert.equal(sends, 0); assert.equal(row.status, "PROCESSING"); assert.ok(row.encryptedPayload); assert.equal(row.lastError, null);
    const recovered = await processMailBatch(deps(db, keys, { now: () => new Date(row.leaseUntil!.getTime() + 1) }));
    assert.equal(recovered.accepted, 1); assert.equal(recovered.recoveredLeases, 1);
  });
});

test("MAIL-FR-003 producer+enqueue commit/rollback; confidential durable idempotency and divergence", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), value = input(), id = randomUUID();
    await assert.rejects(db.$transaction(async (tx) => {
      await tx.user.create({ data: { id, email: "rollback@mail.test.invalid", firstName: "Fixture", lastName: "Only", password: "synthetic", status: "ACTIVE" } });
      await enqueueMail(tx, value, keys, initial); throw new Error("producer failed");
    }));
    assert.equal(await db.user.count({ where: { id } }), 0); assert.equal(await db.mailOutbox.count(), 0);
    const first = await db.$transaction(async (tx) => {
      await tx.user.create({ data: { id, email: "commit@mail.test.invalid", firstName: "Fixture", lastName: "Only", password: "synthetic", status: "ACTIVE" } });
      return enqueueMail(tx, value, keys, initial);
    });
    assert.equal(await db.user.count({ where: { id } }), 1);
    assert.deepEqual(await enqueue(db, value, keys), { id: first.id, reused: true });
    assert.deepEqual(await db.$transaction((tx) => enqueueMail(tx, value, keys, new Date(value.expiresAt.getTime() + 1))), { id: first.id, reused: true });
    await assert.rejects(enqueue(db, { ...value, content: { template: "email-verification-v1", name: "Fixture", code: "000043" } }, keys), /IDEMPOTENCY_CONFLICT/);
    const row = await db.mailOutbox.findUniqueOrThrow({ where: { id: first.id } });
    assert.doesNotMatch(JSON.stringify(row), /synthetic@mail|000042|Fixture/);
    assert.equal((decryptMail(row.encryptedPayload, row.id, row.template, keys) as { recipient: string }).recipient, value.recipient);
    await processMailBatch(deps(db, keys));
    assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id: first.id } })).encryptedPayload, null);
    assert.deepEqual(await enqueue(db, value, keys), { id: first.id, reused: true });
  });
});

test("same-key concurrent enqueue is one durable intent; shared Pg limits have one winner", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), value = input();
    const enqueued = await Promise.all([enqueue(db, value, keys), enqueue(db, value, keys)]);
    assert.equal(enqueued[0].id, enqueued[1].id); assert.equal(await db.mailOutbox.count(), 1);
    const bucket = { subjectMac: "a".repeat(64), action: "email-verification" as const, windowStart: initial, windowEnd: new Date(initial.getTime() + 3_600_000), limit: 1 };
    const limited = await Promise.all([db.$transaction((tx) => consumeMailRateLimit(tx, bucket)), db.$transaction((tx) => consumeMailRateLimit(tx, bucket))]);
    assert.equal(limited.filter((r) => r.allowed).length, 1);
    assert.equal((await db.mailRateLimitBucket.findFirstOrThrow()).count, 1);
    await assert.rejects(db.$transaction(async (tx) => { await consumeMailRateLimit(tx, { ...bucket, subjectMac: "b".repeat(64) }); throw new Error("rollback"); }));
    assert.equal(await db.mailRateLimitBucket.count(), 1);
    await maintainMailQueue(db, bucket.windowEnd); assert.equal(await db.mailRateLimitBucket.count(), 0);
  });
});

test("two workers, atomic claim, no lock across SMTP, redacted observability", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), entered = barrier(), resume = barrier(), logs: unknown[] = [];
    const { id } = await enqueue(db, input(), keys);
    let sends = 0;
    const first = processMailBatch(deps(db, keys, { log: (e) => logs.push(e), transport: { async send() { sends++; entered.release(); await resume.promise; } } }));
    await entered.promise;
    assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "PROCESSING");
    const second = await processMailBatch(deps(db, keys)); assert.equal(second.claimed, 0);
    // A write commits while SMTP is paused: no producer/claim transaction stays open.
    await db.mailOutbox.update({ where: { id }, data: { availableAt: initial } });
    resume.release(); assert.equal((await first).accepted, 1); assert.equal(sends, 1);
    const output = JSON.stringify(logs);
    assert.match(output, /mail-batch/); assert.doesNotMatch(output, /synthetic@|000042|ciphertext|encryptedPayload|password|response/);
  });
});

test("expired lease recovers with new ownership; late old result cannot overwrite", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), entered = barrier(), resume = barrier(); let time = initial;
    const { id } = await enqueue(db, input(), keys);
    const old = processMailBatch(deps(db, keys, { now: () => time, transport: { async send() { entered.release(); await resume.promise; throw new MailError("TEMPORARY"); } } }));
    await entered.promise;
    const oldToken = (await db.mailOutbox.findUniqueOrThrow({ where: { id } })).claimToken;
    time = new Date(initial.getTime() + MAIL_POLICY.leaseMs + 1);
    const current = await processMailBatch(deps(db, keys, { now: () => time }));
    assert.equal(current.recoveredLeases, 1); assert.equal(current.accepted, 1);
    const after = await db.mailOutbox.findUniqueOrThrow({ where: { id } }); assert.equal(after.attempts, 2); assert.equal(after.claimToken, null);
    resume.release(); assert.equal((await old).stale, 1);
    assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "SENT"); assert.ok(oldToken);
  });
});

test("timeout after acceptance permits duplicate attempt but keeps consistent state and same payload", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), sent: string[] = []; let time = initial;
    const { id } = await enqueue(db, input(), keys);
    const transport = { async send(message: { message: { text: string } }) { sent.push(message.message.text); if (sent.length === 1) throw new MailError("TIMEOUT"); } };
    assert.equal((await processMailBatch(deps(db, keys, { transport, now: () => time }))).retried, 1);
    const retry = await db.mailOutbox.findUniqueOrThrow({ where: { id } }); assert.equal(retry.status, "PENDING"); assert.ok(retry.encryptedPayload);
    time = retry.availableAt;
    assert.equal((await processMailBatch(deps(db, keys, { transport, now: () => time }))).accepted, 1);
    assert.equal(sent.length, 2); assert.equal(sent[0], sent[1]);
  });
});

test("provider outage retries with bounded backoff/jitter, max attempts and permanent failure", async () => {
  await withDatabase(async (db) => {
    const keys = protection(); let time = initial;
    const { id } = await enqueue(db, input(), keys);
    const worker = deps(db, keys, { now: () => time, jitter: () => 1, transport: { async send() { throw new MailError("CONNECTION"); } } });
    for (let attempt = 1; attempt <= 5; attempt++) {
      await processMailBatch(worker);
      const row = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
      assert.equal(row.attempts, attempt);
      if (attempt < 5) { assert.equal(row.status, "PENDING"); assert.equal(row.availableAt.getTime() - time.getTime(), 30_000 * 2 ** (attempt - 1) * 1.25); time = row.availableAt; }
      else { assert.equal(row.status, "DEAD"); assert.equal(row.encryptedPayload, null); }
    }
    assert.equal((await processMailBatch(worker)).claimed, 0);
    for (const failure of ["CONFIGURATION", "AUTHENTICATION", "TLS", "PERMANENT"] as const) {
      const entry = await enqueue(db, input(), keys);
      const result = await processMailBatch(deps(db, keys, { transport: { async send() { throw new MailError(failure); } } }));
      assert.equal(result.dead, 1); assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id: entry.id } })).lastError, failure);
    }
  });
});

test("expiration and invalidated challenge prevent sends; cancellation fences in-flight result", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), entered = barrier(), resume = barrier(); let sends = 0;
    const user = await db.user.findFirstOrThrow();
    const challenge = await db.accountEmailChallenge.create({ data: { userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: "a".repeat(64), proofDigest: "b".repeat(64), proofKeyId: "test", maxAttempts: 5, createdAt: initial, expiresAt: new Date(initial.getTime() + 3_600_000) } });
    const { id } = await enqueue(db, input({ challengeId: challenge.id }), keys);
    const running = processMailBatch(deps(db, keys, { transport: { async send() { sends++; entered.release(); await resume.promise; } } }));
    await entered.promise;
    await db.$transaction(async (tx) => { await tx.accountEmailChallenge.update({ where: { id: challenge.id }, data: { invalidatedAt: initial } }); await cancelChallengeMail(tx, challenge.id, initial); });
    resume.release(); assert.equal((await running).stale, 1);
    const row = await db.mailOutbox.findUniqueOrThrow({ where: { id } }); assert.equal(row.status, "CANCELLED"); assert.equal(row.encryptedPayload, null);
    await assert.rejects(enqueue(db, input({ challengeId: challenge.id }), keys), /INVALID_INPUT/);
    const expires = new Date(initial.getTime() + 10);
    await enqueue(db, input({ expiresAt: expires }), keys);
    const result = await processMailBatch(deps(db, keys, { now: () => expires, transport: { async send() { sends++; } } }));
    assert.equal(result.expired, 1); assert.equal(result.claimed, 0); assert.equal(sends, 1);
    const other = await db.accountEmailChallenge.create({ data: { userId: user.id, purpose: "EMAIL_VERIFICATION", emailBindingMac: "a".repeat(64), proofDigest: "b".repeat(64), proofKeyId: "test", maxAttempts: 5, createdAt: initial, expiresAt: new Date(initial.getTime() + 3_600_000) } });
    await enqueue(db, input({ challengeId: other.id }), keys);
    await db.accountEmailChallenge.update({ where: { id: other.id }, data: { consumedAt: initial } });
    assert.equal((await processMailBatch(deps(db, keys))).cancelled, 1);
  });
});

test("abandoned claims exhaust finite attempts; cleanup bounded/repeated and active rows preserved", async () => {
  await withDatabase(async (db) => {
    const keys = protection(); let time = initial;
    const { id } = await enqueue(db, input(), keys);
    for (let i = 0; i < 5; i++) { assert.equal((await claimMailBatch(db, time)).length, 1); time = new Date(time.getTime() + MAIL_POLICY.leaseMs + 1); }
    await maintainMailQueue(db, time); assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).status, "DEAD");
    const later = new Date(time.getTime() + MAIL_POLICY.retentionMs + 1);
    const alive = await db.$transaction((tx) => enqueueMail(tx, input({ expiresAt: new Date(later.getTime() + 60_000) }), keys, later));
    assert.equal((await maintainMailQueue(db, later)).purged, 1); assert.equal((await maintainMailQueue(db, later)).purged, 0);
    assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id: alive.id } })).status, "PENDING");
  });
});

test("enforced batch/concurrency bounds and authenticated payload failure without retries", async () => {
  await withDatabase(async (db) => {
    const keys = protection();
    await assert.rejects(claimMailBatch(db, initial, 5), /INVALID_INPUT/);
    await assert.rejects(processMailBatch(deps(db, keys, { concurrency: 3 })), /INVALID_INPUT/);
    const { id } = await enqueue(db, input(), keys);
    const row = await db.mailOutbox.findUniqueOrThrow({ where: { id } });
    await db.mailOutbox.update({ where: { id }, data: { encryptedPayload: { ...(row.encryptedPayload as object), keyId: "unknown" } } });
    assert.equal((await processMailBatch(deps(db, keys))).dead, 1);
    assert.equal((await db.mailOutbox.findUniqueOrThrow({ where: { id } })).lastError, "PAYLOAD");
  });
});

test("database failure awaits sibling SMTP before rejecting; no work escapes server response", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), sendEntered = barrier(), releaseSend = barrier(), updateFailed = barrier();
    await enqueue(db, input(), keys); await enqueue(db, input(), keys);
    let sends = 0, settled = false;
    const delegate = new Proxy(db.mailOutbox, { get(target, property) {
      if (property === "updateMany") return () => { updateFailed.release(); return Promise.reject(new Error("synthetic DB failure")); };
      return Reflect.get(target, property);
    } });
    const guardedDb = { $queryRaw: db.$queryRaw.bind(db), $executeRaw: db.$executeRaw.bind(db), mailOutbox: delegate };
    const running = processMailBatch(deps(db, keys, { db: guardedDb, transport: { async send() { sends++; if (sends === 1) { sendEntered.release(); await releaseSend.promise; } } } }));
    const assertion = assert.rejects(running, /CONNECTION/);
    void running.then(() => { settled = true; }, () => { settled = true; });
    await sendEntered.promise; await updateFailed.promise; await Promise.resolve();
    assert.equal(settled, false);
    releaseSend.release(); await assertion; assert.equal(sends, 2);
  });
});

test("four claims respect concurrency two and pre-send expiry fence after earlier wave", async () => {
  await withDatabase(async (db) => {
    const keys = protection(), wave = barrier(), releaseWave = barrier();
    let time = initial, active = 0, peak = 0, sent = 0;
    for (let i = 0; i < 4; i++) await enqueue(db, input({ expiresAt: new Date(initial.getTime() + 60_000) }), keys);
    const running = processMailBatch(deps(db, keys, { now: () => time, transport: { async send() {
      active++; peak = Math.max(peak, active); sent++;
      if (active === 2) wave.release();
      await releaseWave.promise; active--;
    } } }));
    await wave.promise;
    assert.equal(sent, 2); assert.equal(peak, 2);
    time = new Date(initial.getTime() + 60_001); releaseWave.release();
    const result = await running;
    assert.equal(result.claimed, 4); assert.equal(sent, 2); assert.equal(peak, 2); assert.equal(result.stale, 4);
    assert.equal((await maintainMailQueue(db, time)).expired, 4);
    assert.ok((await db.mailOutbox.findMany()).every((row) => row.encryptedPayload === null));
  });
});

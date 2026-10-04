import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { Prisma, type PrismaClient, type MailOutbox } from "@/generated/prisma";
import { MAIL_POLICY, MailError, type MailTransport, type ProtectedMailPayload, validateContent, validateMailbox, validatePublicUrl } from "./contracts";
import { decryptMail, type MailProtection } from "./crypto";
import { renderMail } from "./templates";
import { classifyMailFailure, retryableMailFailure } from "./transport";

export type MailDb = Pick<PrismaClient, "$queryRaw" | "$executeRaw" | "mailOutbox">;
export type MailLog = { event: "mail-result"; outboxId: string; template: string; attempt: number; result: string; failure?: string }
  | { event: "mail-batch"; claimed: number; accepted: number; retried: number; dead: number; stale: number; expired: number; cancelled: number; recoveredLeases: number; queueAgeMs: number; pending: number; purged: number };
export type MailWorkerDependencies = { db: MailDb; transport: MailTransport; protection: MailProtection; now?: () => Date; monotonicNow?: () => number; jitter?: () => number; log?: (entry: MailLog) => void; batchSize?: number; concurrency?: number };

export async function maintainMailQueue(db: MailDb, now: Date) {
  const terminated = await db.$queryRaw<Array<{ status: string }>>(Prisma.sql`
    WITH selected AS (
      SELECT m."id", CASE WHEN m."expiresAt" <= ${now} THEN 'EXPIRED'
        WHEN EXISTS (SELECT 1 FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId" AND (c."consumedAt" IS NOT NULL OR c."invalidatedAt" IS NOT NULL OR c."expiresAt" <= ${now})) THEN 'CANCELLED'
        ELSE 'DEAD' END AS terminal
      FROM "MailOutbox" m WHERE m."status" IN ('PENDING','PROCESSING') AND
        (m."expiresAt" <= ${now} OR (m."status"='PROCESSING' AND m."leaseUntil" <= ${now} AND m."attempts">=m."maxAttempts") OR
        EXISTS (SELECT 1 FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId" AND (c."consumedAt" IS NOT NULL OR c."invalidatedAt" IS NOT NULL OR c."expiresAt" <= ${now})))
      ORDER BY m."createdAt",m."id" FOR UPDATE OF m SKIP LOCKED LIMIT 100
    ) UPDATE "MailOutbox" m SET "status"=s.terminal::"MailOutboxStatus", "encryptedPayload"=NULL, "claimToken"=NULL, "leaseUntil"=NULL, "updatedAt"=${now}
      FROM selected s WHERE m."id"=s."id" RETURNING m."status"::text`);
  const purged = await db.$executeRaw(Prisma.sql`
    WITH selected AS (SELECT "id" FROM "MailOutbox" WHERE "status" IN ('SENT','DEAD','EXPIRED','CANCELLED') AND "updatedAt" < ${new Date(now.getTime() - MAIL_POLICY.retentionMs)}
      ORDER BY "updatedAt","id" FOR UPDATE SKIP LOCKED LIMIT 100)
    DELETE FROM "MailOutbox" m USING selected s WHERE m."id"=s."id"`);
  await db.$executeRaw(Prisma.sql`
    WITH selected AS (SELECT "subjectMac","action","windowStart" FROM "MailRateLimitBucket" WHERE "windowEnd" <= ${now}
      ORDER BY "windowEnd" FOR UPDATE SKIP LOCKED LIMIT 100)
    DELETE FROM "MailRateLimitBucket" b USING selected s WHERE b."subjectMac"=s."subjectMac" AND b."action"=s."action" AND b."windowStart"=s."windowStart"`);
  return { expired: terminated.filter((r) => r.status === "EXPIRED").length, cancelled: terminated.filter((r) => r.status === "CANCELLED").length, exhausted: terminated.filter((r) => r.status === "DEAD").length, purged };
}

export async function claimMailBatch(db: MailDb, now: Date, batchSize: number = MAIL_POLICY.batchSize) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAIL_POLICY.batchSize) throw new MailError("INVALID_INPUT");
  const claimToken = randomUUID();
  return db.$queryRaw<Array<MailOutbox & { recovered: boolean }>>(Prisma.sql`
    WITH selected AS (
      SELECT m."id", (m."status"='PROCESSING') AS recovered FROM "MailOutbox" m
      WHERE ((m."status"='PENDING' AND m."availableAt" <= ${now}) OR (m."status"='PROCESSING' AND m."leaseUntil" <= ${now}))
        AND m."expiresAt">${now} AND m."attempts"<m."maxAttempts"
        AND NOT EXISTS (SELECT 1 FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId" AND (c."consumedAt" IS NOT NULL OR c."invalidatedAt" IS NOT NULL OR c."expiresAt" <= ${now}))
      ORDER BY m."availableAt",m."id" FOR UPDATE OF m SKIP LOCKED LIMIT ${batchSize}
    ) UPDATE "MailOutbox" m SET "status"='PROCESSING', "claimToken"=${claimToken}, "leaseUntil"=${new Date(now.getTime() + MAIL_POLICY.leaseMs)},
      "attempts"=m."attempts"+1, "updatedAt"=${now} FROM selected s WHERE m."id"=s."id" RETURNING m.*, s.recovered`);
}

function checkedPayload(value: unknown, row: MailOutbox): ProtectedMailPayload {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).sort().join() !== "content,publicUrl,recipient") throw new MailError("PAYLOAD");
  const payload = value as ProtectedMailPayload;
  validateMailbox(payload.recipient); validateContent(payload.content); validatePublicUrl(payload.publicUrl);
  if ((row.template === "EMAIL_VERIFICATION_V1") !== (payload.content.template === "email-verification-v1")) throw new MailError("PAYLOAD");
  return payload;
}

export async function processMailBatch(deps: MailWorkerDependencies) {
  const { db, transport, protection } = deps;
  const now = deps.now ?? (() => new Date());
  const monotonicNow = deps.monotonicNow ?? (() => performance.now());
  const log = deps.log ?? (() => {});
  const batchSize = deps.batchSize ?? MAIL_POLICY.batchSize, concurrency = deps.concurrency ?? MAIL_POLICY.concurrency;
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAIL_POLICY.concurrency) throw new MailError("INVALID_INPUT");
  const maintenance = await maintainMailQueue(db, now());
  const rows = await claimMailBatch(db, now(), batchSize);
  const metrics = { claimed: rows.length, accepted: 0, retried: 0, dead: maintenance.exhausted, stale: 0, expired: maintenance.expired,
    cancelled: maintenance.cancelled, recoveredLeases: rows.filter((r) => r.recovered).length, queueAgeMs: 0, pending: 0, purged: maintenance.purged };
  let next = 0;
  async function processOne(row: MailOutbox) {
    let failure: ReturnType<typeof classifyMailFailure> | undefined;
    const before = now();
    // Early rejection only: a delayed read is never authority to start SMTP.
    const valid = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT m."id" FROM "MailOutbox" m WHERE m."id"=${row.id} AND m."status"='PROCESSING' AND m."claimToken"=${row.claimToken}
        AND m."leaseUntil">${before} AND m."expiresAt">${before}
        AND NOT EXISTS (SELECT 1 FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId" AND (c."consumedAt" IS NOT NULL OR c."invalidatedAt" IS NOT NULL OR c."expiresAt" <= ${before}))`);
    if (!valid.length) { metrics.stale++; return; }
    let payload: ProtectedMailPayload | undefined;
    try { payload = checkedPayload(decryptMail(row.encryptedPayload, row.id, row.template, protection), row); }
    catch (error) { failure = classifyMailFailure(error); }
    if (payload) {
      // Runtime uses the database clock; the explicit clock seam is for deterministic tests.
      // The UPDATE commits before SMTP and neither renews the lease nor extends proof validity.
      const clock = deps.now ? Prisma.sql`${now()}::timestamptz` : Prisma.sql`clock_timestamp()`;
      const fenceStarted = monotonicNow();
      const owned = await db.$queryRaw<Array<{ leaseUntil: Date; expiresAt: Date; fencedAt: Date }>>(Prisma.sql`
        WITH send_clock AS MATERIALIZED (SELECT ${clock} AS current_time)
        UPDATE "MailOutbox" m SET "updatedAt"=t.current_time FROM send_clock t
        WHERE m."id"=${row.id} AND m."status"='PROCESSING' AND m."claimToken"=${row.claimToken}
          AND m."leaseUntil">=t.current_time + (${MAIL_POLICY.smtpDeadlineMs + MAIL_POLICY.leaseSafetyMs} * interval '1 millisecond')
          AND m."expiresAt">t.current_time
          AND NOT EXISTS (SELECT 1 FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId"
            AND (c."consumedAt" IS NOT NULL OR c."invalidatedAt" IS NOT NULL OR c."expiresAt"<=t.current_time))
        RETURNING m."leaseUntil", LEAST(m."expiresAt", (SELECT c."expiresAt" FROM "AccountEmailChallenge" c WHERE c."id"=m."challengeId")) AS "expiresAt", t.current_time AS "fencedAt"`);
      // Even this successful UPDATE's response may be delayed beyond its lease/proof window.
      if (!owned.length) { metrics.stale++; return; }
      const message = renderMail(payload.content, owned[0].expiresAt, payload.publicUrl);
      const start = now();
      const elapsed = monotonicNow() - fenceStarted;
      // Subtract the entire round trip conservatively; a slow response or app clock behind
      // PostgreSQL cannot manufacture lease/proof time. No await follows this check.
      const leaseRemaining = Math.min(owned[0].leaseUntil.getTime() - start.getTime(), owned[0].leaseUntil.getTime() - owned[0].fencedAt.getTime() - elapsed);
      const proofRemaining = Math.min(owned[0].expiresAt.getTime() - start.getTime(), owned[0].expiresAt.getTime() - owned[0].fencedAt.getTime() - elapsed);
      if (!Number.isFinite(elapsed) || elapsed < 0 || leaseRemaining < MAIL_POLICY.smtpDeadlineMs + MAIL_POLICY.leaseSafetyMs || proofRemaining <= 0) {
        metrics.stale++; return;
      }
      const deadlineAt = new Date(start.getTime() + Math.min(MAIL_POLICY.smtpDeadlineMs, leaseRemaining - MAIL_POLICY.leaseSafetyMs, proofRemaining));
      try { await transport.send({ outboxId: row.id, recipient: payload.recipient, message, expiresAt: owned[0].expiresAt, deadlineAt }); }
      catch (error) { failure = classifyMailFailure(error); }
    }
    const finished = now();
    const baseDelay = Math.min(600_000, 30_000 * 2 ** (row.attempts - 1));
    const fraction = deps.jitter ? deps.jitter() : randomInt(0, 10_001) / 10_000;
    if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) throw new MailError("INVALID_INPUT");
    const availableAt = new Date(finished.getTime() + baseDelay * (1 + fraction * 0.25));
    const retry = !!failure && retryableMailFailure(failure) && row.attempts < row.maxAttempts && availableAt < row.expiresAt;
    const status = !failure ? "SENT" : retry ? "PENDING" : "DEAD";
    const changed = await db.mailOutbox.updateMany({ where: { id: row.id, status: "PROCESSING", claimToken: row.claimToken, leaseUntil: { gt: finished }, expiresAt: { gt: finished } }, data: {
      status, encryptedPayload: retry ? row.encryptedPayload as Prisma.InputJsonValue : Prisma.DbNull,
      claimToken: null, leaseUntil: null, lastError: failure ?? null, acceptedAt: !failure ? finished : null,
      availableAt: retry ? availableAt : row.availableAt, updatedAt: finished,
    } });
    if (!changed.count) metrics.stale++;
    else if (status === "SENT") metrics.accepted++;
    else if (retry) metrics.retried++;
    else metrics.dead++;
    log({ event: "mail-result", outboxId: row.id, template: row.template, attempt: row.attempts, result: changed.count ? status : "STALE", ...(failure ? { failure } : {}) });
  }
  const results = await Promise.allSettled(Array.from({ length: Math.min(concurrency, rows.length) }, async () => { while (next < rows.length) await processOne(rows[next++]); }));
  // A failed DB write/logger must not let another consumer's SMTP escape after the response.
  if (results.some((result) => result.status === "rejected")) throw new MailError("CONNECTION");
  const queue = await db.$queryRaw<Array<{ count: number; oldest: Date | null }>>(Prisma.sql`SELECT count(*)::int AS count, min("createdAt") AS oldest FROM "MailOutbox" WHERE "status" IN ('PENDING','PROCESSING')`);
  metrics.pending = queue[0]?.count ?? 0;
  metrics.queueAgeMs = queue[0]?.oldest ? Math.max(0, now().getTime() - queue[0].oldest.getTime()) : 0;
  log({ event: "mail-batch", ...metrics });
  return metrics;
}

import "server-only";
import { randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma";
import { MAIL_POLICY, MailError, type EnqueueMailInput, validateEnqueue } from "./contracts";
import { encryptMail, mailContentMac, type MailProtection } from "./crypto";

export async function enqueueMail(tx: Prisma.TransactionClient, input: EnqueueMailInput, protection: MailProtection, now = new Date()): Promise<{ id: string; reused: boolean }> {
  validateEnqueue(input, now, true);
  // Fixed field order gives a stable semantic commitment, independent of caller property order.
  const content = input.content.template === "email-verification-v1"
    ? { template: input.content.template, name: input.content.name, code: input.content.code }
    : input.content.template === "password-reset-v1" ? { template: input.content.template, name: input.content.name, token: input.content.token }
    : { template: input.content.template, name: input.content.name };
  const payload = { recipient: input.recipient, content, publicUrl: protection.publicUrl };
  const template = content.template === "email-verification-v1" ? "EMAIL_VERIFICATION_V1" : content.template === "password-reset-v1" ? "PASSWORD_RESET_V1" : "PASSWORD_CHANGED_V1";
  const contentMac = mailContentMac(JSON.stringify([payload, input.expiresAt.toISOString(), input.challengeId ?? null]), protection);
  // Ownership is checked separately: the historical encrypted-content MAC stays unchanged.
  const challenge = input.challengeId ? await tx.accountEmailChallenge.findUnique({ where: { id: input.challengeId } }) : null;
  if (challenge && input.accountUserId !== undefined && input.accountUserId !== challenge.userId) throw new MailError("INVALID_INPUT");
  const accountUserId = challenge?.userId ?? input.accountUserId ?? null;
  const existing = await tx.mailOutbox.findUnique({ where: { idempotencyKey: input.idempotencyKey }, select: { id: true, contentMac: true, accountUserId: true } });
  if (existing) {
    if (existing.contentMac !== contentMac || existing.accountUserId !== accountUserId) throw new MailError("IDEMPOTENCY_CONFLICT");
    return { id: existing.id, reused: true };
  }
  if (input.expiresAt <= now) throw new MailError("INVALID_INPUT");
  const id = randomUUID();
  const encrypted = encryptMail(payload, id, template, protection);
  if (input.challengeId) {
    if (template === "PASSWORD_CHANGED_V1") throw new MailError("INVALID_INPUT");
    const purpose = template === "EMAIL_VERIFICATION_V1" ? "EMAIL_VERIFICATION" : "PASSWORD_RESET";
    if (!challenge || challenge.purpose !== purpose || challenge.consumedAt || challenge.invalidatedAt || challenge.expiresAt < input.expiresAt || challenge.expiresAt <= now) throw new MailError("INVALID_INPUT");
  }
  // ON CONFLICT avoids poisoning the producer transaction with a unique violation.
  const inserted = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    INSERT INTO "MailOutbox" ("id", "idempotencyKey", "contentMac", "template", "encryptedPayload", "challengeId", "accountUserId", "availableAt", "expiresAt", "createdAt", "updatedAt")
    VALUES (${id}, ${input.idempotencyKey}, ${contentMac}, ${template}::"MailTemplate", ${JSON.stringify(encrypted)}::jsonb, ${input.challengeId ?? null}, ${accountUserId}, ${now}, ${input.expiresAt}, ${now}, ${now})
    ON CONFLICT ("idempotencyKey") DO NOTHING RETURNING "id"`);
  if (inserted.length) return { id, reused: false };
  const previous = await tx.mailOutbox.findUnique({ where: { idempotencyKey: input.idempotencyKey }, select: { id: true, contentMac: true, accountUserId: true } });
  if (!previous || previous.contentMac !== contentMac || previous.accountUserId !== accountUserId) throw new MailError("IDEMPOTENCY_CONFLICT");
  return { id: previous.id, reused: true };
}

export async function cancelChallengeMail(tx: Prisma.TransactionClient, challengeId: string, now = new Date()) {
  if (!/^[0-9a-f-]{36}$/.test(challengeId)) throw new MailError("INVALID_INPUT");
  return tx.mailOutbox.updateMany({ where: { challengeId, status: { in: ["PENDING", "PROCESSING"] } }, data: {
    status: "CANCELLED", encryptedPayload: Prisma.DbNull, claimToken: null, leaseUntil: null, updatedAt: now,
  } });
}

export type AccountRateAction = "email-verification" | "password-reset" | "sign-up" | "sign-in" | "verification-confirm" | "reset-confirm" | "change-password" | "account-global" | "delete-account";
export async function consumeMailRateLimit(tx: Prisma.TransactionClient, input: { subjectMac: string; action: AccountRateAction; windowStart: Date; windowEnd: Date; limit: number }) {
  if (!/^[0-9a-f]{64}$/.test(input.subjectMac) || !["email-verification", "password-reset", "sign-up", "sign-in", "verification-confirm", "reset-confirm", "change-password", "account-global", "delete-account"].includes(input.action) || !Number.isInteger(input.limit) || input.limit < 1 || input.limit > 10_000 || !Number.isFinite(input.windowStart.getTime()) || !Number.isFinite(input.windowEnd.getTime()) || input.windowEnd <= input.windowStart) throw new MailError("INVALID_INPUT");
  const rows = await tx.$queryRaw<Array<{ count: number }>>(Prisma.sql`
    INSERT INTO "MailRateLimitBucket" ("subjectMac", "action", "windowStart", "windowEnd", "count")
    VALUES (${input.subjectMac}, ${input.action}, ${input.windowStart}, ${input.windowEnd}, 1)
    ON CONFLICT ("subjectMac", "action", "windowStart") DO UPDATE SET "count" = "MailRateLimitBucket"."count" + 1
      WHERE "MailRateLimitBucket"."count" < ${input.limit} AND "MailRateLimitBucket"."windowEnd" = ${input.windowEnd}
    RETURNING "count"`);
  return { allowed: rows.length === 1 };
}

export const MAIL_MAX_ATTEMPTS = MAIL_POLICY.maxAttempts;

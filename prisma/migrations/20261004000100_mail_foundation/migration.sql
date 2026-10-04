-- Additive foundation only. No backfill, account gate, JWT change or producer activation.
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMPTZ(3),
  ADD COLUMN "credentialVersion" INTEGER NOT NULL DEFAULT 0,
  ADD CONSTRAINT "User_credentialVersion_nonnegative" CHECK ("credentialVersion" >= 0);

CREATE TYPE "AccountEmailPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
CREATE TYPE "MailTemplate" AS ENUM ('EMAIL_VERIFICATION_V1', 'PASSWORD_RESET_V1');
CREATE TYPE "MailOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'DEAD', 'EXPIRED', 'CANCELLED');
CREATE TYPE "MailFailureClass" AS ENUM ('CONFIGURATION', 'AUTHENTICATION', 'TLS', 'CONNECTION', 'TIMEOUT', 'TEMPORARY', 'PERMANENT', 'PAYLOAD', 'UNKNOWN');

CREATE TABLE "AccountEmailChallenge" (
  "id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL,
  "purpose" "AccountEmailPurpose" NOT NULL,
  "emailBindingMac" VARCHAR(64) NOT NULL, "proofDigest" VARCHAR(64) NOT NULL,
  "proofKeyId" VARCHAR(64) NOT NULL, "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "attemptCount" INTEGER NOT NULL DEFAULT 0, "maxAttempts" INTEGER NOT NULL,
  "consumedAt" TIMESTAMPTZ(3), "invalidatedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountEmailChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AccountEmailChallenge_bounds" CHECK ("maxAttempts" BETWEEN 1 AND 100 AND "attemptCount" BETWEEN 0 AND "maxAttempts" AND "expiresAt" > "createdAt"),
  CONSTRAINT "AccountEmailChallenge_digests" CHECK ("emailBindingMac" ~ '^[0-9a-f]{64}$' AND "proofDigest" ~ '^[0-9a-f]{64}$')
);
CREATE UNIQUE INDEX "AccountEmailChallenge_current" ON "AccountEmailChallenge" ("userId", "purpose") WHERE "consumedAt" IS NULL AND "invalidatedAt" IS NULL;
CREATE INDEX "AccountEmailChallenge_expiresAt_idx" ON "AccountEmailChallenge"("expiresAt");

CREATE TABLE "MailOutbox" (
  "id" TEXT PRIMARY KEY, "idempotencyKey" VARCHAR(128) NOT NULL UNIQUE,
  "contentMac" VARCHAR(64) NOT NULL, "template" "MailTemplate" NOT NULL,
  "encryptedPayload" JSONB, "challengeId" TEXT,
  "status" "MailOutboxStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0, "maxAttempts" INTEGER NOT NULL DEFAULT 5,
  "availableAt" TIMESTAMPTZ(3) NOT NULL, "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "claimToken" TEXT, "leaseUntil" TIMESTAMPTZ(3), "lastError" "MailFailureClass", "acceptedAt" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "MailOutbox_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "AccountEmailChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "MailOutbox_bounds" CHECK ("maxAttempts" BETWEEN 1 AND 5 AND "attempts" BETWEEN 0 AND "maxAttempts" AND "expiresAt" > "createdAt" AND "contentMac" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "MailOutbox_payload_state" CHECK (("status" IN ('PENDING','PROCESSING') AND "encryptedPayload" IS NOT NULL AND jsonb_typeof("encryptedPayload") = 'object') OR ("status" IN ('SENT','DEAD','EXPIRED','CANCELLED') AND "encryptedPayload" IS NULL)),
  CONSTRAINT "MailOutbox_claim_state" CHECK (("status" = 'PROCESSING' AND "claimToken" IS NOT NULL AND "leaseUntil" IS NOT NULL) OR ("status" <> 'PROCESSING' AND "claimToken" IS NULL AND "leaseUntil" IS NULL)),
  CONSTRAINT "MailOutbox_acceptance_state" CHECK (("status" = 'SENT') = ("acceptedAt" IS NOT NULL))
);
CREATE INDEX "MailOutbox_status_availableAt_idx" ON "MailOutbox"("status", "availableAt");
CREATE INDEX "MailOutbox_leaseUntil_idx" ON "MailOutbox"("leaseUntil");
CREATE INDEX "MailOutbox_expiresAt_idx" ON "MailOutbox"("expiresAt");
CREATE INDEX "MailOutbox_challengeId_idx" ON "MailOutbox"("challengeId");

CREATE TABLE "MailRateLimitBucket" (
  "subjectMac" VARCHAR(64) NOT NULL, "action" VARCHAR(64) NOT NULL,
  "windowStart" TIMESTAMPTZ(3) NOT NULL, "windowEnd" TIMESTAMPTZ(3) NOT NULL, "count" INTEGER NOT NULL,
  PRIMARY KEY ("subjectMac", "action", "windowStart"),
  CONSTRAINT "MailRateLimitBucket_bounds" CHECK ("count" >= 0 AND "windowEnd" > "windowStart" AND "subjectMac" ~ '^[0-9a-f]{64}$' AND "action" IN ('email-verification', 'password-reset'))
);
CREATE INDEX "MailRateLimitBucket_windowEnd_idx" ON "MailRateLimitBucket"("windowEnd");

-- Additive phase 2. Preserve factual email and verification timestamps.
-- Abort on ambiguity; never merge accounts or invent ownership.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "User" GROUP BY lower(btrim("email")) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Account email canonicalization collision; explicit remediation required';
  END IF;
END $$;

ALTER TABLE "User" ADD COLUMN "emailCanonical" TEXT;
ALTER TABLE "User" ADD COLUMN "verificationRequired" BOOLEAN NOT NULL DEFAULT true;
-- The compatibility cohort is exactly the rows present at migration time.
UPDATE "User" SET "emailCanonical"=lower(btrim("email")), "verificationRequired"=false;
CREATE UNIQUE INDEX "User_emailCanonical_key" ON "User"("emailCanonical");
CREATE UNIQUE INDEX "User_email_identity_key" ON "User"(lower(btrim("email")));
ALTER TABLE "User" ADD CONSTRAINT "User_emailCanonical_matches_email"
  CHECK ("emailCanonical" IS NULL OR "emailCanonical"=lower(btrim("email")));

CREATE INDEX "AccountEmailChallenge_purpose_proofDigest_idx" ON "AccountEmailChallenge"("purpose","proofDigest");
ALTER TYPE "MailTemplate" ADD VALUE 'PASSWORD_CHANGED_V1';

CREATE TABLE "AccountRequest" (
  "action" VARCHAR(32) NOT NULL,
  "keyMac" VARCHAR(64) NOT NULL,
  "requestMac" VARCHAR(64) NOT NULL,
  "userId" TEXT,
  "challengeId" TEXT,
  "credentialVersion" INTEGER,
  "createdAt" TIMESTAMPTZ(3) NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "AccountRequest_pkey" PRIMARY KEY ("action","keyMac"),
  CONSTRAINT "AccountRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AccountRequest_commitments_check" CHECK ("keyMac" ~ '^[0-9a-f]{64}$' AND "requestMac" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "AccountRequest_validity_check" CHECK ("expiresAt">"createdAt" AND ("credentialVersion" IS NULL OR "credentialVersion">=0)),
  CONSTRAINT "AccountRequest_action_check" CHECK ("action" IN ('sign-up','verification-resend','password-reset'))
);
CREATE INDEX "AccountRequest_expiresAt_idx" ON "AccountRequest"("expiresAt");

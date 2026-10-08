BEGIN;
ALTER TABLE "MailOutbox" ADD COLUMN "accountUserId" TEXT;
ALTER TABLE "MailOutbox" ADD CONSTRAINT "MailOutbox_accountUserId_fkey"
  FOREIGN KEY ("accountUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "MailOutbox_accountUserId_idx" ON "MailOutbox"("accountUserId");
UPDATE "MailOutbox" AS m SET "accountUserId" = c."userId"
  FROM "AccountEmailChallenge" AS c WHERE m."challengeId" = c."id";
CREATE INDEX "MailOutbox_unowned_password_notices_idx" ON "MailOutbox"("id")
  WHERE "accountUserId" IS NULL AND "template" = 'PASSWORD_CHANGED_V1'
    AND "status" IN ('PENDING', 'PROCESSING');
ALTER TABLE "MailRateLimitBucket" DROP CONSTRAINT "MailRateLimitBucket_bounds";
ALTER TABLE "MailRateLimitBucket" ADD CONSTRAINT "MailRateLimitBucket_bounds"
  CHECK ("count">=0 AND "windowEnd">"windowStart" AND "subjectMac" ~ '^[0-9a-f]{64}$'
    AND "action" IN ('email-verification','password-reset','sign-up','sign-in',
    'verification-confirm','reset-confirm','change-password','account-global','delete-account'));
COMMIT;

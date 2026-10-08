-- Additive correction after phase-2 draft was exercised in the isolated setup.
-- Preserve previously applied migrations and the mail-foundation allowlist.
ALTER TABLE "MailRateLimitBucket" DROP CONSTRAINT "MailRateLimitBucket_bounds";
ALTER TABLE "MailRateLimitBucket" ADD CONSTRAINT "MailRateLimitBucket_bounds" CHECK (
  "count">=0 AND "windowEnd">"windowStart" AND "subjectMac" ~ '^[0-9a-f]{64}$'
  AND "action" IN ('email-verification','password-reset','sign-up','sign-in','verification-confirm','reset-confirm','change-password','account-global')
);

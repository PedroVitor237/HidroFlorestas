-- IMP-009 is additive. User.role is authoritative; legacy isAdmin remains only
-- for temporary storage compatibility and MUST NOT authorize operations.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "User"
    WHERE (role = 'ADMIN' AND "isAdmin" = false)
       OR (role <> 'ADMIN' AND "isAdmin" = true)
  ) THEN
    RAISE EXCEPTION 'IMP-009 preflight: contradictory role/isAdmin records require explicit correction'
      USING ERRCODE = '23514';
  END IF;
END;
$$;

ALTER TABLE "User" ADD COLUMN revision INTEGER NOT NULL DEFAULT 0;

CREATE TYPE "AdministrativeAuditAction" AS ENUM (
  'ACCOUNT_STATUS_CHANGED',
  'GLOBAL_ROLE_CHANGED'
);

CREATE TABLE "AdministrativeAuditEvent" (
  id TEXT NOT NULL PRIMARY KEY,
  "targetUserId" TEXT NOT NULL,
  "actorUserId" TEXT NOT NULL,
  action "AdministrativeAuditAction" NOT NULL,
  "beforeValue" TEXT NOT NULL,
  "afterValue" TEXT NOT NULL,
  reason VARCHAR(500) NOT NULL,
  "targetRevision" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdministrativeAuditEvent_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AdministrativeAuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AdministrativeAuditEvent_distinct_actor_target" CHECK ("actorUserId" <> "targetUserId"),
  CONSTRAINT "AdministrativeAuditEvent_changed_value" CHECK ("beforeValue" <> "afterValue"),
  CONSTRAINT "AdministrativeAuditEvent_reason_not_blank" CHECK (length(btrim(reason)) BETWEEN 1 AND 500),
  CONSTRAINT "AdministrativeAuditEvent_revision_positive" CHECK ("targetRevision" > 0),
  CONSTRAINT "AdministrativeAuditEvent_values_match_action" CHECK (
    (action = 'ACCOUNT_STATUS_CHANGED' AND "beforeValue" IN ('ACTIVE','INACTIVE','PENDING','BLOCKED') AND "afterValue" IN ('ACTIVE','INACTIVE','PENDING','BLOCKED'))
    OR
    (action = 'GLOBAL_ROLE_CHANGED' AND "beforeValue" IN ('USER','ADMIN','DEVELOPER','MODERATOR') AND "afterValue" IN ('USER','ADMIN','DEVELOPER','MODERATOR'))
  )
);

CREATE INDEX "AdministrativeAuditEvent_targetUserId_createdAt_id_idx"
  ON "AdministrativeAuditEvent"("targetUserId", "createdAt" DESC, id DESC);
CREATE INDEX "AdministrativeAuditEvent_actorUserId_createdAt_id_idx"
  ON "AdministrativeAuditEvent"("actorUserId", "createdAt" DESC, id DESC);

CREATE FUNCTION imp009_reject_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Administrative audit events are immutable' USING ERRCODE = '23514';
END;
$$;

CREATE TRIGGER imp009_audit_immutable
BEFORE UPDATE OR DELETE ON "AdministrativeAuditEvent"
FOR EACH ROW EXECUTE FUNCTION imp009_reject_audit_mutation();

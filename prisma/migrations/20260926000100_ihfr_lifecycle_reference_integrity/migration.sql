-- IMP-006: reject inconsistent operation, CURRENT and lifecycle references.
-- Existing valid rows are preserved; inconsistent rows stop this migration without backfill.
BEGIN;

ALTER TABLE "IHFRDiagnosisOperation"
  ADD CONSTRAINT "IHFRDiagnosisOperation_outcome_diagnosis_check" CHECK (
    (outcome = 'SUCCEEDED' AND "diagnosisId" IS NOT NULL)
    OR (outcome <> 'SUCCEEDED' AND "diagnosisId" IS NULL)
  );

CREATE FUNCTION imp006_validate_lifecycle_references() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME = 'IHFRDiagnosisOperation' THEN
    IF NEW."diagnosisId" IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM "ExperimentalIHFRDiagnosis" d
       WHERE d.id = NEW."diagnosisId" AND d."collectionDataId" = NEW."collectionDataId"
    ) THEN
      RAISE EXCEPTION 'IMP006_OPERATION_DIAGNOSIS_MISMATCH' USING ERRCODE='23514';
    END IF;
  ELSIF TG_TABLE_NAME = 'CurrentExperimentalIHFRDiagnosis' THEN
    IF NOT EXISTS (
      SELECT 1 FROM "IHFRDiagnosisOperation" o
       WHERE o.id = NEW."operationId"
         AND o."collectionDataId" = NEW."collectionDataId"
         AND o."diagnosisId" = NEW."diagnosisId"
         AND o."operationType" = 'CREATE_OR_REPLACE'
         AND o.outcome = 'SUCCEEDED'
    ) THEN
      RAISE EXCEPTION 'IMP006_CURRENT_OPERATION_MISMATCH' USING ERRCODE='23514';
    END IF;
  ELSIF TG_TABLE_NAME = 'IHFRDiagnosisLifecycleEvent' THEN
    IF NOT EXISTS (
      SELECT 1 FROM "IHFRDiagnosisOperation" o
       WHERE o.id = NEW."operationId"
         AND o."collectionDataId" = NEW."collectionDataId"
         AND o."actorUserId" = NEW."actorUserId"
         AND o.outcome = 'SUCCEEDED'
         AND (
           (NEW."eventType" = 'CREATED_CURRENT'
             AND o."operationType" = 'CREATE_OR_REPLACE'
             AND o."diagnosisId" = NEW."diagnosisId")
           OR (NEW."eventType" = 'SUPERSEDED'
             AND o."operationType" = 'CREATE_OR_REPLACE'
             AND o."diagnosisId" = NEW."replacementDiagnosisId"
             AND NEW."diagnosisId" <> NEW."replacementDiagnosisId")
           OR (NEW."eventType" = 'REVOKED'
             AND o."operationType" = 'REVOKE'
             AND o."diagnosisId" = NEW."diagnosisId")
         )
    ) THEN
      RAISE EXCEPTION 'IMP006_EVENT_OPERATION_MISMATCH' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER imp006_operation_reference BEFORE INSERT ON "IHFRDiagnosisOperation"
  FOR EACH ROW EXECUTE FUNCTION imp006_validate_lifecycle_references();
CREATE TRIGGER imp006_current_operation BEFORE INSERT OR UPDATE ON "CurrentExperimentalIHFRDiagnosis"
  FOR EACH ROW EXECUTE FUNCTION imp006_validate_lifecycle_references();
CREATE TRIGGER imp006_event_operation BEFORE INSERT ON "IHFRDiagnosisLifecycleEvent"
  FOR EACH ROW EXECUTE FUNCTION imp006_validate_lifecycle_references();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "IHFRDiagnosisOperation" o
    JOIN "ExperimentalIHFRDiagnosis" d ON d.id = o."diagnosisId"
    WHERE d."collectionDataId" <> o."collectionDataId"
  ) THEN
    RAISE EXCEPTION 'IMP006_EXISTING_OPERATION_DIAGNOSIS_MISMATCH' USING ERRCODE='23514';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "CurrentExperimentalIHFRDiagnosis" c
    JOIN "IHFRDiagnosisOperation" o ON o.id = c."operationId"
    WHERE o."collectionDataId" <> c."collectionDataId"
       OR o."diagnosisId" IS DISTINCT FROM c."diagnosisId"
       OR o."operationType" <> 'CREATE_OR_REPLACE'
       OR o.outcome <> 'SUCCEEDED'
  ) THEN
    RAISE EXCEPTION 'IMP006_EXISTING_CURRENT_OPERATION_MISMATCH' USING ERRCODE='23514';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "IHFRDiagnosisLifecycleEvent" e
    JOIN "IHFRDiagnosisOperation" o ON o.id = e."operationId"
    WHERE o."collectionDataId" <> e."collectionDataId"
       OR o."actorUserId" <> e."actorUserId"
       OR o.outcome <> 'SUCCEEDED'
       OR NOT (
         (e."eventType" = 'CREATED_CURRENT' AND o."operationType" = 'CREATE_OR_REPLACE' AND o."diagnosisId" = e."diagnosisId")
         OR (e."eventType" = 'SUPERSEDED' AND o."operationType" = 'CREATE_OR_REPLACE' AND o."diagnosisId" = e."replacementDiagnosisId" AND e."diagnosisId" <> e."replacementDiagnosisId")
         OR (e."eventType" = 'REVOKED' AND o."operationType" = 'REVOKE' AND o."diagnosisId" = e."diagnosisId")
       )
  ) THEN
    RAISE EXCEPTION 'IMP006_EXISTING_EVENT_OPERATION_MISMATCH' USING ERRCODE='23514';
  END IF;
END;
$$;

COMMIT;

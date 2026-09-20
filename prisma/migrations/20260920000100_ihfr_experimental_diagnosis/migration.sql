-- IMP-006: additive experimental IHFR diagnosis storage. No legacy backfill.
BEGIN;

CREATE TYPE "ExperimentalIHFRLandUseType" AS ENUM ('FOREST', 'AGROFORESTRY', 'CROPLAND', 'PASTURE', 'DEGRADED_PASTURE', 'BARE_SOIL', 'URBAN');
CREATE TYPE "IHFRDiagnosisOperationType" AS ENUM ('CREATE_OR_REPLACE', 'REVOKE');
CREATE TYPE "IHFRDiagnosisOperationOutcome" AS ENUM ('SUCCEEDED', 'INSUFFICIENT_DATA', 'INCOMPATIBLE_VERSION');
CREATE TYPE "IHFRDiagnosisLifecycleEventType" AS ENUM ('CREATED_CURRENT', 'SUPERSEDED', 'REVOKED');

CREATE TABLE "ExperimentalIHFRInputSupplement" (
  "id" TEXT NOT NULL,
  "collectionDataId" TEXT NOT NULL,
  "environmentalMeasurementSetId" TEXT NOT NULL,
  "createdByUserId" TEXT NOT NULL,
  "inputContractVersion" TEXT NOT NULL,
  "landUseType" "ExperimentalIHFRLandUseType" NOT NULL,
  "provenance" JSONB NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "confirmedAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExperimentalIHFRInputSupplement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExperimentalIHFRInputSupplement_input_version_check" CHECK ("inputContractVersion" = 'ihfr-diagnosis-input-experimental-v0.1.0'),
  CONSTRAINT "ExperimentalIHFRInputSupplement_payload_hash_check" CHECK ("payloadHash" ~ '^sha256:[0-9a-f]{64}$'),
  CONSTRAINT "ExperimentalIHFRInputSupplement_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_fkey" FOREIGN KEY ("environmentalMeasurementSetId") REFERENCES "EnvironmentalMeasurementSet"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "ExperimentalIHFRInputSupplement_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "ExperimentalIHFRInputSupplement_collectionDataId_payloadHash_key" ON "ExperimentalIHFRInputSupplement"("collectionDataId", "payloadHash");
CREATE INDEX "ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_idx" ON "ExperimentalIHFRInputSupplement"("environmentalMeasurementSetId");
CREATE INDEX "ExperimentalIHFRInputSupplement_createdByUserId_idx" ON "ExperimentalIHFRInputSupplement"("createdByUserId");

CREATE TABLE "ExperimentalIHFRDiagnosis" (
  "id" TEXT NOT NULL,
  "collectionDataId" TEXT NOT NULL,
  "environmentalMeasurementSetId" TEXT NOT NULL,
  "inputSupplementId" TEXT NOT NULL,
  "rawScore" DOUBLE PRECISION NOT NULL,
  "displayScore" DECIMAL(3,2) NOT NULL,
  "ihfrClass" "IHFRClass" NOT NULL,
  "dataQuality" "LevelBasicDefault" NOT NULL,
  "componentScores" JSONB NOT NULL,
  "decomposition" JSONB NOT NULL,
  "drivers" JSONB NOT NULL,
  "explanation" TEXT NOT NULL,
  "measurementContractVersion" TEXT NOT NULL,
  "inputContractVersion" TEXT NOT NULL,
  "mathContractVersion" TEXT NOT NULL,
  "algorithmVersion" TEXT NOT NULL,
  "contractHash" TEXT NOT NULL,
  "calculatedAt" TIMESTAMPTZ(3) NOT NULL,
  "scientificState" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExperimentalIHFRDiagnosis_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExperimentalIHFRDiagnosis_score_check" CHECK (
    "rawScore" NOT IN ('NaN'::double precision, 'Infinity'::double precision, '-Infinity'::double precision)
    AND "rawScore" >= 0
    AND "rawScore" <= 1
    AND "displayScore" >= 0
    AND "displayScore" <= 1
  ),
  CONSTRAINT "ExperimentalIHFRDiagnosis_versions_check" CHECK (
    "measurementContractVersion" = 'ihfr-measurement-v1'
    AND "inputContractVersion" = 'ihfr-diagnosis-input-experimental-v0.1.0'
    AND "mathContractVersion" = 'ihfr-math-experimental-v0.1.1'
    AND "algorithmVersion" = 'ihfr-evaluator-ts-v0.1.0'
    AND "contractHash" = 'sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89'
    AND "scientificState" = 'EXPERIMENTAL'
  ),
  CONSTRAINT "ExperimentalIHFRDiagnosis_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "ExperimentalIHFRDiagnosis_environmentalMeasurementSetId_fkey" FOREIGN KEY ("environmentalMeasurementSetId") REFERENCES "EnvironmentalMeasurementSet"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "ExperimentalIHFRDiagnosis_inputSupplementId_fkey" FOREIGN KEY ("inputSupplementId") REFERENCES "ExperimentalIHFRInputSupplement"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX "ExperimentalIHFRDiagnosis_collectionDataId_calculatedAt_idx" ON "ExperimentalIHFRDiagnosis"("collectionDataId", "calculatedAt");
CREATE INDEX "ExperimentalIHFRDiagnosis_environmentalMeasurementSetId_idx" ON "ExperimentalIHFRDiagnosis"("environmentalMeasurementSetId");
CREATE INDEX "ExperimentalIHFRDiagnosis_inputSupplementId_idx" ON "ExperimentalIHFRDiagnosis"("inputSupplementId");
CREATE INDEX "ExperimentalIHFRDiagnosis_mathContractVersion_contractHash_idx" ON "ExperimentalIHFRDiagnosis"("mathContractVersion", "contractHash");

CREATE TABLE "IHFRDiagnosisOperation" (
  "id" TEXT NOT NULL,
  "laboratoryRoomId" TEXT NOT NULL,
  "collectionAreaId" TEXT NOT NULL,
  "collectionDataId" TEXT NOT NULL,
  "actorUserId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "operationType" "IHFRDiagnosisOperationType" NOT NULL,
  "outcome" "IHFRDiagnosisOperationOutcome" NOT NULL,
  "diagnosisId" TEXT,
  "responseSnapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "IHFRDiagnosisOperation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IHFRDiagnosisOperation_key_check" CHECK ("idempotencyKey" ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'),
  CONSTRAINT "IHFRDiagnosisOperation_request_hash_check" CHECK ("requestHash" ~ '^sha256:[0-9a-f]{64}$'),
  CONSTRAINT "IHFRDiagnosisOperation_laboratoryRoomId_fkey" FOREIGN KEY ("laboratoryRoomId") REFERENCES "LaboratoryRoom"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisOperation_collectionAreaId_fkey" FOREIGN KEY ("collectionAreaId") REFERENCES "CollectionArea"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisOperation_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisOperation_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisOperation_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "ExperimentalIHFRDiagnosis"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "IHFRDiagnosisOperation_actorUserId_idempotencyKey_key" ON "IHFRDiagnosisOperation"("actorUserId", "idempotencyKey");
CREATE INDEX "IHFRDiagnosisOperation_laboratoryRoomId_collectionAreaId_collectionDataId_idx" ON "IHFRDiagnosisOperation"("laboratoryRoomId", "collectionAreaId", "collectionDataId");
CREATE INDEX "IHFRDiagnosisOperation_diagnosisId_idx" ON "IHFRDiagnosisOperation"("diagnosisId");

CREATE TABLE "CurrentExperimentalIHFRDiagnosis" (
  "collectionDataId" TEXT NOT NULL,
  "diagnosisId" TEXT NOT NULL,
  "validFrom" TIMESTAMPTZ(3) NOT NULL,
  "operationId" TEXT NOT NULL,
  CONSTRAINT "CurrentExperimentalIHFRDiagnosis_pkey" PRIMARY KEY ("collectionDataId"),
  CONSTRAINT "CurrentExperimentalIHFRDiagnosis_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "CurrentExperimentalIHFRDiagnosis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "ExperimentalIHFRDiagnosis"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "CurrentExperimentalIHFRDiagnosis_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "IHFRDiagnosisOperation"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "CurrentExperimentalIHFRDiagnosis_diagnosisId_key" ON "CurrentExperimentalIHFRDiagnosis"("diagnosisId");
CREATE UNIQUE INDEX "CurrentExperimentalIHFRDiagnosis_operationId_key" ON "CurrentExperimentalIHFRDiagnosis"("operationId");

CREATE TABLE "IHFRDiagnosisLifecycleEvent" (
  "id" TEXT NOT NULL,
  "collectionDataId" TEXT NOT NULL,
  "diagnosisId" TEXT NOT NULL,
  "eventType" "IHFRDiagnosisLifecycleEventType" NOT NULL,
  "replacementDiagnosisId" TEXT,
  "actorUserId" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "reason" TEXT,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL,
  "evidence" JSONB NOT NULL,
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_shape_check" CHECK (
    ("eventType" = 'SUPERSEDED' AND "replacementDiagnosisId" IS NOT NULL AND "reason" IS NULL)
    OR ("eventType" = 'REVOKED' AND "replacementDiagnosisId" IS NULL AND length(btrim("reason")) BETWEEN 1 AND 500)
    OR ("eventType" = 'CREATED_CURRENT' AND "replacementDiagnosisId" IS NULL AND "reason" IS NULL)
  ),
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "ExperimentalIHFRDiagnosis"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_replacementDiagnosisId_fkey" FOREIGN KEY ("replacementDiagnosisId") REFERENCES "ExperimentalIHFRDiagnosis"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "IHFRDiagnosisLifecycleEvent_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "IHFRDiagnosisOperation"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX "IHFRDiagnosisLifecycleEvent_collectionDataId_occurredAt_idx" ON "IHFRDiagnosisLifecycleEvent"("collectionDataId", "occurredAt");
CREATE INDEX "IHFRDiagnosisLifecycleEvent_diagnosisId_occurredAt_idx" ON "IHFRDiagnosisLifecycleEvent"("diagnosisId", "occurredAt");
CREATE INDEX "IHFRDiagnosisLifecycleEvent_operationId_idx" ON "IHFRDiagnosisLifecycleEvent"("operationId");

CREATE FUNCTION imp006_validate_context() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE linked_collection TEXT;
BEGIN
  IF TG_TABLE_NAME = 'ExperimentalIHFRInputSupplement' THEN
    SELECT "collectionDataId" INTO linked_collection FROM "EnvironmentalMeasurementSet" WHERE id = NEW."environmentalMeasurementSetId";
    IF linked_collection IS DISTINCT FROM NEW."collectionDataId" THEN RAISE EXCEPTION 'IMP006_SUPPLEMENT_CONTEXT_MISMATCH' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME = 'ExperimentalIHFRDiagnosis' THEN
    SELECT "collectionDataId" INTO linked_collection FROM "EnvironmentalMeasurementSet" WHERE id = NEW."environmentalMeasurementSetId";
    IF linked_collection IS DISTINCT FROM NEW."collectionDataId" OR NOT EXISTS (SELECT 1 FROM "ExperimentalIHFRInputSupplement" s WHERE s.id=NEW."inputSupplementId" AND s."collectionDataId"=NEW."collectionDataId" AND s."environmentalMeasurementSetId"=NEW."environmentalMeasurementSetId") THEN RAISE EXCEPTION 'IMP006_DIAGNOSIS_CONTEXT_MISMATCH' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME = 'CurrentExperimentalIHFRDiagnosis' THEN
    IF NOT EXISTS (SELECT 1 FROM "ExperimentalIHFRDiagnosis" d WHERE d.id=NEW."diagnosisId" AND d."collectionDataId"=NEW."collectionDataId") THEN RAISE EXCEPTION 'IMP006_CURRENT_CONTEXT_MISMATCH' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME = 'IHFRDiagnosisOperation' THEN
    IF NOT EXISTS (SELECT 1 FROM "CollectionData" c WHERE c.id=NEW."collectionDataId" AND c."collectionAreaId"=NEW."collectionAreaId" AND c."laboratoryRoomId"=NEW."laboratoryRoomId") THEN RAISE EXCEPTION 'IMP006_OPERATION_CONTEXT_MISMATCH' USING ERRCODE='23514'; END IF;
  ELSIF TG_TABLE_NAME = 'IHFRDiagnosisLifecycleEvent' THEN
    IF NOT EXISTS (SELECT 1 FROM "ExperimentalIHFRDiagnosis" d WHERE d.id=NEW."diagnosisId" AND d."collectionDataId"=NEW."collectionDataId") OR (NEW."replacementDiagnosisId" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "ExperimentalIHFRDiagnosis" d WHERE d.id=NEW."replacementDiagnosisId" AND d."collectionDataId"=NEW."collectionDataId")) THEN RAISE EXCEPTION 'IMP006_EVENT_CONTEXT_MISMATCH' USING ERRCODE='23514'; END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER imp006_supplement_context BEFORE INSERT ON "ExperimentalIHFRInputSupplement" FOR EACH ROW EXECUTE FUNCTION imp006_validate_context();
CREATE TRIGGER imp006_diagnosis_context BEFORE INSERT ON "ExperimentalIHFRDiagnosis" FOR EACH ROW EXECUTE FUNCTION imp006_validate_context();
CREATE TRIGGER imp006_current_context BEFORE INSERT OR UPDATE ON "CurrentExperimentalIHFRDiagnosis" FOR EACH ROW EXECUTE FUNCTION imp006_validate_context();
CREATE TRIGGER imp006_operation_context BEFORE INSERT ON "IHFRDiagnosisOperation" FOR EACH ROW EXECUTE FUNCTION imp006_validate_context();
CREATE TRIGGER imp006_event_context BEFORE INSERT ON "IHFRDiagnosisLifecycleEvent" FOR EACH ROW EXECUTE FUNCTION imp006_validate_context();

CREATE FUNCTION imp006_reject_immutable_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'IMP006_IMMUTABLE_RECORD' USING ERRCODE='23514';
END;
$$;

CREATE TRIGGER imp006_supplement_immutable BEFORE UPDATE OR DELETE ON "ExperimentalIHFRInputSupplement" FOR EACH ROW EXECUTE FUNCTION imp006_reject_immutable_mutation();
CREATE TRIGGER imp006_diagnosis_immutable BEFORE UPDATE OR DELETE ON "ExperimentalIHFRDiagnosis" FOR EACH ROW EXECUTE FUNCTION imp006_reject_immutable_mutation();
CREATE TRIGGER imp006_operation_immutable BEFORE UPDATE OR DELETE ON "IHFRDiagnosisOperation" FOR EACH ROW EXECUTE FUNCTION imp006_reject_immutable_mutation();
CREATE TRIGGER imp006_event_immutable BEFORE UPDATE OR DELETE ON "IHFRDiagnosisLifecycleEvent" FOR EACH ROW EXECUTE FUNCTION imp006_reject_immutable_mutation();

COMMIT;

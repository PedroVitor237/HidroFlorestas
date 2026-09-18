-- Additive only: no backfill, no parent/legacy mutation.
CREATE TABLE "EnvironmentalMeasurementSet" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "collectionDataId" TEXT NOT NULL,
 "userId" TEXT NOT NULL,
 "measurementContractVersion" TEXT NOT NULL,
 "payload" JSONB NOT NULL,
 "payloadHash" TEXT NOT NULL,
 "confirmationKey" TEXT NOT NULL,
 "confirmedAt" TIMESTAMPTZ(3) NOT NULL,
 "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "EnvironmentalMeasurementSet_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
 CONSTRAINT "EnvironmentalMeasurementSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "EnvironmentalMeasurementSet_collectionDataId_key" ON "EnvironmentalMeasurementSet"("collectionDataId");
CREATE UNIQUE INDEX "EnvironmentalMeasurementSet_userId_confirmationKey_key" ON "EnvironmentalMeasurementSet"("userId","confirmationKey");
CREATE INDEX "EnvironmentalMeasurementSet_measurementContractVersion_idx" ON "EnvironmentalMeasurementSet"("measurementContractVersion");
CREATE FUNCTION imp005_reject_measurement_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 RAISE EXCEPTION 'Confirmed environmental measurement sets are immutable' USING ERRCODE='23514';
END;
$$;
CREATE TRIGGER imp005_measurement_immutable BEFORE UPDATE OR DELETE ON "EnvironmentalMeasurementSet" FOR EACH ROW EXECUTE FUNCTION imp005_reject_measurement_mutation();

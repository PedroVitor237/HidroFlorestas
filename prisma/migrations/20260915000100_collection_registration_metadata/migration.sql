BEGIN;

LOCK TABLE "CollectionData", "CollectionArea", "LaboratoryRoom", "User",
  "WaterData", "SoilData", "VegetationData", "TerrainData", "IHFRDiagnosis"
  IN ACCESS EXCLUSIVE MODE;

-- Abort before structural writes when the additive backfill is not deterministic.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "CollectionData" c
    LEFT JOIN "CollectionArea" a ON a.id = c."collectionAreaId"
    WHERE a.id IS NULL
  ) THEN
    RAISE EXCEPTION 'IMP004_ORPHANED_AREA';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "CollectionData" c
    LEFT JOIN "User" u ON u.id = c."userId"
    WHERE u.id IS NULL
  ) THEN
    RAISE EXCEPTION 'IMP004_ORPHANED_USER';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "CollectionData" c
    JOIN "CollectionArea" a ON a.id = c."collectionAreaId"
    WHERE a."laboratoryRoomId" IS NULL
  ) THEN
    RAISE EXCEPTION 'IMP004_LABORATORY_NOT_DERIVABLE';
  END IF;
END $$;

ALTER TABLE "CollectionData"
  ADD COLUMN "laboratoryRoomId" TEXT,
  ADD COLUMN "occurredAt" TIMESTAMPTZ(3),
  ADD COLUMN "occurrenceOffset" VARCHAR(6),
  ADD COLUMN "confirmedAt" TIMESTAMPTZ(3),
  ADD COLUMN "confirmationKey" TEXT;

UPDATE "CollectionData" c
SET "laboratoryRoomId" = a."laboratoryRoomId"
FROM "CollectionArea" a
WHERE a.id = c."collectionAreaId";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "CollectionData" WHERE "laboratoryRoomId" IS NULL) THEN
    RAISE EXCEPTION 'IMP004_LABORATORY_BACKFILL';
  END IF;
END $$;

ALTER TABLE "CollectionData"
  ALTER COLUMN "laboratoryRoomId" SET NOT NULL;

ALTER TABLE "CollectionArea"
  ADD CONSTRAINT "CollectionArea_id_laboratoryRoomId_key"
  UNIQUE (id, "laboratoryRoomId");

ALTER TABLE "CollectionData"
  DROP CONSTRAINT "CollectionData_collectionAreaId_fkey",
  ADD CONSTRAINT "CollectionData_laboratoryRoomId_fkey"
    FOREIGN KEY ("laboratoryRoomId") REFERENCES "LaboratoryRoom"(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "CollectionData_collectionAreaId_laboratoryRoomId_fkey"
    FOREIGN KEY ("collectionAreaId", "laboratoryRoomId")
    REFERENCES "CollectionArea"(id, "laboratoryRoomId")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "CollectionData_confirmation_tuple_check" CHECK (
    ("occurredAt" IS NULL AND "occurrenceOffset" IS NULL AND "confirmedAt" IS NULL AND "confirmationKey" IS NULL)
    OR
    ("occurredAt" IS NOT NULL AND "occurrenceOffset" IS NOT NULL AND "confirmedAt" IS NOT NULL AND "confirmationKey" IS NOT NULL)
  ),
  ADD CONSTRAINT "CollectionData_occurrence_offset_check" CHECK (
    "occurrenceOffset" IS NULL OR (
      "occurrenceOffset" <> '-00:00' AND (
        "occurrenceOffset" = 'Z'
        OR "occurrenceOffset" ~ '^[+-](0[0-9]|1[0-3]):[0-5][0-9]$'
        OR "occurrenceOffset" ~ '^[+-]14:00$'
      )
    )
  );

CREATE UNIQUE INDEX "CollectionData_userId_confirmationKey_key"
  ON "CollectionData"("userId", "confirmationKey");
CREATE INDEX "CollectionData_collectionAreaId_laboratoryRoomId_idx"
  ON "CollectionData"("collectionAreaId", "laboratoryRoomId");

CREATE FUNCTION imp004_reject_confirmed_collection_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."confirmedAt" IS NOT NULL THEN
    RAISE EXCEPTION 'IMP004_CONFIRMED_COLLECTION_IMMUTABLE';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER imp004_collection_immutable
  BEFORE UPDATE OR DELETE ON "CollectionData"
  FOR EACH ROW EXECUTE FUNCTION imp004_reject_confirmed_collection_mutation();

COMMIT;

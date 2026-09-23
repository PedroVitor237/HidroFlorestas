import type { PoolClient } from "pg";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "./ihfr-diagnosis-actors";

const id = (suffix: number) => `60000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;

export const IHFR_CONTEXTS = {
  activeArea: id(31), inactiveArea: id(32),
  confirmedCollection: id(41), unconfirmedCollection: id(42),
  withoutMeasurementCollection: id(43), inactiveCollection: id(44),
  measurement: id(51), inactiveMeasurement: id(52),
} as const;

export const IHFR_MEASUREMENT_PAYLOAD = {
  terrain: { slopePercent: 45 },
  water: { waterSourceType: "SPRING", hasSpring: true, waterAvailability: "PERMANENT" },
  soil: { infiltrationRateMmPerHour: 60, compactionLevel: "LOW", erosionSigns: "NONE", soilTexture: "MEDIUM" },
  vegetation: { vegetationCoverPercent: 100, fragmentationLevel: "LOW", hasRiparianApp: true, landscapeDegradation: "LOW" },
} as const;

export async function insertIHFRContextFixtures(client: PoolClient) {
  await client.query(
    `INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId",latitude,longitude,"createdAt","updatedAt","isActive") VALUES
      ($1,'IMP-006 active area',$3,$4,-3,-38,now(),now(),true),
      ($2,'IMP-006 inactive-lab area',$3,$5,-4,-39,now(),now(),true)`,
    [IHFR_CONTEXTS.activeArea, IHFR_CONTEXTS.inactiveArea, IHFR_ACTORS.owner,
      IHFR_LABORATORIES.active, IHFR_LABORATORIES.inactive],
  );
  await client.query(
    `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","createdAt","updatedAt") VALUES
      ($1,$5,$7,$9,now(),'-03:00',now(),'imp006-confirmed',now(),now()),
      ($2,$5,$7,$9,NULL,NULL,NULL,NULL,now(),now()),
      ($3,$5,$7,$9,now(),'-03:00',now(),'imp006-no-measurement',now(),now()),
      ($4,$6,$8,$9,now(),'-03:00',now(),'imp006-inactive-lab',now(),now())`,
    [IHFR_CONTEXTS.confirmedCollection, IHFR_CONTEXTS.unconfirmedCollection,
      IHFR_CONTEXTS.withoutMeasurementCollection, IHFR_CONTEXTS.inactiveCollection,
      IHFR_CONTEXTS.activeArea, IHFR_CONTEXTS.inactiveArea, IHFR_LABORATORIES.active,
      IHFR_LABORATORIES.inactive, IHFR_ACTORS.owner],
  );
  await client.query(
    `INSERT INTO "EnvironmentalMeasurementSet" (id,"collectionDataId","userId","measurementContractVersion",payload,"payloadHash","confirmationKey","confirmedAt") VALUES
      ($1,$3,$5,'ihfr-measurement-v1',$6::jsonb,'sha256:measurement-active','imp006-measurement-active',now()),
      ($2,$4,$5,'ihfr-measurement-v1',$6::jsonb,'sha256:measurement-inactive','imp006-measurement-inactive',now())`,
    [IHFR_CONTEXTS.measurement, IHFR_CONTEXTS.inactiveMeasurement,
      IHFR_CONTEXTS.confirmedCollection, IHFR_CONTEXTS.inactiveCollection,
      IHFR_ACTORS.owner,
      JSON.stringify(IHFR_MEASUREMENT_PAYLOAD)],
  );
}

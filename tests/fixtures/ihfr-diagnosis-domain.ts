import type { PoolClient } from "@neondatabase/serverless";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "./ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "./ihfr-diagnosis-contexts";

const id = (suffix: number) => `60000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;
const hash = (character: string) => `sha256:${character.repeat(64)}`;

export const IHFR_DOMAIN = {
  supplement: id(61), currentDiagnosis: id(62), supersededDiagnosis: id(63), revokedDiagnosis: id(64),
  currentOperation: id(71), supersededOperation: id(72), revokedOperation: id(73),
  insufficientOperation: id(74),
  candidates: {
    valid: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST" },
    invalid: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "OTHER" },
    absent: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0" },
    idempotencyConflict: { sameKey: id(83), divergentRequestHash: hash("c") },
  },
} as const;

export async function insertIHFRDomainFixtures(client: PoolClient) {
  const collection = IHFR_CONTEXTS.confirmedCollection;
  await client.query(
    `INSERT INTO "ExperimentalIHFRInputSupplement" (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt")
     VALUES ($1,$2,$3,$4,'ihfr-diagnosis-input-experimental-v0.1.0','FOREST',$5::jsonb,$6,now())`,
    [IHFR_DOMAIN.supplement, collection, IHFR_CONTEXTS.measurement, IHFR_ACTORS.owner,
      JSON.stringify({ kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" }), hash("a")],
  );
  for (const [diagnosisId, score, calculatedAt] of [
    [IHFR_DOMAIN.supersededDiagnosis, 0.3, "2026-09-20T12:01:00.000Z"],
    [IHFR_DOMAIN.revokedDiagnosis, 0.4, "2026-09-20T12:02:00.000Z"],
    [IHFR_DOMAIN.currentDiagnosis, 0.5, "2026-09-20T12:03:00.000Z"],
  ] as const) {
    await client.query(
      `INSERT INTO "ExperimentalIHFRDiagnosis" (id,"collectionDataId","environmentalMeasurementSetId","inputSupplementId","rawScore","displayScore","ihfrClass","dataQuality","componentScores",decomposition,drivers,explanation,"measurementContractVersion","inputContractVersion","mathContractVersion","algorithmVersion","contractHash","calculatedAt","scientificState")
       VALUES ($1,$2,$3,$4,$5::double precision,$5::numeric,'MODERATE','MODERATE',$6::jsonb,$7::jsonb,$8::jsonb,'Technical fixture','ihfr-measurement-v1','ihfr-diagnosis-input-experimental-v0.1.0','ihfr-math-experimental-v0.1.1','ihfr-evaluator-ts-v0.1.0','sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89',$9,'EXPERIMENTAL')`,
      [diagnosisId, collection, IHFR_CONTEXTS.measurement, IHFR_DOMAIN.supplement, score,
        JSON.stringify({ W: score, S: score, V: score, T: score }), JSON.stringify({}),
        JSON.stringify(["W", "S"]), calculatedAt],
    );
  }
  const operations = [
    [IHFR_DOMAIN.supersededOperation, id(81), IHFR_DOMAIN.supersededDiagnosis, "SUCCEEDED"],
    [IHFR_DOMAIN.revokedOperation, id(82), IHFR_DOMAIN.revokedDiagnosis, "SUCCEEDED"],
    [IHFR_DOMAIN.currentOperation, id(83), IHFR_DOMAIN.currentDiagnosis, "SUCCEEDED"],
    [IHFR_DOMAIN.insufficientOperation, id(84), null, "INSUFFICIENT_DATA"],
  ] as const;
  for (const [operationId, key, diagnosisId, outcome] of operations) {
    await client.query(
      `INSERT INTO "IHFRDiagnosisOperation" (id,"laboratoryRoomId","collectionAreaId","collectionDataId","actorUserId","idempotencyKey","requestHash","operationType",outcome,"diagnosisId","responseSnapshot","completedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,'CREATE_OR_REPLACE',$8,$9,$10::jsonb,now())`,
      [operationId, IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, collection,
        IHFR_ACTORS.owner, key, hash(operationId === IHFR_DOMAIN.insufficientOperation ? "d" : "b"),
        outcome, diagnosisId, JSON.stringify({ outcome, diagnosisId })],
    );
  }
  await client.query(
    `INSERT INTO "CurrentExperimentalIHFRDiagnosis" ("collectionDataId","diagnosisId","validFrom","operationId") VALUES ($1,$2,now(),$3)`,
    [collection, IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.currentOperation],
  );
  await client.query(
    `INSERT INTO "IHFRDiagnosisLifecycleEvent" (id,"collectionDataId","diagnosisId","eventType","replacementDiagnosisId","actorUserId","operationId",reason,"occurredAt",evidence) VALUES
      ($1,$4,$5,'SUPERSEDED',$6,$7,$8,NULL,now(),$9::jsonb),
      ($2,$4,$6,'REVOKED',NULL,$7,$10,'fixture revocation',now(),$9::jsonb),
      ($3,$4,$11,'CREATED_CURRENT',NULL,$7,$12,NULL,now(),$9::jsonb)`,
    [id(91), id(92), id(93), collection, IHFR_DOMAIN.supersededDiagnosis,
      IHFR_DOMAIN.revokedDiagnosis, IHFR_ACTORS.owner, IHFR_DOMAIN.supersededOperation,
      JSON.stringify({ restricted: true }), IHFR_DOMAIN.revokedOperation,
      IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.currentOperation],
  );
}

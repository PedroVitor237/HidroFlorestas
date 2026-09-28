import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { test } from "node:test";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS, IHFR_MEASUREMENT_PAYLOAD } from "../fixtures/ihfr-diagnosis-contexts";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

test("persisted insufficient fixture records only terminal operation without a diagnosis", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const collectionId = randomUUID();
    const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId };
    const payload = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
    delete payload.soil.infiltrationRateMmPerHour;
    await client.query(`INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),'-03:00',now(),$5,now(),now())`, [collectionId, context.areaId, context.laboratoryId, IHFR_ACTORS.owner, randomUUID()]);
    await client.query(`INSERT INTO "EnvironmentalMeasurementSet" (id,"collectionDataId","userId","measurementContractVersion",payload,"payloadHash","confirmationKey","confirmedAt") VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,now())`, [randomUUID(), collectionId, IHFR_ACTORS.owner, IHFR_CONTRACT.measurementVersion, JSON.stringify(payload), `sha256:${randomBytes(32).toString("hex")}`, randomUUID()]);
    const service = new IHFRDiagnosisService(db);
    const eligibility = await service.eligibility(IHFR_ACTORS.owner, context, "FOREST");
    assert.equal(eligibility.outcome, "INSUFFICIENT_DATA");
    assert.deepEqual(eligibility.reasons, ["INSUFFICIENT_DIMENSION"]);
    const result = await service.createOrReplace(IHFR_ACTORS.owner, context, {
      mode: "CREATE", expectedCurrentDiagnosisId: null,
      supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00Z" } },
      versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash },
    }, randomUUID());
    assert.equal(result.response.outcome, "INSUFFICIENT_DATA");
    assert.equal(result.response.diagnosis, null);
    assert.deepEqual(result.response.insufficiencyReasons, ["INSUFFICIENT_DIMENSION"]);
    assert.equal(await service.readCurrent(IHFR_ACTORS.owner, context), null);
    const counts = (await client.query(`SELECT
      (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement" WHERE "collectionDataId"=$1) supplements,
      (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) diagnoses,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current,
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation" WHERE "collectionDataId"=$1) operations,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent" WHERE "collectionDataId"=$1) events`, [collectionId])).rows[0];
    assert.deepEqual(counts, { supplements: 0, diagnoses: 0, current: 0, operations: 1, events: 0 });
  });
});

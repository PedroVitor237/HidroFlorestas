import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { ihfrDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";

test("concurrent lifecycle attempts yield one winner and one controlled conflict", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
    const request = { mode: "REPLACE" as const, expectedCurrentDiagnosisId: "60000000-0000-4000-8000-000000000062", supplement: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } } };
    const results = await Promise.allSettled([ihfrDiagnosisService.createOrReplace("60000000-0000-4000-8000-000000000001", context, request), ihfrDiagnosisService.createOrReplace("60000000-0000-4000-8000-000000000001", context, request)]);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal(results.filter((result) => result.status === "rejected").length, 1);
    const pointers = await client.query(`SELECT count(*)::int AS count FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1`, [context.collectionId]);
    assert.equal(pointers.rows[0].count, 1);
  });
});

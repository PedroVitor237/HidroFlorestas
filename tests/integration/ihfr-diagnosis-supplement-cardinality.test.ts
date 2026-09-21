import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

test("PostgreSQL permits 1:N diagnosis reuse and rejects duplicate collection payload", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const reused = await client.query(`SELECT "inputSupplementId", count(*)::int AS count FROM "ExperimentalIHFRDiagnosis" GROUP BY "inputSupplementId"`);
    assert.equal(reused.rows[0].count, 3);
    await assert.rejects(client.query(`INSERT INTO "ExperimentalIHFRInputSupplement" (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt") SELECT gen_random_uuid(),"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash",now() FROM "ExperimentalIHFRInputSupplement" LIMIT 1`), /unique/i);
  });
});

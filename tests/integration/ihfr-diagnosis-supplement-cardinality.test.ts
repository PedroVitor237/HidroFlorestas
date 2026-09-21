import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { ihfrDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";

test("PostgreSQL permits 1:N diagnosis reuse and rejects duplicate collection payload", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const reused = await client.query(`SELECT "inputSupplementId", count(*)::int AS count FROM "ExperimentalIHFRDiagnosis" GROUP BY "inputSupplementId"`);
    assert.equal(reused.rows[0].count, 3);
    assert.equal(reused.rows[0].inputSupplementId, IHFR_DOMAIN.supplement);

    const indexes = await client.query(`SELECT i.indisunique, array_agg(a.attname ORDER BY key.ordinality) columns FROM pg_index i JOIN pg_class t ON t.oid=i.indrelid JOIN LATERAL unnest(i.indkey) WITH ORDINALITY key(attnum,ordinality) ON true JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=key.attnum WHERE t.relname='ExperimentalIHFRDiagnosis' GROUP BY i.indexrelid,i.indisunique`);
    assert.equal(indexes.rows.some((index) => index.indisunique && String(index.columns).includes("inputSupplementId")), false);

    await assert.rejects(client.query(`INSERT INTO "ExperimentalIHFRInputSupplement" (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt") SELECT gen_random_uuid(),"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash",now() FROM "ExperimentalIHFRInputSupplement" LIMIT 1`), /unique/i);

    const before = (await client.query(`SELECT * FROM "ExperimentalIHFRInputSupplement" WHERE id=$1`, [IHFR_DOMAIN.supplement])).rows[0];
    for (const [column, value] of [["landUseType", "URBAN"], ["inputContractVersion", "other"], ["provenance", JSON.stringify({ changed: true })], ["payloadHash", `sha256:${"f".repeat(64)}`], ["collectionDataId", IHFR_CONTEXTS.inactiveCollection], ["environmentalMeasurementSetId", IHFR_CONTEXTS.inactiveMeasurement], ["createdByUserId", "60000000-0000-4000-8000-000000000002"], ["confirmedAt", new Date("2030-01-01")]] as const) {
      await assert.rejects(client.query(`UPDATE "ExperimentalIHFRInputSupplement" SET "${column}"=$1 WHERE id=$2`, [value, IHFR_DOMAIN.supplement]), /IMP006_IMMUTABLE_RECORD/);
    }
    await assert.rejects(client.query(`DELETE FROM "ExperimentalIHFRInputSupplement" WHERE id=$1`, [IHFR_DOMAIN.supplement]), /IMP006_IMMUTABLE_RECORD|foreign key/i);
    assert.deepEqual((await client.query(`SELECT * FROM "ExperimentalIHFRInputSupplement" WHERE id=$1`, [IHFR_DOMAIN.supplement])).rows[0], before);

    await client.query(`INSERT INTO "ExperimentalIHFRInputSupplement" (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt") VALUES
      ('60000000-0000-4000-8000-000000000065',$1,$2,'60000000-0000-4000-8000-000000000001','ihfr-diagnosis-input-experimental-v0.1.0','URBAN',$3::jsonb,$4,now()),
      ('60000000-0000-4000-8000-000000000066',$5,$6,'60000000-0000-4000-8000-000000000001','ihfr-diagnosis-input-experimental-v0.1.0','FOREST',$3::jsonb,$7,now())`, [IHFR_CONTEXTS.confirmedCollection, IHFR_CONTEXTS.measurement, JSON.stringify({ kind: "FIELD_OBSERVATION", observedAt: "2026-09-21T12:00:00.000Z" }), `sha256:${"e".repeat(64)}`, IHFR_CONTEXTS.inactiveCollection, IHFR_CONTEXTS.inactiveMeasurement, before.payloadHash]);
    const separation = await client.query(`SELECT "collectionDataId",count(*)::int count FROM "ExperimentalIHFRInputSupplement" GROUP BY "collectionDataId" ORDER BY "collectionDataId"`);
    assert.deepEqual(separation.rows.map((row) => row.count), [2, 1]);

    await assert.rejects(client.query(`INSERT INTO "ExperimentalIHFRInputSupplement" (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt") SELECT gen_random_uuid(),$1,"environmentalMeasurementSetId","createdByUserId","inputContractVersion","landUseType",provenance,$2,now() FROM "ExperimentalIHFRInputSupplement" WHERE id=$3`, [IHFR_CONTEXTS.inactiveCollection, `sha256:${"d".repeat(64)}`, IHFR_DOMAIN.supplement]), /IMP006_SUPPLEMENT_CONTEXT_MISMATCH/);
  });
});

test("concurrent compatible operations converge on one supplement without public leakage", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
    const request = { mode: "REPLACE" as const, expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0" as const, landUseType: "FOREST" as const, provenance: { kind: "FIELD_OBSERVATION" as const, observedAt: "2026-09-20T12:00:00.000Z" } }, versions: { measurementContractVersion: "ihfr-measurement-v1" as const, mathContractVersion: "ihfr-math-experimental-v0.1.1" as const, algorithmVersion: "ihfr-evaluator-ts-v0.1.0" as const, contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89" as const } };
    const results = await Promise.allSettled([ihfrDiagnosisService.createOrReplace("60000000-0000-4000-8000-000000000001", context, request), ihfrDiagnosisService.createOrReplace("60000000-0000-4000-8000-000000000002", context, request)]);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal((await client.query(`SELECT count(*)::int count FROM "ExperimentalIHFRInputSupplement" WHERE "collectionDataId"=$1`, [context.collectionId])).rows[0].count, 1);
    const serialized = JSON.stringify(results); for (const field of ["payloadHash", "createdByUserId", "provenance", "environmentalMeasurementSetId"]) assert.equal(serialized.includes(field), false);
  });
});

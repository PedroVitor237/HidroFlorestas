import assert from "node:assert/strict";
import { test } from "node:test";

import { insertIHFRLegacyBaseline } from "../fixtures/ihfr-diagnosis-migration-baseline";
import {
  selectedImp006DatabaseVariable,
  withImp006PostgresqlSchema,
} from "../fixtures/postgresql-schema-lifecycle";
import {
  applyAreaMigration,
  applyCollectionMigration,
  applyEnvironmentalMigration,
  applyIHFRDiagnosisMigration,
  applyRemoveLegacyIsAdminMigration,
  applyUserAdministrationMigration,
} from "./migration-test-harness";

async function applyIntegratedChain(client: Parameters<typeof insertIHFRLegacyBaseline>[0]) {
  await applyAreaMigration(client);
  await applyCollectionMigration(client);
  await applyEnvironmentalMigration(client);
  await applyUserAdministrationMigration(client);
}

async function applyIHFRAndLegacyRemoval(client: Parameters<typeof insertIHFRLegacyBaseline>[0]) {
  await applyIHFRDiagnosisMigration(client);
  await applyRemoveLegacyIsAdminMigration(client);
}

async function insertExperimentalDependencies(client: Parameters<typeof insertIHFRLegacyBaseline>[0]) {
  await insertIHFRLegacyBaseline(client);
  await client.query(`
    INSERT INTO "EnvironmentalMeasurementSet"
      (id, "collectionDataId", "userId", "measurementContractVersion", payload, "payloadHash", "confirmationKey", "confirmedAt")
    VALUES
      ('00000000-0000-4000-8000-000000000651',
       '00000000-0000-4000-8000-000000000631',
       '00000000-0000-4000-8000-000000000601',
       'ihfr-measurement-v1', '{}', 'sha256:measurement-fixture',
       '00000000-0000-4000-8000-000000000652', now());
    INSERT INTO "ExperimentalIHFRInputSupplement"
      (id, "collectionDataId", "environmentalMeasurementSetId", "createdByUserId", "inputContractVersion", "landUseType", provenance, "payloadHash", "confirmedAt")
    VALUES
      ('00000000-0000-4000-8000-000000000661',
       '00000000-0000-4000-8000-000000000631',
       '00000000-0000-4000-8000-000000000651',
       '00000000-0000-4000-8000-000000000601',
       'ihfr-diagnosis-input-experimental-v0.1.0', 'FOREST', '{}',
       'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', now());
  `);
}

async function insertExperimentalDiagnosis(
  client: Parameters<typeof insertIHFRLegacyBaseline>[0],
  id: string,
  rawScore: number | string | null,
  displayScore = "0.50",
) {
  await client.query(
    `INSERT INTO "ExperimentalIHFRDiagnosis"
      (id, "collectionDataId", "environmentalMeasurementSetId", "inputSupplementId",
       "rawScore", "displayScore", "ihfrClass", "dataQuality", "componentScores",
       decomposition, drivers, explanation, "measurementContractVersion",
       "inputContractVersion", "mathContractVersion", "algorithmVersion", "contractHash",
       "calculatedAt", "scientificState")
     VALUES
      ($1, '00000000-0000-4000-8000-000000000631',
       '00000000-0000-4000-8000-000000000651',
       '00000000-0000-4000-8000-000000000661', $2::double precision, $3::numeric,
       'MODERATE', 'MODERATE', '{}', '{}', '[]', 'Technical migration fixture',
       'ihfr-measurement-v1', 'ihfr-diagnosis-input-experimental-v0.1.0',
       'ihfr-math-experimental-v0.1.1', 'ihfr-evaluator-ts-v0.1.0',
       'sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89',
       now(), 'EXPERIMENTAL')`,
    [id, rawScore, displayScore],
  );
}

async function rejectsWithPostgresqlCode(
  action: () => Promise<unknown>,
  expectedCode: "23502" | "23514",
) {
  await assert.rejects(action, (error: unknown) => {
    assert.equal((error as { code?: string }).code, expectedCode);
    return true;
  });
}

test("IMP-006 migration applies on empty integrated baseline", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await applyIntegratedChain(client);
    await applyIHFRAndLegacyRemoval(client);
    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname=current_schema() AND tablename LIKE '%IHFR%' ORDER BY tablename");
    assert.deepEqual(tables.rows.map((row) => row.tablename), [
      "CurrentExperimentalIHFRDiagnosis",
      "ExperimentalIHFRDiagnosis",
      "ExperimentalIHFRInputSupplement",
      "IHFRDiagnosis",
      "IHFRDiagnosisLifecycleEvent",
      "IHFRDiagnosisOperation",
    ]);
  });
});

test("IMP-006 migration preserves legacy rows and performs zero backfill", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await applyIntegratedChain(client);
    await insertIHFRLegacyBaseline(client);
    await applyIHFRAndLegacyRemoval(client);
    const legacy = await client.query('SELECT "algorithmVersion" FROM "IHFRDiagnosis"');
    const experimental = await client.query('SELECT count(*)::int AS count FROM "ExperimentalIHFRDiagnosis"');
    assert.equal(legacy.rowCount, 1);
    assert.equal(legacy.rows[0].algorithmVersion, "1.0.0");
    assert.equal(experimental.rows[0].count, 0);
  });
});

test("IMP-006 score constraint accepts finite domain values and rejects non-finite or out-of-domain values", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await applyIntegratedChain(client);
    await applyIHFRDiagnosisMigration(client);
    await insertExperimentalDependencies(client);
    await applyRemoveLegacyIsAdminMigration(client);

    await insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000671", 0.5);
    await insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000672", 0);

    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000673", "NaN"),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000674", "Infinity"),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000675", "-Infinity"),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000676", null),
      "23502",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000677", -0.01),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000678", 1.01),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000679", 0.5, "-0.01"),
      "23514",
    );
    await rejectsWithPostgresqlCode(
      () => insertExperimentalDiagnosis(client, "00000000-0000-4000-8000-000000000680", 0.5, "1.01"),
      "23514",
    );

    const accepted = await client.query(
      `SELECT "rawScore" FROM "ExperimentalIHFRDiagnosis" ORDER BY id`,
    );
    assert.deepEqual(accepted.rows.map((row) => row.rawScore), [0.5, 0]);
  });
});

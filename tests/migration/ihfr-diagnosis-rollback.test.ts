import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { applyAreaMigration, applyCollectionMigration, applyEnvironmentalMigration, applyIHFRDiagnosisMigration, applyUserAdministrationMigration, ihfrDiagnosisMigrationPath } from "./migration-test-harness";

test("a failed transactional migration leaves no IMP-006 objects and can be retried in the same owned schema", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await applyAreaMigration(client);
    await applyCollectionMigration(client);
    await applyEnvironmentalMigration(client);
    await applyUserAdministrationMigration(client);
    const publishedSql = await readFile(ihfrDiagnosisMigrationPath, "utf8");
    assert.match(publishedSql, /^--[^\n]*\nBEGIN;/);
    assert.match(publishedSql, /COMMIT;\s*$/);
    try {
      await client.query(publishedSql.replace(/COMMIT;\s*$/, ""));
      throw new Error("INJECTED_MIGRATION_FAILURE_BEFORE_COMMIT");
    } catch (error) {
      assert.match(String(error), /INJECTED_MIGRATION_FAILURE_BEFORE_COMMIT/);
      await client.query("ROLLBACK");
    }
    const partial = await client.query(`SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema() AND c.relname IN ('ExperimentalIHFRInputSupplement','ExperimentalIHFRDiagnosis','CurrentExperimentalIHFRDiagnosis','IHFRDiagnosisOperation','IHFRDiagnosisLifecycleEvent')`);
    assert.equal(partial.rows[0].count, 0);
    const legacy = await client.query(`SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema() AND c.relname='IHFRDiagnosis'`);
    assert.equal(legacy.rows[0].count, 1);
    await applyIHFRDiagnosisMigration(client);
    const recovered = await client.query(`SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema() AND c.relname IN ('ExperimentalIHFRInputSupplement','ExperimentalIHFRDiagnosis','CurrentExperimentalIHFRDiagnosis','IHFRDiagnosisOperation','IHFRDiagnosisLifecycleEvent')`);
    assert.equal(recovered.rows[0].count, 5);
  });
});

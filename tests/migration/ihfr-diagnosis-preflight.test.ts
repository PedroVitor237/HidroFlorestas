import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import {
  selectedImp006DatabaseVariable,
  withImp006PostgresqlSchema,
} from "../fixtures/postgresql-schema-lifecycle";
import {
  applyAreaMigration,
  applyCollectionMigration,
  applyEnvironmentalMigration,
  applyIHFRDiagnosisMigration,
} from "./migration-test-harness";

const migrationDirectory =
  "prisma/migrations/20260920000100_ihfr_experimental_diagnosis";

test("IMP-006 migration uses the reserved slot after the integrated baseline", () => {
  const migrations = readdirSync("prisma/migrations", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.equal(existsSync(`${migrationDirectory}/migration.sql`), true);
  assert.equal(
    migrations.some((name) => name > "20260920000100_ihfr_experimental_diagnosis"),
    false,
  );
  assert.equal(migrations.at(-1), "20260920000100_ihfr_experimental_diagnosis");
});

test("legacy, IMP-005 and additive IMP-006 models coexist", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  assert.match(schema, /model IHFRDiagnosis\s*\{/);
  assert.match(schema, /model EnvironmentalMeasurementSet\s*\{/);
  assert.match(schema, /model ExperimentalIHFRDiagnosis\s*\{/);
  assert.match(schema, /model ExperimentalIHFRInputSupplement\s*\{/);
  assert.match(schema, /@@unique\(\[collectionDataId, payloadHash\]\)/);
  assert.doesNotMatch(schema, /inputSupplementId\s+String\s+@unique/);
});

test("migration is additive, immutable and contains no backfill", () => {
  const sql = readFileSync(`${migrationDirectory}/migration.sql`, "utf8");
  assert.doesNotMatch(sql, /\bUPDATE\s+"?(?:IHFRDiagnosis|CollectionData|EnvironmentalMeasurementSet)"?/i);
  assert.doesNotMatch(sql, /\bDELETE\s+FROM\b/i);
  assert.match(sql, /imp006_supplement_immutable/);
  assert.match(sql, /imp006_diagnosis_immutable/);
  assert.match(sql, /imp006_event_immutable/);
  assert.match(sql, /CurrentExperimentalIHFRDiagnosis_collectionDataId_fkey/);
});

test(
  "applied IMP-006 schema has the expected constraints, indexes, triggers and zero backfill",
  { skip: process.env.IMP006_DATABASE_VARIABLE === undefined },
  async () => {
    await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
      await applyAreaMigration(client);
      await applyCollectionMigration(client);
      await applyEnvironmentalMigration(client);
      await applyIHFRDiagnosisMigration(client);

      const expectedTables = [
        "CurrentExperimentalIHFRDiagnosis",
        "ExperimentalIHFRDiagnosis",
        "ExperimentalIHFRInputSupplement",
        "IHFRDiagnosisLifecycleEvent",
        "IHFRDiagnosisOperation",
      ];
      const tables = await client.query(
        `SELECT tablename FROM pg_tables
          WHERE schemaname = current_schema() AND tablename = ANY($1::text[])
          ORDER BY tablename`,
        [expectedTables],
      );
      assert.deepEqual(tables.rows.map((row) => row.tablename), expectedTables);

      const requiredConstraints = [
        "ExperimentalIHFRDiagnosis_score_check",
        "ExperimentalIHFRDiagnosis_versions_check",
        "ExperimentalIHFRInputSupplement_input_version_check",
        "ExperimentalIHFRInputSupplement_payload_hash_check",
        "IHFRDiagnosisLifecycleEvent_shape_check",
        "IHFRDiagnosisOperation_key_check",
        "IHFRDiagnosisOperation_request_hash_check",
      ];
      const constraints = await client.query(
        `SELECT conname FROM pg_constraint
          WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = current_schema())
            AND conname = ANY($1::text[])
          ORDER BY conname`,
        [requiredConstraints],
      );
      assert.deepEqual(
        constraints.rows.map((row) => row.conname),
        [...requiredConstraints].sort(),
      );

      const foreignKeys = await client.query(`
        SELECT count(*)::int AS count,
               bool_and(confdeltype = 'r' AND confupdtype = 'r') AS all_restrict
          FROM pg_constraint
         WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = current_schema())
           AND contype = 'f'
           AND conrelid IN (
             '"ExperimentalIHFRInputSupplement"'::regclass,
             '"ExperimentalIHFRDiagnosis"'::regclass,
             '"IHFRDiagnosisOperation"'::regclass,
             '"CurrentExperimentalIHFRDiagnosis"'::regclass,
             '"IHFRDiagnosisLifecycleEvent"'::regclass
           )
      `);
      assert.equal(foreignKeys.rows[0].count, 19);
      assert.equal(foreignKeys.rows[0].all_restrict, true);

      const expectedIndexes = [
        "CurrentExperimentalIHFRDiagnosis_diagnosisId_key",
        "CurrentExperimentalIHFRDiagnosis_operationId_key",
        "ExperimentalIHFRDiagnosis_collectionDataId_calculatedAt_idx",
        "ExperimentalIHFRDiagnosis_environmentalMeasurementSetId_idx",
        "ExperimentalIHFRDiagnosis_inputSupplementId_idx",
        "ExperimentalIHFRDiagnosis_mathContractVersion_contractHash_idx",
        "ExperimentalIHFRInputSupplement_collectionDataId_payloadHash_key",
        "ExperimentalIHFRInputSupplement_createdByUserId_idx",
        "ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_idx",
        "IHFRDiagnosisLifecycleEvent_collectionDataId_occurredAt_idx",
        "IHFRDiagnosisLifecycleEvent_diagnosisId_occurredAt_idx",
        "IHFRDiagnosisLifecycleEvent_operationId_idx",
        "IHFRDiagnosisOperation_actorUserId_idempotencyKey_key",
        "IHFRDiagnosisOperation_diagnosisId_idx",
        "IHFRDiagnosisOperation_laboratoryRoomId_collectionAreaId_collectionDataId_idx",
      ];
      const indexes = await client.query(
        `SELECT indexname FROM pg_indexes
          WHERE schemaname = current_schema() AND indexname = ANY($1::text[])
          ORDER BY indexname`,
        [expectedIndexes],
      );
      assert.deepEqual(indexes.rows.map((row) => row.indexname), [...expectedIndexes].sort());

      const expectedTriggers = [
        "imp006_current_context",
        "imp006_diagnosis_context",
        "imp006_diagnosis_immutable",
        "imp006_event_context",
        "imp006_event_immutable",
        "imp006_operation_context",
        "imp006_operation_immutable",
        "imp006_supplement_context",
        "imp006_supplement_immutable",
      ];
      const triggers = await client.query(
        `SELECT tgname FROM pg_trigger
          WHERE tgrelid IN (
            '"ExperimentalIHFRInputSupplement"'::regclass,
            '"ExperimentalIHFRDiagnosis"'::regclass,
            '"IHFRDiagnosisOperation"'::regclass,
            '"CurrentExperimentalIHFRDiagnosis"'::regclass,
            '"IHFRDiagnosisLifecycleEvent"'::regclass
          ) AND NOT tgisinternal AND tgname = ANY($1::text[])
          ORDER BY tgname`,
        [expectedTriggers],
      );
      assert.deepEqual(triggers.rows.map((row) => row.tgname), expectedTriggers);

      for (const table of expectedTables) {
        const result = await client.query(`SELECT count(*)::int AS count FROM "${table}"`);
        assert.equal(result.rows[0].count, 0, `${table} must not be backfilled`);
      }
    });
  },
);

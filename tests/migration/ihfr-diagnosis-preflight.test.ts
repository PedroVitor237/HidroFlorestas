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
  applyRemoveLegacyIsAdminMigration,
  applyUserAdministrationMigration,
  normalizePostgresqlTextArray,
} from "./migration-test-harness";

const migrationDirectory =
  "prisma/migrations/20260920000100_ihfr_experimental_diagnosis";

test("IMP-006 migration keeps its published slot in the integrated IMP-009 chain", () => {
  const migrations = readdirSync("prisma/migrations", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const administrationMigration = "20260919000100_user_administration";
  const ihfrMigration = "20260920000100_ihfr_experimental_diagnosis";
  const legacyRemovalMigration = "20260920000100_remove_legacy_is_admin";

  assert.equal(existsSync(`${migrationDirectory}/migration.sql`), true);
  assert.ok(migrations.indexOf(administrationMigration) < migrations.indexOf(ihfrMigration));
  assert.ok(migrations.indexOf(ihfrMigration) < migrations.indexOf(legacyRemovalMigration));
  assert.equal(migrations.at(-1), legacyRemovalMigration);
});

test("legacy, IMP-005 and additive IMP-006 models coexist", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  assert.match(schema, /model IHFRDiagnosis\s*\{/);
  assert.match(schema, /model EnvironmentalMeasurementSet\s*\{/);
  assert.match(schema, /model ExperimentalIHFRDiagnosis\s*\{/);
  assert.match(schema, /model ExperimentalIHFRInputSupplement\s*\{/);
  assert.match(
    schema,
    /@@unique\(\[collectionDataId, payloadHash\], map: "ExperimentalIHFRInput_collection_payload_key"\)/,
  );
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

test("all explicit IMP-006 database identifiers are ASCII, unique and PostgreSQL-safe", () => {
  const sql = readFileSync(`${migrationDirectory}/migration.sql`, "utf8");
  const patterns = [
    /CREATE TYPE "([^"]+)"/g,
    /CREATE TABLE "([^"]+)"/g,
    /CREATE (?:UNIQUE )?INDEX "([^"]+)"/g,
    /CONSTRAINT "([^"]+)"/g,
    /CREATE TRIGGER ([A-Za-z0-9_]+)/g,
    /CREATE FUNCTION ([A-Za-z0-9_]+)/g,
    /CREATE SEQUENCE "([^"]+)"/g,
  ];
  const identifiers = patterns.flatMap((pattern) =>
    [...sql.matchAll(pattern)].map((match) => match[1]),
  );

  assert.equal(new Set(identifiers).size, identifiers.length);
  for (const identifier of identifiers) {
    assert.match(identifier, /^[\x20-\x7e]+$/);
    assert.ok(Buffer.byteLength(identifier, "utf8") <= 63, `${identifier} exceeds 63 bytes`);
  }
});

test("PostgreSQL text arrays normalize independently of driver representation", () => {
  assert.deepEqual(normalizePostgresqlTextArray(["diagnosisId"]), ["diagnosisId"]);
  assert.deepEqual(normalizePostgresqlTextArray("{diagnosisId}"), ["diagnosisId"]);
  assert.deepEqual(normalizePostgresqlTextArray('{"collectionDataId","calculatedAt"}'), [
    "collectionDataId",
    "calculatedAt",
  ]);
  assert.throws(() => normalizePostgresqlTextArray("diagnosisId"), TypeError);
});

test(
  "applied IMP-006 schema has the expected constraints, indexes, triggers and zero backfill",
  { skip: process.env.IMP006_DATABASE_VARIABLE === undefined },
  async () => {
    await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
      await applyAreaMigration(client);
      await applyCollectionMigration(client);
      await applyEnvironmentalMigration(client);
      await applyUserAdministrationMigration(client);
      await applyIHFRDiagnosisMigration(client);
      await applyRemoveLegacyIsAdminMigration(client);

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
        "ExperimentalIHFRInput_collection_payload_key",
        "ExperimentalIHFRInputSupplement_createdByUserId_idx",
        "ExperimentalIHFRInput_measurement_idx",
        "IHFRDiagnosisLifecycleEvent_collectionDataId_occurredAt_idx",
        "IHFRDiagnosisLifecycleEvent_diagnosisId_occurredAt_idx",
        "IHFRDiagnosisLifecycleEvent_operationId_idx",
        "IHFRDiagnosisOperation_actorUserId_idempotencyKey_key",
        "IHFRDiagnosisOperation_diagnosisId_idx",
        "IHFRDiagnosisOperation_context_idx",
      ];
      const indexes = await client.query(
        `SELECT index_class.relname AS indexname,
                indexed_table.relname AS tablename,
                index_meta.indisunique,
                pg_get_expr(index_meta.indpred, index_meta.indrelid) AS predicate,
                array_agg(column_meta.attname ORDER BY key_column.ordinality) AS columns
           FROM pg_index index_meta
           JOIN pg_class index_class ON index_class.oid = index_meta.indexrelid
           JOIN pg_class indexed_table ON indexed_table.oid = index_meta.indrelid
           JOIN pg_namespace namespace ON namespace.oid = indexed_table.relnamespace
           CROSS JOIN LATERAL unnest(index_meta.indkey)
             WITH ORDINALITY AS key_column(attnum, ordinality)
           JOIN pg_attribute column_meta
             ON column_meta.attrelid = index_meta.indrelid
            AND column_meta.attnum = key_column.attnum
          WHERE namespace.nspname = current_schema()
            AND index_class.relname = ANY($1::text[])
            AND key_column.ordinality <= index_meta.indnkeyatts
          GROUP BY index_class.relname, indexed_table.relname,
                   index_meta.indisunique, index_meta.indpred, index_meta.indrelid
          ORDER BY index_class.relname`,
        [expectedIndexes],
      );
      assert.deepEqual(indexes.rows.map((row) => row.indexname), [...expectedIndexes].sort());
      assert.equal(new Set(indexes.rows.map((row) => row.indexname)).size, 15);
      assert.equal(indexes.rows.every((row) => Buffer.byteLength(row.indexname) <= 63), true);
      assert.equal(indexes.rows.every((row) => row.predicate === null), true);

      const expectedIndexShape = new Map<string, { columns: string[]; unique: boolean }>([
        ["CurrentExperimentalIHFRDiagnosis_diagnosisId_key", { columns: ["diagnosisId"], unique: true }],
        ["CurrentExperimentalIHFRDiagnosis_operationId_key", { columns: ["operationId"], unique: true }],
        ["ExperimentalIHFRDiagnosis_collectionDataId_calculatedAt_idx", { columns: ["collectionDataId", "calculatedAt"], unique: false }],
        ["ExperimentalIHFRDiagnosis_environmentalMeasurementSetId_idx", { columns: ["environmentalMeasurementSetId"], unique: false }],
        ["ExperimentalIHFRDiagnosis_inputSupplementId_idx", { columns: ["inputSupplementId"], unique: false }],
        ["ExperimentalIHFRDiagnosis_mathContractVersion_contractHash_idx", { columns: ["mathContractVersion", "contractHash"], unique: false }],
        ["ExperimentalIHFRInput_collection_payload_key", { columns: ["collectionDataId", "payloadHash"], unique: true }],
        ["ExperimentalIHFRInputSupplement_createdByUserId_idx", { columns: ["createdByUserId"], unique: false }],
        ["ExperimentalIHFRInput_measurement_idx", { columns: ["environmentalMeasurementSetId"], unique: false }],
        ["IHFRDiagnosisLifecycleEvent_collectionDataId_occurredAt_idx", { columns: ["collectionDataId", "occurredAt"], unique: false }],
        ["IHFRDiagnosisLifecycleEvent_diagnosisId_occurredAt_idx", { columns: ["diagnosisId", "occurredAt"], unique: false }],
        ["IHFRDiagnosisLifecycleEvent_operationId_idx", { columns: ["operationId"], unique: false }],
        ["IHFRDiagnosisOperation_actorUserId_idempotencyKey_key", { columns: ["actorUserId", "idempotencyKey"], unique: true }],
        ["IHFRDiagnosisOperation_diagnosisId_idx", { columns: ["diagnosisId"], unique: false }],
        ["IHFRDiagnosisOperation_context_idx", { columns: ["laboratoryRoomId", "collectionAreaId", "collectionDataId"], unique: false }],
      ]);
      for (const row of indexes.rows) {
        const expected = expectedIndexShape.get(row.indexname);
        assert.ok(expected);
        assert.deepEqual(normalizePostgresqlTextArray(row.columns), expected.columns);
        assert.equal(row.indisunique, expected.unique);
      }

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

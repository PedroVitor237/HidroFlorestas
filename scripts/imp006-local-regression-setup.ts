import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "pg";
import { localPostgresqlContext } from "../src/app/api/server/lib/local-postgresql-context";
import { setupAccountsDatabases } from "./accounts-database-setup";
import {
  migrationPath, collectionMigrationPath, environmentalMigrationPath,
  userAdministrationMigrationPath, ihfrDiagnosisMigrationPath, removeLegacyIsAdminMigrationPath,
  ihfrLifecycleReferenceMigrationPath,
} from "../tests/migration/migration-test-harness";

const marker = "hidroflorestas:imp006-regression:v2";
const names = ["imp006_regression_v2_test", "imp006_regression_v2_reference"] as const;
const readyFile = "regression-v2-ready.json";

async function verifyOwnedSchema(client: Client, name: typeof names[number], existing: boolean) {
  if (name === "imp006_regression_v2_reference") {
    const result = await client.query<{
      extraSchemas: number; publicRelations: number; publicFunctions: number;
      publicTypes: number; extraExtensions: number;
    }>(`
      SELECT
        (SELECT count(*)::int FROM pg_namespace
          WHERE nspname NOT IN ('public', 'pg_catalog', 'information_schema')
            AND nspname NOT LIKE 'pg_toast%' AND nspname NOT LIKE 'pg_temp_%') AS "extraSchemas",
        (SELECT count(*)::int FROM pg_class AS relation
          JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
          WHERE namespace.nspname = 'public') AS "publicRelations",
        (SELECT count(*)::int FROM pg_proc AS routine
          JOIN pg_namespace AS namespace ON namespace.oid = routine.pronamespace
          WHERE namespace.nspname = 'public') AS "publicFunctions",
        (SELECT count(*)::int FROM pg_type AS t
          JOIN pg_namespace AS namespace ON namespace.oid = t.typnamespace
          WHERE namespace.nspname = 'public' AND t.typtype IN ('c', 'd', 'e', 'r', 'm')) AS "publicTypes",
        (SELECT count(*)::int FROM pg_extension WHERE extname <> 'plpgsql') AS "extraExtensions"
    `);
    const inventory = result.rows[0];
    if (!inventory || Object.values(inventory).some((count) => count !== 0)) {
      throw new Error("Owned regression reference database contains non-system schema objects");
    }
    return;
  }

  const result = await client.query<{
    schemaMarker: string | null; ihfr: boolean; administration: boolean;
    outcomeCheck: boolean; lifecycleTriggers: number;
  }>(`
    SELECT
      (SELECT obj_description(oid, 'pg_namespace') FROM pg_namespace WHERE nspname = 'public') AS "schemaMarker",
      to_regclass('public."ExperimentalIHFRDiagnosis"') IS NOT NULL AS ihfr,
      to_regclass('public."AdministrativeAuditEvent"') IS NOT NULL AS administration,
      EXISTS (
        SELECT 1 FROM pg_constraint AS c
        JOIN pg_class AS relation ON relation.oid = c.conrelid
        JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
        WHERE namespace.nspname = 'public'
          AND relation.relname = 'IHFRDiagnosisOperation'
          AND c.conname = 'IHFRDiagnosisOperation_outcome_diagnosis_check'
          AND c.contype = 'c' AND c.convalidated
      ) AS "outcomeCheck",
      (
        SELECT count(*)::int FROM pg_trigger AS t
        JOIN pg_class AS relation ON relation.oid = t.tgrelid
        JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
        JOIN pg_proc AS f ON f.oid = t.tgfoid
        JOIN pg_namespace AS function_namespace ON function_namespace.oid = f.pronamespace
        WHERE namespace.nspname = 'public'
          AND function_namespace.nspname = 'public'
          AND f.proname = 'imp006_validate_lifecycle_references'
          AND t.tgenabled = 'O' AND NOT t.tgisinternal
          AND (relation.relname, t.tgname) IN (
            ('IHFRDiagnosisOperation', 'imp006_operation_reference'),
            ('CurrentExperimentalIHFRDiagnosis', 'imp006_current_operation'),
            ('IHFRDiagnosisLifecycleEvent', 'imp006_event_operation')
          )
      ) AS "lifecycleTriggers"
  `);
  const schema = result.rows[0];
  if ((existing && schema?.schemaMarker !== marker) || !schema?.ihfr || !schema.administration ||
      !schema.outcomeCheck || schema.lifecycleTriggers !== 3) {
    throw new Error("Owned regression test schema is incomplete or drifted; recreate the disposable database before running tests");
  }
}

async function main() {
  if (localPostgresqlContext().accounts) { await setupAccountsDatabases(); return; }
  if (process.env.IMP006_LOCAL_POSTGRESQL !== "1" || process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST") throw new Error("Owned local PostgreSQL guard required");
  const url = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (url.hostname !== "127.0.0.1" || url.port !== "55426" || url.pathname !== "/postgres") throw new Error("Regression setup requires the owned cluster's administrative database");
  const root = join(process.env.LOCALAPPDATA ?? "", "HidroFlorestas", "imp006-postgresql");
  const owner = JSON.parse((await readFile(join(root, "cluster-owner.json"), "utf8")).replace(/^\uFEFF/, "")) as { marker?: string; root?: string };
  if (owner.marker !== "hidroflorestas:imp006-local-postgresql:v1" || owner.root?.toLowerCase() !== root.toLowerCase()) throw new Error("Local cluster ownership marker does not match");
  await rm(join(root, readyFile), { force: true });
  const admin = new Client({ connectionString: url.toString() });
  const created: string[] = [];
  await admin.connect();
  try {
    for (const name of names) {
      const existing = await admin.query<{ marker: string | null }>("SELECT shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname=$1", [name]);
      const alreadyExists = Boolean(existing.rowCount);
      if (alreadyExists && existing.rows[0].marker !== marker) throw new Error(`Unowned regression database exists: ${name}`);
      if (!alreadyExists) {
        await admin.query(`CREATE DATABASE "${name}"`);
        created.push(name);
      }
      const databaseUrl = new URL(url);
      databaseUrl.pathname = `/${name}`;
      const database = new Client({ connectionString: databaseUrl.toString() });
      await database.connect();
      try {
        if (!alreadyExists && name === "imp006_regression_v2_test") {
          const files = ["tests/migration/area-registration-baseline.sql", migrationPath, collectionMigrationPath, environmentalMigrationPath, userAdministrationMigrationPath, ihfrDiagnosisMigrationPath, removeLegacyIsAdminMigrationPath, ihfrLifecycleReferenceMigrationPath];
          for (const file of files) await database.query(await readFile(file, "utf8"));
        }
        await verifyOwnedSchema(database, name, alreadyExists);
        if (name === "imp006_regression_v2_test") {
          // Only this marker-verified synthetic local database; no remote/application migration.
          const installed = await database.query("SELECT to_regclass('public.\"MailOutbox\"') IS NOT NULL AS present");
          if (!installed.rows[0].present) await database.query(await readFile("prisma/migrations/20261004000100_mail_foundation/migration.sql", "utf8"));
        }
        if (!alreadyExists && name === "imp006_regression_v2_test") await database.query(`COMMENT ON SCHEMA public IS '${marker}'`);
      } finally { await database.end(); }
      if (!alreadyExists) await admin.query(`COMMENT ON DATABASE "${name}" IS '${marker}'`);
    }
    await writeFile(join(root, readyFile), JSON.stringify({ marker, root }), { encoding: "utf8" });
    process.stdout.write("Owned local regression databases provisioned and verified.\n");
  } catch (error) {
    const cleanupFailures: unknown[] = [];
    for (const name of created.reverse()) {
      try { await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`); }
      catch (cleanupError) { cleanupFailures.push(cleanupError); }
    }
    if (cleanupFailures.length) throw new AggregateError([error, ...cleanupFailures], "Regression setup and cleanup failed");
    throw error;
  } finally { await admin.end(); }
}

void main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; });

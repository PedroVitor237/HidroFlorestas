import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "pg";
import {
  migrationPath, collectionMigrationPath, environmentalMigrationPath,
  userAdministrationMigrationPath, ihfrDiagnosisMigrationPath, removeLegacyIsAdminMigrationPath,
} from "../tests/migration/migration-test-harness";

const marker = "hidroflorestas:imp006-regression:v1";
const names = ["imp006_regression_test", "imp006_regression_reference"] as const;

async function main() {
  if (process.env.IMP006_LOCAL_POSTGRESQL !== "1" || process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST") throw new Error("Owned local PostgreSQL guard required");
  const url = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (url.hostname !== "127.0.0.1" || url.port !== "55426" || url.pathname !== "/postgres") throw new Error("Regression setup requires the owned cluster's administrative database");
  const root = join(process.env.LOCALAPPDATA ?? "", "HidroFlorestas", "imp006-postgresql");
  const owner = JSON.parse((await readFile(join(root, "cluster-owner.json"), "utf8")).replace(/^\uFEFF/, "")) as { marker?: string; root?: string };
  if (owner.marker !== "hidroflorestas:imp006-local-postgresql:v1" || owner.root?.toLowerCase() !== root.toLowerCase()) throw new Error("Local cluster ownership marker does not match");
  const admin = new Client({ connectionString: url.toString() });
  const created: string[] = [];
  await admin.connect();
  try {
    for (const name of names) {
      const existing = await admin.query<{ marker: string | null }>("SELECT shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname=$1", [name]);
      if (existing.rowCount) {
        if (existing.rows[0].marker !== marker) throw new Error(`Unowned regression database exists: ${name}`);
        continue;
      }
      await admin.query(`CREATE DATABASE "${name}"`);
      created.push(name);
      if (name === "imp006_regression_test") {
        const testUrl = new URL(url);
        testUrl.pathname = `/${name}`;
        const test = new Client({ connectionString: testUrl.toString() });
        await test.connect();
        try {
          const files = ["tests/migration/area-registration-baseline.sql", migrationPath, collectionMigrationPath, environmentalMigrationPath, userAdministrationMigrationPath, ihfrDiagnosisMigrationPath, removeLegacyIsAdminMigrationPath];
          for (const file of files) await test.query(await readFile(file, "utf8"));
          const verified = await test.query(`SELECT to_regclass('public."ExperimentalIHFRDiagnosis"') IS NOT NULL AS ihfr, to_regclass('public."AdministrativeAuditEvent"') IS NOT NULL AS administration`);
          if (!verified.rows[0]?.ihfr || !verified.rows[0]?.administration) throw new Error("Regression schema verification failed");
          await test.query(`COMMENT ON SCHEMA public IS '${marker}'`);
        } finally { await test.end(); }
      }
      await admin.query(`COMMENT ON DATABASE "${name}" IS '${marker}'`);
    }
    await writeFile(join(root, "regression-ready.json"), JSON.stringify({ marker, root }), { encoding: "utf8" });
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

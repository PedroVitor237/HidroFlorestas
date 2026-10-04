import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
import { Pool, type PoolClient } from "pg";
import { localPostgresqlContext } from "../../src/app/api/server/lib/local-postgresql-context";

export const migrationPath = "prisma/migrations/20260914000100_area_registration_and_membership_roles/migration.sql";
export const collectionMigrationPath = "prisma/migrations/20260915000100_collection_registration_metadata/migration.sql";
export const environmentalMigrationPath = "prisma/migrations/20260917000100_environmental_measurement_set/migration.sql";
export const userAdministrationMigrationPath = "prisma/migrations/20260919000100_user_administration/migration.sql";
export const ihfrDiagnosisMigrationPath = "prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql";
export const removeLegacyIsAdminMigrationPath = "prisma/migrations/20260920000100_remove_legacy_is_admin/migration.sql";
export const ihfrLifecycleReferenceMigrationPath = "prisma/migrations/20260926000100_ihfr_lifecycle_reference_integrity/migration.sql";

export function normalizePostgresqlTextArray(value: unknown): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  if (typeof value !== "string" || !value.startsWith("{") || !value.endsWith("}")) {
    throw new TypeError("Expected a PostgreSQL text array");
  }
  if (value === "{}") return [];

  const items: string[] = [];
  let item = "";
  let quoted = false;
  let escaped = false;
  for (const character of value.slice(1, -1)) {
    if (escaped) {
      item += character;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      items.push(item);
      item = "";
    } else {
      item += character;
    }
  }
  if (quoted || escaped) throw new TypeError("Malformed PostgreSQL text array");
  items.push(item);
  return items;
}

export function migrationTestEnvironment() {
  dotenv.config({ path: ".env", quiet: true });
  dotenv.config({ path: ".env.test.local", quiet: true });
  if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST") throw new Error("Test confirmation required");
  const test = new URL(process.env.TEST_DATABASE_URL ?? "");
  const development = new URL(process.env.DATABASE_URL ?? "");
  const identity = (url: URL) => `${url.hostname.replace("-pooler.", ".")}:${url.port || "5432"}${decodeURIComponent(url.pathname)}`;
  const ownedLocal = process.env.IMP006_LOCAL_POSTGRESQL === '1' && test.hostname === '127.0.0.1' && test.port === localPostgresqlContext().port;
  if (!['postgres:', 'postgresql:'].includes(test.protocol) || (identity(test) === identity(development) && !ownedLocal)) throw new Error("Unsafe test database");
  // Session settings used by the harness must never leak through Neon's shared
  // pooler into application connections after the temporary schema is dropped.
  test.hostname = test.hostname.replace("-pooler.", ".");
  return test.toString();
}

/** Each case commits against a fresh schema; finally drops only that generated schema. */
export async function withMigrationDatabase(
  run: (client: PoolClient) => Promise<void>,
  schemaPrefix = "imp003_test",
) {
  const connectionString = migrationTestEnvironment();
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  if (!/^imp00[34569]_test$/.test(schemaPrefix)) {
    throw new Error("Migration schema prefix is not allowlisted");
  }
  const schema = `${schemaPrefix}_${randomUUID().replaceAll("-", "")}`;
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);
    await client.query("SET statement_timeout = '15s'");
    await client.query(await readFile("tests/migration/area-registration-baseline.sql", "utf8"));
    await run(client);
  } finally {
    try {
    if (client) {
      try {
        await client.query("ROLLBACK");
        await client.query("RESET search_path");
        await client.query("RESET statement_timeout");
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        const left = await client.query("SELECT count(*)::int AS count FROM pg_namespace WHERE nspname=$1", [schema]);
        if (left.rows[0].count !== 0) throw new Error("Migration schema cleanup failed");
      } finally { client.release(); }
    }
    } finally { await pool.end(); }
  }
}

export async function applyAreaMigration(client: PoolClient) {
  await client.query(await readFile(migrationPath, "utf8"));
}

export async function applyCollectionMigration(client: PoolClient) {
  await client.query(await readFile(collectionMigrationPath, "utf8"));
}

export async function applyEnvironmentalMigration(client: PoolClient) {
  await client.query(await readFile(environmentalMigrationPath, "utf8"));
}

export async function applyUserAdministrationMigration(client: PoolClient) {
  await client.query(await readFile(userAdministrationMigrationPath, "utf8"));
}

export async function applyIHFRDiagnosisMigration(client: PoolClient) {
  await client.query(await readFile(ihfrDiagnosisMigrationPath, "utf8"));
}

export async function applyRemoveLegacyIsAdminMigration(client: PoolClient) {
  await client.query(await readFile(removeLegacyIsAdminMigrationPath, "utf8"));
}

export async function applyIHFRLifecycleReferenceMigration(client: PoolClient) {
  await client.query(await readFile(ihfrLifecycleReferenceMigrationPath, "utf8"));
}

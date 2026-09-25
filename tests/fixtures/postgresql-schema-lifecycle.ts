import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { Pool, type PoolClient } from "pg";
import { createPrismaClient } from "../../src/app/api/server/lib/prisma";
import { imp006Target } from "../../scripts/imp006-test-preflight";
import { matchesImp006Schema } from "../../src/app/api/server/ihfr-diagnosis/schema-guard";

const IMP006_SCHEMA_PREFIX = "imp006_test_";
const IMP006_SCHEMA_MARKER = "hidroflorestas:imp006-test-harness";
const TEST_CONFIRMATION = "HIDROFLORESTAS_AUTH_TEST";

export function canDropOwnedImp006Schema(schema: string, marker: string | null | undefined, createdThisRun: boolean): boolean {
  return createdThisRun && /^imp006_test_[0-9a-f]{32}$/.test(schema) && marker === IMP006_SCHEMA_MARKER;
}

export type Imp006DatabaseVariable = "TEST_DATABASE_URL" | "DATABASE_URL";

function selectedConnectionString(variable: Imp006DatabaseVariable): string {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("IMP-006 migration tests require NODE_ENV=test");
  }
  if (process.env.TEST_DATABASE_CONFIRMATION !== TEST_CONFIRMATION) {
    throw new Error("IMP-006 test database confirmation is required");
  }

  const value = process.env[variable];
  if (!value) throw new Error(`Selected IMP-006 database variable is empty: ${variable}`);
  if (variable === "TEST_DATABASE_URL") imp006Target();
  else if (process.env.IMP006_LOCAL_POSTGRESQL !== "1") throw new Error("Remote IMP-006 schema tests require TEST_DATABASE_URL");

  const url = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
    throw new Error("Selected IMP-006 database must use PostgreSQL");
  }
  if (url.hostname.split(".")[0].endsWith("-pooler")) throw new Error("IMP-006 isolated schema requires an explicit direct endpoint");
  return value;
}

export function selectedImp006DatabaseVariable(): Imp006DatabaseVariable {
  const selected = process.env.IMP006_DATABASE_VARIABLE;
  if (selected !== "TEST_DATABASE_URL" && selected !== "DATABASE_URL") {
    throw new Error("Set IMP006_DATABASE_VARIABLE explicitly for the IMP-006 test process");
  }
  return selected;
}

/**
 * Runs one IMP-006 scenario in a generated, allowlisted PostgreSQL schema.
 * The selected URL is used verbatim; this lifecycle never rewrites its host.
 */
export async function withImp006PostgresqlSchema(
  databaseVariable: Imp006DatabaseVariable,
  run: (client: PoolClient, applicationDb: ReturnType<typeof createPrismaClient>) => Promise<void>,
) {
  const connectionString = selectedConnectionString(databaseVariable);
  const schema = `${IMP006_SCHEMA_PREFIX}${randomUUID().replaceAll("-", "")}`;
  if (!/^imp006_test_[0-9a-f]{32}$/.test(schema) || schema === "public") {
    throw new Error("Generated IMP-006 schema is not allowlisted");
  }

  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client: PoolClient | undefined;
  let applicationDb: ReturnType<typeof createPrismaClient> | undefined;
  let primaryError: unknown;
  let cleanupError: unknown;
  let schemaCreated = false;
  let markerSet = false;

  try {
    client = await pool.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    schemaCreated = true;
    await client.query(`COMMENT ON SCHEMA "${schema}" IS '${IMP006_SCHEMA_MARKER}'`);
    markerSet = true;
    process.stdout.write(`IMP-006 schema owned by this run: ${schema}\n`);
    await client.query(`SET search_path TO "${schema}"`);
    const selected = await client.query("SELECT current_schema() AS schema");
    if (selected.rows[0]?.schema !== schema || selected.rows[0]?.schema === "public") {
      throw new Error("IMP-006 schema isolation failed");
    }
    await client.query("SET statement_timeout = '15s'");
    await client.query(await readFile("tests/migration/area-registration-baseline.sql", "utf8"));
    applicationDb = createPrismaClient(connectionString, schema);
    const appSchema = await applicationDb.$queryRawUnsafe<Array<{ schema: string }>>("SELECT current_schema()::text AS schema");
    if (!matchesImp006Schema(appSchema, schema)) throw new Error("IMP-006 application Prisma schema isolation failed");
    await run(client, applicationDb);
  } catch (error) {
    primaryError = error;
  } finally {
    const cleanupFailures: unknown[] = [];
    try { await applicationDb?.$disconnect(); } catch (error) { cleanupFailures.push(error); }
    if (client) {
      try {
        try { await client.query("ROLLBACK"); } catch (error) { cleanupFailures.push(error); }
        try { await client.query("RESET search_path"); } catch (error) { cleanupFailures.push(error); }
        try { await client.query("RESET statement_timeout"); } catch (error) { cleanupFailures.push(error); }
        if (schemaCreated) {
          try {
            const ownership = await client.query(
              "SELECT obj_description(oid, 'pg_namespace') AS marker FROM pg_namespace WHERE nspname = $1",
              [schema],
            );
            if (!markerSet || !canDropOwnedImp006Schema(schema, ownership.rows[0]?.marker, schemaCreated)) {
              throw new Error("IMP-006 schema ownership marker changed; cleanup refused");
            }
            await client.query(`DROP SCHEMA "${schema}" CASCADE`);
          } catch (error) { cleanupFailures.push(error); }
        }
        try {
          const remaining = await client.query("SELECT count(*)::int AS count FROM pg_namespace WHERE nspname = $1", [schema]);
          if (remaining.rows[0]?.count !== 0) throw new Error("IMP-006 schema cleanup failed");
        } catch (error) { cleanupFailures.push(error); }
      } finally { try { client.release(); } catch (error) { cleanupFailures.push(error); } }
    }
    try { await pool.end(); } catch (error) { cleanupFailures.push(error); }
    if (cleanupFailures.length) cleanupError = new AggregateError(cleanupFailures, "IMP-006 schema cleanup failed");
  }
  if (primaryError !== undefined && cleanupError !== undefined) throw new AggregateError([primaryError, cleanupError], "IMP-006 scenario and cleanup failed");
  if (primaryError !== undefined) throw primaryError;
  if (cleanupError !== undefined) throw cleanupError;
}

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { Pool, neonConfig, type PoolClient } from "@neondatabase/serverless";
import ws from "ws";

const IMP006_SCHEMA_PREFIX = "imp006_test_";
const IMP006_SCHEMA_MARKER = "hidroflorestas:imp006-test-harness";
const TEST_CONFIRMATION = "HIDROFLORESTAS_AUTH_TEST";

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

  const url = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
    throw new Error("Selected IMP-006 database must use PostgreSQL");
  }
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
  run: (client: PoolClient) => Promise<void>,
) {
  const connectionString = selectedConnectionString(databaseVariable);
  const schema = `${IMP006_SCHEMA_PREFIX}${randomUUID().replaceAll("-", "")}`;
  if (!/^imp006_test_[0-9a-f]{32}$/.test(schema) || schema === "public") {
    throw new Error("Generated IMP-006 schema is not allowlisted");
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client: PoolClient | undefined;
  let primaryError: unknown;

  try {
    client = await pool.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`COMMENT ON SCHEMA "${schema}" IS '${IMP006_SCHEMA_MARKER}'`);
    await client.query(`SET search_path TO "${schema}"`);
    const selected = await client.query("SELECT current_schema() AS schema");
    if (selected.rows[0]?.schema !== schema || selected.rows[0]?.schema === "public") {
      throw new Error("IMP-006 schema isolation failed");
    }
    await client.query("SET statement_timeout = '15s'");
    await client.query(await readFile("tests/migration/area-registration-baseline.sql", "utf8"));
    await run(client);
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    try {
      if (client) {
        try {
          await client.query("ROLLBACK");
          await client.query("RESET search_path");
          await client.query("RESET statement_timeout");
          await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
          const remaining = await client.query(
            "SELECT count(*)::int AS count FROM pg_namespace WHERE nspname = $1",
            [schema],
          );
          if (remaining.rows[0]?.count !== 0 && primaryError === undefined) {
            throw new Error("IMP-006 schema cleanup failed");
          }
        } finally {
          client.release();
        }
      }
    } finally {
      await pool.end();
    }
  }
}

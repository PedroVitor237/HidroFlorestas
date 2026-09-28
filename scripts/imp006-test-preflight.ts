import { createHash } from "node:crypto";
import { Pool } from "pg";

const confirmation = "HIDROFLORESTAS_AUTH_TEST";

function databaseUrl(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is required for IMP-006 database tests`);
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${name} is not a valid URL`); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.pathname.slice(1)) throw new Error(`${name} must identify a PostgreSQL database`);
  return url;
}

function identity(url: URL) {
  const host = url.hostname.replace(/-pooler(?=\.)/, ""); // Comparison only; never used as a connection URL.
  return `${host.toLowerCase()}:${url.port || '5432'}/${decodeURIComponent(url.pathname.slice(1))}`;
}

export function imp006Target(env: Record<string, string | undefined> = process.env) {
  if (env.TEST_DATABASE_CONFIRMATION !== confirmation) throw new Error("IMP-006 test database confirmation is required");
  if (env.IMP006_DATABASE_VARIABLE !== "TEST_DATABASE_URL") throw new Error("Set IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL before IMP-006 database tests");
  if (env.PLAYWRIGHT_BASE_URL) throw new Error("External Playwright server is not allowed for IMP-006 database tests");
  if (env.IMP006_TEST_SCHEMA || env.IMP006_LOCAL_REGRESSION_PUBLIC || (env.IMP006_LOCAL_POSTGRESQL && env.IMP006_LOCAL_POSTGRESQL !== "1")) throw new Error("Inherited IMP-006 schema/local flags are not allowed");
  const target = databaseUrl(env.TEST_DATABASE_URL, "TEST_DATABASE_URL");
  if (target.hostname.split(".")[0].endsWith("-pooler")) throw new Error("IMP-006 schema tests require an explicit direct TEST_DATABASE_URL, not a pooled endpoint");
  const development = databaseUrl(env.DATABASE_URL, "DATABASE_URL");
  if (env.IMP006_LOCAL_POSTGRESQL === "1") {
    if (target.hostname !== "127.0.0.1" || target.port !== "55426" || development.hostname !== "127.0.0.1" || development.port !== "55426") throw new Error("IMP-006 local mode requires the owned loopback cluster");
  } else if (identity(development) === identity(target)) throw new Error("IMP-006 test target matches the development database identity");
  return { connectionString: target.toString(), database: decodeURIComponent(target.pathname.slice(1)), fingerprint: createHash("sha256").update(identity(target)).digest("hex").slice(0, 12) };
}

export async function readOnlyImp006Preflight(env: Record<string, string | undefined> = process.env) {
  const target = imp006Target(env);
  const pool = new Pool({ connectionString: target.connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    const result = await client.query<{ database: string; schema: string; read_only: string }>("SELECT current_database() AS database, current_schema()::text AS schema, current_setting('transaction_read_only') AS read_only");
    if (result.rows[0]?.database !== target.database || result.rows[0]?.read_only !== "on" || !result.rows[0]?.schema) throw new Error("IMP-006 read-only database preflight mismatch");
    await client.query("ROLLBACK");
    return { fingerprint: target.fingerprint, databaseVerified: true, schema: result.rows[0].schema };
  } finally {
    if (client) { try { await client.query("ROLLBACK"); } finally { client.release(); } }
    await pool.end();
  }
}

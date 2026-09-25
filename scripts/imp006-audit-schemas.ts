import { Pool } from "pg";
import { imp006Target } from "./imp006-test-preflight";

async function main() {
  const target = imp006Target();
  const pool = new Pool({ connectionString: target.connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    const rows = await client.query<{ schema: string; marker: string | null }>("SELECT nspname AS schema, obj_description(oid, 'pg_namespace') AS marker FROM pg_namespace WHERE nspname LIKE 'imp006_test_%' ORDER BY nspname");
    process.stdout.write(`IMP-006 read-only audit target ${target.fingerprint}: ${rows.rows.length} candidate schemas.\n`);
    for (const row of rows.rows) process.stdout.write(`${row.schema} marker=${row.marker === 'hidroflorestas:imp006-test-harness' ? 'EXPECTED' : 'OTHER_OR_MISSING'}\n`);
    await client.query("ROLLBACK");
  } finally {
    if (client) { try { await client.query("ROLLBACK"); } finally { client.release(); } }
    await pool.end();
  }
}

void main().catch((error) => { process.stderr.write(`IMP-006 audit: ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; });

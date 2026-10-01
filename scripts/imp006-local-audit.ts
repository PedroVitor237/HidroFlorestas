import assert from "node:assert/strict";
import { Pool } from "pg";

const regressionMarker = "hidroflorestas:imp006-regression:v2";

function quoteIdentifier(name: string) {
  return `"${name.replaceAll('"', '""')}"`;
}

async function auditDatabase(connectionString: string, database: "postgres" | "imp006_regression_v2_test" | "imp006_regression_v2_reference") {
  const url = new URL(connectionString);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "55426");
  assert.equal(url.pathname, `/${database}`);
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    if (database !== "postgres") {
      const ownership = await client.query<{ marker: string | null }>(
        "SELECT shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname=current_database()",
      );
      assert.equal(ownership.rows[0]?.marker, regressionMarker, "Owned v2 database marker is required");
    }
    const temporarySchemas = await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM pg_namespace WHERE nspname ~ '^imp00[34569]_test_[0-9a-f]{32}$'`);
    const result: Record<string, number> = { temporarySchemas: temporarySchemas.rows[0].count };
    if (database === "imp006_regression_v2_test") {
      const tables = await client.query<{ relname: string }>(`
        SELECT relation.relname FROM pg_class AS relation
        JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
        WHERE namespace.nspname = 'public' AND relation.relkind = 'r'
        ORDER BY relation.relname
      `);
      let publicRows = 0;
      let nonemptyTables = 0;
      for (const table of tables.rows) {
        const rows = await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM public.${quoteIdentifier(table.relname)}`);
        const count = rows.rows[0]?.count ?? -1;
        assert.ok(Number.isInteger(count) && count >= 0, "Public table count must be valid");
        if (count !== 0) {
          nonemptyTables += 1;
          process.stdout.write(`${database}: nonempty public table ${table.relname} rows=${count}\n`);
        }
        publicRows += count;
      }
      const triggers = await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND t.tgname LIKE 'imp006_%_immutable' AND t.tgenabled='O'`);
      const referenceTriggers = await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND t.tgname IN ('imp006_operation_reference', 'imp006_current_operation', 'imp006_event_operation') AND t.tgenabled='O'`);
      result.publicTables = tables.rows.length;
      result.publicRows = publicRows;
      result.nonemptyTables = nonemptyTables;
      result.enabledIhfrImmutabilityTriggers = triggers.rows[0].count;
      result.enabledIhfrReferenceTriggers = referenceTriggers.rows[0].count;
      process.stdout.write(`${database}: ${JSON.stringify(result)}\n`);
      assert.equal(result.enabledIhfrImmutabilityTriggers, 4);
      assert.equal(result.enabledIhfrReferenceTriggers, 3);
      assert.equal(result.publicRows, 0, "All owned regression public tables must be empty after fixtures");
    }
    if (database === "imp006_regression_v2_reference") {
      const inventory = await client.query<{
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
      assert.ok(inventory.rows[0], "Owned reference database inventory is required");
      Object.assign(result, inventory.rows[0]);
      for (const count of Object.values(inventory.rows[0])) assert.equal(count, 0, "Owned reference database must have no non-system objects");
    }
    assert.equal(result.temporarySchemas, 0);
    if (database !== "imp006_regression_v2_test") process.stdout.write(`${database}: ${JSON.stringify(result)}\n`);
  } finally {
    try { if (client) await client.query("ROLLBACK"); }
    finally { client?.release(); await pool.end(); }
  }
}

async function main() {
  assert.equal(process.env.IMP006_LOCAL_POSTGRESQL, "1");
  assert.equal(process.env.TEST_DATABASE_CONFIRMATION, "HIDROFLORESTAS_AUTH_TEST");
  const testUrl = process.env.TEST_DATABASE_URL;
  const referenceUrl = process.env.DATABASE_URL;
  if (!testUrl || !referenceUrl) throw new Error("Owned regression databases are unavailable");
  await auditDatabase(testUrl, "imp006_regression_v2_test");
  await auditDatabase(referenceUrl, "imp006_regression_v2_reference");
  const postgresUrl = new URL(testUrl);
  postgresUrl.pathname = "/postgres";
  await auditDatabase(postgresUrl.toString(), "postgres");
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

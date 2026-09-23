import assert from "node:assert/strict";
import { Pool } from "pg";

async function auditDatabase(connectionString: string, database: "postgres" | "imp006_regression_test") {
  const url = new URL(connectionString);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "55426");
  assert.equal(url.pathname, `/${database}`);
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  try {
    const temporarySchemas = await pool.query(`SELECT count(*)::int AS count FROM pg_namespace WHERE nspname ~ '^imp00[34569]_test_[0-9a-f]{32}$'`);
    const result: Record<string, number> = { temporarySchemas: temporarySchemas.rows[0].count };
    if (database === "imp006_regression_test") {
      const fixtures = await pool.query(`SELECT count(*)::int AS count FROM "User" WHERE email LIKE '%@imp007.hidroflorestas.invalid'`);
      const laboratories = await pool.query(`SELECT count(*)::int AS count FROM "LaboratoryRoom" WHERE name LIKE 'IMP-007 E2E%'`);
      const ihfrRows = await pool.query(`SELECT
        (SELECT count(*) FROM "ExperimentalIHFRInputSupplement") +
        (SELECT count(*) FROM "ExperimentalIHFRDiagnosis") +
        (SELECT count(*) FROM "CurrentExperimentalIHFRDiagnosis") +
        (SELECT count(*) FROM "IHFRDiagnosisOperation") +
        (SELECT count(*) FROM "IHFRDiagnosisLifecycleEvent") AS count`);
      const triggers = await pool.query(`SELECT count(*)::int AS count FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND t.tgname LIKE 'imp006_%_immutable' AND t.tgenabled='O'`);
      result.territorialFixtureUsers = fixtures.rows[0].count;
      result.territorialFixtureLaboratories = laboratories.rows[0].count;
      result.publicIhfrRows = Number(ihfrRows.rows[0].count);
      result.enabledIhfrImmutabilityTriggers = triggers.rows[0].count;
      assert.equal(result.enabledIhfrImmutabilityTriggers, 4);
      assert.equal(result.territorialFixtureUsers, 0);
      assert.equal(result.territorialFixtureLaboratories, 0);
      assert.equal(result.publicIhfrRows, 0);
    }
    assert.equal(result.temporarySchemas, 0);
    process.stdout.write(`${database}: ${JSON.stringify(result)}\n`);
  } finally {
    await pool.end();
  }
}

async function main() {
  assert.equal(process.env.IMP006_LOCAL_POSTGRESQL, "1");
  assert.equal(process.env.TEST_DATABASE_CONFIRMATION, "HIDROFLORESTAS_AUTH_TEST");
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) throw new Error("Owned regression database is unavailable");
  await auditDatabase(testUrl, "imp006_regression_test");
  const postgresUrl = new URL(testUrl);
  postgresUrl.pathname = "/postgres";
  await auditDatabase(postgresUrl.toString(), "postgres");
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
import { Pool } from "pg";
import { describeImp006Error } from "./imp006-gate-diagnostics";
import { imp006Target, readOnlyImp006Preflight } from "./imp006-test-preflight";

/** Read-only inventory of one named full UI run; it never removes historical public records. */
async function main() {
  const runId = process.argv[2];
  const expected = process.argv[3];
  if (!/^HF007-UI-[A-Za-z0-9-]{6,50}$/.test(runId ?? "") ||
      !/^--expected-fingerprint=[0-9a-f]{12}$/.test(expected ?? "") || process.argv.length !== 4) {
    throw new Error("Provide a full UI run ID and --expected-fingerprint=<12 lowercase hex characters>");
  }
  const parsed = dotenv.parse(await readFile(".env.e2e.local"));
  const env = {
    DATABASE_URL: parsed.DATABASE_URL,
    TEST_DATABASE_URL: parsed.TEST_DATABASE_URL,
    TEST_DATABASE_CONFIRMATION: parsed.TEST_DATABASE_CONFIRMATION,
    IMP006_DATABASE_VARIABLE: parsed.IMP006_DATABASE_VARIABLE,
  };
  const target = await readOnlyImp006Preflight(env);
  assert.equal(target.fingerprint, expected.slice("--expected-fingerprint=".length));
  assert.equal(target.schema, "public");
  const pool = new Pool({ connectionString: imp006Target(env).connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  const client = await pool.connect();
  try {
    await client.query("BEGIN READ ONLY");
    await client.query("SET LOCAL statement_timeout = '15s'");
    const laboratories = await client.query<{ id: string; userId: string; status: string; role: string }>(
      `SELECT l.id, l."userId", u.status, u.role
         FROM public."LaboratoryRoom" AS l JOIN public."User" AS u ON u.id=l."userId"
        WHERE l.name=$1`, [`${runId} Laboratório`],
    );
    assert.equal(laboratories.rowCount, 1, "The exact full UI laboratory must occur once");
    const laboratory = laboratories.rows[0];
    assert.equal(laboratory.status, "ACTIVE");
    assert.equal(laboratory.role, "USER");
    const links = await client.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM public."ResearchersLinked" WHERE "userId"=$1`, [laboratory.userId],
    );
    const areas = await client.query<{ id: string }>(
      `SELECT id FROM public."CollectionArea" WHERE "laboratoryRoomId"=$1 AND name=$2`, [laboratory.id, `${runId} Área`],
    );
    assert.equal(areas.rowCount, 1, "The exact full UI area must occur once");
    const collections = await client.query<{ id: string }>(
      `SELECT id FROM public."CollectionData" WHERE "laboratoryRoomId"=$1 AND "collectionAreaId"=$2`,
      [laboratory.id, areas.rows[0].id],
    );
    assert.equal(collections.rowCount, 1, "The full UI collection must occur once");
    const collectionId = collections.rows[0].id;
    const measurement = await client.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM public."EnvironmentalMeasurementSet" WHERE "collectionDataId"=$1`, [collectionId],
    );
    const diagnoses = await client.query<{
      id: string; rawScore: number; displayScore: string; ihfrClass: string; dataQuality: string;
      componentScores: Record<string, number>; drivers: string[]; scientificState: string;
    }>(
      `SELECT id, "rawScore", "displayScore", "ihfrClass", "dataQuality", "componentScores", drivers, "scientificState"
         FROM public."ExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1 ORDER BY "createdAt", id`, [collectionId],
    );
    const operations = await client.query<{ operationType: string; outcome: string; diagnosisId: string | null }>(
      `SELECT "operationType", outcome, "diagnosisId" FROM public."IHFRDiagnosisOperation"
        WHERE "collectionDataId"=$1 ORDER BY "createdAt", id`, [collectionId],
    );
    const events = await client.query<{ eventType: string; diagnosisId: string }>(
      `SELECT "eventType", "diagnosisId" FROM public."IHFRDiagnosisLifecycleEvent"
        WHERE "collectionDataId"=$1 ORDER BY "occurredAt", id`, [collectionId],
    );
    const current = await client.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM public."CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1`, [collectionId],
    );
    assert.equal(measurement.rows[0]?.count, 1);
    assert.equal(diagnoses.rowCount, 2);
    assert.equal(operations.rowCount, 3);
    assert.equal(events.rowCount, 4);
    assert.equal(current.rows[0]?.count, 0);
    process.stdout.write(`${JSON.stringify({
      targetFingerprint: target.fingerprint,
      runId,
      laboratoryId: laboratory.id,
      areaId: areas.rows[0].id,
      collectionId,
      account: { status: laboratory.status, role: laboratory.role, links: links.rows[0]?.count },
      measurementCount: measurement.rows[0]?.count,
      diagnoses: diagnoses.rows,
      operations: operations.rows,
      lifecycleEvents: events.rows,
      currentCount: current.rows[0]?.count,
    }, null, 2)}\n`);
    await client.query("ROLLBACK");
  } finally {
    try { await client.query("ROLLBACK"); } finally { client.release(); await pool.end(); }
  }
}

void main().catch(error => {
  process.stderr.write(`IMP-006 UI inventory: ${describeImp006Error(error, process.env)}\n`);
  process.exitCode = 1;
});

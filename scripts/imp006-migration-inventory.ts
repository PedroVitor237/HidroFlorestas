import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
import { Pool } from "pg";
import { describeImp006Error } from "./imp006-gate-diagnostics";
import { imp006Target, readOnlyImp006Preflight } from "./imp006-test-preflight";

let inventoryEnv: Record<string, string | undefined> = {};

async function main() {
  const expected = process.argv[2];
  if (!/^--expected-fingerprint=[0-9a-f]{12}$/.test(expected ?? "") || process.argv.length !== 3) {
    throw new Error("Provide --expected-fingerprint=<12 lowercase hex characters>");
  }
  const parsed = dotenv.parse(await readFile(".env.e2e.local"));
  const env = {
    DATABASE_URL: parsed.DATABASE_URL,
    TEST_DATABASE_URL: parsed.TEST_DATABASE_URL,
    TEST_DATABASE_CONFIRMATION: parsed.TEST_DATABASE_CONFIRMATION,
    IMP006_DATABASE_VARIABLE: parsed.IMP006_DATABASE_VARIABLE,
  };
  inventoryEnv = env;
  const preflight = await readOnlyImp006Preflight(env);
  if (preflight.fingerprint !== expected.slice("--expected-fingerprint=".length) || preflight.schema !== "public") {
    throw new Error("Configured target fingerprint or schema does not match the expected read-only inventory destination");
  }
  const files = execFileSync("git", ["ls-files", "--", "prisma/migrations"], { encoding: "utf8" })
    .split(/\r?\n/).filter((file) => /\/migration\.sql$/.test(file));
  const git = await Promise.all(files.map(async (file) => ({
    name: file.split("/")[2],
    sha256Versioned: createHash("sha256").update(execFileSync("git", ["show", `HEAD:${file}`])).digest("hex"),
    sha256Worktree: createHash("sha256").update(await readFile(file)).digest("hex"),
  })));
  const target = imp006Target(env);
  const pool = new Pool({ connectionString: target.connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    const exists = await client.query<{ history: string | null }>("SELECT to_regclass('public._prisma_migrations')::text AS history");
    if (!exists.rows[0]?.history) throw new Error("Prisma migration history table is absent on the configured destination");
    const history = await client.query<{
      migration_name: string; checksum: string; started_at: Date; finished_at: Date | null;
      rolled_back_at: Date | null; applied_steps_count: number;
    }>(`SELECT migration_name, checksum, started_at, finished_at, rolled_back_at, applied_steps_count
        FROM public._prisma_migrations ORDER BY started_at, migration_name`);
    const versioned = new Map(git.map((item) => [item.name, item]));
    const rows = history.rows.map((row) => ({
      name: row.migration_name,
      checksum: row.checksum,
      checksumMatchesGit: versioned.has(row.migration_name) ? row.checksum.toLowerCase() === versioned.get(row.migration_name)?.sha256Versioned : null,
      checksumMatchesWorktree: versioned.has(row.migration_name) ? row.checksum.toLowerCase() === versioned.get(row.migration_name)?.sha256Worktree : null,
      versioned: versioned.has(row.migration_name),
      startedAt: row.started_at.toISOString(),
      finishedAt: row.finished_at?.toISOString() ?? null,
      rolledBackAt: row.rolled_back_at?.toISOString() ?? null,
      appliedStepsCount: row.applied_steps_count,
    }));
    const dbNames = new Set(rows.map((row) => row.name));
    process.stdout.write(`${JSON.stringify({
      targetFingerprint: preflight.fingerprint,
      schema: preflight.schema,
      git,
      history: rows,
      missingFromDatabase: git.map((item) => item.name).filter((name) => !dbNames.has(name)),
    }, null, 2)}\n`);
    await client.query("ROLLBACK");
  } finally {
    if (client) { try { await client.query("ROLLBACK"); } finally { client.release(); } }
    await pool.end();
  }
}

void main().catch((error) => {
  process.stderr.write(`IMP-006 migration inventory: ${describeImp006Error(error, inventoryEnv)}\n`);
  process.exitCode = 1;
});

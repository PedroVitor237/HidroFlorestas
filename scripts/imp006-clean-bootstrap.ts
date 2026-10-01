import { randomBytes, createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "pg";
import { describeImp006Error, runImp006Gate } from "./imp006-gate-diagnostics";

const clusterMarker = "hidroflorestas:imp006-local-postgresql:v1";
const databaseMarker = "hidroflorestas:imp006-clean-bootstrap:v1";

function assertOwnedLocalCluster(): URL {
  if (process.env.IMP006_LOCAL_POSTGRESQL !== "1" || process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST") {
    throw new Error("Owned local PostgreSQL confirmation is required");
  }
  const url = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (url.hostname !== "127.0.0.1" || url.port !== "55426" || url.pathname !== "/postgres") {
    throw new Error("Clean bootstrap requires the owned local cluster administration database");
  }
  return url;
}

async function assertClusterMarker() {
  const root = join(process.env.LOCALAPPDATA ?? "", "HidroFlorestas", "imp006-postgresql");
  const saved = JSON.parse((await readFile(join(root, "cluster-owner.json"), "utf8")).replace(/^\uFEFF/, "")) as { marker?: string; root?: string; port?: number };
  if (saved.marker !== clusterMarker || saved.root?.toLowerCase() !== root.toLowerCase() || saved.port !== 55426) {
    throw new Error("Local PostgreSQL ownership marker mismatch");
  }
}

async function main() {
  const withVersionedBaseline = process.argv.slice(2).includes("--with-versioned-baseline");
  if (process.argv.slice(2).some((argument) => argument !== "--with-versioned-baseline")) {
    throw new Error("Unknown clean bootstrap argument");
  }
  const administrativeUrl = assertOwnedLocalCluster();
  await assertClusterMarker();
  const name = `imp006_bootstrap_${randomBytes(8).toString("hex")}`;
  const quoteName = `"${name}"`; // name is generated from a fixed prefix and hex only.
  const databaseUrl = new URL(administrativeUrl);
  databaseUrl.pathname = `/${name}`;
  const versionedMigrations = execFileSync("git", ["ls-files", "--", "prisma/migrations"], { encoding: "utf8" })
    .split(/\r?\n/).filter((path) => /\/migration\.sql$/.test(path));
  if (versionedMigrations.length === 0) throw new Error("No versioned Prisma migrations found");
  const firstMigration = versionedMigrations[0];
  const firstMigrationName = firstMigration?.split("/")[2];
  if (firstMigrationName !== "20260907120000_unique_laboratory_access_code") {
    throw new Error("Fresh-install baseline no longer matches the first versioned migration");
  }
  const firstMigrationSql = (await readFile(firstMigration, "utf8")).trim();
  if (firstMigrationSql !== 'CREATE UNIQUE INDEX "LaboratoryRoom_accessCode_key" ON "LaboratoryRoom"("accessCode");') {
    throw new Error("First versioned migration SQL has changed; fresh-install baseline requires review");
  }
  const fingerprint = createHash("sha256").update(`127.0.0.1:55426/${name}`).digest("hex").slice(0, 12);
  const admin = new Client({ connectionString: administrativeUrl.toString() });
  let created = false;
  let primaryError: unknown;
  let cleanupError: unknown;
  await admin.connect();
  try {
    const collision = await admin.query("SELECT 1 FROM pg_database WHERE datname=$1", [name]);
    if (collision.rowCount) throw new Error("Generated bootstrap database already exists");
    await admin.query(`CREATE DATABASE ${quoteName}`);
    created = true;
    await admin.query(`COMMENT ON DATABASE ${quoteName} IS '${databaseMarker}'`);
    process.stdout.write(`IMP-006 clean bootstrap created owned disposable database ${name}, fingerprint ${fingerprint}.\n`);

    const target = new Client({ connectionString: databaseUrl.toString() });
    await target.connect();
    try {
      await target.query("BEGIN READ ONLY");
      const empty = await target.query<{ tables: number; history: string | null }>(`SELECT
        (SELECT count(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE') AS tables,
        to_regclass('public._prisma_migrations')::text AS history`);
      if (empty.rows[0]?.tables !== 0 || empty.rows[0]?.history !== null) throw new Error("Disposable database is not empty before migrate deploy");
      await target.query("ROLLBACK");
      process.stdout.write("IMP-006 clean bootstrap preflight: zero application tables and no Prisma history.\n");
      if (withVersionedBaseline) {
        const baseline = await readFile(join("prisma", "bootstrap", "initial-legacy-baseline.sql"), "utf8");
        await target.query("BEGIN");
        try {
          await target.query(baseline);
          await target.query("COMMIT");
        } catch (error) {
          await target.query("ROLLBACK");
          throw error;
        }
        const firstEffect = await target.query<{ index_name: string | null }>(
          `SELECT to_regclass('public."LaboratoryRoom_accessCode_key"')::text AS index_name`,
        );
        if (!firstEffect.rows[0]?.index_name) throw new Error("Fresh-install baseline did not materialize the first migration index");
        process.stdout.write("IMP-006 clean bootstrap: versioned fresh-install baseline applied to the owned disposable database.\n");
      }
    } finally {
      try { await target.query("ROLLBACK"); } catch { /* transaction may already be closed */ }
      await target.end();
    }

    const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: databaseUrl.toString() };
    delete env.IMP006_UI_PASSWORD;
    if (withVersionedBaseline) {
      const resolved = await runImp006Gate("clean-baseline-resolve", ["node_modules/prisma/build/index.js", "migrate", "resolve", "--applied", firstMigrationName], env,
        { fingerprint, schema: "public", attempt: 1 });
      if (resolved.exitCode !== 0) throw new Error(`Fresh-install baseline resolution failed with exit ${resolved.exitCode}; sanitized log: ${resolved.logPath}`);
    }
    const deploy = await runImp006Gate("clean-migrate-deploy", ["node_modules/prisma/build/index.js", "migrate", "deploy"], env,
      { fingerprint, schema: "public", attempt: 1 });
    if (deploy.exitCode !== 0) throw new Error(`Clean migrate deploy failed with exit ${deploy.exitCode}; sanitized log: ${deploy.logPath}`);

    const verified = new Client({ connectionString: databaseUrl.toString() });
    await verified.connect();
    try {
      await verified.query("BEGIN READ ONLY");
      const outcome = await verified.query<{ completed: number; failed: number; user_table: string | null; ihfr_table: string | null }>(`SELECT
        (SELECT count(*)::int FROM public._prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS completed,
        (SELECT count(*)::int FROM public._prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL) AS failed,
        to_regclass('public."User"')::text AS user_table,
        to_regclass('public."ExperimentalIHFRDiagnosis"')::text AS ihfr_table`);
      const row = outcome.rows[0];
      if (!row || row.completed !== versionedMigrations.length || row.failed !== 0 || !row.user_table || !row.ihfr_table) throw new Error("Clean migration outcome is incomplete");
      await verified.query("ROLLBACK");
      process.stdout.write(`IMP-006 clean bootstrap: ${row.completed} migrations completed, zero failed, core tables present.\n`);
      const syntheticId = randomBytes(16).toString("hex");
      await verified.query("BEGIN");
      await verified.query(`INSERT INTO public."User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ($1,$2,'Bootstrap','Synthetic','not-a-login-password',now())`,
        [syntheticId, `${name}@example.invalid`]);
      const smoke = await verified.query<{ count: number }>(`SELECT count(*)::int AS count FROM public."User" WHERE id=$1`, [syntheticId]);
      if (smoke.rows[0]?.count !== 1) throw new Error("Clean bootstrap read/write smoke failed");
      await verified.query("ROLLBACK");
      process.stdout.write("IMP-006 clean bootstrap: synthetic read/write transaction passed and rolled back.\n");
    } finally {
      try { await verified.query("ROLLBACK"); } catch { /* transaction may already be closed */ }
      await verified.end();
    }
  } catch (error) { primaryError = error; }
  finally {
    if (created) {
      try {
        const owned = await admin.query<{ marker: string | null }>("SELECT shobj_description(oid, 'pg_database') AS marker FROM pg_database WHERE datname=$1", [name]);
        if (owned.rows[0]?.marker !== databaseMarker) throw new Error("Clean bootstrap database ownership marker mismatch; preserving database");
        await admin.query(`DROP DATABASE ${quoteName}`);
        const remaining = await admin.query("SELECT 1 FROM pg_database WHERE datname=$1", [name]);
        if (remaining.rowCount) throw new Error("Owned bootstrap database still exists after disposal");
        process.stdout.write(`IMP-006 clean bootstrap disposed owned database ${name}.\n`);
      } catch (error) { cleanupError = error; }
    }
    await admin.end();
  }
  if (primaryError && cleanupError) throw new AggregateError([primaryError, cleanupError], "Clean bootstrap and cleanup failed");
  if (primaryError) throw primaryError;
  if (cleanupError) throw cleanupError;
}

void main().catch((error) => {
  process.stderr.write(`IMP-006 clean bootstrap: ${describeImp006Error(error, process.env)}\n`);
  process.exitCode = 1;
});

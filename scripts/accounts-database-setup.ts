import { readFile, readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Client } from "pg";
import { createHash } from "node:crypto";
import { describeImp006Error, runImp006Gate } from "./imp006-gate-diagnostics";
import { localPostgresqlContext } from "../src/app/api/server/lib/local-postgresql-context";

const firstMigration = "20260907120000_unique_laboratory_access_code";
const applicationMarker = "hidroflorestas:accounts-development:v1";

export async function setupAccountsDatabases() {
  const context = localPostgresqlContext();
  if (!context.accounts || process.env.IMP006_LOCAL_POSTGRESQL !== "1" || process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST") throw new Error("Accounts owned local cluster opt-in is required");
  const adminUrl = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (adminUrl.hostname !== "127.0.0.1" || adminUrl.port !== context.port || adminUrl.pathname !== "/postgres" || decodeURIComponent(adminUrl.username) !== context.owner) throw new Error("Accounts setup requires its own administration database");
  const root = resolve(process.env.LOCALAPPDATA ?? "", "HidroFlorestas", context.directory);
  const cluster = JSON.parse((await readFile(join(root, "cluster-owner.json"), "utf8")).replace(/^\uFEFF/, "")) as { marker?: string; root?: string; port?: number; owner?: string };
  if (cluster.marker !== context.clusterMarker || cluster.root?.toLowerCase() !== root.toLowerCase() || cluster.port !== Number(context.port) || cluster.owner !== context.owner) throw new Error("Accounts cluster ownership marker mismatch");
  const admin = new Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  try {
    const identity = await admin.query<{ owner: string; directory: string }>("SELECT current_user AS owner,current_setting('data_directory') AS directory");
    if (identity.rows[0]?.owner !== context.owner || resolve(identity.rows[0].directory).toLowerCase() !== resolve(root, "data").toLowerCase()) throw new Error("Accounts cluster runtime identity mismatch");
    const lock = await admin.query<{ acquired: boolean }>("SELECT pg_try_advisory_lock(17012,1) AS acquired");
    if (!lock.rows[0]?.acquired) throw new Error("Accounts database setup is already running");
    await rm(join(root, "regression-v2-ready.json"), { force: true });
    const migrations = (await readdir("prisma/migrations", { withFileTypes: true })).filter((entry) => entry.isDirectory() && /^\d{14}_[a-z0-9_]+$/.test(entry.name)).map((entry) => entry.name).sort();
    if (migrations[0] !== firstMigration || (await readFile(`prisma/migrations/${firstMigration}/migration.sql`, "utf8")).trim() !== 'CREATE UNIQUE INDEX "LaboratoryRoom_accessCode_key" ON "LaboratoryRoom"("accessCode");') throw new Error("Versioned bootstrap no longer matches the first migration");
    const databases = [
      { name: "accounts_development", marker: applicationMarker, bootstrap: true },
      { name: context.testDatabase, marker: context.regressionMarker, bootstrap: true },
      { name: context.referenceDatabase, marker: context.regressionMarker, bootstrap: false },
    ];
    await mkdir(".accounts-validation", { recursive: true });
    for (const database of databases) {
      const existing = await admin.query<{ marker: string | null; owner: string }>("SELECT shobj_description(oid,'pg_database') AS marker,pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname=$1", [database.name]);
      if (existing.rowCount && (existing.rows[0].marker !== database.marker || existing.rows[0].owner !== context.owner)) throw new Error("Unexpected accounts database ownership; preserving all data");
      const fresh = !existing.rowCount;
      if (fresh) {
        await admin.query(`CREATE DATABASE "${database.name}"`);
        await admin.query(`COMMENT ON DATABASE "${database.name}" IS '${database.marker}'`);
      }
      const url = new URL(adminUrl); url.pathname = `/${database.name}`;
      const target = new Client({ connectionString: url.toString() }); await target.connect();
      try {
        const inventory = await target.query<{ relations: number; history: string | null; schemas: number }>(`SELECT
          (SELECT count(*)::int FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public') AS relations,
          to_regclass('public._prisma_migrations')::text AS history,
          (SELECT count(*)::int FROM pg_namespace WHERE nspname NOT IN ('public','pg_catalog','information_schema') AND nspname NOT LIKE 'pg_toast%' AND nspname NOT LIKE 'pg_temp_%') AS schemas`);
        const observed = inventory.rows[0];
        if (!observed || observed.schemas !== 0 || ((fresh || !database.bootstrap) && (observed.relations !== 0 || observed.history !== null))) throw new Error("Accounts database contains unexpected objects; preserving data");
        if (database.bootstrap) {
          if (!fresh && !observed.history) throw new Error("Accounts database has an incomplete bootstrap; inspect it before resuming");
          if (!fresh) {
            const history = await target.query<{ migration_name: string; checksum: string; finished_at: Date | null; rolled_back_at: Date | null }>("SELECT migration_name,checksum,finished_at,rolled_back_at FROM public._prisma_migrations");
            for (const applied of history.rows.filter((row) => row.rolled_back_at === null)) {
              if (!applied.finished_at || !migrations.includes(applied.migration_name)) throw new Error("Accounts migration history is incomplete or unexpected; preserving database");
              const checksum = createHash("sha256").update(await readFile(`prisma/migrations/${applied.migration_name}/migration.sql`)).digest("hex");
              if (checksum !== applied.checksum) throw new Error("An applied accounts migration differs from source; explicit reconciliation is required, database was preserved");
            }
          }
          if (fresh) {
            await target.query("BEGIN");
            try { await target.query(await readFile("prisma/bootstrap/initial-legacy-baseline.sql", "utf8")); await target.query("COMMIT"); }
            catch (error) { await target.query("ROLLBACK"); throw error; }
            const index = await target.query("SELECT to_regclass('public.\"LaboratoryRoom_accessCode_key\"') IS NOT NULL AS present");
            if (!index.rows[0]?.present) throw new Error("Accounts baseline did not materialize the first migration index");
          }
          const env = { ...process.env, DATABASE_URL: url.toString() };
          if (fresh) {
            const outcome = await runImp006Gate("accounts-baseline-resolve", ["node_modules/prisma/build/index.js", "migrate", "resolve", "--applied", firstMigration], env);
            if (outcome.exitCode) throw new Error("Accounts baseline resolution failed; database was preserved");
          }
          const outcome = await runImp006Gate("accounts-migrate-deploy", ["node_modules/prisma/build/index.js", "migrate", "deploy"], env);
          if (outcome.exitCode) throw new Error("Accounts migration deploy failed; database was preserved");
          const installed = await target.query<{ completed: number; failed: number }>("SELECT count(*) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL)::int AS completed,count(*) FILTER (WHERE finished_at IS NULL AND rolled_back_at IS NULL)::int AS failed FROM public._prisma_migrations");
          if (installed.rows[0]?.completed !== migrations.length || installed.rows[0]?.failed !== 0) throw new Error("Accounts migrations are incomplete");
          if (database.name === context.testDatabase) await target.query(`COMMENT ON SCHEMA public IS '${context.regressionMarker}'`);
          process.stdout.write(`Accounts database ${database.name}: ${migrations.length} migrations verified; no account data imported.\n`);
        }
      } finally { await target.end(); }
    }
    await writeFile(join(root, "regression-v2-ready.json"), JSON.stringify({ marker: context.regressionMarker, root }), "utf8");
    process.stdout.write("Accounts development, regression test and empty reference databases are ready on the dedicated cluster.\n");
  } finally { await admin.end(); }
}

if (process.argv[1]?.endsWith("accounts-database-setup.ts")) void setupAccountsDatabases().catch((error) => { process.stderr.write(`Accounts database setup: ${describeImp006Error(error, process.env)}\n`); process.exitCode = 1; });

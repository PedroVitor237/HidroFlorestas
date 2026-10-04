import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Client } from "pg";
import { describeImp006Error, runImp006Gate } from "./imp006-gate-diagnostics";

const confirmation = "NEW_AUTHORIZED_ACCOUNTS_HOMOLOGATION";
const marker = "hidroflorestas:accounts-homologation:v1";
const firstMigration = "20260907120000_unique_laboratory_access_code";

/** Run only with the direct endpoint obtained from the newly created Neon project. */
async function main() {
  if (process.env.ACCOUNTS_REMOTE_BOOTSTRAP_CONFIRMATION !== confirmation) throw new Error("Explicit authorized homologation confirmation is required");
  const endpoint = new URL(process.env.DATABASE_URL ?? "");
  const expectedHost = process.env.ACCOUNTS_REMOTE_DATABASE_HOST;
  if (!expectedHost || endpoint.hostname !== expectedHost || !/^ep-[a-z0-9-]+(?:\.c-[0-9]+)?\.[a-z0-9-]+\.aws\.neon\.tech$/.test(expectedHost)
    || expectedHost.split(".")[0].endsWith("-pooler") || endpoint.pathname !== "/accounts_homologation"
    || !["postgres:", "postgresql:"].includes(endpoint.protocol) || decodeURIComponent(endpoint.username) !== "accounts_owner"
    || endpoint.searchParams.get("sslmode") !== "require" || endpoint.searchParams.has("options") || endpoint.searchParams.has("schema")
    || process.env.IMP006_LOCAL_POSTGRESQL || process.env.ACCOUNTS_LOCAL_APP || process.env.TEST_DATABASE_URL) {
    throw new Error("The direct, TLS-protected, isolated accounts database identity must match its private provisioning record");
  }
  const migrations = (await readdir("prisma/migrations", { withFileTypes: true }))
    .filter(entry => entry.isDirectory() && /^\d{14}_[a-z0-9_]+$/.test(entry.name)).map(entry => entry.name).sort();
  if (migrations[0] !== firstMigration || (await readFile(`prisma/migrations/${firstMigration}/migration.sql`, "utf8")).trim()
    !== 'CREATE UNIQUE INDEX "LaboratoryRoom_accessCode_key" ON "LaboratoryRoom"("accessCode");') throw new Error("Versioned bootstrap identity differs");
  const client = new Client({ connectionString: endpoint.toString() });
  await client.connect();
  try {
    const identity = await client.query<{ database: string; owner: string; marker: string | null }>(
      "SELECT current_database() AS database,current_user AS owner,shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()"
    );
    if (identity.rows[0]?.database !== "accounts_homologation" || identity.rows[0]?.owner !== "accounts_owner") throw new Error("Remote database runtime identity differs");
    const locked = await client.query<{ acquired: boolean }>("SELECT pg_try_advisory_lock(17012,2) AS acquired");
    if (!locked.rows[0]?.acquired) throw new Error("Another accounts installation is running");
    const objects = await client.query<{ relations: number; history: string | null; schemas: number }>(`SELECT
      (SELECT count(*)::int FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public') AS relations,
      to_regclass('public._prisma_migrations')::text AS history,
      (SELECT count(*)::int FROM pg_namespace WHERE nspname NOT IN ('public','pg_catalog','information_schema') AND nspname NOT LIKE 'pg_toast%' AND nspname NOT LIKE 'pg_temp_%') AS schemas`);
    const observed = objects.rows[0];
    if (!observed || observed.schemas !== 0) throw new Error("Unexpected remote schemas; database preserved");
    const fresh = observed.relations === 0 && observed.history === null;
    if (fresh) {
      if (identity.rows[0].marker !== null && identity.rows[0].marker !== marker) throw new Error("Remote database already belongs to another installation");
      await client.query("BEGIN");
      try {
        await client.query(await readFile("prisma/bootstrap/initial-legacy-baseline.sql", "utf8"));
        await client.query(`COMMENT ON DATABASE "accounts_homologation" IS '${marker}'`);
        await client.query("COMMIT");
      } catch (error) { await client.query("ROLLBACK"); throw error; }
      const index = await client.query<{ present: boolean }>("SELECT to_regclass('public.\"LaboratoryRoom_accessCode_key\"') IS NOT NULL AS present");
      if (!index.rows[0]?.present) throw new Error("Baseline index is absent; no migration will be resolved");
      const outcome = await runImp006Gate("accounts-remote-baseline-resolve", ["node_modules/prisma/build/index.js", "migrate", "resolve", "--applied", firstMigration], process.env);
      if (outcome.exitCode) throw new Error("Baseline resolution failed; inspect the preserved database");
    } else {
      if (identity.rows[0].marker !== marker || observed.history === null) throw new Error("Remote installation is unowned or incomplete; database preserved");
      const history = await client.query<{ migration_name: string; checksum: string; finished_at: Date | null; rolled_back_at: Date | null }>(
        "SELECT migration_name,checksum,finished_at,rolled_back_at FROM public._prisma_migrations"
      );
      for (const row of history.rows.filter(row => row.rolled_back_at === null)) {
        if (!row.finished_at || !migrations.includes(row.migration_name)) throw new Error("Incomplete or unexpected remote migration history");
        const hash = createHash("sha256").update(await readFile(`prisma/migrations/${row.migration_name}/migration.sql`)).digest("hex");
        if (row.checksum !== hash) throw new Error("Applied migration checksum differs; explicit reconciliation required");
      }
    }
    for (const operation of ["deploy", "status"]) {
      const outcome = await runImp006Gate(`accounts-remote-migrate-${operation}`, ["node_modules/prisma/build/index.js", "migrate", operation], process.env);
      if (outcome.exitCode) throw new Error("Remote migration operation failed; database preserved");
    }
    const installed = await client.query<{ completed: number; failed: number }>(
      "SELECT count(*) FILTER(WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL)::int AS completed,count(*) FILTER(WHERE finished_at IS NULL AND rolled_back_at IS NULL)::int AS failed FROM public._prisma_migrations"
    );
    if (installed.rows[0]?.completed !== migrations.length || installed.rows[0]?.failed !== 0) throw new Error("Remote migrations are incomplete");
    const accounts = await client.query<{ count: number }>('SELECT count(*)::int AS count FROM public."User"');
    if (fresh && accounts.rows[0]?.count !== 0) throw new Error("Fresh homologation unexpectedly contains accounts");
    process.stdout.write(JSON.stringify({ database: "accounts_homologation", migrations: migrations.length, failed: 0, fresh, importedAccounts: 0, result: "PASS" }) + "\n");
  } finally { await client.end(); }
}

void main().catch(error => { process.stderr.write(`Accounts remote bootstrap: ${describeImp006Error(error, process.env)}\n`); process.exitCode = 1; });

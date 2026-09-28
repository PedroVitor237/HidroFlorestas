import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Client } from "pg";
import { describeImp006Error } from "./imp006-gate-diagnostics";

const marker = "hidroflorestas:imp006-regression:v2";
const databases = ["imp006_regression_v2_test", "imp006_regression_v2_reference"] as const;
type DatabaseName = typeof databases[number];
const expectedTables = [
  "User", "AdministrativeAuditEvent", "LaboratoryRoom", "ResearchersLinked", "CollectionArea",
  "CollectionData", "IHFRDiagnosis", "WaterData", "SoilData", "VegetationData", "TerrainData",
  "EnvironmentalMeasurementSet", "ExperimentalIHFRInputSupplement", "ExperimentalIHFRDiagnosis",
  "CurrentExperimentalIHFRDiagnosis", "IHFRDiagnosisOperation", "IHFRDiagnosisLifecycleEvent",
] as const;
const administrationFixtureIds = new Set(Array.from({ length: 54 }, (_, offset) =>
  `90000000-0000-4000-8000-${String(offset + 1).padStart(12, "0")}`));

type DatabaseRow = { datname: string; marker: string | null; owner: string; allowConnections: boolean };
type Auditor = { name: DatabaseName; client: Client; connected: boolean; transactionOpen: boolean; closed: boolean; pid: number };

function quoted(name: string) { return `"${name.replaceAll('"', '""')}"`; }

function assertExactNames(actual: string[], expected: readonly string[], message: string) {
  if (actual.length !== expected.length || actual.some((name) => !expected.includes(name)) ||
      expected.some((name) => !actual.includes(name))) throw new Error(message);
}

async function assertOwnedAdmin(admin: Client, root: string) {
  const result = await admin.query<{ owner: string; database: string; dataDirectory: string }>(
    'SELECT current_user AS owner, current_database() AS database, current_setting(\'data_directory\') AS "dataDirectory"',
  );
  const actual = result.rows[0];
  if (actual?.owner !== "imp006_owner" || actual.database !== "postgres" ||
      resolve(actual.dataDirectory).toLowerCase() !== resolve(root, "data").toLowerCase()) {
    throw new Error("Administrative connection is not the owned local PostgreSQL cluster");
  }
}

async function databaseRows(admin: Client): Promise<DatabaseRow[]> {
  const result = await admin.query<DatabaseRow>(`
    SELECT datname, shobj_description(oid, 'pg_database') AS marker,
      pg_get_userbyid(datdba) AS owner, datallowconn AS "allowConnections"
    FROM pg_database WHERE datname = ANY($1::text[]) ORDER BY datname
  `, [databases]);
  return result.rows;
}

async function assertDatabaseMarkers(admin: Client, allowConnections: boolean) {
  const rows = await databaseRows(admin);
  assertExactNames(rows.map((row) => row.datname), databases, "Both exact owned v2 databases must exist");
  if (rows.some((row) => row.marker !== marker || row.owner !== "imp006_owner" ||
      row.allowConnections !== allowConnections)) {
    throw new Error("Owned v2 database marker, owner or connection state does not match");
  }
}

async function activeClientPids(admin: Client, name: DatabaseName): Promise<number[]> {
  const result = await admin.query<{ pid: number }>(`
    SELECT pid FROM pg_stat_activity
    WHERE datname = $1 AND backend_type = 'client backend' ORDER BY pid
  `, [name]);
  return result.rows.map((row) => row.pid);
}

async function openAuditor(adminUrl: URL, name: DatabaseName, auditors: Auditor[]) {
  const url = new URL(adminUrl);
  url.pathname = `/${name}`;
  const auditor: Auditor = {
    name, client: new Client({ connectionString: url.toString(), connectionTimeoutMillis: 15_000 }),
    connected: false, transactionOpen: false, closed: false, pid: -1,
  };
  auditors.push(auditor);
  // Even a failed connect can leave a socket that needs closing.
  auditor.connected = true;
  await auditor.client.connect();
  const identity = await auditor.client.query<{ database: string; pid: number }>(
    "SELECT current_database() AS database, pg_backend_pid()::int AS pid",
  );
  if (identity.rows[0]?.database !== name || !Number.isInteger(identity.rows[0]?.pid)) {
    throw new Error("Owned v2 auditor connected to an unexpected database");
  }
  auditor.pid = identity.rows[0].pid;
  // The first data snapshot is taken after both databases reject new connections.
  await auditor.client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  auditor.transactionOpen = true;
  return auditor;
}

async function auditTestDatabase(client: Client) {
  const schemaMarker = await client.query<{ marker: string | null }>(
    "SELECT obj_description(oid, 'pg_namespace') AS marker FROM pg_namespace WHERE nspname = 'public'",
  );
  if (schemaMarker.rows[0]?.marker !== marker) throw new Error("Owned v2 test schema marker does not match");
  const namespaces = await client.query<{ count: number }>(`
    SELECT count(*)::int AS count FROM pg_namespace
    WHERE nspname NOT IN ('public', 'pg_catalog', 'information_schema')
      AND nspname NOT LIKE 'pg_toast%' AND nspname NOT LIKE 'pg_temp_%'
  `);
  if (namespaces.rows[0]?.count !== 0) throw new Error("Owned v2 test database has an extra schema");
  const relations = await client.query<{ relname: string; relkind: string }>(`
    SELECT relation.relname, relation.relkind FROM pg_class AS relation
    JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
    WHERE namespace.nspname = 'public' AND relation.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
  `);
  assertExactNames(relations.rows.filter((row) => row.relkind === "r").map((row) => row.relname),
    expectedTables, "Owned v2 test database table set differs from the 17 expected models");
  if (relations.rows.some((row) => row.relkind !== "r")) {
    throw new Error("Owned v2 test database has an unexpected public relation");
  }

  const users = await client.query<{ id: string; email: string }>('SELECT id, email FROM public."User"');
  for (const user of users.rows) {
    if (!administrationFixtureIds.has(user.id)) throw new Error("Owned v2 test database has a non-IMP-009 user");
    const index = Number(user.id.slice(-12));
    if (user.email !== `imp009-${index}@test.invalid`) {
      throw new Error("Owned v2 test database has a non-IMP-009 user email");
    }
  }
  const audits = await client.query<{ actorUserId: string; targetUserId: string }>(
    'SELECT "actorUserId", "targetUserId" FROM public."AdministrativeAuditEvent"',
  );
  for (const audit of audits.rows) {
    if (!administrationFixtureIds.has(audit.actorUserId) || !administrationFixtureIds.has(audit.targetUserId)) {
      throw new Error("Owned v2 test database has an audit outside IMP-009 fixtures");
    }
  }
  for (const table of expectedTables) {
    if (table === "User" || table === "AdministrativeAuditEvent") continue;
    const result = await client.query<{ count: number }>(`SELECT count(*)::int AS count FROM public.${quoted(table)}`);
    if (result.rows[0]?.count !== 0) throw new Error("Owned v2 test database has domain rows outside IMP-009 fixtures");
  }
}

async function auditReferenceDatabase(client: Client) {
  const result = await client.query<{
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
  if (!result.rows[0] || Object.values(result.rows[0]).some((count) => count !== 0)) {
    throw new Error("Owned v2 reference database contains non-system objects");
  }
}

async function closeAuditor(auditor: Auditor): Promise<unknown[]> {
  if (auditor.closed) return [];
  auditor.closed = true;
  const errors: unknown[] = [];
  if (auditor.transactionOpen) {
    try { await auditor.client.query("ROLLBACK"); } catch (error) { errors.push(error); }
    auditor.transactionOpen = false;
  }
  if (auditor.connected) {
    try { await auditor.client.end(); } catch (error) { errors.push(error); }
    auditor.connected = false;
  }
  return errors;
}

async function restoreSurvivors(admin: Client): Promise<{ survivors: string[]; errors: unknown[] }> {
  const rows = await databaseRows(admin);
  const survivors: string[] = [];
  const errors: unknown[] = [];
  for (const row of rows) {
    survivors.push(row.datname);
    if (!databases.includes(row.datname as DatabaseName) || row.marker !== marker || row.owner !== "imp006_owner") {
      errors.push(new Error("Surviving v2 database identity changed; connection state was not altered"));
      continue;
    }
    if (!row.allowConnections) {
      try { await admin.query(`ALTER DATABASE ${quoted(row.datname)} WITH ALLOW_CONNECTIONS true`); }
      catch (error) { errors.push(error); }
    }
  }
  return { survivors, errors };
}

async function main() {
  assert.equal(process.env.IMP006_LOCAL_POSTGRESQL, "1");
  assert.equal(process.env.TEST_DATABASE_CONFIRMATION, "HIDROFLORESTAS_AUTH_TEST");
  const url = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (url.hostname !== "127.0.0.1" || url.port !== "55426" || url.pathname !== "/postgres") {
    throw new Error("Owned local regression disposal requires the administrative database");
  }
  const root = join(process.env.LOCALAPPDATA ?? "", "HidroFlorestas", "imp006-postgresql");
  const owner = JSON.parse((await readFile(join(root, "cluster-owner.json"), "utf8")).replace(/^\uFEFF/, "")) as {
    marker?: string; root?: string; port?: number; owner?: string;
  };
  if (owner.marker !== "hidroflorestas:imp006-local-postgresql:v1" ||
      owner.root?.toLowerCase() !== root.toLowerCase() || owner.port !== 55426 || owner.owner !== "imp006_owner") {
    throw new Error("Owned local cluster marker does not match");
  }
  const readyFile = join(root, "regression-v2-ready.json");
  const ready = JSON.parse((await readFile(readyFile, "utf8")).replace(/^\uFEFF/, "")) as { marker?: string; root?: string };
  if (ready.marker !== marker || ready.root?.toLowerCase() !== root.toLowerCase()) {
    throw new Error("Owned v2 readiness marker does not match");
  }

  const admin = new Client({ connectionString: url.toString(), connectionTimeoutMillis: 15_000 });
  const auditors: Auditor[] = [];
  let adminConnected = false;
  let ownedAdminVerified = false;
  let connectionsFrozen = false;
  let readyRemoved = false;
  let primaryError: unknown;
  const cleanupErrors: unknown[] = [];
  let survivors: string[] | undefined;
  try {
    adminConnected = true;
    await admin.connect();
    await assertOwnedAdmin(admin, root);
    ownedAdminVerified = true;
    const lock = await admin.query<{ acquired: boolean }>(
      "SELECT pg_try_advisory_lock(17006, 2) AS acquired",
    );
    if (!lock.rows[0]?.acquired) throw new Error("Owned v2 disposal is already running");
    await assertDatabaseMarkers(admin, true);
    for (const name of databases) {
      if ((await activeClientPids(admin, name)).length !== 0) {
        throw new Error("Owned v2 database has an active client before disposal");
      }
    }

    for (const name of databases) await openAuditor(url, name, auditors);
    connectionsFrozen = true;
    for (const name of databases) await admin.query(`ALTER DATABASE ${quoted(name)} WITH ALLOW_CONNECTIONS false`);
    await assertDatabaseMarkers(admin, false);
    for (const auditor of auditors) {
      const active = await activeClientPids(admin, auditor.name);
      if (active.length !== 1 || active[0] !== auditor.pid) {
        throw new Error("Owned v2 database has an unexpected active client during audit");
      }
    }
    for (const auditor of auditors) {
      await auditor.client.query("SET LOCAL statement_timeout = '15s'");
      if (auditor.name === databases[0]) await auditTestDatabase(auditor.client);
      else await auditReferenceDatabase(auditor.client);
    }
    for (const auditor of auditors) cleanupErrors.push(...await closeAuditor(auditor));
    if (cleanupErrors.length) throw new Error("Owned v2 auditor could not close cleanly");
    await assertDatabaseMarkers(admin, false);
    for (const name of databases) {
      if ((await activeClientPids(admin, name)).length !== 0) {
        throw new Error("Owned v2 database still has active clients after audit");
      }
    }
    // Removing readiness before DROP makes every partial failure fail closed for test runners.
    await rm(readyFile);
    readyRemoved = true;
    for (const name of databases) await admin.query(`DROP DATABASE ${quoted(name)}`);
    process.stdout.write("Dropped only the two marked, idle local v2 regression databases; v1 and cluster data were preserved.\n");
  } catch (error) { primaryError = error; }
  finally {
    for (const auditor of auditors) cleanupErrors.push(...await closeAuditor(auditor));
    if (adminConnected && ownedAdminVerified && connectionsFrozen &&
        (primaryError !== undefined || cleanupErrors.length)) {
      try {
        const restoration = await restoreSurvivors(admin);
        survivors = restoration.survivors;
        cleanupErrors.push(...restoration.errors);
      }
      catch (error) { cleanupErrors.push(error); }
    }
    if (adminConnected) {
      try { await admin.end(); } catch (error) { cleanupErrors.push(error); }
    }
  }
  if (primaryError !== undefined || cleanupErrors.length) {
    const remaining = survivors === undefined ? "UNVERIFIED" : survivors.length ? survivors.join(",") : "none";
    const recovery = readyRemoved
      ? "Readiness was removed. Verify surviving database markers, then run the owned v2 setup before retrying disposal."
      : "Verify database markers and connection state before retrying disposal.";
    throw new AggregateError(
      [...(primaryError === undefined ? [] : [primaryError]), ...cleanupErrors],
      `Owned v2 disposal failed; surviving databases=${remaining}. ${recovery}`,
    );
  }
}

void main().catch((error) => {
  process.stderr.write(`Owned v2 regression disposal failed: ${describeImp006Error(error, process.env)}\n`);
  process.exitCode = 1;
});

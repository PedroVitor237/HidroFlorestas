import { spawn, type ChildProcess } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { createServer } from "node:net";
import { networkInterfaces } from "node:os";
import { setTimeout as delay } from "node:timers/promises";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../tests/fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS, IHFR_MEASUREMENT_PAYLOAD } from "../tests/fixtures/ihfr-diagnosis-contexts";
import { setupIHFRDiagnosisFixtures } from "../tests/fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../tests/fixtures/postgresql-schema-lifecycle";

function privateLanAddress() {
  const address = Object.values(networkInterfaces()).flat().find((item) =>
    item?.family === "IPv4" && !item.internal && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address)
  )?.address;
  if (!address) throw new Error("No private non-loopback IPv4 address is available for the LAN E2E run");
  return address;
}

async function freePort(host: string) {
  const server = createServer();
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, host, resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No E2E port available");
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return address.port;
}

async function exitCode(child: ChildProcess) {
  if (child.exitCode !== null) return child.exitCode;
  return new Promise<number>((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

async function ready(url: string, child: ChildProcess) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error(`Next.js exited before readiness: ${child.exitCode}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.status < 500) return;
    } catch { /* Keep checking the owned server. */ }
    await delay(500);
  }
  throw new Error("Next.js did not become ready");
}

async function main() {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const schema = (await client.query("SELECT current_schema() AS schema")).rows[0].schema as string;
    if (!/^imp006_test_[0-9a-f]{32}$/.test(schema)) throw new Error("E2E schema ownership check failed");
    const newCollections = [randomUUID(), randomUUID(), randomUUID()];
    for (const collectionId of newCollections) {
      await client.query(`INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),'-03:00',now(),$5,now(),now())`,
        [collectionId, IHFR_CONTEXTS.activeArea, IHFR_LABORATORIES.active, IHFR_ACTORS.owner, randomUUID()]);
      await client.query(`INSERT INTO "EnvironmentalMeasurementSet" (id,"collectionDataId","userId","measurementContractVersion",payload,"payloadHash","confirmationKey","confirmedAt") VALUES ($1,$2,$3,'ihfr-measurement-v1',$4::jsonb,$5,$6,now())`,
        [randomUUID(), collectionId, IHFR_ACTORS.owner, JSON.stringify(IHFR_MEASUREMENT_PAYLOAD), `sha256:${randomBytes(32).toString("hex")}`, randomUUID()]);
    }
    const host = process.argv.includes("--lan") ? privateLanAddress() : "127.0.0.1";
    const port = await freePort(host);
    const baseURL = `http://${host}:${port}`;
    const collectionUrl = (laboratoryId: string, areaId: string, collectionId: string) => `/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}`;
    const env = {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL,
      IMP006_TEST_SCHEMA: schema,
      JWT_SECRET: randomBytes(48).toString("hex"),
      PLAYWRIGHT_BASE_URL: baseURL,
      IMP006_E2E_COLLECTION_URL: collectionUrl(IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, IHFR_CONTEXTS.confirmedCollection),
      IMP006_E2E_ABSENT_COLLECTION_URL: collectionUrl(IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, IHFR_CONTEXTS.withoutMeasurementCollection),
      IMP006_E2E_INACTIVE_COLLECTION_URL: collectionUrl(IHFR_LABORATORIES.inactive, IHFR_CONTEXTS.inactiveArea, IHFR_CONTEXTS.inactiveCollection),
      IMP006_E2E_MANAGE_URL: collectionUrl(IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, newCollections[0]),
      IMP006_E2E_ADMIN_MANAGE_URL: collectionUrl(IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, newCollections[1]),
      IMP006_E2E_INCOMPATIBLE_URL: collectionUrl(IHFR_LABORATORIES.active, IHFR_CONTEXTS.activeArea, newCollections[2]),
      IMP006_E2E_ACTOR_ID: IHFR_ACTORS.member,
      IMP006_E2E_OWNER_ID: IHFR_ACTORS.owner,
      IMP006_E2E_ADMIN_ID: IHFR_ACTORS.contextualAdmin,
      IMP006_E2E_MEMBER_ID: IHFR_ACTORS.member,
    };
    const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", host, "--port", String(port)], { env: { ...env, NODE_ENV: "development" }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    server.stdout?.on("data", () => {});
    server.stderr?.on("data", () => {});
    let primaryError: unknown;
    let cleanupError: unknown;
    try {
      await ready(`${baseURL}/login`, server);
      const tests = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.imp006.config.ts"], { env: { ...env, NODE_ENV: "test" }, stdio: "inherit", windowsHide: true });
      const code = await exitCode(tests);
      if (code !== 0) throw new Error(`IMP-006 Playwright failed with exit code ${code}`);
    } catch (error) {
      primaryError = error;
      if (server.exitCode !== null) process.stderr.write(`Owned Next.js server exited with code ${server.exitCode}.\n`);
    } finally {
      if (server.exitCode === null) server.kill();
      try { await Promise.race([exitCode(server), delay(10_000).then(() => { throw new Error("Owned Next.js server did not stop"); })]); } catch (error) { cleanupError = error; }
    }
    if (primaryError && cleanupError) throw new AggregateError([primaryError, cleanupError], "E2E and cleanup failed");
    if (primaryError) throw primaryError;
    if (cleanupError) throw cleanupError;
  });
}

void main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`); process.exitCode = 1; });

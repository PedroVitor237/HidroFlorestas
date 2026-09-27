import { spawn, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { Pool } from "pg";
import { describeImp006Error, redactImp006Diagnostics, runImp006Gate } from "./imp006-gate-diagnostics";
import { imp006Target, readOnlyImp006Preflight } from "./imp006-test-preflight";

async function availablePort() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No loopback port available");
  await new Promise<void>(resolve => server.close(() => resolve()));
  return address.port;
}

function stopped(child: ChildProcess) {
  if (child.exitCode !== null) return Promise.resolve(child.exitCode);
  return new Promise<number>((resolve, reject) => { child.once("error", reject); child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0))); });
}

function forwardSanitized(stream: NodeJS.ReadableStream | null, destination: NodeJS.WriteStream, env: NodeJS.ProcessEnv) {
  if (!stream) return;
  let pending = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk: string) => {
    pending += chunk;
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) destination.write(`${redactImp006Diagnostics(line, env)}\n`);
  });
  stream.on("end", () => {
    if (pending) destination.write(redactImp006Diagnostics(pending, env));
  });
}

async function main() {
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "test" };
  if (!env.IMP006_UI_EMAIL || !env.IMP006_UI_PASSWORD || !env.IMP006_UI_RUN_ID) throw new Error("IMP006_UI_EMAIL, IMP006_UI_PASSWORD and IMP006_UI_RUN_ID are required");
  if (!/^HF007-UI-[A-Za-z0-9-]{6,50}$/.test(env.IMP006_UI_RUN_ID)) throw new Error("IMP006_UI_RUN_ID must be a unique HF007-UI-* identifier");
  if (env.IMP006_LOCAL_POSTGRESQL) throw new Error("Full UI checkpoint requires the dedicated remote E2E branch");
  const verified = await readOnlyImp006Preflight(env);
  if (verified.schema !== "public") throw new Error("Full UI checkpoint requires the dedicated E2E public schema");
  const migrationEnv: NodeJS.ProcessEnv = { ...env, DATABASE_URL: env.TEST_DATABASE_URL };
  delete migrationEnv.IMP006_UI_PASSWORD;
  const status = await runImp006Gate("migrate-status", ["node_modules/prisma/build/index.js", "migrate", "status"], migrationEnv,
    { fingerprint: verified.fingerprint, schema: verified.schema, runId: env.IMP006_UI_RUN_ID });
  if (status.exitCode !== 0) throw new Error(`Versioned migrations are not confirmed up to date on the E2E target; sanitized log: ${status.logPath}`);
  const target = imp006Target(env);
  const pool = new Pool({ connectionString: target.connectionString, connectionTimeoutMillis: 15_000, max: 1 });
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    const existing = await client.query<{ count: number }>('SELECT count(*)::int AS count FROM public."LaboratoryRoom" WHERE name = $1', [`${env.IMP006_UI_RUN_ID} Laboratório`]);
    if (existing.rows[0]?.count !== 0) throw new Error("The full UI run ID already has a laboratory; refusing duplicate creation");
  } finally {
    if (client) { try { await client.query("ROLLBACK"); } finally { client.release(); } }
    await pool.end();
  }
  const port = await availablePort();
  const baseURL = `http://127.0.0.1:${port}`;
  const browserEnv: NodeJS.ProcessEnv = { ...env, DATABASE_URL: env.TEST_DATABASE_URL, JWT_SECRET: randomBytes(48).toString("hex"), PLAYWRIGHT_BASE_URL: baseURL };
  const serverEnv: NodeJS.ProcessEnv = { ...browserEnv, NODE_ENV: "development" };
  delete serverEnv.IMP006_UI_EMAIL;
  delete serverEnv.IMP006_UI_PASSWORD;
  delete serverEnv.IMP006_UI_RUN_ID;
  process.stdout.write(`[${new Date().toISOString()}] IMP-006 full UI target ${verified.fingerprint}, schema public, run ${env.IMP006_UI_RUN_ID}. Domain records are preserved.\n`);
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], { env: serverEnv, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  forwardSanitized(server.stdout, process.stdout, serverEnv);
  forwardSanitized(server.stderr, process.stderr, serverEnv);
  let primaryError: unknown;
  let cleanupError: unknown;
  try {
    const readinessStarted = Date.now();
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error(`Owned Next.js server exited: ${server.exitCode}`);
      try { if ((await fetch(`${baseURL}/login`, { signal: AbortSignal.timeout(1000) })).status < 500) { ready = true; break; } } catch { /* owned server is still starting */ }
      await delay(500);
    }
    if (!ready) throw new Error("Owned Next.js server did not become ready");
    process.stdout.write(`[${new Date().toISOString()}] IMP-006 owned Next.js ready after ${Date.now() - readinessStarted}ms.\n`);
    const tests = await runImp006Gate("full-ui", ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.imp006-full-ui.config.ts"], browserEnv,
      { fingerprint: verified.fingerprint, schema: "public", runId: env.IMP006_UI_RUN_ID, attempt: 1 });
    if (tests.exitCode !== 0) throw new Error(`IMP-006 full UI Playwright failed with exit code ${tests.exitCode}; sanitized log: ${tests.logPath}`);
  } catch (error) { primaryError = error; }
  finally {
    if (server.exitCode === null) server.kill();
    try { await Promise.race([stopped(server), delay(10_000).then(() => { throw new Error("Owned Next.js server did not stop"); })]); }
    catch (error) { cleanupError = error; }
  }
  if (primaryError && cleanupError) throw new AggregateError([primaryError, cleanupError], "Full UI and owned server cleanup failed");
  if (primaryError) throw primaryError;
  if (cleanupError) throw cleanupError;
}

void main().catch((error) => { process.stderr.write(`IMP-006 full UI: ${describeImp006Error(error, process.env)}\n`); process.exitCode = 1; });

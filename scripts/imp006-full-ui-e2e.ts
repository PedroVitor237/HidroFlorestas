import { spawn, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { open, type FileHandle } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { describeImp006Error, redactImp006Diagnostics, runImp006Gate } from "./imp006-gate-diagnostics";
import { readOnlyImp006Preflight } from "./imp006-test-preflight";
import { acquireUiAccountLease, type UiAccountLease } from "./imp006-ui-account";
import { checkUiResources } from "./imp006-ui-resource-preflight";

async function availablePort() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No loopback port available");
  await new Promise<void>(resolve => server.close(() => resolve()));
  return address.port;
}

function stopped(child: ChildProcess) {
  // Node emits close only after stdout/stderr close; the log must retain their final lines.
  return new Promise<number>((resolve) => { child.once("close", (code, signal) => resolve(code ?? (signal ? 1 : 0))); });
}

function forwardSanitized(stream: NodeJS.ReadableStream | null, destination: NodeJS.WriteStream, appendLog: (line: string) => void, label: string, env: NodeJS.ProcessEnv, stop: () => void) {
  if (!stream) return;
  let pending = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk: string) => {
    pending += chunk;
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) {
      if (line.length > 1_048_576) {
        appendLog(`${label}: OUTPUT_LINE_LIMIT_EXCEEDED\n`);
        stop();
        continue;
      }
      const safe = redactImp006Diagnostics(line, env);
      destination.write(`${safe}\n`);
      appendLog(`${label}: ${safe}\n`);
    }
    if (pending.length > 1_048_576) {
      pending = "";
      appendLog(`${label}: OUTPUT_LINE_LIMIT_EXCEEDED\n`);
      stop();
    }
  });
  stream.on("end", () => {
    if (pending) {
      const safe = redactImp006Diagnostics(pending, env);
      destination.write(`${safe}\n`);
      appendLog(`${label}: ${safe}\n`);
    }
  });
}

async function main() {
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "test" };
  if (!env.IMP006_UI_RUN_ID) throw new Error("IMP006_UI_RUN_ID is required");
  if (!/^HF007-UI-[A-Za-z0-9-]{6,50}$/.test(env.IMP006_UI_RUN_ID)) throw new Error("IMP006_UI_RUN_ID must be a unique HF007-UI-* identifier");
  if (env.IMP006_LOCAL_POSTGRESQL) throw new Error("Full UI checkpoint requires the dedicated remote E2E branch");
  const verified = await readOnlyImp006Preflight(env);
  if (verified.schema !== "public") throw new Error("Full UI checkpoint requires the dedicated E2E public schema");
  let account: UiAccountLease | undefined;
  let server: ChildProcess | undefined;
  let serverClosed: Promise<number> | undefined;
  let serverLog: FileHandle | undefined;
  let serverLogWrites = Promise.resolve();
  let serverLogError: unknown;
  let serverSpawnError: unknown;
  const interruption = new AbortController();
  let interruptedBy: "SIGINT" | "SIGTERM" | undefined;
  const interrupt = (signal: "SIGINT" | "SIGTERM") => {
    interruptedBy ??= signal;
    interruption.abort(new Error(`UI_RUN_INTERRUPTED_${signal}`));
    server?.kill();
  };
  const onSigint = () => interrupt("SIGINT");
  const onSigterm = () => interrupt("SIGTERM");
  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);
  const appendServerLog = (line: string) => {
    serverLogWrites = serverLogWrites.then(() => serverLog!.writeFile(line)).catch(error => {
      serverLogError ??= error;
      server?.kill();
    });
  };
  let evidenceDirectory: string | undefined;
  let primaryError: unknown;
  let cleanupError: unknown;
  try {
    account = await acquireUiAccountLease(env, env.IMP006_UI_RUN_ID);
    const runSignal = AbortSignal.any([account.signal, interruption.signal]);
    if (runSignal.aborted) throw new Error("UI_RUN_INTERRUPTED_BEFORE_PREFLIGHT");
    const resources = await checkUiResources(env.IMP006_UI_RUN_ID, env);
    if (runSignal.aborted) throw new Error("UI_RUN_INTERRUPTED_BEFORE_SERVER");
    evidenceDirectory = resources.evidenceDirectory;
    const migrationEnv: NodeJS.ProcessEnv = { ...env, DATABASE_URL: env.TEST_DATABASE_URL };
    delete migrationEnv.IMP006_UI_PASSWORD;
    const status = await runImp006Gate("migrate-status", ["node_modules/prisma/build/index.js", "migrate", "status"], migrationEnv,
      { fingerprint: verified.fingerprint, schema: verified.schema, runId: env.IMP006_UI_RUN_ID, logDirectory: evidenceDirectory, signal: runSignal });
    if (status.exitCode !== 0) throw new Error(`Versioned migrations are not confirmed up to date on the E2E target; sanitized log: ${status.logPath}`);
    const port = await availablePort();
    const baseURL = `http://127.0.0.1:${port}`;
    const browserEnv: NodeJS.ProcessEnv = { ...env, DATABASE_URL: env.TEST_DATABASE_URL, JWT_SECRET: randomBytes(48).toString("hex"), PLAYWRIGHT_BASE_URL: baseURL,
      IMP006_UI_EMAIL: account.email, IMP006_UI_PASSWORD: account.password, IMP006_UI_ACCOUNT_ID: account.accountId };
    const serverEnv: NodeJS.ProcessEnv = { ...browserEnv, NODE_ENV: "development" };
    delete serverEnv.IMP006_UI_EMAIL;
    delete serverEnv.IMP006_UI_PASSWORD;
    delete serverEnv.IMP006_UI_ACCOUNT_ID;
    delete serverEnv.IMP006_UI_RUN_ID;
    delete serverEnv.E2E_USER_PASSWORD;
    process.stdout.write(`[${new Date().toISOString()}] IMP-006 full UI target ${verified.fingerprint}, schema public, run ${env.IMP006_UI_RUN_ID}, account=${account.profile}, capacity=${account.capacityBefore}/5. Domain records are preserved.\n`);
    serverLog = await open(join(evidenceDirectory, "server.log"), "wx", 0o600);
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], { env: serverEnv, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    serverClosed = stopped(server);
    server.once("error", error => { serverSpawnError = error; });
    forwardSanitized(server.stdout, process.stdout, appendServerLog, "stdout", browserEnv, () => server?.kill());
    forwardSanitized(server.stderr, process.stderr, appendServerLog, "stderr", browserEnv, () => server?.kill());
    account.signal.addEventListener("abort", () => server?.kill(), { once: true });
    const readinessStarted = Date.now();
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (runSignal.aborted) throw new Error("UI_RUN_INTERRUPTED_DURING_STARTUP");
      if (serverSpawnError) throw serverSpawnError;
      if (serverLogError) throw serverLogError;
      if (server.exitCode !== null) throw new Error(`Owned Next.js server exited: ${server.exitCode}`);
      try { if ((await fetch(`${baseURL}/login`, { signal: AbortSignal.timeout(1000) })).status < 500) { ready = true; break; } } catch { /* owned server is still starting */ }
      await delay(500);
    }
    if (!ready) throw new Error("Owned Next.js server did not become ready");
    process.stdout.write(`[${new Date().toISOString()}] IMP-006 owned Next.js ready after ${Date.now() - readinessStarted}ms.\n`);
    const tests = await runImp006Gate("full-ui", ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.imp006-full-ui.config.ts"], browserEnv,
      { fingerprint: verified.fingerprint, schema: "public", runId: env.IMP006_UI_RUN_ID, attempt: 1, logDirectory: evidenceDirectory, signal: runSignal });
    if (tests.exitCode !== 0) throw new Error(`IMP-006 full UI Playwright failed with exit code ${tests.exitCode}; sanitized log: ${tests.logPath}`);
    if (account.signal.aborted) throw new Error("UI_ACCOUNT_LEASE_LOST");
    if (interruptedBy) throw new Error(`UI_RUN_INTERRUPTED_${interruptedBy}`);
  } catch (error) { primaryError = error; }
  finally {
    if (server && server.exitCode === null && server.signalCode === null) server.kill();
    if (serverClosed) {
      try { await Promise.race([serverClosed, delay(10_000).then(() => { throw new Error("Owned Next.js server did not stop"); })]); }
      catch (error) { cleanupError = error; }
    }
    await serverLogWrites;
    if (serverLog) {
      try { await serverLog.close(); }
      catch (error) { cleanupError ??= error; }
    }
    if (serverLogError) cleanupError ??= serverLogError;
    if (account) {
      try {
        const after = await account.capacityNow();
        process.stdout.write(`IMP-006 full UI account=${account.profile} capacity_after=${after}/5; evidence=${evidenceDirectory ?? "not-created"}.\n`);
      } catch { process.stdout.write(`IMP-006 full UI account=${account.profile} capacity_after=UNKNOWN.\n`); }
      try { await account.release(); }
      catch (error) { cleanupError ??= error; }
    }
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
  }
  if (primaryError && cleanupError) throw new AggregateError([primaryError, cleanupError], "Full UI and owned server cleanup failed");
  if (primaryError) throw primaryError;
  if (cleanupError) throw cleanupError;
}

void main().catch((error) => { process.stderr.write(`IMP-006 full UI: ${describeImp006Error(error, process.env)}\n`); process.exitCode = 1; });

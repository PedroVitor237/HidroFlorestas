import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcrypt";
import { withImp006PostgresqlSchema, selectedImp006DatabaseVariable } from "../tests/fixtures/postgresql-schema-lifecycle";
import { setupIHFRDiagnosisFixtures } from "../tests/fixtures/ihfr-diagnosis-fixtures";
import { IHFR_ACTORS } from "../tests/fixtures/ihfr-diagnosis-actors";
import { readOnlyImp006Preflight } from "./imp006-test-preflight";

const done = (child: ChildProcess) => child.exitCode !== null ? Promise.resolve(child.exitCode) : new Promise<number>(resolve => child.once("exit", code => resolve(code ?? 1)));
async function main() {
  Object.assign(process.env, { NODE_ENV: "test" });
  await readOnlyImp006Preflight();
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const schema = (await client.query("SELECT current_schema() AS schema")).rows[0].schema;
    const password = randomBytes(24).toString("base64url"), hash = await bcrypt.hash(password, 4);
    const users: Record<string, string> = {};
    for (const name of ["normal", "restricted", "admin"]) {
      users[name] = (await db.user.create({ data: { email: `${name}@deletion.test.invalid`, firstName: "Synthetic", lastName: "Deletion", password: hash, verificationRequired: name === "restricted", role: name === "admin" ? "ADMIN" : "USER", status: "ACTIVE" } })).id;
    }
    await db.user.update({ where: { id: IHFR_ACTORS.owner }, data: { password: hash } }); users.linked = IHFR_ACTORS.owner;
    const listener = createServer();
    await new Promise<void>(resolve => listener.listen(0, "127.0.0.1", resolve));
    const address = listener.address(); if (!address || typeof address === "string") throw new Error("No owned port");
    const port = address.port; await new Promise<void>(resolve => listener.close(() => resolve()));
    const origin = `http://127.0.0.1:${port}`;
    const key = () => randomBytes(32).toString("base64");
    const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "development", IMP006_TEST_SCHEMA: schema, IMP006_LOCAL_REGRESSION_PUBLIC: "1", JWT_SECRET: key(), PLAYWRIGHT_BASE_URL: origin,
      DELETION_E2E_IDS: JSON.stringify(users), DELETION_E2E_PASSWORD: password, ACCOUNT_TRUSTED_INGRESS: "local", ACCOUNT_LOCAL_APP_ORIGIN: origin,
      ACCOUNT_POLICY_ENABLED: "1", APP_PUBLIC_URL: "https://deletion.example.invalid", ACCOUNT_PROOF_KEYS: JSON.stringify({ e2e: key() }), ACCOUNT_PROOF_ACTIVE_KEY_ID: "e2e", ACCOUNT_REQUEST_KEY: key(), MAIL_PAYLOAD_ENCRYPTION_KEYS: JSON.stringify({ e2e: key() }), MAIL_PAYLOAD_ACTIVE_KEY_ID: "e2e", MAIL_IDEMPOTENCY_KEY: key() };
    const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], { env, stdio: "ignore", windowsHide: true });
    try {
      let ready = false;
      for (let attempt = 0; attempt < 120; attempt++) {
        if (server.exitCode !== null) throw new Error("Owned Next server exited");
        try { if ((await fetch(`${origin}/login`, { signal: AbortSignal.timeout(1000) })).status < 500) { ready = true; break; } } catch { /* Await only this server. */ }
        await delay(500);
      }
      if (!ready) throw new Error("Owned Next server failed readiness");
      const tests = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.account-deletion.config.ts"], { env: { ...env, NODE_ENV: "test" }, stdio: "inherit", windowsHide: true });
      if (await done(tests) !== 0) throw new Error("Deletion browser tests failed");
      for (const name of ["normal", "restricted"]) if (await db.user.findUnique({ where: { id: users[name] } })) throw new Error("Browser deletion did not commit");
      for (const name of ["admin", "linked"]) if (!await db.user.findUnique({ where: { id: users[name] } })) throw new Error("Protected browser fixture was removed");
    } finally {
      if (server.exitCode === null && server.pid) {
        if (process.platform === "win32") execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
        else server.kill();
        await done(server);
      }
    }
  });
}
void main().catch(() => { process.stderr.write("Owned deletion browser gate failed; no credential output.\n"); process.exitCode = 1; });

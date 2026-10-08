import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

async function rejectedBootstrap(environment: Record<string, string>) {
  const child = spawn(process.execPath, ["--import=tsx", "scripts/accounts-remote-bootstrap.ts"], {
    env: { NODE_ENV: "test", PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP, ...environment },
    windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", data => { output += String(data); });
  child.stderr.on("data", data => { output += String(data); });
  const deadline = setTimeout(() => child.kill(), 10_000);
  try {
    const code = await new Promise<number | null>((resolve, reject) => { child.once("error", reject); child.once("close", resolve); });
    return { code, output };
  } finally { clearTimeout(deadline); }
}

test("remote bootstrap refuses missing authorization before accessing any database", async () => {
  const result = await rejectedBootstrap({ DATABASE_URL: "postgresql://accounts_owner:private-sentinel@127.0.0.1:1/accounts_homologation" });
  assert.equal(result.code, 1);
  assert.match(result.output, /Explicit authorized homologation confirmation is required/);
  assert.doesNotMatch(result.output, /private-sentinel|ECONNREFUSED|migrate deploy/);
});

test("remote bootstrap rejects wrong database and loopback even with the confirmation", async () => {
  const result = await rejectedBootstrap({
    ACCOUNTS_REMOTE_BOOTSTRAP_CONFIRMATION: "NEW_AUTHORIZED_ACCOUNTS_HOMOLOGATION",
    ACCOUNTS_REMOTE_DATABASE_HOST: "127.0.0.1",
    DATABASE_URL: "postgresql://accounts_owner:private-sentinel@127.0.0.1:1/production?sslmode=require",
  });
  assert.equal(result.code, 1);
  assert.match(result.output, /isolated accounts database identity must match/);
  assert.doesNotMatch(result.output, /private-sentinel|ECONNREFUSED|migrate deploy/);
});

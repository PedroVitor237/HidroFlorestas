import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { describeImp006Error, redactImp006Diagnostics, runImp006Gate } from "../../scripts/imp006-gate-diagnostics";

test("IMP-006 diagnostic output redacts database URLs, tokens and known secrets", () => {
  const env = { DATABASE_URL: "postgresql://owner:private@localhost:5432/test", JWT_SECRET: "jwt-private-key" };
  const text = "db=postgresql://owner:private@localhost:5432/test token=Bearer opaque-token jwt-private-key Cookie: session=private-cookie";
  const safe = redactImp006Diagnostics(text, env);
  assert.doesNotMatch(safe, /private|opaque-token/);
  assert.match(safe, /<REDACTED>/);
});

test("IMP-006 diagnostic error preserves cause and SQLSTATE without exposing connection", () => {
  const cause = Object.assign(new Error("postgresql://owner:private@localhost/db"), { code: "23514" });
  const error = new Error("migration failed", { cause });
  const safe = describeImp006Error(error, {});
  assert.match(safe, /migration failed.*caused by.*code=23514/);
  assert.doesNotMatch(safe, /owner:private/);
});

test("IMP-006 gate records the primary child failure with exit and sanitized log", async () => {
  const secret = "diagnostic-private-value";
  const result = await runImp006Gate("diagnostic-test", ["-e", "process.stderr.write(process.env.JWT_SECRET + '\\n'); process.exit(7)"],
    { ...process.env, JWT_SECRET: secret }, { fingerprint: "000000000000", attempt: 1 });
  assert.equal(result.exitCode, 7);
  const log = await readFile(result.logPath, "utf8");
  assert.match(log, /phase=diagnostic-test.*attempt=1.*target=000000000000/);
  assert.match(log, /exit=7/);
  assert.doesNotMatch(log, /diagnostic-private-value/);
});

test("IMP-006 gate redacts secrets split across child output chunks", async () => {
  const secret = "synthetic-private-value-split-across-chunks";
  const databaseUrl = "postgresql://fixture:synthetic-db-password@127.0.0.1:5432/test";
  const childCode = [
    "const secret = process.env.JWT_SECRET;",
    "const url = process.env.DATABASE_URL;",
    "process.stdout.write('jwt=' + secret.slice(0, 14));",
    "setTimeout(() => {",
    "  process.stdout.write(secret.slice(14) + '\\n' + 'db=' + url.slice(0, 24));",
    "  setTimeout(() => process.stdout.write(url.slice(24) + '\\n'), 20);",
    "}, 20);",
  ].join("\n");
  const result = await runImp006Gate(
    "diagnostic-split-secret",
    ["-e", childCode],
    { ...process.env, JWT_SECRET: secret, DATABASE_URL: databaseUrl },
  );
  assert.equal(result.exitCode, 0);
  const log = await readFile(result.logPath, "utf8");
  assert.match(log, /stdout: jwt=<REDACTED>/);
  assert.match(log, /stdout: db=<REDACTED>/);
  assert.doesNotMatch(log, /synthetic-private-value|synthetic-db-password/);
});

test("IMP-006 gate retains its sanitized log when the child is aborted", async () => {
  const directory = await mkdtemp(join(tmpdir(), "hidro-imp006-abort-unit-"));
  const marker = join(directory, "child-started");
  const controller = new AbortController();
  const secret = "synthetic-abort-secret";
  const childCode = [
    "const fs = require('node:fs');",
    "process.stdout.write('abort-output ' + process.env.JWT_SECRET, () => fs.writeFileSync(process.env.IMP006_TEST_MARKER, 'ready'));",
    "setInterval(() => {}, 1000);",
  ].join("\n");
  const resultPromise = runImp006Gate(
    "diagnostic-abort",
    ["-e", childCode],
    { ...process.env, IMP006_TEST_MARKER: marker, JWT_SECRET: secret },
    { logDirectory: directory, signal: controller.signal },
  );
  try {
    const deadline = Date.now() + 5_000;
    let childStarted = false;
    while (Date.now() < deadline) {
      try { await access(marker); childStarted = true; break; }
      catch { await delay(20); }
    }
    assert.equal(childStarted, true, "child did not signal startup");
    controller.abort();
    const result = await resultPromise;
    assert.notEqual(result.exitCode, 0);
    const log = await readFile(result.logPath, "utf8");
    assert.match(log, /stdout: abort-output <REDACTED>/);
    assert.doesNotMatch(log, /synthetic-abort-secret/);
    assert.match(log, /END phase=diagnostic-abort .*exit=[1-9]/);
  } finally {
    controller.abort();
    await resultPromise.catch(() => undefined);
    await rm(directory, { recursive: true, force: true });
  }
});

test("IMP-006 gate preserves the first attempt when a phase is retried", async () => {
  const directory = await mkdtemp(join(tmpdir(), "hidro-imp006-retry-unit-"));
  try {
    const first = await runImp006Gate(
      "diagnostic-retry",
      ["-e", "process.stdout.write('first-attempt\\n')"],
      process.env,
      { logDirectory: directory, attempt: 1 },
    );
    const firstLog = await readFile(first.logPath, "utf8");
    const second = await runImp006Gate(
      "diagnostic-retry",
      ["-e", "process.stdout.write('second-attempt\\n')"],
      process.env,
      { logDirectory: directory, attempt: 2 },
    );
    assert.notEqual(second.logPath, first.logPath);
    assert.equal(await readFile(first.logPath, "utf8"), firstLog);
    assert.match(await readFile(second.logPath, "utf8"), /second-attempt/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

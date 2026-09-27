import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
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

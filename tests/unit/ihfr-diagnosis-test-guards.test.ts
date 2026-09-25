import assert from "node:assert/strict";
import { test } from "node:test";
import { imp006Target } from "../../scripts/imp006-test-preflight";
import { matchesImp006Schema } from "../../src/app/api/server/ihfr-diagnosis/schema-guard";
import { canDropOwnedImp006Schema } from "../fixtures/postgresql-schema-lifecycle";

const direct = "postgresql://u:p@ep-test.region.aws.neon.tech/hf_test?sslmode=verify-full";
const pooled = "postgresql://u:p@ep-test-pooler.region.aws.neon.tech/hf_test?sslmode=verify-full";
const safe = { IMP006_DATABASE_VARIABLE: "TEST_DATABASE_URL", TEST_DATABASE_CONFIRMATION: "HIDROFLORESTAS_AUTH_TEST", TEST_DATABASE_URL: direct, DATABASE_URL: "postgresql://u:p@ep-dev.region.aws.neon.tech/hf_dev?sslmode=verify-full" } as const;

test("test target requires explicit direct selection and never rewrites transport", () => {
  assert.equal(new URL(imp006Target({ ...safe }).connectionString).hostname, "ep-test.region.aws.neon.tech");
  assert.throws(() => imp006Target({ ...safe, TEST_DATABASE_URL: pooled }), /direct/);
  assert.throws(() => imp006Target({ ...safe, IMP006_DATABASE_VARIABLE: undefined }), /IMP006_DATABASE_VARIABLE/);
  assert.throws(() => imp006Target({ ...safe, TEST_DATABASE_CONFIRMATION: undefined }), /confirmation/);
  assert.throws(() => imp006Target({ ...safe, DATABASE_URL: pooled }), /matches the development/);
  assert.throws(() => imp006Target({ ...safe, PLAYWRIGHT_BASE_URL: "http:\/\/127.0.0.1:3001" }), /External Playwright/);
  const local = { ...safe, IMP006_LOCAL_POSTGRESQL: "1", TEST_DATABASE_URL: "postgresql://u:p@127.0.0.1:55426/postgres", DATABASE_URL: "postgresql://u:p@127.0.0.1:55426/postgres" };
  assert.equal(imp006Target(local).database, "postgres");
  assert.throws(() => imp006Target({ ...local, TEST_DATABASE_URL: direct }), /owned loopback/);
});

test("schema guard accepts exactly the expected allowlisted schema", () => {
  const schema = `imp006_test_${"a".repeat(32)}`;
  assert.equal(matchesImp006Schema([{ schema }], schema), true);
  for (const rows of [[], [{ schema: "public" }], [{ schema: null }], [{ schema }, { schema }]]) assert.equal(matchesImp006Schema(rows, schema), false);
  assert.equal(matchesImp006Schema([{ schema: "public" }], "public"), false);
});

test("cleanup refuses public, foreign, unmarked and malformed schemas", () => {
  const schema = `imp006_test_${"b".repeat(32)}`;
  const marker = "hidroflorestas:imp006-test-harness";
  assert.equal(canDropOwnedImp006Schema(schema, marker, true), true);
  assert.equal(canDropOwnedImp006Schema(schema, marker, false), false);
  assert.equal(canDropOwnedImp006Schema(schema, null, true), false);
  assert.equal(canDropOwnedImp006Schema(schema, "other", true), false);
  assert.equal(canDropOwnedImp006Schema("public", marker, true), false);
  assert.equal(canDropOwnedImp006Schema("imp006_test_unexpected", marker, true), false);
});

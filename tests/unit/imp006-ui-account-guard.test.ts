import assert from "node:assert/strict";
import { test } from "node:test";
import type { Pool, PoolClient } from "pg";

import { imp006Target } from "../../scripts/imp006-test-preflight";
import { closeAccountSession, uiAccountProfile, validateUiAccountSnapshot } from "../../scripts/imp006-ui-account";

const expected = { id: "00000000-0000-4000-8000-000000000001", email: "active@auth-test.hidroflorestas.invalid" };
const active = { ...expected, status: "ACTIVE", role: "USER" };

test("full UI account guard accepts an allowlisted active account with four links", () => {
  assert.equal(validateUiAccountSnapshot(active, expected, true, 0, 0), 0);
  assert.equal(validateUiAccountSnapshot(active, expected, true, 4, 0), 4);
});

test("full UI account guard rejects absent, mismatched and inactive accounts", () => {
  assert.throws(() => validateUiAccountSnapshot(null, expected, true, 0, 0), /UI_ACCOUNT_NOT_FOUND/);
  assert.throws(() => validateUiAccountSnapshot({ ...active, id: "different" }, expected, true, 0, 0), /UI_ACCOUNT_NOT_ALLOWLISTED/);
  assert.throws(() => validateUiAccountSnapshot({ ...active, email: "other@auth-test.hidroflorestas.invalid" }, expected, true, 0, 0), /UI_ACCOUNT_NOT_ALLOWLISTED/);
  assert.throws(() => validateUiAccountSnapshot({ ...active, status: "PENDING" }, expected, true, 0, 0), /UI_ACCOUNT_NOT_ACTIVE/);
});

test("full UI account guard rejects an incorrect credential or role", () => {
  assert.throws(() => validateUiAccountSnapshot(active, expected, false, 0, 0), /UI_ACCOUNT_CREDENTIAL_MISMATCH/);
  assert.throws(() => validateUiAccountSnapshot({ ...active, role: "ADMIN" }, expected, true, 0, 0), /UI_ACCOUNT_ROLE_MISMATCH/);
});

test("full UI account guard counts all links and rejects capacity or used run ID", () => {
  assert.throws(() => validateUiAccountSnapshot(active, expected, true, 5, 0), /E2E_ACCOUNT_CAPACITY_EXHAUSTED/);
  assert.throws(() => validateUiAccountSnapshot(active, expected, true, 6, 0), /E2E_ACCOUNT_CAPACITY_EXHAUSTED/);
  for (const invalidCount of [-1, 4.5, Number.NaN]) {
    assert.throws(() => validateUiAccountSnapshot(active, expected, true, invalidCount, 0), /UI_ACCOUNT_LINK_COUNT_INVALID/);
  }
  assert.throws(() => validateUiAccountSnapshot(active, expected, true, 4, 1), /UI_RUN_ID_ALREADY_USED/);
  assert.throws(() => validateUiAccountSnapshot(active, expected, true, 4, -1), /UI_RUN_ID_ALREADY_USED/);
});

test("full UI account selection permits only the fixed profiles", () => {
  assert.equal(uiAccountProfile(undefined), "legacy");
  assert.equal(uiAccountProfile("reserve-01"), "reserve-01");
  assert.equal(uiAccountProfile("reserve-02"), "reserve-02");
  for (const arbitrary of ["", "reserve-03", "active@auth-test.hidroflorestas.invalid"]) {
    assert.throws(() => uiAccountProfile(arbitrary), /UI_ACCOUNT_NOT_ALLOWLISTED/);
  }
});

test("full UI target guard rejects DEV identity even with different credentials", () => {
  const target = "postgresql://test-user:dummy@ep-ui-e2e.invalid/ihfr?sslmode=require";
  const dev = "postgresql://dev-user:other@ep-ui-e2e.invalid/ihfr?sslmode=require";
  assert.throws(() => imp006Target({
    TEST_DATABASE_CONFIRMATION: "HIDROFLORESTAS_AUTH_TEST",
    IMP006_DATABASE_VARIABLE: "TEST_DATABASE_URL",
    TEST_DATABASE_URL: target,
    DATABASE_URL: dev,
  }), /test target matches the development database identity/);
});

test("full UI lease cleanup preserves the primary failure and attempts every release", async () => {
  const events: string[] = [];
  const primary = new Error("primary account query failed");
  const unlockError = new Error("advisory unlock failed");
  const poolError = new Error("pool shutdown failed");
  const client = { release: (destroy: boolean) => { events.push(`release:${destroy}`); } } as unknown as PoolClient;
  const pool = { end: async () => { events.push("pool.end"); throw poolError; } } as unknown as Pool;
  const unlock = async () => { events.push("unlock"); throw unlockError; };
  await assert.rejects(closeAccountSession(pool, client, unlock, primary), (error: unknown) => {
    assert.ok(error instanceof AggregateError);
    assert.deepEqual(error.errors, [primary, unlockError, poolError]);
    return true;
  });
  assert.deepEqual(events, ["unlock", "release:true", "pool.end"]);
});

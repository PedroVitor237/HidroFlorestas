import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { createDeletionHandlers } from "../../src/app/api/server/accounts/deletion.http";
import { AccountDeletionError, DELETION_BLOCKER_LABELS } from "../../src/app/api/server/accounts/deletion.contracts";

const request = (method = "GET", input?: unknown, headers: Record<string, string> = {}) => new NextRequest("https://accounts.example.invalid/api/auth/account-deletion", { method, headers: { cookie: "verification_token=synthetic", "content-type": "application/json", ...headers }, ...(input === undefined ? {} : { body: JSON.stringify(input) }) });
test("deletion GET reports only state; successful DELETE expires both cookies after service commit", async () => {
  let called = 0;
  const handlers = createDeletionHandlers({ nodeEnvironment: "production", service: async () => ({ deletionState: async token => { assert.equal(token, "synthetic"); return { success: true, canDelete: true, blockers: [], returnTo: "/verify-email" }; }, deleteAccount: async (token, input) => { assert.equal(token, "synthetic"); assert.deepEqual(input, { currentPassword: "synthetic", confirmDeletion: true }); called++; } }) });
  const get = await handlers.GET(request()); assert.equal(get.status, 200); assert.equal(called, 0); assert.match(get.headers.get("cache-control")!, /no-store/);
  const result = await handlers.DELETE(request("DELETE", { currentPassword: "synthetic", confirmDeletion: true }));
  assert.equal(called, 1); assert.deepEqual(await result.json(), { success: true });
  for (const name of ["auth_token", "verification_token"]) { const cookie = result.cookies.get(name); assert.equal(cookie?.maxAge, 0); assert.equal(cookie?.secure, true); assert.equal(cookie?.httpOnly, true); }
});
test("deletion refuses CSRF and malformed bodies before service; failures keep cookies and redact internals", async () => {
  let calls = 0;
  const handlers = createDeletionHandlers({ service: async () => { calls++; return { deletionState: async () => { throw new Error("private SQL detail"); }, deleteAccount: async () => { throw new AccountDeletionError("ACCOUNT_LINKED", [{ code: "MEMBERSHIPS", label: DELETION_BLOCKER_LABELS.MEMBERSHIPS, count: 2 }]); } }; } });
  assert.equal((await handlers.DELETE(request("DELETE", {}, { origin: "https://elsewhere.invalid" }))).status, 403);
  assert.equal(calls, 0);
  const invalid = new NextRequest("https://accounts.example.invalid/api/auth/account-deletion", { method: "DELETE", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal((await handlers.DELETE(invalid)).status, 400); assert.equal(calls, 0);
  const failure = await handlers.DELETE(request("DELETE", {})); assert.equal(failure.status, 409); assert.equal(failure.cookies.getAll().length, 0); assert.equal((await failure.json()).blockers[0].count, 2);
  const internal = await handlers.GET(request()); assert.equal(internal.status, 500); assert.equal((await internal.text()).includes("private SQL detail"), false);
});

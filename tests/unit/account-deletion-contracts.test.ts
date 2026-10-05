import assert from "node:assert/strict";
import { test } from "node:test";
import { AccountDeletionError, parseAccountDeletionInput, parseAccountDeletionState } from "../../src/app/api/server/accounts/deletion.contracts";

test("own deletion accepts existing legacy password without the new-password policy or trimming", () => {
  assert.deepEqual(parseAccountDeletionInput({ currentPassword: " old  ", confirmDeletion: true }), { currentPassword: " old  ", confirmDeletion: true });
});

test("own deletion requires explicit confirmation and refuses a client-selected identity", () => {
  for (const input of [null, [], {}, { currentPassword: "old", confirmDeletion: false }, { currentPassword: "old", confirmDeletion: true, userId: "other" }, { currentPassword: "old", confirmDeletion: true, role: "ADMIN" }]) {
    assert.throws(() => parseAccountDeletionInput(input), (error: unknown) => error instanceof AccountDeletionError && error.code === "INVALID_REQUEST");
  }
});

test("own deletion bounds current password like login and rejects empty/wrong types", () => {
  for (const currentPassword of ["", "  ", null, 123, "x".repeat(4097)]) {
    assert.throws(() => parseAccountDeletionInput({ currentPassword, confirmDeletion: true }), AccountDeletionError);
  }
  assert.equal(parseAccountDeletionInput({ currentPassword: "x".repeat(4096), confirmDeletion: true }).currentPassword.length, 4096);
});

test("deletion state rejects foreign/private fields and invalid blocker counts", () => {
  const good = { success: true, canDelete: true, blockers: [], returnTo: "/workspace" };
  assert.deepEqual(parseAccountDeletionState(good), good);
  for (const bad of [{ ...good, password: "private" }, { ...good, returnTo: "https://other.invalid" }, { ...good, blockers: [{ code: "LABORATORIES", label: "Laboratórios criados", count: -1 }] }, { ...good, canDelete: false }]) {
    assert.equal(parseAccountDeletionState(bad), null);
  }
});

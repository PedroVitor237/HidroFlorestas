import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  decodeAdminCursor,
  encodeAdminCursor,
  parseListQuery,
  parseRoleChange,
  parseStatusChange,
  queryHash,
  serializeAdminUser,
  UserAdministrationError,
} from "../../src/app/api/server/user-administration/user-administration.contracts";

describe("user administration contracts", () => {
  it("accepts exact mutation payloads and normalizes their reasons", () => {
    assert.deepEqual(
      parseStatusChange({
        expectedStatus: "ACTIVE",
        expectedRevision: 2,
        status: "BLOCKED",
        reason: "  investigação de segurança  ",
      }),
      {
        expectedStatus: "ACTIVE",
        expectedRevision: 2,
        status: "BLOCKED",
        reason: "investigação de segurança",
      },
    );
    assert.equal(
      parseRoleChange({
        expectedRole: "USER",
        expectedRevision: 0,
        role: "MODERATOR",
        reason: "delegação",
      }).role,
      "MODERATOR",
    );
  });

  it("rejects unknown fields, invalid enums, revisions, and reasons", () => {
    const invalid = [
      { expectedStatus: "ACTIVE", expectedRevision: 0, status: "BLOCKED", reason: "x", extra: true },
      { expectedStatus: "ACTIVE", expectedRevision: -1, status: "BLOCKED", reason: "x" },
      { expectedStatus: "ACTIVE", expectedRevision: 0, status: "UNKNOWN", reason: "x" },
      { expectedStatus: "ACTIVE", expectedRevision: 0, status: "BLOCKED", reason: " " },
    ];
    for (const payload of invalid) {
      assert.throws(() => parseStatusChange(payload), UserAdministrationError);
    }
  });

  it("binds opaque cursors to normalized filters", () => {
    const query = parseListQuery(
      new URL("http://localhost/api/admin/users?search=Ana&role=ADMIN&status=ACTIVE&limit=10"),
    );
    const hash = queryHash(query);
    const cursor = encodeAdminCursor(
      { id: "user-1", createdAt: "2026-09-19T12:00:00.000Z" },
      hash,
    );
    assert.deepEqual(decodeAdminCursor(cursor, hash), {
      version: 1,
      id: "user-1",
      createdAt: "2026-09-19T12:00:00.000Z",
      filterHash: hash,
    });
    assert.throws(
      () => decodeAdminCursor(cursor, queryHash({ ...query, search: "outra" })),
      (error) =>
        error instanceof UserAdministrationError &&
        error.code === "CURSOR_FILTER_MISMATCH",
    );
  });

  it("rejects unsupported filters and exposes only allowlisted user fields", () => {
    assert.throws(
      () => parseListQuery(new URL("http://localhost/api/admin/users?password=secret")),
      UserAdministrationError,
    );
    const serialized = serializeAdminUser({
      id: "user-1",
      firstName: "Ana",
      lastName: "Silva",
      email: "ana@example.test",
      role: "ADMIN",
      status: "ACTIVE",
      revision: 4,
      createdAt: new Date("2026-09-19T12:00:00.000Z"),
      updatedAt: new Date("2026-09-19T13:00:00.000Z"),
    });
    assert.deepEqual(Object.keys(serialized).sort(), [
      "createdAt", "email", "firstName", "id", "lastName", "revision",
      "role", "status", "updatedAt",
    ]);
    for (const forbidden of ["password", "passwordHash", "isAdmin", "token"]) {
      assert.equal(JSON.stringify(serialized).includes(forbidden), false);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createAdminUsersListHandler } from "../../src/app/api/admin/users/route.handlers";
import { createAdminUserStatusHandler } from "../../src/app/api/admin/users/[userId]/status/route.handlers";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { GlobalAuthorityError } from "../../src/app/api/server/user-administration/global-authority";
import { UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";

const admin = {
  id: "admin-1",
  firstName: "Ada",
  lastName: "Admin",
  image: "",
  role: "ADMIN" as const,

};

describe("user administration routes", () => {
  it("derives the actor and forwards only parsed list filters", async () => {
    let received: unknown[] = [];
    const handler = createAdminUsersListHandler({
      requireAdmin: async () => admin,
      service: {
        list: async (...args) => {
          received = args;
          return { items: [], nextCursor: null };
        },
      },
    });
    const response = await handler(
      new Request("http://localhost/api/admin/users?role=ADMIN&limit=10"),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(received, [
      "admin-1",
      { search: "", role: "ADMIN", status: undefined, limit: 10, cursor: undefined },
    ]);
  });

  it("validates status input before invoking the service", async () => {
    let invoked = false;
    const handler = createAdminUserStatusHandler({
      requireAdmin: async () => admin,
      service: {
        changeStatus: async () => {
          invoked = true;
          throw new Error("must not run");
        },
      },
    });
    const response = await handler(
      new Request("http://localhost/api/admin/users/user-2/status", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "BLOCKED" }),
      }),
      { params: Promise.resolve({ userId: "user-2" }) },
    );
    assert.equal(response.status, 400);
    assert.equal(invoked, false);
    assert.equal((await response.json()).error.code, "INVALID_INPUT");
  });

  it("returns sanitized authentication, authorization, and conflict errors", async () => {
    const failures = [
      [new AuthBoundaryError("UNAUTHORIZED"), 401, "UNAUTHENTICATED"],
      [new GlobalAuthorityError("ADMIN_AUTHORITY_REQUIRED"), 403, "ADMIN_AUTHORITY_REQUIRED"],
      [new UserAdministrationError("STALE_REVISION", 7), 409, "STALE_REVISION"],
      [new Error("private database detail"), 500, "INTERNAL_ERROR"],
    ] as const;

    for (const [error, status, code] of failures) {
      const handler = createAdminUsersListHandler({
        requireAdmin: async () => {
          throw error;
        },
        service: { list: async () => ({ items: [], nextCursor: null }) },
      });
      const response = await handler(new Request("http://localhost/api/admin/users"));
      const body = await response.json();
      assert.equal(response.status, status);
      assert.equal(body.error.code, code);
      assert.equal(JSON.stringify(body).includes("private database detail"), false);
      if (code === "STALE_REVISION") {
        assert.equal(body.error.currentRevision, 7);
        assert.equal(body.error.recovery, "REFRESH_TARGET");
      }
    }
  });
});

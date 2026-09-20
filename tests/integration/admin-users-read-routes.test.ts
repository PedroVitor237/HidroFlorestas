import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAdminUsersListHandler } from "../../src/app/api/admin/users/route.handlers";
import { createAdminUserDetailHandler } from "../../src/app/api/admin/users/[userId]/route.handlers";
import { GlobalAuthorityError } from "../../src/app/api/server/user-administration/global-authority";
import { assertControlled, context, controlledFailures, routeAdmin, routeUser } from "./user-administration-route.helpers";

describe("admin user read routes", () => {
  it("returns list/detail 200 with no-store and validates query", async () => {
    const list = createAdminUsersListHandler({ requireAdmin: async () => routeAdmin, service: { list: async () => ({ items: [routeUser], nextCursor: null }) } });
    const response = await list(new Request("http://localhost/api/admin/users?limit=25"));
    assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
    const detail = createAdminUserDetailHandler({ requireAdmin: async () => routeAdmin, service: { detail: async () => routeUser } });
    assert.equal((await detail(new Request("http://localhost/api/admin/users/user-2"), context)).status, 200);
    assert.equal((await list(new Request("http://localhost/api/admin/users?unknown=x"))).status, 400);
  });

  it("maps 401/403/404/500 and denies laboratory-only authority", async () => {
    for (const [error, status, code] of controlledFailures.filter(([,status]) => status !== 409)) {
      const handler = createAdminUserDetailHandler({ requireAdmin: async () => { throw error; }, service: { detail: async () => routeUser } });
      await assertControlled(await handler(new Request("http://localhost/api/admin/users/user-2"), context), status, code);
    }
    const laboratoryAdmin = createAdminUsersListHandler({ requireAdmin: async () => { throw new GlobalAuthorityError("ADMIN_AUTHORITY_REQUIRED"); }, service: { list: async () => ({ items: [], nextCursor: null }) } });
    assert.equal((await laboratoryAdmin(new Request("http://localhost/api/admin/users"))).status, 403);
  });
});

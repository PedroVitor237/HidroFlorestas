import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAdminUserRoleHandler } from "../../src/app/api/admin/users/[userId]/role/route.handlers";
import { GlobalAuthorityError } from "../../src/app/api/server/user-administration/global-authority";
import { assertControlled, context, controlledFailures, routeAdmin, routeUser } from "./user-administration-route.helpers";

const request = () => new Request("http://localhost/api/admin/users/user-2/role", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ expectedRole: "USER", expectedRevision: 2, role: "ADMIN", reason: "promoção" }) });

describe("admin user role route", () => {
  it("returns 200 and revalidates current authority on every request", async () => {
    let checks = 0;
    const handler = createAdminUserRoleHandler({ requireAdmin: async () => { checks++; if (checks > 1) throw new GlobalAuthorityError("ADMIN_AUTHORITY_REQUIRED"); return routeAdmin; }, service: { changeRole: async () => ({ ...routeUser, role: "ADMIN", revision: 3 }) } });
    assert.equal((await handler(request(), context)).status, 200);
    assert.equal((await handler(request(), context)).status, 403);
  });

  it("maps 400/401/403/404/409/500", async () => {
    const invalid = createAdminUserRoleHandler({ requireAdmin: async () => routeAdmin, service: { changeRole: async () => routeUser } });
    const bad = new Request("http://localhost/api/admin/users/user-2/role", { method: "PATCH", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal((await invalid(bad, context)).status, 400);
    for (const [error, status, code] of controlledFailures) {
      const handler = createAdminUserRoleHandler({ requireAdmin: async () => routeAdmin, service: { changeRole: async () => { throw error; } } });
      await assertControlled(await handler(request(), context), status, code);
    }
  });
});

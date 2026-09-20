import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAdminUserAuditHandler } from "../../src/app/api/admin/users/[userId]/audit/route.handlers";
import { assertControlled, context, controlledFailures, routeAdmin } from "./user-administration-route.helpers";

describe("admin user audit route", () => {
  it("returns 200 and rejects invalid query", async () => {
    const handler = createAdminUserAuditHandler({ requireAdmin: async () => routeAdmin, service: { audit: async () => ({ items: [], nextCursor: null }) } });
    assert.equal((await handler(new Request("http://localhost/api/admin/users/user-2/audit?limit=25"), context)).status, 200);
    assert.equal((await handler(new Request("http://localhost/api/admin/users/user-2/audit?secret=x"), context)).status, 400);
  });

  it("maps 401/403/404/500", async () => {
    for (const [error, status, code] of controlledFailures.filter(([,status]) => status !== 409)) {
      const handler = createAdminUserAuditHandler({ requireAdmin: async () => routeAdmin, service: { audit: async () => { throw error; } } });
      await assertControlled(await handler(new Request("http://localhost/api/admin/users/user-2/audit"), context), status, code);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAdminUserStatusHandler } from "../../src/app/api/admin/users/[userId]/status/route.handlers";
import { assertControlled, context, controlledFailures, routeAdmin, routeUser } from "./user-administration-route.helpers";

const input = { expectedStatus: "ACTIVE", expectedRevision: 2, status: "BLOCKED", reason: "incidente" };
const request = () => new Request("http://localhost/api/admin/users/user-2/status", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });

describe("admin user status route", () => {
  it("returns 200 and rejects malformed input without mutation", async () => {
    let calls = 0;
    const handler = createAdminUserStatusHandler({ requireAdmin: async () => routeAdmin, service: { changeStatus: async () => { calls++; return { ...routeUser, status: "BLOCKED", revision: 3 }; } } });
    assert.equal((await handler(request(), context)).status, 200);
    const invalid = new Request("http://localhost/api/admin/users/user-2/status", { method: "PATCH", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal((await handler(invalid, context)).status, 400); assert.equal(calls, 1);
  });

  it("maps 401/403/404/409/500 with enumerated recovery", async () => {
    for (const [error, status, code] of controlledFailures) {
      const handler = createAdminUserStatusHandler({ requireAdmin: async () => routeAdmin, service: { changeStatus: async () => { throw error; } } });
      await assertControlled(await handler(request(), context), status, code);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLogoutHandler } from "../../src/app/api/auth/logout/route.handlers";

describe("POST /api/auth/logout", () => {
  it("idempotently expires the cookie for every session condition", async () => {
    const handler = createLogoutHandler({ nodeEnvironment: "test" });

    for (const sessionCondition of ["absent", "valid", "invalid", "expired"]) {
      const first = await handler();
      const repeated = await handler();

      for (const response of [first, repeated]) {
        assert.equal(response.status, 200, sessionCondition);
        assert.deepEqual(await response.json(), { success: true });
        const cookie = response.headers.get("set-cookie") ?? "";
        assert.match(cookie, /^auth_token=/);
        assert.match(cookie, /Path=\//i);
        assert.match(cookie, /Max-Age=0/i);
        assert.match(cookie, /Expires=Thu, 01 Jan 1970/i);
        assert.match(cookie, /HttpOnly/i);
        assert.match(cookie, /SameSite=Lax/i);
      }
    }
  });

  it("returns a controlled internal envelope if cookie removal fails", async () => {
    const handler = createLogoutHandler({
      nodeEnvironment: "test",
      expireCookie: () => {
        throw new Error("internal cookie detail");
      },
    });
    const response = await handler();

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir a solicitação.",
    });
    assert.equal(response.headers.get("set-cookie"), null);
  });
});

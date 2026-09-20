import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NextRequest } from "next/server";

import {
  createMeHandler,
} from "../../src/app/api/auth/me/route.handlers";
import {
  AuthBoundaryError,
} from "../../src/app/api/server/middlewares/auth.middleware";

const principal = {
  id: "internal-id",
  firstName: "Ana",
  lastName: "Silva",
  image: "avatar.png",
  role: "USER" as const,
};

function request(token?: string) {
  return new NextRequest("http://localhost/api/auth/me", {
    headers: token ? { cookie: `auth_token=${token}` } : undefined,
  });
}

describe("GET /api/auth/me", () => {
  it("returns no-store and an exact public DTO for an ACTIVE principal", async () => {
    const handler = createMeHandler({
      requireAuth: async () => principal,
      nodeEnvironment: "test",
    });
    const response = await handler(request("valid-token"));

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), {
      success: true,
      user: { firstName: "Ana", lastName: "Silva", image: "avatar.png" },
    });
  });

  it("uniformly rejects every non-authoritative session condition", async () => {
    for (const condition of [
      "absent",
      "invalid",
      "expired",
      "invalid-payload",
      "orphan",
      "pending",
      "blocked",
      "inactive",
      "active-to-blocked",
    ]) {
      const handler = createMeHandler({
        requireAuth: async () => {
          throw new AuthBoundaryError("UNAUTHORIZED");
        },
        nodeEnvironment: "test",
      });
      const token = condition === "absent" ? undefined : `${condition}-token`;
      const response = await handler(request(token));

      assert.equal(response.status, 401, condition);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(await response.json(), {
        success: false,
        code: "UNAUTHENTICATED",
        message: "Não autenticado. Faça login novamente.",
      });

      const cookie = response.headers.get("set-cookie");
      if (token) {
        assert.match(cookie ?? "", /^auth_token=/, condition);
        assert.match(cookie ?? "", /Max-Age=0/i, condition);
        assert.match(cookie ?? "", /Expires=Thu, 01 Jan 1970/i, condition);
        assert.match(cookie ?? "", /Path=\//i, condition);
      } else {
        assert.equal(cookie, null, condition);
      }
    }
  });

  it("returns a controlled 500 without serializing internal failures", async () => {
    for (const error of [
      new AuthBoundaryError("INTERNAL_ERROR"),
      new Error("database detail"),
    ]) {
      const handler = createMeHandler({
        requireAuth: async () => {
          throw error;
        },
        nodeEnvironment: "test",
      });
      const response = await handler(request("valid-looking-token"));

      assert.equal(response.status, 500);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(await response.json(), {
        success: false,
        code: "INTERNAL_ERROR",
        message: "Não foi possível concluir a solicitação.",
      });
      assert.equal(response.headers.get("set-cookie"), null);
    }
  });

  it("never leaks the internal principal fields", async () => {
    const handler = createMeHandler({
      requireAuth: async () => principal,
      nodeEnvironment: "test",
    });
    const body = await (await handler(request("token"))).json();

    assert.deepEqual(Object.keys(body.user).sort(), [
      "firstName",
      "image",
      "lastName",
    ]);
    for (const field of ["id", "email", "status", "isAdmin", "password", "token", "confirmationKey", "collectionAreaId"]) {
      assert.equal(JSON.stringify(body).includes(`\"${field}\"`), false, field);
    }
  });
});

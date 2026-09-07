import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NextRequest } from "next/server";

import { createSignInHandler } from "../../src/app/api/auth/sign-in/route";

const successResult = {
  success: true as const,
  token: "signed.jwt.token",
  user: { firstName: "Ana", lastName: "Silva", image: "" },
};

function request(body: string) {
  return new NextRequest("http://localhost/api/auth/sign-in", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("POST /api/auth/sign-in", () => {
  it("returns 400 for invalid JSON and invalid syntax before consulting credentials", async () => {
    let serviceCalls = 0;
    const handler = createSignInHandler({
      signIn: async () => {
        serviceCalls += 1;
        return successResult;
      },
      nodeEnvironment: "test",
    });

    for (const body of [
      "{",
      JSON.stringify({ email: "invalid", password: "secret" }),
      JSON.stringify({ email: "a@b.co", password: "secret", role: "ADMIN" }),
    ]) {
      const response = await handler(request(body));
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), {
        success: false,
        code: "INVALID_REQUEST",
        message: "Informe um email e uma senha válidos.",
      });
      assert.equal(response.headers.get("set-cookie"), null);
    }

    assert.equal(serviceCalls, 0);
  });

  it("creates the seven-day HTTP-only cookie only for valid ACTIVE credentials", async () => {
    const handler = createSignInHandler({
      signIn: async (input) => {
        assert.deepEqual(input, {
          email: "active@example.test",
          password: "secret",
        });
        return successResult;
      },
      nodeEnvironment: "test",
    });
    const response = await handler(
      request(
        JSON.stringify({
          email: "  active@example.test ",
          password: "secret",
        }),
      ),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      success: true,
      user: { firstName: "Ana", lastName: "Silva", image: "" },
    });
    const cookie = response.headers.get("set-cookie") ?? "";
    assert.match(cookie, /^auth_token=/);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Lax/i);
    assert.match(cookie, /Path=\//i);
    assert.match(cookie, /Max-Age=604800/i);
    assert.doesNotMatch(cookie, /Secure/i);
  });

  it("uses one 401 response for absent, incorrect, and ineligible credentials", async () => {
    for (const identity of ["missing", "wrong", "pending", "blocked", "inactive"]) {
      const handler = createSignInHandler({
        signIn: async () => ({
          success: false,
          reason: "INVALID_CREDENTIALS",
        }),
        nodeEnvironment: "test",
      });
      const response = await handler(
        request(
          JSON.stringify({
            email: `${identity}@example.test`,
            password: "secret",
          }),
        ),
      );

      assert.equal(response.status, 401);
      assert.deepEqual(await response.json(), {
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Email ou senha inválidos.",
      });
      assert.equal(response.headers.get("set-cookie"), null);
    }
  });

  it("returns a generic 500 for internal results and thrown errors", async () => {
    for (const signIn of [
      async () => ({ success: false as const, reason: "INTERNAL_ERROR" as const }),
      async () => {
        throw new Error("sensitive server detail");
      },
    ]) {
      const handler = createSignInHandler({ signIn, nodeEnvironment: "test" });
      const response = await handler(
        request(
          JSON.stringify({
            email: "active@example.test",
            password: "secret",
          }),
        ),
      );

      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), {
        success: false,
        code: "INTERNAL_ERROR",
        message: "Não foi possível concluir a solicitação.",
      });
      assert.equal(response.headers.get("set-cookie"), null);
    }
  });

  it("never exposes a token or privileged fields in JSON", async () => {
    const handler = createSignInHandler({
      signIn: async () => successResult,
      nodeEnvironment: "test",
    });
    const response = await handler(
      request(JSON.stringify({ email: "a@b.co", password: "secret" })),
    );
    const body = await response.json();

    assert.deepEqual(Object.keys(body.user).sort(), [
      "firstName",
      "image",
      "lastName",
    ]);
    for (const field of [
      "id",
      "email",
      "password",
      "status",
      "role",
      "isAdmin",
      "createdAt",
      "updatedAt",
      "token",
    ]) {
      assert.equal(JSON.stringify(body).includes(`\"${field}\"`), false, field);
    }
  });
});

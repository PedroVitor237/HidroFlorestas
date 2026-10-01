import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  AuthBoundaryError,
  requireAuthWithAdapters,
} from "../../src/app/api/server/middlewares/auth.middleware";

const principal = {
  id: "user-1",
  firstName: "Ana",
  lastName: "Silva",
  image: "", role: "USER" as const,

};

describe("requireAuth adapter", () => {
  it("passes the cookie token to the core and returns its principal", async () => {
    const seen: string[] = [];
    const result = await requireAuthWithAdapters({
      readToken: async () => "cookie-token",
      authenticateSession: async (token) => {
        seen.push(token ?? "missing");
        return { success: true, principal };
      },
    });

    assert.deepEqual(seen, ["cookie-token"]);
    assert.deepEqual(result, principal);
  });

  it("does not grant authority from cookie presence alone", async () => {
    await assert.rejects(
      requireAuthWithAdapters({
        readToken: async () => "arbitrary-cookie",
        authenticateSession: async () => ({
          success: false,
          reason: "UNAUTHENTICATED",
        }),
      }),
      (error) =>
        error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED",
    );
  });

  it("maps controlled core failures without exposing their cause", async () => {
    await assert.rejects(
      requireAuthWithAdapters({
        readToken: async () => undefined,
        authenticateSession: async () => ({
          success: false,
          reason: "INTERNAL_ERROR",
        }),
      }),
      (error) =>
        error instanceof AuthBoundaryError && error.code === "INTERNAL_ERROR",
    );
  });
});

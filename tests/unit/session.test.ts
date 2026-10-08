import assert from "node:assert/strict";
import { describe, it } from "node:test";

import jwt from "jsonwebtoken";

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_TTL_SECONDS,
  getAuthCookieOptions,
  getExpiredAuthCookieOptions,
  readJwtSecret,
  signSessionToken,
  verifySessionToken,
} from "../../src/app/api/server/auth/session";

const SECRET = "test-only-jwt-secret";

describe("session policy", () => {
  it("requires a non-empty JWT_SECRET without fallback", () => {
    assert.throws(() => readJwtSecret({}), /JWT_SECRET/);
    assert.throws(() => readJwtSecret({ JWT_SECRET: "" }), /JWT_SECRET/);
    assert.throws(() => readJwtSecret({ JWT_SECRET: "   " }), /JWT_SECRET/);
    assert.equal(readJwtSecret({ JWT_SECRET: SECRET }), SECRET);
  });

  it("signs a purpose/version-bound HS256 token valid for seven days", () => {
    const token = signSessionToken("user-1", SECRET);
    const decoded = jwt.decode(token, { complete: true });

    assert.ok(decoded && typeof decoded !== "string");
    assert.equal(decoded.header.alg, "HS256");
    assert.deepEqual(verifySessionToken(token, SECRET), { userId: "user-1", credentialVersion: 0, purpose: "session" });

    const payload = decoded.payload;
    assert.ok(typeof payload === "object");
    assert.equal(payload.userId, "user-1");
    assert.equal(payload.exp! - payload.iat!, AUTH_SESSION_TTL_SECONDS);
    assert.equal(payload.iss, "hidroflorestas");
    assert.equal(payload.aud, "hidroflorestas-session");
    assert.deepEqual(Object.keys(payload).sort(), ["aud", "credentialVersion", "exp", "iat", "iss", "purpose", "userId"]);
  });

  it("rejects tampered, expired, invalid-payload, and non-HS256 tokens", () => {
    const valid = signSessionToken("user-1", SECRET);
    const tampered = `${valid.slice(0, -1)}${valid.endsWith("a") ? "b" : "a"}`;
    const expired = jwt.sign({ userId: "user-1", exp: 1 }, SECRET, {
      algorithm: "HS256",
    });
    const invalidPayload = jwt.sign({ role: "ADMIN" }, SECRET, {
      algorithm: "HS256",
    });
    const wrongAlgorithm = jwt.sign({ userId: "user-1" }, SECRET, {
      algorithm: "HS384",
    });

    for (const token of [tampered, expired, invalidPayload, wrongAlgorithm]) {
      assert.equal(verifySessionToken(token, SECRET), null);
    }
  });

  it("keeps creation and removal cookie options coherent", () => {
    assert.equal(AUTH_COOKIE_NAME, "auth_token");
    assert.deepEqual(getAuthCookieOptions("development"), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_SESSION_TTL_SECONDS,
    });
    assert.equal(getAuthCookieOptions("production").secure, true);

    const expired = getExpiredAuthCookieOptions("development");
    assert.equal(expired.path, "/");
    assert.equal(expired.maxAge, 0);
    assert.equal(expired.expires.getTime(), 0);
    assert.equal(expired.httpOnly, true);
    assert.equal(expired.sameSite, "lax");
  });
});

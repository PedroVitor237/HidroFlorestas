import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";
import { authenticateCredentials, authenticateSession, type CredentialUser, type CurrentIdentity } from "../../src/app/api/server/auth/auth.core";
import { AUTH_SESSION_TTL_SECONDS, SESSION_ISSUER, VERIFICATION_SESSION_TTL_SECONDS, signSessionToken, verifySessionToken } from "../../src/app/api/server/auth/session";

const secret = "independent-synthetic-session-secret";
const identity: CurrentIdentity = { id: "independent-user", firstName: "Synthetic", lastName: "Review", image: "", status: "ACTIVE", role: "ADMIN", verificationRequired: false, credentialVersion: 0, emailVerifiedAt: null };

test("independent session review rejects signed tokens with incoherent purpose, audience, version or lifetime", () => {
  const now = Math.floor(Date.now() / 1000);
  const base = { userId: identity.id, iat: now, exp: now + 60, purpose: "session", credentialVersion: 0, iss: SESSION_ISSUER, aud: "hidroflorestas-session" };
  const variants = [
    { ...base, credentialVersion: -1 }, { ...base, credentialVersion: 0.5 }, { ...base, credentialVersion: "0" },
    { ...base, purpose: "email-verification" }, { ...base, aud: "another-service" }, { ...base, aud: ["hidroflorestas-session", "another-service"] },
    { ...base, iss: "another-issuer" }, { ...base, credentialVersion: undefined }, { ...base, purpose: undefined },
    { ...base, exp: now + AUTH_SESSION_TTL_SECONDS + 1 }, { ...base, iat: now + 120, exp: now + 180 },
    { ...base, purpose: "email-verification", aud: "hidroflorestas-verification", exp: now + VERIFICATION_SESSION_TTL_SECONDS + 1 },
  ];
  for (const payload of variants) assert.equal(verifySessionToken(jwt.sign(payload, secret, { algorithm: "HS256" }), secret), null);
  const missingExpiry: Record<string, unknown> = { ...base }; delete missingExpiry.exp;
  assert.equal(verifySessionToken(jwt.sign(missingExpiry, secret, { algorithm: "HS256" }), secret), null);
  assert.equal(verifySessionToken(jwt.sign(base, secret, { algorithm: "HS256", noTimestamp: true }), secret), null);
  assert.ok(verifySessionToken(signSessionToken(identity.id, secret, 0, "session"), secret));
});

test("independent restricted-session review denies private access even after the account becomes verified", async () => {
  const token = signSessionToken(identity.id, secret, 0, "email-verification");
  for (const emailVerifiedAt of [null, new Date()]) {
    const result = await authenticateSession(token, { verifyToken: value => verifySessionToken(value, secret), findCurrentIdentity: async () => ({ ...identity, verificationRequired: true, emailVerifiedAt }) });
    assert.deepEqual(result, { success: false, reason: "UNAUTHENTICATED" });
  }
});

test("independent legacy review confines versionless tokens to the existing cohort at revision zero", async () => {
  const token = jwt.sign({ userId: identity.id }, secret, { algorithm: "HS256", expiresIn: 60 });
  const authenticate = (user: CurrentIdentity) => authenticateSession(token, { verifyToken: value => verifySessionToken(value, secret), findCurrentIdentity: async () => user });
  assert.equal((await authenticate(identity)).success, true);
  for (const user of [{ ...identity, verificationRequired: true }, { ...identity, credentialVersion: 1 }, { ...identity, status: "BLOCKED" }, { ...identity, status: "INACTIVE" }, { ...identity, status: "PENDING" }]) assert.deepEqual(await authenticate(user), { success: false, reason: "UNAUTHENTICATED" });
});

test("independent revocation review denies every old normal token after a password revision", async () => {
  const token = signSessionToken(identity.id, secret, 0, "session");
  const result = await authenticateSession(token, { verifyToken: value => verifySessionToken(value, secret), findCurrentIdentity: async () => ({ ...identity, credentialVersion: 1 }) });
  assert.deepEqual(result, { success: false, reason: "UNAUTHENTICATED" });
});

test("independent credential review refuses a revised account between bcrypt comparison and issuance", async () => {
  let issued = 0;
  const candidate: CredentialUser = { ...identity, password: "synthetic-old-hash" };
  const result = await authenticateCredentials({ email: "synthetic@review.invalid", password: "synthetic password" }, {
    findCredentialUser: async () => candidate,
    comparePassword: async () => true,
    revalidateUser: async () => ({ ...identity, credentialVersion: 1 }),
    issueToken: () => { issued++; return "must-not-issue"; },
  });
  assert.deepEqual(result, { success: false, reason: "INVALID_CREDENTIALS" });
  assert.equal(issued, 0);
});

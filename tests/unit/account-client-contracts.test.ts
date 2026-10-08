import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAuthEnvelope } from "../../src/types/auth.type";
import { parseAccountMessage, parseVerificationState } from "../../src/components/account/account-client";

test("pre-verification envelopes keep the public identity allowlist and closed navigation targets", () => {
  const user = { firstName: "Conta", lastName: "Teste", image: "" };
  assert.equal(parseAuthEnvelope({ success: true, user, destination: "/verify-email" })?.success, true);
  for (const destination of ["https://outside.example.invalid", "javascript:alert(1)", "/dashboard/profile", "//outside.example.invalid"]) {
    assert.equal(parseAuthEnvelope({ success: true, user, destination }), null);
  }
  for (const extra of [{ password: "redacted" }, { role: "ADMIN" }, { token: "redacted" }, { credentialVersion: 0 }]) {
    assert.equal(parseAuthEnvelope({ success: true, user: { ...user, ...extra }, destination: "/verify-email" }), null);
  }
});

test("verification status rejects proof material and malformed clock/attempt values", () => {
  const state = { success: true, status: "PENDING", challengeId: "challenge", expiresAt: "2026-10-04T12:00:00.000Z", resendAvailableAt: null, attemptsRemaining: 5 };
  assert.ok(parseVerificationState(state));
  for (const extra of [{ code: "redacted" }, { proofDigest: "redacted" }, { email: "private@example.invalid" }]) assert.equal(parseVerificationState({ ...state, ...extra }), null);
  assert.equal(parseVerificationState({ ...state, expiresAt: "invalid" }), null);
  assert.equal(parseVerificationState({ ...state, attemptsRemaining: -1 }), null);
  assert.equal(parseVerificationState({ ...state, attemptsRemaining: 1.5 }), null);
  assert.equal(parseVerificationState({ ...state, status: "ACTIVE" }), null);
});

test("account notifications and retry errors do not expand to arbitrary response fields", () => {
  assert.equal(parseAccountMessage({ success: true, message: "Confira seu e-mail." }), "Confira seu e-mail.");
  assert.equal(parseAccountMessage({ success: true, message: "Confira seu e-mail.", exists: true }), null);
  assert.equal(parseAccountMessage({ success: true, message: "Confira seu e-mail.", token: "redacted" }), null);
  const error = { success: false, code: "RATE_LIMITED", message: "Aguarde.", retryAfterSeconds: 60 };
  assert.ok(parseAuthEnvelope(error));
  for (const retryAfterSeconds of [-1, NaN, Infinity, "60"]) assert.equal(parseAuthEnvelope({ ...error, retryAfterSeconds }), null);
  assert.equal(parseAuthEnvelope({ ...error, internalError: "redacted" }), null);
});

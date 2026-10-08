import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { createAccountHttpHandlers } from "../../src/app/api/server/accounts/http";
import { AccountError, RESET_REQUEST_MESSAGE, type VerificationState } from "../../src/app/api/server/accounts/contracts";
import { parseAuthEnvelope } from "../../src/types/auth.type";
import { parseAccountMessage, parseVerificationState } from "../../src/components/account/account-client";
import type { AccountService } from "../../src/app/api/server/accounts/service";

const user = { firstName: "Pessoa", lastName: "Teste", image: "" }, challengeId = randomUUID();
const state: VerificationState = { success: true, status: "PENDING", challengeId, expiresAt: "2030-01-01T12:15:00.000Z", resendAvailableAt: "2030-01-01T12:01:00.000Z", attemptsRemaining: 5 };
type Service = Pick<AccountService, "signup" | "verificationState" | "confirmVerification" | "resend" | "requestReset" | "confirmReset" | "changePassword">;
function service(extra: Partial<Service> = {}): Service {
  return {
    signup: async () => ({ success: true, token: "synthetic-restricted-token", user, destination: "/verify-email", purpose: "email-verification", reused: false }),
    verificationState: async () => state,
    confirmVerification: async () => ({ success: true, token: "synthetic-normal-token", user, destination: "/workspace", purpose: "session" }),
    resend: async () => state, requestReset: async () => {}, confirmReset: async () => {}, changePassword: async () => {}, ...extra,
  };
}
const req = (path: string, body?: unknown, cookie = "verification_token=synthetic-restricted-token", additional: HeadersInit = {}) => new NextRequest(`https://app.example.test/api/auth/${path}`, { method: body === undefined ? "GET" : "POST", headers: { "content-type": "application/json", origin: "https://app.example.test", cookie, "idempotency-key": randomUUID(), ...additional }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
const handlers = (extra: Partial<Service> = {}, requireUser = async () => ({ id: "actor-42" })) => createAccountHttpHandlers({ service: async () => service(extra), environment: {}, nodeEnvironment: "production", requireUser, resetResponseDelay: async () => {} });

test("account HTTP creation/verification match the exact client contracts and rotate scoped cookies", async () => {
  const h = handlers(), created = await h.signup(req("sign-up", { firstName: "Pessoa", lastName: "Teste", email: "synthetic@example.test", password: "synthetic-password" }));
  assert.equal(created.status, 201); const publicCreation = await created.json(); assert.ok(parseAuthEnvelope(publicCreation)); assert.equal(publicCreation.destination, "/verify-email"); assert.equal(created.cookies.get("verification_token")?.value, "synthetic-restricted-token"); assert.equal(created.cookies.get("auth_token")?.value, "");
  const current = await h.verificationState(req("email-verification")); assert.deepEqual(parseVerificationState(await current.json()), state);
  const confirmed = await h.verificationConfirm(req("email-verification/confirm", { challengeId, code: "000042" })); assert.equal(confirmed.status, 200); assert.equal(confirmed.cookies.get("auth_token")?.value, "synthetic-normal-token"); assert.equal(confirmed.cookies.get("verification_token")?.value, "");
  const resent = await h.verificationResend(req("email-verification/resend", {})); assert.ok(parseVerificationState(await resent.json()));
  for (const response of [created, current, confirmed, resent]) { assert.match(response.headers.get("cache-control") ?? "", /no-store/); assert.equal(response.headers.get("referrer-policy"), "no-referrer"); }
});
test("account HTTP request reset is externally identical for eligible, absent, disabled and limited outcomes", async () => {
  const results: unknown[] = [];
  for (const outcome of ["eligible", "absent", "disabled", "limited"]) {
    let calls = 0;
    const response = await handlers({ requestReset: async () => { calls++; } }).resetRequest(req("password-reset/request", { email: `${outcome}@example.test` }));
    results.push({ status: response.status, body: await response.json(), headers: Object.fromEntries(response.headers) }); assert.equal(calls, 1);
  }
  for (const result of results) assert.deepEqual(result, results[0]);
  assert.deepEqual((results[0] as { body: unknown }).body, { success: true, message: RESET_REQUEST_MESSAGE });
});
test("account HTTP password changes expire both sessions and require fresh authentication", async () => {
  const h = handlers();
  for (const response of [await h.resetConfirm(req("password-reset/confirm", { token: "a".repeat(43), newPassword: "synthetic-new-password", confirmPassword: "synthetic-new-password" })), await h.changePassword(req("change-password", { currentPassword: "synthetic-password", newPassword: "synthetic-new-password", confirmPassword: "synthetic-new-password" }))]) {
    assert.equal(response.status, 200); assert.ok(parseAccountMessage(await response.json()));
    for (const name of ["auth_token", "verification_token"]) assert.equal(response.cookies.get(name)?.value, "");
  }
  const denied = await handlers({}, async () => { throw { code: "UNAUTHORIZED" }; }).changePassword(req("change-password", {})); assert.equal(denied.status, 401); assert.equal((await denied.json()).code, "UNAUTHENTICATED");
});
test("account HTTP rejects cross-origin work and redacts domain/provider failures", async () => {
  let calls = 0;
  const h = handlers({ signup: async () => { calls++; throw new Error("private details"); } });
  const blocked = await h.signup(req("sign-up", {}, "", { origin: "https://evil.example.test", "sec-fetch-site": "cross-site" })); assert.equal(blocked.status, 403); assert.equal(calls, 0);
  const internal = await h.signup(req("sign-up", {})); assert.equal(internal.status, 500); assert.doesNotMatch(JSON.stringify(await internal.json()), /private details/);
  const limited = await handlers({ resend: async () => { throw new AccountError("RATE_LIMITED", 60); } }).verificationResend(req("email-verification/resend", {})); assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "60"); assert.equal((await limited.json()).retryAfterSeconds, 60);
});

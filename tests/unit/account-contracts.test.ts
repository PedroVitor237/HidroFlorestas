import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { AccountError, normalizeEmail, parseSignup, requireIdempotencyKey, validateNewPassword, validatePasswordConfirmation } from "../../src/app/api/server/accounts/contracts";
import { accountBody, accountErrorResponse, accountIngress, accountSessionResponse, checkAccountCsrf, expireAccountCookies } from "../../src/app/api/server/accounts/http";
import { signSessionToken, verifySessionToken, VERIFICATION_SESSION_TTL_SECONDS, getVerificationCookieOptions } from "../../src/app/api/server/auth/session";

const password = " Conta de teste segura! ";
const signup = { firstName: "Pessoa", lastName: "Sintética", email: "First.Last+Alias@Example.test", password };
test("signup allows only its four fields and preserves factual aliases/case", () => {
  assert.deepEqual(parseSignup(signup), { ...signup, emailCanonical: "first.last+alias@example.test" });
  for (const extra of [{ role: "ADMIN" }, { status: "ACTIVE" }, { emailVerifiedAt: new Date() }, { credentialVersion: 9 }]) assert.throws(() => parseSignup({ ...signup, ...extra }), AccountError);
  for (const body of [null, [], { ...signup, firstName: "\nPessoa" }, { ...signup, password: "short" }, { ...signup, email: "test\r\n@example.test" }]) assert.throws(() => parseSignup(body), AccountError);
});
test("identity normalization is conservative and rejects header/control injection", () => {
  assert.deepEqual(normalizeEmail(" First.Last+tag@Example.test "), { factual: "First.Last+tag@Example.test", canonical: "first.last+tag@example.test" });
  assert.notEqual(normalizeEmail("f.irst+tag@example.test").canonical, normalizeEmail("first@example.test").canonical);
  for (const email of ["broken", "Name <name@example.test>", "test@example.test\nBcc:x@y.test", "test@localhost", 42]) assert.throws(() => normalizeEmail(email), AccountError);
});
test("new password policy uses Unicode code points/UTF-8 bytes without truncating or changing spaces", async () => {
  for (const value of ["a".repeat(15), "a".repeat(72), "🌳".repeat(15), "ç".repeat(36), password, "  muito espaço na senha  "]) {
    assert.doesNotThrow(() => validateNewPassword(value));
    const hash = await bcrypt.hash(value, 4);
    assert.equal(await bcrypt.compare(value, hash), true);
    if (value.trim() !== value) assert.equal(await bcrypt.compare(value.trim(), hash), false);
  }
  for (const value of ["a".repeat(14), "a".repeat(73), "🌳".repeat(19), " ".repeat(15), "\u2003".repeat(15), "\uD800".repeat(15), "a".repeat(15) + "\0"]) assert.throws(() => validateNewPassword(value), AccountError);
  assert.throws(() => validatePasswordConfirmation(password, `${password}!`), AccountError);
});
test("idempotency keys are opaque UUIDs and never use email or plaintext password", () => {
  const key = "00000000-0000-4000-8000-000000000042";
  assert.equal(requireIdempotencyKey(key), key);
  for (const value of [undefined, "name@example.test", password, "key", "00000000-0000-0000-0000-000000000000"]) assert.throws(() => requireIdempotencyKey(value), AccountError);
});
test("CSRF rejects cross-site/same-site and untrusted origins without using Origin as rate identity", () => {
  const req = (headers: HeadersInit) => new Request("https://app.example.test/api/auth/sign-up", { method: "POST", headers });
  assert.doesNotThrow(() => checkAccountCsrf(req({ origin: "https://app.example.test", "sec-fetch-site": "same-origin" }), {}));
  assert.doesNotThrow(() => checkAccountCsrf(req({}), {}));
  const untrusted: HeadersInit[] = [{ origin: "https://evil.example.test" }, { origin: "null" }, { "sec-fetch-site": "cross-site" }, { "sec-fetch-site": "same-site" }];
  for (const headers of untrusted) assert.throws(() => checkAccountCsrf(req(headers), {}), AccountError);
  assert.equal(accountIngress(req({ origin: "https://app.example.test", "x-forwarded-for": "1.2.3.4", "x-vercel-forwarded-for": "2.3.4.5" }), {}), "unknown-ingress");
  assert.equal(accountIngress(req({ "x-vercel-forwarded-for": "2.3.4.5" }), { ACCOUNT_TRUSTED_INGRESS: "vercel", VERCEL: "1" }), "2.3.4.5");
  assert.equal(accountIngress(req({ "x-vercel-forwarded-for": "2.3.4.5,9.9.9.9" }), { ACCOUNT_TRUSTED_INGRESS: "vercel", VERCEL: "1" }), "unknown-ingress");
});
test("CSRF uses a trusted external origin across Next loopback normalization and hosted reverse proxies", () => {
  const local = { NODE_ENV: "development", ACCOUNT_TRUSTED_INGRESS: "local", ACCOUNTS_LOCAL_POSTGRESQL: "1", IMP006_LOCAL_REGRESSION_PUBLIC: "1" };
  const localRequest = (origin: string, host = "127.0.0.1:3001", site = "same-origin") => new NextRequest("http://127.0.0.1:3001/api/auth/sign-up", { method: "POST", headers: { origin, host, "sec-fetch-site": site } });
  const legitimate = localRequest("http://127.0.0.1:3001");
  assert.equal(new URL(legitimate.url).hostname, "localhost", "exercise installed Next URL normalization");
  assert.doesNotThrow(() => checkAccountCsrf(legitimate, local));
  for (const request of [localRequest("null"), localRequest("http://evil.example.test:3001"), localRequest("http://127.0.0.1:3001", "evil.example.test:3001"), localRequest("http://127.0.0.1:3002"), localRequest("http://127.0.0.1:3001", "127.0.0.1:3001", "same-site")]) assert.throws(() => checkAccountCsrf(request, local), AccountError);
  assert.throws(() => checkAccountCsrf(legitimate, { ...local, NODE_ENV: "production" }), AccountError);
  assert.throws(() => checkAccountCsrf(legitimate, { ...local, VERCEL: "1" }), AccountError);
  const https = { ...local, NODE_ENV: "production", AUTH_HTTPS_E2E: "1", TEST_DATABASE_CONFIRMATION: "HIDROFLORESTAS_AUTH_TEST", ACCOUNT_LOCAL_APP_ORIGIN: "https://127.0.0.1:44443" };
  const proxied = localRequest("https://127.0.0.1:44443"); assert.doesNotThrow(() => checkAccountCsrf(proxied, https));
  for (const configured of ["http://127.0.0.1:44443", "https://evil.example.test:44443", "https://user:pass@127.0.0.1:44443", "https://127.0.0.1:44443/path", "https://127.0.0.1:44443?query=1", "https://127.0.0.1:44443#fragment"]) assert.throws(() => checkAccountCsrf(proxied, { ...https, ACCOUNT_LOCAL_APP_ORIGIN: configured }), AccountError);
  assert.throws(() => checkAccountCsrf(proxied, { ...https, TEST_DATABASE_CONFIRMATION: undefined }), AccountError);
  const hosted = { NODE_ENV: "production", ACCOUNT_TRUSTED_INGRESS: "vercel", VERCEL: "1", APP_PUBLIC_URL: "https://accounts.example.test" };
  const remoteRequest = (origin: string) => new Request("http://internal.example.test:3000/api/auth/sign-up", { method: "POST", headers: { origin, "sec-fetch-site": "same-origin", host: "untrusted.example.test", "x-forwarded-host": "untrusted.example.test" } });
  assert.doesNotThrow(() => checkAccountCsrf(remoteRequest(hosted.APP_PUBLIC_URL), hosted));
  for (const origin of ["http://internal.example.test:3000", "https://untrusted.example.test", "https://127.0.0.1:44443", "null"]) assert.throws(() => checkAccountCsrf(remoteRequest(origin), { ...hosted, ACCOUNT_LOCAL_APP_ORIGIN: "https://127.0.0.1:44443", ACCOUNTS_LOCAL_POSTGRESQL: "1" }), AccountError);
  assert.throws(() => checkAccountCsrf(remoteRequest(hosted.APP_PUBLIC_URL), { ...hosted, VERCEL: undefined }), AccountError);
});
test("body parser caps input and rejects malformed content before domain work", async () => {
  assert.deepEqual(await accountBody(new Request("https://app.example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(signup) })), signup);
  for (const value of [new Request("https://app.example.test", { method: "POST", body: "{}" }), new Request("https://app.example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }), new Request("https://app.example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: "x".repeat(17000) }) })]) await assert.rejects(() => accountBody(value), AccountError);
});
test("restricted cookies rotate independently and all public envelopes hide token/proof", async () => {
  const token = signSessionToken("user-test", "synthetic-jwt-secret", 4, "email-verification");
  const decoded = verifySessionToken(token, "synthetic-jwt-secret");
  assert.equal(decoded?.purpose, "email-verification");
  assert.equal(getVerificationCookieOptions("production").maxAge, VERIFICATION_SESSION_TTL_SECONDS);
  const response = accountSessionResponse({ user: { firstName: "Pessoa", lastName: "Teste", image: "" }, destination: "/verify-email", token, purpose: "email-verification" }, 201, "production");
  const body = await response.json();
  assert.deepEqual(Object.keys(body).sort(), ["destination", "success", "user"]);
  assert.equal(response.cookies.get("verification_token")?.value, token);
  assert.equal(response.cookies.get("auth_token")?.value, "");
  const raw = response.headers.get("set-cookie") ?? ""; assert.match(raw, /HttpOnly/); assert.match(raw, /Secure/); assert.match(raw, /SameSite=lax/);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  const expired = NextResponse.json({ success: true }); expireAccountCookies(expired, "production");
  for (const name of ["auth_token", "verification_token"]) assert.equal(expired.cookies.get(name)?.value, "");
});
test("unknown failures are redacted and Retry-After has no account data", async () => {
  const response = accountErrorResponse(new Error("private proof/email/provider response"));
  assert.equal(response.status, 500); assert.equal((await response.json()).code, "INTERNAL_ERROR");
  const limited = accountErrorResponse(new AccountError("RATE_LIMITED", 60));
  assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal((await limited.json()).retryAfterSeconds, 60);
});

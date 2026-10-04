import assert from "node:assert/strict";
import { test } from "node:test";
import { randomBytes } from "node:crypto";
import { readMailConfig } from "../../src/app/api/server/mail/config";
import { readMailProtection, encryptMail, decryptMail, mailContentMac, type MailProtection } from "../../src/app/api/server/mail/crypto";
import { renderMail } from "../../src/app/api/server/mail/templates";
import { validateContent, validateMailbox } from "../../src/app/api/server/mail/contracts";
import { classifyMailFailure } from "../../src/app/api/server/mail/transport";
import { handleMailTrigger } from "../../src/app/api/server/mail/trigger";
import { redactMailValidation } from "../../scripts/mail-validation-diagnostics";

const environment = () => ({ SMTP_HOST: "smtp.gmail.com", SMTP_PORT: "587", SMTP_SECURE: "false", SMTP_REQUIRE_TLS: "true", SMTP_USER: "test@example.invalid", SMTP_APP_PASSWORD: "abcdefghijklmnop", MAIL_FROM: "test@example.invalid", APP_PUBLIC_URL: "https://app.example.invalid" });

test("MAIL-FR-002/TEST-001 strict lazy config for 465/587 and no secret in errors", () => {
  assert.equal(readMailConfig(environment()).secure, false);
  assert.equal(readMailConfig({ ...environment(), SMTP_PORT: "465", SMTP_SECURE: "true" }).secure, true);
  for (const invalid of [{}, { SMTP_SECURE: "true" }, { SMTP_REQUIRE_TLS: "false" }, { SMTP_HOST: "evil.invalid" }, { SMTP_PORT: "25" }, { MAIL_FROM: "x@example.invalid\r\nBcc: victim@example.invalid" }, { APP_PUBLIC_URL: "http://app.example.invalid" }, { APP_PUBLIC_URL: "https://user:secret@app.example.invalid" }, { SMTP_APP_PASSWORD: "" }, { SMTP_APP_PASSWORD: " ".repeat(16) }]) {
    const input = Object.keys(invalid).length ? { ...environment(), ...invalid } : {};
    assert.throws(() => readMailConfig(input), (error: Error) => error.message === "CONFIGURATION" && !error.message.includes(environment().SMTP_APP_PASSWORD));
  }
});

test("MAIL-FR-004 versioned Portuguese HTML/text escape, zero, supplied expiry and trusted origin", () => {
  const expiry = new Date("2030-01-01T12:34:56.000Z");
  const verification = renderMail({ template: "email-verification-v1", name: '<img src=x onerror="bad">&', code: "000042" }, expiry, "https://app.example.invalid");
  assert.match(verification.html, /&lt;img/); assert.doesNotMatch(verification.html, /<img/);
  assert.match(verification.text, /000042/); assert.match(verification.html, /000042/);
  assert.match(verification.text, /2030-01-01T12:34:56.000Z/);
  assert.doesNotMatch(verification.subject, /000042/);
  assert.doesNotMatch(verification.html.split("</span>")[0], /000042/);
  const token = "A".repeat(43);
  const reset = renderMail({ template: "password-reset-v1", name: "Teste", token }, expiry, "https://app.example.invalid");
  assert.match(reset.text, /https:\/\/app.example.invalid\/reset-password#token=/);
  assert.doesNotMatch(reset.subject, /A{43}/);
  assert.doesNotMatch(reset.html.split("</span>")[0], /A{43}/);
  assert.throws(() => validateContent({ template: "email-verification-v1", name: "x", code: "000042", html: "arbitrary" } as never));
  assert.throws(() => validateMailbox("A <a@example.invalid>"));
  assert.throws(() => validateContent({ template: "email-verification-v1", name: "x\r\nBcc:x", code: "000042" }));
  assert.throws(() => validateContent({ template: "email-verification-v1", name: "x", code: 42 } as never));
});

test("AEAD recipient/content confidentiality, AAD, tampering, unknown key, rotation, no fallback", () => {
  const old = randomBytes(32), next = randomBytes(32);
  const protection: MailProtection = { keys: new Map([["old", old]]), activeKeyId: "old", idempotencyKey: randomBytes(32), publicUrl: "https://app.example.invalid" };
  const value = { recipient: "synthetic@example.invalid", code: "000042" };
  const encrypted = encryptMail(value, "row-a", "EMAIL_VERIFICATION_V1", protection);
  assert.doesNotMatch(JSON.stringify(encrypted), /synthetic|000042/);
  assert.deepEqual(decryptMail(encrypted, "row-a", "EMAIL_VERIFICATION_V1", protection), value);
  assert.throws(() => decryptMail(encrypted, "row-b", "EMAIL_VERIFICATION_V1", protection), /PAYLOAD/);
  const tampered = Buffer.from(encrypted.data, "base64"); tampered[0] ^= 1;
  assert.throws(() => decryptMail({ ...encrypted, data: tampered.toString("base64") }, "row-a", "EMAIL_VERIFICATION_V1", protection), /PAYLOAD/);
  assert.throws(() => decryptMail({ ...encrypted, keyId: "unknown" }, "row-a", "EMAIL_VERIFICATION_V1", protection), /PAYLOAD/);
  const rotated = { ...protection, keys: new Map([["old", old], ["next", next]]), activeKeyId: "next" };
  assert.deepEqual(decryptMail(encrypted, "row-a", "EMAIL_VERIFICATION_V1", rotated), value);
  assert.equal(encryptMail(value, "row-a", "EMAIL_VERIFICATION_V1", rotated).keyId, "next");
  assert.equal(mailContentMac("same", rotated), mailContentMac("same", protection));
  assert.throws(() => readMailProtection({}, protection.publicUrl), /CONFIGURATION/);
  const env = { MAIL_PAYLOAD_ENCRYPTION_KEYS: JSON.stringify({ old: old.toString("base64") }), MAIL_PAYLOAD_ACTIVE_KEY_ID: "old", MAIL_IDEMPOTENCY_KEY: protection.idempotencyKey.toString("base64") };
  assert.equal(readMailProtection(env, protection.publicUrl).activeKeyId, "old");
});

test("TEST-003 typed failures never return raw provider details", () => {
  for (const [source, expected] of [[{ code: "EAUTH", message: "password secret" }, "AUTHENTICATION"], [{ code: "EAUTH", responseCode: 454 }, "TEMPORARY"], [{ code: "ETLS" }, "TLS"], [{ code: "CERT_HAS_EXPIRED" }, "TLS"], [{ code: "ECONNREFUSED" }, "CONNECTION"], [{ code: "ETIMEDOUT" }, "TIMEOUT"], [{ responseCode: 550 }, "PERMANENT"], [{ responseCode: 451 }, "TEMPORARY"], [{ response: "victim@example.invalid token" }, "UNKNOWN"]] as const) assert.equal(classifyMailFailure(source), expected);
});

test("operational evidence redacts secrets and provider headers without environment disclosure", () => {
  const key = randomBytes(32).toString("base64");
  const env = { SMTP_USER: "synthetic-secret@mail.test.invalid", SMTP_APP_PASSWORD: "abcd efgh ijkl mnop", MAIL_PAYLOAD_ENCRYPTION_KEYS: JSON.stringify({ synthetic: key }), MAIL_WORKER_SECRET: "synthetic-worker-secret", TEST_DATABASE_URL: "postgresql://synthetic-secret-db" };
  const normalizedPassword = env.SMTP_APP_PASSWORD.replaceAll(" ", "");
  const result = redactMailValidation(Object.values(env).join(" ") + ` ${normalizedPassword} ${key}\nAuthorization: Bearer synthetic-other-secret`, env);
  for (const value of Object.values(env)) assert.equal(result.includes(value), false);
  assert.equal(result.includes(normalizedPassword), false); assert.equal(result.includes(key), false);
  assert.doesNotMatch(result, /synthetic-other-secret/);
});

test("machine trigger protects no/missing/wrong secret, query/body, awaits and redacts failures", async () => {
  const secret = "synthetic_worker_secret_" + "x".repeat(32);
  let calls = 0;
  const run = async () => { calls++; return { claimed: 0 }; };
  const request = (header?: string, suffix = "") => new Request("https://app.example.invalid/api/internal/mail/process" + suffix, { headers: header ? { authorization: header } : {} });
  assert.equal((await handleMailTrigger(request(), run, "")).status, 503);
  assert.equal((await handleMailTrigger(request(), run, secret)).status, 401);
  assert.equal((await handleMailTrigger(request("Bearer wrong"), run, secret)).status, 401);
  assert.equal((await handleMailTrigger(request(`Bearer ${secret}`, "?to=x"), run, secret)).status, 400);
  assert.equal((await handleMailTrigger(new Request("https://app.example.invalid/api/internal/mail/process", { method: "POST", headers: { authorization: `Bearer ${secret}` }, body: "{}" }), run, secret)).status, 400);
  assert.equal(calls, 0);
  const ok = await handleMailTrigger(request(`Bearer ${secret}`), run, secret);
  assert.equal(ok.status, 200); assert.equal(ok.headers.get("cache-control"), "no-store"); assert.equal(calls, 1);
  const allowlisted = await handleMailTrigger(request(`Bearer ${secret}`), async () => ({ claimed: 1, recipient: "secret@example.invalid", token: "private-proof" }), secret);
  assert.doesNotMatch(await allowlisted.text(), /recipient|token|secret@example|private-proof/);
  const failed = await handleMailTrigger(request(`Bearer ${secret}`), async () => { throw new Error("smtp user@example.invalid proof secret"); }, secret);
  assert.equal(failed.status, 503); assert.doesNotMatch(await failed.text(), /smtp|proof|secret|@/);
});

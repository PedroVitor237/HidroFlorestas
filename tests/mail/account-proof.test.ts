import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { AccountError } from "../../src/app/api/server/accounts/contracts";
import { accountMac, emailBinding, generateResetToken, generateVerificationCode, readAccountProtection, resetDigest, safeDigestEqual, verificationDigest, type AccountProtection } from "../../src/app/api/server/accounts/proof";
import { readAccountPolicy } from "../../src/app/api/server/accounts/policy";
import { renderMail } from "../../src/app/api/server/mail/templates";
import { validateContent, MailError } from "../../src/app/api/server/mail/contracts";

const user = { id: "00000000-0000-4000-8000-000000000042", email: "Person.Test+tag@example.test", credentialVersion: 2 };
const challenge = "00000000-0000-4000-8000-000000000043";
function protection(): AccountProtection { return { keys: new Map([["v1", randomBytes(32)], ["v2", randomBytes(32)]]), activeKeyId: "v2", requestKey: randomBytes(32) }; }
test("proofs are CSPRNG text with exact width/high-entropy reset shape", () => {
  const codes = new Set<string>(), tokens = new Set<string>();
  for (let i = 0; i < 200; i++) { const code = generateVerificationCode(), token = generateResetToken(); assert.match(code, /^[0-9]{6}$/); assert.match(token, /^[A-Za-z0-9_-]{43}$/); assert.equal(Buffer.from(token, "base64url").length, 32); codes.add(code); tokens.add(token); }
  assert.ok(codes.size > 190); assert.equal(tokens.size, 200);
});
test("verification HMAC binds purpose/challenge/account/email/version and preserves zero", () => {
  const keys = protection(), proof = verificationDigest(keys, "v1", challenge, user, "000042");
  assert.match(proof, /^[0-9a-f]{64}$/); assert.equal(proof.includes("000042"), false);
  assert.equal(safeDigestEqual(proof, verificationDigest(keys, "v1", challenge, user, "000042")), true);
  for (const changed of [{ ...user, id: challenge }, { ...user, email: "other@example.test" }, { ...user, credentialVersion: 3 }]) assert.equal(safeDigestEqual(proof, verificationDigest(keys, "v1", challenge, changed, "000042")), false);
  assert.notEqual(proof, verificationDigest(keys, "v1", user.id, user, "000042"));
  assert.notEqual(proof, verificationDigest(keys, "v1", challenge, user, "100042"));
  assert.notEqual(proof, resetDigest(keys, "v1", "000042"));
  assert.notEqual(emailBinding(keys, "v1", user), emailBinding(keys, "v1", { ...user, credentialVersion: 3 }));
});
test("rotation retains old proof key and fails closed when it is removed", () => {
  const keys = protection(), digest = verificationDigest(keys, "v1", challenge, user, "000042");
  assert.equal(verificationDigest({ ...keys, activeKeyId: "v2" }, "v1", challenge, user, "000042"), digest);
  assert.notEqual(verificationDigest(keys, "v2", challenge, user, "000042"), digest);
  assert.throws(() => verificationDigest({ ...keys, keys: new Map([["v2", keys.keys.get("v2")!]]) }, "v1", challenge, user, "000042"), AccountError);
  assert.equal(safeDigestEqual("x", "x"), false); assert.equal(safeDigestEqual("f".repeat(64), "F".repeat(64)), false);
});
test("request commitments are keyed and purpose-separated; config is lazy/closed", () => {
  const keys = protection();
  assert.notEqual(accountMac(keys, ["signup", "private password"]), accountMac(keys, ["reset", "private password"]));
  assert.notEqual(accountMac(keys, ["signup", "private password"]), accountMac(protection(), ["signup", "private password"]));
  assert.throws(() => readAccountProtection({}), AccountError);
  assert.throws(() => readAccountPolicy({}), AccountError);
  const keyring = JSON.stringify(Object.fromEntries([...keys.keys].map(([id, key]) => [id, key.toString("base64")])));
  const mailKey = randomBytes(32).toString("base64"), env = { ACCOUNT_POLICY_ENABLED: "1", ACCOUNT_PROOF_KEYS: keyring, ACCOUNT_PROOF_ACTIVE_KEY_ID: "v2", ACCOUNT_REQUEST_KEY: keys.requestKey.toString("base64"), MAIL_PAYLOAD_ENCRYPTION_KEYS: JSON.stringify({ m1: mailKey }), MAIL_PAYLOAD_ACTIVE_KEY_ID: "m1", MAIL_IDEMPOTENCY_KEY: randomBytes(32).toString("base64"), APP_PUBLIC_URL: "https://app.example.test", ACCOUNT_TESTER_ALLOWLIST: "Person.Test+tag@Example.test" };
  const policy = readAccountPolicy(env); assert.equal(policy.verificationTtlMs, 900000); assert.equal(policy.resetTtlMs, 1800000); assert.equal(policy.maxCodeAttempts, 5); assert.equal(policy.testerAllowlist?.has(user.email.toLowerCase()), true);
  for (const changed of [{ ACCOUNT_POLICY_ENABLED: "0" }, { ACCOUNT_VERIFICATION_ATTEMPTS: "99" }, { ACCOUNT_RESET_TTL_SECONDS: "-1" }, { ACCOUNT_REQUEST_KEY: mailKey }, { APP_PUBLIC_URL: "http://localhost" }, { ACCOUNT_PROOF_ACTIVE_KEY_ID: "missing" }]) assert.throws(() => readAccountPolicy({ ...env, ...changed }), AccountError);
});
test("password-change notification is closed, escaped, and has no proof/reset link", () => {
  const content = { template: "password-changed-v1" as const, name: "<Pessoa>&" };
  const mail = renderMail(content, new Date("2030-01-01T12:00:00Z"), "https://app.example.test");
  assert.match(mail.subject, /senha foi alterada/i); assert.match(mail.html, /&lt;Pessoa&gt;&amp;/); assert.doesNotMatch(mail.html, /<Pessoa>|token=|#token|href=/); assert.doesNotMatch(mail.text, /senha de teste|token=/);
  assert.throws(() => validateContent({ ...content, token: "a".repeat(43) } as never), MailError);
});

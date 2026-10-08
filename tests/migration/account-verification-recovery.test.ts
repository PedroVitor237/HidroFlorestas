import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import type { PoolClient } from "pg";
import { withMigrationDatabase } from "./migration-test-harness";

const mailPath = "prisma/migrations/20261004000100_mail_foundation/migration.sql";
const accountPath = "prisma/migrations/20261004000200_account_verification_recovery/migration.sql";
const actionsPath = "prisma/migrations/20261004000300_account_rate_limit_actions/migration.sql";
const insertLegacy = (client: PoolClient, id: string, email: string) => client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,status,role,"updatedAt") VALUES ($1,$2,'Synthetic','Legacy','synthetic-old-hash','ACTIVE','ADMIN',now())`, [id, email]);
async function apply(client: PoolClient) { for (const path of [mailPath, accountPath, actionsPath]) await client.query(await readFile(path, "utf8")); }

test("accounts migration preserves factual identity and credentials, snapshots only existing compatibility cohort", async () => withMigrationDatabase(async (client) => {
  await insertLegacy(client, "legacy", " Mixed.Case@accounts.test.invalid ");
  const before = (await client.query(`SELECT email,password,status,role,"createdAt","updatedAt" FROM "User" WHERE id='legacy'`)).rows[0];
  await apply(client);
  const after = (await client.query(`SELECT email,password,status,role,"createdAt","updatedAt","emailCanonical","emailVerifiedAt","credentialVersion","verificationRequired" FROM "User" WHERE id='legacy'`)).rows[0];
  assert.deepEqual(after, { ...before, emailCanonical: "mixed.case@accounts.test.invalid", emailVerifiedAt: null, credentialVersion: 0, verificationRequired: false });
  await insertLegacy(client, "new-internal", "internal@accounts.test.invalid");
  const internal = (await client.query(`SELECT "verificationRequired","emailCanonical","emailVerifiedAt" FROM "User" WHERE id='new-internal'`)).rows[0];
  assert.deepEqual(internal, { verificationRequired: true, emailCanonical: null, emailVerifiedAt: null });
  const outbox = await client.query(`SELECT count(*)::int AS count FROM "MailOutbox"`); assert.equal(outbox.rows[0].count, 0);
}));

test("accounts canonical collisions fail before modifying legacy accounts or adding columns", async () => withMigrationDatabase(async (client) => {
  await insertLegacy(client, "one", "Mixed@accounts.test.invalid"); await insertLegacy(client, "two", " mixed@accounts.test.invalid ");
  await client.query(await readFile(mailPath, "utf8")); await client.query("BEGIN");
  await assert.rejects(client.query(await readFile(accountPath, "utf8")), /canonicalization collision/); await client.query("ROLLBACK");
  assert.equal((await client.query(`SELECT count(*)::int AS count FROM "User"`)).rows[0].count, 2);
  assert.equal((await client.query(`SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='User' AND column_name='emailCanonical'`)).rows[0].count, 0);
  assert.equal((await client.query(`SELECT "credentialVersion" FROM "User" WHERE id='one'`)).rows[0].credentialVersion, 0);
}));

test("accounts expression identity uniqueness also protects internal writers with nullable canonical field", async () => withMigrationDatabase(async (client) => {
  await insertLegacy(client, "legacy", "Mixed@accounts.test.invalid"); await apply(client);
  await assert.rejects(insertLegacy(client, "collision", " mixed@accounts.test.invalid "), /User_email_identity_key/);
  await insertLegacy(client, "internal", "internal@accounts.test.invalid");
  await assert.rejects(client.query(`UPDATE "User" SET "emailCanonical"='different@accounts.test.invalid' WHERE id='internal'`), /User_emailCanonical_matches_email/);
  await client.query(`UPDATE "User" SET "emailCanonical"='internal@accounts.test.invalid' WHERE id='internal'`);
  assert.equal((await client.query(`SELECT "verificationRequired" FROM "User" WHERE id='internal'`)).rows[0].verificationRequired, true);
}));

test("accounts additive limits accept all eight actions and preserve mail bounds", async () => withMigrationDatabase(async (client) => {
  await apply(client);
  const actions = ["email-verification", "password-reset", "sign-up", "sign-in", "verification-confirm", "reset-confirm", "change-password", "account-global"];
  for (const action of actions) await client.query(`INSERT INTO "MailRateLimitBucket" ("subjectMac",action,"windowStart","windowEnd",count) VALUES ($1,$2,now(),now()+interval '1 hour',1)`, ["a".repeat(64), action]);
  assert.equal((await client.query(`SELECT count(*)::int AS count FROM "MailRateLimitBucket"`)).rows[0].count, 8);
  await assert.rejects(client.query(`INSERT INTO "MailRateLimitBucket" ("subjectMac",action,"windowStart","windowEnd",count) VALUES ($1,'untrusted',now(),now()+interval '1 hour',1)`, ["b".repeat(64)]), /MailRateLimitBucket_bounds/);
  await assert.rejects(client.query(`UPDATE "MailRateLimitBucket" SET count=-1 WHERE action='account-global'`), /MailRateLimitBucket_bounds/);
  await assert.rejects(client.query(`UPDATE "MailRateLimitBucket" SET "windowEnd"="windowStart" WHERE action='account-global'`), /MailRateLimitBucket_bounds/);
}));

test("accounts request commitments, revisions, scope and referential ownership are constrained", async () => withMigrationDatabase(async (client) => {
  await insertLegacy(client, "legacy", "legacy@accounts.test.invalid"); await apply(client);
  const insert = (action: string, key: string, request: string, revision: number, expires = "now()+interval '24 hours'") => client.query(`INSERT INTO "AccountRequest" (action,"keyMac","requestMac","userId","credentialVersion","createdAt","expiresAt") VALUES ($1,$2,$3,'legacy',$4,now(),${expires})`, [action, key, request, revision]);
  await insert("sign-up", "a".repeat(64), "b".repeat(64), 0);
  await assert.rejects(insert("sign-up", "a".repeat(64), "b".repeat(64), 0), /AccountRequest_pkey/);
  await assert.rejects(insert("sign-up", "plain-key", "b".repeat(64), 0), /AccountRequest_commitments_check/);
  await assert.rejects(insert("sign-up", "c".repeat(64), "plain-request", 0), /AccountRequest_commitments_check/);
  await assert.rejects(insert("sign-up", "c".repeat(64), "d".repeat(64), -1), /AccountRequest_validity_check/);
  await assert.rejects(insert("password-reset", "c".repeat(64), "d".repeat(64), 0, "now()"), /AccountRequest_validity_check/);
  await assert.rejects(insert("browser-supplied-action", "c".repeat(64), "d".repeat(64), 0), /AccountRequest_action_check/);
  await assert.rejects(client.query(`DELETE FROM "User" WHERE id='legacy'`), /AccountRequest_userId_fkey/);
  const columns = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='AccountRequest'`);
  assert.equal(columns.rows.some((r) => /password|email|token|code/i.test(r.column_name)), false);
}));

test("accounts password notification is available without a live consumed challenge", async () => withMigrationDatabase(async (client) => {
  await apply(client);
  await client.query(`INSERT INTO "MailOutbox" (id,"idempotencyKey","contentMac",template,status,"availableAt","expiresAt","acceptedAt","updatedAt") VALUES ('notice','synthetic-notice',$1,'PASSWORD_CHANGED_V1','SENT',now(),now()+interval '1 hour',now(),now())`, ["a".repeat(64)]);
  assert.equal((await client.query(`SELECT "challengeId" FROM "MailOutbox" WHERE id='notice'`)).rows[0].challengeId, null);
}));

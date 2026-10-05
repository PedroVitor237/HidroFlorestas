import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withMigrationDatabase } from "./migration-test-harness";

test("deletion migration preserves all rate bounds, supports deletion limits and restricts mail ownership", async () => withMigrationDatabase(async client => {
  for (const name of ["20261004000100_mail_foundation", "20261004000200_account_verification_recovery", "20261004000300_account_rate_limit_actions", "20261005000100_account_deletion_mail_ownership"]) await client.query(await readFile(`prisma/migrations/${name}/migration.sql`, "utf8"));
  await client.query(`INSERT INTO "MailRateLimitBucket" ("subjectMac",action,"windowStart","windowEnd",count) VALUES ($1,'delete-account',now(),now()+interval '1 hour',1)`, ["a".repeat(64)]);
  for (const change of ["count=-1", '"windowEnd"="windowStart"', '"subjectMac"=\'plain-text\'', "action='untrusted'"]) await assert.rejects(client.query(`UPDATE "MailRateLimitBucket" SET ${change}`), /MailRateLimitBucket_bounds/);
  await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('owner','owner@accounts.test.invalid','Synthetic','Owner','synthetic',now())`);
  await client.query(`INSERT INTO "MailOutbox" (id,"idempotencyKey","contentMac",template,status,"availableAt","expiresAt","acceptedAt","updatedAt","accountUserId") VALUES ('notice','notice',$1,'PASSWORD_CHANGED_V1','SENT',now(),now()+interval '1 hour',now(),now(),'owner')`, ["a".repeat(64)]);
  await assert.rejects(client.query(`DELETE FROM "User" WHERE id='owner'`), /MailOutbox_accountUserId_fkey/);
  assert.equal((await client.query(`SELECT indexname FROM pg_indexes WHERE schemaname=current_schema() AND indexname='MailOutbox_unowned_password_notices_idx'`)).rowCount, 1);
}));

test("deletion migration backfills only provable challenge ownership without changing stored content", async () => withMigrationDatabase(async client => {
  for (const name of ["20261004000100_mail_foundation", "20261004000200_account_verification_recovery", "20261004000300_account_rate_limit_actions"]) await client.query(await readFile(`prisma/migrations/${name}/migration.sql`, "utf8"));
  await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('owner','owner@accounts.test.invalid','Synthetic','Owner','synthetic',now())`);
  await client.query(`INSERT INTO "AccountEmailChallenge" (id,"userId",purpose,"emailBindingMac","proofDigest","proofKeyId","expiresAt","maxAttempts") VALUES ('proof','owner','EMAIL_VERIFICATION',$1,$1,'synthetic',now()+interval '1 hour',5)`, ["a".repeat(64)]);
  await client.query(`INSERT INTO "MailOutbox" (id,"idempotencyKey","contentMac",template,status,"availableAt","expiresAt","encryptedPayload","updatedAt","challengeId") VALUES ('linked','linked',$1,'EMAIL_VERIFICATION_V1','PENDING',now(),now()+interval '1 hour','{"synthetic":true}',now(),'proof'), ('legacy','legacy',$1,'PASSWORD_CHANGED_V1','PENDING',now(),now()+interval '1 hour','{"synthetic":true}',now(),NULL)`, ["b".repeat(64)]);
  const before = (await client.query(`SELECT id,"contentMac","encryptedPayload",status FROM "MailOutbox" ORDER BY id`)).rows;
  await client.query(await readFile("prisma/migrations/20261005000100_account_deletion_mail_ownership/migration.sql", "utf8"));
  assert.deepEqual((await client.query(`SELECT id,"contentMac","encryptedPayload",status FROM "MailOutbox" ORDER BY id`)).rows, before);
  assert.deepEqual((await client.query(`SELECT id,"accountUserId" FROM "MailOutbox" ORDER BY id`)).rows, [{ id: "legacy", accountUserId: null }, { id: "linked", accountUserId: "owner" }]);
}));

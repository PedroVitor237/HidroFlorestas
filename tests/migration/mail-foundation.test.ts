import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withMigrationDatabase } from "./migration-test-harness";

const migrationPath = "prisma/migrations/20261004000100_mail_foundation/migration.sql";

test("mail additive migration preserves legacy identity/status/role/password; nullable fields and constraints", async () => {
  await withMigrationDatabase(async (client) => {
    await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,status,role,"updatedAt") VALUES ('legacy','Mixed.Case+tag@mail.test.invalid','Synthetic','Legacy','old-hash','ACTIVE','ADMIN',now())`);
    const before = (await client.query(`SELECT email,password,status,role FROM "User" WHERE id='legacy'`)).rows[0];
    await client.query(await readFile(migrationPath, "utf8"));
    const after = (await client.query(`SELECT email,password,status,role,"emailVerifiedAt","credentialVersion" FROM "User" WHERE id='legacy'`)).rows[0];
    assert.deepEqual(after, { ...before, emailVerifiedAt: null, credentialVersion: 0 });
    const tables = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema=current_schema() AND table_name IN ('MailOutbox','MailRateLimitBucket','AccountEmailChallenge')`);
    assert.equal(tables.rowCount, 3);
    const columns = await client.query(`SELECT data_type FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='MailOutbox' AND column_name IN ('createdAt','updatedAt','availableAt','expiresAt','leaseUntil')`);
    assert.equal(columns.rowCount, 5); assert.ok(columns.rows.every((r) => r.data_type === "timestamp with time zone"));
    await assert.rejects(client.query(`UPDATE "User" SET "credentialVersion"=-1 WHERE id='legacy'`), /User_credentialVersion_nonnegative/);
    await client.query(`INSERT INTO "AccountEmailChallenge" (id,"userId",purpose,"emailBindingMac","proofDigest","proofKeyId","expiresAt","maxAttempts") VALUES ('challenge','legacy','EMAIL_VERIFICATION',$1,$2,'external',now()+interval '1 hour',5)`, ["a".repeat(64), "b".repeat(64)]);
    await assert.rejects(client.query(`INSERT INTO "AccountEmailChallenge" (id,"userId",purpose,"emailBindingMac","proofDigest","proofKeyId","expiresAt","maxAttempts") VALUES ('duplicate','legacy','EMAIL_VERIFICATION',$1,$2,'external',now()+interval '1 hour',5)`, ["a".repeat(64), "b".repeat(64)]), /AccountEmailChallenge_current/);
    await assert.rejects(client.query(`DELETE FROM "User" WHERE id='legacy'`), /AccountEmailChallenge_userId_fkey/);
    await assert.rejects(client.query(`INSERT INTO "MailOutbox" (id,"idempotencyKey","contentMac",template,status,"availableAt","expiresAt","updatedAt") VALUES ('bad','synthetic-key',$1,'EMAIL_VERIFICATION_V1','PENDING',now(),now()+interval '1 hour',now())`, ["a".repeat(64)]), /MailOutbox_payload_state/);
    const indexes = await client.query(`SELECT indexname FROM pg_indexes WHERE schemaname=current_schema() AND tablename='MailOutbox'`);
    assert.ok(indexes.rowCount! >= 6);
    // An already-applied migration is not rewritten or blindly run twice. A transaction failure keeps schema/data intact.
    await client.query("BEGIN");
    await assert.rejects(client.query(await readFile(migrationPath, "utf8")), (error: { code?: string }) => error.code === "42701");
    await client.query("ROLLBACK");
    assert.equal((await client.query(`SELECT "credentialVersion" FROM "User" WHERE id='legacy'`)).rows[0].credentialVersion, 0);
  });
});

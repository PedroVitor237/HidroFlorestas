import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withMigrationDatabase } from "./migration-test-harness";

const authorityMigration = "prisma/migrations/20260919000100_user_administration/migration.sql";
const removalMigration = "prisma/migrations/20260920000100_remove_legacy_is_admin/migration.sql";

test("IMP-009 creates revisioned immutable audit storage and removes legacy authority", async () => {
  await withMigrationDatabase(async (client) => {
    await client.query(await readFile(authorityMigration, "utf8"));
    const revision = await client.query(`SELECT column_default, is_nullable FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='User' AND column_name='revision'`);
    assert.equal(revision.rows[0].is_nullable, "NO");
    assert.match(revision.rows[0].column_default, /0/);

    await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,role,status,"isAdmin","updatedAt") VALUES ('actor','actor@test.invalid','A','A','x','ADMIN','ACTIVE',true,now()),('target','target@test.invalid','T','T','x','USER','ACTIVE',false,now())`);
    await client.query(`INSERT INTO "AdministrativeAuditEvent" (id,"targetUserId","actorUserId",action,"beforeValue","afterValue",reason,"targetRevision") VALUES ('event','target','actor','GLOBAL_ROLE_CHANGED','USER','ADMIN','test',1)`);
    await assert.rejects(client.query(`UPDATE "AdministrativeAuditEvent" SET reason='changed' WHERE id='event'`), /immutable/);
    const unchanged = await client.query(`SELECT reason FROM "AdministrativeAuditEvent" WHERE id='event'`);
    assert.equal(unchanged.rows[0].reason, "test");

    await client.query(await readFile(removalMigration, "utf8"));
    const legacy = await client.query(`SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='User' AND column_name='isAdmin'`);
    assert.equal(legacy.rows[0].count, 0);
  }, "imp009_test");
});

test("IMP-009 preflight rolls back cleanly on contradictory legacy authority", async () => {
  await withMigrationDatabase(async (client) => {
    await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,role,status,"isAdmin","updatedAt") VALUES ('bad','bad@test.invalid','B','B','x','USER','ACTIVE',true,now())`);
    await assert.rejects(client.query(await readFile(authorityMigration, "utf8")), /contradictory/);
    const revision = await client.query(`SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='User' AND column_name='revision'`);
    assert.equal(revision.rows[0].count, 0);
  }, "imp009_test");
});

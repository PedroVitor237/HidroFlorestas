import assert from "node:assert/strict";
import { it } from "node:test";
import { withMigrationDatabase, applyAreaMigration } from "./migration-test-harness";

it("backfills points and ownership; deferred invariant preserves administrative deletion", async () => {
  await withMigrationDatabase(async (client) => {
    await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('owner','owner@imp003.invalid','Owner','Test','unused',now()),('member','member@imp003.invalid','Member','Test','unused',now());
      INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt") VALUES ('lab','Test','owner','test-code',now());
      INSERT INTO "ResearchersLinked" VALUES ('owner','lab'),('member','lab');
      INSERT INTO "Coordinates" VALUES ('point','-3.1234567','180');
      INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId","coordinatesId",municipality,state,cep,"landType","updatedAt") VALUES ('area','Area','owner','lab','point','City','State','legacy','FOREST',now());`);
    await applyAreaMigration(client);
    const columns = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='ResearchersLinked'`);
    assert.ok(columns.rows.some((r) => r.column_name === "role"), "role must be added by migration");
    const links = await client.query('SELECT id, role, "userId" FROM "ResearchersLinked" ORDER BY "userId"');
    assert.deepEqual(links.rows.map((r) => r.role), ["MEMBER", "OWNER"]);
    assert.equal(new Set(links.rows.map((r) => r.id)).size, 2);
    const point = (await client.query('SELECT latitude,longitude,cep,"landType" FROM "CollectionArea"')).rows[0];
    assert.equal(Number(point.latitude), -3.123457); assert.equal(Number(point.longitude), 180);
    assert.equal(point.cep, "legacy"); assert.equal(point.landType, "FOREST");
    assert.equal((await client.query(`SELECT to_regclass('"Coordinates"') AS name`)).rows[0].name, null);
    await assert.rejects(client.query(`UPDATE "ResearchersLinked" SET role='OWNER' WHERE "userId"='member'`));
    await client.query("BEGIN");
    await client.query(`DELETE FROM "ResearchersLinked" WHERE "userId"='owner'`);
    await assert.rejects(client.query("COMMIT"));
    await client.query("ROLLBACK");
    assert.equal((await client.query('SELECT count(*)::int AS count FROM "ResearchersLinked"')).rows[0].count, 2);
    await assert.rejects(client.query(`UPDATE "CollectionArea" SET latitude=91`));
    await client.query('DELETE FROM "CollectionArea"');
    await client.query('BEGIN');
    await client.query('DELETE FROM "ResearchersLinked"');
    await client.query('DELETE FROM "LaboratoryRoom"');
    await client.query('COMMIT');
    assert.equal((await client.query('SELECT count(*)::int AS count FROM "LaboratoryRoom"')).rows[0].count, 0);
  });
});

it("invalid legacy coordinates abort without dropping legacy data", async () => {
  await withMigrationDatabase(async (client) => {
    await client.query(`INSERT INTO "Coordinates" VALUES ('invalid','not-a-number','0')`);
    await assert.rejects(applyAreaMigration(client));
    await client.query("ROLLBACK");
    assert.equal((await client.query('SELECT count(*)::int AS count FROM "Coordinates"')).rows[0].count, 1);
    const columns = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='ResearchersLinked'`);
    assert.equal(columns.rows.some((r) => r.column_name === "role"), false);
  });
});

it("recovers a missing creator membership without granting ADMIN", async () => {
  await withMigrationDatabase(async(client)=>{
    await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('owner','owner@imp003.invalid','Owner','Test','unused',now()); INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt") VALUES ('lab','Test','owner','test-code',now());`);
    await applyAreaMigration(client);
    assert.deepEqual((await client.query('SELECT "userId",role FROM "ResearchersLinked"')).rows,[{userId:"owner",role:"OWNER"}]);
    await client.query(`INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId",latitude,longitude,"updatedAt") VALUES ('area','Minimal','owner','lab',90,-180,now())`);
    const area=(await client.query('SELECT municipality,state,cep,"landType","descriptionLandType" FROM "CollectionArea"')).rows[0];
    assert.ok(Object.values(area).every(value=>value===null));
  });
});
it("refuses a creator backfill that would exceed five memberships", async()=>{
 await withMigrationDatabase(async(client)=>{
  await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('owner','owner@imp003.invalid','Owner','Test','unused',now()); INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt") SELECT 'lab'||i,'Test','owner','code'||i,now() FROM generate_series(1,6) i;`);
  await assert.rejects(applyAreaMigration(client), /IMP003_MEMBERSHIP_LIMIT/);
  await client.query('ROLLBACK');
  assert.equal((await client.query('SELECT count(*)::int AS count FROM "ResearchersLinked"')).rows[0].count,0);
 });
});
it("refuses orphan coordinates before structural changes",async()=>{
 await withMigrationDatabase(async(client)=>{
  await client.query(`INSERT INTO "Coordinates" VALUES ('orphan','0','0')`);
  await assert.rejects(applyAreaMigration(client),/IMP003_COORDINATE_REFERENCES/);
  await client.query('ROLLBACK');
  assert.equal((await client.query('SELECT count(*)::int AS count FROM "Coordinates"')).rows[0].count,1);
 });
});

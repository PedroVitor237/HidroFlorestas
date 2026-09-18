import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withMigrationDatabase, applyAreaMigration, applyCollectionMigration } from "./migration-test-harness";
export const environmentalMigrationPath="prisma/migrations/20260917000100_environmental_measurement_set/migration.sql";
test("environmental migration preserves parent and legacy, enforces unique/FKs/immutability and rolls back",async()=>{
 await withMigrationDatabase(async db=>{
  await applyAreaMigration(db); await applyCollectionMigration(db);
  await db.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('author','test@imp005.invalid','Test','Test','unused',now());
   INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt") VALUES ('lab','Test','author','imp005',now());
   INSERT INTO "ResearchersLinked" ("userId","laboratoryRoomId",role) VALUES ('author','lab','OWNER');
   INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId",latitude,longitude,"updatedAt") VALUES ('area','Test','author','lab',0,0,now());
   INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","updatedAt") VALUES ('collection','area','lab','author',now(),'Z',now(),'50000000-0000-4000-8000-000000000001',now());
   INSERT INTO "TerrainData" (id,"collectionDataId") VALUES ('legacy','collection');`);
  const before=(await db.query(`SELECT row_to_json(c) AS value FROM "CollectionData" c`)).rows;
  await db.query('BEGIN'); await db.query(await readFile(environmentalMigrationPath,'utf8')); await db.query('ROLLBACK');
  assert.equal((await db.query(`SELECT to_regclass('"EnvironmentalMeasurementSet"') AS value`)).rows[0].value,null);
  await db.query(await readFile(environmentalMigrationPath,'utf8'));
  const insert=`INSERT INTO "EnvironmentalMeasurementSet" (id,"collectionDataId","userId","measurementContractVersion",payload,"payloadHash","confirmationKey","confirmedAt") VALUES ($1,$2,'author','ihfr-measurement-v1','{}','hash',$3,now())`;
  await db.query(insert,['set','collection','key']);
  assert.deepEqual((await db.query(`SELECT row_to_json(c) AS value FROM "CollectionData" c`)).rows,before);
  assert.equal((await db.query(`SELECT count(*)::int AS n FROM "TerrainData"`)).rows[0].n,1);
  await assert.rejects(db.query(insert,['second','collection','other']));
  await assert.rejects(db.query(insert,['orphan','missing','other']));
  await assert.rejects(db.query(`UPDATE "EnvironmentalMeasurementSet" SET "payloadHash"='changed'`));
  await assert.rejects(db.query(`DELETE FROM "EnvironmentalMeasurementSet"`));
  await assert.rejects(db.query(`DELETE FROM "User" WHERE id='author'`));
 },'imp005_test');
});

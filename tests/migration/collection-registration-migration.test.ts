import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyAreaMigration,
  applyCollectionMigration,
  withMigrationDatabase,
} from "./migration-test-harness";

async function withImp004Database(
  run: Parameters<typeof withMigrationDatabase>[0],
) {
  return withMigrationDatabase(async (client) => {
    await applyAreaMigration(client);
    await run(client);
  }, "imp004_test");
}

describe("IMP-004 collection registration migration", () => {
  it("adds the complete nullable legacy tuple and tenant-safe constraints", async () => {
    await withImp004Database(async (client) => {
      await applyCollectionMigration(client);
      const columns = await client.query(
        `SELECT column_name, is_nullable, data_type, datetime_precision
           FROM information_schema.columns
          WHERE table_schema=current_schema() AND table_name='CollectionData'
            AND column_name IN ('laboratoryRoomId','occurredAt','occurrenceOffset','confirmedAt','confirmationKey')`,
      );
      assert.equal(columns.rowCount, 5);
      assert.equal(
        columns.rows.find((row) => row.column_name === "laboratoryRoomId")
          ?.is_nullable,
        "NO",
      );
      for (const name of [
        "occurredAt",
        "occurrenceOffset",
        "confirmedAt",
        "confirmationKey",
      ]) {
        assert.equal(
          columns.rows.find((row) => row.column_name === name)?.is_nullable,
          "YES",
        );
      }
      const constraints = await client.query(
        `SELECT conname, contype FROM pg_constraint
          WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname=current_schema())
            AND conrelid IN ('"CollectionData"'::regclass, '"CollectionArea"'::regclass)`,
      );
      const names = new Set(constraints.rows.map((row) => row.conname));
      assert.ok(names.has("CollectionData_collectionAreaId_laboratoryRoomId_fkey"));
      assert.ok(names.has("CollectionData_confirmation_tuple_check"));
      assert.ok(names.has("CollectionData_occurrence_offset_check"));
      assert.ok(names.has("CollectionArea_id_laboratoryRoomId_key"));
    });
  });

  it("backfills only the laboratory and preserves legacy scientific children", async () => {
    await withImp004Database(async (client) => {
      await client.query(`
        INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt")
        VALUES ('author','author@imp004.invalid','Author','Test','unused',now());
        INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt")
        VALUES ('lab','Test','author','imp004-code',now());
        INSERT INTO "ResearchersLinked" ("userId","laboratoryRoomId",role)
        VALUES ('author','lab','OWNER');
        INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId",latitude,longitude,"updatedAt")
        VALUES ('area','Area','author','lab',0,0,now());
        INSERT INTO "CollectionData" (id,"collectionAreaId","userId",observations,"updatedAt")
        VALUES ('collection','area','author','legacy',now());
        INSERT INTO "WaterData" (id,"collectionDataId","waterSourceType","hasSpring","waterAvailability")
        VALUES ('water','collection','RIVER_STREAM',false,'PERMANENT');
        INSERT INTO "SoilData" (id,"collectionDataId","soilTexture","infiltrationRate_mm_h","compactionLevel","erosionSigns")
        VALUES ('soil','collection','SANDY',1,'LOW','NONE');
        INSERT INTO "VegetationData" (id,"collectionDataId","vegetationCoverPercent","fragmentationLevel","landscapeDegradation")
        VALUES ('vegetation','collection',50,'LOW','LOW');
        INSERT INTO "TerrainData" (id,"collectionDataId")
        VALUES ('terrain','collection');
        INSERT INTO "IHFRDiagnosis" (id,"collectionDataId","ihfrScore","ihfrClass","waterScore","soilScore","vegetationScore","territoryScore","dataQuality")
        VALUES ('diagnosis','collection',1,'LOW',1,1,1,1,'LOW');
      `);
      await applyCollectionMigration(client);
      const row = (
        await client.query(
          `SELECT "laboratoryRoomId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey",observations FROM "CollectionData" WHERE id='collection'`,
        )
      ).rows[0];
      assert.equal(row.laboratoryRoomId, "lab");
      assert.equal(row.occurredAt, null);
      assert.equal(row.occurrenceOffset, null);
      assert.equal(row.confirmedAt, null);
      assert.equal(row.confirmationKey, null);
      assert.equal(row.observations, "legacy");
      for (const table of [
        "WaterData",
        "SoilData",
        "VegetationData",
        "TerrainData",
        "IHFRDiagnosis",
      ]) {
        const result = await client.query(
          `SELECT count(*)::int AS count FROM "${table}"`,
        );
        assert.equal(result.rows[0].count, 1);
      }
    });
  });

  it("enforces complete tuples, offsets, contextual FK, author-scoped key and immutability", async () => {
    await withImp004Database(async (client) => {
      await client.query(`
        INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt")
        VALUES ('author','author@imp004.invalid','Author','Test','unused',now()),
               ('other','other@imp004.invalid','Other','Test','unused',now());
        INSERT INTO "LaboratoryRoom" (id,name,"userId","accessCode","updatedAt")
        VALUES ('lab','Test','author','imp004-code',now()),('other-lab','Other','other','imp004-other',now());
        INSERT INTO "ResearchersLinked" ("userId","laboratoryRoomId",role)
        VALUES ('author','lab','OWNER'),('other','other-lab','OWNER');
        INSERT INTO "CollectionArea" (id,name,"userId","laboratoryRoomId",latitude,longitude,"updatedAt")
        VALUES ('area','Area','author','lab',0,0,now()),('other-area','Other','other','other-lab',0,0,now());
      `);
      await applyCollectionMigration(client);
      await assert.rejects(
        client.query(
          `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","updatedAt") VALUES ('partial','area','lab','author',now(),now())`,
        ),
      );
      await assert.rejects(
        client.query(
          `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","updatedAt") VALUES ('bad-offset','area','lab','author',now(),'-00:00',now(),'40000000-0000-4000-8000-000000000001',now())`,
        ),
      );
      await assert.rejects(
        client.query(
          `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","updatedAt") VALUES ('crossed','area','other-lab','author',now())`,
        ),
      );
      await client.query(
        `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","updatedAt") VALUES ('confirmed','area','lab','author',now(),'Z',now(),'40000000-0000-4000-8000-000000000001',now())`,
      );
      await assert.rejects(
        client.query(`UPDATE "CollectionData" SET observations='changed' WHERE id='confirmed'`),
      );
      await assert.rejects(
        client.query(`DELETE FROM "CollectionData" WHERE id='confirmed'`),
      );
      await assert.rejects(
        client.query(
          `INSERT INTO "CollectionData" (id,"collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey","updatedAt") VALUES ('duplicate','area','lab','author',now(),'Z',now(),'40000000-0000-4000-8000-000000000001',now())`,
        ),
      );
    });
  });

  it("aborts transactionally when a laboratory cannot be derived", async () => {
    await withImp004Database(async (client) => {
      await client.query(`ALTER TABLE "CollectionData" DROP CONSTRAINT "CollectionData_collectionAreaId_fkey"`);
      await client.query(`INSERT INTO "User" (id,email,"firstName","lastName",password,"updatedAt") VALUES ('author','author@imp004.invalid','Author','Test','unused',now())`);
      await client.query(`INSERT INTO "CollectionData" (id,"collectionAreaId","userId","updatedAt") VALUES ('orphan','missing','author',now())`);
      await assert.rejects(applyCollectionMigration(client));
      await client.query("ROLLBACK");
      const columns = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='CollectionData' AND column_name='laboratoryRoomId'`,
      );
      assert.equal(columns.rowCount, 0);
    });
  });
});

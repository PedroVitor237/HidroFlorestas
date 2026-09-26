import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import type { PoolClient } from "pg";

import { IHFR_ACTORS, IHFR_LABORATORIES, insertIHFRActorFixtures } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS, insertIHFRContextFixtures } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN, insertIHFRDomainFixtures } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import {
  applyAreaMigration,
  applyCollectionMigration,
  applyEnvironmentalMigration,
  applyIHFRDiagnosisMigration,
  applyIHFRLifecycleReferenceMigration,
  applyRemoveLegacyIsAdminMigration,
  applyUserAdministrationMigration,
} from "./migration-test-harness";

async function insertPreMigrationFixtures(client: PoolClient) {
  await applyAreaMigration(client);
  await applyCollectionMigration(client);
  await applyEnvironmentalMigration(client);
  await applyUserAdministrationMigration(client);
  await applyIHFRDiagnosisMigration(client);
  await applyRemoveLegacyIsAdminMigration(client);
  await client.query("BEGIN");
  try {
    await insertIHFRActorFixtures(client);
    await insertIHFRContextFixtures(client);
    await insertIHFRDomainFixtures(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function insertOperation(
  client: PoolClient,
  collection: { laboratoryId: string; areaId: string; collectionId: string },
  diagnosisId: string | null,
  operationType: "CREATE_OR_REPLACE" | "REVOKE",
  outcome: "SUCCEEDED" | "INSUFFICIENT_DATA" = "SUCCEEDED",
) {
  const id = randomUUID();
  await client.query(
    `INSERT INTO "IHFRDiagnosisOperation"
      (id,"laboratoryRoomId","collectionAreaId","collectionDataId","actorUserId",
       "idempotencyKey","requestHash","operationType",outcome,"diagnosisId","responseSnapshot","completedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'{}'::jsonb,now())`,
    [id, collection.laboratoryId, collection.areaId, collection.collectionId, IHFR_ACTORS.owner,
      randomUUID(), `sha256:${"e".repeat(64)}`, operationType, outcome, diagnosisId],
  );
  return id;
}

async function insertCrossCollectionDiagnosis(client: PoolClient) {
  const supplementId = randomUUID();
  const diagnosisId = randomUUID();
  await client.query(
    `INSERT INTO "ExperimentalIHFRInputSupplement"
      (id,"collectionDataId","environmentalMeasurementSetId","createdByUserId",
       "inputContractVersion","landUseType",provenance,"payloadHash","confirmedAt")
     SELECT $1,$2,$3,"createdByUserId","inputContractVersion","landUseType",
            provenance,$4,"confirmedAt"
       FROM "ExperimentalIHFRInputSupplement" WHERE id=$5`,
    [supplementId, IHFR_CONTEXTS.inactiveCollection, IHFR_CONTEXTS.inactiveMeasurement,
      `sha256:${"f".repeat(64)}`, IHFR_DOMAIN.supplement],
  );
  await client.query(
    `INSERT INTO "ExperimentalIHFRDiagnosis"
      (id,"collectionDataId","environmentalMeasurementSetId","inputSupplementId",
       "rawScore","displayScore","ihfrClass","dataQuality","componentScores",
       decomposition,drivers,explanation,"measurementContractVersion","inputContractVersion",
       "mathContractVersion","algorithmVersion","contractHash","calculatedAt","scientificState")
     SELECT $1,$2,$3,$4,"rawScore","displayScore","ihfrClass","dataQuality",
            "componentScores",decomposition,drivers,explanation,"measurementContractVersion",
            "inputContractVersion","mathContractVersion","algorithmVersion","contractHash",
            "calculatedAt","scientificState"
       FROM "ExperimentalIHFRDiagnosis" WHERE id=$5`,
    [diagnosisId, IHFR_CONTEXTS.inactiveCollection, IHFR_CONTEXTS.inactiveMeasurement,
      supplementId, IHFR_DOMAIN.currentDiagnosis],
  );
  return diagnosisId;
}

async function insertPointer(client: PoolClient, operationId: string) {
  await client.query(`DELETE FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1`, [IHFR_CONTEXTS.confirmedCollection]);
  await client.query(
    `INSERT INTO "CurrentExperimentalIHFRDiagnosis" ("collectionDataId","diagnosisId","validFrom","operationId")
     VALUES ($1,$2,now(),$3)`,
    [IHFR_CONTEXTS.confirmedCollection, IHFR_DOMAIN.currentDiagnosis, operationId],
  );
}

async function insertEvent(
  client: PoolClient,
  eventType: "CREATED_CURRENT" | "SUPERSEDED" | "REVOKED",
  diagnosisId: string,
  operationId: string,
  replacementDiagnosisId: string | null = null,
  actorUserId = IHFR_ACTORS.owner,
) {
  await client.query(
    `INSERT INTO "IHFRDiagnosisLifecycleEvent"
      (id,"collectionDataId","diagnosisId","eventType","replacementDiagnosisId",
       "actorUserId","operationId",reason,"occurredAt",evidence)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),'{}'::jsonb)`,
    [randomUUID(), IHFR_CONTEXTS.confirmedCollection, diagnosisId, eventType,
      replacementDiagnosisId, actorUserId, operationId, eventType === "REVOKED" ? "fixture revocation" : null],
  );
}

test("IMP-006 rejects cross-record operation, CURRENT and lifecycle references", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const otherDiagnosisId = await insertCrossCollectionDiagnosis(client);
    const otherOperationId = await insertOperation(client, {
      laboratoryId: IHFR_LABORATORIES.inactive,
      areaId: IHFR_CONTEXTS.inactiveArea,
      collectionId: IHFR_CONTEXTS.inactiveCollection,
    }, otherDiagnosisId, "CREATE_OR_REPLACE");
    const revokeOperationId = await insertOperation(client, {
      laboratoryId: IHFR_LABORATORIES.active,
      areaId: IHFR_CONTEXTS.activeArea,
      collectionId: IHFR_CONTEXTS.confirmedCollection,
    }, IHFR_DOMAIN.currentDiagnosis, "REVOKE");

    const cases: Array<{ name: string; action: () => Promise<void> }> = [
      { name: "CURRENT operation belongs to another collection", action: () => insertPointer(client, otherOperationId) },
      { name: "CURRENT operation names another diagnosis", action: () => insertPointer(client, IHFR_DOMAIN.supersededOperation) },
      { name: "CURRENT operation has terminal outcome", action: () => insertPointer(client, IHFR_DOMAIN.insufficientOperation) },
      { name: "CURRENT operation is a revocation", action: () => insertPointer(client, revokeOperationId) },
      { name: "CREATED_CURRENT operation names another diagnosis", action: () => insertEvent(client, "CREATED_CURRENT", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.supersededOperation) },
      { name: "CREATED_CURRENT operation has terminal outcome", action: () => insertEvent(client, "CREATED_CURRENT", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.insufficientOperation) },
      { name: "SUPERSEDED operation does not name replacement", action: () => insertEvent(client, "SUPERSEDED", IHFR_DOMAIN.supersededDiagnosis, IHFR_DOMAIN.supersededOperation, IHFR_DOMAIN.currentDiagnosis) },
      { name: "SUPERSEDED replaces a diagnosis with itself", action: () => insertEvent(client, "SUPERSEDED", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.currentOperation, IHFR_DOMAIN.currentDiagnosis) },
      { name: "REVOKED operation belongs to another collection", action: () => insertEvent(client, "REVOKED", IHFR_DOMAIN.currentDiagnosis, otherOperationId) },
      { name: "REVOKED operation names another diagnosis", action: () => insertEvent(client, "REVOKED", IHFR_DOMAIN.supersededDiagnosis, revokeOperationId) },
      { name: "REVOKED operation is a creation", action: () => insertEvent(client, "REVOKED", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.currentOperation) },
      { name: "event actor differs from operation actor", action: () => insertEvent(client, "CREATED_CURRENT", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.currentOperation, null, IHFR_ACTORS.contextualAdmin) },
      { name: "operation diagnosis belongs to another collection", action: async () => { await insertOperation(client, {
        laboratoryId: IHFR_LABORATORIES.active,
        areaId: IHFR_CONTEXTS.activeArea,
        collectionId: IHFR_CONTEXTS.confirmedCollection,
      }, otherDiagnosisId, "CREATE_OR_REPLACE"); } },
      { name: "successful operation has no diagnosis", action: async () => { await insertOperation(client, {
        laboratoryId: IHFR_LABORATORIES.active,
        areaId: IHFR_CONTEXTS.activeArea,
        collectionId: IHFR_CONTEXTS.confirmedCollection,
      }, null, "CREATE_OR_REPLACE"); } },
      { name: "terminal operation names a diagnosis", action: async () => { await insertOperation(client, {
        laboratoryId: IHFR_LABORATORIES.active,
        areaId: IHFR_CONTEXTS.activeArea,
        collectionId: IHFR_CONTEXTS.confirmedCollection,
      }, IHFR_DOMAIN.currentDiagnosis, "CREATE_OR_REPLACE", "INSUFFICIENT_DATA"); } },
    ];

    const accepted: string[] = [];
    await client.query("BEGIN");
    try {
      for (const scenario of cases) {
        await client.query("SAVEPOINT negative_case");
        try {
          await assert.rejects(scenario.action, (error: unknown) => (error as { code?: string }).code === "23514");
        } catch {
          accepted.push(scenario.name);
        } finally {
          await client.query("ROLLBACK TO SAVEPOINT negative_case");
          await client.query("RELEASE SAVEPOINT negative_case");
        }
      }
    } finally {
      await client.query("ROLLBACK");
    }
    assert.deepEqual(accepted, [], `Cross-record inconsistencies accepted: ${accepted.join(", ")}`);
  });
});

test("IMP-006 reference migration preserves valid existing lifecycle rows", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await insertPreMigrationFixtures(client);
    const before = await client.query(`SELECT
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") AS operations,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") AS current,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") AS events`);
    assert.deepEqual(before.rows[0], { operations: 5, current: 1, events: 6 });

    await applyIHFRLifecycleReferenceMigration(client);

    const after = await client.query(`SELECT
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") AS operations,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") AS current,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") AS events`);
    assert.deepEqual(after.rows[0], before.rows[0]);
    const triggers = await client.query(`SELECT tgname FROM pg_trigger
      WHERE tgrelid IN ('"IHFRDiagnosisOperation"'::regclass,
                        '"CurrentExperimentalIHFRDiagnosis"'::regclass,
                        '"IHFRDiagnosisLifecycleEvent"'::regclass)
        AND tgname = ANY($1::text[]) AND tgenabled='O'
      ORDER BY tgname`, [["imp006_current_operation", "imp006_event_operation", "imp006_operation_reference"]]);
    assert.deepEqual(triggers.rows.map((row) => row.tgname),
      ["imp006_current_operation", "imp006_event_operation", "imp006_operation_reference"]);
  });
});

test("IMP-006 reference migration aborts without backfill on invalid existing events", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await insertPreMigrationFixtures(client);
    await insertEvent(client, "CREATED_CURRENT", IHFR_DOMAIN.currentDiagnosis, IHFR_DOMAIN.supersededOperation);
    await assert.rejects(
      () => applyIHFRLifecycleReferenceMigration(client),
      (error: unknown) => (error as { code?: string }).code === "23514",
    );
    await client.query("ROLLBACK");
    const events = await client.query(`SELECT count(*)::int AS count FROM "IHFRDiagnosisLifecycleEvent"`);
    assert.equal(events.rows[0].count, 7);
    const trigger = await client.query(`SELECT count(*)::int AS count FROM pg_trigger
      WHERE tgrelid='"IHFRDiagnosisLifecycleEvent"'::regclass AND tgname='imp006_event_operation'`);
    assert.equal(trigger.rows[0].count, 0);
  });
});

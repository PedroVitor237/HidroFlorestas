import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
const versions = { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash };
const supplement = { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST" as const, provenance: { kind: "FIELD_OBSERVATION" as const, observedAt: "2026-09-20T12:00:00.000Z" } };

test("real PostgreSQL lifecycle persists replacement, revocation, creation and replay atomically", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const keyReplace = randomUUID();
    const replaceRequest = { mode: "REPLACE" as const, expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement, versions };
    const replacement = await service.createOrReplace(IHFR_ACTORS.owner, context, replaceRequest, keyReplace);
    assert.equal(replacement.replayed, false);
    assert.equal(replacement.response.outcome, "SUCCEEDED");
    assert.equal(replacement.response.diagnosis?.lifecycleState, "CURRENT");
    const replacementId = replacement.response.diagnosis?.id;
    assert.ok(replacementId);
    assert.notEqual(replacementId, IHFR_DOMAIN.currentDiagnosis);
    const replay = await service.createOrReplace(IHFR_ACTORS.owner, context, replaceRequest, keyReplace);
    assert.equal(replay.replayed, true);
    assert.deepEqual(replay.response, replacement.response);
    assert.deepEqual(await service.operation(IHFR_ACTORS.owner, context, keyReplace), replacement.response);
    assert.equal((await service.readDetail(IHFR_ACTORS.member, context, IHFR_DOMAIN.currentDiagnosis)).lifecycleState, "SUPERSEDED");

    const keyRevoke = randomUUID();
    const revocation = await service.revoke(IHFR_ACTORS.owner, context, replacementId, { expectedCurrentDiagnosisId: replacementId, reason: "Correção documentada" }, keyRevoke);
    assert.equal(revocation.response.diagnosis?.lifecycleState, "REVOKED");
    assert.equal(await service.readCurrent(IHFR_ACTORS.member, context), null);
    assert.deepEqual((await service.revoke(IHFR_ACTORS.owner, context, replacementId, { expectedCurrentDiagnosisId: replacementId, reason: "Correção documentada" }, keyRevoke)).response, revocation.response);

    const keyCreate = randomUUID();
    const created = await service.createOrReplace(IHFR_ACTORS.owner, context, { mode: "CREATE", expectedCurrentDiagnosisId: null, supplement, versions }, keyCreate);
    assert.equal(created.response.outcome, "SUCCEEDED");
    assert.equal(created.response.diagnosis?.lifecycleState, "CURRENT");
    const counts = (await client.query(`SELECT (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,
      (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events`)).rows[0];
    assert.deepEqual(counts, { supplements: 2, diagnoses: 5, current: 1, operations: 7, events: 10 });
  });
});

test("injected failures at each write checkpoint roll back all IHFR domain tables", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const snapshot = async () => (await client.query(`SELECT
      (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,
      (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,
      (SELECT "diagnosisId" FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current_id,
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,
      (SELECT max("completedAt")::text FROM "IHFRDiagnosisOperation") completed_at,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events`, [context.collectionId])).rows[0];
    const baseline = await snapshot();
    for (const stage of ["AFTER_SUPPLEMENT", "AFTER_DIAGNOSIS", "AFTER_OPERATION", "AFTER_POINTER", "AFTER_EVENT", "BEFORE_COMMIT"] as const) {
      const service = new IHFRDiagnosisService(db, async (current) => { if (current === stage) throw new Error(`INJECTED_${stage}`); });
      await assert.rejects(service.createOrReplace(IHFR_ACTORS.owner, context, { mode: "REPLACE", expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement, versions }, randomUUID()), new RegExp(`INJECTED_${stage}`));
      assert.deepEqual(await snapshot(), baseline, stage);
    }
    for (const stage of ["AFTER_OPERATION", "AFTER_POINTER", "AFTER_EVENT", "BEFORE_COMMIT"] as const) {
      const service = new IHFRDiagnosisService(db, async (current) => { if (current === stage) throw new Error(`INJECTED_${stage}`); });
      await assert.rejects(service.revoke(IHFR_ACTORS.owner, context, IHFR_DOMAIN.currentDiagnosis, { expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, reason: "Correção autorizada" }, randomUUID()), new RegExp(`INJECTED_${stage}`));
      assert.deepEqual(await snapshot(), baseline, stage);
    }
  });
});

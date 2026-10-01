import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { IHFRDiagnosisService, type IHFRWriteCheckpoint } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const actor = IHFR_ACTORS.owner;
const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
const versions = { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash };
const supplement = (landUseType: "FOREST" | "URBAN" = "FOREST") => ({ inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType, provenance: { kind: "FIELD_OBSERVATION" as const, observedAt: "2026-09-20T12:00:00.000Z" } });
const replace = (landUseType: "FOREST" | "URBAN" = "FOREST") => ({ mode: "REPLACE" as const, expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement: supplement(landUseType), versions });
const create = (landUseType: "FOREST" | "URBAN" = "FOREST") => ({ mode: "CREATE" as const, expectedCurrentDiagnosisId: null, supplement: supplement(landUseType), versions });
type Result = Awaited<ReturnType<IHFRDiagnosisService["createOrReplace"]>>;
type Operation = (service: IHFRDiagnosisService, key: string) => Promise<Result>;

function contestedLock() {
  let arrivals = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const checkpoint = async (stage: IHFRWriteCheckpoint) => {
    if (stage !== "BEFORE_LOCK") return;
    arrivals++;
    if (arrivals === 2) release();
    await gate;
  };
  return { checkpoint, arrivals: () => arrivals };
}

const cases: Array<{
  name: string;
  empty?: boolean;
  first: Operation;
  second: Operation;
  expected: [number, number];
  failedCode?: string;
}> = [
  { name: "REPLACE same key and request", first: (s, key) => s.createOrReplace(actor, context, replace(), key), second: (s, key) => s.createOrReplace(actor, context, replace(), key), expected: [2, 0] },
  { name: "REPLACE same key divergent request", first: (s, key) => s.createOrReplace(actor, context, replace(), key), second: (s, key) => s.createOrReplace(actor, context, replace("URBAN"), key), expected: [1, 1], failedCode: "IDEMPOTENCY_CONFLICT" },
  { name: "REPLACE distinct keys", first: (s) => s.createOrReplace(actor, context, replace(), randomUUID()), second: (s) => s.createOrReplace(actor, context, replace(), randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
  { name: "REPLACE versus REVOKE", first: (s) => s.createOrReplace(actor, context, replace(), randomUUID()), second: (s) => s.revoke(actor, context, IHFR_DOMAIN.currentDiagnosis, { expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, reason: "Correção autorizada" }, randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
  { name: "REVOKE versus REVOKE", first: (s) => s.revoke(actor, context, IHFR_DOMAIN.currentDiagnosis, { expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, reason: "Correção autorizada" }, randomUUID()), second: (s) => s.revoke(actor, context, IHFR_DOMAIN.currentDiagnosis, { expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, reason: "Correção autorizada" }, randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
  { name: "CREATE same key and request", empty: true, first: (s, key) => s.createOrReplace(actor, context, create(), key), second: (s, key) => s.createOrReplace(actor, context, create(), key), expected: [2, 0] },
  { name: "CREATE distinct keys", empty: true, first: (s) => s.createOrReplace(actor, context, create(), randomUUID()), second: (s) => s.createOrReplace(actor, context, create(), randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
  { name: "CREATE divergent payloads", empty: true, first: (s) => s.createOrReplace(actor, context, create(), randomUUID()), second: (s) => s.createOrReplace(actor, context, create("URBAN"), randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
  { name: "CREATE versus REPLACE", first: (s) => s.createOrReplace(actor, context, create(), randomUUID()), second: (s) => s.createOrReplace(actor, context, replace(), randomUUID()), expected: [1, 1], failedCode: "STATE_CONFLICT" },
];

for (const scenario of cases) test(`PostgreSQL contested transaction: ${scenario.name}`, async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    if (scenario.empty) await new IHFRDiagnosisService(db).revoke(actor, context, IHFR_DOMAIN.currentDiagnosis, { expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, reason: "Preparação do cenário" }, randomUUID());
    const sharedKey = randomUUID();
    const before = (await client.query(`SELECT (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events`)).rows[0];
    const barrier = contestedLock();
    const service = new IHFRDiagnosisService(db, barrier.checkpoint);
    const results = await Promise.allSettled([scenario.first(service, sharedKey), scenario.second(service, sharedKey)]);
    assert.ok(barrier.arrivals() >= 2, scenario.name);
    const fulfilled = results.filter((result): result is PromiseFulfilledResult<Result> => result.status === "fulfilled");
    const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    assert.deepEqual([fulfilled.length, rejected.length], scenario.expected, scenario.name);
    if (scenario.failedCode) assert.equal((rejected[0].reason as { code?: string }).code, scenario.failedCode, scenario.name);
    if (fulfilled.length === 2) {
      assert.deepEqual(fulfilled.map((result) => result.value.replayed).sort(), [false, true], scenario.name);
      assert.deepEqual(fulfilled[0].value.response, fulfilled[1].value.response, scenario.name);
    }
    const after = (await client.query(`SELECT (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events,(SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current`, [context.collectionId])).rows[0];
    assert.equal(after.operations, before.operations + 1, scenario.name);
    assert.ok(after.diagnoses === before.diagnoses || after.diagnoses === before.diagnoses + 1, scenario.name);
    assert.ok(after.events >= before.events + 1 && after.events <= before.events + 2, scenario.name);
    assert.ok(after.current === 0 || after.current === 1, scenario.name);
    assert.equal((await client.query(`SELECT count(*)::int count FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1`, [context.collectionId])).rows[0].count, after.current);
  });
});

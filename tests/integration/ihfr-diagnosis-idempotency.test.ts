import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { createIHFROperationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
const route = (idempotencyKey: string, overrides = {}) => ({ params: Promise.resolve({ ...context, idempotencyKey, ...overrides }) });
const request = new Request("http://local.test/api/operations");
const write = { mode: "REPLACE" as const, expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST" as const, provenance: { kind: "FIELD_OBSERVATION" as const, observedAt: "2026-09-20T12:00:00.000Z" } }, versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash } };

test("operation recovery requires authentication", async () => {
  const GET = createIHFROperationHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: { operation: async () => { throw new Error("unreachable"); } } });
  const response = await GET(request, route(randomUUID()));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("real terminal recovery is actor/context scoped, replay-only and omits restricted ledger fields", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const key = randomUUID();
    const writer = IHFR_ACTORS.contextualAdmin;
    const original = await service.createOrReplace(writer, context, write, key);
    const GET = (actor: string) => createIHFROperationHandler({ requireAuth: async () => ({ id: actor }), service });
    const snapshot = async () => (await client.query(`SELECT (SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,(SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events,(SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,(SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,(SELECT max("completedAt")::text FROM "IHFRDiagnosisOperation") completed_at`)).rows[0];
    const before = await snapshot();
    const responses = await Promise.all([GET(writer)(request, route(key)), GET(writer)(request, route(key))]);
    for (const response of responses) {
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(await response.json(), original.response);
    }
    assert.deepEqual(await snapshot(), before);
    const serialized = JSON.stringify(original.response);
    for (const restricted of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "responseSnapshot", "evidence", "provenance", "reason", "SQL", "stack"]) assert.equal(serialized.includes(restricted), false, restricted);
    for (const actor of [IHFR_ACTORS.owner, IHFR_ACTORS.outsider, IHFR_ACTORS.revoked]) {
      assert.equal((await GET(actor)(request, route(key))).status, 404, actor);
    }
    for (const [overrides, status] of [[{ laboratoryId: IHFR_LABORATORIES.inactive }, 404], [{ areaId: IHFR_CONTEXTS.inactiveArea }, 404], [{ collectionId: IHFR_CONTEXTS.withoutMeasurementCollection }, 404]] as const) {
      const response = await GET(writer)(request, route(key, overrides));
      assert.equal(response.status, status);
      assert.equal((await response.json()).error.code !== undefined, true);
    }
    assert.equal((await GET(writer)(request, route(randomUUID()))).status, 404);
    const malformedKey = await GET(writer)(request, route("bad"));
    assert.equal(malformedKey.status, 400);
    assert.deepEqual(await malformedKey.json(), { error: { code: "INVALID_INPUT", message: "Invalid input" } });
    const malformedQuery = await GET(writer)(new Request("http://local.test/api/operations?extra=1"), route(key));
    assert.equal(malformedQuery.status, 400);
    assert.deepEqual(await malformedQuery.json(), { error: { code: "INVALID_INPUT", message: "Invalid input" } });
    assert.deepEqual(await snapshot(), before);
    await client.query(`UPDATE "ResearchersLinked" SET role='MEMBER' WHERE "userId"=$1 AND "laboratoryRoomId"=$2`, [writer, IHFR_LABORATORIES.active]);
    assert.equal((await GET(writer)(request, route(key))).status, 200);
    await client.query(`UPDATE "LaboratoryRoom" SET "isActive"=false WHERE id=$1`, [IHFR_LABORATORIES.active]);
    assert.equal((await GET(writer)(request, route(key))).status, 200);
    assert.deepEqual(await snapshot(), before);
    await client.query(`DELETE FROM "ResearchersLinked" WHERE "userId"=$1 AND "laboratoryRoomId"=$2`, [writer, IHFR_LABORATORIES.active]);
    assert.equal((await GET(writer)(request, route(key))).status, 404);
  });
});

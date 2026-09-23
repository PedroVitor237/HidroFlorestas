import assert from "node:assert/strict";
import { test } from "node:test";
import { createIHFRDetailHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";
import { IHFRDiagnosisServiceError } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { publicDiagnosisFixture as diagnosis } from "../fixtures/ihfr-diagnosis-public";

const params = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", diagnosisId: "60000000-0000-4000-8000-000000000062" };
test("detail endpoint forwards server-derived context and exposes only the public allowlist", async () => {
  const GET = createIHFRDetailHandler({ requireAuth: async () => ({ id: "actor-1" }), service: {
    readCurrent: async () => null,
    readDetail: async (actorId, context, diagnosisId) => { assert.equal(actorId, "actor-1"); assert.deepEqual(context, { laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId }); assert.equal(diagnosisId, params.diagnosisId); return diagnosis; },
  } });
  const response = await GET(new Request("http://local.test"), { params: Promise.resolve(params) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.deepEqual(body, { diagnosis });
  const serialized = JSON.stringify(body);
  for (const forbidden of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "environmentalPayload", "evidence", "lifecycleEvents"]) assert.equal(serialized.includes(forbidden), false);
});

test("missing, crossed and revoked-membership lookups share the same 404 envelope", async () => {
  for (const scenario of ["missing", "crossed", "revoked-membership"]) {
    const GET = createIHFRDetailHandler({ requireAuth: async () => ({ id: "actor-1" }), service: { readCurrent: async () => null, readDetail: async () => { throw new IHFRDiagnosisServiceError("NOT_FOUND"); } } });
    const response = await GET(new Request(`http://local.test/${scenario}`), { params: Promise.resolve(params) });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Resource not found" } });
  }
});

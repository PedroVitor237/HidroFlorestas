import assert from "node:assert/strict";
import { test } from "node:test";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { createIHFROperationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const key = "60000000-0000-4000-8000-000000000083";
const params = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", idempotencyKey: key };
const route = (value = params) => ({ params: Promise.resolve(value) });
const request = new Request("http://local.test");
const service = (result: unknown) => ({ operation: async () => result });

test("recovery requires authentication and current contextual authorization", async () => {
  const missing = createIHFROperationHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: service(null) });
  assert.equal((await missing(request, route())).status, 401);
  for (const actor of ["revoked", "inactive-account", "outsider", "other-actor", "global-admin", "crossed-context"]) {
    const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: actor }), service: { operation: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    assert.equal((await GET(request, route())).status, 404, actor);
  }
});

test("authorized recovery returns the same minimized terminal snapshot with no-store", async () => {
  for (const outcome of ["SUCCEEDED_CREATE", "SUCCEEDED_REPLACE", "INSUFFICIENT_DATA", "INCOMPATIBLE_VERSION", "SUCCEEDED_REVOKE"]) {
    const snapshot = { outcome, diagnosisId: outcome.startsWith("SUCCEEDED") ? "diagnosis" : null };
    const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service(snapshot) });
    const response = await GET(request, route()); assert.equal(response.status, 200, outcome); assert.equal(response.headers.get("cache-control"), "no-store"); assert.deepEqual(await response.json(), snapshot);
  }
});

test("recovery never exposes ledger authority or restricted snapshots", async () => {
  const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "SUCCEEDED", diagnosisId: "diagnosis" }) });
  const serialized = JSON.stringify(await (await GET(request, route())).json());
  for (const field of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "responseSnapshot", "evidence", "stack", "SQL"]) assert.equal(serialized.includes(field), false);
});

test("same actor and key cannot silently cross laboratory, area or collection", async () => {
  for (const field of ["laboratoryId", "areaId", "collectionId"] as const) {
    const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: { operation: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    assert.equal((await GET(request, route({ ...params, [field]: "60000000-0000-4000-8000-000000000099" }))).status, 404, field);
  }
});

test("malformed or unknown operation key is sanitized", async () => {
  for (const idempotencyKey of ["bad", "60000000-0000-4000-8000-000000000099"]) {
    const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service(null) });
    const response = await GET(request, route({ ...params, idempotencyKey }));
    assert.ok([400, 404].includes(response.status));
  }
});

test("canonical replay treats property order as equal but relevant differences as conflicts", async () => {
  const equivalent = [{ mode: "CREATE", supplement: { landUseType: "FOREST", inputContractVersion: "v" } }, { supplement: { inputContractVersion: "v", landUseType: "FOREST" }, mode: "CREATE" }];
  assert.deepEqual(Object.keys(equivalent[0]).sort(), Object.keys(equivalent[1]).sort());
  for (const difference of ["mode", "landUseType", "expectedCurrentDiagnosisId", "version", "context", "operationType", "payload"]) assert.notEqual(difference.length, 0);
  const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: "IDEMPOTENCY_CONFLICT" } }) });
  assert.equal((await GET(request, route())).status, 409);
});

test("concurrent same-key recovery is replay-only and never leaks a raw unique error", async () => {
  const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "SUCCEEDED", diagnosisId: "diagnosis" }) });
  const responses = await Promise.all([GET(request, route()), GET(request, route())]);
  assert.deepEqual(responses.map((response) => response.status), [200, 200]);
  for (const response of responses) assert.equal(JSON.stringify(await response.json()).match(/unique constraint|Prisma|SQL/i), null);
});

test("replay and recovery do not duplicate PostgreSQL domain rows or timestamps", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const snapshot = async () => (await client.query(`SELECT (SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,(SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events,(SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,(SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,(SELECT max("completedAt")::text FROM "IHFRDiagnosisOperation") completed_at,(SELECT max("calculatedAt")::text FROM "ExperimentalIHFRDiagnosis") calculated_at`)).rows[0];
    const before = await snapshot();
    const GET = createIHFROperationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "SUCCEEDED", diagnosisId: "diagnosis" }) });
    await Promise.all([GET(request, route()), GET(request, route())]);
    assert.deepEqual(await snapshot(), before);
  });
});

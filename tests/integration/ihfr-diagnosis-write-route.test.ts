import assert from "node:assert/strict";
import { test } from "node:test";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { createIHFRWriteHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
const current = "60000000-0000-4000-8000-000000000062";
const supplement = { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } };
const versions = { measurementContractVersion: "ihfr-measurement-v1", mathContractVersion: "ihfr-math-experimental-v0.1.1", algorithmVersion: "ihfr-evaluator-ts-v0.1.0", contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89" };
const service = (result: unknown = { outcome: "SUFFICIENT", diagnosis: { id: "new", areaId: context.areaId } }) => ({ createOrReplace: async () => result });
const route = (params = context) => ({ params: Promise.resolve(params) });
const request = (body: unknown, key = crypto.randomUUID()) => {
  const versioned = body && typeof body === "object" && "mode" in body ? { versions, ...body } : body;
  return new Request("http://local.test", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(versioned) });
};

test("missing session is 401 and inaccessible or crossed context is indistinguishable 404", async () => {
  const unauthenticated = createIHFRWriteHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: service() });
  assert.equal((await unauthenticated(request({ mode: "CREATE", supplement }), route())).status, 401);
  for (const actor of ["outsider", "revoked", "global-admin", "crossed-lab", "crossed-area", "crossed-collection"]) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: actor }), service: { createOrReplace: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    assert.equal((await POST(request({ mode: "CREATE", supplement }), route())).status, 404, actor);
  }
});

test("MEMBER and inactive laboratory are forbidden while contextual OWNER and ADMIN may write", async () => {
  for (const actor of ["MEMBER", "INACTIVE_LAB"] as const) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: actor }), service: { createOrReplace: async () => { throw new AreaAccessError("FORBIDDEN"); } } });
    assert.equal((await POST(request({ mode: "CREATE", supplement }), route())).status, 403, actor);
  }
  for (const actor of ["OWNER", "ADMIN"] as const) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: actor }), service: service() });
    assert.equal((await POST(request({ mode: "CREATE", supplement }), route())).status, 201, actor);
  }
});

test("CREATE accepts expected id absent or null and exposes only public output", async () => {
  for (const body of [{ mode: "CREATE", supplement }, { mode: "CREATE", expectedCurrentDiagnosisId: null, supplement }]) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    const response = await POST(request(body), route());
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const serialized = JSON.stringify(await response.json());
    for (const field of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "evidence"]) assert.equal(serialized.includes(field), false);
  }
});

test("closed CREATE parser rejects conditional id, mode, key, enum, aliases, type and extras", async () => {
  const invalid = [
    [{ mode: "CREATE", expectedCurrentDiagnosisId: current, supplement }, crypto.randomUUID()],
    [{ supplement }, crypto.randomUUID()], [{ mode: "UPSERT", supplement }, crypto.randomUUID()],
    [{ mode: "CREATE", supplement, unexpected: true }, crypto.randomUUID()],
    [{ mode: "CREATE", supplement: { ...supplement, landUseType: "OTHER" } }, crypto.randomUUID()],
    [{ mode: "CREATE", supplement: { ...supplement, landUseType: "OTHERS" } }, crypto.randomUUID()],
    [{ mode: "CREATE", supplement: { ...supplement, landUseType: "forest" } }, crypto.randomUUID()],
    [{ mode: "CREATE", supplement: "FOREST" }, crypto.randomUUID()], [{ mode: "CREATE", supplement }, "bad-key"],
  ] as const;
  for (const [body, key] of invalid) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    assert.equal((await POST(request(body, key), route())).status, 400, JSON.stringify(body));
  }
});

test("CREATE with an existing current diagnosis is a controlled 409 without implicit replacement", async () => {
  const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: "STATE_CONFLICT" } }) });
  assert.equal((await POST(request({ mode: "CREATE", supplement }), route())).status, 409);
});

test("REPLACE requires the exact current diagnosis and creates an atomic successor", async () => {
  const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "ADMIN" }), service: service({ outcome: "SUFFICIENT", diagnosis: { id: "new", areaId: context.areaId, lifecycleState: "CURRENT" }, previous: { id: current, lifecycleState: "SUPERSEDED" } }) });
  const response = await POST(request({ mode: "REPLACE", expectedCurrentDiagnosisId: current, supplement }), route());
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.previous.lifecycleState, "SUPERSEDED");
  assert.equal(body.diagnosis.lifecycleState, "CURRENT");
});

test("REPLACE rejects missing/null/malformed/cross-context/non-current expected ids", async () => {
  for (const expectedCurrentDiagnosisId of [undefined, null, "bad", "missing", "other-lab", "other-area", "other-collection", "superseded", "revoked", "stale"]) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    const response = await POST(request({ mode: "REPLACE", expectedCurrentDiagnosisId, supplement }), route());
    assert.ok([400, 404, 409].includes(response.status), String(expectedCurrentDiagnosisId));
  }
});

test("valid absence produces recoverable INSUFFICIENT_DATA without a diagnosis", async () => {
  for (const reason of ["MISSING_LAND_USE_TYPE", "UNDETERMINED_PREDOMINANCE", "MISSING_SLOPE_PERCENT", "INSUFFICIENT_DIMENSION", "MISSING_ENVIRONMENTAL_DATA", "UNCONFIRMED_COLLECTION", "KNOWN_OPTIONAL_ABSENT", "ALLOWED_NULL"]) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "INSUFFICIENT_DATA", reason, diagnosis: null }) });
    const response = await POST(request({ mode: "CREATE", supplement: reason === "MISSING_LAND_USE_TYPE" ? { ...supplement, landUseType: undefined } : supplement }), route());
    assert.equal(response.status, 200, reason); assert.equal((await response.json()).diagnosis, null);
  }
});

test("incompatible versions, hash, algorithm or altered manifest are controlled 422", async () => {
  for (const reason of ["MEASUREMENT_VERSION", "SUPPLEMENT_VERSION", "MATH_VERSION", "ALGORITHM_VERSION", "CONTRACT_HASH", "ALTERED_MANIFEST", "HISTORICAL_V0_1_0", "VERSION_COMBINATION"]) {
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: "INCOMPATIBLE_VERSION", reason } }) });
    assert.equal((await POST(request({ mode: "CREATE", supplement }), route())).status, 422, reason);
  }
});

test("failed writes preserve every PostgreSQL baseline count", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const counts = async () => (await client.query(`SELECT (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,(SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,(SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events`)).rows[0];
    const before = await counts();
    for (const point of ["AFTER_SUPPLEMENT", "AFTER_OPERATION", "AFTER_DIAGNOSIS", "BEFORE_POINTER", "AFTER_POINTER", "BEFORE_EVENT", "DURING_TERMINAL_RESPONSE"]) {
      const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: "OWNER" }), service: { createOrReplace: async () => { throw new Error(`INJECTED_${point}`); } } });
      await POST(request({ mode: "REPLACE", expectedCurrentDiagnosisId: current, supplement }), route());
      assert.deepEqual(await counts(), before, point);
    }
  });
});

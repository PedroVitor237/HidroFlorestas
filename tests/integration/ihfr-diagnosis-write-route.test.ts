import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { createIHFRWriteHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { createIHFROperationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS, IHFR_MEASUREMENT_PAYLOAD } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
const versions = { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash };
const supplement = { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } };
const route = (value = context) => ({ params: Promise.resolve(value) });
const url = (value = context) => `http://local.test/api/laboratories/${value.laboratoryId}/areas/${value.areaId}/collections/${value.collectionId}/ihfr-diagnosis/diagnoses`;
function request(body: unknown, key: string | null = randomUUID(), value = context, contentType = "application/json") {
  const headers: Record<string, string> = { "content-type": contentType };
  if (key !== null) headers["idempotency-key"] = key;
  return new Request(url(value), { method: "POST", headers, body: JSON.stringify(body) });
}
const replace = { mode: "REPLACE", expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement, versions };

test("write boundary authenticates and rejects closed-body, key and media-type violations", async () => {
  const unauthorized = createIHFRWriteHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: { authorizeWrite: async () => { throw new Error("unreachable"); }, createOrReplace: async () => { throw new Error("unreachable"); } } });
  assert.equal((await unauthorized(request(replace), route())).status, 401);
  const guarded = createIHFRWriteHandler({ requireAuth: async () => ({ id: IHFR_ACTORS.owner }), service: { authorizeWrite: async () => {}, createOrReplace: async () => { throw new Error("invalid request reached service"); } } });
  const badBodies = [
    { mode: "CREATE", expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement, versions },
    { mode: "REPLACE", supplement, versions },
    { mode: "UPSERT", supplement, versions },
    { mode: "CREATE", supplement: { ...supplement, landUseType: "OTHER" }, versions },
    { mode: "CREATE", supplement: { ...supplement, landUseType: "forest" }, versions },
    { mode: "CREATE", supplement: { ...supplement, extra: true }, versions },
    { mode: "CREATE", supplement, versions, extra: true },
    { mode: "CREATE", supplement: "FOREST", versions },
  ];
  for (const body of badBodies) {
    const response = await guarded(request(body), route());
    assert.equal(response.status, 400, JSON.stringify(body));
    assert.equal((await response.json()).error.code, "INVALID_INPUT");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal((await guarded(request(replace, null), route())).status, 400);
  assert.equal((await guarded(request(replace, "bad-key"), route())).status, 400);
  assert.equal((await guarded(request(replace, randomUUID(), context, "text/plain"), route())).status, 400);
});

test("real write route enforces current contextual role, state, replay, Location and public DTO", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const handler = (actor: string) => createIHFRWriteHandler({ requireAuth: async () => ({ id: actor }), service });
    const member = await handler(IHFR_ACTORS.member)(request(replace), route());
    assert.equal(member.status, 403);
    assert.equal((await member.json()).error.code, "FORBIDDEN");
    const outsider = await handler(IHFR_ACTORS.outsider)(request(replace), route());
    assert.equal(outsider.status, 404);
    const crossed = await handler(IHFR_ACTORS.owner)(request(replace), route({ ...context, areaId: IHFR_CONTEXTS.inactiveArea }));
    assert.equal(crossed.status, 404);
    assert.deepEqual(await crossed.json(), { error: { code: "NOT_FOUND", message: "Resource not found" } });
    const inactiveContext = { laboratoryId: IHFR_LABORATORIES.inactive, areaId: IHFR_CONTEXTS.inactiveArea, collectionId: IHFR_CONTEXTS.inactiveCollection };
    const inactive = await handler(IHFR_ACTORS.owner)(request({ mode: "CREATE", supplement, versions }, randomUUID(), inactiveContext), route(inactiveContext));
    assert.equal(inactive.status, 409);
    assert.equal((await inactive.json()).error.code, "READ_ONLY");
    const existing = await handler(IHFR_ACTORS.owner)(request({ mode: "CREATE", supplement, versions }), route());
    assert.equal(existing.status, 409);
    assert.equal((await existing.json()).error.code, "STATE_CONFLICT");
    const stale = await handler(IHFR_ACTORS.owner)(request({ ...replace, expectedCurrentDiagnosisId: IHFR_DOMAIN.supersededDiagnosis }), route());
    assert.equal(stale.status, 409);
    const key = randomUUID();
    const POST = handler(IHFR_ACTORS.contextualAdmin);
    const created = await POST(request(replace, key), route());
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("cache-control"), "no-store");
    const body = await created.json();
    assert.equal(body.outcome, "SUCCEEDED");
    assert.equal(body.diagnosis.lifecycleState, "CURRENT");
    assert.equal(body.diagnosis.areaId, context.areaId);
    assert.equal(body.diagnosis.dataQuality, "HIGH");
    assert.equal(body.diagnosis.decomposition.length, 16);
    assert.deepEqual(body.insufficiencyReasons, []);
    assert.equal(created.headers.get("location"), `${new URL(url()).pathname}/${body.diagnosis.id}`);
    const serialized = JSON.stringify(body);
    for (const restricted of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "evidence", "reason"]) assert.equal(serialized.includes(restricted), false, restricted);
    const replayed = await POST(request(replace, key), route());
    assert.equal(replayed.status, 200);
    assert.deepEqual(await replayed.json(), body);
    const divergent = await POST(request({ ...replace, supplement: { ...supplement, landUseType: "URBAN" } }, key), route());
    assert.equal(divergent.status, 409);
    assert.equal((await divergent.json()).error.code, "IDEMPOTENCY_CONFLICT");
  });
});

test("valid absence is terminal without domain writes; incompatible stored version is 422 and recoverable", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: IHFR_ACTORS.owner }), service });
    const noMeasurement = { ...context, collectionId: IHFR_CONTEXTS.withoutMeasurementCollection };
    const missing = await POST(request({ mode: "CREATE", supplement, versions }, randomUUID(), noMeasurement), route(noMeasurement));
    assert.equal(missing.status, 200);
    assert.deepEqual(await missing.json(), { outcome: "INSUFFICIENT_DATA", diagnosis: null, insufficiencyReasons: ["MISSING_ENVIRONMENTAL_DATA"] });
    const noLand = await POST(request({ mode: "REPLACE", expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement: { ...supplement, landUseType: null }, versions }), route());
    assert.equal(noLand.status, 200);
    assert.ok((await noLand.json()).insufficiencyReasons.includes("MISSING_LAND_USE_TYPE"));
    const noDomain = await client.query(`SELECT (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,(SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,(SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current`);
    assert.deepEqual(noDomain.rows[0], { diagnoses: 3, supplements: 1, current: 1 });
    await client.query(`INSERT INTO "EnvironmentalMeasurementSet" (id,"collectionDataId","userId","measurementContractVersion",payload,"payloadHash","confirmationKey","confirmedAt") VALUES ($1,$2,$3,'legacy-measurement',$4::jsonb,'sha256:fixture-incompatible','fixture-incompatible',now())`,
      [randomUUID(), IHFR_CONTEXTS.withoutMeasurementCollection, IHFR_ACTORS.owner, JSON.stringify(IHFR_MEASUREMENT_PAYLOAD)]);
    const key = randomUUID();
    const incompatible = await POST(request({ mode: "CREATE", supplement, versions }, key, noMeasurement), route(noMeasurement));
    assert.equal(incompatible.status, 422);
    assert.equal((await incompatible.json()).error.code, "INCOMPATIBLE_VERSION");
    assert.deepEqual(await service.operation(IHFR_ACTORS.owner, noMeasurement, key), { outcome: "INCOMPATIBLE_VERSION", diagnosis: null, insufficiencyReasons: [] });
  });
});

test("well-formed request version mismatches persist one recoverable terminal and never change IHFR domain state", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const auth = { requireAuth: async () => ({ id: IHFR_ACTORS.owner }), service };
    const POST = createIHFRWriteHandler(auth);
    const GET = createIHFROperationHandler(auth);
    const counts = async () => (await client.query(`SELECT
      (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") supplements,
      (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") diagnoses,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") current,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") events,
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") operations,
      (SELECT "diagnosisId" FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current_id`, [context.collectionId])).rows[0];
    const baseline = await counts();
    const mismatches = [
      { measurementContractVersion: "ihfr-measurement-v2" },
      { mathContractVersion: IHFR_CONTRACT.historicalMathVersion },
      { algorithmVersion: "ihfr-evaluator-ts-v0.1.1" },
      { contractHash: `sha256:${"0".repeat(64)}` },
    ];
    for (const [index, changed] of mismatches.entries()) {
      const body = { ...replace, versions: { ...versions, ...changed } };
      const key = randomUUID();
      const fresh = await POST(request(body, key), route());
      assert.equal(fresh.status, 422, JSON.stringify(changed));
      assert.deepEqual(await fresh.json(), { error: { code: "INCOMPATIBLE_VERSION", message: "Incompatible IHFR version" } });
      assert.equal(fresh.headers.get("cache-control"), "no-store");
      const expected = { outcome: "INCOMPATIBLE_VERSION", diagnosis: null, insufficiencyReasons: [] };
      const recovered = await GET(new Request(`http://local.test/api/operations/${key}`), { params: Promise.resolve({ ...context, idempotencyKey: key }) });
      assert.equal(recovered.status, 200);
      assert.deepEqual(await recovered.json(), expected);
      const replay = await POST(request(body, key), route());
      assert.equal(replay.status, 422);
      assert.deepEqual(await replay.json(), { error: { code: "INCOMPATIBLE_VERSION", message: "Incompatible IHFR version" } });
      const divergent = await POST(request(replace, key), route());
      assert.equal(divergent.status, 409);
      assert.equal((await divergent.json()).error.code, "IDEMPOTENCY_CONFLICT");
      assert.deepEqual(await counts(), { ...baseline, operations: baseline.operations + index + 1 });
    }
    const malformedKey = randomUUID();
    const malformed = await POST(request({ ...replace, versions: { ...versions, contractHash: "sha256:bad" } }, malformedKey), route());
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "INVALID_INPUT");
    assert.deepEqual(await counts(), { ...baseline, operations: baseline.operations + mismatches.length });
  });
});

test("contextual write authorization precedes valid and malformed request input", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const memberContext = context;
    const inactiveContext = { laboratoryId: IHFR_LABORATORIES.inactive, areaId: IHFR_CONTEXTS.inactiveArea, collectionId: IHFR_CONTEXTS.inactiveCollection };
    const before = (await client.query(`SELECT count(*)::int AS count FROM "IHFRDiagnosisOperation"`)).rows[0].count;
    for (const [actor, selectedContext, expectedStatus, expectedCode] of [
      [IHFR_ACTORS.member, memberContext, 403, "FORBIDDEN"],
      [IHFR_ACTORS.owner, inactiveContext, 409, "READ_ONLY"],
    ] as const) {
      const POST = createIHFRWriteHandler({ requireAuth: async () => ({ id: actor }), service });
      const valid = { mode: "CREATE", supplement, versions };
      for (const body of [valid, { ...valid, unexpected: true }]) {
        const response = await POST(request(body, randomUUID(), selectedContext), route(selectedContext));
        assert.equal(response.status, expectedStatus);
        assert.equal((await response.json()).error.code, expectedCode);
      }
    }
    const rows = await client.query(`SELECT count(*)::int AS count FROM "IHFRDiagnosisOperation"`);
    assert.equal(rows.rows[0].count, before);
  });
});

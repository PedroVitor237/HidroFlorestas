import assert from "node:assert/strict";
import { test } from "node:test";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { createIHFREligibilityHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const params = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
const request = (query = "") => new Request(`http://local.test${query}`);
const route = (value = params) => ({ params: Promise.resolve(value) });
const service = (result: unknown = { outcome: "ELIGIBLE", canProduce: true, reasons: [] }) => ({ eligibility: async () => result });

test("missing or invalid session is sanitized as 401", async () => {
  for (const code of ["UNAUTHORIZED", "INTERNAL_ERROR"] as const) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => { throw new AuthBoundaryError(code); }, service: service() });
    const response = await GET(request(), route());
    assert.equal(response.status, code === "UNAUTHORIZED" ? 401 : 500);
    assert.equal(JSON.stringify(await response.json()).match(/token|cookie|stack|SQL/i), null);
  }
});

test("missing, inaccessible, revoked and crossed resources share 404", async () => {
  for (const scenario of ["outsider", "revoked", "laboratory", "area", "collection", "crossed"] as const) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: scenario }), service: { eligibility: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    const response = await GET(request(), route());
    assert.equal(response.status, 404, scenario);
    assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Resource not found" } });
  }
});

test("OWNER, contextual ADMIN and MEMBER can read deterministic allowlisted eligibility", async () => {
  for (const role of ["OWNER", "ADMIN", "MEMBER"] as const) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: role }), service: service() });
    const response = await GET(request("?landUseType=FOREST"), route());
    assert.equal(response.status, 200, role);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.deepEqual(body, { outcome: "ELIGIBLE", canProduce: true, reasons: [] });
    for (const forbidden of ["actorUserId", "requestHash", "payloadHash", "evidence", "idempotencyKey"]) assert.equal(JSON.stringify(body).includes(forbidden), false);
  }
});

test("inactive laboratory remains readable but explicitly blocks production", async () => {
  const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "INELIGIBLE", canProduce: false, reasons: ["INACTIVE_LABORATORY"] }) });
  const response = await GET(request("?landUseType=FOREST"), route());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { outcome: "INELIGIBLE", canProduce: false, reasons: ["INACTIVE_LABORATORY"] });
});

test("closed land-use query accepts exactly seven values", async () => {
  for (const value of ["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"]) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "MEMBER" }), service: service() });
    assert.equal((await GET(request(`?landUseType=${value}`), route())).status, 200, value);
  }
});

test("unknown enum, alias, casing, duplicate and extra query data are 400 INVALID_REQUEST", async () => {
  for (const query of ["?landUseType=OTHER", "?landUseType=OTHERS", "?landUseType=forest", "?landUseType=floresta", "?landUseType=FOREST&landUseType=URBAN", "?landUseType=FOREST&unexpected=true"]) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    const response = await GET(request(query), route());
    assert.equal(response.status, 400, query);
    assert.deepEqual(await response.json(), { error: { code: "INVALID_REQUEST", message: "Invalid request" } });
  }
});

test("malformed UUID is INVALID_REQUEST without invoking the service", async () => {
  let calls = 0;
  const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: { eligibility: async () => { calls += 1; return null; } } });
  const response = await GET(request(), route({ ...params, areaId: "bad" }));
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test("valid absence stays INSUFFICIENT_DATA instead of INVALID_REQUEST", async () => {
  for (const reason of ["MISSING_LAND_USE_TYPE", "UNDETERMINED_PREDOMINANCE", "MISSING_SLOPE_PERCENT", "INSUFFICIENT_DIMENSION", "MISSING_ENVIRONMENTAL_DATA"]) {
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "INSUFFICIENT_DATA", canProduce: false, reasons: [reason] }) });
    const response = await GET(request(), route());
    assert.equal(response.status, 200, reason);
    assert.deepEqual(await response.json(), { outcome: "INSUFFICIENT_DATA", canProduce: false, reasons: [reason] });
  }
});

test("incompatible measurement version is a controlled eligibility outcome", async () => {
  const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ outcome: "INCOMPATIBLE_VERSION", canProduce: false, reasons: ["MEASUREMENT_CONTRACT"] }) });
  const response = await GET(request("?landUseType=FOREST"), route());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { outcome: "INCOMPATIBLE_VERSION", canProduce: false, reasons: ["MEASUREMENT_CONTRACT"] });
});

test("eligibility is side-effect free inside the isolated PostgreSQL schema", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const counts = async () => (await client.query(`SELECT
      (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") AS supplements,
      (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") AS diagnoses,
      (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") AS current,
      (SELECT count(*)::int FROM "IHFRDiagnosisOperation") AS operations,
      (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") AS events,
      (SELECT count(*)::int FROM "EnvironmentalMeasurementSet") AS measurements,
      (SELECT count(*)::int FROM "CollectionData") AS collections,
      (SELECT count(*)::int FROM "CollectionArea") AS areas,
      (SELECT count(*)::int FROM "LaboratoryRoom") AS laboratories,
      (SELECT count(*)::int FROM "ResearchersLinked") AS memberships`)).rows[0];
    const before = await counts();
    const GET = createIHFREligibilityHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    await GET(request("?landUseType=FOREST"), route());
    assert.deepEqual(await counts(), before);
  });
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createIHFRCurrentHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";

const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };

test("current endpoint authenticates, derives context and returns absence with no-store", async () => {
  const calls: unknown[] = [];
  const GET = createIHFRCurrentHandler({ requireAuth: async () => ({ id: "actor-1" }), service: {
    readCurrent: async (actorId, routeContext) => { calls.push({ actorId, routeContext }); return null; },
    readDetail: async () => { throw new Error("unexpected"); },
  } });
  const response = await GET(new Request("http://local.test"), { params: Promise.resolve(context) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { diagnosis: null });
  assert.deepEqual(calls, [{ actorId: "actor-1", routeContext: context }]);
});

test("current endpoint rejects malformed route context before lookup", async () => {
  let called = false;
  const GET = createIHFRCurrentHandler({ requireAuth: async () => ({ id: "actor-1" }), service: {
    readCurrent: async () => { called = true; return null; }, readDetail: async () => { throw new Error("unexpected"); },
  } });
  const response = await GET(new Request("http://local.test"), { params: Promise.resolve({ ...context, areaId: "crossed" }) });
  assert.equal(response.status, 404);
  assert.equal(called, false);
});

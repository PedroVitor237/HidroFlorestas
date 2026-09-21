import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/eligibility/route";

test("eligibility replaces the structural 501 with a no-store allowlisted outcome", async () => {
  const response = await (GET as unknown as (request: Request, route: unknown) => Promise<Response>)(new Request("http://local.test"), { params: Promise.resolve({ laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" }) });
  assert.notEqual(response.status, 501);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.ok(["ELIGIBLE", "INSUFFICIENT_DATA", "INCOMPATIBLE_VERSION"].includes(body.outcome));
  for (const forbidden of ["actorUserId", "requestHash", "payloadHash", "evidence"]) assert.equal(JSON.stringify(body).includes(forbidden), false);
});

test("malformed eligibility input maps to sanitized 400 INVALID_REQUEST", async () => {
  const response = await (GET as unknown as (request: Request, route: unknown) => Promise<Response>)(new Request("http://local.test?landUseType=OTHER&unexpected=true"), { params: Promise.resolve({ laboratoryId: "bad", areaId: "bad", collectionId: "bad" }) });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: { code: "INVALID_REQUEST", message: "Invalid request" } });
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/operations/[idempotencyKey]/route";

test("operation recovery is authenticated, contextual and hides request hashes", async () => {
  const response = await (GET as unknown as (request: Request, route: unknown) => Promise<Response>)(new Request("http://local.test"), { params: Promise.resolve({ laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", idempotencyKey: "60000000-0000-4000-8000-000000000083" }) });
  assert.notEqual(response.status, 501);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const serialized = JSON.stringify(await response.json());
  for (const field of ["requestHash", "actorUserId", "payloadHash"]) assert.equal(serialized.includes(field), false);
});

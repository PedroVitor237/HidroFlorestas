import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/current/route";

test("current endpoint no longer exposes the structural 501 response", async () => {
  const response = await GET();
  assert.notEqual(response.status, 501);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

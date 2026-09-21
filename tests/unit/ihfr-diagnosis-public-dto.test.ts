import assert from "node:assert/strict";
import { test } from "node:test";
import { parseIHFRRouteContext } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";

test("accepts only a complete contextual route and keeps areaId server-side", () => {
  const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
  assert.deepEqual(parseIHFRRouteContext(context), context);
  assert.throws(() => parseIHFRRouteContext({ ...context, areaId: undefined }));
});

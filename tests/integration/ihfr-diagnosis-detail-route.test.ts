import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/route";

test("detail endpoint no longer exposes the structural 501 response", async () => {
  const response = await GET();
  assert.notEqual(response.status, 501);
  const serialized = JSON.stringify(await response.json());
  for (const forbidden of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "evidence"]) assert.equal(serialized.includes(forbidden), false);
});

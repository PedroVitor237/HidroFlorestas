import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/revocations/route";

test("revocation replaces 501 with a controlled append-only lifecycle response", async () => {
  const response = await (POST as unknown as (request: Request, route: unknown) => Promise<Response>)(new Request("http://local.test", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ expectedCurrentDiagnosisId: "60000000-0000-4000-8000-000000000062", reason: "Correção autorizada" }) }), { params: Promise.resolve({ laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", diagnosisId: "60000000-0000-4000-8000-000000000062" }) });
  assert.notEqual(response.status, 501);
  assert.ok([200, 409].includes(response.status));
  assert.equal(response.headers.get("cache-control"), "no-store");
});

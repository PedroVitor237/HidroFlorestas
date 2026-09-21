import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/route";

const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
const supplement = { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } };

async function post(body: unknown) { return (POST as unknown as (request: Request, route: unknown) => Promise<Response>)(new Request("http://local.test", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify(body) }), { params: Promise.resolve(context) }); }

test("CREATE and REPLACE return controlled lifecycle outcomes instead of 501", async () => {
  const create = await post({ mode: "CREATE", expectedCurrentDiagnosisId: null, supplement });
  assert.notEqual(create.status, 501);
  assert.ok([200, 201, 409, 422].includes(create.status));
  const replace = await post({ mode: "REPLACE", expectedCurrentDiagnosisId: "60000000-0000-4000-8000-000000000062", supplement });
  assert.notEqual(replace.status, 501);
  assert.ok([200, 201, 409, 422].includes(replace.status));
});

test("invalid conditional requests are 400 and never expose persistence errors", async () => {
  const response = await post({ mode: "REPLACE", supplement, unexpected: true });
  assert.equal(response.status, 400);
  assert.equal(JSON.stringify(await response.json()).match(/Prisma|SQL|unique constraint/), null);
});

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createIHFRWriteHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";

const context = { laboratoryId: randomUUID(), areaId: randomUUID(), collectionId: randomUUID() };
const body = {
  mode: "CREATE",
  supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } },
  versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.historicalMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash },
};

test("a terminal incompatibility keeps POST 422 for both first delivery and identical replay", async () => {
  const key = randomUUID();
  const service = {
    authorizeWrite: async () => {},
    createOrReplace: async () => ({ response: { outcome: "INCOMPATIBLE_VERSION" as const, diagnosis: null, insufficiencyReasons: [] }, replayed: false }),
  };
  const handler = createIHFRWriteHandler({ requireAuth: async () => ({ id: randomUUID() }), service });
  const makeRequest = () => new Request("http://local.test/diagnoses", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(body) });
  const route = () => ({ params: Promise.resolve(context) });
  const first = await handler(makeRequest(), route());
  assert.equal(first.status, 422);
  assert.deepEqual(await first.json(), { error: { code: "INCOMPATIBLE_VERSION", message: "Incompatible IHFR version" } });
  service.createOrReplace = async () => ({ response: { outcome: "INCOMPATIBLE_VERSION" as const, diagnosis: null, insufficiencyReasons: [] }, replayed: true });
  const replay = await handler(makeRequest(), route());
  assert.equal(replay.status, 422);
  assert.deepEqual(await replay.json(), { error: { code: "INCOMPATIBLE_VERSION", message: "Incompatible IHFR version" } });
  assert.equal(replay.headers.get("cache-control"), "no-store");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createIHFRDetailHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";
import { IHFRDiagnosisServiceError } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import type { PublicDiagnosis } from "../../src/types/ihfr-diagnosis.type";

const params = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", diagnosisId: "60000000-0000-4000-8000-000000000062" };
const diagnosis: PublicDiagnosis = {
  id: params.diagnosisId, laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId,
  rawScore: 0.5, displayScore: "0.50", ihfrClass: "MODERATE", dataQuality: "MODERATE",
  componentScores: { W: 0.5, S: 0.5, V: 0.5, T: 0.5 }, lifecycleState: "CURRENT",
  measurementContractVersion: "ihfr-measurement-v1", inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0",
  mathContractVersion: "ihfr-math-experimental-v0.1.1", algorithmVersion: "ihfr-evaluator-ts-v0.1.0",
  contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89", calculatedAt: "2026-09-20T12:03:00.000Z",
  labels: ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"],
};

test("detail endpoint forwards server-derived context and exposes only the public allowlist", async () => {
  const GET = createIHFRDetailHandler({ requireAuth: async () => ({ id: "actor-1" }), service: {
    readCurrent: async () => null,
    readDetail: async (actorId, context, diagnosisId) => { assert.equal(actorId, "actor-1"); assert.deepEqual(context, { laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId }); assert.equal(diagnosisId, params.diagnosisId); return diagnosis; },
  } });
  const response = await GET(new Request("http://local.test"), { params: Promise.resolve(params) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.deepEqual(body, { diagnosis });
  const serialized = JSON.stringify(body);
  for (const forbidden of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "environmentalPayload", "evidence", "lifecycleEvents"]) assert.equal(serialized.includes(forbidden), false);
});

test("missing, crossed and revoked-membership lookups share the same 404 envelope", async () => {
  for (const scenario of ["missing", "crossed", "revoked-membership"]) {
    const GET = createIHFRDetailHandler({ requireAuth: async () => ({ id: "actor-1" }), service: { readCurrent: async () => null, readDetail: async () => { throw new IHFRDiagnosisServiceError("NOT_FOUND"); } } });
    const response = await GET(new Request(`http://local.test/${scenario}`), { params: Promise.resolve(params) });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Resource not found" } });
  }
});

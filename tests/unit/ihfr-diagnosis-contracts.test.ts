import assert from "node:assert/strict";
import { test } from "node:test";
import { hashIHFRDiagnosisRequest, parseIHFRDiagnosisRequest } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";

const supplement = { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } };
const current = "60000000-0000-4000-8000-000000000062";
const versions = { measurementContractVersion: "ihfr-measurement-v1", mathContractVersion: "ihfr-math-experimental-v0.1.1", algorithmVersion: "ihfr-evaluator-ts-v0.1.0", contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89" };
const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };

test("closed parser accepts CREATE and rejects unknown fields", () => {
  assert.deepEqual(parseIHFRDiagnosisRequest({ mode: "CREATE", expectedCurrentDiagnosisId: null, supplement, versions }), { mode: "CREATE", expectedCurrentDiagnosisId: null, supplement, versions });
  assert.equal(parseIHFRDiagnosisRequest({ mode: "CREATE", supplement, versions }).expectedCurrentDiagnosisId, null);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement, versions, unexpected: true }), /INVALID_REQUEST/);
});

test("REPLACE requires an expected current diagnosis while CREATE cannot target one", () => {
  assert.equal(parseIHFRDiagnosisRequest({ mode: "REPLACE", expectedCurrentDiagnosisId: current, supplement, versions }).expectedCurrentDiagnosisId, current);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "REPLACE", supplement, versions }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", expectedCurrentDiagnosisId: current, supplement, versions }), /INVALID_REQUEST/);
});

test("rejects unknown mode, enum aliases and server-derived input", () => {
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "UPSERT", supplement, versions }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement: { ...supplement, landUseType: "forest" }, versions }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement: { ...supplement, areaId: current }, versions }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement, versions: { ...versions, mathContractVersion: "ihfr-math-experimental-v0.1.0" } }), /INVALID_REQUEST/);
});

test("canonical request hash ignores property order but includes context and relevant input", () => {
  const parsed = parseIHFRDiagnosisRequest({ versions: { contractHash: versions.contractHash, algorithmVersion: versions.algorithmVersion, mathContractVersion: versions.mathContractVersion, measurementContractVersion: versions.measurementContractVersion }, supplement: { provenance: supplement.provenance, landUseType: supplement.landUseType, inputContractVersion: supplement.inputContractVersion }, mode: "CREATE" });
  assert.equal(hashIHFRDiagnosisRequest(context, parsed), hashIHFRDiagnosisRequest({ ...context }, parseIHFRDiagnosisRequest({ mode: "CREATE", supplement, versions })));
  assert.notEqual(hashIHFRDiagnosisRequest(context, parsed), hashIHFRDiagnosisRequest({ ...context, collectionId: current }, parsed));
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { parseIHFRDiagnosisRequest } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";

const supplement = { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } };
const current = "60000000-0000-4000-8000-000000000062";

test("closed parser accepts CREATE and rejects unknown fields", () => {
  assert.deepEqual(parseIHFRDiagnosisRequest({ mode: "CREATE", expectedCurrentDiagnosisId: null, supplement }), { mode: "CREATE", expectedCurrentDiagnosisId: null, supplement });
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement, unexpected: true }), /INVALID_REQUEST/);
});

test("REPLACE requires an expected current diagnosis while CREATE cannot target one", () => {
  assert.equal(parseIHFRDiagnosisRequest({ mode: "REPLACE", expectedCurrentDiagnosisId: current, supplement }).expectedCurrentDiagnosisId, current);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "REPLACE", supplement }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", expectedCurrentDiagnosisId: current, supplement }), /INVALID_REQUEST/);
});

test("rejects unknown mode, enum aliases and server-derived input", () => {
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "UPSERT", supplement }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement: { ...supplement, landUseType: "forest" } }), /INVALID_REQUEST/);
  assert.throws(() => parseIHFRDiagnosisRequest({ mode: "CREATE", supplement: { ...supplement, areaId: current } }), /INVALID_REQUEST/);
});

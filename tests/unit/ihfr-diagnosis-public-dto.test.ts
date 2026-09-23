import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { parseIHFRRouteContext, projectPublicDiagnosis, type DiagnosisProjectionSource } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";
import { publicDiagnosisFixture } from "../fixtures/ihfr-diagnosis-public";

test("accepts only a complete contextual route and keeps areaId server-side", () => {
  const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
  assert.deepEqual(parseIHFRRouteContext(context), context);
  assert.throws(() => parseIHFRRouteContext({ ...context, areaId: undefined }));
});

test("public projection follows the declared field allowlist and maps internal quality", () => {
  const expected = publicDiagnosisFixture;
  const source: DiagnosisProjectionSource = {
    id: expected.id, collectionDataId: expected.collectionId, environmentalMeasurementSetId: expected.environmentalMeasurementSetId,
    inputSupplementId: expected.inputSupplementId, rawScore: expected.rawScore, displayScore: expected.displayScore.toFixed(2),
    ihfrClass: expected.ihfrClass, dataQuality: "MODERATE", componentScores: expected.componentScores,
    decomposition: { variables: Object.fromEntries(expected.decomposition.map((variable) => [variable.input, { included: variable.available, raw: variable.raw, normalizedInput: variable.normalizedInput, transformation: variable.transformation, score: variable.score, clamped: variable.clamped }])) },
    drivers: expected.drivers, explanation: expected.explanation,
    measurementContractVersion: expected.versions.measurementContractVersion, inputContractVersion: expected.versions.inputContractVersion,
    mathContractVersion: expected.versions.mathContractVersion, algorithmVersion: expected.versions.algorithmVersion, contractHash: expected.versions.contractHash,
    calculatedAt: expected.calculatedAt, validFrom: expected.validFrom, transitionedAt: null, scientificState: "EXPERIMENTAL",
    current: true, terminalEvent: null,
  };
  const restrictedSource = { ...source, actorUserId: "private", requestHash: "private", payloadHash: "private" };
  const publicValue = projectPublicDiagnosis(restrictedSource, { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: expected.areaId, collectionId: expected.collectionId }, expected.scientificLabels);
  const openapi = parse(readFileSync("specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-api.openapi.yaml", "utf8"));
  assert.deepEqual(Object.keys(publicValue).sort(), Object.keys(openapi.components.schemas.PublicDiagnosis.properties).sort());
  assert.equal(publicValue.dataQuality, "MEDIUM");
  assert.equal(publicValue.displayScore, expected.displayScore);
  assert.equal(publicValue.decomposition.length, 16);
  assert.deepEqual(publicValue.scientificLabels, expected.scientificLabels);
  assert.equal(JSON.stringify(publicValue).includes("private"), false);
  assert.throws(() => projectPublicDiagnosis({ ...source, decomposition: {} }, { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: expected.areaId, collectionId: expected.collectionId }, expected.scientificLabels), /INVALID_STORED_DIAGNOSIS/);
});

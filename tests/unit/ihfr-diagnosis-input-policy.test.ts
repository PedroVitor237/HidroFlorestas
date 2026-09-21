import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateIHFR } from "../../src/app/api/server/ihfr-diagnosis/evaluator";
import { loadActiveIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";

test("known optional absence contributes to sufficiency instead of becoming invalid input", () => {
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: 10 }, water: { salinityIndicator: null }, soil: { soilExposedPercent: null }, vegetation: { hasRiparianApp: null } }, landUseType: "FOREST" });
  assert.equal(result.outcome, "INSUFFICIENT_DATA");
});

test("unknown fields and enum tokens fail closed", () => {
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: 10, unexpected: true } }, landUseType: "FOREST" }), /INVALID_INPUT/);
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: 10 } }, landUseType: "OTHER" as never }), /INVALID_INPUT/);
});

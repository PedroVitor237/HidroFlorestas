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

test("aliases, casing, whitespace, OTHER/OTHERS, arrays and mixed use are invalid", () => {
  for (const landUseType of ["forest", " FOREST", "FOREST ", "OTHER", "OTHERS", "NATIVE_VEGETATION", ["FOREST", "PASTURE"]]) assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: {}, landUseType: landUseType as never }), /INVALID_INPUT/, JSON.stringify(landUseType));
});

test("known optional absent/null is excluded, mandatory absence is insufficient and invalid values fail", () => {
  const sufficient = { terrain: { slopePercent: 10 }, water: { waterSourceType: "SPRING", hasSpring: true }, soil: { compactionLevel: "LOW", erosionSigns: "NONE" }, vegetation: { fragmentationLevel: "LOW", hasRiparianApp: null, landscapeDegradation: "LOW" } };
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental: sufficient, landUseType: "FOREST" });
  assert.equal(result.outcome, "SUFFICIENT");
  if (result.outcome === "SUFFICIENT") { assert.equal(result.decomposition.variables["vegetation.hasRiparianApp"].included, false); assert.equal(result.decomposition.variables["water.wellDepthMeters"].score, null); assert.equal(result.dataQuality, "LOW"); }
  assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: 10 }, water: {}, soil: {}, vegetation: {} }, landUseType: null }).outcome, "INSUFFICIENT_DATA");
  for (const value of [NaN, Infinity, -Infinity, -1]) assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: value } }, landUseType: "FOREST" }), /INVALID_INPUT/);
});

test("clamp applies only to declared non-negative measures and percentages remain bounded", () => {
  const input = { terrain: { slopePercent: 46 }, water: { waterSourceType: "SPRING", hasSpring: true, wellDepthMeters: 61 }, soil: { infiltrationRateMmPerHour: 61, compactionLevel: "LOW", erosionSigns: "NONE", soilTexture: "MEDIUM", soilExposedPercent: 100 }, vegetation: { vegetationCoverPercent: 0, fragmentationLevel: "LOW", landscapeDegradation: "LOW" } };
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental: input, landUseType: "FOREST" }); assert.equal(result.outcome, "SUFFICIENT");
  if (result.outcome === "SUFFICIENT") for (const path of ["terrain.slopePercent", "water.wellDepthMeters", "soil.infiltrationRateMmPerHour"]) assert.equal(result.decomposition.variables[path].clamped, true, path);
  for (const [section, field] of [["soil", "soilExposedPercent"], ["vegetation", "vegetationCoverPercent"]] as const) for (const value of [-.01, 100.01]) assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { [section]: { [field]: value } }, landUseType: "FOREST" }), /INVALID_INPUT/);
});

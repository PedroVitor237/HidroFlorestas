import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateIHFR } from "../../src/app/api/server/ihfr-diagnosis/evaluator";
import { loadActiveIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";
import { IHFR_MEASUREMENT_PAYLOAD } from "../fixtures/ihfr-diagnosis-contexts";

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
  assert.equal(result.outcome, "INSUFFICIENT_DATA", "FR-012: two remaining scores do not replace a required input");
  assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: 10 }, water: {}, soil: {}, vegetation: {} }, landUseType: null }).outcome, "INSUFFICIENT_DATA");
  for (const value of [NaN, Infinity, -Infinity, -1]) assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { terrain: { slopePercent: value } }, landUseType: "FOREST" }), /INVALID_INPUT/);
});

test("each required environmental input missing alone makes the evaluator insufficient", () => {
  const required = [
    "water.waterSourceType", "water.hasSpring", "water.waterAvailability",
    "soil.soilTexture", "soil.infiltrationRateMmPerHour", "soil.compactionLevel", "soil.erosionSigns",
    "vegetation.vegetationCoverPercent", "vegetation.fragmentationLevel", "vegetation.landscapeDegradation",
    "terrain.slopePercent",
  ];
  for (const path of required) {
    const [section, field] = path.split(".");
    for (const absent of ["deleted", "undefined"] as const) {
      const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
      if (absent === "deleted") delete environmental[section][field];
      else environmental[section][field] = undefined;
      assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" }).outcome, "INSUFFICIENT_DATA", `${path} ${absent}`);
    }
  }
});

test("required null is invalid except diagnosis-only slope and land use absence", () => {
  const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
  environmental.water.hasSpring = null;
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" }), /INVALID_INPUT/);
  environmental.water.hasSpring = false;
  environmental.terrain.slopePercent = null;
  assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" }).outcome, "INSUFFICIENT_DATA");
  environmental.terrain.slopePercent = 0;
  assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: null }).outcome, "INSUFFICIENT_DATA");
  assert.equal(evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" }).outcome, "SUFFICIENT");
});

test("boolean inputs accept only real booleans and preserve optional absence", () => {
  const manifest = loadActiveIHFRManifest();
  for (const [section, field] of [["water", "hasSpring"], ["vegetation", "hasRiparianApp"]] as const) {
    for (const value of [true, false]) {
      const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
      environmental[section][field] = value;
      assert.equal(evaluateIHFR(manifest, { environmental, landUseType: "FOREST" }).outcome, "SUFFICIENT", `${section}.${field}=${value}`);
    }
    for (const value of ["true", "false", 1, 0, [], {}]) {
      const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
      environmental[section][field] = value;
      assert.throws(() => evaluateIHFR(manifest, { environmental, landUseType: "FOREST" }), /INVALID_INPUT/, `${section}.${field}=${JSON.stringify(value)}`);
    }
  }
  for (const absent of [undefined, null]) {
    const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
    environmental.vegetation.hasRiparianApp = absent;
    assert.equal(evaluateIHFR(manifest, { environmental, landUseType: "FOREST" }).outcome, "SUFFICIENT", `vegetation.hasRiparianApp=${absent}`);
  }
});

test("each scored optional absence is excluded while zero and false remain values", () => {
  const optional = ["water.wellDepthMeters", "water.salinityIndicator", "soil.soilExposedPercent", "vegetation.hasRiparianApp"];
  for (const path of optional) {
    const [section, field] = path.split(".");
    for (const absent of [undefined, null]) {
      const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
      environmental[section][field] = absent;
      const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" });
      assert.equal(result.outcome, "SUFFICIENT", path);
      if (result.outcome === "SUFFICIENT") assert.equal(result.decomposition.variables[path].included, false);
    }
  }
  const environmental = structuredClone(IHFR_MEASUREMENT_PAYLOAD);
  environmental.water.hasSpring = false;
  environmental.soil.infiltrationRateMmPerHour = 0;
  environmental.terrain.slopePercent = 0;
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" });
  assert.equal(result.outcome, "SUFFICIENT");
  if (result.outcome === "SUFFICIENT") for (const path of ["water.hasSpring", "soil.infiltrationRateMmPerHour", "terrain.slopePercent"]) assert.equal(result.decomposition.variables[path].included, true);
});

test("clamp applies only to declared non-negative measures and percentages remain bounded", () => {
  const input = structuredClone(IHFR_MEASUREMENT_PAYLOAD);
  input.terrain.slopePercent = 46;
  input.water.wellDepthMeters = 61;
  input.soil.infiltrationRateMmPerHour = 61;
  input.soil.soilExposedPercent = 100;
  input.vegetation.vegetationCoverPercent = 0;
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental: input, landUseType: "FOREST" }); assert.equal(result.outcome, "SUFFICIENT");
  if (result.outcome === "SUFFICIENT") for (const path of ["terrain.slopePercent", "water.wellDepthMeters", "soil.infiltrationRateMmPerHour"]) assert.equal(result.decomposition.variables[path].clamped, true, path);
  for (const [section, field] of [["soil", "soilExposedPercent"], ["vegetation", "vegetationCoverPercent"]] as const) for (const value of [-.01, 100.01]) assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { [section]: { [field]: value } }, landUseType: "FOREST" }), /INVALID_INPUT/);
});

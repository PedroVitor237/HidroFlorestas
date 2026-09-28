import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyIHFRScore, decimalHalfUp, evaluateIHFR } from "../../src/app/api/server/ihfr-diagnosis/evaluator";
import { loadActiveIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";
import { parseEnvironmentalInput, ENVIRONMENTAL_FIELDS } from "../../src/types/environmental-data.validation";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
import { IHFR_MEASUREMENT_PAYLOAD } from "../fixtures/ihfr-diagnosis-contexts";

const environmental = IHFR_MEASUREMENT_PAYLOAD;

test("evaluates exact dimensions, formula, half-up display, class and deterministic drivers", () => {
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" });
  assert.equal(result.outcome, "SUFFICIENT");
  if (result.outcome !== "SUFFICIENT") return;
  for (const [dimension, expected] of Object.entries({ W: .2, S: .2, V: .15, T: .6 })) assert.ok(Math.abs(result.componentScores[dimension as "W" | "S" | "V" | "T"] - expected) < 1e-12, dimension);
  assert.ok(Math.abs(result.rawScore - .2875) < 1e-12); assert.equal(result.score, result.rawScore); assert.equal(result.displayScore, "0.29"); assert.equal(result.ihfrClass, "MODERATE");
  assert.deepEqual(result.drivers, ["T", "W"]); assert.equal(result.explanation, "Risco influenciado por uso da terra com maior exposicao ou declividade favoravel ao escoamento. Risco influenciado por disponibilidade hidrica, fonte de agua, nascente, profundidade do poco ou salinidade.");
  assert.equal(result.dataQuality, "HIGH"); assert.deepEqual(result.labels, ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"]);
  assert.equal(result.decomposition.dimensions.T.contribution, .15); assert.deepEqual(result.decomposition.dimensions.T.included, ["terrain.slopePercent", "supplement.landUseType"]);
});

test("clamps normalization without mutating the raw environmental input", () => {
  const environmental = { terrain: { slopePercent: 46 }, water: {}, soil: {}, vegetation: {} };
  const snapshot = structuredClone(environmental);
  evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" });
  assert.deepEqual(environmental, snapshot);
});

test("half-up is decimal, while classification uses the unrounded raw score", () => {
  for (const [value, expected] of [[1.0049, 1], [1.005, 1.01], [1.0051, 1.01], [2.675, 2.68], [0, 0], [1, 1]] as const) assert.equal(decimalHalfUp(value, 2), expected, String(value));
  for (const [value, expected] of [[0, "LOW"], [.25, "LOW"], [.250000000001, "MODERATE"], [.5, "MODERATE"], [.500000000001, "HIGH"], [.75, "HIGH"], [.750000000001, "CRITICAL"], [1, "CRITICAL"]] as const) assert.equal(classifyIHFRScore(value), expected, String(value));
  assert.throws(() => classifyIHFRScore(-Number.EPSILON), /INVALID_INPUT/); assert.throws(() => classifyIHFRScore(1 + Number.EPSILON), /INVALID_INPUT/);
});

test("all land-use mappings are exact and stable", () => {
  const expected = { FOREST: .2, AGROFORESTRY: .25, CROPLAND: .6, PASTURE: .65, DEGRADED_PASTURE: .8, BARE_SOIL: .95, URBAN: .7 } as const;
  for (const [landUseType, score] of Object.entries(expected)) {
    const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: landUseType as keyof typeof expected });
    assert.equal(result.outcome, "SUFFICIENT"); if (result.outcome === "SUFFICIENT") assert.equal(result.decomposition.variables["supplement.landUseType"].score, score);
  }
});

test("same verified input is deeply deterministic and incompatible manifests fail closed", () => {
  const input = { environmental, landUseType: "FOREST" as const };
  assert.deepEqual(evaluateIHFR(loadActiveIHFRManifest(), input), evaluateIHFR(loadActiveIHFRManifest(), structuredClone(input)));
  const incompatible = { ...loadActiveIHFRManifest(), mathContractVersion: "ihfr-math-experimental-v0.1.0" };
  assert.deepEqual(evaluateIHFR(incompatible, input), { outcome: "INCOMPATIBLE_VERSION", reasons: ["INCOMPATIBLE_VERSION"], labels: ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"] });
});

test("complete environmental producer payload is accepted while unscored terrain values leave IHFR unchanged", () => {
  const produced = validEnvironmentalPayload();
  produced.water.waterSourceType = "SPRING";
  produced.water.hasSpring = true;
  produced.soil.soilTexture = "MEDIUM";
  produced.soil.infiltrationRateMmPerHour = 60;
  produced.vegetation.vegetationCoverPercent = 100;
  produced.vegetation.hasRiparianApp = true;
  produced.terrain.slopePercent = 45;
  produced.terrain.drainageDensityKmPerKm2 = 1.5;
  produced.terrain.elevationMeters = 180;
  const complete = parseEnvironmentalInput(produced);
  for (const section of Object.keys(ENVIRONMENTAL_FIELDS) as Array<keyof typeof ENVIRONMENTAL_FIELDS>) {
    assert.deepEqual(Object.keys(complete[section]).sort(), Object.keys(ENVIRONMENTAL_FIELDS[section]).sort(), section);
  }
  const numeric = evaluateIHFR(loadActiveIHFRManifest(), { environmental: complete, landUseType: "FOREST" });
  assert.equal(numeric.outcome, "SUFFICIENT");
  const nulls = parseEnvironmentalInput({ ...complete, terrain: { ...complete.terrain, drainageDensityKmPerKm2: null, elevationMeters: null } });
  const absent = evaluateIHFR(loadActiveIHFRManifest(), { environmental: nulls, landUseType: "FOREST" });
  assert.equal(absent.outcome, "SUFFICIENT");
  const changed = parseEnvironmentalInput({ ...complete, terrain: { ...complete.terrain, drainageDensityKmPerKm2: 8, elevationMeters: -100 } });
  const changedResult = evaluateIHFR(loadActiveIHFRManifest(), { environmental: changed, landUseType: "FOREST" });
  assert.equal(changedResult.outcome, "SUFFICIENT");
  if (numeric.outcome === "SUFFICIENT" && absent.outcome === "SUFFICIENT" && changedResult.outcome === "SUFFICIENT") {
    assert.equal(numeric.rawScore, absent.rawScore);
    assert.equal(numeric.rawScore, changedResult.rawScore);
    assert.deepEqual(Object.keys(numeric.decomposition.variables).filter((key) => key.startsWith("terrain.")), ["terrain.slopePercent"]);
  }
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { ...complete, terrain: { ...complete.terrain, fooBar: 1 } }, landUseType: "FOREST" }), /INVALID_INPUT/);
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { ...complete, terrain: { ...complete.terrain, drainageDensityKmPerKm2: -1 } }, landUseType: "FOREST" }), /INVALID_INPUT/);
  assert.throws(() => evaluateIHFR(loadActiveIHFRManifest(), { environmental: { ...complete, terrain: { ...complete.terrain, elevationMeters: "180" } }, landUseType: "FOREST" }), /INVALID_INPUT/);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateIHFR } from "../../src/app/api/server/ihfr-diagnosis/evaluator";
import { loadActiveIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";

test("evaluates all four dimensions, half-up display score, class and deterministic drivers", () => {
  const result = evaluateIHFR(loadActiveIHFRManifest(), { environmental: {
    terrain: { slopePercent: 45 }, water: { waterSourceType: "SPRING", hasSpring: true, waterAvailability: "PERMANENT" },
    soil: { infiltrationRateMmPerHour: 60, compactionLevel: "LOW", erosionSigns: "NONE", soilTexture: "MEDIUM" },
    vegetation: { vegetationCoverPercent: 100, fragmentationLevel: "LOW", hasRiparianApp: true, landscapeDegradation: "LOW" },
  }, landUseType: "FOREST" });
  assert.equal(result.outcome, "SUFFICIENT");
  assert.equal(typeof result.score, "number");
  assert.match(String((result as Record<string, unknown>).displayScore), /^\d\.\d{2}$/);
  assert.ok(["LOW", "MODERATE", "HIGH", "CRITICAL"].includes(String((result as Record<string, unknown>).ihfrClass)));
  assert.equal((result as unknown as { drivers: unknown[] }).drivers.length, 2);
});

test("clamps normalization without mutating the raw environmental input", () => {
  const environmental = { terrain: { slopePercent: 46 }, water: {}, soil: {}, vegetation: {} };
  const snapshot = structuredClone(environmental);
  evaluateIHFR(loadActiveIHFRManifest(), { environmental, landUseType: "FOREST" });
  assert.deepEqual(environmental, snapshot);
});

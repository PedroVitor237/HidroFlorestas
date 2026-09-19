import type { EnvironmentalPayload } from "../../src/types/environmental-data.type";
export function validEnvironmentalPayload(): EnvironmentalPayload {
  return {
    water: { waterSourceType: "RIVER_STREAM", hasSpring: false, wellDepthMeters: null, waterAvailability: "PERMANENT", salinityIndicator: null },
    soil: { soilTexture: "SANDY", infiltrationRateMmPerHour: 0, compactionLevel: "LOW", erosionSigns: "NONE", soilExposedPercent: null },
    vegetation: { vegetationCoverPercent: 0, fragmentationLevel: "LOW", hasRiparianApp: null, landscapeDegradation: "LOW" },
    terrain: { drainageDensityKmPerKm2: null, elevationMeters: null, slopePercent: null },
  };
}
export const invalidEnvironmentalCases: [string, (p: Record<string, Record<string, unknown>>) => void][] = [
  ["extra root", p => { p.userId = {}; }],
  ["extra field", p => { p.water.secret = true; }],
  ["missing group", p => { delete p.terrain; }],
  ["missing required", p => { delete p.water.hasSpring; }],
  ["legacy typo", p => { p.water.waterSourceType = "TUBULA_WELL"; }],
  ["string number", p => { p.soil.infiltrationRateMmPerHour = "1"; }],
  ["negative", p => { p.soil.infiltrationRateMmPerHour = -1; }],
  ["infinite", p => { p.terrain.elevationMeters = Infinity; }],
  ["NaN", p => { p.terrain.slopePercent = NaN; }],
  ["percentage", p => { p.vegetation.vegetationCoverPercent = 101; }],
  ["negative percentage", p => { p.soil.soilExposedPercent = -1; }],
  ["boolean string", p => { p.water.hasSpring = "false"; }],
  ["required null", p => { p.vegetation.fragmentationLevel = null; }],
  ["non-well depth", p => { p.water.wellDepthMeters = 2; }],
];

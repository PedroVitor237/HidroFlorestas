export const IHFR_TECHNICAL_VECTORS = {
  landUseTypes: ["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"],
  slopeBoundaries: [0, 45, 46],
  percentageBoundaries: [0, 100],
  knownOptionalAbsence: { salinityIndicator: null, hasRiparian_app: null },
  unknownInputs: [{ landUseType: "OTHER" }, { landUseType: "forest" }, { unexpected: true }],
  historicalVersion: "ihfr-math-experimental-v0.1.0",
  activeVersion: "ihfr-math-experimental-v0.1.1",
} as const;

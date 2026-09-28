export const IHFR_TECHNICAL_VECTORS = {
  landUseTypes: ["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"],
  slopeBoundaries: [0, 45, 46],
  percentageBoundaries: [0, 100],
  classBoundaries: [0, 0.25, 0.5, 0.75, 1],
  decimalHalfUp: [[1.0049, 1], [1.005, 1.01], [1.0051, 1.01], [2.675, 2.68]],
  nonFinite: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
  knownOptionalAbsence: { salinityIndicator: null, hasRiparian_app: null },
  unknownInputs: [{ landUseType: "OTHER" }, { landUseType: "forest" }, { unexpected: true }],
  historicalVersion: "ihfr-math-experimental-v0.1.0",
  activeVersion: "ihfr-math-experimental-v0.1.1",
} as const;

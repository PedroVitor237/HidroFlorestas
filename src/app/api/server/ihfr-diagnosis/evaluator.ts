import type { IHFRLandUseType } from "@/types/ihfr-diagnosis.type";
import { IHFR_CONTRACT } from "./ihfr-diagnosis.constants";
import type { VerifiedManifest } from "./manifest-loader";

export type IHFREvaluationInput = { environmental: unknown; landUseType?: IHFRLandUseType | null };
type Dimension = "W" | "S" | "V" | "T";
type VariableDecomposition = { included: boolean; raw: number | string | boolean | null; normalizedInput: number | string | boolean | null; transformation: string | null; score: number | null; clamped: boolean };
type DimensionDecomposition = { included: string[]; excluded: string[]; score: number; weight: number; contribution: number };
export type IHFREvaluationResult =
  | { outcome: "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION"; reasons: string[]; labels: readonly string[] }
  | { outcome: "SUFFICIENT"; score: number; rawScore: number; displayScore: string; ihfrClass: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"; dataQuality: "LOW" | "MODERATE" | "HIGH"; componentScores: Record<Dimension, number>; decomposition: { variables: Record<string, VariableDecomposition>; dimensions: Record<Dimension, DimensionDecomposition> }; drivers: Dimension[]; explanation: string; measurementContractVersion: string; inputContractVersion: string; mathContractVersion: string; algorithmVersion: string; contractHash: string; labels: readonly string[] };

const dimensions: Record<Dimension, readonly string[]> = {
  W: ["water.waterSourceType", "water.hasSpring", "water.wellDepthMeters", "water.waterAvailability", "water.salinityIndicator"],
  S: ["soil.infiltrationRateMmPerHour", "soil.compactionLevel", "soil.erosionSigns", "soil.soilTexture", "soil.soilExposedPercent"],
  V: ["vegetation.vegetationCoverPercent", "vegetation.fragmentationLevel", "vegetation.hasRiparianApp", "vegetation.landscapeDegradation"],
  T: ["terrain.slopePercent", "supplement.landUseType"],
};
const optional = new Set(["water.wellDepthMeters", "water.salinityIndicator", "soil.soilExposedPercent", "vegetation.hasRiparianApp"]);
const normalizationFormula: Record<string, string> = {
  "soil.infiltrationRateMmPerHour": "1 - clamp(value,0,60)/60",
  "soil.soilExposedPercent": "clamp(value,0,100)/100",
  "terrain.slopePercent": "clamp(value,0,45)/45",
  "vegetation.vegetationCoverPercent": "1 - clamp(value,0,100)/100",
  "water.wellDepthMeters": "1 - clamp(value,0,60)/60",
};
const enumScores: Record<string, Record<string, number>> = {
  "water.waterSourceType": { RIVER_STREAM: .4, SPRING: .2, SHALLOW_WELL: .7, TUBULAR_WELL: .6, CISTERN: .5, OTHER: .5 },
  "water.hasSpring": { true: .2, false: .8 }, "water.waterAvailability": { PERMANENT: .2, SEASONAL: .6, SCARCE: .9 }, "water.salinityIndicator": { NONE: .2, SUSPECTED: .7, CONFIRMED: .95 },
  "soil.compactionLevel": { LOW: .2, MEDIUM: .6, HIGH: .9 }, "soil.erosionSigns": { NONE: .2, LAMINAR: .6, RILLS_GULLIES: .9 }, "soil.soilTexture": { SANDY: .5, MEDIUM: .4, CLAYEY: .7 },
  "vegetation.fragmentationLevel": { LOW: .2, MEDIUM: .6, HIGH: .9 }, "vegetation.hasRiparianApp": { true: .2, false: .85 }, "vegetation.landscapeDegradation": { LOW: .2, MEDIUM: .6, HIGH: .9 },
  "supplement.landUseType": { FOREST: .2, AGROFORESTRY: .25, CROPLAND: .6, PASTURE: .65, DEGRADED_PASTURE: .8, BARE_SOIL: .95, URBAN: .7 },
};
const allowedSections = { water: ["waterSourceType", "hasSpring", "wellDepthMeters", "waterAvailability", "salinityIndicator"], soil: ["infiltrationRateMmPerHour", "compactionLevel", "erosionSigns", "soilTexture", "soilExposedPercent"], vegetation: ["vegetationCoverPercent", "fragmentationLevel", "hasRiparianApp", "landscapeDegradation"], terrain: ["drainageDensityKmPerKm2", "elevationMeters", "slopePercent"] } as const;
const tieOrder: Dimension[] = ["W", "S", "V", "T"];
const templates: Record<Dimension, string> = { W: "Risco influenciado por disponibilidade hidrica, fonte de agua, nascente, profundidade do poco ou salinidade.", S: "Risco influenciado por baixa infiltracao, compactacao, erosao, textura ou solo exposto.", V: "Risco influenciado por baixa cobertura vegetal, fragmentacao, ausencia de APP ou degradacao da paisagem.", T: "Risco influenciado por uso da terra com maior exposicao ou declividade favoravel ao escoamento." };

export function evaluateIHFR(manifest: VerifiedManifest, input: IHFREvaluationInput): IHFREvaluationResult {
  if (!compatible(manifest)) return { outcome: "INCOMPATIBLE_VERSION", reasons: ["INCOMPATIBLE_VERSION"], labels: IHFR_CONTRACT.labels };
  if (!isRecord(input) || !hasOnlyKeys(input, ["environmental", "landUseType"]) || !isRecord(input.environmental) || !hasOnlyKeys(input.environmental, Object.keys(allowedSections))) invalid();
  for (const [section, keys] of Object.entries(allowedSections)) {
    const value = input.environmental[section];
    if (value !== undefined && (!isRecord(value) || !hasOnlyKeys(value, keys))) invalid();
  }
  const terrain = input.environmental.terrain;
  if (isRecord(terrain)) {
    for (const field of ["drainageDensityKmPerKm2", "elevationMeters"] as const) {
      const value = terrain[field];
      if (value !== undefined && value !== null && (typeof value !== "number" || !Number.isFinite(value) || (field === "drainageDensityKmPerKm2" && value < 0))) invalid();
    }
  }
  if (Array.isArray(input.landUseType) || (input.landUseType !== undefined && input.landUseType !== null && !(String(input.landUseType) in enumScores["supplement.landUseType"]))) invalid();

  const variables: Record<string, VariableDecomposition> = {};
  for (const paths of Object.values(dimensions)) for (const path of paths) variables[path] = scoreVariable(path, path === "supplement.landUseType" ? input.landUseType : readPath(input.environmental, path));
  const insufficient: string[] = [];
  const componentScores = {} as Record<Dimension, number>;
  const details = {} as Record<Dimension, DimensionDecomposition>;
  for (const dimension of tieOrder) {
    const included = dimensions[dimension].filter((path) => variables[path].included);
    const excluded = dimensions[dimension].filter((path) => !variables[path].included);
    if (included.length < 2) { insufficient.push(`INSUFFICIENT_DIMENSION_${dimension}`); continue; }
    const score = included.reduce((sum, path) => sum + (variables[path].score as number), 0) / included.length;
    assertUnit(score);
    componentScores[dimension] = score;
    details[dimension] = { included, excluded, score, weight: .25, contribution: score * .25 };
  }
  if (insufficient.length) return { outcome: "INSUFFICIENT_DATA", reasons: insufficient, labels: IHFR_CONTRACT.labels };
  const rawScore = tieOrder.reduce((sum, dimension) => sum + componentScores[dimension] * .25, 0);
  assertUnit(rawScore);
  const drivers = [...tieOrder].sort((left, right) => componentScores[right] - componentScores[left] || tieOrder.indexOf(left) - tieOrder.indexOf(right)).slice(0, 2);
  return { outcome: "SUFFICIENT", score: rawScore, rawScore, displayScore: decimalHalfUp(rawScore, 2).toFixed(2), ihfrClass: classifyIHFRScore(rawScore), dataQuality: quality(input, variables), componentScores, decomposition: { variables, dimensions: details }, drivers, explanation: drivers.map((driver) => templates[driver]).join(" "), measurementContractVersion: IHFR_CONTRACT.measurementVersion, inputContractVersion: IHFR_CONTRACT.inputVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash, labels: IHFR_CONTRACT.labels };
}

function scoreVariable(path: string, value: unknown): VariableDecomposition {
  if (value === undefined || value === null) { if (optional.has(path) || value === undefined || path === "supplement.landUseType") return { included: false, raw: null, normalizedInput: null, transformation: null, score: null, clamped: false }; invalid(); }
  if (path in enumScores) {
    const key = typeof value === "boolean" ? String(value) : value;
    if (typeof key !== "string" || !(key in enumScores[path])) invalid();
    return { included: true, raw: value as string | boolean, normalizedInput: value as string | boolean, transformation: `enumMappings.${path}`, score: enumScores[path][key], clamped: false };
  }
  if (typeof value !== "number" || !Number.isFinite(value)) invalid();
  let normalized: number; let normalizedInput = value; let clamped = false;
  if (path === "soil.infiltrationRateMmPerHour" || path === "water.wellDepthMeters") { if (value < 0) invalid(); normalizedInput = Math.min(value, 60); clamped = normalizedInput !== value; normalized = 1 - normalizedInput / 60; }
  else if (path === "terrain.slopePercent") { if (value < 0) invalid(); normalizedInput = Math.min(value, 45); clamped = normalizedInput !== value; normalized = normalizedInput / 45; }
  else if (path === "vegetation.vegetationCoverPercent") { if (value < 0 || value > 100) invalid(); normalized = 1 - value / 100; }
  else if (path === "soil.soilExposedPercent") { if (value < 0 || value > 100) invalid(); normalized = value / 100; }
  else invalid();
  assertUnit(normalized);
  return { included: true, raw: value, normalizedInput, transformation: normalizationFormula[path], score: normalized, clamped };
}
function compatible(manifest: VerifiedManifest) { return manifest.mathContractVersion === IHFR_CONTRACT.activeMathVersion && manifest.algorithmVersion === IHFR_CONTRACT.algorithmVersion && manifest.contractHash === IHFR_CONTRACT.contractHash; }
function quality(input: IHFREvaluationInput, variables: Record<string, VariableDecomposition>) { const present = ["soil.infiltrationRateMmPerHour", "soil.compactionLevel", "vegetation.vegetationCoverPercent", "supplement.landUseType", "water.waterAvailability"].filter((path) => path === "supplement.landUseType" ? input.landUseType != null : variables[path].included).length / 5; return present >= .8 ? "HIGH" : present >= .5 ? "MODERATE" : "LOW"; }
export function classifyIHFRScore(score: number) { assertUnit(score); return score <= .25 ? "LOW" as const : score <= .5 ? "MODERATE" as const : score <= .75 ? "HIGH" as const : "CRITICAL" as const; }
export function decimalHalfUp(value: number, places: number) { if (!Number.isFinite(value) || value < 0 || !Number.isInteger(places) || places < 0) invalid(); const [coefficient, exponentText = "0"] = value.toString().toLowerCase().split("e"); const [whole, fraction = ""] = coefficient.split("."); const digits = BigInt(`${whole}${fraction}`); const shift = places + Number(exponentText) - fraction.length; let rounded: bigint; if (shift >= 0) rounded = digits * BigInt(10) ** BigInt(shift); else { const divisor = BigInt(10) ** BigInt(-shift); const quotient = digits / divisor; rounded = quotient + ((digits % divisor) * BigInt(2) >= divisor ? BigInt(1) : BigInt(0)); } return Number(rounded) / 10 ** places; }
function readPath(environmental: Record<string, unknown>, path: string) { const [section, field] = path.split("."); const group = environmental[section]; return isRecord(group) ? group[field] : undefined; }
function assertUnit(value: number) { if (!Number.isFinite(value) || value < 0 || value > 1) invalid(); }
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]) { return Object.keys(value).every((key) => allowed.includes(key)); }
function invalid(): never { throw new TypeError("INVALID_INPUT"); }

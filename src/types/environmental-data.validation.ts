import { WATER_SOURCES, WATER_AVAILABILITY, SALINITY, TEXTURES, LEVELS, EROSION, type EnvironmentalPayload } from "./environmental-data.type";
export type FieldRule = { label: string; type: "number" | "boolean" | "enum"; optional?: boolean; min?: number; max?: number; unit?: string; values?: readonly string[] };
export const ENVIRONMENTAL_FIELDS: Record<keyof EnvironmentalPayload, Record<string, FieldRule>> = {
 water: {
  waterSourceType: { label: "Fonte de água", type: "enum", values: WATER_SOURCES },
  hasSpring: { label: "Há nascente", type: "boolean" },
  wellDepthMeters: { label: "Profundidade do poço", type: "number", optional: true, min: 0, unit: "m" },
  waterAvailability: { label: "Disponibilidade hídrica", type: "enum", values: WATER_AVAILABILITY },
  salinityIndicator: { label: "Indicador de salinidade", type: "enum", optional: true, values: SALINITY },
 },
 soil: {
  soilTexture: { label: "Textura do solo", type: "enum", values: TEXTURES },
  infiltrationRateMmPerHour: { label: "Taxa de infiltração", type: "number", min: 0, unit: "mm/h" },
  compactionLevel: { label: "Compactação", type: "enum", values: LEVELS },
  erosionSigns: { label: "Sinais de erosão", type: "enum", values: EROSION },
  soilExposedPercent: { label: "Solo exposto", type: "number", optional: true, min: 0, max: 100, unit: "%" },
 },
 vegetation: {
  vegetationCoverPercent: { label: "Cobertura vegetal", type: "number", min: 0, max: 100, unit: "%" },
  fragmentationLevel: { label: "Fragmentação", type: "enum", values: LEVELS },
  hasRiparianApp: { label: "Presença de APP ripária", type: "boolean", optional: true },
  landscapeDegradation: { label: "Degradação da paisagem", type: "enum", values: LEVELS },
 },
 terrain: {
  drainageDensityKmPerKm2: { label: "Densidade de drenagem", type: "number", optional: true, min: 0, unit: "km/km²" },
  elevationMeters: { label: "Elevação", type: "number", optional: true, unit: "m" },
  slopePercent: { label: "Declividade", type: "number", optional: true, min: 0, unit: "%" },
 },
};
export class EnvironmentalValidationError extends Error {
 constructor(public readonly fields: Record<string, string>) { super("Verifique os campos indicados."); }
}
function object(value: unknown): value is Record<string, unknown> {
 return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseEnvironmentalInput(value: unknown): EnvironmentalPayload {
 const errors: Record<string, string> = {};
 if (!object(value)) throw new EnvironmentalValidationError({ form: "Informe os quatro grupos ambientais." });
 for (const key of Object.keys(value)) if (!(key in ENVIRONMENTAL_FIELDS) || !Object.hasOwn(ENVIRONMENTAL_FIELDS, key)) errors.form = "O formulário contém campos não permitidos.";
 const result: Record<string, Record<string, unknown>> = {};
 for (const [group, rules] of Object.entries(ENVIRONMENTAL_FIELDS)) {
  const input = value[group]; result[group] = {};
  if (!object(input)) { errors[group] = "Informe este grupo."; continue; }
  for (const key of Object.keys(input)) if (!Object.hasOwn(rules, key)) errors[`${group}.${key}`] = "Campo não permitido.";
  for (const [key, rule] of Object.entries(rules)) {
   const field = `${group}.${key}`; const v = input[key];
   if (v === undefined || v === null) {
    if (!rule.optional) errors[field] = "Campo obrigatório.";
    else result[group][key] = null;
    continue;
   }
   const valid = rule.type === "number" ? typeof v === "number" && Number.isFinite(v) && (rule.min === undefined || v >= rule.min) && (rule.max === undefined || v <= rule.max)
    : rule.type === "boolean" ? typeof v === "boolean" : typeof v === "string" && rule.values!.includes(v);
   if (!valid) errors[field] = rule.type === "number" ? `Informe um número finito${rule.min !== undefined ? ` maior ou igual a ${rule.min}` : ""}${rule.max !== undefined ? ` e menor ou igual a ${rule.max}` : ""}.` : "Selecione uma opção válida.";
   else result[group][key] = Object.is(v, -0) ? 0 : v;
  }
 }
 if (result.water && !["SHALLOW_WELL", "TUBULAR_WELL"].includes(String(result.water.waterSourceType)) && result.water.wellDepthMeters != null) errors["water.wellDepthMeters"] = "Profundidade é aplicável somente a poços.";
 if (Object.keys(errors).length) throw new EnvironmentalValidationError(errors);
 return result as EnvironmentalPayload;
}

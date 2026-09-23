import { createHash } from "node:crypto";
import type { IHFRLandUseType, IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { validResourceId } from "../areas/area.authorization";
import { IHFR_CONTRACT } from "./ihfr-diagnosis.constants";
import { canonicalizeIHFRValue } from "./manifest-loader";

export type IHFRWriteMode = "CREATE" | "REPLACE";
export type IHFRVersionSelection = { measurementContractVersion: string; mathContractVersion: string; algorithmVersion: string; contractHash: string };
export type IHFRSupplementInput = { inputContractVersion: typeof IHFR_CONTRACT.inputVersion; landUseType: IHFRLandUseType; provenance: { kind: "FIELD_OBSERVATION" | "AUTHORIZED_RECORD"; observedAt: string } };
export type IHFRSupplementCandidateInput = Omit<IHFRSupplementInput, "landUseType"> & { landUseType?: IHFRLandUseType | null };
export type IHFRDiagnosisRequest = { mode: IHFRWriteMode; expectedCurrentDiagnosisId: string | null; supplement: IHFRSupplementCandidateInput; versions: IHFRVersionSelection };
export type IHFRDiagnosisResponse = { diagnosis: PublicDiagnosis | null; outcome: string };

const landUseTypes = new Set<IHFRLandUseType>(["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"]);
const provenanceKinds = new Set(["FIELD_OBSERVATION", "AUTHORIZED_RECORD"]);
const versionPatterns = {
  measurementContractVersion: /^ihfr-measurement-v[0-9]+(?:\.[0-9]+){0,2}$/,
  mathContractVersion: /^ihfr-math-experimental-v[0-9]+\.[0-9]+\.[0-9]+$/,
  algorithmVersion: /^ihfr-evaluator-ts-v[0-9]+\.[0-9]+\.[0-9]+$/,
  contractHash: /^sha256:[0-9a-fA-F]{64}$/,
} as const;

export function isActiveIHFRVersionSelection(value: IHFRVersionSelection): boolean {
  return value.measurementContractVersion === IHFR_CONTRACT.measurementVersion
    && value.mathContractVersion === IHFR_CONTRACT.activeMathVersion
    && value.algorithmVersion === IHFR_CONTRACT.algorithmVersion
    && value.contractHash === IHFR_CONTRACT.contractHash;
}

export function parseIHFRRouteContext(value: unknown): IHFRRouteContext {
  if (!isClosedRecord(value, ["laboratoryId", "areaId", "collectionId"])) throw new TypeError("INVALID_CONTEXT");
  const context = { laboratoryId: value.laboratoryId, areaId: value.areaId, collectionId: value.collectionId };
  if (!Object.values(context).every((item) => typeof item === "string" && validResourceId(item))) throw new TypeError("INVALID_CONTEXT");
  return context as IHFRRouteContext;
}

export function parseIHFRDiagnosisRequest(value: unknown): IHFRDiagnosisRequest {
  if (!isRecord(value) || !hasOnlyKeys(value, ["mode", "expectedCurrentDiagnosisId", "supplement", "versions"])) invalidRequest();
  if (value.mode !== "CREATE" && value.mode !== "REPLACE") invalidRequest();
  const expected = value.expectedCurrentDiagnosisId;
  if (value.mode === "CREATE" && expected !== undefined && expected !== null) invalidRequest();
  if (value.mode === "REPLACE" && (typeof expected !== "string" || !validResourceId(expected))) invalidRequest();
  return { mode: value.mode, expectedCurrentDiagnosisId: value.mode === "CREATE" ? null : expected as string, supplement: parseSupplement(value.supplement), versions: parseVersions(value.versions) };
}

export function hashIHFRDiagnosisRequest(context: IHFRRouteContext, request: IHFRDiagnosisRequest): string {
  const canonical = canonicalizeIHFRValue({ context, operationType: "CREATE_OR_REPLACE", request });
  return `sha256:${createHash("sha256").update(canonical, "utf8").digest("hex")}`;
}

function parseSupplement(value: unknown): IHFRSupplementCandidateInput {
  if (!isRecord(value) || !hasOnlyKeys(value, ["inputContractVersion", "landUseType", "provenance"]) || !Object.hasOwn(value, "inputContractVersion") || !Object.hasOwn(value, "provenance") || value.inputContractVersion !== IHFR_CONTRACT.inputVersion) invalidRequest();
  if (value.landUseType !== undefined && value.landUseType !== null && !landUseTypes.has(value.landUseType as IHFRLandUseType)) invalidRequest();
  const provenance = value.provenance;
  if (!isClosedRecord(provenance, ["kind", "observedAt"]) || !provenanceKinds.has(provenance.kind as string) || typeof provenance.observedAt !== "string" || !isDateTime(provenance.observedAt)) invalidRequest();
  return { inputContractVersion: IHFR_CONTRACT.inputVersion, ...(Object.hasOwn(value, "landUseType") ? { landUseType: value.landUseType as IHFRLandUseType | null } : {}), provenance: { kind: provenance.kind as IHFRSupplementInput["provenance"]["kind"], observedAt: provenance.observedAt } };
}
function parseVersions(value: unknown): IHFRVersionSelection {
  if (!isClosedRecord(value, Object.keys(versionPatterns)) || Object.entries(versionPatterns).some(([key, pattern]) => typeof value[key] !== "string" || !pattern.test(value[key]))) invalidRequest();
  return {
    measurementContractVersion: value.measurementContractVersion as string,
    mathContractVersion: value.mathContractVersion as string,
    algorithmVersion: value.algorithmVersion as string,
    contractHash: value.contractHash as string,
  };
}
function isDateTime(value: string) { return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value)); }
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]) { return Object.keys(value).every((key) => allowed.includes(key)); }
function isClosedRecord(value: unknown, keys: readonly string[]): value is Record<string, unknown> { return isRecord(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key)); }
function invalidRequest(): never { throw new TypeError("INVALID_REQUEST"); }

export function deriveIHFRLifecycleState(input: { current: boolean; terminalEvent: "REVOKED" | "SUPERSEDED" | null }) {
  if (input.current) return "CURRENT" as const;
  return input.terminalEvent === "REVOKED" ? "REVOKED" as const : "SUPERSEDED" as const;
}
export type DiagnosisProjectionSource = {
  id: string; collectionDataId: string; environmentalMeasurementSetId: string; inputSupplementId: string;
  rawScore: number; displayScore: number | string; ihfrClass: PublicDiagnosis["ihfrClass"];
  dataQuality: "LOW" | "MODERATE" | "HIGH"; componentScores: unknown; decomposition: unknown;
  drivers: unknown; explanation: string; measurementContractVersion: string; inputContractVersion: string;
  mathContractVersion: string; algorithmVersion: string; contractHash: string; calculatedAt: string;
  validFrom: string; transitionedAt: string | null; scientificState: string;
  current: boolean; terminalEvent: "REVOKED" | "SUPERSEDED" | null;
};

const decompositionInputs = [
  "water.waterSourceType", "water.hasSpring", "water.wellDepthMeters", "water.waterAvailability", "water.salinityIndicator",
  "soil.infiltrationRateMmPerHour", "soil.compactionLevel", "soil.erosionSigns", "soil.soilTexture", "soil.soilExposedPercent",
  "vegetation.vegetationCoverPercent", "vegetation.fragmentationLevel", "vegetation.hasRiparianApp", "vegetation.landscapeDegradation",
  "terrain.slopePercent", "supplement.landUseType",
] as const;

function projectDecomposition(stored: unknown): PublicDiagnosis["decomposition"] {
  if (!isRecord(stored)) throw new TypeError("INVALID_STORED_DIAGNOSIS");
  const variables = stored.variables;
  if (!isRecord(variables)) throw new TypeError("INVALID_STORED_DIAGNOSIS");
  return decompositionInputs.map((input) => {
    const value = variables[input];
    if (!isRecord(value) || typeof value.included !== "boolean" || typeof value.clamped !== "boolean") throw new TypeError("INVALID_STORED_DIAGNOSIS");
    const raw = value.raw ?? null;
    const normalizedInput = value.normalizedInput ?? null;
    const transformation = value.transformation ?? null;
    const score = value.score ?? null;
    if (value.included && (raw === null || typeof transformation !== "string" || typeof score !== "number")) throw new TypeError("INVALID_STORED_DIAGNOSIS");
    if (![raw, normalizedInput].every((item) => item === null || ["number", "string", "boolean"].includes(typeof item)) || (transformation !== null && typeof transformation !== "string") || (score !== null && (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1))) throw new TypeError("INVALID_STORED_DIAGNOSIS");
    return { input, available: value.included, raw: raw as number | string | boolean | null, normalizedInput: normalizedInput as number | string | boolean | null, transformation: transformation as string | null, score: score as number | null, clamped: value.clamped };
  });
}

export function projectPublicDiagnosis(source: DiagnosisProjectionSource, context: IHFRRouteContext, labels: readonly string[]): PublicDiagnosis {
  const displayScore = Number(source.displayScore);
  if (source.collectionDataId !== context.collectionId || source.scientificState !== "EXPERIMENTAL" || !Number.isFinite(displayScore) || displayScore < 0 || displayScore > 1 || !Array.isArray(source.drivers) || source.drivers.length !== 2 || !source.drivers.every((driver) => ["W", "S", "V", "T"].includes(driver))) throw new TypeError("INVALID_STORED_DIAGNOSIS");
  const components = source.componentScores;
  if (!isRecord(components) || !["W", "S", "V", "T"].every((key) => typeof components[key] === "number")) throw new TypeError("INVALID_STORED_DIAGNOSIS");
  return {
    id: source.id, areaId: context.areaId, collectionId: context.collectionId,
    environmentalMeasurementSetId: source.environmentalMeasurementSetId, inputSupplementId: source.inputSupplementId,
    lifecycleState: deriveIHFRLifecycleState({ current: source.current, terminalEvent: source.terminalEvent }),
    rawScore: source.rawScore, displayScore, ihfrClass: source.ihfrClass,
    dataQuality: source.dataQuality === "MODERATE" ? "MEDIUM" : source.dataQuality,
    componentScores: { W: components.W as number, S: components.S as number, V: components.V as number, T: components.T as number },
    decomposition: projectDecomposition(source.decomposition), drivers: [...source.drivers] as PublicDiagnosis["drivers"], explanation: source.explanation,
    versions: { measurementContractVersion: source.measurementContractVersion, inputContractVersion: source.inputContractVersion, mathContractVersion: source.mathContractVersion, algorithmVersion: source.algorithmVersion, contractHash: source.contractHash },
    calculatedAt: source.calculatedAt, validFrom: source.validFrom, transitionedAt: source.transitionedAt,
    scientificState: "EXPERIMENTAL", scientificLabels: [...labels],
  };
}

import { createHash } from "node:crypto";
import type { IHFRLandUseType, IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { validResourceId } from "../areas/area.authorization";
import { IHFR_CONTRACT } from "./ihfr-diagnosis.constants";
import { canonicalizeIHFRValue } from "./manifest-loader";

export type IHFRWriteMode = "CREATE" | "REPLACE";
export type IHFRVersionSelection = { measurementContractVersion: typeof IHFR_CONTRACT.measurementVersion; mathContractVersion: typeof IHFR_CONTRACT.activeMathVersion; algorithmVersion: typeof IHFR_CONTRACT.algorithmVersion; contractHash: typeof IHFR_CONTRACT.contractHash };
export type IHFRSupplementInput = { inputContractVersion: typeof IHFR_CONTRACT.inputVersion; landUseType: IHFRLandUseType; provenance: { kind: "FIELD_OBSERVATION" | "AUTHORIZED_RECORD"; observedAt: string } };
export type IHFRDiagnosisRequest = { mode: IHFRWriteMode; expectedCurrentDiagnosisId: string | null; supplement: IHFRSupplementInput; versions: IHFRVersionSelection };
export type IHFRDiagnosisResponse = { diagnosis: PublicDiagnosis | null; outcome: string };

const landUseTypes = new Set<IHFRLandUseType>(["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"]);
const provenanceKinds = new Set(["FIELD_OBSERVATION", "AUTHORIZED_RECORD"]);
const versionSelection: IHFRVersionSelection = { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash };

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

function parseSupplement(value: unknown): IHFRSupplementInput {
  if (!isClosedRecord(value, ["inputContractVersion", "landUseType", "provenance"]) || value.inputContractVersion !== IHFR_CONTRACT.inputVersion || !landUseTypes.has(value.landUseType as IHFRLandUseType)) invalidRequest();
  const provenance = value.provenance;
  if (!isClosedRecord(provenance, ["kind", "observedAt"]) || !provenanceKinds.has(provenance.kind as string) || typeof provenance.observedAt !== "string" || !isDateTime(provenance.observedAt)) invalidRequest();
  return { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: value.landUseType as IHFRLandUseType, provenance: { kind: provenance.kind as IHFRSupplementInput["provenance"]["kind"], observedAt: provenance.observedAt } };
}
function parseVersions(value: unknown): IHFRVersionSelection {
  if (!isClosedRecord(value, Object.keys(versionSelection)) || Object.entries(versionSelection).some(([key, expected]) => value[key] !== expected)) invalidRequest();
  return { ...versionSelection };
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
export type DiagnosisProjectionSource = Omit<PublicDiagnosis, "areaId" | "laboratoryId" | "collectionId" | "lifecycleState" | "labels"> & { collectionDataId: string; current: boolean; terminalEvent: "REVOKED" | "SUPERSEDED" | null };
export function projectPublicDiagnosis(source: DiagnosisProjectionSource, context: IHFRRouteContext, labels: readonly string[]): PublicDiagnosis {
  const { collectionDataId: _collectionDataId, current, terminalEvent, ...publicFields } = source;
  void _collectionDataId;
  return { ...publicFields, laboratoryId: context.laboratoryId, areaId: context.areaId, collectionId: context.collectionId, lifecycleState: deriveIHFRLifecycleState({ current, terminalEvent }), labels };
}

import type { IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { validResourceId } from "../areas/area.authorization";

export type IHFRWriteMode = "CREATE" | "REPLACE";
export type IHFRDiagnosisRequest = { mode: IHFRWriteMode; expectedCurrentDiagnosisId?: string | null; supplement: unknown };
export type IHFRDiagnosisResponse = { diagnosis: PublicDiagnosis | null; outcome: string };

export function parseIHFRRouteContext(value: unknown): IHFRRouteContext {
  if (!value || typeof value !== "object") throw new TypeError("INVALID_CONTEXT");
  const input = value as Record<string, unknown>;
  const context = { laboratoryId: input.laboratoryId, areaId: input.areaId, collectionId: input.collectionId };
  if (!Object.values(context).every((item) => typeof item === "string" && validResourceId(item))) throw new TypeError("INVALID_CONTEXT");
  return context as IHFRRouteContext;
}
export function parseIHFRDiagnosisRequest(_value: unknown): IHFRDiagnosisRequest {
  throw new Error("IHFR_REQUEST_PARSER_NOT_IMPLEMENTED");
}

export function deriveIHFRLifecycleState(input: {
  current: boolean;
  terminalEvent: "REVOKED" | "SUPERSEDED" | null;
}) {
  if (input.current) return "CURRENT" as const;
  return input.terminalEvent === "REVOKED" ? "REVOKED" as const : "SUPERSEDED" as const;
}

export type DiagnosisProjectionSource = Omit<PublicDiagnosis, "areaId" | "laboratoryId" | "collectionId" | "lifecycleState" | "labels"> & {
  collectionDataId: string;
  current: boolean;
  terminalEvent: "REVOKED" | "SUPERSEDED" | null;
};

export function projectPublicDiagnosis(source: DiagnosisProjectionSource, context: IHFRRouteContext, labels: readonly string[]): PublicDiagnosis {
  const { collectionDataId: _collectionDataId, current, terminalEvent, ...publicFields } = source;
  return { ...publicFields, laboratoryId: context.laboratoryId, areaId: context.areaId, collectionId: context.collectionId, lifecycleState: deriveIHFRLifecycleState({ current, terminalEvent }), labels };
}

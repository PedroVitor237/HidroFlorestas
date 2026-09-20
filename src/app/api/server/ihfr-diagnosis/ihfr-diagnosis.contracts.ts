import type { IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";

export type IHFRWriteMode = "CREATE" | "REPLACE";
export type IHFRDiagnosisRequest = { mode: IHFRWriteMode; expectedCurrentDiagnosisId?: string | null; supplement: unknown };
export type IHFRDiagnosisResponse = { diagnosis: PublicDiagnosis | null; outcome: string };

export function parseIHFRRouteContext(_value: unknown): IHFRRouteContext {
  throw new Error("IHFR_CONTEXT_PARSER_NOT_IMPLEMENTED");
}
export function parseIHFRDiagnosisRequest(_value: unknown): IHFRDiagnosisRequest {
  throw new Error("IHFR_REQUEST_PARSER_NOT_IMPLEMENTED");
}

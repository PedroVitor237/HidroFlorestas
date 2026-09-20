import type { IHFRLandUseType } from "@/types/ihfr-diagnosis.type";
import type { VerifiedManifest } from "./manifest-loader";

export type IHFREvaluationInput = { environmental: unknown; landUseType?: IHFRLandUseType | null };
export type IHFREvaluationResult = { outcome: "SUFFICIENT" | "INSUFFICIENT_DATA"; score?: number };

export function evaluateIHFR(_manifest: VerifiedManifest, _input: IHFREvaluationInput): IHFREvaluationResult {
  throw new Error("IHFR_EVALUATOR_NOT_IMPLEMENTED");
}

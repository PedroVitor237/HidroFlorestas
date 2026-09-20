export type IHFRLifecycleState = "CURRENT" | "SUPERSEDED" | "REVOKED";
export type IHFREvaluationOutcome = "SUFFICIENT" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION";
export type IHFRLandUseType = "FOREST" | "AGROFORESTRY" | "CROPLAND" | "PASTURE" | "DEGRADED_PASTURE" | "BARE_SOIL" | "URBAN";

export type PublicDiagnosis = {
  id: string;
  laboratoryId: string;
  areaId: string;
  collectionId: string;
  rawScore: number;
  displayScore: string;
  ihfrClass: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  dataQuality: "LOW" | "MODERATE" | "HIGH";
  componentScores: Readonly<Record<"W" | "S" | "V" | "T", number>>;
  lifecycleState: IHFRLifecycleState;
  measurementContractVersion: string;
  inputContractVersion: string;
  mathContractVersion: string;
  algorithmVersion: string;
  contractHash: string;
  calculatedAt: string;
  labels: readonly string[];
};

export type IHFRRouteContext = {
  laboratoryId: string;
  areaId: string;
  collectionId: string;
};

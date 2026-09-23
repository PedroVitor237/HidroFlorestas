export type IHFRLifecycleState = "CURRENT" | "SUPERSEDED" | "REVOKED";
export type IHFREvaluationOutcome = "SUFFICIENT" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION";
export type IHFRLandUseType = "FOREST" | "AGROFORESTRY" | "CROPLAND" | "PASTURE" | "DEGRADED_PASTURE" | "BARE_SOIL" | "URBAN";

export type PublicDiagnosis = {
  id: string;
  areaId: string;
  collectionId: string;
  environmentalMeasurementSetId: string;
  inputSupplementId: string;
  lifecycleState: IHFRLifecycleState;
  rawScore: number;
  displayScore: number;
  ihfrClass: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  dataQuality: "LOW" | "MEDIUM" | "HIGH";
  componentScores: Readonly<Record<"W" | "S" | "V" | "T", number>>;
  decomposition: ReadonlyArray<{ input: string; available: boolean; raw: number | string | boolean | null; normalizedInput: number | string | boolean | null; transformation: string | null; score: number | null; clamped: boolean }>;
  drivers: readonly ("W" | "S" | "V" | "T")[];
  explanation: string;
  versions: { measurementContractVersion: string; inputContractVersion: string; mathContractVersion: string; algorithmVersion: string; contractHash: string };
  calculatedAt: string;
  validFrom: string;
  transitionedAt?: string | null;
  scientificState: "EXPERIMENTAL";
  scientificLabels: readonly string[];
};

export type IHFRRouteContext = {
  laboratoryId: string;
  areaId: string;
  collectionId: string;
};

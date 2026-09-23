import { evaluateIHFR } from "../../src/app/api/server/ihfr-diagnosis/evaluator";
import { loadActiveIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";
import type { PublicDiagnosis } from "../../src/types/ihfr-diagnosis.type";

const evaluation = evaluateIHFR(loadActiveIHFRManifest(), {
  environmental: {
    terrain: { slopePercent: 45 },
    water: { waterSourceType: "SPRING", hasSpring: true, waterAvailability: "PERMANENT" },
    soil: { infiltrationRateMmPerHour: 60, compactionLevel: "LOW", erosionSigns: "NONE", soilTexture: "MEDIUM" },
    vegetation: { vegetationCoverPercent: 100, fragmentationLevel: "LOW", hasRiparianApp: true, landscapeDegradation: "LOW" },
  },
  landUseType: "FOREST",
});

if (evaluation.outcome !== "SUFFICIENT") throw new Error("IHFR public test fixture must be sufficient");

export const publicDiagnosisFixture: PublicDiagnosis = {
  id: "60000000-0000-4000-8000-000000000062",
  areaId: "60000000-0000-4000-8000-000000000031",
  collectionId: "60000000-0000-4000-8000-000000000041",
  environmentalMeasurementSetId: "60000000-0000-4000-8000-000000000051",
  inputSupplementId: "60000000-0000-4000-8000-000000000061",
  lifecycleState: "CURRENT",
  rawScore: evaluation.rawScore,
  displayScore: Number(evaluation.displayScore),
  ihfrClass: evaluation.ihfrClass,
  dataQuality: evaluation.dataQuality === "MODERATE" ? "MEDIUM" : evaluation.dataQuality,
  componentScores: evaluation.componentScores,
  decomposition: Object.entries(evaluation.decomposition.variables).map(([input, variable]) => ({ input, available: variable.included, raw: variable.raw, normalizedInput: variable.normalizedInput, transformation: variable.transformation, score: variable.score, clamped: variable.clamped })),
  drivers: evaluation.drivers,
  explanation: evaluation.explanation,
  versions: { measurementContractVersion: evaluation.measurementContractVersion, inputContractVersion: evaluation.inputContractVersion, mathContractVersion: evaluation.mathContractVersion, algorithmVersion: evaluation.algorithmVersion, contractHash: evaluation.contractHash },
  calculatedAt: "2026-09-20T12:03:00.000Z",
  validFrom: "2026-09-20T12:03:00.000Z",
  transitionedAt: null,
  scientificState: "EXPERIMENTAL",
  scientificLabels: evaluation.labels,
};

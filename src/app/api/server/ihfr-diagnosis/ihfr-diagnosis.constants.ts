export const IHFR_CONTRACT = {
  measurementVersion: "ihfr-measurement-v1",
  inputVersion: "ihfr-diagnosis-input-experimental-v0.1.0",
  activeMathVersion: "ihfr-math-experimental-v0.1.1",
  historicalMathVersion: "ihfr-math-experimental-v0.1.0",
  algorithmVersion: "ihfr-evaluator-ts-v0.1.0",
  contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89",
  labels: ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"],
} as const;

export const IHFR_CAPABILITIES = {
  read: "READ_IHFR_DIAGNOSIS",
  manage: "MANAGE_IHFR_DIAGNOSIS",
} as const;

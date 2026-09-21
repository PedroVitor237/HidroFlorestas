import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentalDiagnosisSummary } from "../../src/components/ihfr-diagnosis/experimental-diagnosis-summary";
import { NoCurrentDiagnosis } from "../../src/components/ihfr-diagnosis/no-current-diagnosis";
import type { PublicDiagnosis } from "../../src/types/ihfr-diagnosis.type";

const diagnosis: PublicDiagnosis = {
  id: "d", laboratoryId: "l", areaId: "a", collectionId: "c", rawScore: 0.5, displayScore: "0.50",
  ihfrClass: "MODERATE", dataQuality: "MODERATE", componentScores: { W: 0.1, S: 0.2, V: 0.3, T: 0.4 }, lifecycleState: "CURRENT",
  measurementContractVersion: "ihfr-measurement-v1", inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0",
  mathContractVersion: "ihfr-math-experimental-v0.1.1", algorithmVersion: "ihfr-evaluator-ts-v0.1.0", contractHash: "sha256:test",
  calculatedAt: "2026-09-20T00:00:00.000Z", labels: ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"],
};

test("read surfaces use labelled regions, semantic value lists and text labels without write controls", () => {
  const summary = renderToStaticMarkup(<ExperimentalDiagnosisSummary diagnosis={diagnosis} />);
  assert.match(summary, /<section aria-labelledby="ihfr-diagnosis-heading"/);
  assert.match(summary, /<h2 id="ihfr-diagnosis-heading"/);
  assert.match(summary, /<dl/);
  assert.match(summary, /<dt/);
  for (const label of diagnosis.labels) assert.match(summary, new RegExp(label));
  assert.doesNotMatch(summary, /<button|calcular|substituir|revogar/i);
  const absent = renderToStaticMarkup(<NoCurrentDiagnosis />);
  assert.match(absent, /<section aria-labelledby="ihfr-diagnosis-heading"/);
  assert.match(absent, /Nenhum diagnóstico IHFR vigente/);
  assert.doesNotMatch(absent, /0\.00|LOW|MODERATE|HIGH|CRITICAL/);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentalDiagnosisSummary } from "../../src/components/ihfr-diagnosis/experimental-diagnosis-summary";
import { NoCurrentDiagnosis } from "../../src/components/ihfr-diagnosis/no-current-diagnosis";
import { publicDiagnosisFixture as diagnosis } from "../fixtures/ihfr-diagnosis-public";

test("read surfaces use labelled regions, semantic value lists and text labels without write controls", () => {
  const summary = renderToStaticMarkup(<ExperimentalDiagnosisSummary diagnosis={diagnosis} />);
  assert.match(summary, /<section aria-labelledby="ihfr-diagnosis-heading"/);
  assert.match(summary, /<h2 id="ihfr-diagnosis-heading"/);
  assert.match(summary, /<dl/);
  assert.match(summary, /<dt/);
  for (const label of diagnosis.scientificLabels) assert.match(summary, new RegExp(label));
  assert.doesNotMatch(summary, /<button|calcular|substituir|revogar/i);
  const absent = renderToStaticMarkup(<NoCurrentDiagnosis />);
  assert.match(absent, /<section aria-labelledby="ihfr-diagnosis-heading"/);
  assert.match(absent, /Nenhum diagnóstico IHFR vigente/);
  assert.doesNotMatch(absent, /0\.00|LOW|MODERATE|HIGH|CRITICAL/);
});

test("normal diagnosis view exposes provenance, versions, lifecycle and UTC dates", () => {
  const summary = renderToStaticMarkup(<ExperimentalDiagnosisSummary diagnosis={diagnosis} />);
  for (const value of [diagnosis.areaId, diagnosis.collectionId, diagnosis.environmentalMeasurementSetId, diagnosis.inputSupplementId, ...Object.values(diagnosis.versions), diagnosis.lifecycleState, diagnosis.scientificState]) {
    assert.ok(summary.includes(value), value);
  }
  for (const label of ["Área de origem", "Coleta de origem", "Conjunto de medições ambientais", "Suplemento de entrada IHFR", "Contrato de medição", "Contrato de entrada", "Contrato matemático", "Algoritmo", "Hash do contrato", "Calculado em (UTC)", "Vigente desde (UTC)", "Transição de estado em (UTC)"]) assert.ok(summary.includes(label), label);
  assert.match(summary, /2026-09-20 12:03:00 UTC/);
  assert.match(summary, /Não se aplica/);
  assert.match(summary, /break-all/);
  for (const lifecycleState of ["SUPERSEDED", "REVOKED"] as const) {
    const historic = renderToStaticMarkup(<ExperimentalDiagnosisSummary diagnosis={{ ...diagnosis, lifecycleState, transitionedAt: "2026-09-21T14:00:00.000Z" }} />);
    assert.ok(historic.includes(lifecycleState));
    assert.match(historic, /2026-09-21 14:00:00 UTC/);
  }
});

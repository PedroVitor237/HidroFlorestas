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

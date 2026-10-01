import type { PublicDiagnosis } from "@/types/ihfr-diagnosis.type";

function dateUTC(value: string | null | undefined) {
  if (!value) return "Não se aplica";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data indisponível" : date.toISOString().replace("T", " ").replace(".000Z", " UTC").replace("Z", " UTC");
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-0"><dt className="font-medium">{label}</dt><dd className="break-all">{value}</dd></div>;
}

export function ExperimentalDiagnosisSummary({ diagnosis }: { diagnosis: PublicDiagnosis }) {
  return <section aria-labelledby="ihfr-diagnosis-heading" className="min-w-0 rounded-xl border border-amber-300 bg-amber-50 p-4 text-slate-900">
    <h2 id="ihfr-diagnosis-heading" className="text-lg font-semibold">Diagnóstico IHFR experimental</h2>
    <p className="mt-2 text-3xl font-bold">{diagnosis.displayScore} · {diagnosis.ihfrClass}</p>
    <p>Qualidade dos dados: {diagnosis.dataQuality}</p>
    <p>Estado científico: {diagnosis.scientificState}</p>
    <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.entries(diagnosis.componentScores).map(([name, value]) => <Detail key={name} label={name} value={value} />)}</dl>
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <Detail label="Estado do diagnóstico" value={diagnosis.lifecycleState} />
      <Detail label="Área de origem" value={diagnosis.areaId} />
      <Detail label="Coleta de origem" value={diagnosis.collectionId} />
      <Detail label="Conjunto de medições ambientais" value={diagnosis.environmentalMeasurementSetId} />
      <Detail label="Suplemento de entrada IHFR" value={diagnosis.inputSupplementId} />
      <Detail label="Contrato de medição" value={diagnosis.versions.measurementContractVersion} />
      <Detail label="Contrato de entrada" value={diagnosis.versions.inputContractVersion} />
      <Detail label="Contrato matemático" value={diagnosis.versions.mathContractVersion} />
      <Detail label="Algoritmo" value={diagnosis.versions.algorithmVersion} />
      <Detail label="Hash do contrato" value={diagnosis.versions.contractHash} />
      <Detail label="Calculado em (UTC)" value={dateUTC(diagnosis.calculatedAt)} />
      <Detail label="Vigente desde (UTC)" value={dateUTC(diagnosis.validFrom)} />
      <Detail label="Transição de estado em (UTC)" value={dateUTC(diagnosis.transitionedAt)} />
    </dl>
    <ul className="mt-3 list-disc break-all pl-5 text-sm">{diagnosis.scientificLabels.map(label => <li key={label}>{label}</li>)}</ul>
  </section>;
}

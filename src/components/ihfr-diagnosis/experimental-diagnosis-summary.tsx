import type { PublicDiagnosis } from "@/types/ihfr-diagnosis.type";

export function ExperimentalDiagnosisSummary({ diagnosis }: { diagnosis: PublicDiagnosis }) {
  return <section aria-labelledby="ihfr-diagnosis-heading" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-slate-900">
    <h2 id="ihfr-diagnosis-heading" className="text-lg font-semibold">Diagnóstico IHFR experimental</h2>
    <p className="mt-2 text-3xl font-bold">{diagnosis.displayScore} · {diagnosis.ihfrClass}</p>
    <p>Qualidade dos dados: {diagnosis.dataQuality}</p>
    <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.entries(diagnosis.componentScores).map(([name,value])=><div key={name}><dt className="font-medium">{name}</dt><dd>{value}</dd></div>)}</dl>
    <dl className="mt-3 break-all text-sm"><dt className="font-medium">Contrato matemático</dt><dd>{diagnosis.versions.mathContractVersion}</dd><dt className="font-medium">Algoritmo</dt><dd>{diagnosis.versions.algorithmVersion}</dd><dt className="font-medium">Hash do contrato</dt><dd>{diagnosis.versions.contractHash}</dd></dl>
    <ul className="mt-3 list-disc pl-5 text-sm">{diagnosis.scientificLabels.map(label=><li key={label}>{label}</li>)}</ul>
  </section>;
}

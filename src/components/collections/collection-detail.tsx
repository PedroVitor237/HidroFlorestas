import { formatCollectionOccurrence } from "@/lib/collection-date-time";
import Link from "next/link";
import type { CollectionDetailDto } from "@/types/collection.type";

export function CollectionDetail({ collection }: { collection: CollectionDetailDto }) {
  return (
    <article aria-labelledby="collection-detail-title" className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-green-700">Registro imutável</p>
        <h1 id="collection-detail-title" className="mt-1 text-3xl font-bold">Detalhe da coleta</h1>
        <p className="mt-2 break-all text-sm text-slate-500">{collection.id}</p>
      </header>
      {collection.readOnly && <p className="rounded-xl bg-amber-50 p-4 font-semibold text-amber-900">Laboratório inativo — somente leitura.</p>}
      <dl className="grid gap-5 sm:grid-cols-2">
        <div><dt className="font-semibold text-slate-600">Laboratório</dt><dd>{collection.laboratory.name}</dd></div>
        <div><dt className="font-semibold text-slate-600">Área</dt><dd>{collection.area.name}</dd></div>
        <div><dt className="font-semibold text-slate-600">Ocorrência em campo</dt><dd>{formatCollectionOccurrence(collection.occurredAt)}</dd></div>
        <div><dt className="font-semibold text-slate-600">Confirmação no sistema</dt><dd>{collection.confirmedAt}</dd></div>
      </dl>
      <Link href={`/dashboard/laboratories/${collection.laboratory.id}/areas/${collection.area.id}/collections/${collection.id}/environmental-data`} className="inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">Ver dados ambientais</Link>
    </article>
  );
}

import { formatCollectionOccurrence } from "@/lib/collection-date-time";
import type { CollectionAttempt } from "@/types/collection.type";

export function CollectionReview({
  attempt,
  onEdit,
  onConfirm,
}: {
  attempt: CollectionAttempt;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const submitting = attempt.phase === "submitting";
  return (
    <section aria-labelledby="collection-review-title" className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5">
      <h2 id="collection-review-title" className="text-xl font-bold">Revisão</h2>
      <dl className="space-y-3">
        <div><dt className="font-semibold">Ocorrência em campo</dt><dd>{formatCollectionOccurrence(attempt.occurredAt)}</dd></div>
        <div><dt className="font-semibold">Laboratório</dt><dd>{attempt.context.laboratory.name}</dd></div>
        <div><dt className="font-semibold">Área</dt><dd>{attempt.context.area.name}</dd></div>
      </dl>
      <p className="font-semibold">Será registrada por você</p>
      <p className="text-sm text-slate-600">O identificador e a confirmação serão gerados somente após sua confirmação.</p>
      {attempt.error && <p role="alert" className="font-semibold text-red-700">{attempt.error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={submitting} onClick={onEdit} className="rounded-xl border border-green-700 px-5 py-3 font-bold text-green-800 disabled:opacity-50">
          Voltar e corrigir
        </button>
        <button type="button" disabled={submitting} onClick={onConfirm} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50">
          {submitting ? "Confirmando…" : attempt.error ? "Tentar novamente" : "Confirmar coleta"}
        </button>
      </div>
    </section>
  );
}

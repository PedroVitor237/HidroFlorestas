"use client";

import { useState } from "react";

import {
  createCollectionAttempt,
  editCollectionAttempt,
  reviewCollectionAttempt,
  updateCollectionOccurrence,
} from "./collection-form-state";
import type { CollectionContext } from "@/types/collection.type";

export function CollectionForm({ context }: { context: CollectionContext }) {
  const [attempt, setAttempt] = useState(() => createCollectionAttempt(context));
  if (context.readOnly) {
    return (
      <section aria-labelledby="collection-title" className="space-y-4">
        <h1 id="collection-title" className="text-3xl font-bold">Registrar coleta</h1>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Laboratório inativo — somente leitura. Não é possível registrar uma coleta.
        </p>
      </section>
    );
  }
  return (
    <section aria-labelledby="collection-title" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 id="collection-title" className="text-3xl font-bold text-slate-900">Registrar coleta</h1>
        <p className="mt-2 text-slate-600">Revise os metadados antes da primeira persistência.</p>
      </div>
      <dl className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div><dt className="text-xs font-bold uppercase text-slate-500">Laboratório</dt><dd className="mt-1 font-semibold">{context.laboratory.name}</dd></div>
        <div><dt className="text-xs font-bold uppercase text-slate-500">Área</dt><dd className="mt-1 font-semibold">{context.area.name}</dd></div>
      </dl>
      {attempt.phase === "editing" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setAttempt((current) => reviewCollectionAttempt(current));
          }}
        >
          <label className="block font-semibold" htmlFor="occurredAt">Ocorrência em campo</label>
          <input
            id="occurredAt"
            aria-describedby="occurredAt-help occurredAt-error"
            aria-invalid={attempt.error ? true : undefined}
            className="w-full rounded-xl border border-slate-300 p-3"
            value={attempt.occurredAt}
            onChange={(event) => setAttempt((current) => updateCollectionOccurrence(current, event.target.value))}
            placeholder="2026-09-15T09:00:00-03:00"
          />
          <p id="occurredAt-help" className="text-sm text-slate-600">
            Use RFC 3339 com fuso explícito, por exemplo 2026-09-15T09:00:00-03:00.
          </p>
          {attempt.error && (
            <p id="occurredAt-error" role="alert" className="text-sm font-semibold text-red-700">
              {attempt.error}
            </p>
          )}
          <button className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white" type="submit">Revisar coleta</button>
        </form>
      ) : (
        <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-xl font-bold">Revisão</h2>
          <p>{attempt.occurredAt}</p>
          <button className="rounded-xl border border-green-700 px-5 py-3 font-bold text-green-800" type="button" onClick={() => setAttempt((current) => editCollectionAttempt(current))}>Voltar e corrigir</button>
        </div>
      )}
    </section>
  );
}

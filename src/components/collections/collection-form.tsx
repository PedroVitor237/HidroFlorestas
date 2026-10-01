"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import {
  beginCollectionSubmission,
  createCollectionAttempt,
  editCollectionAttempt,
  failCollectionSubmission,
  reviewCollectionAttempt,
  updateCollectionLocalOccurrence,
} from "./collection-form-state";
import { CollectionReview } from "./collection-review";
import type { CollectionContext } from "@/types/collection.type";

// Server rendering must not initialize device-local time with the server zone.
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function CollectionForm({ context }: { context: CollectionContext }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  return hydrated ? <DeviceCollectionForm context={context} /> : <p role="status">Preparando formulário de coleta…</p>;
}

function DeviceCollectionForm({ context }: { context: CollectionContext }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(() => createCollectionAttempt(context));
  const inFlight = useRef(false);
  const confirm = async () => {
    if (inFlight.current || attempt.phase !== "reviewing") return;
    inFlight.current = true;
    setAttempt((current) => beginCollectionSubmission(current));
    try {
      const apiPath = `/api/laboratories/${context.laboratory.id}/areas/${context.area.id}/collections`;
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.idempotencyKey },
        body: JSON.stringify({ occurredAt: attempt.occurredAt }),
      });
      const payload = await response.json() as { collection?: { id?: unknown }; error?: { code?: string } };
      if (!response.ok) {
        const accessLost = payload.error?.code === "NOT_FOUND" || payload.error?.code === "UNAUTHENTICATED";
        throw new Error(accessLost ? "Seu acesso não está mais disponível ou o recurso não foi encontrado." : "Não foi possível confirmar. Tente novamente.");
      }
      const collectionId = payload.collection?.id;
      if (typeof collectionId !== "string" || !/^[0-9a-f-]{36}$/i.test(collectionId)) throw new Error("Resposta inválida. Tente novamente.");
      const expectedLocation = `${apiPath}/${collectionId}`;
      if (response.headers.get("Location") !== expectedLocation) throw new Error("Resposta inválida. Tente novamente.");
      router.push(`/dashboard/laboratories/${context.laboratory.id}/areas/${context.area.id}/collections/${collectionId}`);
    } catch (error) {
      const message = error instanceof Error && /acesso|recurso|resposta inválida/i.test(error.message)
        ? error.message
        : "Não foi possível confirmar. Tente novamente.";
      setAttempt((current) => failCollectionSubmission(current, message));
    } finally {
      inFlight.current = false;
    }
  };
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
          <label className="block font-semibold" htmlFor="occurredAt">Data e hora da coleta</label>
          <input
            id="occurredAt"
            type="datetime-local"
            step="0.001"
            required
            aria-describedby="occurredAt-help occurredAt-error"
            aria-invalid={attempt.error ? true : undefined}
            className="w-full rounded-xl border border-slate-300 p-3"
            value={attempt.localOccurredAt}
            onChange={(event) => setAttempt((current) => updateCollectionLocalOccurrence(current, event.target.value))}
          />
          <label htmlFor="collection-time-zone" className="block font-semibold">Fuso da coleta</label>
          <select id="collection-time-zone" value={attempt.useDeviceTimeZone ? "device" : "manual"}
            className="w-full rounded-xl border border-slate-300 p-3"
            onChange={(event) => setAttempt(current => updateCollectionLocalOccurrence(current, current.localOccurredAt, current.occurrenceOffset, event.target.value === "device"))}>
            <option value="device">Fuso do dispositivo</option>
            <option value="manual">Fuso UTC manual</option>
          </select>
          <label htmlFor="collection-offset" className="block font-semibold">Offset UTC</label>
          <input id="collection-offset" value={attempt.occurrenceOffset} readOnly={attempt.useDeviceTimeZone}
            required aria-describedby="occurredAt-help" placeholder="-03:00" pattern="[+-][0-9]{2}:[0-9]{2}"
            className="w-full rounded-xl border border-slate-300 p-3 read-only:bg-slate-50"
            onChange={(event) => setAttempt(current => updateCollectionLocalOccurrence(current, current.localOccurredAt, event.target.value, false))} />
          <p id="occurredAt-help" className="text-sm text-slate-600">
            Sugestão inicial: agora no dispositivo. Você pode editar a data e hora. O offset UTC acompanha a data escolhida no fuso do dispositivo; para uma coleta em outro fuso ou em horário repetido, selecione Fuso UTC manual (ex.: -03:00). Confira o horário e o fuso na revisão.
          </p>
          {attempt.error && (
            <p id="occurredAt-error" role="alert" className="text-sm font-semibold text-red-700">
              {attempt.error}
            </p>
          )}
          <button className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white" type="submit">Revisar coleta</button>
        </form>
      ) : <CollectionReview attempt={attempt} onEdit={() => setAttempt((current) => editCollectionAttempt(current))} onConfirm={confirm} />}
    </section>
  );
}

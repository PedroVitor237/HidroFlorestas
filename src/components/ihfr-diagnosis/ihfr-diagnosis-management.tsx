"use client";

import { useEffect, useRef, useState } from "react";
import type { IHFRLandUseType, IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { IHFR_CONTRACT } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { ExperimentalDiagnosisSummary } from "./experimental-diagnosis-summary";
import { NoCurrentDiagnosis } from "./no-current-diagnosis";

type OperationResponse = { outcome: "SUCCEEDED" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION"; diagnosis: PublicDiagnosis | null; insufficiencyReasons: string[] };
type EligibilityResponse = { eligible: boolean; outcome: "ELIGIBLE" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION"; reasons: string[]; hasCurrentDiagnosis: boolean; currentDiagnosisId: string | null };
type Attempt = { key: string; endpoint: string; body: object; kind: "DIAGNOSE" | "REVOKE" };
type Feedback = { text: string; kind: "status" | "alert" };
const landUseTypes: IHFRLandUseType[] = ["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"];

export function IHFRDiagnosisManagement({ context, initialDiagnosis }: { context: IHFRRouteContext; initialDiagnosis: PublicDiagnosis | null }) {
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis);
  const [landUseType, setLandUseType] = useState<IHFRLandUseType | "">("");
  const [provenanceKind, setProvenanceKind] = useState<"FIELD_OBSERVATION" | "AUTHORIZED_RECORD">("FIELD_OBSERVATION");
  const [observedAt, setObservedAt] = useState("");
  const [reason, setReason] = useState("");
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [confirmation, setConfirmation] = useState<"DIAGNOSE" | "REVOKE" | null>(null);
  const dialogButton = useRef<HTMLButtonElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const dialogTrigger = useRef<HTMLElement | null>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const base = `/api/laboratories/${context.laboratoryId}/areas/${context.areaId}/collections/${context.collectionId}/ihfr-diagnosis`;

  useEffect(() => { if (confirmation) dialogButton.current?.focus(); }, [confirmation]);
  useEffect(() => { if (feedback) feedbackRef.current?.focus(); }, [feedback]);

  function announce(text: string, kind: Feedback["kind"] = "status") { setFeedback({ text, kind }); }

  async function reconcileCurrentAndEligibility() {
    const query = landUseType ? `?landUseType=${encodeURIComponent(landUseType)}` : "";
    const [currentResponse, eligibilityResponse] = await Promise.all([
      fetch(`${base}/current`, { cache: "no-store" }),
      fetch(`${base}/eligibility${query}`, { cache: "no-store" }),
    ]);
    if (!currentResponse.ok || !eligibilityResponse.ok) throw new Error("Não foi possível atualizar o diagnóstico e a elegibilidade.");
    const current = await currentResponse.json() as { diagnosis: PublicDiagnosis | null };
    const nextEligibility = await eligibilityResponse.json() as EligibilityResponse;
    setDiagnosis(current.diagnosis);
    setEligibility(nextEligibility);
  }

  async function refreshEligibility() {
    setBusy(true);
    setFeedback(null);
    try {
      const query = landUseType ? `?landUseType=${encodeURIComponent(landUseType)}` : "";
      const response = await fetch(`${base}/eligibility${query}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Não foi possível verificar a elegibilidade.");
      setEligibility(await response.json() as EligibilityResponse);
    } catch (error) { announce(error instanceof Error ? error.message : "Falha ao verificar a elegibilidade.", "alert"); }
    finally { setBusy(false); }
  }

  async function send(current: Attempt) {
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch(current.endpoint, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": current.key }, body: JSON.stringify(current.body), cache: "no-store" });
      const body = await response.json();
      if (response.ok) {
        const operation = body as OperationResponse;
        setAttempt(null);
        setUnknown(false);
        try {
          await reconcileCurrentAndEligibility();
          if (operation.outcome === "SUCCEEDED") announce(current.kind === "REVOKE" ? "Diagnóstico revogado." : "Diagnóstico experimental registrado.");
          else if (operation.outcome === "INSUFFICIENT_DATA") announce(`Dados insuficientes: ${operation.insufficiencyReasons.join(", ")}.`);
          else announce("Versão incompatível com o contrato experimental ativo.", "alert");
        } catch { announce("Operação terminal registrada, mas não foi possível atualizar o diagnóstico e a elegibilidade.", "alert"); }
        return;
      }
      const code = typeof body?.error?.code === "string" ? body.error.code : "TECHNICAL_FAILURE";
      if (code === "TECHNICAL_FAILURE") { setUnknown(true); announce("Resultado desconhecido. Recupere a operação com a mesma chave.", "alert"); return; }
      setAttempt(null);
      setUnknown(false);
      if (code === "STATE_CONFLICT" || code === "IDEMPOTENCY_CONFLICT" || code === "INCOMPATIBLE_VERSION") {
        try {
          await reconcileCurrentAndEligibility();
          announce(code === "INCOMPATIBLE_VERSION" ? "Versão incompatível com o contrato experimental ativo." : "O diagnóstico vigente mudou. Estado e elegibilidade atualizados.", "alert");
        } catch { announce("Operação não concluída; não foi possível atualizar o diagnóstico e a elegibilidade.", "alert"); }
      } else announce(`Operação não concluída: ${code}.`, "alert");
    } catch { setUnknown(true); announce("Resultado desconhecido. Recupere a operação com a mesma chave.", "alert"); }
    finally { setBusy(false); }
  }

  async function recover() {
    if (!attempt) return;
    setBusy(true);
    try {
      const response = await fetch(`${base}/operations/${attempt.key}`, { cache: "no-store" });
      if (response.ok) {
        const operation = await response.json() as OperationResponse;
        setUnknown(false);
        setAttempt(null);
        try {
          await reconcileCurrentAndEligibility();
          announce(operation.outcome === "SUCCEEDED" ? "Resultado recuperado." : operation.outcome === "INSUFFICIENT_DATA" ? `Dados insuficientes: ${operation.insufficiencyReasons.join(", ")}.` : "Versão incompatível com o contrato experimental ativo.", operation.outcome === "INCOMPATIBLE_VERSION" ? "alert" : "status");
        } catch { announce("Resultado recuperado, mas não foi possível atualizar o diagnóstico e a elegibilidade.", "alert"); }
      } else if (response.status === 404) announce("Não há operação terminal recuperável. Se tentar novamente, use a mesma chave.", "alert");
      else announce("Não foi possível recuperar a operação agora. A chave foi preservada.", "alert");
    } catch { announce("Não foi possível recuperar a operação agora. A chave foi preservada.", "alert"); }
    finally { setBusy(false); }
  }

  function prepare(kind: "DIAGNOSE" | "REVOKE") {
    if (attempt) { announce("Recupere ou repita a tentativa pendente antes de iniciar outra operação.", "alert"); return; }
    if (kind === "DIAGNOSE" && (!observedAt || Number.isNaN(Date.parse(observedAt)))) { announce("Informe a data da observação.", "alert"); return; }
    if (kind === "REVOKE" && (reason.trim().length < 1 || reason.length > 500)) { announce("Informe um motivo de 1 a 500 caracteres.", "alert"); return; }
    dialogTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmation(kind);
  }

  function closeConfirmation(restoreTrigger = true) {
    setConfirmation(null);
    if (restoreTrigger) requestAnimationFrame(() => dialogTrigger.current?.focus());
  }

  function confirm() {
    const kind = confirmation;
    closeConfirmation(false);
    if (!kind) return;
    const key = crypto.randomUUID();
    const current: Attempt = kind === "DIAGNOSE" ? {
      key, kind, endpoint: `${base}/diagnoses`, body: {
        mode: diagnosis ? "REPLACE" : "CREATE",
        ...(diagnosis ? { expectedCurrentDiagnosisId: diagnosis.id } : {}),
        supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, ...(landUseType ? { landUseType } : {}), provenance: { kind: provenanceKind, observedAt: new Date(observedAt).toISOString() } },
        versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash },
      },
    } : { key, kind, endpoint: `${base}/diagnoses/${diagnosis?.id}/revocations`, body: { expectedCurrentDiagnosisId: diagnosis?.id, reason: reason.trim() } };
    setAttempt(current);
    void send(current);
  }

  return <div className="mx-auto max-w-3xl space-y-5">
    {diagnosis ? <ExperimentalDiagnosisSummary diagnosis={diagnosis} /> : <NoCurrentDiagnosis />}
    <section aria-labelledby="ihfr-management-heading" className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 id="ihfr-management-heading" className="text-lg font-semibold">Gerenciar diagnóstico IHFR experimental</h2>
      <p className="mt-1 text-sm text-slate-600">CONTRATO_EXPERIMENTAL · VALIDACAO_CIENTIFICA_PENDENTE · SUJEITO_A_RECALIBRACAO · NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Uso predominante da terra
          <select value={landUseType} onChange={(event) => setLandUseType(event.target.value as IHFRLandUseType | "")} className="mt-1 w-full rounded border p-2"><option value="">Indeterminado ou ausente</option>{landUseTypes.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        </label>
        <label className="block text-sm font-medium">Origem da observação
          <select value={provenanceKind} onChange={(event) => setProvenanceKind(event.target.value as typeof provenanceKind)} className="mt-1 w-full rounded border p-2"><option value="FIELD_OBSERVATION">Observação em campo</option><option value="AUTHORIZED_RECORD">Registro autorizado</option></select>
        </label>
        <label className="block text-sm font-medium">Data e hora da observação
          <input type="datetime-local" value={observedAt} onChange={(event) => setObservedAt(event.target.value)} className="mt-1 w-full rounded border p-2" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => void refreshEligibility()} className="rounded border px-4 py-2 disabled:opacity-50">Verificar elegibilidade</button><button type="button" disabled={busy || Boolean(attempt)} onClick={() => prepare("DIAGNOSE")} className="rounded bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{diagnosis ? "Substituir diagnóstico" : "Criar diagnóstico"}</button></div>
      {eligibility && <p className="mt-3 text-sm" role="status">{eligibility.outcome}{eligibility.reasons.length ? `: ${eligibility.reasons.join(", ")}` : ""} · Vigente: {eligibility.hasCurrentDiagnosis ? "sim" : "não"}</p>}
      {diagnosis && <div className="mt-5 border-t pt-4"><label className="block text-sm font-medium">Motivo da revogação
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} className="mt-1 w-full rounded border p-2" />
      </label><button type="button" disabled={busy || Boolean(attempt)} onClick={() => prepare("REVOKE")} className="mt-2 rounded bg-amber-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Revogar diagnóstico</button></div>}
      {feedback && <p ref={feedbackRef} tabIndex={-1} role={feedback.kind} aria-live={feedback.kind === "alert" ? "assertive" : "polite"} className="mt-4 rounded bg-slate-100 p-3 text-sm">{feedback.text}</p>}
      {attempt && unknown && <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => void recover()} className="rounded border px-4 py-2 disabled:opacity-50">Recuperar resultado</button><button type="button" disabled={busy} onClick={() => void send(attempt)} className="rounded border px-4 py-2 disabled:opacity-50">Repetir com a mesma chave</button></div>}
    </section>
    {confirmation && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div role="dialog" aria-modal="true" aria-labelledby="ihfr-confirm-title" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeConfirmation(); } else if (event.key === "Tab" && event.shiftKey && document.activeElement === dialogButton.current) { event.preventDefault(); confirmButton.current?.focus(); } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === confirmButton.current) { event.preventDefault(); dialogButton.current?.focus(); } }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 id="ihfr-confirm-title" className="text-lg font-bold">Confirmar {confirmation === "REVOKE" ? "revogação" : diagnosis ? "substituição" : "criação"}</h2><p className="mt-2 text-sm">Esta ação registrará uma operação IHFR experimental imutável.</p><div className="mt-5 flex justify-end gap-2"><button ref={dialogButton} type="button" onClick={() => closeConfirmation()} className="rounded border px-4 py-2">Cancelar</button><button ref={confirmButton} type="button" onClick={confirm} className="rounded bg-green-700 px-4 py-2 text-white">Confirmar</button></div></div></div>}
  </div>;
}

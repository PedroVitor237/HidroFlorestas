"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarIcon,
  CircleCheckBigIcon,
  FlaskConicalIcon,
  RefreshCw,
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { parseLaboratoriesEnvelope, type LaboratoryDetailsDto, type PublicLaboratoryDto } from "@/types/laboratory.type";

const CONNECTION_ERROR = "Não foi possível conectar ao servidor.";
const RESPONSE_ERROR = "O servidor enviou uma resposta inválida.";

export function LaboratoryWorkspace() {
  const [laboratories, setLaboratories] = useState<PublicLaboratoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<PublicLaboratoryDto | null>(null);
  const [details, setDetails] = useState<LaboratoryDetailsDto | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [riskAction, setRiskAction] = useState<"DEACTIVATE" | "DELETE" | null>(null);
  const [confirmationName, setConfirmationName] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/laboratories", { credentials: "include", cache: "no-store" });
      const result = parseLaboratoriesEnvelope(await response.json());
      if (!response.ok || !result?.success || !("laboratories" in result)) { setError(result && !result.success ? result.message : RESPONSE_ERROR); return; }
      setLaboratories(result.laboratories);
    } catch { setError(CONNECTION_ERROR); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 100) { setError("Informe um nome entre 1 e 100 caracteres."); nameInput.current?.focus(); return; }
    setSubmitting(true); setError(null); setFeedback(null);
    try {
      const response = await fetch("/api/laboratories", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: trimmed }) });
      const result = parseLaboratoriesEnvelope(await response.json());
      if (!response.ok || !result?.success || !("laboratory" in result)) { setError(result && !result.success ? result.message : RESPONSE_ERROR); return; }
      setName(""); setFeedback(`Laboratório “${result.laboratory.name}” criado com sucesso.`); await load();
    } catch { setError(CONNECTION_ERROR); } finally { setSubmitting(false); }
  }

  async function openSettings(laboratory: PublicLaboratoryDto) {
    setSelected(laboratory); setDetails(null); setRiskAction(null); setConfirmationName(""); setError(null); setSettingsLoading(true);
    try {
      const response = await fetch(`/api/laboratories/${laboratory.id}`, { credentials: "include", cache: "no-store" });
      const result = parseLaboratoriesEnvelope(await response.json());
      if (!response.ok || !result?.success || !("details" in result)) setError(result && !result.success ? result.message : RESPONSE_ERROR);
      else setDetails(result.details);
    } catch { setError(CONNECTION_ERROR); } finally { setSettingsLoading(false); }
  }

  function closeSettings() { if (!settingsLoading) { setSelected(null); setDetails(null); setRiskAction(null); setConfirmationName(""); } }

  async function executeRiskAction() {
    if (!selected || !riskAction || confirmationName !== selected.name || settingsLoading) return;
    setSettingsLoading(true); setError(null);
    try {
      const response = await fetch(`/api/laboratories/${selected.id}`, { method: riskAction === "DELETE" ? "DELETE" : "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmationName }) });
      const result = parseLaboratoriesEnvelope(await response.json());
      if (!response.ok || !result?.success || !("action" in result)) { setError(result && !result.success ? result.message : RESPONSE_ERROR); return; }
      setFeedback(riskAction === "DELETE" ? `Laboratório “${selected.name}” excluído.` : `Laboratório “${selected.name}” desativado.`);
      setSelected(null); setDetails(null); setRiskAction(null); setConfirmationName(""); await load();
    } catch { setError(CONNECTION_ERROR); } finally { setSettingsLoading(false); }
  }

  const atLimit = laboratories.length >= 5;
  const creationForm = (
    <form onSubmit={submit} className="mt-6 text-left">
      <label htmlFor="laboratory-name" className="block text-sm font-semibold text-white">
        Nome do laboratório
      </label>
      <input
        ref={nameInput}
        id="laboratory-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={100}
        required
        disabled={submitting || atLimit}
        placeholder="Ex.: Itapecuru-Mirim"
        className="mt-2 w-full rounded-xl border border-blue-300 bg-white px-4 py-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      <p className="mt-2 text-xs text-blue-100">Até cinco laboratórios. Nomes repetidos são permitidos.</p>
      <button
        type="submit"
        disabled={submitting || atLimit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        <FlaskConicalIcon aria-hidden="true" size={20} />
        {submitting ? "Criando…" : atLimit ? "Limite atingido" : "Criar laboratório"}
      </button>
    </form>
  );

  if (loading) {
    return (
      <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <RefreshCw aria-hidden="true" className="mx-auto animate-spin text-blue-600" size={36} />
        <p role="status" className="mt-4 text-slate-600">Carregando laboratórios…</p>
      </section>
    );
  }

  if (error && laboratories.length === 0) {
    return (
      <section className="mt-10 rounded-[30px] border border-red-200 bg-white p-10 text-center shadow-sm">
        <p role="alert" className="font-semibold text-red-800">Não foi possível carregar seus laboratórios.</p>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button type="button" onClick={() => void load()} className="mt-5 rounded-xl bg-red-700 px-5 py-3 font-bold text-white">
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="laboratories-title">
      {laboratories.length === 0 ? (
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="text-center">
            <h2 id="laboratories-title" className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Você ainda não participa de um laboratório.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Entre em um laboratório existente ou crie um novo para começar a utilizar todos os recursos da plataforma.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-green-600 p-5 text-center text-white">
              <UsersIcon className="mx-auto mb-5" size={45} />
              <h3 className="text-2xl font-bold">Entrar em um laboratório</h3>
              <p className="mt-3 text-green-100">Solicite participação em um laboratório já existente.</p>
              <p className="mt-6 rounded-xl bg-green-700/60 px-4 py-3 text-sm font-semibold">Disponível em uma próxima etapa</p>
            </div>

            <div className="rounded-3xl bg-blue-600 p-5 text-center text-white">
              <FlaskConicalIcon className="mx-auto mb-5" size={45} />
              <h3 className="text-2xl font-bold">Criar laboratório</h3>
              <p className="mt-3 text-blue-100">Seja responsável por um novo laboratório IHFR.</p>
              {creationForm}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-3xl bg-blue-600 p-5 text-white shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 id="laboratories-title" className="text-2xl font-bold">Seus laboratórios</h2>
                <p className="mt-1 text-blue-100">{laboratories.length} de 5 laboratórios utilizados</p>
              </div>
              <div className="w-full lg:max-w-md">{creationForm}</div>
            </div>
          </div>

          <ul className="space-y-6">
            {laboratories.map((laboratory, index) => (
              <li key={`${laboratory.name}-${laboratory.createdAt}-${index}`} className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col gap-10 xl:flex-row">
                    <div className="flex-1">
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 to-green-600 text-white shadow-lg">
                          <FlaskConicalIcon aria-hidden="true" size={38} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Laboratório IHFR</span>
                          <h3 style={{fontSize: 24}} className="mt-2 wrap-break-word text-[20px] font-black text-slate-800 sm:text-4xl">{laboratory.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-100 p-6">
                        <CalendarIcon aria-hidden="true" className="text-blue-600" />
                        <p className="mt-4 text-sm text-slate-500">Criado em</p>
                        <p className="mt-1 text-[20px] font-bold text-slate-800">
                          {new Intl.DateTimeFormat("pt-BR").format(new Date(laboratory.createdAt))}
                        </p>
                      </div>
                      <div className={laboratory.status === "ACTIVE" ? "rounded-2xl bg-green-50 p-6" : "rounded-2xl bg-slate-100 p-6"}>
                        <CircleCheckBigIcon aria-hidden="true" className={laboratory.status === "ACTIVE" ? "text-green-600" : "text-slate-500"} />
                        <p className="mt-4 text-sm text-slate-500">Status</p>
                        <span className={laboratory.status === "ACTIVE" ? "mt-2 inline-flex rounded-full bg-green-600 px-4 py-2 font-semibold text-white" : "mt-2 inline-flex rounded-full bg-slate-600 px-4 py-2 font-semibold text-white"}>
                          {laboratory.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col justify-end gap-4 sm:flex-row">
                    <button type="button" onClick={() => void openSettings(laboratory)} className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 px-7 py-4 font-semibold transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                      <SettingsIcon aria-hidden="true" size={20} />
                      Configurações
                    </button>
                    <Link href="/dashboard" className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-green-600 to-green-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02]">
                      ACESSAR LABORATÓRIO
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {feedback && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-800">{feedback}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="settings-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
              <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Configurações</p><h2 id="settings-title" className="mt-1 break-words text-2xl font-black text-slate-800">{selected.name}</h2></div>
              <button type="button" onClick={closeSettings} aria-label="Fechar configurações" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600"><XIcon aria-hidden="true" /></button>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              {settingsLoading && !details ? <p role="status" className="text-slate-600">Carregando informações…</p> : details && <>
                <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-slate-100 p-5"><p className="text-sm text-slate-500">Criado em</p><p className="mt-1 font-bold text-slate-800">{new Intl.DateTimeFormat("pt-BR").format(new Date(details.createdAt))}</p></div><div className="rounded-2xl bg-slate-100 p-5"><p className="text-sm text-slate-500">Status</p><p className="mt-1 font-bold text-slate-800">{details.status === "ACTIVE" ? "Ativo" : "Inativo"}</p></div></div>
                <div><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-slate-800">Membros</h3><span className="text-sm text-slate-500">{details.members.length}</span></div><ul className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 p-3">{details.members.map((member, index) => <li key={`${member.name}-${index}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"><span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700">{member.initials}</span><span className="break-words font-medium text-slate-800">{member.name}</span></li>)}</ul></div>

                {details.isOwner ? <div className="rounded-2xl border border-red-200 p-5"><h3 className="font-bold text-red-800">Zona de perigo</h3><p className="mt-1 text-sm text-slate-600">Estas ações só podem ser realizadas pela pessoa responsável.</p>{!riskAction ? <div className="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" disabled={details.status === "INACTIVE"} onClick={() => setRiskAction("DEACTIVATE")} className="rounded-xl border border-amber-500 px-4 py-3 font-bold text-amber-800 disabled:cursor-not-allowed disabled:opacity-50">Desativar laboratório</button><button type="button" onClick={() => setRiskAction("DELETE")} className="rounded-xl bg-red-700 px-4 py-3 font-bold text-white">Excluir laboratório</button></div> : <div className="mt-5 rounded-xl bg-red-50 p-4"><p className="text-sm text-red-900">Para {riskAction === "DELETE" ? "excluir permanentemente" : "desativar"}, digite <strong>{selected.name}</strong>.</p><label htmlFor="confirmation-name" className="mt-4 block text-sm font-semibold text-red-900">Nome do laboratório</label><input id="confirmation-name" value={confirmationName} onChange={(event) => setConfirmationName(event.target.value)} autoComplete="off" className="mt-2 w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"/><div className="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => { setRiskAction(null); setConfirmationName(""); }} className="rounded-xl border border-slate-300 px-4 py-3 font-semibold">Cancelar</button><button type="button" onClick={() => void executeRiskAction()} disabled={confirmationName !== selected.name || settingsLoading} className="rounded-xl bg-red-700 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{settingsLoading ? "Processando…" : riskAction === "DELETE" ? "Excluir permanentemente" : "Desativar laboratório"}</button></div></div>}</div> : <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">Somente a pessoa responsável pode alterar ou excluir este laboratório.</p>}
              </>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

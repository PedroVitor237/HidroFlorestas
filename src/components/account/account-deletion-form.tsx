"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth.context";
import { DELETION_MESSAGES, parseAccountDeletionState, type AccountDeletionState } from "@/app/api/server/accounts/deletion.contracts";
import { AccountShell, accountButtonClass } from "./account-shell";
import { PasswordField } from "./password-field";
import { readAccountJson } from "./account-client";

export function AccountDeletionForm() {
  const { clearAuthenticatedUser } = useAuth();
  const [state, setState] = useState<AccountDeletionState | null>(null);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [expired, setExpired] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/account-deletion", { credentials: "include", cache: "no-store", signal: controller.signal }).then(async response => {
      const value = parseAccountDeletionState(await readAccountJson(response));
      if (controller.signal.aborted) return;
      if (response.ok && value) setState(value);
      else { setExpired(response.status === 401); setError(response.status === 401 ? DELETION_MESSAGES.UNAUTHENTICATED : "Não foi possível consultar os vínculos. Atualize a página."); }
    }).catch(() => { if (!controller.signal.aborted) setError("Não foi possível conectar. Atualize a página."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !confirmed || !state?.canDelete) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/account-deletion", { method: "DELETE", credentials: "include", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: password, confirmDeletion: true }) });
      const value = await readAccountJson(response);
      if (response.ok && value && typeof value === "object" && "success" in value && value.success === true && Object.keys(value).length === 1) { clearAuthenticatedUser(); setDeleted(true); }
      else {
        const code = value && typeof value === "object" && "code" in value && typeof value.code === "string" ? value.code : "INTERNAL_ERROR";
        setError(Object.hasOwn(DELETION_MESSAGES, code) ? DELETION_MESSAGES[code as keyof typeof DELETION_MESSAGES] : DELETION_MESSAGES.INTERNAL_ERROR);
        setExpired(code === "UNAUTHENTICATED");
        // Re-fetch safe server counts if new links appeared after the initial GET.
        if (code === "ACCOUNT_LINKED") {
          const refreshed = await fetch("/api/auth/account-deletion", { cache: "no-store", credentials: "include" });
          const next = parseAccountDeletionState(await readAccountJson(refreshed));
          if (refreshed.ok && next) setState(next);
        }
      }
    } catch { setError("Não foi possível confirmar o resultado. Atualize a página antes de tentar novamente."); }
    finally { setPassword(""); setConfirmed(false); setBusy(false); inFlight.current = false; }
  }
  return <AccountShell title="Excluir minha conta" description="A exclusão é permanente. Seus acessos, códigos de verificação e links de recuperação deixarão de funcionar.">
    {deleted ? <p role="status">Sua conta foi excluída. <Link href="/login" className="font-semibold text-amber-800 underline">Ir para o login</Link></p> : <>
      {loading ? <p role="status">Consultando vínculos…</p> : null}
      {error ? <p ref={errorRef} tabIndex={-1} role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p> : null}
      {expired ? <Link href="/login" className="font-semibold text-amber-800 underline">Entrar novamente</Link> : null}
      {state && !expired ? <>
        {state.blockers.length ? <section aria-labelledby="deletion-links"><h2 id="deletion-links" className="font-semibold">Vínculos que impedem a exclusão</h2><ul className="my-3 list-disc space-y-2 pl-5">{state.blockers.map(item => <li key={item.code}>{item.label}{item.count === null ? "" : `: ${item.count}`}</li>)}</ul><p className="mb-5">Procure o responsável pelo laboratório ou pela administração para resolver esses vínculos. Registros científicos e históricos são preservados.</p></section> : <form onSubmit={submit} aria-busy={busy} className="space-y-5">
          <PasswordField id="deletion-password" label="Senha atual" current value={password} onChange={setPassword} disabled={busy} />
          <label className="flex items-start gap-3"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} required disabled={busy} className="mt-1 h-5 w-5 shrink-0" /><span>Confirmo que quero excluir permanentemente minha conta.</span></label>
          <button type="submit" disabled={busy || !confirmed} className={`${accountButtonClass} bg-red-700 hover:bg-red-800 focus:ring-red-800`}>{busy ? "Excluindo…" : "Excluir minha conta"}</button>
        </form>}
        <Link href={state.returnTo} className="mt-6 inline-block font-semibold text-amber-800 underline">Cancelar e voltar</Link>
      </> : null}
    </>}
  </AccountShell>;
}

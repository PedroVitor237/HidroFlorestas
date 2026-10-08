"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AccountShell, accountButtonClass, accountInputClass } from "./account-shell";
import { ACCOUNT_NETWORK_MESSAGE, ACCOUNT_RESPONSE_MESSAGE, parseAccountFailure, parseAccountMessage, readAccountJson, submitAccountRequest } from "./account-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const requestKey = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    requestKey.current ??= crypto.randomUUID();
    try {
      const response = await submitAccountRequest("/api/auth/password-reset/request", { email }, requestKey.current);
      const result = await readAccountJson(response);
      const success = parseAccountMessage(result);
      if (response.ok && success) { setMessage(success); requestKey.current = null; }
      else setError(parseAccountFailure(result)?.message ?? ACCOUNT_RESPONSE_MESSAGE);
    } catch { setError(ACCOUNT_NETWORK_MESSAGE); } finally { setBusy(false); }
  }

  return <AccountShell title="Recuperar senha" description="Informe seu e-mail para solicitar um link de recuperação.">
    <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      <div><label htmlFor="recovery-email" className="font-semibold">E-mail</label><input id="recovery-email" name="email" type="email" required autoComplete="email" value={email} disabled={busy} onChange={event => { setEmail(event.target.value); requestKey.current = null; setError(""); setMessage(""); }} className={accountInputClass} /></div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p> : null}
      {message ? <p role="status" aria-live="polite" className="rounded-lg bg-green-50 p-3 text-green-900">{message}</p> : null}
      <button type="submit" disabled={busy} className={accountButtonClass}>{busy ? "Aguarde…" : "Solicitar link de recuperação"}</button>
    </form>
    <p className="mt-5 text-sm text-gray-700">Você pode abrir o link em outro dispositivo. A solicitação preserva sua senha e seu acesso até a redefinição.</p>
    <Link href="/login" className="mt-6 inline-block font-semibold text-amber-800 underline">Voltar para o login</Link>
  </AccountShell>;
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth.context";
import { parseAuthEnvelope } from "@/types/auth.type";
import { AccountShell, accountButtonClass, accountInputClass } from "./account-shell";
import { ACCOUNT_NETWORK_MESSAGE, ACCOUNT_RESPONSE_MESSAGE, parseAccountFailure, parseVerificationState, readAccountJson, submitAccountRequest, type VerificationState } from "./account-client";

export function EmailVerificationForm() {
  const { fetchUserData, logout } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<VerificationState | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [now, setNow] = useState(0);
  const [retryAt, setRetryAt] = useState(0);
  const resendKey = useRef<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/email-verification", { credentials: "include", cache: "no-store", signal: controller.signal }).then(async response => {
      const result = await readAccountJson(response);
      if (controller.signal.aborted) return;
      const parsed = parseVerificationState(result);
      if (response.ok && parsed) { setState(parsed); setNow(Date.now()); }
      else { setError(parseAccountFailure(result)?.message ?? ACCOUNT_RESPONSE_MESSAGE); setSessionExpired(response.status === 401); }
    }).catch(() => { if (!controller.signal.aborted) setError(ACCOUNT_NETWORK_MESSAGE); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { controller.abort(); clearInterval(tick); };
  }, []);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  const availableAt = Math.max(state?.resendAvailableAt ? Date.parse(state.resendAvailableAt) : 0, retryAt);
  const waitSeconds = now ? Math.max(0, Math.ceil((availableAt - now) / 1000)) : (availableAt ? 60 : 0);
  const expired = !!state?.expiresAt && now > 0 && Date.parse(state.expiresAt) <= now;

  async function refreshState() {
    const response = await fetch("/api/auth/email-verification", { credentials: "include", cache: "no-store" });
    const value = await readAccountJson(response);
    const result = parseVerificationState(value);
    if (response.ok && result) { setState(result); setSessionExpired(false); }
    else { setError(parseAccountFailure(value)?.message ?? ACCOUNT_RESPONSE_MESSAGE); setSessionExpired(response.status === 401); }
  }

  async function retryState() {
    if (busy) return;
    setBusy(true); setError("");
    try { await refreshState(); } catch { setError(ACCOUNT_NETWORK_MESSAGE); } finally { setBusy(false); }
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !state?.challengeId) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await submitAccountRequest("/api/auth/email-verification/confirm", { challengeId: state.challengeId, code });
      const value = await readAccountJson(response);
      const result = parseAuthEnvelope(value);
      if (response.ok && result?.success && "user" in result && (result.destination === "/admin" || result.destination === "/workspace")) {
        setCode("");
        await fetchUserData({ force: true });
        router.replace(result.destination); router.refresh();
      } else {
        setError(parseAccountFailure(value)?.message ?? ACCOUNT_RESPONSE_MESSAGE);
        setSessionExpired(response.status === 401);
        await refreshState();
      }
    } catch { setError(ACCOUNT_NETWORK_MESSAGE); } finally { setBusy(false); }
  }

  async function resend() {
    if (busy || waitSeconds > 0) return;
    setBusy(true); setError(""); setMessage("");
    resendKey.current ??= crypto.randomUUID();
    try {
      const response = await submitAccountRequest("/api/auth/email-verification/resend", {}, resendKey.current);
      const value = await readAccountJson(response);
      const result = parseVerificationState(value);
      if (response.ok && result) {
        setState(result); setNow(Date.now()); setCode(""); resendKey.current = null;
        setMessage("Solicitação recebida. Confira o código mais recente no seu e-mail.");
      } else {
        const failure = parseAccountFailure(value);
        setError(failure?.message ?? ACCOUNT_RESPONSE_MESSAGE);
        if (failure?.retryAfterSeconds) setRetryAt(Date.now() + failure.retryAfterSeconds * 1000);
        setSessionExpired(response.status === 401);
      }
    } catch { setError(ACCOUNT_NETWORK_MESSAGE); } finally { setBusy(false); }
  }

  return <AccountShell title="Confirme seu e-mail" description="Digite o código de seis dígitos recebido por e-mail para continuar.">
    {!sessionExpired && state ? <Link href="/delete-account" className="mb-5 inline-block text-sm text-red-700 underline">Excluir minha conta</Link> : null}
    {loading ? <p role="status">Consultando sua verificação…</p> : null}
    {error ? <p ref={errorRef} tabIndex={-1} role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p> : null}
    {sessionExpired ? <p className="mb-5">Entre com seu e-mail e senha para retomar a verificação. <Link href="/login" className="font-semibold text-amber-800 underline">Ir para o login</Link></p> : null}
    {state?.status === "VERIFIED" ? <p role="status">Seu e-mail já foi confirmado. <Link href="/login" className="font-semibold text-amber-800 underline">Entre para continuar.</Link></p> : null}
    {state?.status === "PENDING" && !sessionExpired ? <>
      <form onSubmit={confirm} aria-busy={busy} className="space-y-5">
        <div><label htmlFor="verification-code" className="font-semibold">Código de verificação</label>
          <input id="verification-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" spellCheck={false} pattern="[0-9]{6}" maxLength={6} required disabled={busy} value={code} onChange={event => setCode(event.target.value)} aria-describedby="verification-help" className={`${accountInputClass} text-center text-2xl tracking-[.4em]`} />
        </div>
        <p id="verification-help" className="text-sm text-gray-700">{expired ? "O código expirou. Solicite um novo para continuar." : state.attemptsRemaining === 0 ? "O limite de tentativas foi atingido. Solicite um novo código." : "Você pode colar o código completo, incluindo zeros no início."}</p>
        <button type="submit" disabled={busy || expired || state.attemptsRemaining === 0 || !state.challengeId} className={accountButtonClass}>{busy ? "Aguarde…" : "Confirmar e-mail"}</button>
      </form>
      <button type="button" onClick={resend} disabled={busy || waitSeconds > 0} className="mt-5 w-full rounded-lg border border-amber-800 px-4 py-3 font-semibold text-amber-800 focus:ring-2 focus:ring-amber-700 disabled:cursor-not-allowed disabled:opacity-60">{waitSeconds > 0 ? `Reenviar código em ${waitSeconds} s` : "Reenviar código"}</button>
    </> : null}
    {message ? <p role="status" aria-live="polite" className="mt-4 text-green-800">{message}</p> : null}
    {!loading && !state && !sessionExpired ? <button type="button" disabled={busy} onClick={retryState} className="mt-4 font-semibold text-amber-800 underline">Tentar novamente</button> : null}
    <div className="mt-7 flex flex-wrap justify-between gap-3 text-sm"><Link href="/forgot-password" className="text-amber-800 underline">Esqueci minha senha</Link><button type="button" disabled={busy} onClick={() => { void logout(); }} className="text-amber-800 underline">Sair</button></div>
  </AccountShell>;
}

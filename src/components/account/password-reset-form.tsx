"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";
import { AccountShell, accountButtonClass } from "./account-shell";
import { PasswordField } from "./password-field";
import { ACCOUNT_NETWORK_MESSAGE, ACCOUNT_RESPONSE_MESSAGE, parseAccountFailure, parseAccountMessage, readAccountJson, submitAccountRequest } from "./account-client";

export function PasswordResetForm({ authenticated = false }: { authenticated?: boolean }) {
  const { clearAuthenticatedUser } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(authenticated);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [invalidProof, setInvalidProof] = useState(false);
  const captured = useRef<{ token: string | null } | null>(null);
  const proofGeneration = useRef(0);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (authenticated) return;
    function captureFragment() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const value = fragment.get("token");
      // The proof stays only in this component's memory, never in browser storage.
      window.history.replaceState(window.history.state, "", window.location.pathname);
      captured.current = { token: value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null };
    }
    if (!captured.current) captureFragment();
    const timeout = setTimeout(() => { setToken(captured.current?.token ?? null); setReady(true); }, 0);
    const onHashChange = () => {
      if (!window.location.hash) return;
      clearTimeout(timeout);
      captureFragment(); proofGeneration.current++;
      setToken(captured.current?.token ?? null); setReady(true); setBusy(false);
      setMessage(""); setError(""); setInvalidProof(false);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => { clearTimeout(timeout); window.removeEventListener("hashchange", onHashChange); };
  }, [authenticated]);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || (!authenticated && !token)) return;
    if (newPassword !== confirmPassword) { setError("A confirmação precisa ser igual à nova senha."); return; }
    if (Array.from(newPassword).length < 15) { setError("Use pelo menos 15 caracteres na nova senha."); return; }
    if (new TextEncoder().encode(newPassword).length > 72) { setError("A senha excede o limite de 72 bytes. Use uma frase um pouco mais curta; acentos e símbolos podem ocupar mais espaço."); return; }
    setBusy(true); setError("");
    const requestGeneration = proofGeneration.current;
    try {
      const response = await submitAccountRequest(authenticated ? "/api/auth/change-password" : "/api/auth/password-reset/confirm", authenticated ? { currentPassword, newPassword, confirmPassword } : { token, newPassword, confirmPassword });
      const result = await readAccountJson(response);
      if (requestGeneration !== proofGeneration.current) return;
      const success = parseAccountMessage(result);
      if (response.ok && success) {
        captured.current = { token: null };
        setToken(null); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        clearAuthenticatedUser(); setMessage(success);
        if (authenticated) { toast.success(success); router.replace("/login"); router.refresh(); }
      } else {
        const failure = parseAccountFailure(result);
        setError(failure?.message ?? ACCOUNT_RESPONSE_MESSAGE);
        if (failure?.code === "INVALID_PROOF") { captured.current = { token: null }; setInvalidProof(true); setToken(null); }
      }
    } catch {
      if (requestGeneration === proofGeneration.current) setError(ACCOUNT_NETWORK_MESSAGE);
    } finally {
      if (requestGeneration === proofGeneration.current) setBusy(false);
    }
  }

  return <AccountShell title={authenticated ? "Alterar senha" : "Definir nova senha"} description={authenticated ? "Confirme sua senha atual para escolher uma nova." : "Escolha uma senha nova e confirme para recuperar seu acesso."}>
    {!ready ? <p role="status">Preparando recuperação…</p> : null}
    {message ? <div role="status" aria-live="polite"><p className="rounded-lg bg-green-50 p-3 text-green-900">{message}</p><Link href="/login" className="mt-5 inline-block font-semibold text-amber-800 underline">Entrar com a nova senha</Link></div> : null}
    {error ? <p ref={errorRef} tabIndex={-1} role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-red-800">{error}</p> : null}
    {ready && !authenticated && !token && !message ? <div>
      <p>{invalidProof ? "Este link não pode ser usado. Solicite uma nova recuperação." : "Reabra o link original do e-mail para continuar. Ao recarregar esta página, o link permanece válido até expirar ou ser usado."}</p>
      <Link href="/forgot-password" className="mt-5 inline-block font-semibold text-amber-800 underline">Solicitar novo link</Link>
    </div> : null}
    {ready && (authenticated || token) && !message ? <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      {authenticated ? <PasswordField id="current-password" label="Senha atual" value={currentPassword} onChange={setCurrentPassword} current disabled={busy} /> : null}
      <PasswordField id="new-password" label="Nova senha" value={newPassword} onChange={setNewPassword} describedBy="new-password-help" disabled={busy} />
      <p id="new-password-help" className="text-sm text-gray-700">Use uma frase de pelo menos 15 caracteres, até 72 bytes. Acentos e símbolos podem ocupar mais espaço. Espaços são preservados.</p>
      <PasswordField id="confirm-password" label="Confirmar nova senha" value={confirmPassword} onChange={setConfirmPassword} disabled={busy} />
      <button type="submit" disabled={busy} className={accountButtonClass}>{busy ? "Aguarde…" : authenticated ? "Alterar senha" : "Redefinir senha"}</button>
    </form> : null}
    {!message ? <Link href={authenticated ? "/workspace" : "/login"} className="mt-6 inline-block font-semibold text-amber-800 underline">{authenticated ? "Voltar para o workspace" : "Voltar para o login"}</Link> : null}
  </AccountShell>;
}

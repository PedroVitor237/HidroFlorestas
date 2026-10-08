import { MailError, type MailContent, type RenderedMail, validateContent, validatePublicUrl } from "./contracts";

export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!); }

export function renderMail(content: MailContent, expiresAt: Date, publicUrl: string): RenderedMail {
  validateContent(content);
  const origin = validatePublicUrl(publicUrl);
  if (!Number.isFinite(expiresAt.getTime())) throw new MailError("INVALID_INPUT");
  const validity = expiresAt.toISOString();
  const greeting = `Olá, ${content.name || "participante"}.`;
  const subject = content.template === "email-verification-v1" ? "Confirme seu e-mail — HidroFlorestas" : "Recupere sua senha — HidroFlorestas";
  const preheader = "Solicitação de segurança da sua conta HidroFlorestas.";
  const ignore = "Se você não fez esta solicitação, ignore esta mensagem.";
  if (content.template === "email-verification-v1") {
    return { subject, text: `${greeting}\n\nSeu código de verificação é: ${content.code}\nVálido até ${validity} (UTC).\n\n${ignore}`, html: `<html lang="pt-BR"><body><span style="display:none">${preheader}</span><p>${escapeHtml(greeting)}</p><p>Seu código de verificação é:</p><p><strong>${content.code}</strong></p><p>Válido até ${validity} (UTC).</p><p>${ignore}</p></body></html>` };
  }
  if (content.template === "password-changed-v1") {
    const text = "A senha da sua conta HidroFlorestas foi alterada. As sessões anteriores foram encerradas. Se você não fez esta alteração, solicite a recuperação de senha pela página de login.";
    return { subject: "Sua senha foi alterada — HidroFlorestas", text: `${greeting}\n\n${text}`, html: `<html lang="pt-BR"><body><p>${escapeHtml(greeting)}</p><p>${text}</p></body></html>` };
  }
  // The reset page captures/removes the fragment before third-party content.
  const url = new URL("/reset-password", origin);
  url.hash = `token=${content.token}`;
  return { subject, text: `${greeting}\n\nPara recuperar sua senha, acesse:\n${url.href}\nVálido até ${validity} (UTC).\n\n${ignore}`, html: `<html lang="pt-BR"><body><span style="display:none">${preheader}</span><p>${escapeHtml(greeting)}</p><p><a href="${escapeHtml(url.href)}">Recuperar minha senha</a></p><p>Válido até ${validity} (UTC).</p><p>${ignore}</p></body></html>` };
}

import "server-only";
import { MailError, validateMailbox, validatePublicUrl } from "./contracts";

export type MailConfig = { host: string; port: 465 | 587; secure: boolean; requireTLS: boolean; user: string; password: string; from: string; publicUrl: string };

// Lazy: import/build do not validate credentials or open sockets.
export function readMailConfig(env: Record<string, string | undefined> = process.env): MailConfig {
  try {
    if (env.SMTP_HOST !== "smtp.gmail.com" || !["465", "587"].includes(env.SMTP_PORT ?? "") || !["true", "false"].includes(env.SMTP_SECURE ?? "") || !["true", "false"].includes(env.SMTP_REQUIRE_TLS ?? "")) throw new Error();
    const port = Number(env.SMTP_PORT) as 465 | 587;
    const secure = env.SMTP_SECURE === "true";
    const requireTLS = env.SMTP_REQUIRE_TLS === "true";
    if (secure !== (port === 465) || !requireTLS) throw new Error();
    validateMailbox(env.SMTP_USER);
    validateMailbox(env.MAIL_FROM);
    // A display-name/header is deliberately not accepted in this foundation.
    if (env.MAIL_FROM !== env.SMTP_USER || !env.SMTP_APP_PASSWORD || !/^[A-Za-z0-9 ]{16,32}$/.test(env.SMTP_APP_PASSWORD) || !/^[A-Za-z0-9]{16}$/.test(env.SMTP_APP_PASSWORD.replaceAll(" ", ""))) throw new Error();
    return { host: env.SMTP_HOST, port, secure, requireTLS, user: env.SMTP_USER, password: env.SMTP_APP_PASSWORD.replaceAll(" ", ""), from: env.MAIL_FROM, publicUrl: validatePublicUrl(env.APP_PUBLIC_URL) };
  } catch { throw new MailError("CONFIGURATION"); }
}

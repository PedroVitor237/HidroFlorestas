import "server-only";
import nodemailer from "nodemailer";
import type { SMTPTransportOptions } from "nodemailer/lib/smtp-transport";
import net from "node:net";
import tls from "node:tls";
import { MAIL_POLICY, MailError, type FailureClass, type MailTransport, validateMailbox } from "./contracts";
import type { MailConfig } from "./config";

export function classifyMailFailure(error: unknown): FailureClass {
  if (error instanceof MailError) return error.code === "INVALID_INPUT" || error.code === "IDEMPOTENCY_CONFLICT" ? "PAYLOAD" : error.code;
  const safe = error as { code?: string; responseCode?: number; cause?: { code?: string } } | null;
  const code = safe?.code ?? safe?.cause?.code ?? "";
  if (/TLS|CERT|SELF_SIGNED|UNABLE_TO_VERIFY|DEPTH_ZERO/.test(code)) return "TLS";
  if (safe?.responseCode === 454) return "TEMPORARY";
  if (code === "EAUTH") return "AUTHENTICATION";
  if (code === "ETIMEDOUT") return "TIMEOUT";
  if ((safe?.responseCode ?? 0) >= 500) return "PERMANENT";
  if ((safe?.responseCode ?? 0) >= 400) return "TEMPORARY";
  if (["EDNS", "ECONNECTION", "ESOCKET", "ECONNRESET", "ECONNREFUSED", "EAI_AGAIN", "ENOTFOUND"].includes(code)) return "CONNECTION";
  return "UNKNOWN";
}

export const retryableMailFailure = (failure: FailureClass) => ["CONNECTION", "TIMEOUT", "TEMPORARY"].includes(failure);

type SmtpSettings = Pick<MailConfig, "host" | "secure" | "requireTLS" | "user" | "password" | "from"> & { port: number; ca?: string; servername?: string; deadlineMs?: number };

// Proof validity and the claim's operational deadline remain separate inputs.
export function smtpDeadlineAt(expiresAt: Date, deadlineAt: Date, startedMs: number, maximumMs: number = MAIL_POLICY.smtpDeadlineMs): number {
  if (!(expiresAt instanceof Date) || !(deadlineAt instanceof Date) || ![expiresAt.getTime(), deadlineAt.getTime(), startedMs, maximumMs].every(Number.isFinite) || maximumMs < 1 || maximumMs > MAIL_POLICY.smtpDeadlineMs) throw new MailError("INVALID_INPUT");
  if (expiresAt.getTime() <= startedMs) throw new MailError("PERMANENT");
  if (deadlineAt.getTime() <= startedMs) throw new MailError("TIMEOUT");
  return Math.min(startedMs + maximumMs, expiresAt.getTime(), deadlineAt.getTime());
}

// Test harness can target loopback with a trusted test CA. Production only passes validated Gmail config.
export function createSmtpTransport(settings: SmtpSettings): MailTransport & { verify: () => Promise<void> } {
  if (settings.requireTLS !== true || !Number.isInteger(settings.port) || settings.port < 1 || settings.port > 65535 || (settings.deadlineMs !== undefined && (!Number.isFinite(settings.deadlineMs) || settings.deadlineMs < 1 || settings.deadlineMs > MAIL_POLICY.smtpDeadlineMs))) throw new MailError("CONFIGURATION");
  validateMailbox(settings.from);

  async function connectAndRun(perform: (mailer: ReturnType<typeof nodemailer.createTransport>) => Promise<unknown>, validity?: { expiresAt: Date; deadlineAt: Date }) {
    let socket: net.Socket | undefined;
    let expired = false;
    const startedMs = Date.now(), maximumMs = settings.deadlineMs ?? MAIL_POLICY.smtpDeadlineMs;
    const until = validity ? smtpDeadlineAt(validity.expiresAt, validity.deadlineAt, startedMs, maximumMs) : startedMs + maximumMs;
    const options: SMTPTransportOptions = {
      host: settings.host, port: settings.port, secure: settings.secure, requireTLS: true, ignoreTLS: false, opportunisticTLS: false,
      auth: { user: settings.user, pass: settings.password },
      tls: { rejectUnauthorized: true, minVersion: "TLSv1.2", servername: settings.servername ?? settings.host, ...(settings.ca ? { ca: settings.ca } : {}) },
      connectionTimeout: 8_000, greetingTimeout: 5_000, socketTimeout: 8_000, dnsTimeout: 5_000,
      disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
      getSocket(_options, callback) {
        // Check the absolute clock too: an event-loop pause may delay the timer callback.
        if (expired || Date.now() >= until) { callback(new MailError("TIMEOUT"), false); return; }
        let returned = false;
        const deliver = (error: Error | null) => {
          if (returned) return;
          returned = true;
          if (!error && Date.now() >= until) { socket?.destroy(); callback(new MailError("TIMEOUT"), false); return; }
          callback(error, error ? false : { connection: socket!, secured: settings.secure });
        };
        socket = settings.secure
          ? tls.connect({ host: settings.host, port: settings.port, rejectUnauthorized: true, minVersion: "TLSv1.2", servername: settings.servername ?? settings.host, ...(settings.ca ? { ca: settings.ca } : {}) }, () => deliver(null))
          : net.connect({ host: settings.host, port: settings.port }, () => deliver(null));
        socket.once("error", (error) => deliver(error));
      },
    };
    const mailer = nodemailer.createTransport(options);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => { expired = true; socket?.destroy(); mailer.close(); reject(new MailError("TIMEOUT")); }, Math.max(0, until - Date.now()));
    });
    try {
      // Destroying the owned socket ends SMTP too; this is not an abandoned background promise.
      await Promise.race([perform(mailer), deadline]);
      if (Date.now() >= until) throw new MailError("TIMEOUT");
    } catch (error) { throw new MailError(expired ? "TIMEOUT" : classifyMailFailure(error)); }
    finally { if (timer) clearTimeout(timer); socket?.destroy(); mailer.close(); }
  }

  return {
    async send({ outboxId, recipient, message, expiresAt, deadlineAt }) {
      validateMailbox(recipient);
      if (!/^[0-9a-f-]{36}$/.test(outboxId)) throw new MailError("INVALID_INPUT");
      await connectAndRun(async (mailer) => {
        const result = await mailer.sendMail({ from: settings.from, to: recipient, subject: message.subject, html: message.html, text: message.text,
          messageId: `<${outboxId}@hidroflorestas.invalid>`, envelope: { from: settings.from, to: [recipient] }, disableFileAccess: true, disableUrlAccess: true });
        if (result.rejected?.length || result.accepted?.length !== 1) throw new MailError("PERMANENT");
      }, { expiresAt, deadlineAt });
    },
    async verify() { await connectAndRun((mailer) => mailer.verify()); },
  };
}

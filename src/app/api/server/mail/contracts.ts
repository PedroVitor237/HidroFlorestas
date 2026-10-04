export const MAIL_POLICY = Object.freeze({ batchSize: 4, concurrency: 2, leaseMs: 90_000, smtpDeadlineMs: 15_000, leaseSafetyMs: 2_000, maxAttempts: 5, retentionMs: 7 * 86_400_000 });

export type TemplateName = "email-verification-v1" | "password-reset-v1";
export type MailContent = { template: "email-verification-v1"; name: string; code: string }
  | { template: "password-reset-v1"; name: string; token: string };
export type EnqueueMailInput = { idempotencyKey: string; recipient: string; content: MailContent; expiresAt: Date; challengeId?: string };
export type ProtectedMailPayload = { recipient: string; content: MailContent; publicUrl: string };
export type RenderedMail = { subject: string; html: string; text: string };
export type MailTransport = { send: (input: { outboxId: string; recipient: string; message: RenderedMail; expiresAt: Date; deadlineAt: Date }) => Promise<void> };
export type FailureClass = "CONFIGURATION" | "AUTHENTICATION" | "TLS" | "CONNECTION" | "TIMEOUT" | "TEMPORARY" | "PERMANENT" | "PAYLOAD" | "UNKNOWN";

export class MailError extends Error {
  constructor(public readonly code: FailureClass | "INVALID_INPUT" | "IDEMPOTENCY_CONFLICT") { super(code); this.name = "MailError"; }
}

export function validateMailbox(value: unknown): asserts value is string {
  if (typeof value !== "string" || value.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?$/.test(value)) throw new MailError("INVALID_INPUT");
}

function exactKeys(value: object, allowed: string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new MailError("INVALID_INPUT");
}

export function validateContent(value: MailContent) {
  if (!value || typeof value !== "object" || typeof value.name !== "string" || value.name.length > 100 || /[\r\n\u0000]/.test(value.name)) throw new MailError("INVALID_INPUT");
  if (value.template === "email-verification-v1") {
    exactKeys(value, ["template", "name", "code"]);
    if (typeof value.code !== "string" || !/^[0-9]{6}$/.test(value.code)) throw new MailError("INVALID_INPUT");
  } else if (value.template === "password-reset-v1") {
    exactKeys(value, ["template", "name", "token"]);
    if (typeof value.token !== "string" || !/^[A-Za-z0-9_-]{43,128}$/.test(value.token)) throw new MailError("INVALID_INPUT");
  } else throw new MailError("INVALID_INPUT");
}

export function validatePublicUrl(value: unknown): string {
  if (typeof value !== "string") throw new MailError("CONFIGURATION");
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error();
    return url.origin;
  } catch { throw new MailError("CONFIGURATION"); }
}

export function validateEnqueue(input: EnqueueMailInput, now: Date, allowExpired = false) {
  if (!input || typeof input !== "object") throw new MailError("INVALID_INPUT");
  exactKeys(input, ["idempotencyKey", "recipient", "content", "expiresAt", "challengeId"]);
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(input.idempotencyKey) || (input.challengeId !== undefined && !/^[0-9a-f-]{36}$/.test(input.challengeId))) throw new MailError("INVALID_INPUT");
  validateMailbox(input.recipient);
  validateContent(input.content);
  if (!(input.expiresAt instanceof Date) || !Number.isFinite(input.expiresAt.getTime()) || !Number.isFinite(now.getTime()) || (!allowExpired && input.expiresAt <= now)) throw new MailError("INVALID_INPUT");
}

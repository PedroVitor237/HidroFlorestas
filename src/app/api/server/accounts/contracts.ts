export type AccountErrorCode = "INVALID_REQUEST" | "INVALID_CREDENTIALS" | "UNAUTHENTICATED" | "INVALID_PROOF" | "RATE_LIMITED" | "ACCOUNT_EXISTS" | "IDEMPOTENCY_CONFLICT" | "PROVIDER_UNAVAILABLE" | "INTERNAL_ERROR" | "FORBIDDEN";
export class AccountError extends Error {
  constructor(public readonly code: AccountErrorCode, public readonly retryAfterSeconds?: number) { super(code); this.name = "AccountError"; }
}
export const ACCOUNT_MESSAGES = {
  INVALID_REQUEST: "Confira os campos. Use senha com pelo menos 15 caracteres e no máximo 72 bytes UTF-8.",
  INVALID_CREDENTIALS: "Email ou senha inválidos.",
  UNAUTHENTICATED: "Faça login novamente para continuar.",
  INVALID_PROOF: "Código ou link inválido, vencido ou já utilizado. Solicite outro.",
  RATE_LIMITED: "Aguarde antes de tentar novamente.",
  ACCOUNT_EXISTS: "Não foi possível criar esta conta. Entre ou recupere sua senha.",
  IDEMPOTENCY_CONFLICT: "A solicitação mudou. Inicie uma nova tentativa.",
  PROVIDER_UNAVAILABLE: "Não foi possível receber a solicitação agora. Tente novamente.",
  INTERNAL_ERROR: "Não foi possível concluir a solicitação.",
  FORBIDDEN: "Solicitação não permitida.",
} as const;
export const RESET_REQUEST_MESSAGE = "Se a conta puder receber a mensagem, confira seu e-mail.";
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function exactObject(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) || Object.keys(value).sort().join() !== [...keys].sort().join()) throw new AccountError("INVALID_REQUEST");
  return value as Record<string, unknown>;
}
export function normalizeEmail(value: unknown): { factual: string; canonical: string } {
  if (typeof value !== "string") throw new AccountError("INVALID_REQUEST");
  const factual = value.trim();
  if (factual.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(factual)) throw new AccountError("INVALID_REQUEST");
  return { factual, canonical: factual.toLowerCase() };
}
export function validateNewPassword(value: unknown): asserts value is string {
  if (typeof value !== "string" || !value.trim() || [...value].length < 15 || new TextEncoder().encode(value).length > 72 || value.includes("\0") || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value)) throw new AccountError("INVALID_REQUEST");
}
export function validatePasswordConfirmation(password: unknown, confirmation: unknown): asserts password is string {
  validateNewPassword(password);
  if (password !== confirmation) throw new AccountError("INVALID_REQUEST");
}
export function parseSignup(value: unknown) {
  const body = exactObject(value, ["firstName", "lastName", "email", "password"]);
  const email = normalizeEmail(body.email);
  validateNewPassword(body.password);
  if (typeof body.firstName !== "string" || typeof body.lastName !== "string" || !body.firstName.trim() || !body.lastName.trim() || body.firstName.trim().length > 100 || body.lastName.trim().length > 100 || /[\r\n\u0000]/.test(body.firstName + body.lastName)) throw new AccountError("INVALID_REQUEST");
  return { firstName: body.firstName.trim(), lastName: body.lastName.trim(), email: email.factual, emailCanonical: email.canonical, password: body.password };
}
export function requireIdempotencyKey(value: unknown): string {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) throw new AccountError("INVALID_REQUEST");
  return value.toLowerCase();
}
export type VerificationState = { success: true; status: "PENDING" | "VERIFIED"; challengeId: string | null; expiresAt: string | null; resendAvailableAt: string | null; attemptsRemaining: number };

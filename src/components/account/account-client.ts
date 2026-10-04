import { parseAuthEnvelope, type AuthFailure } from "@/types/auth.type";

export type VerificationState = {
  success: true;
  status: "PENDING" | "VERIFIED";
  challengeId: string | null;
  expiresAt: string | null;
  resendAvailableAt: string | null;
  attemptsRemaining: number;
};

export function parseVerificationState(value: unknown): VerificationState | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const allowed = new Set(["success", "status", "challengeId", "expiresAt", "resendAvailableAt", "attemptsRemaining", "message"]);
  if (Object.keys(data).some(key => !allowed.has(key)) || data.success !== true ||
      (data.status !== "PENDING" && data.status !== "VERIFIED") ||
      (data.challengeId !== null && typeof data.challengeId !== "string") ||
      !dateOrNull(data.expiresAt) || !dateOrNull(data.resendAvailableAt) ||
      typeof data.attemptsRemaining !== "number" || !Number.isInteger(data.attemptsRemaining) || data.attemptsRemaining < 0 ||
      ("message" in data && typeof data.message !== "string")) return null;
  return { success: true, status: data.status, challengeId: data.challengeId, expiresAt: data.expiresAt, resendAvailableAt: data.resendAvailableAt, attemptsRemaining: data.attemptsRemaining };
}

function dateOrNull(value: unknown): value is string | null {
  return value === null || (typeof value === "string" && Number.isFinite(Date.parse(value)));
}

export function parseAccountFailure(value: unknown): AuthFailure | null {
  const result = parseAuthEnvelope(value);
  return result?.success === false ? result : null;
}

export function parseAccountMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  return data.success === true && typeof data.message === "string" && Object.keys(data).length === 2 ? data.message : null;
}

export async function readAccountJson(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

export async function submitAccountRequest(path: string, body: unknown, idempotencyKey?: string) {
  return fetch(path, {
    method: "POST", credentials: "include", cache: "no-store",
    headers: { "Content-Type": "application/json", ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) },
    body: JSON.stringify(body),
  });
}

export const ACCOUNT_NETWORK_MESSAGE = "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.";
export const ACCOUNT_RESPONSE_MESSAGE = "Não foi possível concluir a solicitação. Tente novamente.";

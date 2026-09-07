import type { LaboratoriesEnvelope, LaboratoryFailureCode, PublicLaboratoryDto } from "@/types/laboratory.type";

export type CreateLaboratoryInput = { name: string };
export type LaboratoryPublicSource = { name: string; createdAt: Date; isActive: boolean };

export const LABORATORY_MESSAGES = {
  invalidRequest: "Informe um nome de laboratório válido.",
  unauthenticated: "Não autenticado. Faça login novamente.",
  limitReached: "Você já atingiu o limite de cinco laboratórios.",
  conflict: "Não foi possível concluir devido a uma atualização concorrente. Tente novamente.",
  internalError: "Não foi possível concluir a solicitação.",
} as const;

export function laboratoryFailure(
  code: LaboratoryFailureCode,
  message: string,
): Extract<LaboratoriesEnvelope, { success: false }> {
  return { success: false, code, message };
}

export function parseCreateLaboratoryInput(input: unknown):
  | { success: true; data: CreateLaboratoryInput }
  | { success: false; failure: Extract<LaboratoriesEnvelope, { success: false }> } {
  const invalid = () => ({
    success: false as const,
    failure: laboratoryFailure("INVALID_REQUEST", LABORATORY_MESSAGES.invalidRequest),
  });
  if (typeof input !== "object" || input === null || Array.isArray(input)) return invalid();
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) return invalid();
  const value = input as Record<string, unknown>;
  if (Object.keys(value).length !== 1 || !("name" in value) || typeof value.name !== "string") return invalid();
  const name = value.name.trim();
  if (name.length < 1 || name.length > 100) return invalid();
  return { success: true, data: { name } };
}

export function serializePublicLaboratory(source: LaboratoryPublicSource): PublicLaboratoryDto {
  return {
    name: source.name,
    createdAt: source.createdAt.toISOString(),
    status: source.isActive ? "ACTIVE" : "INACTIVE",
  };
}

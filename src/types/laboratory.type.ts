export type PublicLaboratoryDto = {
  name: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
};

export type LaboratoryFailureCode =
  | "INVALID_REQUEST"
  | "UNAUTHENTICATED"
  | "LABORATORY_LIMIT_REACHED"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type LaboratoriesEnvelope =
  | { success: true; laboratories: PublicLaboratoryDto[] }
  | { success: true; laboratory: PublicLaboratoryDto }
  | { success: false; code: LaboratoryFailureCode; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function parseLaboratory(value: unknown): PublicLaboratoryDto | null {
  if (!isRecord(value) || !hasExactKeys(value, ["name", "createdAt", "status"])) return null;
  if (
    typeof value.name !== "string" ||
    typeof value.createdAt !== "string" ||
    (value.status !== "ACTIVE" && value.status !== "INACTIVE")
  ) return null;
  return { name: value.name, createdAt: value.createdAt, status: value.status };
}

const FAILURE_CODES = new Set<LaboratoryFailureCode>([
  "INVALID_REQUEST", "UNAUTHENTICATED", "LABORATORY_LIMIT_REACHED", "CONFLICT", "INTERNAL_ERROR",
]);

export function parseLaboratoriesEnvelope(value: unknown): LaboratoriesEnvelope | null {
  if (!isRecord(value) || typeof value.success !== "boolean") return null;
  if (value.success) {
    if (hasExactKeys(value, ["success", "laboratories"]) && Array.isArray(value.laboratories)) {
      const laboratories = value.laboratories.map(parseLaboratory);
      return laboratories.every(Boolean)
        ? { success: true, laboratories: laboratories as PublicLaboratoryDto[] }
        : null;
    }
    if (hasExactKeys(value, ["success", "laboratory"])) {
      const laboratory = parseLaboratory(value.laboratory);
      return laboratory ? { success: true, laboratory } : null;
    }
    return null;
  }
  if (
    !hasExactKeys(value, ["success", "code", "message"]) ||
    typeof value.code !== "string" ||
    !FAILURE_CODES.has(value.code as LaboratoryFailureCode) ||
    typeof value.message !== "string"
  ) return null;
  return { success: false, code: value.code as LaboratoryFailureCode, message: value.message };
}

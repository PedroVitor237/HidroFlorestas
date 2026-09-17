export type PublicLaboratoryDto = {
  id: string;
  name: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
  isOwner: boolean;
};

export type LaboratoryMemberDto = {
  name: string;
  initials: string;
};

export type LaboratoryDetailsDto = PublicLaboratoryDto & {
  members: LaboratoryMemberDto[];
};

export type LaboratoryMembershipRole = "OWNER" | "ADMIN" | "MEMBER";

export type LaboratoryContextDto = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  membershipRole: LaboratoryMembershipRole;
  readOnly: boolean;
};

export type LaboratoryMembershipDto = {
  id: string;
  name: string;
  initials: string;
  role: LaboratoryMembershipRole;
};

export type LaboratoryFailureCode =
  | "INVALID_REQUEST"
  | "UNAUTHENTICATED"
  | "LABORATORY_LIMIT_REACHED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFIRMATION_MISMATCH"
  | "LABORATORY_HAS_DATA"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type LaboratoriesEnvelope =
  | { success: true; laboratories: PublicLaboratoryDto[] }
  | { success: true; laboratory: PublicLaboratoryDto }
  | { success: true; details: LaboratoryDetailsDto }
  | { success: true; action: "DEACTIVATED" | "DELETED" }
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
  if (!isRecord(value) || !hasExactKeys(value, ["id", "name", "createdAt", "status", "isOwner"])) return null;
  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.isOwner !== "boolean" ||
    (value.status !== "ACTIVE" && value.status !== "INACTIVE")
  ) return null;
  return { id: value.id, name: value.name, createdAt: value.createdAt, status: value.status, isOwner: value.isOwner };
}

const FAILURE_CODES = new Set<LaboratoryFailureCode>([
  "INVALID_REQUEST", "UNAUTHENTICATED", "LABORATORY_LIMIT_REACHED", "FORBIDDEN", "NOT_FOUND",
  "CONFIRMATION_MISMATCH", "LABORATORY_HAS_DATA", "CONFLICT", "INTERNAL_ERROR",
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
    if (hasExactKeys(value, ["success", "details"])) {
      const details = value.details;
      if (!isRecord(details) || !Array.isArray(details.members)) return null;
      const laboratory = parseLaboratory(Object.fromEntries(Object.entries(details).filter(([key]) => key !== "members")));
      const members = details.members.map((member) => isRecord(member) && hasExactKeys(member, ["name", "initials"]) && typeof member.name === "string" && typeof member.initials === "string" ? { name: member.name, initials: member.initials } : null);
      return laboratory && members.every(Boolean) ? { success: true, details: { ...laboratory, members: members as LaboratoryMemberDto[] } } : null;
    }
    if (hasExactKeys(value, ["success", "action"]) && (value.action === "DEACTIVATED" || value.action === "DELETED")) {
      return { success: true, action: value.action };
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

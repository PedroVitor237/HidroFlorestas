import type { AuthenticatedPrincipal } from "../auth/auth.core";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "../lib/prisma";

export type ContextRole = "OWNER" | "ADMIN" | "MEMBER";
export type LaboratoryContext = { id: string; name: string; status: "ACTIVE" | "INACTIVE"; membershipRole: ContextRole; readOnly: boolean };
export type AreaPermission = "READ_AREAS" | "CREATE_AREA" | "MANAGE_ROLES" | "CREATE_COLLECTION" | "READ_ENVIRONMENTAL_DATA" | "CREATE_ENVIRONMENTAL_DATA" | "READ_IHFR_DIAGNOSIS" | "MANAGE_IHFR_DIAGNOSIS";
export type AreaErrorCode = "UNAUTHENTICATED" | "NOT_FOUND" | "FORBIDDEN" | "READ_ONLY" | "INVALID_INPUT" | "CONFLICT" | "INTERNAL_ERROR";
export class AreaAccessError extends Error {
  constructor(public readonly code: AreaErrorCode) { super(code); }
}
export const validResourceId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
export function assertLaboratoryPermission(role: ContextRole, active: boolean, permission: AreaPermission, mutate = false) {
  if (mutate && !active) throw new AreaAccessError("READ_ONLY");
  if ((permission === "MANAGE_ROLES" && role !== "OWNER") || ((permission === "CREATE_AREA" || permission === "MANAGE_IHFR_DIAGNOSIS") && role === "MEMBER")) throw new AreaAccessError("FORBIDDEN");
}
export async function authorizeLaboratoryAccess(principal: Pick<AuthenticatedPrincipal, "id">, laboratoryId: string, permission: AreaPermission, db: Prisma.TransactionClient = prisma, mutate = false): Promise<LaboratoryContext> {
  const user = await db.user.findUnique({ where: { id: principal.id }, select: { status: true } });
  if (!user || user.status !== "ACTIVE") throw new AreaAccessError("UNAUTHENTICATED");
  if (!validResourceId(laboratoryId)) throw new AreaAccessError("NOT_FOUND");
  const link = await db.researchersLinked.findUnique({ where: { userId_laboratoryRoomId: { userId: principal.id, laboratoryRoomId: laboratoryId } }, select: { role: true, laboratoryRoom: { select: { id: true, name: true, isActive: true } } } });
  if (!link) throw new AreaAccessError("NOT_FOUND");
  const lab = link.laboratoryRoom;
  assertLaboratoryPermission(link.role, lab.isActive, permission, mutate);
  return { id: lab.id, name: lab.name, status: lab.isActive ? "ACTIVE" : "INACTIVE", membershipRole: link.role, readOnly: !lab.isActive };
}

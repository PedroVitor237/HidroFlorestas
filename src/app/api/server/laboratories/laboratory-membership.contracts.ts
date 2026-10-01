import type { ContextRole } from "../areas/area.authorization";
export type MembershipChange = { expectedRole: "ADMIN" | "MEMBER"; role: "ADMIN" | "MEMBER" };
export type MembershipDto = { id: string; name: string; initials: string; role: ContextRole };
export function parseMembershipChange(value: unknown): MembershipChange | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (Object.keys(body).sort().join(",") !== "expectedRole,role") return null;
  if ((body.expectedRole !== "MEMBER" && body.expectedRole !== "ADMIN") || (body.role !== "MEMBER" && body.role !== "ADMIN") || body.role === body.expectedRole) return null;
  return { expectedRole: body.expectedRole, role: body.role };
}
export function serializeMembership(source: { id: string; role: ContextRole; user: { firstName: string; lastName: string } }): MembershipDto {
  return { id: source.id, role: source.role, name: `${source.user.firstName} ${source.user.lastName}`.trim(), initials: `${source.user.firstName.charAt(0)}${source.user.lastName.charAt(0)}`.toUpperCase() || "?" };
}

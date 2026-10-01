import type { PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { AreaAccessError, authorizeLaboratoryAccess, validResourceId } from "../areas/area.authorization";
import { serializeMembership, type MembershipChange } from "../laboratories/laboratory-membership.contracts";
const memberSelect = { id: true, role: true, user: { select: { firstName: true, lastName: true } } } as const;
export class LaboratoryMembershipsService {
  constructor(private readonly db: PrismaClient = prisma) {}
  async list(userId: string, laboratoryId: string) {
    return this.db.$transaction(async (tx) => {
      const context = await authorizeLaboratoryAccess({ id: userId }, laboratoryId, "MANAGE_ROLES", tx);
      const memberships = await tx.researchersLinked.findMany({ where: { laboratoryRoomId: laboratoryId }, orderBy: { id: "asc" }, select: memberSelect });
      return { context, memberships: memberships.map(serializeMembership) };
    });
  }
  async change(userId: string, laboratoryId: string, membershipId: string, input: MembershipChange) {
    return this.db.$transaction(async (tx) => {
      await authorizeLaboratoryAccess({ id: userId }, laboratoryId, "MANAGE_ROLES", tx, true);
      if (!validResourceId(membershipId)) throw new AreaAccessError("NOT_FOUND");
      const current = await tx.researchersLinked.findFirst({ where: { id: membershipId, laboratoryRoomId: laboratoryId }, select: memberSelect });
      if (!current) throw new AreaAccessError("NOT_FOUND");
      if (current.role === "OWNER") throw new AreaAccessError("FORBIDDEN");
      const changed = await tx.researchersLinked.updateMany({ where: { id: membershipId, laboratoryRoomId: laboratoryId, role: input.expectedRole }, data: { role: input.role } });
      if (changed.count !== 1) throw new AreaAccessError("CONFLICT");
      return { membership: serializeMembership({ ...current, role: input.role }) };
    }, { isolationLevel: "Serializable" });
  }
}
export const laboratoryMembershipsService = new LaboratoryMembershipsService();

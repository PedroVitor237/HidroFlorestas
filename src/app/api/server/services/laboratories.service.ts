import { randomBytes } from "node:crypto";

import { prisma } from "../lib/prisma";
import { serializePublicLaboratory, type LaboratoryPublicSource } from "../laboratories/laboratory.contracts";
import type { LaboratoryDetailsDto, PublicLaboratoryDto } from "@/types/laboratory.type";

const MAX_LABORATORIES = 5;
const MAX_RETRIES = 4;

export type CreateAtomicResult =
  | { kind: "CREATED"; laboratory: LaboratoryPublicSource }
  | { kind: "LIMIT_REACHED" };

export type LaboratoriesRepository = {
  listAccessible(userId: string): Promise<LaboratoryPublicSource[]>;
  createAtomic(userId: string, name: string, accessCode: string): Promise<CreateAtomicResult>;
  getDetails(userId: string, laboratoryId: string): Promise<(LaboratoryPublicSource & { members: { firstName: string; lastName: string }[] }) | null>;
  deactivate(userId: string, laboratoryId: string, confirmationName: string): Promise<"DEACTIVATED" | "NOT_FOUND" | "FORBIDDEN" | "MISMATCH">;
  delete(userId: string, laboratoryId: string, confirmationName: string): Promise<"DELETED" | "NOT_FOUND" | "FORBIDDEN" | "MISMATCH" | "HAS_DATA">;
};

export type CreateLaboratoryResult =
  | { success: true; laboratory: PublicLaboratoryDto }
  | { success: false; reason: "LIMIT_REACHED" | "CONFLICT" | "INTERNAL_ERROR" };

export type ListLaboratoriesResult =
  | { success: true; laboratories: PublicLaboratoryDto[] }
  | { success: false; reason: "INTERNAL_ERROR" };

export type RiskActionResult = { success: true } | { success: false; reason: "NOT_FOUND" | "FORBIDDEN" | "CONFIRMATION_MISMATCH" | "LABORATORY_HAS_DATA" | "INTERNAL_ERROR" };

function prismaCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : undefined;
}

export const prismaLaboratoriesRepository: LaboratoriesRepository = {
  async listAccessible(userId) {
    const links = await prisma.researchersLinked.findMany({
      where: { userId },
      orderBy: { laboratoryRoom: { createdAt: "desc" } },
      select: {
        laboratoryRoom: { select: { id: true, name: true, createdAt: true, isActive: true, userId: true } },
      },
    });
    return links.map(({ laboratoryRoom }) => laboratoryRoom);
  },
  async createAtomic(userId, name, accessCode) {
    return prisma.$transaction(async (tx) => {
      const count = await tx.researchersLinked.count({ where: { userId } });
      if (count >= MAX_LABORATORIES) return { kind: "LIMIT_REACHED" as const };
      const laboratory = await tx.laboratoryRoom.create({
        data: { name, userId, accessCode },
        select: { id: true, name: true, createdAt: true, isActive: true },
      });
      await tx.researchersLinked.create({ data: { userId, laboratoryRoomId: laboratory.id } });
      return {
        kind: "CREATED" as const,
        laboratory: { id: laboratory.id, name: laboratory.name, createdAt: laboratory.createdAt, isActive: laboratory.isActive, userId },
      };
    }, { isolationLevel: "Serializable" });
  },
  async getDetails(userId, laboratoryId) {
    const laboratory = await prisma.laboratoryRoom.findFirst({
      where: { id: laboratoryId, researchersLinked: { some: { userId } } },
      select: { id: true, name: true, createdAt: true, isActive: true, userId: true, researchersLinked: { orderBy: { user: { firstName: "asc" } }, select: { user: { select: { firstName: true, lastName: true } } } } },
    });
    return laboratory ? { ...laboratory, members: laboratory.researchersLinked.map(({ user }) => user) } : null;
  },
  async deactivate(userId, laboratoryId, confirmationName) {
    return prisma.$transaction(async (tx) => {
      const laboratory = await tx.laboratoryRoom.findUnique({ where: { id: laboratoryId }, select: { name: true, userId: true } });
      if (!laboratory) return "NOT_FOUND" as const;
      if (laboratory.userId !== userId) return "FORBIDDEN" as const;
      if (laboratory.name !== confirmationName) return "MISMATCH" as const;
      await tx.laboratoryRoom.update({ where: { id: laboratoryId }, data: { isActive: false } });
      return "DEACTIVATED" as const;
    });
  },
  async delete(userId, laboratoryId, confirmationName) {
    return prisma.$transaction(async (tx) => {
      const laboratory = await tx.laboratoryRoom.findUnique({ where: { id: laboratoryId }, select: { name: true, userId: true, _count: { select: { collectionAreas: true } } } });
      if (!laboratory) return "NOT_FOUND" as const;
      if (laboratory.userId !== userId) return "FORBIDDEN" as const;
      if (laboratory.name !== confirmationName) return "MISMATCH" as const;
      if (laboratory._count.collectionAreas > 0) return "HAS_DATA" as const;
      await tx.researchersLinked.deleteMany({ where: { laboratoryRoomId: laboratoryId } });
      await tx.laboratoryRoom.delete({ where: { id: laboratoryId } });
      return "DELETED" as const;
    });
  },
};

export class LaboratoriesService {
  constructor(
    private readonly repository: LaboratoriesRepository = prismaLaboratoriesRepository,
    private readonly generateAccessCode: () => string = () => randomBytes(9).toString("base64url"),
  ) {}

  async listAccessible(userId: string): Promise<ListLaboratoriesResult> {
    try {
      const laboratories = await this.repository.listAccessible(userId);
      return { success: true, laboratories: laboratories.map((laboratory) => serializePublicLaboratory(laboratory, userId)) };
    } catch {
      return { success: false, reason: "INTERNAL_ERROR" };
    }
  }

  async create(userId: string, name: string): Promise<CreateLaboratoryResult> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const result = await this.repository.createAtomic(userId, name, this.generateAccessCode());
        if (result.kind === "LIMIT_REACHED") return { success: false, reason: "LIMIT_REACHED" };
        return { success: true, laboratory: serializePublicLaboratory(result.laboratory, userId) };
      } catch (error) {
        const code = prismaCode(error);
        if ((code === "P2002" || code === "P2034") && attempt < MAX_RETRIES - 1) continue;
        return { success: false, reason: code === "P2002" || code === "P2034" ? "CONFLICT" : "INTERNAL_ERROR" };
      }
    }
    return { success: false, reason: "CONFLICT" };
  }

  async details(userId: string, laboratoryId: string): Promise<{ success: true; details: LaboratoryDetailsDto } | { success: false; reason: "NOT_FOUND" | "INTERNAL_ERROR" }> {
    try {
      const laboratory = await this.repository.getDetails(userId, laboratoryId);
      if (!laboratory) return { success: false, reason: "NOT_FOUND" };
      return { success: true, details: { ...serializePublicLaboratory(laboratory, userId), members: laboratory.members.map((member) => ({ name: `${member.firstName} ${member.lastName}`.trim(), initials: `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase() })) } };
    } catch { return { success: false, reason: "INTERNAL_ERROR" }; }
  }

  async deactivate(userId: string, laboratoryId: string, confirmationName: string): Promise<RiskActionResult> {
    try {
      const result = await this.repository.deactivate(userId, laboratoryId, confirmationName);
      if (result === "DEACTIVATED") return { success: true };
      return { success: false, reason: result === "MISMATCH" ? "CONFIRMATION_MISMATCH" : result };
    } catch { return { success: false, reason: "INTERNAL_ERROR" }; }
  }

  async delete(userId: string, laboratoryId: string, confirmationName: string): Promise<RiskActionResult> {
    try {
      const result = await this.repository.delete(userId, laboratoryId, confirmationName);
      if (result === "DELETED") return { success: true };
      return { success: false, reason: result === "MISMATCH" ? "CONFIRMATION_MISMATCH" : result === "HAS_DATA" ? "LABORATORY_HAS_DATA" : result };
    } catch { return { success: false, reason: "INTERNAL_ERROR" }; }
  }
}

const laboratoriesService = new LaboratoriesService();
export default laboratoriesService;

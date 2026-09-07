import { randomBytes } from "node:crypto";

import { prisma } from "../lib/prisma";
import { serializePublicLaboratory, type LaboratoryPublicSource } from "../laboratories/laboratory.contracts";
import type { PublicLaboratoryDto } from "@/types/laboratory.type";

const MAX_LABORATORIES = 5;
const MAX_RETRIES = 4;

export type CreateAtomicResult =
  | { kind: "CREATED"; laboratory: LaboratoryPublicSource }
  | { kind: "LIMIT_REACHED" };

export type LaboratoriesRepository = {
  listAccessible(userId: string): Promise<LaboratoryPublicSource[]>;
  createAtomic(userId: string, name: string, accessCode: string): Promise<CreateAtomicResult>;
};

export type CreateLaboratoryResult =
  | { success: true; laboratory: PublicLaboratoryDto }
  | { success: false; reason: "LIMIT_REACHED" | "CONFLICT" | "INTERNAL_ERROR" };

export type ListLaboratoriesResult =
  | { success: true; laboratories: PublicLaboratoryDto[] }
  | { success: false; reason: "INTERNAL_ERROR" };

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
        laboratoryRoom: { select: { name: true, createdAt: true, isActive: true } },
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
        laboratory: { name: laboratory.name, createdAt: laboratory.createdAt, isActive: laboratory.isActive },
      };
    }, { isolationLevel: "Serializable" });
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
      return { success: true, laboratories: laboratories.map(serializePublicLaboratory) };
    } catch {
      return { success: false, reason: "INTERNAL_ERROR" };
    }
  }

  async create(userId: string, name: string): Promise<CreateLaboratoryResult> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const result = await this.repository.createAtomic(userId, name, this.generateAccessCode());
        if (result.kind === "LIMIT_REACHED") return { success: false, reason: "LIMIT_REACHED" };
        return { success: true, laboratory: serializePublicLaboratory(result.laboratory) };
      } catch (error) {
        const code = prismaCode(error);
        if ((code === "P2002" || code === "P2034") && attempt < MAX_RETRIES - 1) continue;
        return { success: false, reason: code === "P2002" || code === "P2034" ? "CONFLICT" : "INTERNAL_ERROR" };
      }
    }
    return { success: false, reason: "CONFLICT" };
  }
}

const laboratoriesService = new LaboratoriesService();
export default laboratoriesService;

import type { PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { AreaAccessError, authorizeLaboratoryAccess } from "../areas/area.authorization";
import { serializeTerritorialArea, TerritorialMapError } from "../territorial-map/territorial-map.contracts";
import type { TerritorialMapResponse } from "@/types/territorial-map.type";

export class TerritorialMapService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async read(userId: string, laboratoryId: string): Promise<TerritorialMapResponse> {
    try {
      return await this.db.$transaction(async (tx) => {
        const context = await authorizeLaboratoryAccess({ id: userId }, laboratoryId, "READ_AREAS", tx);
        const areas = await tx.collectionArea.findMany({
          where: { laboratoryRoomId: context.id },
          select: {
            id: true, name: true, latitude: true, longitude: true,
            collectionData: {
              where: { laboratoryRoomId: context.id, occurredAt: { not: null }, occurrenceOffset: { not: null }, confirmedAt: { not: null }, confirmationKey: { not: null } },
              select: { id: true, occurredAt: true, occurrenceOffset: true, confirmedAt: true },
              orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
            },
          },
          orderBy: [{ name: "asc" }, { id: "asc" }],
        });
        return { context, areas: areas.map((area) => serializeTerritorialArea({ ...area, collectionData: area.collectionData.map((collection) => ({ ...collection, occurredAt: collection.occurredAt!, occurrenceOffset: collection.occurrenceOffset!, confirmedAt: collection.confirmedAt! })) })) };
      });
    } catch (error) {
      if (error instanceof AreaAccessError) throw error;
      throw new TerritorialMapError("INTERNAL_ERROR");
    }
  }
}

export const territorialMapService = new TerritorialMapService();

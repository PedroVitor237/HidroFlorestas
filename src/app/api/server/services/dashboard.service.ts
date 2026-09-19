import type { PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { authorizeLaboratoryAccess } from "../areas/area.authorization";
import { compareHistory, decodeHistoryCursor, encodeHistoryCursor, type HistoryKey } from "../dashboard/dashboard.contracts";
import type { DashboardHistoryItem, DashboardHistoryPage, DashboardSummary } from "@/types/dashboard.type";

export class DashboardService {
  constructor(private readonly db: PrismaClient = prisma) {}
  async summary(userId: string, laboratoryId: string): Promise<DashboardSummary> {
    return this.db.$transaction(async (tx) => {
      const context = await authorizeLaboratoryAccess({ id: userId }, laboratoryId, "READ_AREAS", tx);
      const [areas, confirmedCollections] = await Promise.all([
        tx.collectionArea.count({ where: { laboratoryRoomId: laboratoryId } }),
        tx.collectionData.count({ where: { laboratoryRoomId: laboratoryId, occurredAt: { not: null }, occurrenceOffset: { not: null }, confirmedAt: { not: null }, confirmationKey: { not: null } } }),
      ]);
      return { context, totals: { areas, confirmedCollections }, links: { areas: `/dashboard/laboratories/${laboratoryId}/areas` } };
    });
  }
  async history(userId: string, laboratoryId: string, rawCursor?: string): Promise<DashboardHistoryPage> {
    return this.db.$transaction(async (tx) => {
      const context = await authorizeLaboratoryAccess({ id: userId }, laboratoryId, "READ_AREAS", tx);
      const cursor = rawCursor ? decodeHistoryCursor(rawCursor) : undefined;
      const [areas, collections] = await Promise.all([
        tx.collectionArea.findMany({ where: { laboratoryRoomId: laboratoryId, ...areaBoundary(cursor) }, select: { id: true, name: true, createdAt: true }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 21 }),
        tx.collectionData.findMany({ where: { laboratoryRoomId: laboratoryId, occurredAt: { not: null }, occurrenceOffset: { not: null }, confirmedAt: { not: null }, confirmationKey: { not: null }, ...collectionBoundary(cursor) }, select: { id: true, confirmedAt: true, occurredAt: true, collectionArea: { select: { id: true, name: true } } }, orderBy: [{ confirmedAt: "desc" }, { id: "desc" }], take: 21 }),
      ]);
      const items: DashboardHistoryItem[] = [
        ...areas.map((area) => ({ id: `AREA_CREATED:${area.id}`, type: "AREA_CREATED" as const, label: "Área criada" as const, eventAt: area.createdAt.toISOString(), area: { id: area.id, name: area.name }, destination: `/dashboard/laboratories/${laboratoryId}/areas/${area.id}` })),
        ...collections.map((collection) => ({ id: `COLLECTION_CONFIRMED:${collection.id}`, type: "COLLECTION_CONFIRMED" as const, label: "Coleta confirmada" as const, eventAt: collection.confirmedAt!.toISOString(), occurredAt: collection.occurredAt!.toISOString(), area: collection.collectionArea, collection: { id: collection.id }, destination: `/dashboard/laboratories/${laboratoryId}/areas/${collection.collectionArea.id}/collections/${collection.id}` })),
      ].sort(compareHistory);
      const pageItems = items.slice(0, 20);
      return { context, items: pageItems, page: { nextCursor: items.length > 20 ? encodeHistoryCursor(pageItems[19]) : null } };
    });
  }
}

function areaBoundary(cursor?: HistoryKey) {
  if (!cursor) return {};
  const at = new Date(cursor.eventAt);
  return cursor.type === "AREA_CREATED"
    ? { OR: [{ createdAt: { lt: at } }, { createdAt: at, id: { lt: cursor.sourceId } }] }
    : { createdAt: { lt: at } };
}
function collectionBoundary(cursor?: HistoryKey) {
  if (!cursor) return {};
  const at = new Date(cursor.eventAt);
  return { OR: [{ confirmedAt: { lt: at } }, { confirmedAt: at, ...(cursor.type === "AREA_CREATED" ? {} : { id: { lt: cursor.sourceId } }) }] };
}
export const dashboardService = new DashboardService();

import type { LaboratoryContext } from "@/app/api/server/areas/area.authorization";

export type DashboardSummary = {
  context: LaboratoryContext;
  totals: { areas: number; confirmedCollections: number };
  links: { areas: string };
};

export type AreaCreatedItem = {
  id: string; type: "AREA_CREATED"; label: "Área criada"; eventAt: string;
  area: { id: string; name: string }; destination: string;
};
export type CollectionConfirmedItem = {
  id: string; type: "COLLECTION_CONFIRMED"; label: "Coleta confirmada";
  eventAt: string; occurredAt: string; area: { id: string; name: string };
  collection: { id: string }; destination: string;
};
export type DashboardHistoryItem = AreaCreatedItem | CollectionConfirmedItem;
export type DashboardHistoryPage = {
  context: LaboratoryContext;
  items: DashboardHistoryItem[];
  page: { nextCursor: string | null };
};


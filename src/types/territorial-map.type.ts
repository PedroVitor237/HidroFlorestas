import type { LaboratoryContext } from "@/app/api/server/areas/area.authorization";

export type TerritorialLocation = { latitude: number; longitude: number };
export type TerritorialCollection = {
  id: string;
  occurredAt: string;
  confirmedAt: string;
};
export type TerritorialArea = {
  id: string;
  name: string;
  location: TerritorialLocation | null;
  confirmedCollections: TerritorialCollection[];
};
export type TerritorialMapResponse = {
  context: LaboratoryContext;
  areas: TerritorialArea[];
};

import type { TerritorialArea } from "@/types/territorial-map.type";

export type TileState = "UNCONFIGURED" | "LOADING" | "AVAILABLE" | "DEGRADED" | "UNAVAILABLE";
export function formatCoordinate(value: number) { return Number(value.toFixed(6)).toString(); }
export function areasWithLocation(areas: TerritorialArea[]) { return areas.filter((area) => area.location !== null); }
export function selectedArea(areas: TerritorialArea[], id: string | null) { return areas.find((area) => area.id === id) ?? null; }
export function classifyTiles(loaded: number, failed: number): TileState {
  if (loaded > 0 && failed > 0) return "DEGRADED";
  if (loaded > 0) return "AVAILABLE";
  return failed > 0 ? "UNAVAILABLE" : "LOADING";
}

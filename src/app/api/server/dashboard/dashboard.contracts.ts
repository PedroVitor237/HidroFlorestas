import { validResourceId } from "../areas/area.authorization";
import type { DashboardHistoryItem } from "@/types/dashboard.type";

export type HistoryKey = { version: 1; eventAt: string; type: DashboardHistoryItem["type"]; sourceId: string };
const types = new Set(["AREA_CREATED", "COLLECTION_CONFIRMED"]);

export function encodeHistoryCursor(item: DashboardHistoryItem) {
  const sourceId = item.type === "AREA_CREATED" ? item.area.id : item.collection.id;
  return Buffer.from(JSON.stringify({ version: 1, eventAt: item.eventAt, type: item.type, sourceId }), "utf8").toString("base64url");
}

export function decodeHistoryCursor(value: string): HistoryKey {
  if (!value || value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new DashboardError("INVALID_CURSOR");
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Record<string, unknown>;
    if (parsed.version !== 1 || typeof parsed.eventAt !== "string" || Number.isNaN(Date.parse(parsed.eventAt)) || typeof parsed.type !== "string" || !types.has(parsed.type) || typeof parsed.sourceId !== "string" || !validResourceId(parsed.sourceId) || Object.keys(parsed).some((key) => !["version", "eventAt", "type", "sourceId"].includes(key))) throw new Error();
    return parsed as HistoryKey;
  } catch (error) {
    if (error instanceof DashboardError) throw error;
    throw new DashboardError("INVALID_CURSOR");
  }
}

export function compareHistory(a: DashboardHistoryItem, b: DashboardHistoryItem) {
  const time = Date.parse(b.eventAt) - Date.parse(a.eventAt);
  if (time) return time;
  const rank = (a.type === "AREA_CREATED" ? 0 : 1) - (b.type === "AREA_CREATED" ? 0 : 1);
  if (rank) return rank;
  const aId = a.type === "AREA_CREATED" ? a.area.id : a.collection.id;
  const bId = b.type === "AREA_CREATED" ? b.area.id : b.collection.id;
  return bId.localeCompare(aId);
}

export type DashboardErrorCode = "INVALID_CURSOR" | "INTERNAL_ERROR";
export class DashboardError extends Error { constructor(public readonly code: DashboardErrorCode) { super(code); } }


import type { TerritorialArea, TerritorialCollection, TerritorialLocation } from "@/types/territorial-map.type";

type Numeric = number | string | { toString(): string } | null | undefined;
type CollectionSource = { id: string; occurredAt: Date; occurrenceOffset: string; confirmedAt: Date };
type AreaSource = { id: string; name: string; latitude: Numeric; longitude: Numeric; collectionData: CollectionSource[] };

export class TerritorialMapError extends Error {
  constructor(public readonly code: "INTERNAL_ERROR") {
    super(code);
    this.name = "TerritorialMapError";
  }
}

export function serializeLocation(latitude: Numeric, longitude: Numeric): TerritorialLocation | null {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null;
  const lat = Number(latitude.toString());
  const lng = Number(longitude.toString());
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) };
}

export function occurrenceAtOffset(instant: Date, offset: string) {
  if (offset === "Z") return instant.toISOString();
  const sign = offset[0] === "+" ? 1 : -1;
  const minutes = Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6));
  return `${new Date(instant.getTime() + sign * minutes * 60_000).toISOString().slice(0, -1)}${offset}`;
}

export function serializeCollection(source: CollectionSource): TerritorialCollection {
  return { id: source.id, occurredAt: occurrenceAtOffset(source.occurredAt, source.occurrenceOffset), confirmedAt: source.confirmedAt.toISOString() };
}

export function serializeTerritorialArea(source: AreaSource): TerritorialArea {
  return {
    id: source.id,
    name: source.name,
    location: serializeLocation(source.latitude, source.longitude),
    confirmedCollections: source.collectionData.map(serializeCollection),
  };
}

import assert from "node:assert/strict";
import { it } from "node:test";
import { areasWithLocation, classifyTiles, formatCoordinate, selectedArea } from "../../src/components/territorial-map/territorial-map-state";
import type { TerritorialArea } from "../../src/types/territorial-map.type";

const areas: TerritorialArea[] = [
  { id: "a", name: "A", location: { latitude: -3.12, longitude: -38.5 }, confirmedCollections: [] },
  { id: "b", name: "B", location: null, confirmedCollections: [] },
];
it("derives map and selection from stable area ids", () => { assert.deepEqual(areasWithLocation(areas).map((area) => area.id), ["a"]); assert.equal(selectedArea(areas, "b")?.name, "B"); assert.equal(selectedArea(areas, "missing"), null); });
it("formats coordinates without fabricated trailing precision", () => { assert.equal(formatCoordinate(-3.1), "-3.1"); assert.equal(formatCoordinate(-3.1234567), "-3.123457"); });
it("classifies independent tile cycles", () => { assert.equal(classifyTiles(0, 0), "LOADING"); assert.equal(classifyTiles(2, 0), "AVAILABLE"); assert.equal(classifyTiles(2, 1), "DEGRADED"); assert.equal(classifyTiles(0, 2), "UNAVAILABLE"); });

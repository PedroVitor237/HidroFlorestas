import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEnvironmentalInput, canonicalPayload, hashPayload } from "../../src/app/api/server/environmental-data/environmental-data.contracts";
import { invalidEnvironmentalCases, validEnvironmentalPayload } from "../fixtures/environmental-data";
test("v1 preserves zero/false, normalizes only absent optional fields and canonicalizes ordering", () => {
 const p = validEnvironmentalPayload();
 assert.deepEqual(parseEnvironmentalInput(p), p);
 const omitted = structuredClone(p) as unknown as Record<string, Record<string, unknown>>;
 delete omitted.water.wellDepthMeters; delete omitted.terrain.elevationMeters;
 assert.deepEqual(parseEnvironmentalInput(omitted), p);
 const reordered = Object.fromEntries(Object.entries(p).reverse());
 assert.equal(canonicalPayload(parseEnvironmentalInput(reordered)), canonicalPayload(p));
 assert.equal(hashPayload(parseEnvironmentalInput(reordered)), hashPayload(p));
 p.vegetation.hasRiparianApp = false;
 assert.notEqual(hashPayload(p), hashPayload(validEnvironmentalPayload()));
});
for (const [name, mutate] of invalidEnvironmentalCases) test(`v1 rejects ${name}`, () => {
 const p = validEnvironmentalPayload() as unknown as Record<string, Record<string, unknown>>; mutate(p);
 assert.throws(() => parseEnvironmentalInput(p));
});
test("v1 accepts both wells without depth, limits and unrestricted finite elevation/slope", () => {
 for (const source of ["SHALLOW_WELL", "TUBULAR_WELL"] as const) {
 const p = validEnvironmentalPayload(); p.water.waterSourceType = source;
 assert.equal(parseEnvironmentalInput(p).water.wellDepthMeters, null);
 p.water.wellDepthMeters=0; p.soil.soilExposedPercent=100; p.vegetation.vegetationCoverPercent=100;
 p.terrain.elevationMeters=-10.125; p.terrain.slopePercent=150;
 assert.deepEqual(parseEnvironmentalInput(p), p);
 }
});

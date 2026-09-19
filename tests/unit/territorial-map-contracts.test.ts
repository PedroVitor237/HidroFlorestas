import assert from "node:assert/strict";
import { it } from "node:test";
import { occurrenceAtOffset, serializeLocation, serializeTerritorialArea } from "../../src/app/api/server/territorial-map/territorial-map.contracts";

it("accepts inclusive coordinate limits and caps serialized precision", () => {
  assert.deepEqual(serializeLocation(-90, 180), { latitude: -90, longitude: 180 });
  assert.deepEqual(serializeLocation(90, -180), { latitude: 90, longitude: -180 });
  assert.deepEqual(serializeLocation(-3.1234567, -38.7654328), { latitude: -3.123457, longitude: -38.765433 });
});

it("turns absent, non-finite and out-of-range coordinate pairs into null", () => {
  for (const pair of [[null, 0], [0, undefined], [Number.NaN, 0], [0, Number.POSITIVE_INFINITY], [-90.1, 0], [0, 180.1]] as const) assert.equal(serializeLocation(pair[0], pair[1]), null);
});

it("reconstructs occurrence offset and exposes only the territorial allowlist", () => {
  assert.equal(occurrenceAtOffset(new Date("2026-09-19T12:00:00.000Z"), "-03:00"), "2026-09-19T09:00:00.000-03:00");
  const area = serializeTerritorialArea({ id: "area", name: "Área", latitude: "-3.1", longitude: "-38.2", collectionData: [{ id: "collection", occurredAt: new Date("2026-09-19T12:00:00.000Z"), occurrenceOffset: "-03:00", confirmedAt: new Date("2026-09-19T13:00:00.000Z") }] });
  assert.deepEqual(Object.keys(area).sort(), ["confirmedCollections", "id", "location", "name"]);
  assert.deepEqual(Object.keys(area.confirmedCollections[0]).sort(), ["confirmedAt", "id", "occurredAt"]);
  for (const forbidden of ["userId", "email", "observations", "confirmationKey", "payload", "ihfrScore"]) assert.equal(JSON.stringify(area).includes(forbidden), false);
});

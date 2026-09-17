import assert from "node:assert/strict";
import { it } from "node:test";
import { inspectAreaMigration, type LegacySnapshot } from "../../scripts/imp-003-migration-preflight";

const valid = (): LegacySnapshot => ({
  users: ["owner", "member"], laboratories: [{ id: "lab", userId: "owner" }],
  memberships: [{ userId: "owner", laboratoryRoomId: "lab" }],
  areas: [{ coordinatesId: "point" }], coordinates: [{ id: "point", latitude: "-90", longitude: "180" }],
});
it("accepts valid bounds and a recoverable missing creator membership", () => {
  assert.equal(inspectAreaMigration(valid()).ok, true);
  const data = valid(); data.memberships = [];
  assert.equal(inspectAreaMigration(data).ok, true);
});
it("rejects invalid coordinates without exposing their contents", () => {
  for (const latitude of ["", "NaN", "Infinity", "91", "1,2", "private-value"]) {
    const data = valid(); data.coordinates[0].latitude = latitude;
    const result = inspectAreaMigration(data);
    assert.equal(result.ok, false); assert.equal(result.issues.INVALID_COORDINATES, 1);
    assert.equal(JSON.stringify(result).includes("private-value"), false);
  }
});
it("rejects orphan/shared coordinates, missing references and inconsistent members", () => {
  const orphan = valid(); orphan.areas = [];
  assert.equal(inspectAreaMigration(orphan).issues.ORPHAN_COORDINATES, 1);
  const shared = valid(); shared.areas.push({ coordinatesId: "point" });
  assert.equal(inspectAreaMigration(shared).issues.SHARED_COORDINATES, 1);
  const missing = valid(); missing.coordinates = [];
  assert.equal(inspectAreaMigration(missing).issues.MISSING_COORDINATES, 1);
  const user = valid(); user.users = [];
  assert.ok(inspectAreaMigration(user).issues.INVALID_CREATOR);
  assert.ok(inspectAreaMigration(user).issues.INVALID_MEMBERSHIP);
});
it("rejects backfill exceeding the five-laboratory limit", () => {
  const data = valid(); data.memberships = [];
  data.laboratories = Array.from({ length: 6 }, (_, i) => ({ id: `lab${i}`, userId: "owner" }));
  assert.equal(inspectAreaMigration(data).issues.MEMBERSHIP_LIMIT, 1);
});

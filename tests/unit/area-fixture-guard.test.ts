import assert from "node:assert/strict";
import { it } from "node:test";
import { areaFixturePlan } from "../fixtures/areas";
it("uses exclusive UUIDs and child-first cleanup", () => {
  const plan = areaFixturePlan();
  assert.equal(plan.prefix, "IMP-003 E2E");
  assert.equal(plan.userIds.length, 4);
  assert.equal(plan.laboratoryIds.length, 3);
  assert.equal(new Set([...plan.userIds, ...plan.laboratoryIds]).size, 7);
  for (const id of [...plan.userIds, ...plan.laboratoryIds]) assert.match(id, /^00000000-0000-4000-8000-0000000003\d{2}$/);
  assert.deepEqual(plan.cleanupOrder, ["CollectionArea", "ResearchersLinked", "LaboratoryRoom", "User"]);
});

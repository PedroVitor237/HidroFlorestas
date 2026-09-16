import assert from "node:assert/strict";
import { it } from "node:test";
import { parseMembershipChange } from "../../src/app/api/server/laboratories/laboratory-membership.contracts";
it("accepts only opposite MEMBER/ADMIN transitions", () => {
  assert.deepEqual(parseMembershipChange({ expectedRole: "MEMBER", role: "ADMIN" }), { expectedRole: "MEMBER", role: "ADMIN" });
  assert.deepEqual(parseMembershipChange({ expectedRole: "ADMIN", role: "MEMBER" }), { expectedRole: "ADMIN", role: "MEMBER" });
  for (const value of [null, [], {}, { role: "ADMIN" }, { role: "OWNER", expectedRole: "MEMBER" }, { role: "ADMIN", expectedRole: "ADMIN" }, { role: "ADMIN", expectedRole: "MEMBER", userId: "forged" }]) assert.equal(parseMembershipChange(value), null);
});

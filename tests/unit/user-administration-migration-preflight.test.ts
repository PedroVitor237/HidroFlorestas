import assert from "node:assert/strict";
import { it } from "node:test";
import { evaluateLegacyAuthorityPreflight } from "../../scripts/imp-009-migration-preflight";

it("classifies all four legacy authority combinations without exposing records", () => {
  assert.deepEqual(evaluateLegacyAuthorityPreflight({ adminTrue: 2, nonAdminFalse: 3, adminFalse: 0, nonAdminTrue: 0 }), { ok: true, contradictoryCount: 0 });
  assert.deepEqual(evaluateLegacyAuthorityPreflight({ adminTrue: 0, nonAdminFalse: 0, adminFalse: 1, nonAdminTrue: 0 }), { ok: false, contradictoryCount: 1 });
  assert.deepEqual(evaluateLegacyAuthorityPreflight({ adminTrue: 0, nonAdminFalse: 0, adminFalse: 0, nonAdminTrue: 1 }), { ok: false, contradictoryCount: 1 });
  assert.throws(() => evaluateLegacyAuthorityPreflight({ adminTrue: -1, nonAdminFalse: 0, adminFalse: 0, nonAdminTrue: 0 }), /INVALID_PREFLIGHT_COUNT/);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { deriveIHFRLifecycleState } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";

test("derives CURRENT, REVOKED and SUPERSEDED without trusting a stored status", () => {
  assert.equal(deriveIHFRLifecycleState({ current: true, terminalEvent: null }), "CURRENT");
  assert.equal(deriveIHFRLifecycleState({ current: false, terminalEvent: "REVOKED" }), "REVOKED");
  assert.equal(deriveIHFRLifecycleState({ current: false, terminalEvent: "SUPERSEDED" }), "SUPERSEDED");
});

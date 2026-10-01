import assert from "node:assert/strict";
import { randomFillSync } from "node:crypto";
import { test } from "node:test";
import { createCollectionAttempt, failCollectionSubmission, startNewCollectionAttempt } from "../../src/components/collections/collection-form-state";
import { prepareSubmission } from "../../src/components/environmental-data/environmental-data-form-state";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";

const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const context = { laboratory: { id: "lab", name: "Lab", status: "ACTIVE" as const }, area: { id: "area", name: "Area" }, readOnly: false };

test("collection and environmental attempts work without randomUUID while keeping retry keys stable", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: { getRandomValues: (array: Uint8Array) => randomFillSync(array) },
  });
  try {
    const first = createCollectionAttempt(context);
    assert.match(first.idempotencyKey, uuidV4);
    const failed = failCollectionSubmission(first, "retry");
    assert.equal(failed.idempotencyKey, first.idempotencyKey);
    const next = startNewCollectionAttempt(first);
    assert.match(next.idempotencyKey, uuidV4);
    assert.notEqual(next.idempotencyKey, first.idempotencyKey);

    const payload = validEnvironmentalPayload();
    const submission = prepareSubmission(payload, null);
    assert.match(submission.key, uuidV4);
    assert.equal(prepareSubmission(payload, submission).key, submission.key);
    const changed = structuredClone(payload);
    changed.water.hasSpring = true;
    assert.notEqual(prepareSubmission(changed, submission).key, submission.key);
  } finally {
    if (original) Object.defineProperty(globalThis, "crypto", original);
    else Reflect.deleteProperty(globalThis, "crypto");
  }
});

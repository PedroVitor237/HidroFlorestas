import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  beginCollectionSubmission,
  createCollectionAttempt,
  editCollectionAttempt,
  failCollectionSubmission,
  reviewCollectionAttempt,
  startNewCollectionAttempt,
  updateCollectionOccurrence,
} from "../../src/components/collections/collection-form-state";

const context = {
  laboratory: { id: "lab", name: "Laboratório", status: "ACTIVE" as const },
  area: { id: "area", name: "Área" },
  readOnly: false,
};

describe("collection form state", () => {
  it("creates a volatile attempt with immutable explicit context", () => {
    const attempt = createCollectionAttempt(context, () => "key");
    assert.deepEqual(attempt.context, context);
    assert.equal(attempt.phase, "editing");
    assert.equal(attempt.idempotencyKey, "key");
    assert.equal(JSON.stringify(attempt).includes("userId"), false);
  });

  it("creates the default idempotency key in browser-compatible form", () => {
    assert.match(createCollectionAttempt(context).idempotencyKey, /^[0-9a-f-]{36}$/i);
  });

  it("preserves values while review and correction remain memory-only", () => {
    const initial = createCollectionAttempt(context, () => "key");
    const changed = updateCollectionOccurrence(initial, "2026-09-15T09:00:00-03:00");
    const review = reviewCollectionAttempt(changed);
    assert.equal(review.phase, "reviewing");
    assert.equal(editCollectionAttempt(review).occurredAt, changed.occurredAt);
    assert.equal(updateCollectionOccurrence(review, changed.occurredAt).phase, "editing");
  });

  it("keeps invalid temporal input editable with a comprehensible error", () => {
    const empty = reviewCollectionAttempt(createCollectionAttempt(context, () => "key"));
    assert.equal(empty.phase, "editing");
    assert.match(empty.error ?? "", /data.*horário.*fuso/i);

    const malformed = reviewCollectionAttempt(
      updateCollectionOccurrence(
        createCollectionAttempt(context, () => "key"),
        "2026-09-15 09:00",
      ),
    );
    assert.equal(malformed.phase, "editing");
    assert.equal(malformed.occurredAt, "2026-09-15 09:00");
    assert.match(malformed.error ?? "", /RFC 3339|fuso/i);
  });

  it("invalidates review after any temporal correction without changing the text", () => {
    const initial = updateCollectionOccurrence(
      createCollectionAttempt(context, () => "key"),
      "2026-09-15T09:00:00-03:00",
    );
    const review = reviewCollectionAttempt(initial);
    assert.equal(review.phase, "reviewing");
    const corrected = updateCollectionOccurrence(
      review,
      "2026-09-15T08:59:59.123-03:00",
    );
    assert.equal(corrected.phase, "editing");
    assert.equal(corrected.occurredAt, "2026-09-15T08:59:59.123-03:00");
    assert.equal(corrected.error, null);
  });

  it("submits only an explicitly reviewed attempt and is single-flight", () => {
    const review = reviewCollectionAttempt(
      updateCollectionOccurrence(
        createCollectionAttempt(context, () => "stable-key"),
        "2026-09-15T09:00:00-03:00",
      ),
    );
    const submitting = beginCollectionSubmission(review);
    assert.equal(submitting.phase, "submitting");
    assert.equal(submitting.idempotencyKey, "stable-key");
    assert.equal(beginCollectionSubmission(submitting), submitting);
    assert.throws(() => beginCollectionSubmission(createCollectionAttempt(context, () => "key")));
  });

  it("keeps the same key for retry and creates a new key only for another intentional attempt", () => {
    const review = reviewCollectionAttempt(
      updateCollectionOccurrence(
        createCollectionAttempt(context, () => "stable-key"),
        "2026-09-15T09:00:00-03:00",
      ),
    );
    const failed = failCollectionSubmission(
      beginCollectionSubmission(review),
      "Não foi possível confirmar. Tente novamente.",
    );
    assert.equal(failed.phase, "reviewing");
    assert.equal(failed.idempotencyKey, "stable-key");
    assert.match(failed.error ?? "", /tente novamente/i);

    const next = startNewCollectionAttempt(failed, () => "new-key");
    assert.equal(next.phase, "editing");
    assert.equal(next.idempotencyKey, "new-key");
    assert.equal(next.occurredAt, "");
    assert.deepEqual(next.context, context);
  });

  it("contains no storage or write operation", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile("src/components/collections/collection-form-state.ts", "utf8"),
    );
    for (const forbidden of ["localStorage", "sessionStorage", "fetch(", "axios"])
      assert.equal(source.includes(forbidden), false);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deviceLocalDateTime, deviceUtcOffset, deviceOffsetForLocal, localOccurrenceToRfc3339, formatCollectionOccurrence } from "../../src/lib/collection-date-time";
import { parseCollectionInput, serializeCollectionDetail } from "../../src/app/api/server/collections/collection.contracts";
import { createCollectionAttempt, updateCollectionLocalOccurrence, reviewCollectionAttempt, editCollectionAttempt, beginCollectionSubmission, failCollectionSubmission } from "../../src/components/collections/collection-form-state";

const context = { laboratory: { id: "lab", name: "Lab", status: "ACTIVE" as const }, area: { id: "area", name: "Área" }, readOnly: false };
const clock = () => new Date("2026-10-01T12:34:56.123Z");
function inZone(zone: string, fn: () => void) {
  const previous = process.env.TZ;
  process.env.TZ = zone;
  try { fn(); } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
}

describe("collection date/time adapter", () => {
  for (const [zone, local, offset] of [
    ["America/Fortaleza", "2026-10-01T09:34:56.123", "-03:00"],
    ["UTC", "2026-10-01T12:34:56.123", "+00:00"],
    ["Asia/Kathmandu", "2026-10-01T18:19:56.123", "+05:45"],
  ]) {
    it(`initializes device time, converts and projects the same instant in ${zone}`, () => inZone(zone, () => {
      assert.equal(deviceLocalDateTime(clock()), local);
      assert.equal(deviceUtcOffset(clock()), offset);
      const attempt = createCollectionAttempt(context, () => "key", clock);
      assert.equal(attempt.localOccurredAt, local);
      assert.equal(attempt.occurrenceOffset, offset);
      const reviewed = reviewCollectionAttempt(attempt, clock);
      assert.equal(reviewed.error, null);
      const parsed = parseCollectionInput({ occurredAt: reviewed.occurredAt }, clock);
      assert.equal(parsed.occurredAtUtc.toISOString(), clock().toISOString());
      assert.equal(parsed.occurrenceOffset, offset);
      const persisted = new Date(parsed.occurredAtUtc); // Timestamptz(3) + declared offset.
      const delta = offset === "+00:00" ? 0 : offset === "-03:00" ? -180 : 345;
      const reloaded = `${new Date(persisted.getTime() + delta * 60_000).toISOString().slice(0, -1)}${offset}`;
      const detail = serializeCollectionDetail({ id: "id", occurredAt: reloaded, confirmedAt: clock(), ...context });
      assert.equal(detail.occurredAt, parsed.occurredAt);
      inZone("Pacific/Honolulu", () => {
        assert.match(formatCollectionOccurrence(detail.occurredAt), new RegExp(`UTC\\${offset[0]}${offset.slice(1)}`));
        assert.equal(parseCollectionInput({ occurredAt: detail.occurredAt }, clock).occurredAtUtc.toISOString(), clock().toISOString());
      });
    }));
  }

  it("keeps edited time, milliseconds and key across review, correction and failure", () => inZone("UTC", () => {
    const initial = createCollectionAttempt(context, () => "stable", clock);
    const edited = updateCollectionLocalOccurrence(initial, "2026-09-30T23:59:59.987", "+05:45", false);
    const review = reviewCollectionAttempt(edited, clock);
    assert.equal(review.occurredAt, "2026-09-30T23:59:59.987+05:45");
    const failed = failCollectionSubmission(beginCollectionSubmission(review), "Erro");
    assert.equal(failed.occurredAt, review.occurredAt);
    assert.equal(editCollectionAttempt(failed).localOccurredAt, edited.localOccurredAt);
    assert.equal(failed.idempotencyKey, "stable");
  }));

  it("includes native-control omitted seconds without claiming local time is UTC", () => {
    assert.equal(localOccurrenceToRfc3339("2026-09-30T23:59", "-03:00"), "2026-09-30T23:59:00-03:00");
    assert.equal(parseCollectionInput({ occurredAt: "2026-09-30T23:59:00-03:00" }, clock).occurredAtUtc.toISOString(), "2026-10-01T02:59:00.000Z");
  });

  it("rejects invalid calendars, empty and future values without replacing input", () => {
    const initial = createCollectionAttempt(context, () => "key", clock);
    for (const local of ["", "2026-02-30T10:00", "2027-01-01T00:00"]) {
      const review = reviewCollectionAttempt(updateCollectionLocalOccurrence(initial, local, "+00:00", false), clock);
      assert.equal(review.phase, "editing");
      assert.ok(review.error);
      assert.equal(review.localOccurredAt, local);
    }
    for (const offset of ["-00:00", "+14:01", "+05:60"]) {
      assert.ok(reviewCollectionAttempt(updateCollectionLocalOccurrence(initial, "2026-09-01T00:00", offset, false), clock).error);
    }
  });

  it("uses the selected date's seasonal offset and rejects nonexistent/repeated hours", () => inZone("America/New_York", () => {
    assert.equal(deviceOffsetForLocal("2026-01-15T09:00"), "-05:00");
    assert.equal(deviceOffsetForLocal("2026-07-15T09:00"), "-04:00");
    assert.throws(() => deviceOffsetForLocal("2026-03-08T02:30"), /não existe/);
    assert.throws(() => deviceOffsetForLocal("2026-11-01T01:30"), /duas vezes/);
    const initial = createCollectionAttempt(context, () => "key", clock);
    for (const offset of ["-04:00", "-05:00"]) {
      const review = reviewCollectionAttempt(updateCollectionLocalOccurrence(initial, "2026-11-01T01:30", offset, false), () => new Date("2026-12-01"));
      assert.equal(review.error, null);
      assert.equal(review.occurrenceOffset, offset);
    }
  }));

  it("formats the declared civil time deterministically and preserves fractional precision", () => {
    assert.equal(formatCollectionOccurrence("2026-09-15T09:00:00.123-03:00"), "15/09/2026 09:00:00.123 (UTC-03:00)");
    assert.equal(formatCollectionOccurrence("2026-09-15T12:00:00.000Z"), "15/09/2026 12:00:00 (UTC+00:00)");
  });
});

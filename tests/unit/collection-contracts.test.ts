import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CollectionContractError,
  parseCollectionInput,
} from "../../src/app/api/server/collections/collection.contracts";

const now = () => new Date("2026-09-15T12:00:00.000Z");

function rejects(value: unknown) {
  assert.throws(
    () => parseCollectionInput(value, now),
    (error) =>
      error instanceof CollectionContractError && error.code === "INVALID_REQUEST",
  );
}

describe("collection temporal contracts", () => {
  it("accepts only the closed occurredAt body and normalizes UTC", () => {
    const parsed = parseCollectionInput(
      { occurredAt: "2026-09-15T08:59:59.123-03:00" },
      now,
    );
    assert.equal(parsed.occurredAtUtc.toISOString(), "2026-09-15T11:59:59.123Z");
    assert.equal(parsed.occurrenceOffset, "-03:00");
    assert.equal(parsed.occurredAt, "2026-09-15T08:59:59.123-03:00");

    rejects({ occurredAt: "2026-09-15T09:00:00-03:00", userId: "forged" });
    rejects({});
    rejects({ occurredAt: 1 });
  });

  it("accepts Z, numeric offsets and equality with the injected clock", () => {
    assert.deepEqual(
      parseCollectionInput({ occurredAt: "2026-09-15T12:00:00Z" }, now),
      {
        occurredAtUtc: new Date("2026-09-15T12:00:00.000Z"),
        occurrenceOffset: "Z",
        occurredAt: "2026-09-15T12:00:00.000Z",
      },
    );
    assert.equal(
      parseCollectionInput(
        { occurredAt: "2026-09-15T12:00:00+00:00" },
        now,
      ).occurrenceOffset,
      "+00:00",
    );
    assert.equal(
      parseCollectionInput(
        { occurredAt: "2026-09-15T22:00:00+14:00" },
        now,
      ).occurrenceOffset,
      "+14:00",
    );
  });

  it("rejects ambiguous, impossible, imprecise or future instants", () => {
    for (const occurredAt of [
      "2026-09-15T09:00:00",
      "2026-09-15 09:00:00-03:00",
      "2026-02-30T09:00:00-03:00",
      "2026-09-15T09:00:60-03:00",
      "2026-09-15T09:00:00-00:00",
      "2026-09-15T09:00:00+14:01",
      "2026-09-15T09:00:00-14:01",
      "2026-09-15T09:00:00.1234-03:00",
      "2026-09-15T09:00:00-03",
      "2026-09-15T09:00:00.000-03:01",
    ]) {
      rejects({ occurredAt });
    }
  });
});

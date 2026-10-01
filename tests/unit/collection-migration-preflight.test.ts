import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCollectionMigrationPreflight,
  type CollectionMigrationPreflightSnapshot,
} from "../../scripts/imp-004-migration-preflight";

const safeSnapshot = (): CollectionMigrationPreflightSnapshot => ({
  migrationHistoryAligned: true,
  collectionCount: 3,
  orphanedAreaCount: 0,
  orphanedUserCount: 0,
  nonDerivableLaboratoryCount: 0,
  divergentLaboratoryCount: 0,
  scientificChildCounts: {
    water: 1,
    soil: 1,
    vegetation: 1,
    terrain: 1,
    diagnoses: 1,
  },
});

describe("IMP-004 migration preflight", () => {
  it("returns only sanitized counts for a safe additive migration", () => {
    assert.deepEqual(evaluateCollectionMigrationPreflight(safeSnapshot()), {
      ok: true,
      counts: {
        collections: 3,
        water: 1,
        soil: 1,
        vegetation: 1,
        terrain: 1,
        diagnoses: 1,
      },
    });
  });

  for (const [field, code] of [
    ["migrationHistoryAligned", "IMP004_MIGRATION_DRIFT"],
    ["orphanedAreaCount", "IMP004_ORPHANED_AREA"],
    ["orphanedUserCount", "IMP004_ORPHANED_USER"],
    ["nonDerivableLaboratoryCount", "IMP004_LABORATORY_NOT_DERIVABLE"],
    ["divergentLaboratoryCount", "IMP004_LABORATORY_DIVERGENCE"],
  ] as const) {
    it(`aborts before writes for ${field}`, () => {
      const snapshot = safeSnapshot();
      if (field === "migrationHistoryAligned") snapshot[field] = false;
      else snapshot[field] = 1;
      assert.throws(
        () => evaluateCollectionMigrationPreflight(snapshot),
        new RegExp(code),
      );
    });
  }

  it("rejects invalid or negative counters without exposing record content", () => {
    const snapshot = safeSnapshot();
    snapshot.collectionCount = -1;
    assert.throws(
      () => evaluateCollectionMigrationPreflight(snapshot),
      /IMP004_INVALID_PREFLIGHT_SNAPSHOT/,
    );
  });
});

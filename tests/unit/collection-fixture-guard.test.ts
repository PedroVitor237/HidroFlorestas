import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  COLLECTION_FIXTURES,
  COLLECTION_FIXTURE_PREFIX,
  type CollectionFixtureActionsFactory,
  cleanupCollectionFixtures,
  setupCollectionFixtures,
  validateCollectionFixtureEnvironment,
} from "../fixtures/collections";

const validEnvironment = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/development",
  TEST_DATABASE_URL: "postgresql://user:password@localhost:5432/imp004_test",
  TEST_DATABASE_CONFIRMATION: "HIDROFLORESTAS_AUTH_TEST",
  E2E_USER_PASSWORD: "fixture-password",
};

describe("collection fixture guard", () => {
  it("fails closed before setup or cleanup for every unsafe environment", async () => {
    const unsafe = [
      { ...validEnvironment, NODE_ENV: "development" },
      { ...validEnvironment, TEST_DATABASE_URL: undefined },
      { ...validEnvironment, TEST_DATABASE_URL: validEnvironment.DATABASE_URL },
      { ...validEnvironment, TEST_DATABASE_CONFIRMATION: "wrong" },
      { ...validEnvironment, E2E_USER_PASSWORD: undefined },
    ];
    for (const environment of unsafe) {
      assert.throws(() => validateCollectionFixtureEnvironment(environment));
      await assert.rejects(setupCollectionFixtures(environment));
      await assert.rejects(cleanupCollectionFixtures(environment));
    }
  });

  it("uses an exclusive allowlist and child-first cleanup", () => {
    assert.equal(COLLECTION_FIXTURE_PREFIX, "IMP-004 E2E");
    const allIds = [
      ...COLLECTION_FIXTURES.userIds,
      ...COLLECTION_FIXTURES.laboratoryIds,
      ...COLLECTION_FIXTURES.areaIds,
      ...COLLECTION_FIXTURES.collectionIds,
    ];
    assert.equal(new Set(allIds).size, allIds.length);
    assert.ok(allIds.every((id) => /^00000000-0000-4000-8000-\d{12}$/.test(id)));
    assert.deepEqual(COLLECTION_FIXTURES.cleanupOrder, [
      "CollectionData",
      "CollectionArea",
      "ResearchersLinked",
      "LaboratoryRoom",
      "User",
    ]);
  });

  it("runs cleanup before setup and disconnects after success", async () => {
    const events: string[] = [];
    const factory: CollectionFixtureActionsFactory = () => ({
      cleanup: async () => void events.push("cleanup"),
      setup: async () => void events.push("setup"),
      count: async () => ({ collections: 0 }),
      disconnect: async () => void events.push("disconnect"),
    });
    await setupCollectionFixtures(validEnvironment, factory);
    assert.deepEqual(events, ["cleanup", "setup", "disconnect"]);
  });

  it("disconnects after an induced setup failure", async () => {
    const events: string[] = [];
    const factory: CollectionFixtureActionsFactory = () => ({
      cleanup: async () => void events.push("cleanup"),
      setup: async () => {
        events.push("setup");
        throw new Error("induced");
      },
      count: async () => ({}),
      disconnect: async () => void events.push("disconnect"),
    });
    await assert.rejects(setupCollectionFixtures(validEnvironment, factory), /induced/);
    assert.deepEqual(events, ["cleanup", "setup", "cleanup", "disconnect"]);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DASHBOARD_FIXTURE_CONFIRMATION,
  DASHBOARD_FIXTURE_PREFIX,
  DASHBOARD_FIXTURES,
  cleanupDashboardFixtures,
  setupDashboardFixtures,
  type DashboardFixtureActionsFactory,
  validateDashboardFixtureEnvironment,
} from "../fixtures/dashboard-history";

const validEnvironment = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://owner:secret@development.example:5432/app",
  TEST_DATABASE_URL: "postgresql://owner:secret@test.example:5432/imp007_test",
  DASHBOARD_FIXTURE_CONFIRMATION,
  E2E_USER_PASSWORD: "fixture-password",
};

describe("dashboard fixture guard", () => {
  it("accepts only an explicitly confirmed isolated test database", () => {
    const safe = validateDashboardFixtureEnvironment(validEnvironment);
    assert.match(safe.testDatabaseUrl, /imp007_test/);
    assert.notEqual(safe.testDatabaseUrl, safe.developmentDatabaseUrl);
  });

  it("fails closed for every unsafe environment", () => {
    const unsafe = [
      { ...validEnvironment, NODE_ENV: "development" },
      { ...validEnvironment, TEST_DATABASE_URL: undefined },
      { ...validEnvironment, TEST_DATABASE_URL: validEnvironment.DATABASE_URL },
      { ...validEnvironment, DASHBOARD_FIXTURE_CONFIRMATION: "wrong" },
      { ...validEnvironment, E2E_USER_PASSWORD: undefined },
      { ...validEnvironment, TEST_DATABASE_URL: "mysql://test.example/imp007_test" },
      { ...validEnvironment, TEST_DATABASE_URL: "not-a-url" },
      {
        ...validEnvironment,
        TEST_DATABASE_URL:
          "postgresql://owner:secret@production.example:5432/app",
      },
    ];
    for (const environment of unsafe) {
      assert.throws(() => validateDashboardFixtureEnvironment(environment));
    }
  });

  it("uses exclusive allowlisted identifiers and child-first cleanup", () => {
    const allIds = [
      ...DASHBOARD_FIXTURES.userIds,
      ...DASHBOARD_FIXTURES.laboratoryIds,
      ...DASHBOARD_FIXTURES.areaIds,
      ...DASHBOARD_FIXTURES.collectionIds,
    ];
    assert.equal(DASHBOARD_FIXTURE_PREFIX, "IMP-007 E2E");
    assert.equal(new Set(allIds).size, allIds.length);
    assert.ok(
      allIds.every((id) =>
        /^00000000-0000-4000-8000-0000000007\d{2}$/.test(id),
      ),
    );
    assert.deepEqual(DASHBOARD_FIXTURES.cleanupOrder, [
      "CollectionData",
      "CollectionArea",
      "ResearchersLinked",
      "LaboratoryRoom",
      "User",
    ]);
  });

  it("guards setup and cleanup before creating database actions", async () => {
    let factoryCalls = 0;
    const factory: DashboardFixtureActionsFactory = () => {
      factoryCalls += 1;
      throw new Error("must not run");
    };
    const unsafe = {
      ...validEnvironment,
      DASHBOARD_FIXTURE_CONFIRMATION: "wrong",
    };
    await assert.rejects(setupDashboardFixtures(unsafe, factory));
    await assert.rejects(cleanupDashboardFixtures(unsafe, factory));
    assert.equal(factoryCalls, 0);
  });

  it("cleans before setup and verifies zero remaining fixtures", async () => {
    const events: string[] = [];
    const factory: DashboardFixtureActionsFactory = () => ({
      cleanup: async () => void events.push("cleanup"),
      setup: async () => void events.push("setup"),
      count: async () => {
        events.push("count");
        return { users: 0, laboratories: 0, areas: 0, collections: 0 };
      },
      disconnect: async () => void events.push("disconnect"),
    });
    await setupDashboardFixtures(validEnvironment, factory);
    assert.deepEqual(events, ["cleanup", "count", "setup", "disconnect"]);
  });

  it("cleans and disconnects after setup failure", async () => {
    const events: string[] = [];
    const factory: DashboardFixtureActionsFactory = () => ({
      cleanup: async () => void events.push("cleanup"),
      setup: async () => {
        events.push("setup");
        throw new Error("induced setup failure");
      },
      count: async () => {
        events.push("count");
        return { users: 0 };
      },
      disconnect: async () => void events.push("disconnect"),
    });
    await assert.rejects(
      setupDashboardFixtures(validEnvironment, factory),
      /induced setup failure/,
    );
    assert.deepEqual(events, [
      "cleanup",
      "count",
      "setup",
      "cleanup",
      "count",
      "disconnect",
    ]);
  });

  it("fails cleanup when allowlisted records remain", async () => {
    const factory: DashboardFixtureActionsFactory = () => ({
      cleanup: async () => undefined,
      setup: async () => undefined,
      count: async () => ({ users: 1 }),
      disconnect: async () => undefined,
    });
    await assert.rejects(
      cleanupDashboardFixtures(validEnvironment, factory),
      /cleanup incomplete: users/,
    );
  });
});

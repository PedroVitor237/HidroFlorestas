import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  AUTH_FIXTURE_CONFIRMATION,
  runAuthFixtureCommand,
  validateAuthFixtureEnvironment,
} from "../fixtures/auth-users";

const validEnvironment = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/development",
  TEST_DATABASE_URL: "postgresql://user:password@localhost:5432/auth_test",
  TEST_DATABASE_CONFIRMATION: AUTH_FIXTURE_CONFIRMATION,
  E2E_USER_PASSWORD: "fixture-password",
};

describe("auth fixture database guard", () => {
  it("rejects each missing required variable", () => {
    for (const key of [
      "NODE_ENV",
      "DATABASE_URL",
      "TEST_DATABASE_URL",
      "TEST_DATABASE_CONFIRMATION",
    ] as const) {
      const environment: Record<string, string | undefined> = {
        ...validEnvironment,
      };
      delete environment[key];
      assert.throws(() => validateAuthFixtureEnvironment(environment), key);
    }
  });

  it("requires the exact test mode and confirmation", () => {
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          NODE_ENV: "development",
        }),
      /NODE_ENV/,
    );
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          TEST_DATABASE_CONFIRMATION: "yes",
        }),
      /TEST_DATABASE_CONFIRMATION/,
    );
  });

  it("rejects malformed, unsupported, and normalized-equal URLs", () => {
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          TEST_DATABASE_URL: "not-a-url",
        }),
      /TEST_DATABASE_URL/,
    );
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          DATABASE_URL: "https://localhost/development",
        }),
      /DATABASE_URL/,
    );
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          DATABASE_URL: "postgresql://user:password@LOCALHOST:5432/auth_test?a=1&b=2",
          TEST_DATABASE_URL:
            "postgresql://user:password@localhost:5432/auth_test?b=2&a=1",
        }),
      /different/i,
    );
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          DATABASE_URL: "postgres://user:password@localhost:5432/auth_test",
          TEST_DATABASE_URL:
            "postgresql://user:password@localhost:5432/auth_test",
        }),
      /different/i,
    );
  });

  it("never falls back to DATABASE_URL", () => {
    assert.throws(
      () =>
        validateAuthFixtureEnvironment({
          ...validEnvironment,
          TEST_DATABASE_URL: undefined,
        }),
      /TEST_DATABASE_URL/,
    );
  });

  it("returns the explicit normalized test URL for the complete safe combination", () => {
    const result = validateAuthFixtureEnvironment(validEnvironment);
    assert.match(result.testDatabaseUrl, /auth_test/);
    assert.notEqual(result.testDatabaseUrl, result.developmentDatabaseUrl);
  });

  it("refuses before creating a connection or writing", async () => {
    let factoryCalls = 0;
    let writeCalls = 0;

    await assert.rejects(
      runAuthFixtureCommand(
        "setup",
        { ...validEnvironment, TEST_DATABASE_CONFIRMATION: "wrong" },
        () => {
          factoryCalls += 1;
          return {
            setup: async () => {
              writeCalls += 1;
            },
            teardown: async () => undefined,
            blockActive: async () => undefined,
            restoreActive: async () => undefined,
            disconnect: async () => undefined,
          };
        },
      ),
    );

    assert.equal(factoryCalls, 0);
    assert.equal(writeCalls, 0);
  });

  it("requires the fixture password before creating the setup connection", async () => {
    let factoryCalls = 0;
    await assert.rejects(
      runAuthFixtureCommand(
        "setup",
        { ...validEnvironment, E2E_USER_PASSWORD: undefined },
        () => {
          factoryCalls += 1;
          throw new Error("must not create actions");
        },
      ),
      /E2E_USER_PASSWORD/,
    );
    assert.equal(factoryCalls, 0);
  });

  it("uses the explicit test URL only after every guard passes", async () => {
    const calls: string[] = [];
    await runAuthFixtureCommand("setup", validEnvironment, (safe) => {
      calls.push(safe.testDatabaseUrl);
      assert.match(safe.testDatabaseUrl, /auth_test/);
      assert.doesNotMatch(safe.testDatabaseUrl, /development/);
      return {
        setup: async (password) => {
          assert.equal(password, validEnvironment.E2E_USER_PASSWORD);
          calls.push("setup");
        },
        teardown: async () => {
          calls.push("teardown");
        },
        blockActive: async () => {
          calls.push("block-active");
        },
        restoreActive: async () => {
          calls.push("restore-active");
        },
        disconnect: async () => {
          calls.push("disconnect");
        },
      };
    });

    assert.deepEqual(calls.slice(1), ["setup", "disconnect"]);
  });
});


describe("fixture target identity", () => {
  it("rejects the same database with different credentials, options and pooler alias", () => {
    for (const target of [
      "postgresql://other:secret@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require",
      "postgresql://other:secret@ep-example-pooler.us-east-1.aws.neon.tech/neondb",
    ]) {
      assert.throws(() => validateAuthFixtureEnvironment({
        ...validEnvironment,
        DATABASE_URL: "postgresql://owner:password@ep-example.us-east-1.aws.neon.tech/neondb",
        TEST_DATABASE_URL: target,
      }), /different/);
    }
  });
});

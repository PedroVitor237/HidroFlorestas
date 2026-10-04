import assert from "node:assert/strict";
import { test } from "node:test";
import { localPostgresqlContext } from "../../src/app/api/server/lib/local-postgresql-context";
import { imp006Target } from "../../scripts/imp006-test-preflight";
import { redactMailValidation } from "../../scripts/mail-validation-diagnostics";

test("accounts PostgreSQL opt-in preserves the original default and refuses its destination", () => {
  assert.equal(localPostgresqlContext({}).port, "55426");
  assert.equal(localPostgresqlContext({}).directory, "imp006-postgresql");
  assert.equal(localPostgresqlContext({ ACCOUNTS_LOCAL_POSTGRESQL: "1" }).port, "55427");
  assert.throws(() => localPostgresqlContext({ ACCOUNTS_LOCAL_POSTGRESQL: "true" }), /opt-in/);
  const env = { ACCOUNTS_LOCAL_POSTGRESQL: "1", IMP006_LOCAL_POSTGRESQL: "1", IMP006_DATABASE_VARIABLE: "TEST_DATABASE_URL", TEST_DATABASE_CONFIRMATION: "HIDROFLORESTAS_AUTH_TEST", TEST_DATABASE_URL: "postgresql://synthetic:synthetic@127.0.0.1:55427/postgres", DATABASE_URL: "postgresql://synthetic:synthetic@127.0.0.1:55427/postgres" };
  assert.equal(imp006Target(env).database, "postgres");
  assert.throws(() => imp006Target({ ...env, TEST_DATABASE_URL: env.TEST_DATABASE_URL.replace("55427", "55426") }), /owned loopback/);
  assert.throws(() => imp006Target({ ...env, DATABASE_URL: env.DATABASE_URL.replace("55427", "55426") }), /owned loopback/);
  assert.throws(() => imp006Target({ ...env, TEST_DATABASE_URL: env.TEST_DATABASE_URL.replace("127.0.0.1", "remote.invalid") }), /owned loopback/);
});

test("account evidence redacts individual proof keys, request key and tester addresses", () => {
  const env = { ACCOUNT_PROOF_KEYS: JSON.stringify({ synthetic: "synthetic-proof-key-material" }), ACCOUNT_REQUEST_KEY: "synthetic-request-key-material", ACCOUNT_TESTER_ALLOWLIST: "first@synthetic.invalid,second@synthetic.invalid" };
  const source = `${Object.values(env).join(" ")} synthetic-proof-key-material first@synthetic.invalid second@synthetic.invalid`;
  const output = redactMailValidation(source, env);
  for (const value of [...Object.values(env), "synthetic-proof-key-material", "first@synthetic.invalid", "second@synthetic.invalid"]) assert.equal(output.includes(value), false);
});

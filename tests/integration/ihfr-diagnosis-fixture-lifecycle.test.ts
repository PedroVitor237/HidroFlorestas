import assert from "node:assert/strict";
import { test } from "node:test";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { countIHFRDiagnosisFixtures, setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";

test("IHFR fixtures cover actors, contexts and lifecycle states", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    assert.deepEqual(await countIHFRDiagnosisFixtures(client), {
      users: 6, laboratories: 2, supplements: 1, diagnoses: 3,
      current: 1, operations: 4, events: 6,
    });
  });
});

test("IHFR fixture schema is discarded after an injected failure", async () => {
  await assert.rejects(
    withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
      await setupIHFRDiagnosisFixtures(client);
      throw new Error("INJECTED_FIXTURE_FAILURE");
    }),
    /INJECTED_FIXTURE_FAILURE/,
  );
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

test("IHFR supplement, diagnosis, operation and event reject UPDATE and DELETE with triggers enabled", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const cases = [
      { table: "ExperimentalIHFRInputSupplement", column: "landUseType", value: "URBAN" },
      { table: "ExperimentalIHFRDiagnosis", column: "rawScore", value: 0.4 },
      { table: "IHFRDiagnosisOperation", column: "requestHash", value: `sha256:${"0".repeat(64)}` },
      { table: "IHFRDiagnosisLifecycleEvent", column: "reason", value: "changed" },
    ] as const;
    for (const entry of cases) {
      const row = await client.query(`SELECT id FROM "${entry.table}" LIMIT 1`);
      assert.equal(row.rowCount, 1);
      const id = row.rows[0].id as string;
      const before = (await client.query(`SELECT * FROM "${entry.table}" WHERE id=$1`, [id])).rows[0];
      await assert.rejects(
        client.query(`UPDATE "${entry.table}" SET "${entry.column}"=$1 WHERE id=$2`, [entry.value, id]),
        /IMP006_IMMUTABLE_RECORD/,
      );
      await assert.rejects(client.query(`DELETE FROM "${entry.table}" WHERE id=$1`, [id]), /IMP006_IMMUTABLE_RECORD/);
      assert.deepEqual((await client.query(`SELECT * FROM "${entry.table}" WHERE id=$1`, [id])).rows[0], before);
    }
    const triggers = await client.query(`SELECT count(*)::int AS count FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema() AND t.tgname LIKE 'imp006_%_immutable' AND t.tgenabled='O'`);
    assert.equal(triggers.rows[0].count, 4);
  });
});

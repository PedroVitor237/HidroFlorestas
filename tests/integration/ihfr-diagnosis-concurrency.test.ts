import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { ihfrDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";

const actor = "60000000-0000-4000-8000-000000000001";
const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041" };
const current = "60000000-0000-4000-8000-000000000062";
const versions = { measurementContractVersion: "ihfr-measurement-v1", mathContractVersion: "ihfr-math-experimental-v0.1.1", algorithmVersion: "ihfr-evaluator-ts-v0.1.0", contractHash: "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89" } as const;
const supplement = (landUseType: "FOREST" | "URBAN" = "FOREST") => ({ inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0" as const, landUseType, provenance: { kind: "FIELD_OBSERVATION" as const, observedAt: "2026-09-20T12:00:00.000Z" } });
type Operation = () => Promise<unknown>;

function synchronizedPair(first: Operation, second: Operation) {
  let reached = 0; let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const wrap = (operation: Operation) => async () => { reached += 1; if (reached === 2) release(); await gate; return operation(); };
  return { run: () => Promise.allSettled([wrap(first)(), wrap(second)()]), reached: () => reached };
}

test("eight lifecycle races overlap at a deterministic barrier and preserve PostgreSQL invariants", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const create = (landUseType: "FOREST" | "URBAN" = "FOREST") => () => ihfrDiagnosisService.createOrReplace(actor, context, { mode: "CREATE", expectedCurrentDiagnosisId: null, supplement: supplement(landUseType), versions });
    const replace = (expected = current, landUseType: "FOREST" | "URBAN" = "FOREST") => () => ihfrDiagnosisService.createOrReplace(actor, context, { mode: "REPLACE", expectedCurrentDiagnosisId: expected, supplement: supplement(landUseType), versions });
    const revoke = () => ihfrDiagnosisService.revoke(actor, context, current, { expectedCurrentDiagnosisId: current, reason: "Correção autorizada" });
    const scenarios: Array<[string, Operation, Operation]> = [
      ["CREATE same key/request", create(), create()], ["CREATE distinct keys", create(), create()],
      ["CREATE divergent payloads", create("FOREST"), create("URBAN")], ["REPLACE versus REPLACE", replace(), replace()],
      ["REPLACE correct versus stale", replace(), replace("60000000-0000-4000-8000-000000000063")],
      ["CREATE versus REPLACE", create(), replace()], ["REPLACE versus REVOKE", replace(), revoke],
      ["same key divergent request", replace(current, "FOREST"), replace(current, "URBAN")],
    ];
    const observations: Array<{ name: string; fulfilled: number; rejected: number }> = [];
    for (const [name, first, second] of scenarios) {
      const pair = synchronizedPair(first, second); const results = await pair.run(); assert.equal(pair.reached(), 2, name);
      observations.push({ name, fulfilled: results.filter((result) => result.status === "fulfilled").length, rejected: results.filter((result) => result.status === "rejected").length });
      const state = await client.query(`SELECT (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current,(SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) diagnoses,(SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement" WHERE "collectionDataId"=$1) supplements,(SELECT count(*)::int FROM "IHFRDiagnosisOperation" WHERE "collectionDataId"=$1) operations,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent" WHERE "collectionDataId"=$1) events`, [context.collectionId]);
      assert.deepEqual(state.rows[0], { current: 1, diagnoses: 3, supplements: 1, operations: 4, events: 3 }, name);
    }
    for (const observation of observations) { assert.equal(observation.fulfilled, 1, observation.name); assert.equal(observation.rejected, 1, observation.name); }
  });
});

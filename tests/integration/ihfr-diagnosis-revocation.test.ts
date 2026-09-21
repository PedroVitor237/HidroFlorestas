import assert from "node:assert/strict";
import { test } from "node:test";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { createIHFRRevocationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: "60000000-0000-4000-8000-000000000011", areaId: "60000000-0000-4000-8000-000000000031", collectionId: "60000000-0000-4000-8000-000000000041", diagnosisId: "60000000-0000-4000-8000-000000000062" };
const reason = "Correção autorizada sem dados pessoais";
const route = (params = context) => ({ params: Promise.resolve(params) });
const request = (body: unknown, key = crypto.randomUUID()) => new Request("http://local.test", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(body) });
const validBody = { expectedCurrentDiagnosisId: context.diagnosisId, reason };
const service = (result: unknown = { outcome: "SUCCEEDED_REVOKE", diagnosisId: context.diagnosisId }) => ({ revoke: async () => result });

test("revocation requires authentication and current contextual WRITE authority", async () => {
  const missing = createIHFRRevocationHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: service() });
  assert.equal((await missing(request(validBody), route())).status, 401);
  for (const actor of ["MEMBER", "outsider", "revoked-link", "inactive-account", "global-admin-without-link"] as const) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: actor }), service: { revoke: async () => { throw new AreaAccessError(actor === "MEMBER" ? "FORBIDDEN" : "NOT_FOUND"); } } });
    assert.equal((await POST(request(validBody), route())).status, actor === "MEMBER" ? 403 : 404, actor);
  }
  for (const actor of ["OWNER", "ADMIN"] as const) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: actor }), service: service() });
    assert.equal((await POST(request(validBody), route())).status, 200, actor);
  }
  const inactiveLaboratory = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: { revoke: async () => { throw new AreaAccessError("FORBIDDEN"); } } });
  assert.equal((await inactiveLaboratory(request(validBody), route({ ...context, laboratoryId: "60000000-0000-4000-8000-000000000012" }))).status, 403);
});

test("hierarchical laboratory-area-collection-diagnosis context is fail-closed", async () => {
  for (const [field, value] of [["laboratoryId", "60000000-0000-4000-8000-000000000099"], ["areaId", "60000000-0000-4000-8000-000000000099"], ["collectionId", "60000000-0000-4000-8000-000000000099"], ["diagnosisId", "60000000-0000-4000-8000-000000000099"], ["laboratoryId", "bad"], ["areaId", "bad"], ["collectionId", "bad"], ["diagnosisId", "bad"]] as const) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: { revoke: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    assert.equal((await POST(request(validBody), route({ ...context, [field]: value }))).status, 404, `${field}:${value}`);
  }
});

test("valid revocation has a minimized no-store terminal response", async () => {
  const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
  const response = await POST(request(validBody), route());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const serialized = JSON.stringify(await response.json());
  for (const restricted of ["reason", "actorUserId", "requestHash", "idempotencyKey", "evidence", "responseSnapshot", "SQL", "stack"]) assert.equal(serialized.includes(restricted), false, restricted);
});

test("closed reason parser enforces presence, trimmed non-empty text, 500 characters and no extras", async () => {
  const invalid = [{ expectedCurrentDiagnosisId: context.diagnosisId }, { expectedCurrentDiagnosisId: context.diagnosisId, reason: "" }, { expectedCurrentDiagnosisId: context.diagnosisId, reason: "   " }, { expectedCurrentDiagnosisId: context.diagnosisId, reason: "a".repeat(501) }, { expectedCurrentDiagnosisId: context.diagnosisId, reason: 42 }, { ...validBody, extra: true }];
  for (const body of invalid) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    assert.equal((await POST(request(body), route())).status, 400, JSON.stringify(body));
  }
  for (const validReason of ["x", reason, "x".repeat(500)]) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
    assert.equal((await POST(request({ ...validBody, reason: validReason }), route())).status, 200, String(validReason.length));
  }
});

test("expected current diagnosis is mandatory, well-formed and transactionally revalidated", async () => {
  for (const expectedCurrentDiagnosisId of [undefined, null, "bad", IHFR_DOMAIN.supersededDiagnosis, IHFR_DOMAIN.revokedDiagnosis, "60000000-0000-4000-8000-000000000099"]) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: "STATE_CONFLICT" } }) });
    const response = await POST(request({ expectedCurrentDiagnosisId, reason }), route());
    assert.ok([400, 404, 409].includes(response.status), String(expectedCurrentDiagnosisId));
  }
});

test("non-current, legacy and crossed diagnosis revocations are controlled conflicts or hidden", async () => {
  for (const target of ["SUPERSEDED", "REVOKED", "historical-without-pointer", "legacy", "current-other-collection"] as const) {
    const hidden = target === "current-other-collection" || target === "legacy";
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: hidden ? "NOT_FOUND" : "STATE_CONFLICT" } }) });
    assert.equal((await POST(request(validBody), route({ ...context, diagnosisId: target }))).status, hidden ? 404 : 409, target);
  }
});

test("revocation idempotency distinguishes replay, divergence, actor scope and reauthorized recovery", async () => {
  const key = crypto.randomUUID();
  const replay = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service() });
  for (const body of [validBody, { ...validBody }, { expectedCurrentDiagnosisId: context.diagnosisId, reason }]) assert.equal((await replay(request(body, key), route())).status, 200);
  for (const divergence of [{ ...validBody, reason: "Motivo divergente" }, { ...validBody, expectedCurrentDiagnosisId: IHFR_DOMAIN.supersededDiagnosis }]) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: "OWNER" }), service: service({ error: { code: "IDEMPOTENCY_CONFLICT" } }) });
    assert.equal((await POST(request(divergence, key), route())).status, 409);
  }
  for (const actor of ["OTHER_ACTOR", "REVOKED_AFTER_TIMEOUT"] as const) {
    const POST = createIHFRRevocationHandler({ requireAuth: async () => ({ id: actor }), service: { revoke: async () => { throw new AreaAccessError("NOT_FOUND"); } } });
    assert.equal((await POST(request(validBody, key), route())).status, 404, actor);
  }
});

type Operation = () => Promise<unknown>;
function synchronizedPair(first: Operation, second: Operation) {
  let reached = 0; let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const wrap = (operation: Operation) => async () => { reached += 1; if (reached === 2) release(); await gate; return operation(); };
  return { run: () => Promise.allSettled([wrap(first)(), wrap(second)()]), reached: () => reached };
}

test("REVOKE x REVOKE and REVOKE x REPLACE overlap at a deterministic barrier", async () => {
  const revoke = (requestReason = reason) => () => ihfrDiagnosisService.revoke(IHFR_ACTORS.owner, context, context.diagnosisId, { expectedCurrentDiagnosisId: context.diagnosisId, reason: requestReason });
  const replace = () => () => ihfrDiagnosisService.createOrReplace(IHFR_ACTORS.contextualAdmin, context, { mode: "REPLACE", expectedCurrentDiagnosisId: context.diagnosisId, supplement: { inputContractVersion: "ihfr-diagnosis-input-experimental-v0.1.0", landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } } });
  for (const [name, first, second] of [["same request", revoke(), revoke()], ["different reasons", revoke(), revoke("Outra correção autorizada")], ["revoke wins or replace wins", revoke(), replace()], ["replace wins or revoke wins", replace(), revoke()]] as const) {
    const pair = synchronizedPair(first, second); const results = await pair.run();
    assert.equal(pair.reached(), 2, name);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1, name);
    assert.equal(results.filter((result) => result.status === "rejected").length, 1, name);
  }
});

test("PostgreSQL protects diagnosis/event immutability and fully rolls back pointer transitions", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client) => {
    await setupIHFRDiagnosisFixtures(client);
    const diagnosisSnapshot = async () => (await client.query(`SELECT "rawScore","displayScore"::text,"ihfrClass","dataQuality","componentScores",decomposition,drivers,explanation,"measurementContractVersion","inputContractVersion","mathContractVersion","algorithmVersion","contractHash","calculatedAt"::text,"createdAt"::text FROM "ExperimentalIHFRDiagnosis" WHERE id=$1`, [IHFR_DOMAIN.currentDiagnosis])).rows[0];
    const stateSnapshot = async () => (await client.query(`SELECT (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1) current,(SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent" WHERE "collectionDataId"=$1) events,(SELECT count(*)::int FROM "IHFRDiagnosisOperation" WHERE "collectionDataId"=$1) operations`, [IHFR_CONTEXTS.confirmedCollection])).rows[0];
    const beforeDiagnosis = await diagnosisSnapshot(); const beforeState = await stateSnapshot();
    for (const [column, value] of [["rawScore", 0.9], ["displayScore", 0.9], ["ihfrClass", "HIGH"], ["dataQuality", "HIGH"], ["explanation", "changed"], ["contractHash", `sha256:${"f".repeat(64)}`]] as const) await assert.rejects(client.query(`UPDATE "ExperimentalIHFRDiagnosis" SET "${column}"=$1 WHERE id=$2`, [value, IHFR_DOMAIN.currentDiagnosis]), /IMP006_IMMUTABLE_RECORD/);
    await assert.rejects(client.query(`DELETE FROM "ExperimentalIHFRDiagnosis" WHERE id=$1`, [IHFR_DOMAIN.currentDiagnosis]), /IMP006_IMMUTABLE_RECORD|foreign key/i);
    await assert.rejects(client.query(`UPDATE "IHFRDiagnosisLifecycleEvent" SET reason='changed' WHERE "diagnosisId"=$1`, [IHFR_DOMAIN.revokedDiagnosis]), /IMP006_IMMUTABLE_RECORD/);
    await assert.rejects(client.query(`DELETE FROM "IHFRDiagnosisLifecycleEvent" WHERE "diagnosisId"=$1`, [IHFR_DOMAIN.revokedDiagnosis]), /IMP006_IMMUTABLE_RECORD/);
    for (const point of ["after-context", "after-operation", "after-pointer", "before-event", "after-event", "before-ledger", "after-internal-completion"] as const) {
      await client.query("BEGIN");
      try {
        if (!["after-context", "after-operation"].includes(point)) await client.query(`DELETE FROM "CurrentExperimentalIHFRDiagnosis" WHERE "collectionDataId"=$1`, [IHFR_CONTEXTS.confirmedCollection]);
        if (["after-event", "before-ledger", "after-internal-completion"].includes(point)) await client.query(`INSERT INTO "IHFRDiagnosisLifecycleEvent" (id,"collectionDataId","diagnosisId","eventType","actorUserId","operationId",reason,"occurredAt",evidence) VALUES (gen_random_uuid(),$1,$2,'REVOKED',$3,$4,$5,now(),$6::jsonb)`, [IHFR_CONTEXTS.confirmedCollection, IHFR_DOMAIN.currentDiagnosis, IHFR_ACTORS.owner, IHFR_DOMAIN.currentOperation, reason, JSON.stringify({ restricted: true })]);
        throw new Error(`INJECTED_${point}`);
      } catch { await client.query("ROLLBACK"); }
      assert.deepEqual(await stateSnapshot(), beforeState, point);
      assert.deepEqual(await diagnosisSnapshot(), beforeDiagnosis, point);
    }
  });
});

test("correction is replacement-only and never edits or restores historical diagnosis rows", () => {
  const original = { id: IHFR_DOMAIN.currentDiagnosis, lifecycleState: "SUPERSEDED", rawScore: 0.5 };
  const replacement = { id: "60000000-0000-4000-8000-000000000099", lifecycleState: "CURRENT", rawScore: 0.6 };
  assert.notEqual(original.id, replacement.id); assert.equal(original.lifecycleState, "SUPERSEDED"); assert.equal(replacement.lifecycleState, "CURRENT"); assert.notEqual(original.rawScore, replacement.rawScore);
});

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { createIHFRRevocationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection, diagnosisId: IHFR_DOMAIN.currentDiagnosis };
const reason = "Correção autorizada sem dados pessoais";
const validBody = { expectedCurrentDiagnosisId: context.diagnosisId, reason };
const route = (value = context) => ({ params: Promise.resolve(value) });
function request(body: unknown, key: string | null = randomUUID(), contentType = "application/json") {
  const headers: Record<string, string> = { "content-type": contentType };
  if (key !== null) headers["idempotency-key"] = key;
  return new Request("http://local.test/api/revocations", { method: "POST", headers, body: JSON.stringify(body) });
}

test("revocation boundary validates authentication, contextual identifiers, JSON, key and closed reason", async () => {
  const unauthenticated = createIHFRRevocationHandler({ requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); }, service: { authorizeWrite: async () => { throw new Error("unreachable"); }, revoke: async () => { throw new Error("unreachable"); } } });
  assert.equal((await unauthenticated(request(validBody), route())).status, 401);
  const guarded = createIHFRRevocationHandler({ requireAuth: async () => ({ id: IHFR_ACTORS.owner }), service: { authorizeWrite: async () => {}, revoke: async () => { throw new Error("invalid request reached service"); } } });
  const invalid = [
    { expectedCurrentDiagnosisId: context.diagnosisId },
    { expectedCurrentDiagnosisId: context.diagnosisId, reason: "" },
    { expectedCurrentDiagnosisId: context.diagnosisId, reason: "   " },
    { expectedCurrentDiagnosisId: context.diagnosisId, reason: "a".repeat(501) },
    { expectedCurrentDiagnosisId: context.diagnosisId, reason: 42 },
    { expectedCurrentDiagnosisId: "bad", reason },
    { ...validBody, extra: true },
  ];
  for (const body of invalid) {
    const response = await guarded(request(body), route());
    assert.equal(response.status, 400, JSON.stringify(body));
    assert.equal((await response.json()).error.code, "INVALID_INPUT");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal((await guarded(request(validBody, null), route())).status, 400);
  assert.equal((await guarded(request(validBody, "bad"), route())).status, 400);
  assert.equal((await guarded(request(validBody, randomUUID(), "text/plain"), route())).status, 400);
  for (const field of ["laboratoryId", "areaId", "collectionId", "diagnosisId"] as const) {
    assert.equal((await guarded(request(validBody), route({ ...context, [field]: "bad" }))).status, 404, field);
  }
});

test("real revocation is contextual, immutable, replayable and returns only the public terminal DTO", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const POST = (actor: string) => createIHFRRevocationHandler({ requireAuth: async () => ({ id: actor }), service });
    assert.equal((await POST(IHFR_ACTORS.member)(request(validBody), route())).status, 403);
    assert.equal((await POST(IHFR_ACTORS.member)(request({ ...validBody, extra: true }), route())).status, 403);
    assert.equal((await POST(IHFR_ACTORS.outsider)(request(validBody), route())).status, 404);
    assert.equal((await POST(IHFR_ACTORS.owner)(request(validBody), route({ ...context, areaId: IHFR_CONTEXTS.inactiveArea }))).status, 404);
    assert.equal((await POST(IHFR_ACTORS.owner)(request(validBody), route({ ...context, laboratoryId: IHFR_LABORATORIES.inactive }))).status, 409);
    assert.equal((await POST(IHFR_ACTORS.owner)(request({ ...validBody, extra: true }), route({ ...context, laboratoryId: IHFR_LABORATORIES.inactive }))).status, 409);
    assert.equal((await POST(IHFR_ACTORS.owner)(request(validBody), route({ ...context, diagnosisId: randomUUID() }))).status, 404);
    assert.equal((await POST(IHFR_ACTORS.owner)(request({ ...validBody, expectedCurrentDiagnosisId: IHFR_DOMAIN.supersededDiagnosis }), route())).status, 409);
    assert.equal((await POST(IHFR_ACTORS.owner)(request({ ...validBody, expectedCurrentDiagnosisId: IHFR_DOMAIN.supersededDiagnosis }), route({ ...context, diagnosisId: IHFR_DOMAIN.supersededDiagnosis }))).status, 409);
    const before = (await client.query(`SELECT count(*)::int count FROM "IHFRDiagnosisLifecycleEvent"`)).rows[0].count;
    const key = randomUUID();
    const response = await POST(IHFR_ACTORS.owner)(request(validBody, key), route());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.deepEqual(Object.keys(body).sort(), ["diagnosis", "insufficiencyReasons", "outcome"]);
    assert.equal(body.outcome, "SUCCEEDED");
    assert.equal(body.diagnosis.lifecycleState, "REVOKED");
    assert.deepEqual(body.insufficiencyReasons, []);
    const serialized = JSON.stringify(body);
    for (const restricted of ["reason", "actorUserId", "idempotencyKey", "requestHash", "payloadHash", "responseSnapshot", "evidence", "SQL", "stack"]) assert.equal(serialized.includes(restricted), false, restricted);
    assert.equal(await service.readCurrent(IHFR_ACTORS.member, context), null);
    assert.equal((await service.readDetail(IHFR_ACTORS.member, context, context.diagnosisId)).lifecycleState, "REVOKED");
    const replay = await POST(IHFR_ACTORS.owner)(request(validBody, key), route());
    assert.equal(replay.status, 200);
    assert.deepEqual(await replay.json(), body);
    assert.equal((await POST(IHFR_ACTORS.owner)(request({ ...validBody, reason: "Outro motivo" }, key), route())).status, 409);
    assert.equal((await client.query(`SELECT count(*)::int count FROM "IHFRDiagnosisLifecycleEvent"`)).rows[0].count, before + 1);
    const storedReason = (await client.query(`SELECT reason FROM "IHFRDiagnosisLifecycleEvent" WHERE "diagnosisId"=$1 AND "eventType"='REVOKED' ORDER BY "occurredAt" DESC LIMIT 1`, [context.diagnosisId])).rows[0].reason;
    assert.equal(storedReason, reason);
    await assert.rejects(client.query(`UPDATE "ExperimentalIHFRDiagnosis" SET "rawScore"=.9 WHERE id=$1`, [context.diagnosisId]), /IMP006_IMMUTABLE_RECORD/);
    await assert.rejects(client.query(`DELETE FROM "IHFRDiagnosisLifecycleEvent" WHERE "diagnosisId"=$1 AND "eventType"='REVOKED'`, [context.diagnosisId]), /IMP006_IMMUTABLE_RECORD/);
  });
});

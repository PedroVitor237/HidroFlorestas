import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { createIHFREligibilityHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler";
import { createIHFRWriteHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { createIHFRCurrentHandler, createIHFRDetailHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";
import { createIHFRRevocationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler";
import { createIHFROperationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

const document = parse(readFileSync("specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-api.openapi.yaml", "utf8"));
const ajv = new Ajv2020({ strict: false, allErrors: true, multipleOfPrecision: 5 });
addFormats(ajv);
ajv.addSchema({ ...document, $id: "https://hidroflorestas.invalid/ihfr.openapi.yaml" });
const compile = (schema: unknown) => ajv.compile(schema as object);
const schema = (name: string) => compile({ $ref: `https://hidroflorestas.invalid/ihfr.openapi.yaml#/components/schemas/${name}` });
const validateCalculate = schema("CalculateRequest");
const validateOperation = schema("OperationResponse");
const validateDiagnosis = schema("PublicDiagnosis");
const validateEligibility = schema("EligibilityResponse");
const validateError = schema("ErrorEnvelope");

function conforms(validate: ReturnType<typeof compile>, value: unknown) {
  assert.equal(validate(value), true, JSON.stringify(validate.errors));
}

const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.confirmedCollection };
const base = `/api/laboratories/${context.laboratoryId}/areas/${context.areaId}/collections/${context.collectionId}/ihfr-diagnosis`;
const route = (extras = {}) => ({ params: Promise.resolve({ ...context, ...extras }) });
const requestBody = { mode: "REPLACE", expectedCurrentDiagnosisId: IHFR_DOMAIN.currentDiagnosis, supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00.000Z" } }, versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash } };

test("OpenAPI 3.1 schemas reject malformed input and accept well-formed version mismatches", () => {
  const writeResponses = document.paths["/api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}/ihfr-diagnosis/diagnoses"].post.responses;
  assert.equal(writeResponses["200"].description.includes("incompatibilidade nova ou repetida por POST retorna 422"), true);
  assert.equal(writeResponses["422"].$ref, "#/components/responses/IncompatibleVersion");
  assert.equal(document.paths["/api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}/ihfr-diagnosis/eligibility"].get.responses["400"].$ref, "#/components/responses/InvalidInput");
  assert.equal(document.paths["/api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}/ihfr-diagnosis/operations/{idempotencyKey}"].get.responses["400"].$ref, "#/components/responses/InvalidInput");
  conforms(validateCalculate, requestBody);
  assert.equal(validateCalculate({ ...requestBody, unexpected: true }), false);
  assert.equal(validateCalculate({ ...requestBody, supplement: { ...requestBody.supplement, landUseType: "OTHER" } }), false);
  assert.equal(validateCalculate({ ...requestBody, expectedCurrentDiagnosisId: null }), false);
  assert.equal(validateCalculate({ mode: "CREATE", supplement: { ...requestBody.supplement, landUseType: null }, versions: requestBody.versions }), true);
  for (const changed of [
    { measurementContractVersion: "ihfr-measurement-v2" },
    { mathContractVersion: IHFR_CONTRACT.historicalMathVersion },
    { algorithmVersion: "ihfr-evaluator-ts-v0.1.1" },
    { contractHash: `sha256:${"0".repeat(64)}` },
  ]) assert.equal(validateCalculate({ ...requestBody, versions: { ...requestBody.versions, ...changed } }), true);
  for (const changed of [
    { measurementContractVersion: "legacy-measurement" },
    { mathContractVersion: "ihfr-math-experimental-v0.1" },
    { algorithmVersion: 2 },
    { contractHash: "sha256:bad" },
    { extra: true },
  ]) assert.equal(validateCalculate({ ...requestBody, versions: { ...requestBody.versions, ...changed } }), false);
});

test("real HTTP responses conform to resolved OpenAPI schemas for eligibility, reads, lifecycle and errors", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const service = new IHFRDiagnosisService(db);
    const principal = { requireAuth: async () => ({ id: IHFR_ACTORS.owner }) };
    const eligibility = createIHFREligibilityHandler({ ...principal, service });
    const current = createIHFRCurrentHandler({ ...principal, service });
    const detail = createIHFRDetailHandler({ ...principal, service });
    const write = createIHFRWriteHandler({ ...principal, service });
    const revoke = createIHFRRevocationHandler({ ...principal, service });
    const operation = createIHFROperationHandler({ ...principal, service });

    const eligible = await eligibility(new Request(`http://local.test${base}/eligibility?landUseType=FOREST`), route());
    assert.equal(eligible.status, 200);
    conforms(validateEligibility, await eligible.json());
    const invalidQuery = await eligibility(new Request(`http://local.test${base}/eligibility?landUseType=OTHER`), route());
    assert.equal(invalidQuery.status, 400);
    const invalidQueryBody = await invalidQuery.json();
    conforms(validateError, invalidQueryBody);
    assert.equal(invalidQueryBody.error.code, "INVALID_INPUT");
    const read = await current(new Request(`http://local.test${base}/current`), route());
    assert.equal(read.status, 200);
    const readBody = await read.json();
    conforms(validateDiagnosis, readBody.diagnosis);
    assert.equal(validateDiagnosis({ ...readBody.diagnosis, versions: { ...readBody.diagnosis.versions, mathContractVersion: IHFR_CONTRACT.historicalMathVersion } }), false);
    const previous = await detail(new Request(`http://local.test${base}/diagnoses/${IHFR_DOMAIN.supersededDiagnosis}`), { params: Promise.resolve({ ...context, diagnosisId: IHFR_DOMAIN.supersededDiagnosis }) });
    assert.equal(previous.status, 200);
    conforms(validateDiagnosis, (await previous.json()).diagnosis);

    const incompatibleKey = randomUUID();
    const incompatibleRequest = { ...requestBody, versions: { ...requestBody.versions, mathContractVersion: IHFR_CONTRACT.historicalMathVersion } };
    conforms(validateCalculate, incompatibleRequest);
    const incompatible = await write(new Request(`http://local.test${base}/diagnoses`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": incompatibleKey }, body: JSON.stringify(incompatibleRequest) }), route());
    assert.equal(incompatible.status, 422);
    const incompatibleError = await incompatible.json();
    conforms(validateError, incompatibleError);
    assert.equal(incompatibleError.error.code, "INCOMPATIBLE_VERSION");
    const incompatibleReplay = await write(new Request(`http://local.test${base}/diagnoses`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": incompatibleKey }, body: JSON.stringify(incompatibleRequest) }), route());
    assert.equal(incompatibleReplay.status, 422);
    assert.deepEqual(await incompatibleReplay.json(), incompatibleError);
    const incompatibleRecovered = await operation(new Request(`http://local.test${base}/operations/${incompatibleKey}`), { params: Promise.resolve({ ...context, idempotencyKey: incompatibleKey }) });
    assert.equal(incompatibleRecovered.status, 200);
    const incompatibleTerminal = await incompatibleRecovered.json();
    conforms(validateOperation, incompatibleTerminal);
    assert.deepEqual(incompatibleTerminal, { outcome: "INCOMPATIBLE_VERSION", diagnosis: null, insufficiencyReasons: [] });

    const key = randomUUID();
    const posted = await write(new Request(`http://local.test${base}/diagnoses`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(requestBody) }), route());
    assert.equal(posted.status, 201);
    const created = await posted.json();
    conforms(validateOperation, created);
    assert.equal(posted.headers.get("location"), `${base}/diagnoses/${created.diagnosis.id}`);
    const recovered = await operation(new Request(`http://local.test${base}/operations/${key}`), { params: Promise.resolve({ ...context, idempotencyKey: key }) });
    assert.equal(recovered.status, 200);
    conforms(validateOperation, await recovered.json());

    const revoked = await revoke(new Request(`http://local.test${base}/diagnoses/${created.diagnosis.id}/revocations`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": randomUUID() }, body: JSON.stringify({ expectedCurrentDiagnosisId: created.diagnosis.id, reason: "Correção autorizada" }) }), { params: Promise.resolve({ ...context, diagnosisId: created.diagnosis.id }) });
    assert.equal(revoked.status, 200);
    conforms(validateOperation, await revoked.json());
    const absent = await current(new Request(`http://local.test${base}/current`), route());
    assert.equal(absent.status, 200);
    assert.deepEqual(await absent.json(), { diagnosis: null });

    const invalid = await write(new Request(`http://local.test${base}/diagnoses`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": randomUUID() }, body: JSON.stringify({ ...requestBody, extra: true }) }), route());
    assert.equal(invalid.status, 400);
    conforms(validateError, await invalid.json());
    await client.query("BEGIN");
    await client.query(`UPDATE "ResearchersLinked" SET role='MEMBER' WHERE "userId"=$1 AND "laboratoryRoomId"=$2`, [IHFR_ACTORS.owner, IHFR_LABORATORIES.active]);
    await client.query(`UPDATE "ResearchersLinked" SET role='OWNER' WHERE "userId"=$1 AND "laboratoryRoomId"=$2`, [IHFR_ACTORS.contextualAdmin, IHFR_LABORATORIES.active]);
    await client.query(`UPDATE "LaboratoryRoom" SET "userId"=$1 WHERE id=$2`, [IHFR_ACTORS.contextualAdmin, IHFR_LABORATORIES.active]);
    await client.query("COMMIT");
    const asMember = await operation(new Request(`http://local.test${base}/operations/${incompatibleKey}`), { params: Promise.resolve({ ...context, idempotencyKey: incompatibleKey }) });
    assert.equal(asMember.status, 200);
    conforms(validateOperation, await asMember.json());
    await client.query(`UPDATE "LaboratoryRoom" SET "isActive"=false WHERE id=$1`, [IHFR_LABORATORIES.active]);
    const asInactive = await operation(new Request(`http://local.test${base}/operations/${incompatibleKey}`), { params: Promise.resolve({ ...context, idempotencyKey: incompatibleKey }) });
    assert.equal(asInactive.status, 200);
    conforms(validateOperation, await asInactive.json());
    const malformedKey = await operation(new Request(`http://local.test${base}/operations/invalid`), { params: Promise.resolve({ ...context, idempotencyKey: "invalid" }) });
    assert.equal(malformedKey.status, 400);
    assert.equal((await malformedKey.json()).error.code, "INVALID_INPUT");
    const absentId = randomUUID();
    const absentKey = await operation(new Request(`http://local.test${base}/operations/${absentId}`), { params: Promise.resolve({ ...context, idempotencyKey: absentId }) });
    assert.equal(absentKey.status, 404);
    const otherActor = createIHFROperationHandler({ requireAuth: async () => ({ id: IHFR_ACTORS.contextualAdmin }), service });
    assert.equal((await otherActor(new Request(`http://local.test${base}/operations/${incompatibleKey}`), { params: Promise.resolve({ ...context, idempotencyKey: incompatibleKey }) })).status, 404);
    for (const response of [eligible, read, previous, incompatible, incompatibleRecovered, posted, recovered, revoked, absent, invalid]) assert.equal(response.headers.get("cache-control"), "no-store");
  });
});

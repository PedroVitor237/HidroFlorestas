import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createIHFREligibilityHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler";
import { createIHFRCurrentHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";
import { createIHFRRevocationHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler";
import { createIHFRWriteHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { EnvironmentalDataService, PrismaMeasurementStore, measurementAuthorization } from "../../src/app/api/server/services/environmental-data.service";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

test("IMP-005 confirmed payload flows through IHFR eligibility, CREATE, CURRENT, REPLACE and REVOKE", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
    await setupIHFRDiagnosisFixtures(client);
    const context = { laboratoryId: IHFR_LABORATORIES.active, areaId: IHFR_CONTEXTS.activeArea, collectionId: IHFR_CONTEXTS.withoutMeasurementCollection };
    const payload = validEnvironmentalPayload();
    payload.water.waterSourceType = "SPRING";
    payload.water.hasSpring = true;
    payload.soil.soilTexture = "MEDIUM";
    payload.soil.infiltrationRateMmPerHour = 60;
    payload.vegetation.vegetationCoverPercent = 100;
    payload.vegetation.hasRiparianApp = true;
    payload.terrain = { drainageDensityKmPerKm2: 1.5, elevationMeters: 180, slopePercent: 45 };
    const environmentalService = new EnvironmentalDataService({ store: new PrismaMeasurementStore(db), authorize: measurementAuthorization, clock: () => new Date("2026-09-24T12:00:00.000Z"), createId: randomUUID });
    const confirmed = await environmentalService.create({ ...context, userId: IHFR_ACTORS.owner, confirmationKey: randomUUID(), payload });
    assert.equal(confirmed.created, true);
    const persisted = await client.query(`SELECT payload FROM "EnvironmentalMeasurementSet" WHERE "collectionDataId"=$1`, [context.collectionId]);
    assert.deepEqual(persisted.rows[0].payload, payload);

    const service = new IHFRDiagnosisService(db);
    const dependencies = { requireAuth: async () => ({ id: IHFR_ACTORS.owner }), service };
    const route = () => ({ params: Promise.resolve(context) });
    const base = `http://local.test/api/laboratories/${context.laboratoryId}/areas/${context.areaId}/collections/${context.collectionId}/ihfr-diagnosis`;
    const eligibility = createIHFREligibilityHandler(dependencies);
    const eligible = await eligibility(new Request(`${base}/eligibility?landUseType=FOREST`), route());
    assert.equal(eligible.status, 200);
    assert.equal((await eligible.json()).outcome, "ELIGIBLE");

    const write = createIHFRWriteHandler(dependencies);
    const versions = { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash };
    const supplement = (landUseType: "FOREST" | "URBAN") => ({ inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType, provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-24T12:00:00.000Z" } });
    const post = (body: object, key = randomUUID()) => write(new Request(`${base}/diagnoses`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(body) }), route());
    const created = await post({ mode: "CREATE", supplement: supplement("FOREST"), versions });
    assert.equal(created.status, 201);
    const first = await created.json();
    assert.equal(first.outcome, "SUCCEEDED");
    const current = createIHFRCurrentHandler(dependencies);
    assert.equal((await (await current(new Request(`${base}/current`), route())).json()).diagnosis.id, first.diagnosis.id);

    const replaced = await post({ mode: "REPLACE", expectedCurrentDiagnosisId: first.diagnosis.id, supplement: supplement("URBAN"), versions });
    assert.equal(replaced.status, 201);
    const second = await replaced.json();
    assert.notEqual(second.diagnosis.id, first.diagnosis.id);
    assert.equal((await (await current(new Request(`${base}/current`), route())).json()).diagnosis.id, second.diagnosis.id);

    const revoke = createIHFRRevocationHandler(dependencies);
    const revoked = await revoke(new Request(`${base}/diagnoses/${second.diagnosis.id}/revocations`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": randomUUID() }, body: JSON.stringify({ expectedCurrentDiagnosisId: second.diagnosis.id, reason: "Correção autorizada" }) }), { params: Promise.resolve({ ...context, diagnosisId: second.diagnosis.id }) });
    assert.equal(revoked.status, 200);
    assert.deepEqual(await (await current(new Request(`${base}/current`), route())).json(), { diagnosis: null });
    assert.equal((await service.readDetail(IHFR_ACTORS.owner, context, first.diagnosis.id)).lifecycleState, "SUPERSEDED");
    assert.equal((await service.readDetail(IHFR_ACTORS.owner, context, second.diagnosis.id)).lifecycleState, "REVOKED");
  });
});

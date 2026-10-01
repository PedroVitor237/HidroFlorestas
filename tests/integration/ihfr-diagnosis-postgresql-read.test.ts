import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { createIHFRCurrentHandler } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";

test("PostgreSQL fixtures preserve contextual read, lifecycle and membership boundaries", async () => {
  const databaseVariable = selectedImp006DatabaseVariable();
  await withImp006PostgresqlSchema(databaseVariable, async (client) => {
    await setupIHFRDiagnosisFixtures(client);

    const current = await client.query(`SELECT d.id, d."collectionDataId", c."collectionAreaId", c."laboratoryRoomId",
      (SELECT e."eventType" FROM "IHFRDiagnosisLifecycleEvent" e WHERE e."diagnosisId" = d.id ORDER BY e."occurredAt" DESC LIMIT 1) AS terminal
      FROM "ExperimentalIHFRDiagnosis" d
      JOIN "CollectionData" c ON c.id = d."collectionDataId"
      JOIN "CurrentExperimentalIHFRDiagnosis" p ON p."diagnosisId" = d.id
      WHERE c.id = $1 AND c."collectionAreaId" = $2 AND c."laboratoryRoomId" = $3`,
    [IHFR_CONTEXTS.confirmedCollection, IHFR_CONTEXTS.activeArea, IHFR_LABORATORIES.active]);
    assert.equal(current.rowCount, 1);
    assert.equal(current.rows[0].id, IHFR_DOMAIN.currentDiagnosis);

    const legacy = await client.query(`SELECT d.id, p."diagnosisId" IS NOT NULL AS current,
      (SELECT e."eventType" FROM "IHFRDiagnosisLifecycleEvent" e WHERE e."diagnosisId" = d.id ORDER BY e."occurredAt" DESC LIMIT 1) AS terminal
      FROM "ExperimentalIHFRDiagnosis" d LEFT JOIN "CurrentExperimentalIHFRDiagnosis" p ON p."diagnosisId" = d.id
      WHERE d."collectionDataId" = $1 ORDER BY d."calculatedAt"`, [IHFR_CONTEXTS.confirmedCollection]);
    assert.deepEqual(legacy.rows.map((row) => [row.id, row.current, row.terminal]), [
      [IHFR_DOMAIN.supersededDiagnosis, false, "SUPERSEDED"],
      [IHFR_DOMAIN.revokedDiagnosis, false, "REVOKED"],
      [IHFR_DOMAIN.currentDiagnosis, true, "CREATED_CURRENT"],
    ]);

    const membership = await client.query(`SELECT u.id, l."isActive", r.role FROM "User" u
      JOIN "ResearchersLinked" r ON r."userId" = u.id JOIN "LaboratoryRoom" l ON l.id = r."laboratoryRoomId"
      WHERE u.id = ANY($1::text[]) AND l.id = $2`, [[IHFR_ACTORS.owner, IHFR_ACTORS.contextualAdmin, IHFR_ACTORS.member], IHFR_LABORATORIES.inactive]);
    assert.equal(membership.rowCount, 3);
    assert.ok(membership.rows.every((row) => row.isActive === false));

    const forbidden = await client.query(`SELECT count(*)::int AS count FROM "ResearchersLinked"
      WHERE "userId" = ANY($1::text[]) AND "laboratoryRoomId" = $2`, [[IHFR_ACTORS.outsider, IHFR_ACTORS.revoked], IHFR_LABORATORIES.active]);
    assert.equal(forbidden.rows[0].count, 0);

    const crossed = await client.query(`SELECT count(*)::int AS count FROM "ExperimentalIHFRDiagnosis" d JOIN "CollectionData" c ON c.id=d."collectionDataId"
      WHERE d.id=$1 AND c."collectionAreaId"=$2 AND c."laboratoryRoomId"=$3`, [IHFR_DOMAIN.currentDiagnosis, IHFR_CONTEXTS.inactiveArea, IHFR_LABORATORIES.active]);
    assert.equal(crossed.rows[0].count, 0);
  });
});

test("real current read distinguishes accessible absence from absent or crossed collection", async () => {
  await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, applicationDb) => {
    await setupIHFRDiagnosisFixtures(client);
    const GET = createIHFRCurrentHandler({
      requireAuth: async () => ({ id: IHFR_ACTORS.member }),
      service: new IHFRDiagnosisService(applicationDb),
    });
    const route = (collectionId: string, areaId = IHFR_CONTEXTS.activeArea) => ({ params: Promise.resolve({ laboratoryId: IHFR_LABORATORIES.active, areaId, collectionId }) });
    const absent = await GET(new Request("http://local.test"), route(IHFR_CONTEXTS.withoutMeasurementCollection));
    assert.equal(absent.status, 200);
    assert.deepEqual(await absent.json(), { diagnosis: null });
    const present = await GET(new Request("http://local.test"), route(IHFR_CONTEXTS.confirmedCollection));
    assert.equal(present.status, 200);
    const body = await present.json();
    assert.equal(body.diagnosis.id, IHFR_DOMAIN.currentDiagnosis);
    assert.equal(body.diagnosis.areaId, IHFR_CONTEXTS.activeArea);
    assert.equal(body.diagnosis.displayScore, 0.29);
    assert.equal(body.diagnosis.dataQuality, "HIGH");
    assert.equal(body.diagnosis.decomposition.length, 16);
    assert.equal(body.diagnosis.decomposition.find((item: { input: string }) => item.input === "terrain.slopePercent").normalizedInput, 45);
    const missing = await GET(new Request("http://local.test"), route("60000000-0000-4000-8000-000000009999"));
    const crossed = await GET(new Request("http://local.test"), route(IHFR_CONTEXTS.inactiveCollection));
    assert.equal(missing.status, 404);
    assert.equal(crossed.status, 404);
    assert.deepEqual(await crossed.json(), await missing.json());
  });
});

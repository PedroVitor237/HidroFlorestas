import assert from "node:assert/strict";
import { test } from "node:test";
import { setupIHFRDiagnosisFixtures } from "../fixtures/ihfr-diagnosis-fixtures";
import { IHFR_ACTORS, IHFR_LABORATORIES } from "../fixtures/ihfr-diagnosis-actors";
import { IHFR_CONTEXTS } from "../fixtures/ihfr-diagnosis-contexts";
import { IHFR_DOMAIN } from "../fixtures/ihfr-diagnosis-domain";
import { selectedImp006DatabaseVariable, withImp006PostgresqlSchema } from "../fixtures/postgresql-schema-lifecycle";

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

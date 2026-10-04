import type { PoolClient } from "pg";
import { readFile } from "node:fs/promises";
import { insertIHFRActorFixtures } from "./ihfr-diagnosis-actors";
import { insertIHFRContextFixtures } from "./ihfr-diagnosis-contexts";
import { insertIHFRDomainFixtures } from "./ihfr-diagnosis-domain";
import { applyAreaMigration, applyCollectionMigration, applyEnvironmentalMigration, applyIHFRDiagnosisMigration, applyIHFRLifecycleReferenceMigration, applyRemoveLegacyIsAdminMigration, applyUserAdministrationMigration } from "../migration/migration-test-harness";

export async function setupIHFRDiagnosisFixtures(client: PoolClient) {
  await applyAreaMigration(client);
  await applyCollectionMigration(client);
  await applyEnvironmentalMigration(client);
  await applyUserAdministrationMigration(client);
  await applyIHFRDiagnosisMigration(client);
  await applyRemoveLegacyIsAdminMigration(client);
  await applyIHFRLifecycleReferenceMigration(client);
  await client.query(await readFile("prisma/migrations/20261004000100_mail_foundation/migration.sql", "utf8"));
  await client.query("BEGIN");
  try {
    await insertIHFRActorFixtures(client);
    await insertIHFRContextFixtures(client);
    await insertIHFRDomainFixtures(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function countIHFRDiagnosisFixtures(client: PoolClient) {
  const result = await client.query(`SELECT
    (SELECT count(*)::int FROM "User" WHERE email LIKE '%@imp006.test.invalid') AS users,
    (SELECT count(*)::int FROM "LaboratoryRoom" WHERE name LIKE 'IMP-006%') AS laboratories,
    (SELECT count(*)::int FROM "ExperimentalIHFRInputSupplement") AS supplements,
    (SELECT count(*)::int FROM "ExperimentalIHFRDiagnosis") AS diagnoses,
    (SELECT count(*)::int FROM "CurrentExperimentalIHFRDiagnosis") AS current,
    (SELECT count(*)::int FROM "IHFRDiagnosisOperation") AS operations,
    (SELECT count(*)::int FROM "IHFRDiagnosisLifecycleEvent") AS events`);
  return result.rows[0];
}

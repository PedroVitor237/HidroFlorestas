import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type { PrismaClient } from "../../src/generated/prisma";
import { IHFRDiagnosisService } from "../../src/app/api/server/services/ihfr-diagnosis.service";
import { IHFR_CONTRACT } from "../../src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { IHFR_MEASUREMENT_PAYLOAD } from "../fixtures/ihfr-diagnosis-contexts";

test("persisted malformed measurement remains ineligible and records only a terminal insufficiency", async () => {
  const context = { laboratoryId: randomUUID(), areaId: randomUUID(), collectionId: randomUUID() };
  const actorId = randomUUID();
  const currentId = randomUUID();
  const payload = structuredClone(IHFR_MEASUREMENT_PAYLOAD) as unknown as Record<string, Record<string, unknown>>;
  delete payload.soil.infiltrationRateMmPerHour;
  const measurement = { id: randomUUID(), measurementContractVersion: IHFR_CONTRACT.measurementVersion, payload };
  const writes: string[] = [];
  const collection = { id: context.collectionId, confirmedAt: new Date("2026-09-20T12:00:00Z"), environmentalMeasurementSet: measurement, currentExperimentalIHFRDiagnosis: { diagnosisId: currentId } };
  const tx = {
    user: { findUnique: async () => ({ status: "ACTIVE" }) },
    researchersLinked: { findUnique: async () => ({ role: "OWNER", laboratoryRoom: { id: context.laboratoryId, name: "Controlled fixture", isActive: true } }) },
    collectionData: { findFirst: async () => collection },
    $queryRaw: async () => [{ id: context.collectionId }],
    iHFRDiagnosisOperation: { findUnique: async () => null, create: async () => { writes.push("operation"); return { id: randomUUID() }; } },
    currentExperimentalIHFRDiagnosis: { findUnique: async () => ({ diagnosisId: currentId }), delete: async () => { writes.push("current-delete"); } },
    experimentalIHFRInputSupplement: { findUnique: async () => { writes.push("supplement-read"); return null; }, create: async () => { writes.push("supplement-create"); } },
    experimentalIHFRDiagnosis: { create: async () => { writes.push("diagnosis-create"); } },
    iHFRDiagnosisLifecycleEvent: { create: async () => { writes.push("event-create"); } },
  };
  const db = { ...tx, $transaction: async (work: (transaction: typeof tx) => Promise<unknown>) => work(tx) } as unknown as PrismaClient;
  const service = new IHFRDiagnosisService(db);
  const eligible = await service.eligibility(actorId, context, "FOREST");
  assert.equal(eligible.outcome, "INSUFFICIENT_DATA");
  assert.equal(eligible.currentDiagnosisId, currentId);
  assert.deepEqual(writes, []);
  const result = await service.createOrReplace(actorId, context, {
    mode: "REPLACE", expectedCurrentDiagnosisId: currentId,
    supplement: { inputContractVersion: IHFR_CONTRACT.inputVersion, landUseType: "FOREST", provenance: { kind: "FIELD_OBSERVATION", observedAt: "2026-09-20T12:00:00Z" } },
    versions: { measurementContractVersion: IHFR_CONTRACT.measurementVersion, mathContractVersion: IHFR_CONTRACT.activeMathVersion, algorithmVersion: IHFR_CONTRACT.algorithmVersion, contractHash: IHFR_CONTRACT.contractHash },
  }, randomUUID());
  assert.equal(result.response.outcome, "INSUFFICIENT_DATA");
  assert.equal(result.response.diagnosis, null);
  assert.deepEqual(result.response.insufficiencyReasons, ["INSUFFICIENT_DIMENSION"]);
  assert.deepEqual(writes, ["operation"]);
  assert.equal(eligible.currentDiagnosisId, currentId);
});

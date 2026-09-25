import { hashIHFRDiagnosisRequest, isActiveIHFRVersionSelection, parseIHFRDiagnosisRequest, projectPublicDiagnosis, type IHFRDiagnosisRequest, type IHFRSupplementInput } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";
import { IHFR_CONTRACT } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import { evaluateIHFR } from "@/app/api/server/ihfr-diagnosis/evaluator";
import { matchesImp006Schema } from "@/app/api/server/ihfr-diagnosis/schema-guard";
import { hashCanonicalIHFRValue, loadActiveIHFRManifest } from "@/app/api/server/ihfr-diagnosis/manifest-loader";
import type { IHFRLandUseType, IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { Prisma, type PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { authorizeLaboratoryAccess, validResourceId } from "../areas/area.authorization";

export type IHFROperationResponse = { outcome: "SUCCEEDED" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION"; diagnosis: PublicDiagnosis | null; insufficiencyReasons: Array<"MISSING_ENVIRONMENTAL_DATA" | "MISSING_SLOPE_PERCENT" | "MISSING_LAND_USE_TYPE" | "INSUFFICIENT_DIMENSION"> };
export type IHFRWriteResult = { response: IHFROperationResponse; replayed: boolean };
export class IHFRDiagnosisServiceError extends Error { constructor(public readonly code: "NOT_FOUND" | "INTERNAL_ERROR" | "INVALID_INPUT" | "STATE_CONFLICT" | "IDEMPOTENCY_CONFLICT" | "INCOMPATIBLE_VERSION") { super(code); } }

export type IHFREligibility = {
  eligible: boolean;
  outcome: "ELIGIBLE" | "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION";
  reasons: Array<"MISSING_ENVIRONMENTAL_DATA" | "MISSING_SLOPE_PERCENT" | "MISSING_LAND_USE_TYPE" | "INSUFFICIENT_DIMENSION" | "INCOMPATIBLE_VERSION">;
  hasCurrentDiagnosis: boolean;
  currentDiagnosisId?: string | null;
};
export type IHFRRevocationRequest = { expectedCurrentDiagnosisId: string; reason: string };
export type IHFRWriteCheckpoint = "BEFORE_LOCK" | "AFTER_SUPPLEMENT" | "AFTER_DIAGNOSIS" | "AFTER_OPERATION" | "AFTER_POINTER" | "AFTER_EVENT" | "BEFORE_COMMIT";

export class IHFRDiagnosisService {
  constructor(private readonly db: PrismaClient = prisma, private readonly checkpoint?: (stage: IHFRWriteCheckpoint) => Promise<void>) {}

  async readCurrent(actorId: string, context: IHFRRouteContext): Promise<PublicDiagnosis | null> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "READ_IHFR_DIAGNOSIS", this.db);
    this.assertContext(context);
    const collection = await this.db.collectionData.findFirst({ where: { id: context.collectionId, collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId }, select: { id: true } });
    if (!collection) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    const record = await this.db.experimentalIHFRDiagnosis.findFirst({ where: { collectionDataId: context.collectionId, currentPointer: { isNot: null } }, select: diagnosisSelect });
    return record ? project(record, context) : null;
  }
  async readDetail(actorId: string, context: IHFRRouteContext, diagnosisId: string): Promise<PublicDiagnosis> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "READ_IHFR_DIAGNOSIS", this.db);
    this.assertContext(context);
    if (!validResourceId(diagnosisId)) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    const record = await this.db.experimentalIHFRDiagnosis.findFirst({ where: { id: diagnosisId, collectionDataId: context.collectionId, collectionData: { collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId } }, select: diagnosisSelect });
    if (!record) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    return project(record, context);
  }
  async eligibility(actorId: string, context: IHFRRouteContext, landUseType?: IHFRLandUseType): Promise<IHFREligibility> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "READ_IHFR_DIAGNOSIS", this.db);
    this.assertContext(context);
    const collection = await this.db.collectionData.findFirst({
      where: { id: context.collectionId, collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId },
      select: { confirmedAt: true, environmentalMeasurementSet: { select: { measurementContractVersion: true, payload: true } }, currentExperimentalIHFRDiagnosis: { select: { diagnosisId: true } } },
    });
    if (!collection) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    const currentDiagnosisId = collection.currentExperimentalIHFRDiagnosis?.diagnosisId ?? null;
    const base = { hasCurrentDiagnosis: currentDiagnosisId !== null, currentDiagnosisId };
    const measurement = collection.confirmedAt ? collection.environmentalMeasurementSet : null;
    if (!measurement) return { eligible: false, outcome: "INSUFFICIENT_DATA", reasons: ["MISSING_ENVIRONMENTAL_DATA"], ...base };
    if (measurement.measurementContractVersion !== IHFR_CONTRACT.measurementVersion) return { eligible: false, outcome: "INCOMPATIBLE_VERSION", reasons: ["INCOMPATIBLE_VERSION"], ...base };
    const reasons: IHFREligibility["reasons"] = [];
    if (landUseType == null) reasons.push("MISSING_LAND_USE_TYPE");
    const terrain = typeof measurement.payload === "object" && measurement.payload !== null && !Array.isArray(measurement.payload) ? (measurement.payload as Record<string, unknown>).terrain : null;
    const slope = typeof terrain === "object" && terrain !== null && !Array.isArray(terrain) ? (terrain as Record<string, unknown>).slopePercent : null;
    if (slope == null) reasons.push("MISSING_SLOPE_PERCENT");
    const evaluated = evaluateIHFR(loadActiveIHFRManifest(), { environmental: measurement.payload, landUseType });
    if (evaluated.outcome === "INSUFFICIENT_DATA") reasons.push("INSUFFICIENT_DIMENSION");
    if (evaluated.outcome === "INCOMPATIBLE_VERSION") return { eligible: false, outcome: "INCOMPATIBLE_VERSION", reasons: ["INCOMPATIBLE_VERSION"], ...base };
    return { eligible: reasons.length === 0, outcome: reasons.length === 0 ? "ELIGIBLE" : "INSUFFICIENT_DATA", reasons: [...new Set(reasons)], ...base };
  }
  async createOrReplace(actorId: string, context: IHFRRouteContext, input: IHFRDiagnosisRequest, idempotencyKey: string): Promise<IHFRWriteResult> {
    await this.authorizeWrite(actorId, context);
    if (!validResourceId(idempotencyKey)) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
    const request = parseIHFRDiagnosisRequest(input);
    const requestHash = hashIHFRDiagnosisRequest(context, request);
    return this.writeWithRetry(actorId, context, idempotencyKey, requestHash, "CREATE_OR_REPLACE", async (tx, collection, currentId, now) => {
      if (request.mode === "CREATE" ? currentId !== null : currentId !== request.expectedCurrentDiagnosisId) throw new IHFRDiagnosisServiceError("STATE_CONFLICT");
      const manifest = loadActiveIHFRManifest();
      if (!isActiveIHFRVersionSelection(request.versions)) {
        return this.recordTerminal(tx, actorId, context, idempotencyKey, requestHash, "CREATE_OR_REPLACE", "INCOMPATIBLE_VERSION", null, [], now);
      }
      const measurement = collection.confirmedAt ? collection.environmentalMeasurementSet : null;
      const reasons: IHFROperationResponse["insufficiencyReasons"] = [];
      if (!measurement) reasons.push("MISSING_ENVIRONMENTAL_DATA");
      else if (measurement.measurementContractVersion !== IHFR_CONTRACT.measurementVersion) {
        return this.recordTerminal(tx, actorId, context, idempotencyKey, requestHash, "CREATE_OR_REPLACE", "INCOMPATIBLE_VERSION", null, [], now);
      }
      if (request.supplement.landUseType == null) reasons.push("MISSING_LAND_USE_TYPE");
      let evaluation: ReturnType<typeof evaluateIHFR> | undefined;
      if (measurement) {
        const terrain = typeof measurement.payload === "object" && measurement.payload !== null && !Array.isArray(measurement.payload) ? (measurement.payload as Record<string, unknown>).terrain : null;
        if (!terrain || typeof terrain !== "object" || Array.isArray(terrain) || (terrain as Record<string, unknown>).slopePercent == null) reasons.push("MISSING_SLOPE_PERCENT");
        evaluation = evaluateIHFR(manifest, { environmental: measurement.payload, landUseType: request.supplement.landUseType });
        if (evaluation.outcome === "INCOMPATIBLE_VERSION") {
          return this.recordTerminal(tx, actorId, context, idempotencyKey, requestHash, "CREATE_OR_REPLACE", "INCOMPATIBLE_VERSION", null, [], now);
        }
        if (evaluation.outcome === "INSUFFICIENT_DATA") reasons.push("INSUFFICIENT_DIMENSION");
      }
      if (reasons.length) return this.recordTerminal(tx, actorId, context, idempotencyKey, requestHash, "CREATE_OR_REPLACE", "INSUFFICIENT_DATA", null, [...new Set(reasons)], now);
      if (!measurement || !evaluation || evaluation.outcome !== "SUFFICIENT" || request.supplement.landUseType == null) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
      const supplement = request.supplement as IHFRSupplementInput;
      const payloadHash = hashCanonicalIHFRValue({ collectionDataId: context.collectionId, environmentalMeasurementSetId: measurement.id, supplement });
      let storedSupplement = await tx.experimentalIHFRInputSupplement.findUnique({ where: { collectionDataId_payloadHash: { collectionDataId: context.collectionId, payloadHash } }, select: { id: true, environmentalMeasurementSetId: true, inputContractVersion: true, landUseType: true, provenance: true } });
      if (storedSupplement && (storedSupplement.environmentalMeasurementSetId !== measurement.id || storedSupplement.inputContractVersion !== supplement.inputContractVersion || storedSupplement.landUseType !== supplement.landUseType || hashCanonicalIHFRValue(storedSupplement.provenance) !== hashCanonicalIHFRValue(supplement.provenance))) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
      if (!storedSupplement) storedSupplement = await tx.experimentalIHFRInputSupplement.create({ data: { collectionDataId: context.collectionId, environmentalMeasurementSetId: measurement.id, createdByUserId: actorId, inputContractVersion: supplement.inputContractVersion, landUseType: supplement.landUseType, provenance: supplement.provenance, payloadHash, confirmedAt: now }, select: { id: true, environmentalMeasurementSetId: true, inputContractVersion: true, landUseType: true, provenance: true } });
      await this.checkpoint?.("AFTER_SUPPLEMENT");
      const diagnosis = await tx.experimentalIHFRDiagnosis.create({ data: {
        collectionDataId: context.collectionId, environmentalMeasurementSetId: measurement.id, inputSupplementId: storedSupplement.id,
        rawScore: evaluation.rawScore, displayScore: evaluation.displayScore, ihfrClass: evaluation.ihfrClass, dataQuality: evaluation.dataQuality,
        componentScores: evaluation.componentScores, decomposition: evaluation.decomposition, drivers: evaluation.drivers,
        explanation: evaluation.explanation, measurementContractVersion: evaluation.measurementContractVersion, inputContractVersion: evaluation.inputContractVersion,
        mathContractVersion: evaluation.mathContractVersion, algorithmVersion: evaluation.algorithmVersion, contractHash: evaluation.contractHash,
        calculatedAt: now, scientificState: "EXPERIMENTAL",
      }, select: diagnosisSelect });
      await this.checkpoint?.("AFTER_DIAGNOSIS");
      const response: IHFROperationResponse = { outcome: "SUCCEEDED", diagnosis: project({ ...diagnosis, currentPointer: { validFrom: now }, lifecycleEvents: [{ eventType: "CREATED_CURRENT", occurredAt: now }] }, context), insufficiencyReasons: [] };
      const operation = await tx.iHFRDiagnosisOperation.create({ data: { laboratoryRoomId: context.laboratoryId, collectionAreaId: context.areaId, collectionDataId: context.collectionId, actorUserId: actorId, idempotencyKey, requestHash, operationType: "CREATE_OR_REPLACE", outcome: "SUCCEEDED", diagnosisId: diagnosis.id, responseSnapshot: JSON.parse(JSON.stringify(response)) as Prisma.InputJsonValue, completedAt: now }, select: { id: true } });
      await this.checkpoint?.("AFTER_OPERATION");
      if (currentId) {
        await tx.currentExperimentalIHFRDiagnosis.delete({ where: { collectionDataId: context.collectionId } });
        await tx.iHFRDiagnosisLifecycleEvent.create({ data: { collectionDataId: context.collectionId, diagnosisId: currentId, eventType: "SUPERSEDED", replacementDiagnosisId: diagnosis.id, actorUserId: actorId, operationId: operation.id, occurredAt: now, evidence: { measurementId: measurement.id, contractHash: evaluation.contractHash } } });
      }
      await tx.currentExperimentalIHFRDiagnosis.create({ data: { collectionDataId: context.collectionId, diagnosisId: diagnosis.id, validFrom: now, operationId: operation.id } });
      await this.checkpoint?.("AFTER_POINTER");
      await tx.iHFRDiagnosisLifecycleEvent.create({ data: { collectionDataId: context.collectionId, diagnosisId: diagnosis.id, eventType: "CREATED_CURRENT", actorUserId: actorId, operationId: operation.id, occurredAt: now, evidence: { measurementId: measurement.id, contractHash: evaluation.contractHash } } });
      await this.checkpoint?.("AFTER_EVENT");
      return { response, replayed: false };
    });
  }
  async revoke(actorId: string, context: IHFRRouteContext, diagnosisId: string, request: IHFRRevocationRequest, idempotencyKey: string): Promise<IHFRWriteResult> {
    await this.authorizeWrite(actorId, context);
    if (!validResourceId(diagnosisId)) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    if (!validResourceId(idempotencyKey) || !request || !validResourceId(request.expectedCurrentDiagnosisId) || typeof request.reason !== "string" || request.reason.trim().length < 1 || request.reason.length > 500 || Object.keys(request).some((key) => !["expectedCurrentDiagnosisId", "reason"].includes(key))) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
    const requestHash = hashCanonicalIHFRValue({ context, operationType: "REVOKE", diagnosisId, request });
    return this.writeWithRetry(actorId, context, idempotencyKey, requestHash, "REVOKE", async (tx, _collection, currentId, now) => {
      const contextual = await tx.experimentalIHFRDiagnosis.findFirst({ where: { id: diagnosisId, collectionDataId: context.collectionId }, select: { id: true } });
      if (!contextual) throw new IHFRDiagnosisServiceError("NOT_FOUND");
      if (currentId !== diagnosisId || currentId !== request.expectedCurrentDiagnosisId) throw new IHFRDiagnosisServiceError("STATE_CONFLICT");
      const record = await tx.experimentalIHFRDiagnosis.findUniqueOrThrow({ where: { id: diagnosisId }, select: diagnosisSelect });
      const response: IHFROperationResponse = { outcome: "SUCCEEDED", diagnosis: project({ ...record, currentPointer: null, lifecycleEvents: [{ eventType: "REVOKED", occurredAt: now }, ...record.lifecycleEvents] }, context), insufficiencyReasons: [] };
      const operation = await tx.iHFRDiagnosisOperation.create({ data: { laboratoryRoomId: context.laboratoryId, collectionAreaId: context.areaId, collectionDataId: context.collectionId, actorUserId: actorId, idempotencyKey, requestHash, operationType: "REVOKE", outcome: "SUCCEEDED", diagnosisId, responseSnapshot: JSON.parse(JSON.stringify(response)) as Prisma.InputJsonValue, completedAt: now }, select: { id: true } });
      await this.checkpoint?.("AFTER_OPERATION");
      await tx.currentExperimentalIHFRDiagnosis.delete({ where: { collectionDataId: context.collectionId } });
      await this.checkpoint?.("AFTER_POINTER");
      await tx.iHFRDiagnosisLifecycleEvent.create({ data: { collectionDataId: context.collectionId, diagnosisId, eventType: "REVOKED", actorUserId: actorId, operationId: operation.id, reason: request.reason.trim(), occurredAt: now, evidence: { diagnosisId } } });
      await this.checkpoint?.("AFTER_EVENT");
      return { response, replayed: false };
    });
  }
  async operation(actorId: string, context: IHFRRouteContext, idempotencyKey: string): Promise<IHFROperationResponse> {
    await this.authorizeContext(actorId, context, "READ_IHFR_DIAGNOSIS", false);
    if (!validResourceId(idempotencyKey)) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
    const operation = await this.db.iHFRDiagnosisOperation.findUnique({ where: { actorUserId_idempotencyKey: { actorUserId: actorId, idempotencyKey } } });
    if (!operation || !sameContext(operation, context)) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    return restoreOperationResponse(operation.responseSnapshot, context);
  }
  async authorizeWrite(actorId: string, context: IHFRRouteContext): Promise<void> {
    await this.authorizeContext(actorId, context, "MANAGE_IHFR_DIAGNOSIS", true);
  }
  private async authorizeContext(actorId: string, context: IHFRRouteContext, permission: "READ_IHFR_DIAGNOSIS" | "MANAGE_IHFR_DIAGNOSIS", mutate: boolean): Promise<void> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, permission, this.db, mutate);
    this.assertContext(context);
    const collection = await this.db.collectionData.findFirst({ where: { id: context.collectionId, collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId }, select: { id: true } });
    if (!collection) throw new IHFRDiagnosisServiceError("NOT_FOUND");
  }
  private async writeWithRetry(actorId: string, context: IHFRRouteContext, idempotencyKey: string, requestHash: string, operationType: "CREATE_OR_REPLACE" | "REVOKE", work: (tx: Prisma.TransactionClient, collection: WriteCollection, currentId: string | null, now: Date) => Promise<IHFRWriteResult>): Promise<IHFRWriteResult> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.db.$transaction(async (tx) => {
          await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "MANAGE_IHFR_DIAGNOSIS", tx, true);
          const collection = await tx.collectionData.findFirst({ where: { id: context.collectionId, collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId }, select: writeCollectionSelect });
          if (!collection) throw new IHFRDiagnosisServiceError("NOT_FOUND");
          if (process.env.IMP006_TEST_SCHEMA) {
            const selected = await tx.$queryRaw<Array<{ schema: string }>>`SELECT current_schema()::text AS schema`;
            if (!matchesImp006Schema(selected, process.env.IMP006_TEST_SCHEMA)) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
          }
          await this.checkpoint?.("BEFORE_LOCK");
          await tx.$queryRaw`SELECT id FROM "CollectionData" WHERE id = ${context.collectionId} FOR UPDATE`;
          const existing = await tx.iHFRDiagnosisOperation.findUnique({ where: { actorUserId_idempotencyKey: { actorUserId: actorId, idempotencyKey } } });
          if (existing) {
            if (!sameContext(existing, context) || existing.requestHash !== requestHash || existing.operationType !== operationType) throw new IHFRDiagnosisServiceError("IDEMPOTENCY_CONFLICT");
            return { response: restoreOperationResponse(existing.responseSnapshot, context), replayed: true };
          }
          const pointer = await tx.currentExperimentalIHFRDiagnosis.findUnique({ where: { collectionDataId: context.collectionId }, select: { diagnosisId: true } });
          const result = await work(tx, collection, pointer?.diagnosisId ?? null, new Date());
          await this.checkpoint?.("BEFORE_COMMIT");
          return result;
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      } catch (error) {
        if (isSerializableConflict(error) && attempt < 2) continue;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          const existing = await this.db.iHFRDiagnosisOperation.findUnique({ where: { actorUserId_idempotencyKey: { actorUserId: actorId, idempotencyKey } } });
          if (existing) {
            await this.authorizeWrite(actorId, context);
            if (!sameContext(existing, context) || existing.requestHash !== requestHash || existing.operationType !== operationType) throw new IHFRDiagnosisServiceError("IDEMPOTENCY_CONFLICT");
            return { response: restoreOperationResponse(existing.responseSnapshot, context), replayed: true };
          }
        }
        throw error;
      }
    }
    throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
  }
  private async recordTerminal(tx: Prisma.TransactionClient, actorId: string, context: IHFRRouteContext, idempotencyKey: string, requestHash: string, operationType: "CREATE_OR_REPLACE" | "REVOKE", outcome: "INSUFFICIENT_DATA" | "INCOMPATIBLE_VERSION", diagnosisId: string | null, insufficiencyReasons: IHFROperationResponse["insufficiencyReasons"], now: Date): Promise<IHFRWriteResult> {
    const response: IHFROperationResponse = { outcome, diagnosis: null, insufficiencyReasons };
    await tx.iHFRDiagnosisOperation.create({ data: { laboratoryRoomId: context.laboratoryId, collectionAreaId: context.areaId, collectionDataId: context.collectionId, actorUserId: actorId, idempotencyKey, requestHash, operationType, outcome, diagnosisId, responseSnapshot: JSON.parse(JSON.stringify(response)) as Prisma.InputJsonValue, completedAt: now } });
    return { response, replayed: false };
  }
  private assertContext(context: IHFRRouteContext) { if (![context.laboratoryId, context.areaId, context.collectionId].every(validResourceId)) throw new IHFRDiagnosisServiceError("NOT_FOUND"); }
}

export const ihfrDiagnosisService = new IHFRDiagnosisService();

const writeCollectionSelect = { confirmedAt: true, environmentalMeasurementSet: { select: { id: true, measurementContractVersion: true, payload: true } } } as const;
type WriteCollection = Prisma.CollectionDataGetPayload<{ select: typeof writeCollectionSelect }>;
function sameContext(record: { laboratoryRoomId: string; collectionAreaId: string; collectionDataId: string }, context: IHFRRouteContext) {
  return record.laboratoryRoomId === context.laboratoryId && record.collectionAreaId === context.areaId && record.collectionDataId === context.collectionId;
}
function isSerializableConflict(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") return true;
  if (typeof error === "object" && error !== null && "code" in error && (error.code === "40001" || error.code === "40P01")) return true;
  return false;
}
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function restoreOperationResponse(snapshot: unknown, context: IHFRRouteContext): IHFROperationResponse {
  if (!isRecord(snapshot) || !["SUCCEEDED", "INSUFFICIENT_DATA", "INCOMPATIBLE_VERSION"].includes(String(snapshot.outcome)) || !Array.isArray(snapshot.insufficiencyReasons) || !snapshot.insufficiencyReasons.every((reason) => ["MISSING_ENVIRONMENTAL_DATA", "MISSING_SLOPE_PERCENT", "MISSING_LAND_USE_TYPE", "INSUFFICIENT_DIMENSION"].includes(reason))) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
  let diagnosis: PublicDiagnosis | null = null;
  if (snapshot.diagnosis !== null) {
    const value = snapshot.diagnosis;
    if (!isRecord(value) || value.collectionId !== context.collectionId || value.areaId !== context.areaId || !isRecord(value.versions) || !Array.isArray(value.decomposition)) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
    const versions = value.versions;
    const variables = Object.fromEntries(value.decomposition.map((entry) => {
      if (!isRecord(entry) || typeof entry.input !== "string") throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
      return [entry.input, { included: entry.available, raw: entry.raw, normalizedInput: entry.normalizedInput, transformation: entry.transformation, score: entry.score, clamped: entry.clamped }];
    }));
    diagnosis = projectPublicDiagnosis({
      id: String(value.id), collectionDataId: String(value.collectionId), environmentalMeasurementSetId: String(value.environmentalMeasurementSetId), inputSupplementId: String(value.inputSupplementId),
      rawScore: Number(value.rawScore), displayScore: Number(value.displayScore), ihfrClass: value.ihfrClass as PublicDiagnosis["ihfrClass"], dataQuality: value.dataQuality === "MEDIUM" ? "MODERATE" : value.dataQuality as "LOW" | "HIGH",
      componentScores: value.componentScores, decomposition: { variables }, drivers: value.drivers, explanation: String(value.explanation),
      measurementContractVersion: String(versions.measurementContractVersion), inputContractVersion: String(versions.inputContractVersion), mathContractVersion: String(versions.mathContractVersion), algorithmVersion: String(versions.algorithmVersion), contractHash: String(versions.contractHash),
      calculatedAt: String(value.calculatedAt), validFrom: String(value.validFrom), transitionedAt: value.transitionedAt == null ? null : String(value.transitionedAt),
      scientificState: String(value.scientificState), current: value.lifecycleState === "CURRENT", terminalEvent: value.lifecycleState === "REVOKED" ? "REVOKED" : value.lifecycleState === "SUPERSEDED" ? "SUPERSEDED" : null,
    }, context, IHFR_CONTRACT.labels);
  }
  return { outcome: snapshot.outcome as IHFROperationResponse["outcome"], diagnosis, insufficiencyReasons: [...snapshot.insufficiencyReasons] };
}

const diagnosisSelect = { id: true, collectionDataId: true, environmentalMeasurementSetId: true, inputSupplementId: true, rawScore: true, displayScore: true, ihfrClass: true, dataQuality: true, componentScores: true, decomposition: true, drivers: true, explanation: true, measurementContractVersion: true, inputContractVersion: true, mathContractVersion: true, algorithmVersion: true, contractHash: true, calculatedAt: true, scientificState: true, currentPointer: { select: { validFrom: true } }, lifecycleEvents: { orderBy: { occurredAt: "desc" as const }, select: { eventType: true, occurredAt: true } } } as const;
type DiagnosisRecord = { id:string;collectionDataId:string;environmentalMeasurementSetId:string;inputSupplementId:string;rawScore:number;displayScore:{toString():string};ihfrClass:"LOW"|"MODERATE"|"HIGH"|"CRITICAL";dataQuality:"LOW"|"MODERATE"|"HIGH";componentScores:unknown;decomposition:unknown;drivers:unknown;explanation:string;measurementContractVersion:string;inputContractVersion:string;mathContractVersion:string;algorithmVersion:string;contractHash:string;calculatedAt:Date;scientificState:string;currentPointer:{validFrom:Date}|null;lifecycleEvents:Array<{eventType:string;occurredAt:Date}> };
function project(record: DiagnosisRecord, context: IHFRRouteContext): PublicDiagnosis {
  const created = record.lifecycleEvents.find((event) => event.eventType === "CREATED_CURRENT");
  const terminal = record.lifecycleEvents.find((event) => event.eventType === "REVOKED" || event.eventType === "SUPERSEDED");
  const validFrom = record.currentPointer?.validFrom ?? created?.occurredAt;
  if (!validFrom) throw new IHFRDiagnosisServiceError("INTERNAL_ERROR");
  return projectPublicDiagnosis({
    id: record.id, collectionDataId: record.collectionDataId, environmentalMeasurementSetId: record.environmentalMeasurementSetId, inputSupplementId: record.inputSupplementId,
    rawScore: record.rawScore, displayScore: record.displayScore.toString(), ihfrClass: record.ihfrClass, dataQuality: record.dataQuality,
    componentScores: record.componentScores, decomposition: record.decomposition, drivers: record.drivers, explanation: record.explanation,
    measurementContractVersion: record.measurementContractVersion, inputContractVersion: record.inputContractVersion, mathContractVersion: record.mathContractVersion, algorithmVersion: record.algorithmVersion, contractHash: record.contractHash,
    calculatedAt: record.calculatedAt.toISOString(), validFrom: validFrom.toISOString(), transitionedAt: terminal?.occurredAt.toISOString() ?? null,
    scientificState: record.scientificState, current: Boolean(record.currentPointer), terminalEvent: terminal?.eventType === "REVOKED" ? "REVOKED" : terminal?.eventType === "SUPERSEDED" ? "SUPERSEDED" : null,
  }, context, IHFR_CONTRACT.labels);
}

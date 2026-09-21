import { projectPublicDiagnosis, type IHFRDiagnosisRequest } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";
import { IHFR_CONTRACT } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants";
import type { IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";
import { prisma } from "../lib/prisma";
import { authorizeLaboratoryAccess, validResourceId } from "../areas/area.authorization";

export class IHFRDiagnosisServiceError extends Error { constructor(public readonly code: "NOT_FOUND" | "INTERNAL_ERROR") { super(code); } }

export class IHFRDiagnosisService {
  async readCurrent(actorId: string, context: IHFRRouteContext): Promise<PublicDiagnosis | null> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "READ_ENVIRONMENTAL_DATA");
    this.assertContext(context);
    const record = await prisma.experimentalIHFRDiagnosis.findFirst({ where: { collectionDataId: context.collectionId, collectionData: { collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId }, currentPointer: { isNot: null } }, select: diagnosisSelect });
    return record ? project(record, context) : null;
  }
  async readDetail(actorId: string, context: IHFRRouteContext, diagnosisId: string): Promise<PublicDiagnosis> {
    await authorizeLaboratoryAccess({ id: actorId }, context.laboratoryId, "READ_ENVIRONMENTAL_DATA");
    this.assertContext(context);
    if (!validResourceId(diagnosisId)) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    const record = await prisma.experimentalIHFRDiagnosis.findFirst({ where: { id: diagnosisId, collectionDataId: context.collectionId, collectionData: { collectionAreaId: context.areaId, laboratoryRoomId: context.laboratoryId } }, select: diagnosisSelect });
    if (!record) throw new IHFRDiagnosisServiceError("NOT_FOUND");
    return project(record, context);
  }
  async eligibility(_actorId: string, _context: IHFRRouteContext): Promise<unknown> { throw new Error("IHFR_ELIGIBILITY_NOT_IMPLEMENTED"); }
  async createOrReplace(_actorId: string, _context: IHFRRouteContext, _request: IHFRDiagnosisRequest): Promise<unknown> { throw new Error("IHFR_WRITE_NOT_IMPLEMENTED"); }
  async revoke(_actorId: string, _context: IHFRRouteContext, _diagnosisId: string, _request: unknown): Promise<unknown> { throw new Error("IHFR_REVOKE_NOT_IMPLEMENTED"); }
  async operation(_actorId: string, _context: IHFRRouteContext, _idempotencyKey: string): Promise<unknown> { throw new Error("IHFR_OPERATION_NOT_IMPLEMENTED"); }
  private assertContext(context: IHFRRouteContext) { if (![context.laboratoryId, context.areaId, context.collectionId].every(validResourceId)) throw new IHFRDiagnosisServiceError("NOT_FOUND"); }
}

export const ihfrDiagnosisService = new IHFRDiagnosisService();

const diagnosisSelect = { id: true, collectionDataId: true, rawScore: true, displayScore: true, ihfrClass: true, dataQuality: true, componentScores: true, measurementContractVersion: true, inputContractVersion: true, mathContractVersion: true, algorithmVersion: true, contractHash: true, calculatedAt: true, currentPointer: { select: { collectionDataId: true } }, lifecycleEvents: { orderBy: { occurredAt: "desc" as const }, take: 1, select: { eventType: true } } } as const;
type DiagnosisRecord = { id:string;collectionDataId:string;rawScore:number;displayScore:{toString():string};ihfrClass:"LOW"|"MODERATE"|"HIGH"|"CRITICAL";dataQuality:"LOW"|"MODERATE"|"HIGH";componentScores:unknown;measurementContractVersion:string;inputContractVersion:string;mathContractVersion:string;algorithmVersion:string;contractHash:string;calculatedAt:Date;currentPointer:unknown;lifecycleEvents:Array<{eventType:string}> };
function project(record: DiagnosisRecord, context: IHFRRouteContext): PublicDiagnosis {
  const value = { ...record, componentScores: record.componentScores as Record<"W"|"S"|"V"|"T", number> };
  const terminal = value.lifecycleEvents[0]?.eventType;
  return projectPublicDiagnosis({ id:value.id, collectionDataId:value.collectionDataId, rawScore:value.rawScore, displayScore:value.displayScore.toString(), ihfrClass:value.ihfrClass, dataQuality:value.dataQuality, componentScores:value.componentScores, measurementContractVersion:value.measurementContractVersion, inputContractVersion:value.inputContractVersion, mathContractVersion:value.mathContractVersion, algorithmVersion:value.algorithmVersion, contractHash:value.contractHash, calculatedAt:value.calculatedAt.toISOString(), current:Boolean(value.currentPointer), terminalEvent:terminal === "REVOKED" ? "REVOKED" : terminal === "SUPERSEDED" ? "SUPERSEDED" : null }, context, IHFR_CONTRACT.labels);
}

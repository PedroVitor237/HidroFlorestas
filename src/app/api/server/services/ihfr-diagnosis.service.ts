import type { IHFRDiagnosisRequest } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";
import type { IHFRRouteContext, PublicDiagnosis } from "@/types/ihfr-diagnosis.type";

export class IHFRDiagnosisService {
  async readCurrent(_actorId: string, _context: IHFRRouteContext): Promise<PublicDiagnosis | null> { throw new Error("IHFR_READ_NOT_IMPLEMENTED"); }
  async readDetail(_actorId: string, _context: IHFRRouteContext, _diagnosisId: string): Promise<PublicDiagnosis> { throw new Error("IHFR_DETAIL_NOT_IMPLEMENTED"); }
  async eligibility(_actorId: string, _context: IHFRRouteContext): Promise<unknown> { throw new Error("IHFR_ELIGIBILITY_NOT_IMPLEMENTED"); }
  async createOrReplace(_actorId: string, _context: IHFRRouteContext, _request: IHFRDiagnosisRequest): Promise<unknown> { throw new Error("IHFR_WRITE_NOT_IMPLEMENTED"); }
  async revoke(_actorId: string, _context: IHFRRouteContext, _diagnosisId: string, _request: unknown): Promise<unknown> { throw new Error("IHFR_REVOKE_NOT_IMPLEMENTED"); }
  async operation(_actorId: string, _context: IHFRRouteContext, _idempotencyKey: string): Promise<unknown> { throw new Error("IHFR_OPERATION_NOT_IMPLEMENTED"); }
}

export const ihfrDiagnosisService = new IHFRDiagnosisService();

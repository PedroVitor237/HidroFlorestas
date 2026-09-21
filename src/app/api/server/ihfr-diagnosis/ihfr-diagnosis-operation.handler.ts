import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";
import { ihfrNotImplemented } from "./ihfr-diagnosis.http";

type Dependencies = { requireAuth(): Promise<{ id: string }>; service: Pick<IHFRDiagnosisService, "operation"> };
export function createIHFROperationHandler(_dependencies: Dependencies) {
  return async function GET(_request: Request, _route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string; idempotencyKey: string }> }) { return ihfrNotImplemented(); };
}

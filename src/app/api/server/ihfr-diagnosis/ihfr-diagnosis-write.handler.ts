import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";
import { ihfrNotImplemented } from "./ihfr-diagnosis.http";

type Dependencies = { requireAuth(): Promise<{ id: string }>; service: Pick<IHFRDiagnosisService, "createOrReplace"> };

export function createIHFRWriteHandler(_dependencies: Dependencies) {
  return async function POST(_request: Request, _route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }> }) {
    return ihfrNotImplemented();
  };
}

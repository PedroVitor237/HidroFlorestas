import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";
import { ihfrNotImplemented } from "./ihfr-diagnosis.http";

type Principal = { id: string };
type Dependencies = {
  requireAuth(): Promise<Principal>;
  service: Pick<IHFRDiagnosisService, "eligibility">;
};

export function createIHFREligibilityHandler(_dependencies: Dependencies) {
  return async function GET(_request: Request, _route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }> }) {
    return ihfrNotImplemented();
  };
}

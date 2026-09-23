import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";
import { parseIHFRRouteContext } from "./ihfr-diagnosis.contracts";
import { ihfrError, ihfrJson } from "./ihfr-diagnosis.http";

type Dependencies = { requireAuth(): Promise<{ id: string }>; service: { operation: IHFRDiagnosisService["operation"] } };
export function createIHFROperationHandler(dependencies: Dependencies) {
  return async function GET(request: Request, route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string; idempotencyKey: string }> }) {
    try {
      const principal = await dependencies.requireAuth();
      const params = await route.params;
      const context = parseIHFRRouteContext({ laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId });
      if (new URL(request.url).search) throw new TypeError("INVALID_REQUEST");
      const response = await dependencies.service.operation(principal.id, context, params.idempotencyKey);
      return ihfrJson(response);
    } catch (error) {
      return ihfrError(error);
    }
  };
}

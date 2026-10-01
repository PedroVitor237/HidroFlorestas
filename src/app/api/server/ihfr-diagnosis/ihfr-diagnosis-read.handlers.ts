import { parseIHFRRouteContext } from "./ihfr-diagnosis.contracts";
import { ihfrError, ihfrJson } from "./ihfr-diagnosis.http";
import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";

type Principal = { id: string };
type RouteParams = { laboratoryId: string; areaId: string; collectionId: string };
type DetailRouteParams = RouteParams & { diagnosisId: string };

type Dependencies = {
  requireAuth(): Promise<Principal>;
  service: Pick<IHFRDiagnosisService, "readCurrent" | "readDetail">;
};

export function createIHFRCurrentHandler(dependencies: Dependencies) {
  return async function GET(_request: Request, route: { params: Promise<RouteParams> }) {
    try {
      const principal = await dependencies.requireAuth();
      const context = parseIHFRRouteContext(await route.params);
      return ihfrJson({ diagnosis: await dependencies.service.readCurrent(principal.id, context) });
    } catch (error) {
      return ihfrError(error);
    }
  };
}

export function createIHFRDetailHandler(dependencies: Dependencies) {
  return async function GET(_request: Request, route: { params: Promise<DetailRouteParams> }) {
    try {
      const principal = await dependencies.requireAuth();
      const params = await route.params;
      const context = parseIHFRRouteContext({ laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId });
      return ihfrJson({ diagnosis: await dependencies.service.readDetail(principal.id, context, params.diagnosisId) });
    } catch (error) {
      return ihfrError(error);
    }
  };
}

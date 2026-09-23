import type { IHFRLandUseType } from "@/types/ihfr-diagnosis.type";
import type { IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";
import { parseIHFRRouteContext } from "./ihfr-diagnosis.contracts";
import { ihfrError, ihfrJson } from "./ihfr-diagnosis.http";

type Principal = { id: string };
type Dependencies = {
  requireAuth(): Promise<Principal>;
  service: Pick<IHFRDiagnosisService, "eligibility">;
};

const landUseTypes = new Set(["FOREST", "AGROFORESTRY", "CROPLAND", "PASTURE", "DEGRADED_PASTURE", "BARE_SOIL", "URBAN"]);

export function createIHFREligibilityHandler(dependencies: Dependencies) {
  return async function GET(request: Request, route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }> }) {
    try {
      const principal = await dependencies.requireAuth();
      const context = parseIHFRRouteContext(await route.params);
      const query = new URL(request.url).searchParams;
      if ([...query.keys()].some((key) => key !== "landUseType") || query.getAll("landUseType").length > 1) throw new TypeError("INVALID_REQUEST");
      const landUseType = query.get("landUseType");
      if (landUseType !== null && !landUseTypes.has(landUseType)) throw new TypeError("INVALID_REQUEST");
      const result = await dependencies.service.eligibility(principal.id, context, (landUseType ?? undefined) as IHFRLandUseType | undefined);
      return ihfrJson({ eligible: result.eligible, outcome: result.outcome, reasons: result.reasons, hasCurrentDiagnosis: result.hasCurrentDiagnosis, currentDiagnosisId: result.currentDiagnosisId ?? null });
    } catch (error) {
      return ihfrError(error);
    }
  };
}

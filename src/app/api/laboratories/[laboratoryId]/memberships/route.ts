import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { laboratoryMembershipsService, type LaboratoryMembershipsService } from "@/app/api/server/services/laboratory-memberships.service";
import { areaJson, areaError } from "@/app/api/server/areas/area.http";
type RouteContext = { params: Promise<{ laboratoryId: string }> };
export function createMembershipListHandler(deps: { requireAuth: typeof requireAuth; service: Pick<LaboratoryMembershipsService, "list"> }) {
  return async (_request: Request, route: RouteContext) => {
    try { const principal = await deps.requireAuth(); const { laboratoryId } = await route.params; return areaJson(await deps.service.list(principal.id, laboratoryId)); }
    catch (error) { return areaError(error); }
  };
}
export const GET = createMembershipListHandler({ requireAuth, service: laboratoryMembershipsService });

import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { laboratoryMembershipsService, type LaboratoryMembershipsService } from "@/app/api/server/services/laboratory-memberships.service";
import { parseMembershipChange } from "@/app/api/server/laboratories/laboratory-membership.contracts";
import { areaJson, areaError, readAreaBody } from "@/app/api/server/areas/area.http";
import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
type RouteContext = { params: Promise<{ laboratoryId: string; membershipId: string }> };
export function createMembershipChangeHandler(deps: { requireAuth: typeof requireAuth; service: Pick<LaboratoryMembershipsService, "change"> }) {
  return async (request: Request, route: RouteContext) => {
    try { const principal = await deps.requireAuth(); const input = parseMembershipChange(await readAreaBody(request)); if (!input) throw new AreaAccessError("INVALID_INPUT"); const { laboratoryId, membershipId } = await route.params; return areaJson(await deps.service.change(principal.id, laboratoryId, membershipId, input)); }
    catch (error) { return areaError(error); }
  };
}
export const PATCH = createMembershipChangeHandler({ requireAuth, service: laboratoryMembershipsService });

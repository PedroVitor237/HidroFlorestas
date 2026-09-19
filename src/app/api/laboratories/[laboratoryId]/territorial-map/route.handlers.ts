import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { territorialMapService, type TerritorialMapService } from "@/app/api/server/services/territorial-map.service";
import { territorialError, territorialJson } from "@/app/api/server/territorial-map/territorial-map.http";

type Context = { params: Promise<{ laboratoryId: string }> };
export function createTerritorialMapHandler(deps: { requireAuth: typeof requireAuth; service: Pick<TerritorialMapService, "read"> }) {
  return async (_request: Request, route: Context) => {
    try {
      const principal = await deps.requireAuth();
      const { laboratoryId } = await route.params;
      return territorialJson(await deps.service.read(principal.id, laboratoryId));
    } catch (error) {
      return territorialError(error);
    }
  };
}
export const GET = createTerritorialMapHandler({ requireAuth, service: territorialMapService });

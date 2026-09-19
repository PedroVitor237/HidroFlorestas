import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { dashboardService, type DashboardService } from "@/app/api/server/services/dashboard.service";
import { dashboardError, dashboardJson } from "@/app/api/server/dashboard/dashboard.http";
type Context = { params: Promise<{ laboratoryId: string }> };
export function createDashboardHistoryHandler(deps: { requireAuth: typeof requireAuth; service: Pick<DashboardService, "history"> }) { return async (request: Request, route: Context) => { try { const principal = await deps.requireAuth(); const { laboratoryId } = await route.params; const cursor = new URL(request.url).searchParams.get("cursor") ?? undefined; return dashboardJson(await deps.service.history(principal.id, laboratoryId, cursor)); } catch (error) { return dashboardError(error); } }; }
export const GET = createDashboardHistoryHandler({ requireAuth, service: dashboardService });

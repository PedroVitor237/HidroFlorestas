import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { dashboardService, type DashboardService } from "@/app/api/server/services/dashboard.service";
import { dashboardError, dashboardJson } from "@/app/api/server/dashboard/dashboard.http";
type Context = { params: Promise<{ laboratoryId: string }> };
export function createDashboardSummaryHandler(deps: { requireAuth: typeof requireAuth; service: Pick<DashboardService, "summary"> }) { return async (_request: Request, route: Context) => { try { const principal = await deps.requireAuth(); const { laboratoryId } = await route.params; return dashboardJson(await deps.service.summary(principal.id, laboratoryId)); } catch (error) { return dashboardError(error); } }; }
export const GET = createDashboardSummaryHandler({ requireAuth, service: dashboardService });

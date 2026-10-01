import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { environmentalDataService } from "@/app/api/server/services/environmental-data.service";
import { createEnvironmentalHandlers } from "@/app/api/server/environmental-data/environmental-data.http";
const handlers=createEnvironmentalHandlers({requireAuth,service:environmentalDataService});
export const POST=handlers.POST;
export const GET=handlers.GET;

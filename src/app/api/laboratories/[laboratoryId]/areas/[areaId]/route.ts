import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { areasService, type AreasService } from "@/app/api/server/services/areas.service";
import { areaJson,areaError } from "@/app/api/server/areas/area.http";
export function createAreaDetailHandler(deps:{requireAuth:typeof requireAuth;service:Pick<AreasService,"detail">}){
 return async(_request:Request,route:{params:Promise<{laboratoryId:string;areaId:string}>})=>{
 try{const principal=await deps.requireAuth();const {laboratoryId,areaId}=await route.params;return areaJson(await deps.service.detail(principal.id,laboratoryId,areaId));}catch(error){return areaError(error);}
 };
}
export const GET=createAreaDetailHandler({requireAuth,service:areasService});

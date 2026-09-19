import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { areasService, type AreasService } from "@/app/api/server/services/areas.service";
import { parseAreaInput } from "@/app/api/server/areas/area.contracts";
import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
import { areaJson,areaError,readAreaBody } from "@/app/api/server/areas/area.http";
type Context={params:Promise<{laboratoryId:string}>};
export function createAreaHandlers(deps:{requireAuth:typeof requireAuth;service:Pick<AreasService,"create"|"list">}){
 return {
 GET:async(_request:Request,route:Context)=>{try{const principal=await deps.requireAuth();const {laboratoryId}=await route.params;return areaJson(await deps.service.list(principal.id,laboratoryId));}catch(error){return areaError(error);}},
 POST:async(request:Request,route:Context)=>{try{const principal=await deps.requireAuth();const input=parseAreaInput(await readAreaBody(request));if(!input)throw new AreaAccessError("INVALID_INPUT");const {laboratoryId}=await route.params;const result=await deps.service.create(principal.id,laboratoryId,input);return areaJson(result,201,{Location:`/dashboard/laboratories/${laboratoryId}/areas/${result.area.id}`});}catch(error){return areaError(error);}}
 };
}
const handlers=createAreaHandlers({requireAuth,service:areasService});export const GET=handlers.GET;export const POST=handlers.POST;

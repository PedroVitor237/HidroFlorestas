import { requireAdmin } from "../../../../server/middlewares/admin.middleware";
import { userAdministrationService, type UserAdministrationService } from "../../../../server/services/user-administration.service";
import { UserAdministrationError } from "../../../../server/user-administration/user-administration.contracts";
import { administrationError, administrationJson } from "../../../../server/user-administration/user-administration.http";
type Context={params:Promise<{userId:string}>};
export function createAdminUserAuditHandler(deps:{requireAdmin:typeof requireAdmin;service:Pick<UserAdministrationService,"audit">}){return async(request:Request,context:Context)=>{try{const actor=await deps.requireAdmin();const {userId}=await context.params;const url=new URL(request.url);const rawLimit=url.searchParams.get("limit");const limit=rawLimit===null?25:Number(rawLimit);if([...url.searchParams.keys()].some(key=>!["cursor","limit"].includes(key)))throw new UserAdministrationError("INVALID_FILTER");return administrationJson(await deps.service.audit(actor.id,userId,url.searchParams.get("cursor")??undefined,limit));}catch(error){return administrationError(error);}};}
export const GET=createAdminUserAuditHandler({requireAdmin,service:userAdministrationService});

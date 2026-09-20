import { requireAdmin } from "../../../server/middlewares/admin.middleware";
import { userAdministrationService, type UserAdministrationService } from "../../../server/services/user-administration.service";
import { administrationError, administrationJson } from "../../../server/user-administration/user-administration.http";
type Context={params:Promise<{userId:string}>};
export function createAdminUserDetailHandler(deps:{requireAdmin:typeof requireAdmin;service:Pick<UserAdministrationService,"detail">}){return async(_request:Request,context:Context)=>{try{const actor=await deps.requireAdmin();const {userId}=await context.params;return administrationJson(await deps.service.detail(actor.id,userId));}catch(error){return administrationError(error);}};}
export const GET=createAdminUserDetailHandler({requireAdmin,service:userAdministrationService});

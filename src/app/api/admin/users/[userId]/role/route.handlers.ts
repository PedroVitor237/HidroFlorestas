import { requireAdmin } from "../../../../server/middlewares/admin.middleware";
import { userAdministrationService, type UserAdministrationService } from "../../../../server/services/user-administration.service";
import { parseRoleChange, UserAdministrationError } from "../../../../server/user-administration/user-administration.contracts";
import { administrationError, administrationJson } from "../../../../server/user-administration/user-administration.http";
type Context={params:Promise<{userId:string}>}; async function body(request:Request){try{return await request.json();}catch{throw new UserAdministrationError("INVALID_INPUT");}}
export function createAdminUserRoleHandler(deps:{requireAdmin:typeof requireAdmin;service:Pick<UserAdministrationService,"changeRole">}){return async(request:Request,context:Context)=>{try{const actor=await deps.requireAdmin();const {userId}=await context.params;return administrationJson(await deps.service.changeRole(actor.id,userId,parseRoleChange(await body(request))));}catch(error){return administrationError(error);}};}
export const PATCH=createAdminUserRoleHandler({requireAdmin,service:userAdministrationService});

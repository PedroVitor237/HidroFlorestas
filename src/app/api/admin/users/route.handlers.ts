import { requireAdmin } from "../../server/middlewares/admin.middleware";
import { userAdministrationService, type UserAdministrationService } from "../../server/services/user-administration.service";
import { parseListQuery } from "../../server/user-administration/user-administration.contracts";
import { administrationError, administrationJson } from "../../server/user-administration/user-administration.http";
export function createAdminUsersListHandler(deps:{requireAdmin:typeof requireAdmin;service:Pick<UserAdministrationService,"list">}){return async(request:Request)=>{try{const actor=await deps.requireAdmin();return administrationJson(await deps.service.list(actor.id,parseListQuery(new URL(request.url))));}catch(error){return administrationError(error);}};}
export const GET=createAdminUsersListHandler({requireAdmin,service:userAdministrationService});

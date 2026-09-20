import { requireAuth } from "./auth.middleware";
import { requireGlobalAdmin } from "../user-administration/global-authority";

export async function requireAdmin() {

    const user = await requireAuth();

    return requireGlobalAdmin(user);
}

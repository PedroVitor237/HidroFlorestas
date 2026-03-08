import { requireAuth } from "./auth.middleware";

export async function requireAdmin() {

    const user = await requireAuth();

    if (!user.isAdmin) {
        throw new Error("FORBIDDEN");
    }

    return user;
}
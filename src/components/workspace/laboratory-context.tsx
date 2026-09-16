import { notFound, redirect } from "next/navigation";
import { requireAuth, AuthBoundaryError } from "@/app/api/server/middlewares/auth.middleware";
import { authorizeLaboratoryAccess, AreaAccessError, type AreaPermission } from "@/app/api/server/areas/area.authorization";
export async function getLaboratoryContext(laboratoryId: string, permission: AreaPermission = "READ_AREAS", mutate = false) {
  try { const principal = await requireAuth(); return await authorizeLaboratoryAccess(principal, laboratoryId, permission, undefined, mutate); }
  catch (error) {
    if ((error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") || (error instanceof AreaAccessError && error.code === "UNAUTHENTICATED")) redirect("/login");
    if (error instanceof AreaAccessError && ["NOT_FOUND", "FORBIDDEN", "READ_ONLY"].includes(error.code)) notFound();
    throw new Error("Não foi possível carregar o laboratório.");
  }
}

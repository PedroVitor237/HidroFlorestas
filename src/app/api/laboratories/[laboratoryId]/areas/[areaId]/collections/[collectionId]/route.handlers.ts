import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
import { collectionError, collectionSuccess } from "@/app/api/server/collections/collection.contracts";
import { AuthBoundaryError, requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { CollectionServiceError, collectionsService, type CollectionsService } from "@/app/api/server/services/collections.service";

type Context = { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }> };

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function failure(error: unknown) {
  if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") return json(collectionError("UNAUTHENTICATED"), 401);
  if (error instanceof AreaAccessError) {
    if (error.code === "UNAUTHENTICATED") return json(collectionError("UNAUTHENTICATED"), 401);
    if (error.code === "FORBIDDEN") return json(collectionError("FORBIDDEN"), 403);
    if (error.code === "NOT_FOUND") return json(collectionError("NOT_FOUND"), 404);
  }
  if (error instanceof CollectionServiceError && error.code === "NOT_FOUND") return json(collectionError("NOT_FOUND"), 404);
  return json(collectionError("INTERNAL_ERROR"), 500);
}

export function createCollectionDetailHandlers(dependencies: {
  requireAuth: typeof requireAuth;
  service: Pick<CollectionsService, "detail">;
}) {
  return {
    GET: async (_request: Request, context: Context) => {
      try {
        const principal = await dependencies.requireAuth();
        const { laboratoryId, areaId, collectionId } = await context.params;
        const result = await dependencies.service.detail(principal.id, laboratoryId, areaId, collectionId);
        return json(collectionSuccess(result.collection), 200);
      } catch (error) {
        return failure(error);
      }
    },
  };
}

const handlers = createCollectionDetailHandlers({ requireAuth, service: collectionsService });
export const GET = handlers.GET;

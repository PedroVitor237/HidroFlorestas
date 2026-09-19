import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
import {
  CollectionContractError,
  collectionError,
  collectionSuccess,
  parseCollectionInput,
  parseIdempotencyKey,
} from "@/app/api/server/collections/collection.contracts";
import { AuthBoundaryError, requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import {
  CollectionServiceError,
  collectionsService,
  type CollectionsService,
} from "@/app/api/server/services/collections.service";

type Context = { params: Promise<{ laboratoryId: string; areaId: string }> };

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function errorResponse(error: unknown) {
  if (error instanceof CollectionContractError) return json(collectionError("INVALID_REQUEST"), 400);
  if (error instanceof AuthBoundaryError) {
    return json(collectionError(error.code === "UNAUTHORIZED" ? "UNAUTHENTICATED" : "INTERNAL_ERROR"), error.code === "UNAUTHORIZED" ? 401 : 500);
  }
  if (error instanceof AreaAccessError) {
    const mapping = {
      UNAUTHENTICATED: [401, "UNAUTHENTICATED"],
      FORBIDDEN: [403, "FORBIDDEN"],
      NOT_FOUND: [404, "NOT_FOUND"],
      READ_ONLY: [409, "READ_ONLY"],
      INVALID_INPUT: [400, "INVALID_REQUEST"],
      CONFLICT: [409, "CONFLICT"],
      INTERNAL_ERROR: [500, "INTERNAL_ERROR"],
    } as const;
    const [status, code] = mapping[error.code];
    return json(collectionError(code), status);
  }
  if (error instanceof CollectionServiceError) {
    const mapping = {
      NOT_IMPLEMENTED: [500, "INTERNAL_ERROR"],
      NOT_FOUND: [404, "NOT_FOUND"],
      CONFLICT: [409, "CONFLICT"],
      INTERNAL_ERROR: [500, "INTERNAL_ERROR"],
    } as const;
    const [status, code] = mapping[error.code];
    return json(collectionError(code), status);
  }
  return json(collectionError("INTERNAL_ERROR"), 500);
}

export function createCollectionHandlers(dependencies: {
  requireAuth: typeof requireAuth;
  service: Pick<CollectionsService, "create">;
}) {
  return {
    POST: async (request: Request, context: Context) => {
      try {
        const principal = await dependencies.requireAuth();
        const { laboratoryId, areaId } = await context.params;
        const confirmationKey = parseIdempotencyKey(request.headers.get("Idempotency-Key"));
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          throw new CollectionContractError("INVALID_REQUEST", "FORMAT");
        }
        const occurrence = parseCollectionInput(body);
        const result = await dependencies.service.create({
          userId: principal.id,
          laboratoryId,
          areaId,
          confirmationKey,
          occurrence,
        });
        const location = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${result.collection.id}`;
        return json(collectionSuccess(result.collection), result.created ? 201 : 200, { Location: location });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

const handlers = createCollectionHandlers({ requireAuth, service: collectionsService });
export const POST = handlers.POST;

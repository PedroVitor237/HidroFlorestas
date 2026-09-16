import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { CollectionServiceError } from "../../src/app/api/server/services/collections.service";
import { createCollectionHandlers } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/route";
import { createCollectionDetailHandlers } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/route";

const laboratoryId = "00000000-0000-4000-8000-000000000411";
const areaId = "00000000-0000-4000-8000-000000000421";
const collectionId = "00000000-0000-4000-8000-000000000431";
const key = "40000000-0000-4000-8000-000000000431";
const userId = "00000000-0000-4000-8000-000000000401";

const collection = {
  id: collectionId,
  occurredAt: "2026-09-15T09:00:00.000-03:00",
  confirmedAt: "2026-09-15T12:05:00.000Z",
  area: { id: areaId, name: "Área" },
  laboratory: { id: laboratoryId, name: "Laboratório", status: "ACTIVE" as const },
  readOnly: false,
};

function request(body: unknown = { occurredAt: "2026-09-15T09:00:00-03:00" }, idempotencyKey = key) {
  return new Request("http://local.test/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(body),
  });
}

function context(laboratory = laboratoryId, area = areaId) {
  return { params: Promise.resolve({ laboratoryId: laboratory, areaId: area }) };
}

describe("POST collection route", () => {
  it("creates and replays with exact envelope, API Location and no-store", async () => {
    for (const created of [true, false]) {
      let received: unknown;
      const handlers = createCollectionHandlers({
        requireAuth: async () => ({ id: userId, firstName: "A", lastName: "B", image: "", isAdmin: false }),
        service: { create: async (command) => { received = command; return { created, collection }; } },
      });
      const response = await handlers.POST(request(), context());
      assert.equal(response.status, created ? 201 : 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(response.headers.get("location"), `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}`);
      assert.deepEqual(await response.json(), { collection });
      assert.equal((received as { userId: string }).userId, userId);
    }
  });

  it("rejects missing, malformed or non-profile idempotency keys and closed bodies", async () => {
    for (const [body, candidate] of [
      [{ occurredAt: collection.occurredAt }, ""],
      [{ occurredAt: collection.occurredAt }, "not-a-uuid"],
      [{ occurredAt: collection.occurredAt }, "00000000-0000-0000-0000-000000000000"],
      [{ occurredAt: collection.occurredAt, userId }, key],
      [{ occurredAt: collection.occurredAt, confirmedAt: collection.confirmedAt }, key],
    ] as const) {
      const handlers = createCollectionHandlers({
        requireAuth: async () => ({ id: userId } as never),
        service: { create: async () => { throw new Error("must not call"); } },
      });
      const response = await handlers.POST(request(body, candidate), context());
      assert.equal(response.status, 400);
      const payload = await response.json();
      assert.deepEqual(Object.keys(payload), ["error"]);
      assert.equal(payload.error.code, "INVALID_REQUEST");
      assert.equal(typeof payload.error.message, "string");
    }
  });

  it("maps authentication, authorization, not-found, read-only, conflict and internal errors", async () => {
    const cases = [
      [new AuthBoundaryError("UNAUTHORIZED"), 401, "UNAUTHENTICATED"],
      [new AreaAccessError("FORBIDDEN"), 403, "FORBIDDEN"],
      [new AreaAccessError("NOT_FOUND"), 404, "NOT_FOUND"],
      [new AreaAccessError("READ_ONLY"), 409, "READ_ONLY"],
      [new CollectionServiceError("CONFLICT"), 409, "CONFLICT"],
      [new Error("secret database detail"), 500, "INTERNAL_ERROR"],
    ] as const;
    for (const [failure, status, code] of cases) {
      const handlers = createCollectionHandlers({
        requireAuth: async () => {
          if (failure instanceof AuthBoundaryError) throw failure;
          return { id: userId } as never;
        },
        service: { create: async () => { throw failure; } },
      });
      const response = await handlers.POST(request(), context());
      assert.equal(response.status, status);
      const payload = await response.json();
      assert.equal(payload.error.code, code);
      assert.equal(JSON.stringify(payload).includes("database"), false);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
  });
});

describe("GET collection detail route", () => {
  const detailContext = () => ({ params: Promise.resolve({ laboratoryId, areaId, collectionId }) });

  it("returns the closed contextual DTO with no-store", async () => {
    let received: unknown;
    const handlers = createCollectionDetailHandlers({
      requireAuth: async () => ({ id: userId, firstName: "A", lastName: "B", image: "", isAdmin: false }),
      service: { detail: async (...parameters: unknown[]) => { received = parameters; return { collection }; } },
    });
    const response = await handlers.GET(new Request("http://local.test/detail"), detailContext());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { collection });
    assert.deepEqual(received, [userId, laboratoryId, areaId, collectionId]);
  });

  it("maps unauthenticated, missing/crossed and internal failures uniformly", async () => {
    for (const [failure, status, code] of [
      [new AuthBoundaryError("UNAUTHORIZED"), 401, "UNAUTHENTICATED"],
      [new CollectionServiceError("NOT_FOUND"), 404, "NOT_FOUND"],
      [new Error("database secret"), 500, "INTERNAL_ERROR"],
    ] as const) {
      const handlers = createCollectionDetailHandlers({
        requireAuth: async () => {
          if (failure instanceof AuthBoundaryError) throw failure;
          return { id: userId, firstName: "A", lastName: "B", image: "", isAdmin: false };
        },
        service: { detail: async () => { throw failure; } },
      });
      const response = await handlers.GET(new Request("http://local.test/detail"), detailContext());
      assert.equal(response.status, status);
      const payload = await response.json();
      assert.equal(payload.error.code, code);
      assert.equal(JSON.stringify(payload).includes("database"), false);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import { createLaboratoriesHandlers } from "../../src/app/api/laboratories/route.handlers";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";

const principal = { id: "principal-id", firstName: "Ana", lastName: "Silva", image: "", role: "USER" as const, };
const laboratory = { id: "lab-id", name: "Lab", createdAt: "2026-09-07T12:00:00.000Z", status: "ACTIVE" as const, isOwner: true };
const request = (body: unknown) => new NextRequest("http://localhost/api/laboratories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

describe("/api/laboratories", () => {
  it("uses only principal.id for POST and returns exact DTO", async () => {
    const seen: unknown[] = [];
    const handlers = createLaboratoriesHandlers({ requireAuth: async () => principal, service: { listAccessible: async () => ({ success: true, laboratories: [] }), create: async (...args) => { seen.push(args); return { success: true, laboratory }; } } });
    const response = await handlers.POST(request({ name: "Lab" }));
    assert.equal(response.status, 201); assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(seen, [["principal-id", "Lab"]]);
    assert.deepEqual(await response.json(), { success: true, laboratory });
  });

  it("rejects client identity and maps limit", async () => {
    const service = { listAccessible: async () => ({ success: true as const, laboratories: [] }), create: async () => ({ success: false as const, reason: "LIMIT_REACHED" as const }) };
    const handlers = createLaboratoriesHandlers({ requireAuth: async () => principal, service });
    assert.equal((await handlers.POST(request({ name: "Lab", userId: "other" }))).status, 400);
    const limited = await handlers.POST(request({ name: "Lab" }));
    assert.equal(limited.status, 409); assert.equal((await limited.json()).code, "LABORATORY_LIMIT_REACHED");
  });

  it("lists only service-scoped data", async () => {
    const seen: string[] = [];
    const handlers = createLaboratoriesHandlers({ requireAuth: async () => principal, service: { listAccessible: async (id) => { seen.push(id); return { success: true, laboratories: [laboratory] }; }, create: async () => ({ success: false, reason: "INTERNAL_ERROR" }) } });
    const response = await handlers.GET();
    assert.deepEqual(seen, ["principal-id"]); assert.deepEqual(await response.json(), { success: true, laboratories: [laboratory] });
  });

  it("maps unauthenticated and internal failures without details", async () => {
    for (const error of [new AuthBoundaryError("UNAUTHORIZED"), new Error("database detail")]) {
      const handlers = createLaboratoriesHandlers({ requireAuth: async () => { throw error; }, service: { listAccessible: async () => ({ success: true, laboratories: [] }), create: async () => ({ success: false, reason: "INTERNAL_ERROR" }) } });
      const response = await handlers.GET();
      assert.equal(response.status, error instanceof AuthBoundaryError ? 401 : 500);
      assert.equal(JSON.stringify(await response.json()).includes("database detail"), false);
    }
  });

  it("does not invoke creation when the session is not authoritative", async () => {
    let createCalls = 0;
    const handlers = createLaboratoriesHandlers({
      requireAuth: async () => { throw new AuthBoundaryError("UNAUTHORIZED"); },
      service: {
        listAccessible: async () => ({ success: true, laboratories: [] }),
        create: async () => { createCalls += 1; return { success: false, reason: "INTERNAL_ERROR" }; },
      },
    });

    const response = await handlers.POST(request({ name: "Lab" }));
    assert.equal(response.status, 401);
    assert.equal(createCalls, 0);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import { createLaboratorySettingsHandlers } from "../../src/app/api/laboratories/[laboratoryId]/route";

const principal = { id: "owner", firstName: "Ana", lastName: "Silva", image: "", isAdmin: false };
const context = { params: Promise.resolve({ laboratoryId: "lab-id" }) };
const request = (method: string, confirmationName = "Lab") => new NextRequest("http://localhost/api/laboratories/lab-id", method === "GET" ? { method } : { method, headers: { "content-type": "application/json" }, body: JSON.stringify({ confirmationName }) });

describe("/api/laboratories/[laboratoryId]", () => {
  it("returns scoped details and member initials", async () => {
    const details = { id: "lab-id", name: "Lab", createdAt: "2026-09-07T12:00:00.000Z", status: "ACTIVE" as const, isOwner: true, members: [{ name: "Ana Silva", initials: "AS" }] };
    const handlers = createLaboratorySettingsHandlers({ requireAuth: async () => principal, service: { details: async () => ({ success: true, details }), deactivate: async () => ({ success: true }), delete: async () => ({ success: true }) } });
    assert.deepEqual(await (await handlers.GET!(request("GET"), context)).json(), { success: true, details });
  });

  it("requires exact confirmation and maps owner/data restrictions", async () => {
    const service = { details: async () => ({ success: false as const, reason: "NOT_FOUND" as const }), deactivate: async () => ({ success: false as const, reason: "CONFIRMATION_MISMATCH" as const }), delete: async () => ({ success: false as const, reason: "LABORATORY_HAS_DATA" as const }) };
    const handlers = createLaboratorySettingsHandlers({ requireAuth: async () => principal, service });
    assert.equal((await handlers.PATCH!(request("PATCH", "wrong"), context)).status, 400);
    assert.equal((await handlers.DELETE!(request("DELETE"), context)).status, 409);
  });
});

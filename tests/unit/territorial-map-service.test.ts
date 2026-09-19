import assert from "node:assert/strict";
import { it } from "node:test";
import type { Prisma, PrismaClient } from "../../src/generated/prisma";
import { TerritorialMapService } from "../../src/app/api/server/services/territorial-map.service";

const lab = "10000000-0000-4000-8000-000000000101", user = "10000000-0000-4000-8000-000000000102";
function setup(options: { linked?: boolean; status?: string; active?: boolean; count?: number } = {}) {
  const calls: { method: string; args: unknown }[] = [];
  const count = options.count ?? 2;
  const tx = {
    user: { findUnique: async () => ({ status: options.status ?? "ACTIVE" }) },
    researchersLinked: { findUnique: async () => options.linked === false ? null : ({ role: "MEMBER", laboratoryRoom: { id: lab, name: "Lab", isActive: options.active ?? true } }) },
    collectionArea: { findMany: async (args: unknown) => { calls.push({ method: "areas", args }); return Array.from({ length: count }, (_, index) => ({ id: `area-${index}`, name: `Área ${index}`, latitude: -3, longitude: -38, collectionData: [{ id: `collection-${index}`, occurredAt: new Date("2026-09-19T12:00:00Z"), occurrenceOffset: "-03:00", confirmedAt: new Date("2026-09-19T13:00:00Z") }] })); } },
  };
  const db = { $transaction: async (run: (client: Prisma.TransactionClient) => unknown) => run(tx as unknown as Prisma.TransactionClient) } as unknown as PrismaClient;
  return { service: new TerritorialMapService(db), calls };
}
it("authorizes before one scoped, closed, non-N+1 query", async () => { const { service, calls } = setup(); const result = await service.read(user, lab); assert.equal(result.areas.length, 2); assert.equal(calls.length, 1); const query = calls[0].args as { where: unknown; select: Record<string, unknown> }; assert.deepEqual(query.where, { laboratoryRoomId: lab }); assert.deepEqual(Object.keys(query.select).sort(), ["collectionData", "id", "latitude", "longitude", "name"]); const nested = query.select.collectionData as { where: Record<string, unknown>; select: Record<string, unknown> }; assert.equal(nested.where.laboratoryRoomId, lab); assert.deepEqual(Object.keys(nested.select).sort(), ["confirmedAt", "id", "occurredAt", "occurrenceOffset"]); });
it("keeps inactive laboratories readable", async () => { const result = await setup({ active: false }).service.read(user, lab); assert.equal(result.context.readOnly, true); });
it("queries no territorial data for revoked links or ineligible accounts", async () => { for (const options of [{ linked: false }, { status: "BLOCKED" }]) { const { service, calls } = setup(options); await assert.rejects(service.read(user, lab)); assert.equal(calls.length, 0); } });
it("keeps a proportional projection in one query", async () => { const { service, calls } = setup({ count: 100 }); const result = await service.read(user, lab); assert.equal(result.areas.length, 100); assert.equal(result.areas.reduce((total, area) => total + area.confirmedCollections.length, 0), 100); assert.equal(calls.length, 1); });

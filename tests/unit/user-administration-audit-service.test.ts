/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeAdminCursor, UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";
import { admin, fixedDate, serviceWith, target } from "./user-administration-service.helpers";

describe("user administration audit service", () => {
  it("scopes by target, orders by two keys, applies cursor and allowlists fields", async () => {
    let query: any;
    const event = { id: "event-1", targetUserId: target.id, actorUserId: admin.id, action: "GLOBAL_ROLE_CHANGED", beforeValue: "USER", afterValue: "ADMIN", reason: "promoção", targetRevision: 3, createdAt: fixedDate };
    const cursor = encodeAdminCursor({ id: "event-9", createdAt: fixedDate }, "audit");
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => where.id === admin.id ? admin : { id: target.id } }, administrativeAuditEvent: { findMany: async (value: any) => { query = value; return [event, { ...event, id: "event-0" }]; } } });
    const result = await service.audit(admin.id, target.id, cursor, 1);
    assert.equal(query.where.targetUserId, target.id);
    assert.deepEqual(query.orderBy, [{ createdAt: "desc" }, { id: "desc" }]);
    assert.equal(query.take, 2);
    assert.deepEqual(Object.keys(result.items[0]).sort(), ["action","actorUserId","afterValue","beforeValue","createdAt","id","reason","targetRevision","targetUserId"].sort());
    assert.ok(result.nextCursor);
  });

  it("returns controlled not-found and never fabricates failed/no-op events", async () => {
    let reads = 0;
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => where.id === admin.id ? admin : null }, administrativeAuditEvent: { findMany: async () => { reads++; return []; } } });
    await assert.rejects(service.audit(admin.id, "missing"), (e) => e instanceof UserAdministrationError && e.code === "USER_NOT_FOUND");
    assert.equal(reads, 0);
  });
});

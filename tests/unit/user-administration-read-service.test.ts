/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserAdministrationError, encodeAdminCursor, queryHash } from "../../src/app/api/server/user-administration/user-administration.contracts";
import { admin, findUser, fixedDate, serviceWith, target } from "./user-administration-service.helpers";

describe("user administration read service", () => {
  it("uses stable ordering, search, filters, cursor boundary and an allowlisted projection", async () => {
    let query: any;
    const listQuery = { search: "bia", role: "USER" as const, status: "ACTIVE" as const, limit: 1 };
    const cursor = encodeAdminCursor({ id: "user-9", createdAt: fixedDate }, queryHash(listQuery));
    const service = serviceWith({ user: {
      findUnique: async ({ where }: any) => findUser(where),
      findMany: async (value: any) => { query = value; return [target, { ...target, id: "user-1" }]; },
    }});
    const result = await service.list(admin.id, { ...listQuery, cursor });
    assert.equal(result.items.length, 1);
    assert.ok(result.nextCursor);
    assert.deepEqual(query.orderBy, [{ createdAt: "desc" }, { id: "desc" }]);
    assert.equal(query.take, 2);
    assert.equal(query.where.role, "USER");
    assert.equal(query.where.status, "ACTIVE");
    assert.equal(query.where.OR.length, 2);
    assert.deepEqual(Object.keys(query.select).sort(), ["createdAt","email","firstName","id","lastName","revision","role","status","updatedAt"].sort());
    assert.equal("password" in result.items[0], false);
  });

  it("returns detail and controlled not-found", async () => {
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => where.id === admin.id ? admin : where.id === target.id ? target : null } });
    assert.equal((await service.detail(admin.id, target.id)).email, target.email);
    await assert.rejects(service.detail(admin.id, "missing"), (error) => error instanceof UserAdministrationError && error.code === "USER_NOT_FOUND");
  });
});

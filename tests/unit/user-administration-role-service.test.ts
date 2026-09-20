/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";
import { admin, findUser, serviceWith, target } from "./user-administration-service.helpers";

describe("user administration role service", () => {
  it("changes global role and records one audit event", async () => {
    let event: any;
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => findUser(where), update: async ({ data }: any) => ({ ...target, ...data }) }, administrativeAuditEvent: { create: async ({ data }: any) => { event = data; return data; } } });
    const result = await service.changeRole(admin.id, target.id, { expectedRole: "USER", expectedRevision: 2, role: "MODERATOR", reason: "responsabilidade global" });
    assert.equal(result.role, "MODERATOR");
    assert.equal(event.action, "GLOBAL_ROLE_CHANGED");
  });

  it("rejects self-change and stale/role mismatch; no-op produces no writes", async () => {
    await assert.rejects(serviceWith({}).changeRole(admin.id, admin.id, { expectedRole: "ADMIN", expectedRevision: 0, role: "USER", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "SELF_CHANGE_FORBIDDEN");
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => findUser(where) } });
    await assert.rejects(service.changeRole(admin.id, target.id, { expectedRole: "USER", expectedRevision: 1, role: "MODERATOR", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "STALE_REVISION");
    await assert.rejects(service.changeRole(admin.id, target.id, { expectedRole: "ADMIN", expectedRevision: 2, role: "MODERATOR", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "EXPECTED_ROLE_MISMATCH");
    let writes = 0;
    const noOp = serviceWith({ user: { findUnique: async ({ where }: any) => findUser(where), update: async () => { writes++; } }, administrativeAuditEvent: { create: async () => { writes++; } } });
    await noOp.changeRole(admin.id, target.id, { expectedRole: "USER", expectedRevision: 2, role: "USER", reason: "verificação" });
    assert.equal(writes, 0);
  });

  it("does not grant authority to DEVELOPER or MODERATOR actors", async () => {
    for (const role of ["DEVELOPER", "MODERATOR"] as const) {
      const service = serviceWith({ user: { findUnique: async () => ({ ...admin, role }) } });
      await assert.rejects(service.changeRole("actor", target.id, { expectedRole: "USER", expectedRevision: 2, role: "ADMIN", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "ADMIN_AUTHORITY_REQUIRED");
    }
  });
});

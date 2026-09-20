/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseStatusChange, UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";
import { admin, findUser, serviceWith, target } from "./user-administration-service.helpers";

describe("user administration status service", () => {
  it("mutates once and appends the audit atomically", async () => {
    let update: any; let event: any;
    const service = serviceWith({ user: {
      findUnique: async ({ where }: any) => findUser(where), count: async () => 2,
      update: async ({ data }: any) => { update = data; return { ...target, ...data }; },
    }, administrativeAuditEvent: { create: async ({ data }: any) => { event = data; return data; } } });
    const result = await service.changeStatus(admin.id, target.id, { expectedStatus: "ACTIVE", expectedRevision: 2, status: "BLOCKED", reason: "risco confirmado" });
    assert.equal(result.status, "BLOCKED");
    assert.deepEqual(update, { status: "BLOCKED", revision: 3 });
    assert.equal(event.action, "ACCOUNT_STATUS_CHANGED");
    assert.equal(event.targetRevision, 3);
  });

  it("rejects self-change, stale/current-state mismatch and invalid reason bounds", async () => {
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => findUser(where) } });
    await assert.rejects(service.changeStatus(admin.id, admin.id, { expectedStatus: "ACTIVE", expectedRevision: 0, status: "BLOCKED", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "SELF_CHANGE_FORBIDDEN");
    await assert.rejects(service.changeStatus(admin.id, target.id, { expectedStatus: "ACTIVE", expectedRevision: 1, status: "BLOCKED", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "STALE_REVISION");
    await assert.rejects(service.changeStatus(admin.id, target.id, { expectedStatus: "PENDING", expectedRevision: 2, status: "BLOCKED", reason: "x" }), (e) => e instanceof UserAdministrationError && e.code === "EXPECTED_STATE_MISMATCH");
    assert.throws(() => parseStatusChange({ expectedStatus: "ACTIVE", expectedRevision: 2, status: "BLOCKED", reason: "" }), (e) => e instanceof UserAdministrationError && e.code === "INVALID_REASON");
    assert.throws(() => parseStatusChange({ expectedStatus: "ACTIVE", expectedRevision: 2, status: "BLOCKED", reason: "x".repeat(501) }), (e) => e instanceof UserAdministrationError && e.code === "INVALID_REASON");
  });

  it("treats a no-op as non-destructive and creates no audit event", async () => {
    let writes = 0;
    const service = serviceWith({ user: { findUnique: async ({ where }: any) => findUser(where), update: async () => { writes++; } }, administrativeAuditEvent: { create: async () => { writes++; } } });
    const result = await service.changeStatus(admin.id, target.id, { expectedStatus: "ACTIVE", expectedRevision: 2, status: "ACTIVE", reason: "verificação" });
    assert.equal(result.revision, 2);
    assert.equal(writes, 0);
  });
});

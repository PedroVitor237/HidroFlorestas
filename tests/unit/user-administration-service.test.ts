import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "../../src/generated/prisma";

import { UserAdministrationService } from "../../src/app/api/server/services/user-administration.service";
import { UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";

const date = new Date("2026-09-19T12:00:00.000Z");
const target = {
  id: "user-2",
  firstName: "Bia",
  lastName: "Pessoa",
  email: "bia@example.test",
  role: "USER" as const,
  status: "ACTIVE" as const,
  revision: 2,
  createdAt: date,
  updatedAt: date,
};

function serviceWith(transaction: Record<string, unknown>) {
  const db = {
    $transaction: async (run: (tx: Record<string, unknown>) => Promise<unknown>) =>
      run(transaction),
  } as unknown as PrismaClient;
  return new UserAdministrationService(db);
}

describe("user administration service", () => {
  it("revalidates the current actor before returning allowlisted users", async () => {
    let query: unknown;
    const service = serviceWith({
      user: {
        findUnique: async ({ where }: { where: { id: string } }) =>
          where.id === "admin-1"
            ? { id: "admin-1", role: "ADMIN", status: "ACTIVE" }
            : target,
        findMany: async (value: unknown) => {
          query = value;
          return [target];
        },
      },
    });
    const result = await service.list("admin-1", { search: "", limit: 25 });
    assert.equal(result.items.length, 1);
    assert.equal("password" in result.items[0], false);
    assert.deepEqual(
      (query as { orderBy: unknown }).orderBy,
      [{ createdAt: "desc" }, { id: "desc" }],
    );
  });

  it("changes status and appends its audit event in the same transaction", async () => {
    let updateData: unknown;
    let auditData: unknown;
    const service = serviceWith({
      user: {
        findUnique: async ({ where }: { where: { id: string } }) =>
          where.id === "admin-1"
            ? { id: "admin-1", role: "ADMIN", status: "ACTIVE" }
            : target,
        update: async ({ data }: { data: unknown }) => {
          updateData = data;
          return { ...target, status: "BLOCKED", revision: 3 };
        },
        count: async () => 2,
      },
      administrativeAuditEvent: {
        create: async ({ data }: { data: unknown }) => {
          auditData = data;
          return {};
        },
      },
    });
    const result = await service.changeStatus("admin-1", "user-2", {
      expectedStatus: "ACTIVE",
      expectedRevision: 2,
      status: "BLOCKED",
      reason: "incidente confirmado",
    });
    assert.equal(result.status, "BLOCKED");
    assert.deepEqual(updateData, { status: "BLOCKED", revision: 3 });
    assert.deepEqual(auditData, {
      actorUserId: "admin-1",
      targetUserId: "user-2",
      action: "ACCOUNT_STATUS_CHANGED",
      beforeValue: "ACTIVE",
      afterValue: "BLOCKED",
      reason: "incidente confirmado",
      targetRevision: 3,
    });
  });

  it("rejects self-change, stale revisions, and removal of the last active admin", async () => {
    const selfService = serviceWith({});
    await assert.rejects(
      selfService.changeRole("admin-1", "admin-1", {
        expectedRole: "ADMIN",
        expectedRevision: 0,
        role: "USER",
        reason: "teste",
      }),
      (error) => error instanceof UserAdministrationError && error.code === "SELF_CHANGE_FORBIDDEN",
    );

    const staleService = serviceWith({
      user: {
        findUnique: async ({ where }: { where: { id: string } }) =>
          where.id === "admin-1"
            ? { id: "admin-1", role: "ADMIN", status: "ACTIVE" }
            : target,
      },
    });
    await assert.rejects(
      staleService.changeStatus("admin-1", "user-2", {
        expectedStatus: "ACTIVE",
        expectedRevision: 1,
        status: "BLOCKED",
        reason: "teste",
      }),
      (error) => error instanceof UserAdministrationError && error.code === "STALE_REVISION",
    );

    const activeAdmin = { ...target, role: "ADMIN" as const };
    const lastAdminService = serviceWith({
      user: {
        findUnique: async ({ where }: { where: { id: string } }) =>
          where.id === "admin-1"
            ? { id: "admin-1", role: "ADMIN", status: "ACTIVE" }
            : activeAdmin,
        count: async () => 1,
      },
    });
    await assert.rejects(
      lastAdminService.changeRole("admin-1", "user-2", {
        expectedRole: "ADMIN",
        expectedRevision: 2,
        role: "USER",
        reason: "teste",
      }),
      (error) => error instanceof UserAdministrationError && error.code === "LAST_ACTIVE_ADMIN",
    );
  });
});

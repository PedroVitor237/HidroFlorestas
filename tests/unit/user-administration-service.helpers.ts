import type { PrismaClient } from "../../src/generated/prisma";
import { UserAdministrationService } from "../../src/app/api/server/services/user-administration.service";

export const fixedDate = new Date("2026-09-19T12:00:00.000Z");
export const admin = { id: "admin-1", role: "ADMIN" as const, status: "ACTIVE" as const };
export const target = {
  id: "user-2", firstName: "Bia", lastName: "Pessoa", email: "bia@example.test",
  role: "USER" as const, status: "ACTIVE" as const, revision: 2,
  createdAt: fixedDate, updatedAt: fixedDate,
};

export function serviceWith(transaction: Record<string, unknown>) {
  const db = {
    $transaction: async (run: (tx: Record<string, unknown>) => Promise<unknown>) => run(transaction),
  } as unknown as PrismaClient;
  return new UserAdministrationService(db);
}

export function findUser(where: { id: string }) {
  return where.id === admin.id ? admin : target;
}

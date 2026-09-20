import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient, type UserRole, type UserStatus } from "../../src/generated/prisma";

export const ADMINISTRATION_FIXTURE_PREFIX = "90000000-0000-4000-8000-";
export const administrationFixtureId = (index: number) => `${ADMINISTRATION_FIXTURE_PREFIX}${String(index).padStart(12, "0")}`;

export function createAdministrationClient() {
  const connectionString = process.env.TEST_DATABASE_URL;
  if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" || !connectionString) throw new Error("Unsafe administration fixture environment");
  neonConfig.webSocketConstructor = ws;
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

export async function setupAdministrationFixtures(db: PrismaClient, count = 54) {
  for (let index = 1; index <= count; index += 1) {
    const role: UserRole = index <= 2 ? "ADMIN" : index === 3 ? "MODERATOR" : "USER";
    const status: UserStatus = index === 4 ? "BLOCKED" : "ACTIVE";
    await db.user.upsert({
      where: { id: administrationFixtureId(index) },
      create: { id: administrationFixtureId(index), email: `imp009-${index}@test.invalid`, firstName: `Fixture${String(index).padStart(2, "0")}`, lastName: "IMP009", password: "not-a-login-password", role, status },
      update: { role, status, revision: 0 },
    });
  }
}

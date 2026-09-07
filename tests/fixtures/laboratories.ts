import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient } from "../../src/generated/prisma/index.js";
import { AUTH_FIXTURE_USERS, validateAuthFixtureEnvironment } from "./auth-users";

export const LABORATORY_FIXTURE_PREFIX = "IMP-002 E2E";
export const LABORATORY_SECOND_USER = {
  id: "00000000-0000-4000-8000-000000000012",
  email: "second-active@laboratory-test.hidroflorestas.invalid",
} as const;

function createClient(testDatabaseUrl: string) {
  neonConfig.webSocketConstructor = ws;
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString: testDatabaseUrl }) });
}

export async function setupLaboratoryFixtures(environment: Record<string, string | undefined>) {
  const safe = validateAuthFixtureEnvironment(environment);
  const prisma = createClient(safe.testDatabaseUrl);
  try {
    await prisma.user.upsert({
      where: { id: LABORATORY_SECOND_USER.id },
      create: {
        ...LABORATORY_SECOND_USER,
        firstName: "Second",
        lastName: "Laboratory Test",
        password: "session-only-fixture",
        image: "",
        status: "ACTIVE",
        role: "USER",
        isAdmin: false,
      },
      update: { email: LABORATORY_SECOND_USER.email, status: "ACTIVE" },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function cleanupLaboratoryFixtures(environment: Record<string, string | undefined>) {
  const safe = validateAuthFixtureEnvironment(environment);
  const prisma = createClient(safe.testDatabaseUrl);
  const userIds = [...AUTH_FIXTURE_USERS.map((user) => user.id), LABORATORY_SECOND_USER.id];
  try {
    const laboratories = await prisma.laboratoryRoom.findMany({
      where: { userId: { in: userIds }, name: { startsWith: LABORATORY_FIXTURE_PREFIX } },
      select: { id: true },
    });
    const laboratoryIds = laboratories.map((laboratory) => laboratory.id);
    if (laboratoryIds.length) {
      await prisma.$transaction([
        prisma.researchersLinked.deleteMany({ where: { laboratoryRoomId: { in: laboratoryIds }, userId: { in: userIds } } }),
        prisma.laboratoryRoom.deleteMany({ where: { id: { in: laboratoryIds }, userId: { in: userIds } } }),
      ]);
    }
    await prisma.user.deleteMany({ where: { id: LABORATORY_SECOND_USER.id, email: LABORATORY_SECOND_USER.email } });
  } finally {
    await prisma.$disconnect();
  }
}

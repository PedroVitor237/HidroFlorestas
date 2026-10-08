export const DASHBOARD_FIXTURE_CONFIRMATION = "HIDROFLORESTAS_IMP007_TEST";
export const DASHBOARD_FIXTURE_PREFIX = "IMP-007 E2E";

const uuid = (suffix: number) =>
  `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;

export const DASHBOARD_FIXTURES = {
  userIds: [701, 702, 703, 704].map(uuid),
  laboratoryIds: [711, 712, 713].map(uuid),
  areaIds: Array.from({ length: 24 }, (_, index) => uuid(721 + index)),
  collectionIds: Array.from({ length: 24 }, (_, index) => uuid(751 + index)),
  cleanupOrder: [
    "CollectionData",
    "CollectionArea",
    "ResearchersLinked",
    "LaboratoryRoom",
    "User",
  ],
} as const;

export type DashboardFixtureEnvironment = Record<string, string | undefined>;
export type SafeDashboardFixtureEnvironment = {
  testDatabaseUrl: string;
  developmentDatabaseUrl: string;
};

export type DashboardFixtureActions = {
  cleanup: () => Promise<void>;
  setup: (password: string) => Promise<void>;
  count: () => Promise<Record<string, number>>;
  disconnect: () => Promise<void>;
};

export type DashboardFixtureActionsFactory = (
  testDatabaseUrl: string,
) => DashboardFixtureActions;

const fixtureEmail = (index: number) =>
  `person-${index}@imp007.hidroflorestas.invalid`;

export function createDashboardFixtureClient(testDatabaseUrl: string) {
  return new PrismaClient({
    adapter: testPostgresqlAdapter(withPublicSchema(testDatabaseUrl)),
  });
}

export function createDashboardFixtureActions(
  testDatabaseUrl: string,
): DashboardFixtureActions {
  const prisma = createDashboardFixtureClient(testDatabaseUrl);
  const userIds = [...DASHBOARD_FIXTURES.userIds];
  const laboratoryIds = [...DASHBOARD_FIXTURES.laboratoryIds];
  const areaIds = [...DASHBOARD_FIXTURES.areaIds];
  const collectionIds = [...DASHBOARD_FIXTURES.collectionIds];
  return {
    async cleanup() {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `ALTER TABLE "CollectionData" DISABLE TRIGGER imp004_collection_immutable`,
        );
        try {
          await tx.collectionData.deleteMany({
            where: {
              id: { in: collectionIds },
              collectionAreaId: { in: areaIds },
              laboratoryRoomId: { in: laboratoryIds },
              userId: { in: userIds },
            },
          });
        } finally {
          await tx.$executeRawUnsafe(
            `ALTER TABLE "CollectionData" ENABLE TRIGGER imp004_collection_immutable`,
          );
        }
        await tx.collectionArea.deleteMany({
          where: {
            id: { in: areaIds },
            laboratoryRoomId: { in: laboratoryIds },
            userId: { in: userIds },
            name: { startsWith: DASHBOARD_FIXTURE_PREFIX },
          },
        });
        await tx.researchersLinked.deleteMany({
          where: {
            laboratoryRoomId: { in: laboratoryIds },
            userId: { in: userIds },
          },
        });
        await tx.laboratoryRoom.deleteMany({
          where: {
            id: { in: laboratoryIds },
            userId: { in: userIds },
            name: { startsWith: DASHBOARD_FIXTURE_PREFIX },
          },
        });
        for (const [index, id] of userIds.entries()) {
          await tx.user.deleteMany({ where: { id, email: fixtureEmail(index) } });
        }
      }, { maxWait: 15_000, timeout: 30_000 });
    },
    async setup(password: string) {
      const passwordHash = await bcrypt.hash(password, 10);
      const base = new Date("2026-09-18T15:00:00.000Z");
      await prisma.$transaction(async (tx) => {
        for (const [index, id] of userIds.entries()) {
          await tx.user.create({
            data: {
              id,
              email: fixtureEmail(index),
              firstName: ["Owner", "Admin", "Member", "Ineligible"][index],
              lastName: "IMP007",
              password: passwordHash,
              status: index === 3 ? "BLOCKED" : "ACTIVE",
              role: "USER",
              verificationRequired: false,
            },
          });
        }
        for (const [index, id] of laboratoryIds.entries()) {
          await tx.laboratoryRoom.create({
            data: {
              id,
              name: `${DASHBOARD_FIXTURE_PREFIX} laboratory ${index}`,
              userId: userIds[0],
              isActive: index !== 1,
              accessCode: `imp007-fixture-${index}`,
            },
          });
          await tx.researchersLinked.create({
            data: { userId: userIds[0], laboratoryRoomId: id, role: "OWNER" },
          });
          if (index < 2) {
            await tx.researchersLinked.createMany({
              data: [
                { userId: userIds[1], laboratoryRoomId: id, role: "ADMIN" },
                { userId: userIds[2], laboratoryRoomId: id, role: "MEMBER" },
              ],
            });
          }
        }
        for (let index = 0; index < 12; index += 1) {
          const createdAt = new Date(base.getTime() - index * 60_000);
          await tx.collectionArea.create({
            data: {
              id: areaIds[index],
              name: `${DASHBOARD_FIXTURE_PREFIX} area ${index}`,
              userId: userIds[0],
              laboratoryRoomId: laboratoryIds[0],
              latitude: -3,
              longitude: -38,
              createdAt,
            },
          });
          await tx.collectionData.create({
            data: {
              id: collectionIds[index],
              collectionAreaId: areaIds[index],
              laboratoryRoomId: laboratoryIds[0],
              userId: userIds[0],
              occurredAt: new Date(createdAt.getTime() - 3_600_000),
              occurrenceOffset: "-03:00",
              confirmedAt: createdAt,
              confirmationKey: uuid(801 + index),
            },
          });
        }
        await tx.collectionArea.create({
          data: {
            id: areaIds[12],
            name: `${DASHBOARD_FIXTURE_PREFIX} inactive area`,
            userId: userIds[0],
            laboratoryRoomId: laboratoryIds[1],
            latitude: -3,
            longitude: -38,
            createdAt: new Date("2026-09-17T15:00:00.000Z"),
          },
        });
        await tx.collectionData.create({
          data: {
            id: collectionIds[12],
            collectionAreaId: areaIds[12],
            laboratoryRoomId: laboratoryIds[1],
            userId: userIds[0],
            occurredAt: new Date("2026-09-17T13:00:00.000Z"),
            occurrenceOffset: "-03:00",
            confirmedAt: new Date("2026-09-17T15:00:00.000Z"),
            confirmationKey: uuid(813),
          },
        });
        await tx.collectionData.create({
          data: {
            id: collectionIds[23],
            collectionAreaId: areaIds[0],
            laboratoryRoomId: laboratoryIds[0],
            userId: userIds[0],
          },
        });
      }, { maxWait: 15_000, timeout: 30_000 });
    },
    async count() {
      return {
        users: await prisma.user.count({ where: { id: { in: userIds } } }),
        laboratories: await prisma.laboratoryRoom.count({ where: { id: { in: laboratoryIds } } }),
        memberships: await prisma.researchersLinked.count({ where: { laboratoryRoomId: { in: laboratoryIds }, userId: { in: userIds } } }),
        areas: await prisma.collectionArea.count({ where: { id: { in: areaIds } } }),
        collections: await prisma.collectionData.count({ where: { id: { in: collectionIds } } }),
      };
    },
    async disconnect() {
      await prisma.$disconnect();
    },
  };
}

class DashboardFixtureGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardFixtureGuardError";
  }
}

function required(
  environment: DashboardFixtureEnvironment,
  name: string,
): string {
  const value = environment[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new DashboardFixtureGuardError(`${name} is required`);
  }
  return value;
}

function normalizeDatabaseUrl(value: string, name: string) {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new DashboardFixtureGuardError(`${name} must be a valid database URL`);
  }
  if (!["postgresql:", "postgres:"].includes(parsed.protocol)) {
    throw new DashboardFixtureGuardError(`${name} must use PostgreSQL`);
  }
  if (parsed.protocol === "postgres:") parsed.protocol = "postgresql:";
  parsed.hash = "";
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.searchParams.sort();
  return parsed.toString();
}

function targetIdentity(value: string) {
  const url = new URL(value);
  const host = url.hostname.endsWith(".neon.tech")
    ? url.hostname.replace("-pooler.", ".")
    : url.hostname;
  return `${host}:${url.port || "5432"}/${decodeURIComponent(url.pathname)}`;
}

export function validateDashboardFixtureEnvironment(
  environment: DashboardFixtureEnvironment,
): SafeDashboardFixtureEnvironment {
  if (required(environment, "NODE_ENV") !== "test") {
    throw new DashboardFixtureGuardError("NODE_ENV must be test");
  }
  if (
    required(environment, "DASHBOARD_FIXTURE_CONFIRMATION") !==
    DASHBOARD_FIXTURE_CONFIRMATION
  ) {
    throw new DashboardFixtureGuardError(
      "DASHBOARD_FIXTURE_CONFIRMATION is invalid",
    );
  }
  required(environment, "E2E_USER_PASSWORD");
  const testDatabaseUrl = normalizeDatabaseUrl(
    required(environment, "TEST_DATABASE_URL"),
    "TEST_DATABASE_URL",
  );
  const developmentDatabaseUrl = normalizeDatabaseUrl(
    required(environment, "DATABASE_URL"),
    "DATABASE_URL",
  );
  if (targetIdentity(testDatabaseUrl) === targetIdentity(developmentDatabaseUrl)) {
    throw new DashboardFixtureGuardError(
      "TEST_DATABASE_URL must be different from DATABASE_URL",
    );
  }
  const target = targetIdentity(testDatabaseUrl).toLowerCase();
  if (/(^|[./:_-])(prod|production)([./:_-]|$)/.test(target)) {
    throw new DashboardFixtureGuardError(
      "TEST_DATABASE_URL must not target production",
    );
  }
  return { testDatabaseUrl, developmentDatabaseUrl };
}

function assertCleanupComplete(counts: Record<string, number>) {
  const remaining = Object.entries(counts).filter(([, count]) => count !== 0);
  if (remaining.length > 0) {
    throw new DashboardFixtureGuardError(
      `fixture cleanup incomplete: ${remaining.map(([name]) => name).join(", ")}`,
    );
  }
}

export async function setupDashboardFixtures(
  environment: DashboardFixtureEnvironment,
  createActions: DashboardFixtureActionsFactory = createDashboardFixtureActions,
) {
  const safe = validateDashboardFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    await actions.cleanup();
    assertCleanupComplete(await actions.count());
    try {
      await actions.setup(environment.E2E_USER_PASSWORD!);
    } catch (error) {
      await actions.cleanup();
      assertCleanupComplete(await actions.count());
      throw error;
    }
  } finally {
    await actions.disconnect();
  }
}

export async function cleanupDashboardFixtures(
  environment: DashboardFixtureEnvironment,
  createActions: DashboardFixtureActionsFactory = createDashboardFixtureActions,
) {
  const safe = validateDashboardFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    await actions.cleanup();
    assertCleanupComplete(await actions.count());
  } finally {
    await actions.disconnect();
  }
}

export async function countDashboardFixtures(
  environment: DashboardFixtureEnvironment,
  createActions: DashboardFixtureActionsFactory = createDashboardFixtureActions,
) {
  const safe = validateDashboardFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    return await actions.count();
  } finally {
    await actions.disconnect();
  }
}
import bcrypt from "bcrypt";

import { PrismaClient } from "../../src/generated/prisma";
import { withPublicSchema } from "./areas";
import { testPostgresqlAdapter } from "./test-postgresql-adapter";

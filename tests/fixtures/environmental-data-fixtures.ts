import bcrypt from "bcrypt";

import { PrismaClient } from "../../src/generated/prisma";
import { withPublicSchema } from "./areas";
import { validateAuthFixtureEnvironment } from "./auth-users";
import { testPostgresqlAdapter } from "./test-postgresql-adapter";

export const ENVIRONMENTAL_FIXTURE_PREFIX = "IMP-005 E2E";
const uuid = (suffix: number) =>
  `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;

export const ENVIRONMENTAL_FIXTURES = {
  userIds: [501, 502, 503, 504].map(uuid),
  laboratoryIds: [511, 512, 513].map(uuid),
  areaIds: [521, 522, 523].map(uuid),
  collectionIds: [531, 532, 533].map(uuid),
  cleanupOrder: [
    "EnvironmentalMeasurementSet",
    "CollectionData",
    "CollectionArea",
    "ResearchersLinked",
    "LaboratoryRoom",
    "User",
  ],
} as const;

export function validateEnvironmentalFixtureEnvironment(
  environment: Record<string, string | undefined>,
) {
  const safe = validateAuthFixtureEnvironment(environment);
  if (!environment.E2E_USER_PASSWORD) {
    throw new Error("E2E_USER_PASSWORD required");
  }
  return safe;
}

export type EnvironmentalFixtureActions = {
  cleanup: () => Promise<void>;
  setup: (password: string) => Promise<void>;
  count: () => Promise<Record<string, number>>;
  disconnect: () => Promise<void>;
};

export type EnvironmentalFixtureActionsFactory = (
  testDatabaseUrl: string,
) => EnvironmentalFixtureActions;

const fixtureEmail = (index: number) =>
  `person-${index}@imp005.hidroflorestas.invalid`;

export function createEnvironmentalFixtureClient(testDatabaseUrl: string) {
  return new PrismaClient({
    adapter: testPostgresqlAdapter(withPublicSchema(testDatabaseUrl)),
  });
}

export function createEnvironmentalFixtureActions(
  testDatabaseUrl: string,
): EnvironmentalFixtureActions {
  const prisma = createEnvironmentalFixtureClient(testDatabaseUrl);
  const userIds = [...ENVIRONMENTAL_FIXTURES.userIds];
  const laboratoryIds = [...ENVIRONMENTAL_FIXTURES.laboratoryIds];
  const areaIds = [...ENVIRONMENTAL_FIXTURES.areaIds];
  const collectionIds = [...ENVIRONMENTAL_FIXTURES.collectionIds];
  return {
    async cleanup() {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`ALTER TABLE "EnvironmentalMeasurementSet" DISABLE TRIGGER imp005_measurement_immutable`);
        try {
          await tx.environmentalMeasurementSet.deleteMany({where:{userId:{in:userIds},collectionData:{collectionAreaId:{in:areaIds},laboratoryRoomId:{in:laboratoryIds}}}});
        } finally {await tx.$executeRawUnsafe(`ALTER TABLE "EnvironmentalMeasurementSet" ENABLE TRIGGER imp005_measurement_immutable`);}
        await tx.$executeRawUnsafe(
          `ALTER TABLE "CollectionData" DISABLE TRIGGER imp004_collection_immutable`,
        );
        try {
          await tx.collectionData.deleteMany({
            where: {
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
            name: { startsWith: ENVIRONMENTAL_FIXTURE_PREFIX },
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
            name: { startsWith: ENVIRONMENTAL_FIXTURE_PREFIX },
          },
        });
        for (const [index, id] of userIds.entries()) {
          await tx.user.deleteMany({ where: { id, email: fixtureEmail(index) } });
        }
      }, { maxWait: 15_000, timeout: 30_000 });
    },
    async setup(password: string) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.$transaction(async (tx) => {
        for (const [index, id] of userIds.entries()) {
          await tx.user.create({
            data: {
              id,
              email: fixtureEmail(index),
              firstName: ["Owner", "Admin", "Member", "Outsider"][index],
              lastName: "IMP005",
              password: passwordHash,
              status: "ACTIVE",
              role: "USER",
              verificationRequired: false,
            },
          });
        }
        for (const [index, id] of laboratoryIds.entries()) {
          const ownerId = index === 2 ? userIds[3] : userIds[0];
          await tx.laboratoryRoom.create({
            data: {
              id,
              name: `${ENVIRONMENTAL_FIXTURE_PREFIX} laboratory ${index}`,
              userId: ownerId,
              isActive: index !== 1,
              accessCode: `imp005-fixture-${index}`,
            },
          });
          await tx.researchersLinked.create({
            data: { userId: ownerId, laboratoryRoomId: id, role: "OWNER" },
          });
          if (index !== 2) {
            await tx.researchersLinked.createMany({
              data: [
                { userId: userIds[1], laboratoryRoomId: id, role: "ADMIN" },
                { userId: userIds[2], laboratoryRoomId: id, role: "MEMBER" },
              ],
            });
          }
          await tx.collectionArea.create({
            data: {
              id: areaIds[index],
              name: `${ENVIRONMENTAL_FIXTURE_PREFIX} area ${index}`,
              userId: ownerId,
              laboratoryRoomId: id,
              latitude: -3,
              longitude: -38,
            },
          });
        }
        await tx.collectionData.create({
          data: {
            id: collectionIds[0],
            collectionAreaId: areaIds[0],
            laboratoryRoomId: laboratoryIds[0],
            userId: userIds[0],
            occurredAt: new Date("2026-09-15T12:00:00.000Z"),
            occurrenceOffset: "-03:00",
            confirmedAt: new Date("2026-09-15T12:05:00.000Z"),
            confirmationKey: "50000000-0000-4000-8000-000000000531",
          },
        });
        await tx.collectionData.create({
          data: {
            id: collectionIds[1],
            collectionAreaId: areaIds[1],
            laboratoryRoomId: laboratoryIds[1],
            userId: userIds[0],
            occurredAt: new Date("2026-09-15T13:30:00.000Z"),
            occurrenceOffset: "+01:30",
            confirmedAt: new Date("2026-09-15T13:35:00.000Z"),
            confirmationKey: "50000000-0000-4000-8000-000000000532",
          },
        });
      }, { maxWait: 15_000, timeout: 30_000 });
    },
    async count() {
      return {
        measurements: await prisma.environmentalMeasurementSet.count({where:{collectionData:{collectionAreaId:{in:areaIds},laboratoryRoomId:{in:laboratoryIds}}}}),
        users: await prisma.user.count({ where: { id: { in: userIds } } }),
        laboratories: await prisma.laboratoryRoom.count({
          where: { id: { in: laboratoryIds } },
        }),
        memberships: await prisma.researchersLinked.count({
          where: { laboratoryRoomId: { in: laboratoryIds }, userId: { in: userIds } },
        }),
        areas: await prisma.collectionArea.count({ where: { id: { in: areaIds } } }),
        collections: await prisma.collectionData.count({
          where: {
            collectionAreaId: { in: areaIds },
            laboratoryRoomId: { in: laboratoryIds },
            userId: { in: userIds },
          },
        }),
      };
    },
    async disconnect() {
      await prisma.$disconnect();
    },
  };
}

export async function setupEnvironmentalFixtures(
  environment: Record<string, string | undefined>,
  createActions: EnvironmentalFixtureActionsFactory = createEnvironmentalFixtureActions,
) {
  const safe = validateEnvironmentalFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    await actions.cleanup();
    try {
      await actions.setup(environment.E2E_USER_PASSWORD!);
    } catch (error) {
      await actions.cleanup();
      throw error;
    }
  } finally {
    await actions.disconnect();
  }
}

export async function cleanupEnvironmentalFixtures(
  environment: Record<string, string | undefined>,
  createActions: EnvironmentalFixtureActionsFactory = createEnvironmentalFixtureActions,
) {
  const safe = validateEnvironmentalFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    await actions.cleanup();
  } finally {
    await actions.disconnect();
  }
}

export async function countEnvironmentalFixtures(
  environment: Record<string, string | undefined>,
  createActions: EnvironmentalFixtureActionsFactory = createEnvironmentalFixtureActions,
) {
  const safe = validateEnvironmentalFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    return await actions.count();
  } finally {
    await actions.disconnect();
  }
}

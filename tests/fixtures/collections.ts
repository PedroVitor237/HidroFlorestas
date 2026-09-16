import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import ws from "ws";

import { PrismaClient } from "../../src/generated/prisma";
import { withPublicSchema } from "./areas";
import { validateAuthFixtureEnvironment } from "./auth-users";

export const COLLECTION_FIXTURE_PREFIX = "IMP-004 E2E";
const uuid = (suffix: number) =>
  `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;

export const COLLECTION_FIXTURES = {
  userIds: [401, 402, 403, 404].map(uuid),
  laboratoryIds: [411, 412, 413].map(uuid),
  areaIds: [421, 422, 423].map(uuid),
  collectionIds: [431, 432, 433].map(uuid),
  cleanupOrder: [
    "CollectionData",
    "CollectionArea",
    "ResearchersLinked",
    "LaboratoryRoom",
    "User",
  ],
} as const;

export function validateCollectionFixtureEnvironment(
  environment: Record<string, string | undefined>,
) {
  const safe = validateAuthFixtureEnvironment(environment);
  if (!environment.E2E_USER_PASSWORD) {
    throw new Error("E2E_USER_PASSWORD required");
  }
  return safe;
}

export type CollectionFixtureActions = {
  cleanup: () => Promise<void>;
  setup: (password: string) => Promise<void>;
  count: () => Promise<Record<string, number>>;
  disconnect: () => Promise<void>;
};

export type CollectionFixtureActionsFactory = (
  testDatabaseUrl: string,
) => CollectionFixtureActions;

const fixtureEmail = (index: number) =>
  `person-${index}@imp004.hidroflorestas.invalid`;

export function createCollectionFixtureActions(
  testDatabaseUrl: string,
): CollectionFixtureActions {
  neonConfig.webSocketConstructor = ws;
  const prisma = new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: withPublicSchema(testDatabaseUrl),
      connectionTimeoutMillis: 15_000,
    }),
  });
  const userIds = [...COLLECTION_FIXTURES.userIds];
  const laboratoryIds = [...COLLECTION_FIXTURES.laboratoryIds];
  const areaIds = [...COLLECTION_FIXTURES.areaIds];
  const collectionIds = [...COLLECTION_FIXTURES.collectionIds];
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
            name: { startsWith: COLLECTION_FIXTURE_PREFIX },
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
            name: { startsWith: COLLECTION_FIXTURE_PREFIX },
          },
        });
        for (const [index, id] of userIds.entries()) {
          await tx.user.deleteMany({ where: { id, email: fixtureEmail(index) } });
        }
      });
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
              lastName: "IMP004",
              password: passwordHash,
              status: "ACTIVE",
              role: "USER",
              isAdmin: false,
            },
          });
        }
        for (const [index, id] of laboratoryIds.entries()) {
          const ownerId = index === 2 ? userIds[3] : userIds[0];
          await tx.laboratoryRoom.create({
            data: {
              id,
              name: `${COLLECTION_FIXTURE_PREFIX} laboratory ${index}`,
              userId: ownerId,
              isActive: index !== 1,
              accessCode: `imp004-fixture-${index}`,
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
              name: `${COLLECTION_FIXTURE_PREFIX} area ${index}`,
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
            confirmationKey: "40000000-0000-4000-8000-000000000431",
          },
        });
      });
    },
    async count() {
      return {
        users: await prisma.user.count({ where: { id: { in: userIds } } }),
        laboratories: await prisma.laboratoryRoom.count({
          where: { id: { in: laboratoryIds } },
        }),
        memberships: await prisma.researchersLinked.count({
          where: { laboratoryRoomId: { in: laboratoryIds }, userId: { in: userIds } },
        }),
        areas: await prisma.collectionArea.count({ where: { id: { in: areaIds } } }),
        collections: await prisma.collectionData.count({
          where: { id: { in: collectionIds } },
        }),
      };
    },
    async disconnect() {
      await prisma.$disconnect();
    },
  };
}

export async function setupCollectionFixtures(
  environment: Record<string, string | undefined>,
  createActions: CollectionFixtureActionsFactory = createCollectionFixtureActions,
) {
  const safe = validateCollectionFixtureEnvironment(environment);
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

export async function cleanupCollectionFixtures(
  environment: Record<string, string | undefined>,
  createActions: CollectionFixtureActionsFactory = createCollectionFixtureActions,
) {
  const safe = validateCollectionFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    await actions.cleanup();
  } finally {
    await actions.disconnect();
  }
}

export async function countCollectionFixtures(
  environment: Record<string, string | undefined>,
  createActions: CollectionFixtureActionsFactory = createCollectionFixtureActions,
) {
  const safe = validateCollectionFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    return await actions.count();
  } finally {
    await actions.disconnect();
  }
}

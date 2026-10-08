import bcrypt from "bcrypt";
import { PrismaClient } from "../../src/generated/prisma";
import { validateAuthFixtureEnvironment } from "./auth-users";
import { testPostgresqlAdapter } from "./test-postgresql-adapter";

const uid = (n: number) => `00000000-0000-4000-8000-000000000${n}`;
export function areaFixturePlan() {
  return {
    prefix: "IMP-003 E2E",
    userIds: [301, 302, 303, 304].map(uid),
    laboratoryIds: [311, 312, 313].map(uid),
    cleanupOrder: ["CollectionArea", "ResearchersLinked", "LaboratoryRoom", "User"],
  };
}
export const AREA_FIXTURES = areaFixturePlan();
export const areaFixtureEmail = (i: number) => `person-${i}@imp003.hidroflorestas.invalid`;

export function withPublicSchema(connectionString: string) {
  const url = new URL(connectionString);
  // Neon poolers can retain session-level search_path from earlier clients and
  // reject startup options. E2E uses the direct endpoint for deterministic state.
  url.hostname = url.hostname.replace("-pooler.", ".");
  url.searchParams.delete("options");
  return url.toString();
}

export function createAreaFixtureClient(environment: Record<string, string | undefined>) {
  const safe = validateAuthFixtureEnvironment(environment);
  return new PrismaClient({ adapter: testPostgresqlAdapter(withPublicSchema(safe.testDatabaseUrl)) });
}

export async function setupAreaFixtures(environment: Record<string, string | undefined>) {
  if (!environment.E2E_USER_PASSWORD) throw new Error("E2E_USER_PASSWORD required");
  const prisma = createAreaFixtureClient(environment);
  try {
    const password = await bcrypt.hash(environment.E2E_USER_PASSWORD, 10);
    await prisma.$transaction(async (tx) => {
      // create, never upsert: an unexpected collision must not overwrite a record.
      for (const [i, id] of AREA_FIXTURES.userIds.entries()) {
        await tx.user.create({ data: { id, email: areaFixtureEmail(i), firstName: ["Owner", "Admin", "Member", "Outsider"][i], lastName: "IMP003", password, status: "ACTIVE", role: "USER", verificationRequired: false } });
      }
      for (const [i, id] of AREA_FIXTURES.laboratoryIds.entries()) {
        const owner = AREA_FIXTURES.userIds[i === 2 ? 3 : 0];
        await tx.laboratoryRoom.create({ data: { id, name: `${AREA_FIXTURES.prefix} ${i}`, userId: owner, isActive: i !== 1, accessCode: `imp003-fixture-${i}` } });
        await tx.researchersLinked.create({ data: { userId: owner, laboratoryRoomId: id, role: "OWNER" } });
        if (i !== 2) for (const [userIndex, role] of [[1, "ADMIN"], [2, "MEMBER"]] as const) {
          await tx.researchersLinked.create({ data: { userId: AREA_FIXTURES.userIds[userIndex], laboratoryRoomId: id, role } });
        }
        await tx.collectionArea.create({ data: { id: uid(321 + i), name: `${AREA_FIXTURES.prefix} area ${i}`, userId: owner, laboratoryRoomId: id, latitude: -3, longitude: -38 } });
      }
    }, { maxWait: 15_000, timeout: 30_000 });
  } finally { await prisma.$disconnect(); }
}

export async function cleanupAreaFixtures(environment: Record<string, string | undefined>) {
  const prisma = createAreaFixtureClient(environment);
  try {
    await prisma.$transaction(async (tx) => {
      const laboratories = await tx.laboratoryRoom.findMany({ where: { id: { in: AREA_FIXTURES.laboratoryIds }, name: { startsWith: AREA_FIXTURES.prefix }, userId: { in: AREA_FIXTURES.userIds } }, select: { id: true } });
      const ids = laboratories.map((lab) => lab.id);
      await tx.collectionArea.deleteMany({ where: { laboratoryRoomId: { in: ids }, userId: { in: AREA_FIXTURES.userIds }, name: { startsWith: AREA_FIXTURES.prefix } } });
      await tx.researchersLinked.deleteMany({ where: { laboratoryRoomId: { in: ids }, userId: { in: AREA_FIXTURES.userIds } } });
      await tx.laboratoryRoom.deleteMany({ where: { id: { in: ids } } });
      for (const [i, id] of AREA_FIXTURES.userIds.entries()) await tx.user.deleteMany({ where: { id, email: areaFixtureEmail(i) } });
    }, { maxWait: 15_000, timeout: 30_000 });
  } finally { await prisma.$disconnect(); }
}

export async function countAreaFixtures(environment: Record<string, string | undefined>) {
  const prisma = createAreaFixtureClient(environment);
  try {
    return {
      users: await prisma.user.count({ where: { id: { in: AREA_FIXTURES.userIds } } }),
      laboratories: await prisma.laboratoryRoom.count({ where: { id: { in: AREA_FIXTURES.laboratoryIds } } }),
      memberships: await prisma.researchersLinked.count({ where: { laboratoryRoomId: { in: AREA_FIXTURES.laboratoryIds } } }),
      areas: await prisma.collectionArea.count({ where: { laboratoryRoomId: { in: AREA_FIXTURES.laboratoryIds } } }),
    };
  } finally { await prisma.$disconnect(); }
}

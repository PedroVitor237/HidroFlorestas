export type LegacySnapshot = {
  users: string[];
  laboratories: { id: string; userId: string }[];
  memberships: { userId: string; laboratoryRoomId: string }[];
  areas: { coordinatesId: string }[];
  coordinates: { id: string; latitude: string; longitude: string }[];
};

export function inspectAreaMigration(snapshot: LegacySnapshot): { ok: boolean; issues: Record<string, number> } {
  const issues: Record<string, number> = {};
  const add = (code: string) => { issues[code] = (issues[code] ?? 0) + 1; };
  const users = new Set(snapshot.users);
  const labs = new Set(snapshot.laboratories.map((lab) => lab.id));
  const memberships = new Map<string, Set<string>>();
  for (const link of snapshot.memberships) {
    if (!users.has(link.userId) || !labs.has(link.laboratoryRoomId)) add("INVALID_MEMBERSHIP");
    const linked = memberships.get(link.userId) ?? new Set<string>();
    if (linked.has(link.laboratoryRoomId)) add("DUPLICATE_MEMBERSHIP");
    linked.add(link.laboratoryRoomId); memberships.set(link.userId, linked);
  }
  for (const lab of snapshot.laboratories) {
    if (!users.has(lab.userId)) add("INVALID_CREATOR");
    const linked = memberships.get(lab.userId) ?? new Set<string>();
    linked.add(lab.id); memberships.set(lab.userId, linked);
  }
  for (const linked of memberships.values()) if (linked.size > 5) add("MEMBERSHIP_LIMIT");
  const points = new Set(snapshot.coordinates.map((point) => point.id));
  const references = new Map<string, number>();
  for (const area of snapshot.areas) {
    if (!points.has(area.coordinatesId)) add("MISSING_COORDINATES");
    references.set(area.coordinatesId, (references.get(area.coordinatesId) ?? 0) + 1);
  }
  const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
  for (const point of snapshot.coordinates) {
    const count = references.get(point.id) ?? 0;
    if (count === 0) add("ORPHAN_COORDINATES");
    if (count > 1) add("SHARED_COORDINATES");
    if (!numeric.test(point.latitude.trim()) || !numeric.test(point.longitude.trim()) ||
        !Number.isFinite(Number(point.latitude)) || !Number.isFinite(Number(point.longitude)) ||
        Math.abs(Number(point.latitude)) > 90 || Math.abs(Number(point.longitude)) > 180) add("INVALID_COORDINATES");
  }
  return { ok: Object.keys(issues).length === 0, issues };
}

// Explicit read-only CLI. Never falls back to the application's DATABASE_URL.
async function runPreflight() {
  const { neon } = await import("@neondatabase/serverless");
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.test.local", quiet: true });
  if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" || !process.env.TEST_DATABASE_URL) {
    throw new Error("Test configuration required");
  }
  const sql = neon(process.env.TEST_DATABASE_URL);
  // A single read-only transaction keeps all counts/references on one snapshot.
  const [users, laboratories, memberships, areas, coordinates] = await sql.transaction([
    sql`SELECT id FROM "User"`,
    sql`SELECT id,"userId" FROM "LaboratoryRoom"`,
    sql`SELECT "userId","laboratoryRoomId" FROM "ResearchersLinked"`,
    sql`SELECT "coordinatesId" FROM "CollectionArea"`,
    sql`SELECT id,latitude,longitude FROM "Coordinates"`,
  ], { isolationLevel: "RepeatableRead", readOnly: true });
  const result = inspectAreaMigration({ users: users.map((u) => u.id), laboratories, memberships, areas, coordinates } as LegacySnapshot);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/imp-003-migration-preflight.ts")) {
  runPreflight().catch(() => {
    process.stderr.write("Preflight failed: verify legacy schema, test configuration and connectivity; details suppressed.\n");
    process.exitCode = 1;
  });
}

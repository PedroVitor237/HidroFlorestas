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
  createActions: DashboardFixtureActionsFactory,
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
  createActions: DashboardFixtureActionsFactory,
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
  createActions: DashboardFixtureActionsFactory,
) {
  const safe = validateDashboardFixtureEnvironment(environment);
  const actions = createActions(safe.testDatabaseUrl);
  try {
    return await actions.count();
  } finally {
    await actions.disconnect();
  }
}

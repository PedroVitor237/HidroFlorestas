import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import ws from "ws";

import { PrismaClient } from "../../src/generated/prisma/index.js";

export const AUTH_FIXTURE_CONFIRMATION = "HIDROFLORESTAS_AUTH_TEST";

class AuthFixtureGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthFixtureGuardError";
  }
}

export const AUTH_FIXTURE_USERS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    email: "active@auth-test.hidroflorestas.invalid",
    firstName: "Active",
    lastName: "Auth Test",
    image: "",
    status: "ACTIVE" as const,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    email: "pending@auth-test.hidroflorestas.invalid",
    firstName: "Pending",
    lastName: "Auth Test",
    image: "",
    status: "PENDING" as const,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    email: "blocked@auth-test.hidroflorestas.invalid",
    firstName: "Blocked",
    lastName: "Auth Test",
    image: "",
    status: "BLOCKED" as const,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    email: "inactive@auth-test.hidroflorestas.invalid",
    firstName: "Inactive",
    lastName: "Auth Test",
    image: "",
    status: "INACTIVE" as const,
  },
] as const;

type FixtureEnvironment = Record<string, string | undefined>;

type SafeFixtureEnvironment = {
  testDatabaseUrl: string;
  developmentDatabaseUrl: string;
};

export type AuthFixtureActions = {
  setup: (password?: string) => Promise<void>;
  teardown: () => Promise<void>;
  blockActive: () => Promise<void>;
  restoreActive: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export type AuthFixtureCommand =
  | "setup"
  | "teardown"
  | "block-active"
  | "restore-active";

function required(environment: FixtureEnvironment, name: string): string {
  const value = environment[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new AuthFixtureGuardError(`${name} is required`);
  }
  return value;
}

function normalizeDatabaseUrl(value: string, name: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new AuthFixtureGuardError(`${name} must be a valid database URL`);
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new AuthFixtureGuardError(`${name} must use PostgreSQL`);
  }

  if (parsed.protocol === "postgres:") {
    parsed.protocol = "postgresql:";
  }
  parsed.hash = "";
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.searchParams.sort();
  return parsed.toString();
}

export function validateAuthFixtureEnvironment(
  environment: FixtureEnvironment,
): SafeFixtureEnvironment {
  if (required(environment, "NODE_ENV") !== "test") {
    throw new AuthFixtureGuardError("NODE_ENV must be test");
  }
  if (
    required(environment, "TEST_DATABASE_CONFIRMATION") !==
    AUTH_FIXTURE_CONFIRMATION
  ) {
    throw new AuthFixtureGuardError("TEST_DATABASE_CONFIRMATION is invalid");
  }

  const rawTestUrl = required(environment, "TEST_DATABASE_URL");
  const rawDevelopmentUrl = required(environment, "DATABASE_URL");
  const testDatabaseUrl = normalizeDatabaseUrl(
    rawTestUrl,
    "TEST_DATABASE_URL",
  );
  const developmentDatabaseUrl = normalizeDatabaseUrl(
    rawDevelopmentUrl,
    "DATABASE_URL",
  );

  // Credentials and connection options do not identify a different database.
  const targetIdentity = (value: string) => {
    const url = new URL(value);
    const host = url.hostname.endsWith(".neon.tech")
      ? url.hostname.replace("-pooler.", ".")
      : url.hostname;
    return `${host}:${url.port || "5432"}/${decodeURIComponent(url.pathname)}`;
  };
  if (targetIdentity(testDatabaseUrl) === targetIdentity(developmentDatabaseUrl)) {
    throw new AuthFixtureGuardError(
      "TEST_DATABASE_URL must be different from DATABASE_URL",
    );
  }

  return { testDatabaseUrl, developmentDatabaseUrl };
}

export async function runAuthFixtureCommand(
  command: AuthFixtureCommand,
  environment: FixtureEnvironment,
  createActions: (safe: SafeFixtureEnvironment) => AuthFixtureActions =
    createPrismaFixtureActions,
): Promise<void> {
  const safeEnvironment = validateAuthFixtureEnvironment(environment);
  let password: string | undefined;

  if (command === "setup") {
    password = required(environment, "E2E_USER_PASSWORD");
  }

  const actions = createActions(safeEnvironment);
  try {
    if (command === "setup") {
      await actions.setup(password);
    } else if (command === "teardown") {
      await actions.teardown();
    } else if (command === "block-active") {
      await actions.blockActive();
    } else {
      await actions.restoreActive();
    }
  } finally {
    await actions.disconnect();
  }
}

export async function countAuthFixtureUsers(
  environment: FixtureEnvironment,
): Promise<number> {
  const safeEnvironment = validateAuthFixtureEnvironment(environment);
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({
    connectionString: safeEnvironment.testDatabaseUrl,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    return await prisma.user.count({
      where: {
        OR: AUTH_FIXTURE_USERS.map((user) => ({
          id: user.id,
          email: user.email,
        })),
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

function createPrismaFixtureActions(
  safeEnvironment: SafeFixtureEnvironment,
): AuthFixtureActions {
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({
    connectionString: safeEnvironment.testDatabaseUrl,
  });
  const prisma = new PrismaClient({ adapter });
  const ids = AUTH_FIXTURE_USERS.map((user) => user.id);
  const emails = AUTH_FIXTURE_USERS.map((user) => user.email);
  const activeUser = AUTH_FIXTURE_USERS[0];

  return {
    async setup(password) {
      if (!password) {
        throw new Error("E2E_USER_PASSWORD is required");
      }
      const passwordHash = await bcrypt.hash(password, 10);

      for (const user of AUTH_FIXTURE_USERS) {
        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            ...user,
            password: passwordHash,
            role: "USER",

          },
          update: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            password: passwordHash,
            status: user.status,
            role: "USER",

          },
        });
      }
    },
    async teardown() {
      await prisma.user.deleteMany({
        where: {
          AND: [{ id: { in: ids } }, { email: { in: emails } }],
        },
      });
    },
    async blockActive() {
      await prisma.user.updateMany({
        where: { id: activeUser.id, email: activeUser.email },
        data: { status: "BLOCKED" },
      });
    },
    async restoreActive() {
      await prisma.user.updateMany({
        where: { id: activeUser.id, email: activeUser.email },
        data: { status: "ACTIVE" },
      });
    },
    async disconnect() {
      await prisma.$disconnect();
    },
  };
}

const invokedAsScript = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("/tests/fixtures/auth-users.ts");

if (invokedAsScript) {
  const command = process.argv[2] as AuthFixtureCommand | undefined;
  if (
    !command ||
    !["setup", "teardown", "block-active", "restore-active"].includes(command)
  ) {
    process.stderr.write(
      "Expected fixture command: setup, teardown, block-active, or restore-active\n",
    );
    process.exitCode = 1;
  } else {
    runAuthFixtureCommand(command, process.env).catch((error: unknown) => {
      const message =
        error instanceof AuthFixtureGuardError
          ? error.message
          : "Auth fixture command failed without exposing connection details";
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    });
  }
}

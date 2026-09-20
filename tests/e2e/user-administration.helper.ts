import type { BrowserContext, TestInfo } from "@playwright/test";
import { signSessionToken, readJwtSecret } from "../../src/app/api/server/auth/session";
import { administrationFixtureId, createAdministrationClient, setupAdministrationFixtures } from "../fixtures/user-administration";

export async function setupUsers() {
  const db = createAdministrationClient();
  try { await setupAdministrationFixtures(db); } finally { await db.$disconnect(); }
}

export async function authenticateAs(context: BrowserContext, testInfo: TestInfo, index: number) {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string") throw new Error("Playwright baseURL is required");
  await context.addCookies([{ name: "auth_token", value: signSessionToken(administrationFixtureId(index), readJwtSecret()), url: baseURL }]);
}

import { expect, test } from "@playwright/test";
import type { BrowserContext, TestInfo } from "@playwright/test";
import { AUTH_FIXTURE_USERS, countAuthFixtureUsers, runAuthFixtureCommand } from "../fixtures/auth-users";
import { cleanupLaboratoryFixtures, LABORATORY_FIXTURE_PREFIX, LABORATORY_SECOND_USER, setupLaboratoryFixtures } from "../fixtures/laboratories";
import { readJwtSecret, signSessionToken } from "../../src/app/api/server/auth/session";

function baseUrl(testInfo: TestInfo) {
  const value = testInfo.project.use.baseURL;
  if (typeof value !== "string") throw new Error("Playwright baseURL is required");
  return value;
}

async function authenticate(context: BrowserContext, testInfo: TestInfo, userId: string) {
  await context.addCookies([{ name: "auth_token", value: signSessionToken(userId, readJwtSecret()), url: baseUrl(testInfo) }]);
}

test.describe.configure({ mode: "serial" });
test.describe("minimum laboratory creation", () => {
  let createdLaboratoryId: string;

  test.beforeAll(async () => {
    await cleanupLaboratoryFixtures(process.env);
    await runAuthFixtureCommand("teardown", process.env);
    await runAuthFixtureCommand("setup", process.env);
    await setupLaboratoryFixtures(process.env);
  });
  test.afterAll(async () => {
    try {
      await cleanupLaboratoryFixtures(process.env);
    } finally {
      await runAuthFixtureCommand("teardown", process.env);
    }
    expect(await countAuthFixtureUsers(process.env)).toBe(0);
  });

  test("creates with name only and remains visible after reload", async ({ page, context }, testInfo) => {
    await authenticate(context, testInfo, AUTH_FIXTURE_USERS[0].id);
    await page.goto("/workspace");
    const name = `${LABORATORY_FIXTURE_PREFIX} Persistent`;
    await page.getByLabel("Nome do laboratório").fill(name);
    const responsePromise = page.waitForResponse((response) => response.url().endsWith("/api/laboratories") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Criar laboratório" }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toEqual({ success: true, laboratory: { id: expect.any(String), name, createdAt: expect.any(String), status: "ACTIVE", isOwner: true } });
    createdLaboratoryId = body.laboratory.id;
    expect(JSON.stringify(body)).not.toContain("accessCode");
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name })).toBeVisible();
  });

  test("rejects client supplied identity", async ({ context }, testInfo) => {
    await authenticate(context, testInfo, AUTH_FIXTURE_USERS[0].id);
    const response = await context.request.post("/api/laboratories", { data: { name: `${LABORATORY_FIXTURE_PREFIX} Invalid`, userId: AUTH_FIXTURE_USERS[1].id } });
    expect(response.status()).toBe(400);
  });

  test("enforces five accessible laboratories and exposes the limit in the UI", async ({ page, context }, testInfo) => {
    await authenticate(context, testInfo, AUTH_FIXTURE_USERS[0].id);
    for (let index = 2; index <= 5; index += 1) {
      const response = await context.request.post("/api/laboratories", { data: { name: `${LABORATORY_FIXTURE_PREFIX} ${index}` } });
      expect(response.status()).toBe(201);
    }
    const sixth = await context.request.post("/api/laboratories", { data: { name: `${LABORATORY_FIXTURE_PREFIX} 6` } });
    expect(sixth.status()).toBe(409);
    expect((await sixth.json()).code).toBe("LABORATORY_LIMIT_REACHED");
    await page.goto("/workspace");
    await expect(page.getByRole("button", { name: "Limite atingido" })).toBeDisabled();
  });

  test("does not expose one user's laboratory to another", async ({ page, context }, testInfo) => {
    await authenticate(context, testInfo, LABORATORY_SECOND_USER.id);
    await page.goto("/workspace");
    await expect(page.getByRole("heading", { name: `${LABORATORY_FIXTURE_PREFIX} Persistent` })).toHaveCount(0);

    const details = await context.request.get(`/api/laboratories/${createdLaboratoryId}`);
    const deactivate = await context.request.patch(`/api/laboratories/${createdLaboratoryId}`, {
      data: { confirmationName: `${LABORATORY_FIXTURE_PREFIX} Persistent` },
    });
    const deletion = await context.request.delete(`/api/laboratories/${createdLaboratoryId}`, {
      data: { confirmationName: `${LABORATORY_FIXTURE_PREFIX} Persistent` },
    });
    expect([details.status(), deactivate.status(), deletion.status()]).toEqual([404, 404, 404]);
  });
});

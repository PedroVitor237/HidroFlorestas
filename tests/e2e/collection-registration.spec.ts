import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";

import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  COLLECTION_FIXTURES,
  cleanupCollectionFixtures,
  countCollectionFixtures,
  createCollectionFixtureClient,
  setupCollectionFixtures,
} from "../fixtures/collections";

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([
    {
      name: "auth_token",
      value: signSessionToken(COLLECTION_FIXTURES.userIds[userIndex]),
      url: String(info.project.use.baseURL),
    },
  ]);
}

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);
test.beforeAll(async () => setupCollectionFixtures(process.env));
test.afterAll(async () => {
  await cleanupCollectionFixtures(process.env);
  expect(await countCollectionFixtures(process.env)).toEqual({
    users: 0,
    laboratories: 0,
    memberships: 0,
    areas: 0,
    collections: 0,
  });
});

test("US1 starts only from the explicit authorized area without persistence", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  for (const userIndex of [0, 1, 2]) {
    await test.step(`context role fixture ${userIndex}`, async () => {
      await login(context, info, userIndex);
      const response = await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(
        `/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`,
      );
      await expect(page.getByRole("heading", { name: "Registrar coleta" })).toBeVisible();
      const registration = page.getByRole("region", { name: "Registrar coleta" });
      await expect(registration).toContainText("IMP-004 E2E laboratory 0");
      await expect(registration).toContainText("IMP-004 E2E area 0");
    });
  }
  expect((await countCollectionFixtures(process.env)).collections).toBe(1);
});

test("US1 rejects crossed, missing, revoked, ineligible and inactive mutation contexts", async ({ page, context }, info) => {
  const [laboratoryId, inactiveLaboratoryId] = COLLECTION_FIXTURES.laboratoryIds;
  const [areaId, inactiveAreaId] = COLLECTION_FIXTURES.areaIds;
  await login(context, info, 0);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${inactiveAreaId}/collections/new`))?.status()).toBe(404);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/00000000-0000-4000-8000-000000000999/collections/new`))?.status()).toBe(404);
  await login(context, info, 3);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`))?.status()).toBe(404);

  const client = createCollectionFixtureClient(process.env.TEST_DATABASE_URL!);
  try {
    await client.researchersLinked.delete({
      where: { userId_laboratoryRoomId: { userId: COLLECTION_FIXTURES.userIds[2], laboratoryRoomId: laboratoryId } },
    });
    await login(context, info, 2);
    expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`))?.status()).toBe(404);
    await client.researchersLinked.create({ data: { userId: COLLECTION_FIXTURES.userIds[2], laboratoryRoomId: laboratoryId, role: "MEMBER" } });
    await client.user.update({ where: { id: COLLECTION_FIXTURES.userIds[2] }, data: { status: "BLOCKED" } });
    const blocked = await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
    expect(blocked?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Registrar coleta" })).toHaveCount(0);
    await client.user.update({ where: { id: COLLECTION_FIXTURES.userIds[2] }, data: { status: "ACTIVE" } });
  } finally {
    await client.$disconnect();
  }
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${inactiveLaboratoryId}/areas/${inactiveAreaId}/collections/new`);
  await expect(
    page.getByRole("region", { name: "Registrar coleta" }).getByText(/Laboratório inativo.*somente leitura/i),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /revisar/i })).toHaveCount(0);
});

test("US2 validates an explicit temporal offset in memory without POST", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  let postCount = 0;
  await page.route(`**/api/laboratories/${laboratoryId}/areas/${areaId}/collections`, async (route) => {
    if (route.request().method() === "POST") postCount += 1;
    await route.continue();
  });
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);

  const occurrence = page.getByLabel("Ocorrência em campo");
  const temporalError = page.locator("#occurredAt-error");
  await occurrence.focus();
  await page.keyboard.press("Enter");
  await expect(temporalError).toContainText(/data.*horário.*fuso/i);

  await occurrence.fill("2026-09-15 09:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(temporalError).toContainText(/RFC 3339|fuso/i);
  await expect(occurrence).toHaveValue("2026-09-15 09:00");

  await occurrence.fill("2099-09-15T09:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(temporalError).toContainText(/futuro/i);

  await occurrence.fill("2026-09-15T09:00:00.123-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(page.getByRole("heading", { name: "Revisão" })).toBeVisible();
  await expect(page.getByText("2026-09-15T09:00:00.123-03:00", { exact: true })).toBeVisible();
  expect(postCount).toBe(0);
  expect((await countCollectionFixtures(process.env)).collections).toBe(1);
});

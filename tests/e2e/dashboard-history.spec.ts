import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";

import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  DASHBOARD_FIXTURE_CONFIRMATION,
  DASHBOARD_FIXTURES,
  DASHBOARD_FIXTURE_PREFIX,
  cleanupDashboardFixtures,
  countDashboardFixtures,
  createDashboardFixtureClient,
  setupDashboardFixtures,
} from "../fixtures/dashboard-history";

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([
    {
      name: "auth_token",
      value: signSessionToken(DASHBOARD_FIXTURES.userIds[userIndex]),
      url: String(info.project.use.baseURL),
    },
  ]);
}

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);
test.beforeAll(async () => {
  expect(process.env.DASHBOARD_FIXTURE_CONFIRMATION).toBe(
    DASHBOARD_FIXTURE_CONFIRMATION,
  );
  await setupDashboardFixtures(process.env);
});
test.afterAll(async () => {
  await cleanupDashboardFixtures(process.env);
  expect(await countDashboardFixtures(process.env)).toEqual({
    users: 0,
    laboratories: 0,
    memberships: 0,
    areas: 0,
    collections: 0,
  });
});

test("US1 shows real contextual totals, an empty laboratory and the areas destination", async ({ page, context }, info) => {
  const [laboratoryId, , emptyLaboratoryId] = DASHBOARD_FIXTURES.laboratoryIds;
  await login(context, info);
  await page.goto(`/dashboard/laboratories/${laboratoryId}`);
  await expect(page.getByRole("heading", { name: `${DASHBOARD_FIXTURE_PREFIX} laboratory 0`, exact: true }).last()).toBeVisible();
  const summary = page.getByLabel("Visão geral").or(page.locator("section[aria-labelledby='summary-title']"));
  await expect(summary.getByText("12", { exact: true }).first()).toBeVisible();
  await expect(summary.getByText("12", { exact: true }).last()).toBeVisible();
  await summary.getByRole("link", { name: /Ver áreas/ }).click();
  await expect(page).toHaveURL(`/dashboard/laboratories/${laboratoryId}/areas`);

  await page.goto(`/dashboard/laboratories/${emptyLaboratoryId}`);
  await expect(page.getByText("Nenhuma atividade elegível neste laboratório.")).toBeVisible();
  await expect(page.getByText("0", { exact: true })).toHaveCount(2);
});

test("US2 traverses more than 20 stable derived items without duplicates and opens real destinations", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  await login(context, info);
  await page.goto(`/dashboard/laboratories/${laboratoryId}`);
  const history = page.locator("section[aria-labelledby='history-title']");
  const firstLinks = history.locator("ol a");
  await expect(firstLinks).toHaveCount(20);
  const firstPage = await firstLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(new Set(firstPage).size).toBe(20);
  expect(firstPage.some((href) => href?.includes("/collections/"))).toBe(true);
  expect(firstPage.some((href) => href && !href.includes("/collections/"))).toBe(true);

  await history.getByRole("button", { name: "Mais antigos" }).click();
  await expect(history.locator("ol a")).toHaveCount(4);
  const secondPage = await history.locator("ol a").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(firstPage.filter((href) => secondPage.includes(href))).toEqual([]);
  await expect(history.getByRole("button", { name: "Mais antigos" })).toBeDisabled();

  await history.getByRole("button", { name: "Mais recentes" }).click();
  await expect(history.locator("ol a")).toHaveCount(20);
  await history.locator("ol a").first().click();
  await expect(page).toHaveURL(/\/dashboard\/laboratories\/[0-9a-f-]{36}\/areas\/[0-9a-f-]{36}(\/collections\/[0-9a-f-]{36})?$/);
});

test("US2 keeps continuation stable and includes a newer source after returning to the first page", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  const newAreaId = DASHBOARD_FIXTURES.areaIds[13];
  const newAreaName = `${DASHBOARD_FIXTURE_PREFIX} area inserted`;
  await login(context, info);
  await page.goto(`/dashboard/laboratories/${laboratoryId}`);
  const history = page.locator("section[aria-labelledby='history-title']");
  await expect(history.locator("ol a")).toHaveCount(20);

  const client = createDashboardFixtureClient(process.env.TEST_DATABASE_URL!);
  try {
    await client.collectionArea.create({
      data: {
        id: newAreaId,
        name: newAreaName,
        userId: DASHBOARD_FIXTURES.userIds[0],
        laboratoryRoomId: laboratoryId,
        latitude: -3,
        longitude: -38,
        createdAt: new Date("2026-09-19T15:00:00.000Z"),
      },
    });
  } finally {
    await client.$disconnect();
  }

  await history.getByRole("button", { name: "Mais antigos" }).click();
  await expect(history.getByText(newAreaName)).toHaveCount(0);
  await history.getByRole("button", { name: "Mais recentes" }).click();
  await expect(history.getByText(newAreaName)).toBeVisible();
});

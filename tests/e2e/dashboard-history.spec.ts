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

test("US3 reloads persisted sources and keeps loading, failure and retry distinct", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  const areaId = DASHBOARD_FIXTURES.areaIds[14];
  const collectionId = DASHBOARD_FIXTURES.collectionIds[14];
  await login(context, info);
  await page.goto(`/dashboard/laboratories/${laboratoryId}`);

  const client = createDashboardFixtureClient(process.env.TEST_DATABASE_URL!);
  try {
    await client.collectionArea.create({
      data: {
        id: areaId,
        name: `${DASHBOARD_FIXTURE_PREFIX} refreshed area`,
        userId: DASHBOARD_FIXTURES.userIds[0],
        laboratoryRoomId: laboratoryId,
        latitude: -3,
        longitude: -38,
        createdAt: new Date("2026-09-19T16:00:00.000Z"),
      },
    });
    await client.collectionData.create({
      data: {
        id: collectionId,
        collectionAreaId: areaId,
        laboratoryRoomId: laboratoryId,
        userId: DASHBOARD_FIXTURES.userIds[0],
        occurredAt: new Date("2026-09-19T15:00:00.000Z"),
        occurrenceOffset: "-03:00",
        confirmedAt: new Date("2026-09-19T16:00:00.000Z"),
        confirmationKey: "00000000-0000-4000-8000-000000000815",
      },
    });
  } finally {
    await client.$disconnect();
  }

  await page.reload();
  const summary = page.locator("section[aria-labelledby='summary-title']");
  await expect(summary.getByText("14", { exact: true })).toBeVisible();
  await expect(summary.getByText("13", { exact: true })).toBeVisible();
  await expect(page.getByText(`${DASHBOARD_FIXTURE_PREFIX} refreshed area`).first()).toBeVisible();

  const summaryRoute = `**/api/laboratories/${laboratoryId}/dashboard/summary`;
  await page.route(summaryRoute, async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "Falha controlada." } }) });
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Resumo indisponível" })).toBeVisible();
  await expect(page.locator("section[aria-labelledby='history-title'] ol a")).toHaveCount(20);
  await page.unroute(summaryRoute);
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(summary.getByText("14", { exact: true })).toBeVisible();

  await page.route(`**/api/laboratories/${laboratoryId}/dashboard/history`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.reload();
  await expect(page.getByRole("status", { name: "Carregando histórico" })).toBeVisible();
  await expect(page.getByText("Nenhuma atividade elegível neste laboratório.")).toHaveCount(0);
  await page.unroute(`**/api/laboratories/${laboratoryId}/dashboard/history`);
});

test("US3 discards a delayed response when the laboratory context changes", async ({ page, context }, info) => {
  const [laboratoryId, inactiveLaboratoryId] = DASHBOARD_FIXTURES.laboratoryIds;
  await login(context, info);
  await page.route(`**/api/laboratories/${laboratoryId}/dashboard/summary`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  void page.goto(`/dashboard/laboratories/${laboratoryId}`).catch(() => undefined);
  await page.waitForTimeout(100);
  await page.goto(`/dashboard/laboratories/${inactiveLaboratoryId}`);
  await expect(page.getByText(`${DASHBOARD_FIXTURE_PREFIX} laboratory 1`)).toBeVisible();
  await expect(page.getByText(`${DASHBOARD_FIXTURE_PREFIX} laboratory 0`)).toHaveCount(0);
  await expect(page.getByText("Laboratório inativo — somente leitura.").first()).toBeVisible();
});

test("US4 preserves isolation, reauthorization and minimized API payloads", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  const memberId = DASHBOARD_FIXTURES.userIds[2];
  await login(context, info, 2);
  await page.goto(`/dashboard/laboratories/${laboratoryId}`);
  const destination = await page.locator("section[aria-labelledby='history-title'] ol a").first().getAttribute("href");
  expect(destination).toBeTruthy();

  const client = createDashboardFixtureClient(process.env.TEST_DATABASE_URL!);
  try {
    await client.researchersLinked.delete({ where: { userId_laboratoryRoomId: { userId: memberId, laboratoryRoomId: laboratoryId } } });
    const response = await page.goto(destination!);
    expect(response?.status()).toBe(404);
    const summaryResponse = await context.request.get(`/api/laboratories/${laboratoryId}/dashboard/summary`);
    const historyResponse = await context.request.get(`/api/laboratories/${laboratoryId}/dashboard/history`);
    expect(summaryResponse.status()).toBe(404);
    expect(historyResponse.status()).toBe(404);
    expect(await summaryResponse.json()).toEqual({ error: { code: "NOT_FOUND", message: "Recurso não encontrado." } });
    await client.researchersLinked.create({ data: { userId: memberId, laboratoryRoomId: laboratoryId, role: "MEMBER" } });
  } finally {
    await client.$disconnect();
  }

  await login(context, info, 0);
  const payload = JSON.stringify(await (await context.request.get(`/api/laboratories/${laboratoryId}/dashboard/history`)).json());
  for (const forbidden of ["email","userId","latitude","longitude","observations","confirmationKey","payload","measurementContractVersion"]) expect(payload).not.toContain(forbidden);
});

test("US4 remains keyboard-operable and free of main horizontal overflow", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  await login(context, info);
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/dashboard/laboratories/${laboratoryId}`);
    await expect(page.locator("main")).toBeVisible();
    expect(await page.locator("main").evaluate((main) => main.scrollWidth <= main.clientWidth)).toBe(true);
    const refresh = page.getByRole("button", { name: "Atualizar histórico" });
    await refresh.focus();
    await expect(refresh).toBeFocused();
    await expect(page.locator("time[datetime]").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver áreas/ })).toBeVisible();
  }
});

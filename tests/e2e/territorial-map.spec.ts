import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  DASHBOARD_FIXTURE_CONFIRMATION,
  DASHBOARD_FIXTURES,
  DASHBOARD_FIXTURE_PREFIX,
  cleanupDashboardFixtures,
  countDashboardFixtures,
  setupDashboardFixtures,
} from "../fixtures/dashboard-history";

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([{ name: "auth_token", value: signSessionToken(DASHBOARD_FIXTURES.userIds[userIndex]), url: String(info.project.use.baseURL) }]);
}

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);
test.beforeAll(async () => {
  expect(process.env.DASHBOARD_FIXTURE_CONFIRMATION).toBe(DASHBOARD_FIXTURE_CONFIRMATION);
  await setupDashboardFixtures(process.env);
});
test.afterAll(async () => {
  await cleanupDashboardFixtures(process.env);
  expect(await countDashboardFixtures(process.env)).toEqual({ users: 0, laboratories: 0, memberships: 0, areas: 0, collections: 0 });
});

test("shows one authorized textual item and marker per area and excludes partial collections", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  await login(context, info);
  await page.route("https://tile.openstreetmap.org/**", (route) => route.abort());
  await page.goto(`/dashboard/laboratories/${laboratoryId}/map`);
  await expect(page.getByRole("heading", { name: `Áreas de ${DASHBOARD_FIXTURE_PREFIX} laboratory 0` })).toBeVisible();
  await expect(page.locator('button[aria-controls="selected-area-panel"]')).toHaveCount(12);
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(12);
  await expect(page.getByText("Base cartográfica indisponível. A lista permanece completa.")).toBeVisible();

  const firstArea = page.locator('button[aria-controls="selected-area-panel"]').filter({ hasText: `${DASHBOARD_FIXTURE_PREFIX} area 0` });
  await firstArea.focus();
  await expect(firstArea).toBeFocused();
  await firstArea.press("Enter");
  await expect(page.getByText(`Área selecionada: ${DASHBOARD_FIXTURE_PREFIX} area 0`, { exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: `${DASHBOARD_FIXTURE_PREFIX} area 0`, exact: true })).toBeVisible();
  await expect(page.getByText("Coletas confirmadas (1)")).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir coleta" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Abrir detalhe da área" })).toHaveAttribute("href", `/dashboard/laboratories/${laboratoryId}/areas/${DASHBOARD_FIXTURES.areaIds[0]}`);

  const response = await page.request.get(`/api/laboratories/${laboratoryId}/territorial-map`);
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toBe("no-store");
  const body = await response.json();
  expect(body.areas).toHaveLength(12);
  expect(body.areas[0].confirmedCollections).toHaveLength(1);
  expect(JSON.stringify(body)).not.toMatch(/userId|email|observations|confirmationKey|payload|ihfrScore/);
});

test("keeps inactive laboratories readable and inaccessible contexts indistinguishable", async ({ page, context }, info) => {
  const inactiveId = DASHBOARD_FIXTURES.laboratoryIds[1];
  await login(context, info);
  await page.goto(`/dashboard/laboratories/${inactiveId}/map`);
  await expect(page.getByText(/Laboratório inativo, somente leitura/)).toBeVisible();
  await expect(page.locator('button[aria-controls="selected-area-panel"]', { hasText: "inactive area" })).toHaveCount(1);

  await login(context, info, 3);
  const denied = await page.request.get(`/api/laboratories/${DASHBOARD_FIXTURES.laboratoryIds[0]}/territorial-map`);
  expect(denied.status()).toBe(401);
  await login(context, info, 0);
  const missing = await page.request.get("/api/laboratories/00000000-0000-4000-8000-000000000999/territorial-map");
  expect(missing.status()).toBe(404);
  await login(context, info, 2);
  const crossed = await page.request.get(`/api/laboratories/${DASHBOARD_FIXTURES.laboratoryIds[2]}/territorial-map`);
  expect(crossed.status()).toBe(404);
  expect(await crossed.json()).toEqual(await missing.json());
});

test("preserves the complete textual interface without horizontal overflow", async ({ page, context }, info) => {
  const laboratoryId = DASHBOARD_FIXTURES.laboratoryIds[0];
  await login(context, info);
  await page.route("https://tile.openstreetmap.org/**", (route) => route.abort());
  for (const viewport of [{ width: 320, height: 760 }, { width: 768, height: 900 }, { width: 1280, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`/dashboard/laboratories/${laboratoryId}/map`);
    await expect(page.locator('button[aria-controls="selected-area-panel"]')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

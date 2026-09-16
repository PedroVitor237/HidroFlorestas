import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";

import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  AREA_FIXTURES,
  cleanupAreaFixtures,
  countAreaFixtures,
  setupAreaFixtures,
} from "../fixtures/areas";

const laboratoryId = AREA_FIXTURES.laboratoryIds[0];
const areaId = "00000000-0000-4000-8000-000000000321";

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([{ name: "auth_token", value: signSessionToken(AREA_FIXTURES.userIds[userIndex]), url: String(info.project.use.baseURL) }]);
}

test.describe.configure({ mode: "serial" });
test.beforeAll(async () => setupAreaFixtures(process.env));
test.afterAll(async () => {
  await cleanupAreaFixtures(process.env);
  expect(await countAreaFixtures(process.env)).toEqual({ users: 0, laboratories: 0, memberships: 0, areas: 0 });
});
test.beforeEach(async ({ context }) => context.route("https://tile.openstreetmap.org/**", (route) => route.abort()));

test("lists persistent coordinates without an aggregate map and opens one-marker detail", async ({ page, context }, info) => {
  await login(context, info, 2);
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas`);
  await expect(page.getByRole("link", { name: "IMP-003 E2E area 0", exact: true })).toBeVisible();
  await expect(page.getByText("Latitude: -3 · Longitude: -38", { exact: true })).toBeVisible();
  await expect(page.locator(".leaflet-container")).toHaveCount(0);
  await page.getByRole("link", { name: "IMP-003 E2E area 0", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/areas/${areaId}$`));
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(1);
  await expect(page.getByText(/Município|Estado|Tipo do terreno|Descrição/)).toHaveCount(0);
});

test("renders list and detail for every contextual role, including inactive read-only", async ({ page, context }, info) => {
  for (const userIndex of [0, 1, 2]) {
    await login(context, info, userIndex);
    await page.goto(`/dashboard/laboratories/${laboratoryId}/areas`);
    await expect(page.getByRole("link", { name: "IMP-003 E2E area 0", exact: true })).toBeVisible();
  }
  await login(context, info, 2);
  await page.goto(`/dashboard/laboratories/${AREA_FIXTURES.laboratoryIds[1]}/areas`);
  await expect(page.getByText("Laboratório inativo — somente leitura.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Nova área", exact: true })).toHaveCount(0);
});

test("keeps list and detail usable on mobile, intermediate and wide viewports", async ({ page, context }, info) => {
  await login(context, info);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}`);
    await expect(page.getByRole("heading", { name: "IMP-003 E2E area 0" })).toBeVisible();
    const map = page.getByRole("region", { name: "Mapa da área" });
    const box = await map.boundingBox();
    expect(box?.width).toBeGreaterThan(200);
    expect(box?.height).toBeGreaterThan(200);
    await page.getByRole("link", { name: "Voltar às áreas" }).focus();
    await expect(page.getByRole("link", { name: "Voltar às áreas" })).toBeFocused();
  }
});

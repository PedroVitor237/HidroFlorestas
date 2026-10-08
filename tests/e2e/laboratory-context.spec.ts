import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";

import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  AREA_FIXTURES,
  cleanupAreaFixtures,
  countAreaFixtures,
  createAreaFixtureClient,
  setupAreaFixtures,
} from "../fixtures/areas";

const laboratoryId = AREA_FIXTURES.laboratoryIds[0];
const areasUrl = `/dashboard/laboratories/${laboratoryId}/areas`;

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([{ name: "auth_token", value: signSessionToken(AREA_FIXTURES.userIds[userIndex]), url: String(info.project.use.baseURL) }]);
}

test.describe.configure({ mode: "serial" });
test.beforeAll(async () => setupAreaFixtures(process.env));
test.afterAll(async () => {
  await cleanupAreaFixtures(process.env);
  expect(await countAreaFixtures(process.env)).toEqual({ users: 0, laboratories: 0, memberships: 0, areas: 0 });
});

test("requires explicit selection and keeps laboratory context in links and reloads", async ({ page, context }, info) => {
  await login(context, info);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/workspace$/);
  await page.getByRole("listitem").filter({ hasText: "IMP-003 E2E 0" }).getByRole("link", { name: "ACESSAR LABORATÓRIO" }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}$`));
  await expect(page.getByRole("heading", { name: "IMP-003 E2E 0", exact: true, level: 1 })).toBeVisible();
  await page.getByRole("navigation", { name: "Laboratório" }).getByRole("link", { name: "Áreas", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}/areas$`));
  await expect(page.getByRole("link", { name: "Nova área", exact: true })).toHaveAttribute("href", `${areasUrl}/new`);
  await page.reload();
  await expect(page.getByText("IMP-003 E2E 0", { exact: true })).toBeVisible();
});

test("revoked and cross-laboratory access remain indistinguishable from missing resources", async ({ context }, info) => {
  await login(context, info, 2);
  const db = createAreaFixtureClient(process.env);
  try {
    const areaId = "00000000-0000-4000-8000-000000000321";
    const cross = await context.request.get(`/api/laboratories/${AREA_FIXTURES.laboratoryIds[1]}/areas/${areaId}`);
    expect(cross.status()).toBe(404);
    await db.researchersLinked.delete({ where: { userId_laboratoryRoomId: { userId: AREA_FIXTURES.userIds[2], laboratoryRoomId: laboratoryId } } });
    expect((await context.request.get(`/api/laboratories/${laboratoryId}/areas`)).status()).toBe(404);
  } finally {
    await db.$disconnect();
  }
});

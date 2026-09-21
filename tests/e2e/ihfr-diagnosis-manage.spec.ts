import { expect, test } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";

const configured = Boolean(process.env.IMP006_E2E_MANAGE_URL && process.env.IMP006_E2E_OWNER_ID);
test.beforeEach(async ({ context }, info) => { test.skip(!configured, "isolated IMP-006 management fixture is not configured"); await context.addCookies([{ name: "auth_token", value: signSessionToken(process.env.IMP006_E2E_OWNER_ID!), url: String(info.project.use.baseURL) }]); });

test("OWNER manages create, replace, revoke and recovery with accessible feedback", async ({ page }) => {
  await page.goto(process.env.IMP006_E2E_MANAGE_URL!);
  const create = page.getByRole("button", { name: /calcular diagnóstico/i });
  await create.focus(); await expect(create).toBeFocused(); await create.click();
  await expect(page.getByRole("status")).toBeFocused();
  await expect(page.getByRole("button", { name: /substituir/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /revogar/i })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.locator("main").evaluate((main) => main.scrollWidth <= main.clientWidth)).toBe(true);
});

test("MEMBER and inactive laboratory remain read-only", async ({ page }) => {
  test.skip(!process.env.IMP006_E2E_READ_ONLY_URL, "isolated read-only fixture is not configured");
  await page.goto(process.env.IMP006_E2E_READ_ONLY_URL!);
  await expect(page.getByRole("button", { name: /calcular|substituir|revogar/i })).toHaveCount(0);
});

import { expect, test, type Page } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";

const managementActors = [
  { role: "OWNER", id: process.env.IMP006_E2E_OWNER_ID, url: process.env.IMP006_E2E_MANAGE_URL },
  { role: "ADMIN", id: process.env.IMP006_E2E_ADMIN_ID, url: process.env.IMP006_E2E_ADMIN_MANAGE_URL },
] as const;
const managementConfigured = managementActors.every(({ id, url }) => Boolean(id && url));
const readOnlyConfigured = Boolean(process.env.IMP006_E2E_MEMBER_ID && process.env.IMP006_E2E_READ_ONLY_URL && process.env.IMP006_E2E_INACTIVE_URL);

async function authenticate(page: Page, actorId: string, baseURL: string) {
  await page.context().clearCookies();
  await page.context().addCookies([{ name: "auth_token", value: signSessionToken(actorId), url: baseURL }]);
}

async function expectConfirmationKeyboardContract(page: Page, triggerName: RegExp) {
  const trigger = page.getByRole("button", { name: triggerName });
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/confirmar/i);
  await expect(dialog.getByRole("button", { name: /cancelar/i })).toBeFocused();
  for (let index = 0; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
}

test("OWNER and contextual ADMIN create, replace, revoke and recover with accessible feedback", async ({ page }, info) => {
  test.skip(!managementConfigured, "isolated IMP-006 OWNER/ADMIN management fixtures are not configured; execute definitively in T116");

  for (const actor of managementActors) {
    await authenticate(page, actor.id!, String(info.project.use.baseURL));
    await page.goto(actor.url!);

    const create = page.getByRole("button", { name: /calcular diagnóstico/i });
    await create.focus();
    await expect(create).toBeFocused();
    await create.press("Enter");
    await expect(page.getByRole("status")).toBeFocused();
    await expect(page.getByRole("button", { name: /substituir/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /revogar/i })).toBeVisible();

    await expectConfirmationKeyboardContract(page, /substituir/i);
    await expectConfirmationKeyboardContract(page, /revogar/i);

    await page.route("**/ihfr-diagnosis/diagnoses", async (route) => {
      if (route.request().method() === "POST") await route.fulfill({ status: 409, contentType: "application/json", body: JSON.stringify({ error: { code: "STATE_CONFLICT", message: "State changed" } }) });
      else await route.continue();
    });
    await page.getByRole("button", { name: /substituir/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /confirmar/i }).click();
    await expect(page.getByRole("alert")).toBeFocused();
    await page.unroute("**/ihfr-diagnosis/diagnoses");

    await page.route("**/ihfr-diagnosis/diagnoses", (route) => route.abort("timedout"), { times: 1 });
    await page.getByRole("button", { name: /substituir/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /confirmar/i }).click();
    await expect(page.getByRole("status")).toContainText(/recuperad|verificando|processando/i);

    await page.setViewportSize({ width: 320, height: 844 });
    expect(await page.locator("main").evaluate((main) => main.scrollWidth <= main.clientWidth)).toBe(true);
    await page.setViewportSize({ width: 1280, height: 900 });
  }
});

test("MEMBER and active links in an inactive laboratory remain read-only", async ({ page }, info) => {
  test.skip(!readOnlyConfigured, "isolated IMP-006 MEMBER/inactive-laboratory fixtures are not configured; execute definitively in T116");
  for (const scenario of [
    { actorId: process.env.IMP006_E2E_MEMBER_ID!, url: process.env.IMP006_E2E_READ_ONLY_URL!, label: "MEMBER" },
    { actorId: process.env.IMP006_E2E_OWNER_ID!, url: process.env.IMP006_E2E_INACTIVE_URL!, label: "inactive laboratory" },
  ]) {
    await authenticate(page, scenario.actorId, String(info.project.use.baseURL));
    await page.goto(scenario.url);
    await expect(page.getByRole("button", { name: /calcular|substituir|revogar/i })).toHaveCount(0);
    await expect(page.getByText(/diagnóstico ihfr experimental/i)).toBeVisible();
    await expect(page.locator("main")).toHaveAttribute("data-write-state", "read-only");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveCount(1, { timeout: 5_000 });
  }
});

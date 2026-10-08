import { expect, test, type BrowserContext } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";
const ids = JSON.parse(process.env.DELETION_E2E_IDS ?? "{}");
const password = process.env.DELETION_E2E_PASSWORD!;
const origin = process.env.PLAYWRIGHT_BASE_URL!;
async function session(context: BrowserContext, name: string, restricted = false) {
  await context.addCookies([{ name: restricted ? "verification_token" : "auth_token", value: signSessionToken(ids[name], undefined, 0, restricted ? "email-verification" : "session"), url: origin, httpOnly: true, sameSite: "Lax" }]);
}
test("normal account: GET and cancellation preserve access; wrong password, keyboard confirmation, deletion and second-session revocation", async ({ page, context, browser }) => {
  await session(context, "normal"); const second = await browser.newContext(); await session(second, "normal");
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/delete-account");
    await expect(page.getByRole("button", { name: "Excluir minha conta", exact: true })).toBeDisabled();
    expect((await second.request.get(`${origin}/api/auth/me`)).status()).toBe(200);
    await page.getByRole("link", { name: "Cancelar e voltar" }).click();
    await expect(page).toHaveURL(/\/workspace$/);
    await page.getByRole("link", { name: "Excluir conta", exact: true }).click();
    await page.getByLabel("Senha atual", { exact: true }).fill("incorrect");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Excluir minha conta", exact: true }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("senha atual está incorreta");
    await expect(page.locator('p[role="alert"]')).toBeFocused();
    await expect(page.getByLabel("Senha atual", { exact: true })).toHaveValue("");
    await page.getByLabel("Senha atual", { exact: true }).fill(password);
    await page.getByRole("checkbox").focus(); await page.keyboard.press("Space"); await page.keyboard.press("Tab"); await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText("Sua conta foi excluída");
    expect((await second.request.get(`${origin}/api/auth/me`)).status()).toBe(401);
    expect((await context.cookies()).some(cookie => ["auth_token", "verification_token"].includes(cookie.name))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  } finally { await second.close(); }
});
test("restricted account can delete itself while private workspace remains inaccessible", async ({ page, context }) => {
  await session(context, "restricted", true); await page.goto("/workspace"); await expect(page).toHaveURL(/\/login$/);
  await page.goto("/verify-email");
  await page.getByRole("link", { name: "Excluir minha conta", exact: true }).click();
  await page.getByLabel("Senha atual", { exact: true }).fill(password); await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Excluir minha conta", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Sua conta foi excluída");
});
test("scientific links and the last active administrator show blockers and offer no destructive form", async ({ page, context }) => {
  await session(context, "linked"); await page.goto("/delete-account");
  await expect(page.getByText("Laboratórios criados: 2", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Excluir minha conta", exact: true })).toHaveCount(0);
  await session(context, "admin"); await page.reload();
  await expect(page.getByText(/único administrador ativo/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Excluir minha conta", exact: true })).toHaveCount(0);
});

import { expect, test } from "@playwright/test";
import { authenticateAs, setupUsers } from "./user-administration.helper";

test.beforeAll(setupUsers);
test("successful changes appear in minimized history", async ({ page, context }, testInfo) => {
  await authenticateAs(context, testInfo, 1);
  await page.goto("/dashboard/admin/users");
  await page.getByPlaceholder("Pesquisar nome ou email").fill("Fixture03");
  await page.getByText("imp009-3@test.invalid").click();
  await page.getByRole("button", { name: "Usuário", exact: true }).click();
  await page.getByPlaceholder("Explique por que esta alteração é necessária").fill("E2E histórico");
  const response = page.waitForResponse((item) => item.url().endsWith("/role") && item.request().method() === "PATCH");
  await page.getByRole("button", { name: "Confirmar alteração" }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Histórico recente" })).toBeVisible();
  await expect(page.getByText("Moderador → Usuário").first()).toBeVisible();
});

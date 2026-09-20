import { expect, test } from "@playwright/test";
import { authenticateAs, setupUsers } from "./user-administration.helper";

test.beforeAll(setupUsers);
test("status confirmation is keyboard-operable and audited", async ({ page, context }, testInfo) => {
  await authenticateAs(context, testInfo, 1);
  await page.goto("/dashboard/admin/users");
  await page.getByPlaceholder("Pesquisar nome ou email").fill("Fixture04");
  await page.getByText("imp009-4@test.invalid").click();
  await page.getByRole("button", { name: "Ativa", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByPlaceholder("Explique por que esta alteração é necessária").fill("E2E de reativação");
  const response = page.waitForResponse((item) => item.url().endsWith("/status") && item.request().method() === "PATCH");
  await page.getByRole("button", { name: "Confirmar alteração" }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByText("Estado de Fixture04 atualizado com segurança.")).toBeVisible();
});

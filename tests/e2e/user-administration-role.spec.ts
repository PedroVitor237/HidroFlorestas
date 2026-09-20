import { expect, test } from "@playwright/test";
import { authenticateAs, setupUsers } from "./user-administration.helper";

test.beforeAll(setupUsers);
test("role promotion is confirmed and self-change controls are rejected by API", async ({ page, context }, testInfo) => {
  await authenticateAs(context, testInfo, 1);
  await page.goto("/dashboard/admin/users");
  await page.getByPlaceholder("Pesquisar nome ou email").fill("Fixture03");
  await page.getByText("imp009-3@test.invalid").click();
  await page.getByRole("button", { name: "Administrador", exact: true }).click();
  await page.getByPlaceholder("Explique por que esta alteração é necessária").fill("E2E de promoção");
  const response = page.waitForResponse((item) => item.url().endsWith("/role") && item.request().method() === "PATCH");
  await page.getByRole("button", { name: "Confirmar alteração" }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByText("Papel de Fixture03 atualizado com segurança.")).toBeVisible();
  const self = await context.request.patch("/api/admin/users/90000000-0000-4000-8000-000000000001/role", { data: { expectedRole: "ADMIN", expectedRevision: 0, role: "USER", reason: "self" } });
  expect(self.status()).toBe(403);
});

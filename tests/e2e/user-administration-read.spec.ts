import { expect, test } from "@playwright/test";
import { authenticateAs, setupUsers } from "./user-administration.helper";

test.beforeAll(setupUsers);
test("ADMIN lists, searches and opens details while non-admin is denied", async ({ page, context }, testInfo) => {
  await authenticateAs(context, testInfo, 1);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Visão geral administrativa" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação administrativa" }).getByRole("link", { name: "Visão geral" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Gerenciar usuários" }).click();
  await expect(page).toHaveURL(/\/admin\/users$/);
  await expect(page.getByRole("heading", { name: "Contas e acessos" })).toBeVisible();
  await page.getByPlaceholder("Pesquisar nome ou email").fill("Fixture03");
  await expect(page.getByText("imp009-3@test.invalid")).toBeVisible();
  await page.getByText("imp009-3@test.invalid").click();
  await expect(page.getByText("Conta selecionada")).toBeVisible();
  await context.clearCookies();
  await authenticateAs(context, testInfo, 3);
  expect((await context.request.get("/api/admin/users")).status()).toBe(403);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/workspace$/);
  await page.goto("/admin/users");
  await expect(page).toHaveURL(/\/workspace$/);
});

test("legacy user administration route redirects to the canonical protected route", async ({ page, context }, testInfo) => {
  await authenticateAs(context, testInfo, 1);
  await page.goto("/dashboard/admin/users");
  await expect(page).toHaveURL(/\/admin\/users$/);
  await expect(page.getByRole("heading", { name: "Contas e acessos" })).toBeVisible();
});

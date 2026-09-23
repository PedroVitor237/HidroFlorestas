import { expect, test } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing isolated IMP-006 E2E fixture: ${name}`);
  return value;
};

test.beforeEach(async ({ context }, info) => {
  await context.addCookies([{ name: "auth_token", value: signSessionToken(required("IMP006_E2E_ACTOR_ID")), url: String(info.project.use.baseURL) }]);
});

test("member reads the current experimental DTO with labels, keyboard access and responsive layout", async ({ page }) => {
  await page.goto(required("IMP006_E2E_COLLECTION_URL"));
  const diagnosis = page.getByRole("region", { name: "Diagnóstico IHFR experimental" });
  await expect(diagnosis).toBeVisible();
  await expect(diagnosis.getByText(/Qualidade dos dados:/)).toBeVisible();
  for (const component of ["W", "S", "V", "T"]) await expect(diagnosis.getByText(component, { exact: true })).toBeVisible();
  for (const label of ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"]) await expect(diagnosis.getByText(label, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /criar diagnóstico|substituir diagnóstico|revogar diagnóstico/i })).toHaveCount(0);
  const text = await diagnosis.textContent();
  for (const restricted of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "evidence", "lifecycleEvents"]) expect(text).not.toContain(restricted);
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);
});

test("member sees honest absence and inactive laboratory stays read only", async ({ page }) => {
  await page.goto(required("IMP006_E2E_ABSENT_COLLECTION_URL"));
  await expect(page.getByRole("region", { name: "Diagnóstico IHFR experimental" }).getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
  await expect(page.getByText(/Qualidade dos dados:/)).toHaveCount(0);
  await page.goto(required("IMP006_E2E_INACTIVE_COLLECTION_URL"));
  await expect(page.getByText(/Laboratório inativo.*somente leitura/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /criar diagnóstico|substituir diagnóstico|revogar diagnóstico/i })).toHaveCount(0);
});

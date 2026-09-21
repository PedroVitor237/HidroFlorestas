import { expect, test } from "@playwright/test";
import { signSessionToken } from "../../src/app/api/server/auth/session";

const configured = Boolean(process.env.IMP006_E2E_COLLECTION_URL && process.env.IMP006_E2E_ACTOR_ID);

test.beforeEach(async ({ context }, info) => {
  test.skip(!configured, "isolated IMP-006 E2E URL and authenticated actor are not configured");
  await context.addCookies([{ name: "auth_token", value: signSessionToken(process.env.IMP006_E2E_ACTOR_ID!), url: String(info.project.use.baseURL) }]);
});

test("current diagnosis is minimized, labelled, keyboard-readable and responsive", async ({ page }) => {
  await page.goto(process.env.IMP006_E2E_COLLECTION_URL!);
  const diagnosis = page.getByRole("region", { name: "Diagnóstico IHFR experimental" });
  await expect(diagnosis).toBeVisible();
  await expect(diagnosis.getByText(/Qualidade dos dados:/)).toBeVisible();
  for (const component of ["W", "S", "V", "T"]) await expect(diagnosis.getByText(component, { exact: true })).toBeVisible();
  for (const label of ["CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"]) await expect(diagnosis.getByText(label, { exact: true })).toBeVisible();
  await expect(diagnosis.getByText(/Contrato matemático/)).toBeVisible();
  await expect(diagnosis.getByText(/Algoritmo/)).toBeVisible();
  await expect(diagnosis.getByText(/Hash do contrato/)).toBeVisible();
  await expect(page.getByRole("button", { name: /calcular|substituir|revogar/i })).toHaveCount(0);
  const text = await diagnosis.textContent();
  for (const forbidden of ["actorUserId", "idempotencyKey", "requestHash", "payloadHash", "evidence", "lifecycleEvents"]) expect(text).not.toContain(forbidden);
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.locator("main").evaluate((main) => main.scrollWidth <= main.clientWidth)).toBe(true);
  }
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);
});

test("absence and inactive laboratory remain honest read-only states", async ({ page }) => {
  test.skip(!process.env.IMP006_E2E_ABSENT_COLLECTION_URL || !process.env.IMP006_E2E_INACTIVE_COLLECTION_URL, "isolated absence and inactive-laboratory URLs are not configured");
  await page.goto(process.env.IMP006_E2E_ABSENT_COLLECTION_URL!);
  await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
  await expect(page.getByText(/Qualidade dos dados:/)).toHaveCount(0);
  await page.goto(process.env.IMP006_E2E_INACTIVE_COLLECTION_URL!);
  await expect(page.getByText(/Laboratório inativo.*somente leitura/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /calcular|substituir|revogar/i })).toHaveCount(0);
});

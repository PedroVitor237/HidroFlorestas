import { expect, test } from "@playwright/test";

test("diagnosis surface exposes experimental labels or an honest absence state", async ({ page }) => {
  test.skip(!process.env.IMP006_E2E_COLLECTION_URL, "IMP006_E2E_COLLECTION_URL not configured");
  await page.goto(process.env.IMP006_E2E_COLLECTION_URL!);
  await expect(page.getByRole("heading", { name: /diagnóstico ihfr/i })).toBeVisible();
  await expect(page.getByText(/contrato experimental|nenhum diagnóstico/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /calcular|substituir|revogar/i })).toHaveCount(0);
});

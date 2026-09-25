import { expect, test } from "@playwright/test";
import type { PublicDiagnosis } from "../../src/types/ihfr-diagnosis.type";

const email = process.env.IMP006_UI_EMAIL!;
const password = process.env.IMP006_UI_PASSWORD!;
const run = process.env.IMP006_UI_RUN_ID!;

test("login creates laboratory, area, collection, measurement and IHFR through the UI", async ({ page }) => {
  test.setTimeout(180_000);
  const labName = `${run} Laboratório`;
  const areaName = `${run} Área`;
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "ENTRAR" }).click();
  await expect(page).toHaveURL(/\/workspace/);
  await page.getByLabel("Nome do laboratório").fill(labName);
  await page.getByRole("button", { name: "Criar laboratório" }).click();
  const labCard = page.locator("li").filter({ hasText: labName }).first();
  await expect(labCard).toBeVisible();
  await labCard.getByRole("link", { name: "ACESSAR LABORATÓRIO" }).click();
  await expect(page).toHaveURL(/\/dashboard\/laboratories\/[0-9a-f-]{36}$/i);
  const laboratoryId = page.url().match(/laboratories\/([0-9a-f-]{36})/i)?.[1];
  expect(laboratoryId).toBeTruthy();

  await page.getByRole("link", { name: "Áreas" }).click();
  await page.getByRole("link", { name: "Nova área" }).click();
  await page.getByLabel("Nome da área").fill(areaName);
  await page.getByLabel("Latitude").fill("-3");
  await page.getByLabel("Longitude").fill("-38");
  await page.getByRole("button", { name: "Confirmar ponto e cadastrar" }).click();
  await expect(page).toHaveURL(/\/areas\/[0-9a-f-]{36}$/i);
  const areaId = page.url().match(/areas\/([0-9a-f-]{36})/i)?.[1];
  expect(areaId).toBeTruthy();

  await page.getByRole("link", { name: "Registrar coleta" }).click();
  await page.getByLabel("Ocorrência em campo").fill("2026-09-20T12:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await page.getByRole("button", { name: "Confirmar coleta" }).click();
  await expect(page).toHaveURL(/\/collections\/[0-9a-f-]{36}$/i);
  const collectionUrl = page.url();
  const collectionId = collectionUrl.match(/collections\/([0-9a-f-]{36})/i)?.[1];
  expect(collectionId).toBeTruthy();
  const diagnosisBase = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}/ihfr-diagnosis`;
  async function currentDiagnosis(): Promise<PublicDiagnosis | null> {
    const response = await page.request.get(`${diagnosisBase}/current`);
    expect(response.status()).toBe(200);
    return (await response.json() as { diagnosis: PublicDiagnosis | null }).diagnosis;
  }

  await page.getByRole("link", { name: "Ver dados ambientais" }).click();
  await expect(page.getByText("Nenhum dado ambiental registrado")).toBeVisible();
  await page.getByRole("link", { name: "Registrar dados ambientais" }).click();
  await expect(page.locator('[name="water.waterSourceType"]')).toHaveCount(1);
  const choices: Record<string, string> = {
    "water.waterSourceType": "SPRING", "water.hasSpring": "true", "water.waterAvailability": "PERMANENT",
    "soil.soilTexture": "MEDIUM", "soil.compactionLevel": "LOW", "soil.erosionSigns": "NONE",
    "vegetation.fragmentationLevel": "LOW", "vegetation.hasRiparianApp": "true", "vegetation.landscapeDegradation": "LOW",
  };
  for (const [id, value] of Object.entries(choices)) await page.locator(`[id="${id}"]`).selectOption(value);
  for (const [id, value] of Object.entries({ "soil.infiltrationRateMmPerHour": "60", "vegetation.vegetationCoverPercent": "100", "terrain.drainageDensityKmPerKm2": "1.5", "terrain.elevationMeters": "180", "terrain.slopePercent": "45" })) await page.locator(`[id="${id}"]`).fill(value);
  await page.getByRole("button", { name: "Revisar dados" }).click();
  await page.getByRole("button", { name: "Confirmar dados ambientais" }).click();
  await expect(page.getByText(/Conjunto confirmado e imutável/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Conjunto confirmado e imutável/)).toBeVisible();
  await page.getByRole("link", { name: "Voltar à coleta" }).click();

  await page.getByLabel("Uso predominante da terra").selectOption("FOREST");
  await page.getByLabel("Origem da observação").selectOption("FIELD_OBSERVATION");
  await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
  await page.getByRole("button", { name: "Verificar elegibilidade" }).click();
  await expect(page.getByRole("status").filter({ hasText: "ELIGIBLE" })).toBeVisible();
  await page.getByRole("button", { name: "Criar diagnóstico" }).click();
  const createdResponse = page.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith("/ihfr-diagnosis/diagnoses"));
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  const created = await createdResponse;
  expect(created.status()).toBe(201);
  const firstDiagnosisId = (await created.json() as { diagnosis: PublicDiagnosis | null }).diagnosis?.id;
  expect(firstDiagnosisId).toMatch(/^[0-9a-f-]{36}$/i);
  function expectInitialVector(diagnosis: PublicDiagnosis | null) {
    expect(diagnosis?.id).toBe(firstDiagnosisId);
    expect(diagnosis?.lifecycleState).toBe("CURRENT");
    expect(diagnosis?.componentScores.W).toBeCloseTo(0.20, 10);
    expect(diagnosis?.componentScores.S).toBeCloseTo(0.20, 10);
    expect(diagnosis?.componentScores.V).toBeCloseTo(0.15, 10);
    expect(diagnosis?.componentScores.T).toBeCloseTo(0.60, 10);
    expect(diagnosis?.rawScore).toBeCloseTo(0.2875, 10);
    expect(diagnosis?.displayScore).toBe(0.29);
    expect(diagnosis?.ihfrClass).toBe("MODERATE");
    expect(diagnosis?.dataQuality).toBe("HIGH");
    expect(diagnosis?.drivers).toEqual(["T", "W"]);
  }
  expectInitialVector(await currentDiagnosis());
  const summary = page.getByRole("region", { name: "Diagnóstico IHFR experimental" });
  await expect(summary).toContainText("0.29 · MODERATE");
  await expect(summary).toContainText("HIGH");
  for (const value of ["ihfr-measurement-v1", "ihfr-diagnosis-input-experimental-v0.1.0", "CURRENT", "CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"]) await expect(summary).toContainText(value);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.reload();
  await expect(summary).toContainText("0.29 · MODERATE");
  expectInitialVector(await currentDiagnosis());

  await page.getByRole("link", { name: "Resumo" }).click();
  await page.getByRole("region", { name: "Histórico" }).getByRole("link", { name: /Coleta confirmada/ }).first().click();
  await expect(page).toHaveURL(collectionUrl);
  await expect(summary).toContainText("0.29 · MODERATE");
  expectInitialVector(await currentDiagnosis());
  await page.getByLabel("Uso predominante da terra").selectOption("URBAN");
  await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
  await page.getByRole("button", { name: "Substituir diagnóstico" }).click();
  const replacedResponse = page.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith("/ihfr-diagnosis/diagnoses"));
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  const replaced = await replacedResponse;
  expect(replaced.status()).toBe(201);
  const secondDiagnosisId = (await replaced.json()).diagnosis?.id as string | undefined;
  expect(secondDiagnosisId).toMatch(/^[0-9a-f-]{36}$/i);
  expect(secondDiagnosisId).not.toBe(firstDiagnosisId);
  await expect(summary).toContainText("0.35 · MODERATE");
  expect(await currentDiagnosis()).toMatchObject({ id: secondDiagnosisId, lifecycleState: "CURRENT" });
  const prior = await page.request.get(`${diagnosisBase}/diagnoses/${firstDiagnosisId}`);
  expect(prior.status()).toBe(200);
  expect((await prior.json()).diagnosis.lifecycleState).toBe("SUPERSEDED");

  await page.getByLabel("Motivo da revogação").fill("Verificação E2E do ciclo experimental");
  await page.getByRole("button", { name: "Revogar diagnóstico" }).click();
  const revokedResponse = page.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith(`/ihfr-diagnosis/diagnoses/${secondDiagnosisId}/revocations`));
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  expect((await revokedResponse).status()).toBe(200);
  await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
  expect(await currentDiagnosis()).toBeNull();
  const priorCurrent = await page.request.get(`${diagnosisBase}/diagnoses/${secondDiagnosisId}`);
  expect(priorCurrent.status()).toBe(200);
  expect((await priorCurrent.json()).diagnosis.lifecycleState).toBe("REVOKED");
  expect(errors).toEqual([]);
  process.stdout.write(`IMP-006 UI run ${run}: laboratory=${laboratoryId}, area=${areaId}, collection=${collectionId}; preserved for review.\n`);
});

import { expect, test, type Page, type Response } from "@playwright/test";
import type { PublicDiagnosis } from "../../src/types/ihfr-diagnosis.type";
import {
  MissingContextualPostResponseError,
  recoverIhfrAfterMissingResponse,
  submitAndWaitForContextualPost,
} from "./support/imp006-ui-http";

const email = process.env.IMP006_UI_EMAIL!;
const password = process.env.IMP006_UI_PASSWORD!;
const run = process.env.IMP006_UI_RUN_ID!;
const responseTimeoutMs = 35_000;
const navigationTimeoutMs = 30_000;
const assertionTimeoutMs = 15_000;
const phaseBudgetsMs = {
  login: 60_000,
  laboratory: 60_000,
  area: 60_000,
  collection: 60_000,
  environmental: 90_000,
  "environmental-reload": 45_000,
  eligibility: 45_000,
  create: 60_000,
  "diagnosis-reload": 60_000,
  history: 45_000,
  replace: 60_000,
  revoke: 60_000,
} as const;
const uuidPattern = /^[0-9a-f-]{36}$/i;

function pathname(value: string) { return new URL(value).pathname; }

async function postResponse(page: Page, path: string, click: () => Promise<void>, status: number): Promise<Response> {
  const endpoint = new URL(path, page.url()).href;
  if (path.startsWith("/api/laboratories/")) {
    return submitAndWaitForContextualPost({ page, endpoint, expectedStatus: status, timeoutMs: responseTimeoutMs, submit: click });
  }
  const awaited = page.waitForResponse(
    response => response.request().method() === "POST" && response.url() === endpoint,
    { timeout: responseTimeoutMs },
  );
  const [response] = await Promise.all([awaited, click()]);
  expect(response.status(), `POST ${path}`).toBe(status);
  return response;
}

function responseId(value: unknown): string {
  expect(value).toMatch(uuidPattern);
  return value as string;
}

test("login creates laboratory, area, collection, measurement and IHFR through the UI", async ({ page }) => {
  test.setTimeout(360_000);
  page.setDefaultTimeout(20_000);
  page.setDefaultNavigationTimeout(navigationTimeoutMs);
  const labName = `${run} Laboratório`;
  const areaName = `${run} Área`;
  const errors: string[] = [];
  const postKeys = new Map<string, string>();
  const requestStarted = new WeakMap<object, number>();
  const phase = async <T>(name: keyof typeof phaseBudgetsMs, work: () => Promise<T>): Promise<T> => test.step(name, async () => {
    const started = Date.now();
    process.stdout.write(`IMP006_UI_PHASE name=${name} state=START\n`);
    try {
      const value = await work();
      process.stdout.write(`IMP006_UI_PHASE name=${name} state=PASS duration_ms=${Date.now() - started}\n`);
      return value;
    } catch (error) {
      process.stdout.write(`IMP006_UI_PHASE name=${name} state=FAIL duration_ms=${Date.now() - started} error=${error instanceof Error ? error.name : "unknown"}\n`);
      throw error;
    }
  }, { timeout: phaseBudgetsMs[name] });
  const observeUi = async (name: string, work: () => Promise<void>) => {
    const started = Date.now();
    try {
      await work();
      process.stdout.write(`IMP006_UI_RENDER name=${name} state=PASS duration_ms=${Date.now() - started}\n`);
    } catch (error) {
      process.stdout.write(`IMP006_UI_RENDER name=${name} state=FAIL duration_ms=${Date.now() - started} error=${error instanceof Error ? error.name : "unknown"}\n`);
      throw error;
    }
  };
  page.on("pageerror", error => { errors.push(error.name); process.stdout.write(`IMP006_UI_PAGEERROR kind=${error.name}\n`); });
  page.on("console", message => { if (message.type() === "error") process.stdout.write("IMP006_UI_CONSOLE_ERROR count=1\n"); });
  page.on("request", request => {
    const path = pathname(request.url());
    if (!path.startsWith("/api/laboratories/") && path !== "/api/laboratories" && path !== "/api/auth/sign-in") return;
    requestStarted.set(request, Date.now());
    if (request.method() === "POST" && path.includes("/ihfr-diagnosis/")) {
      const key = request.headers()["idempotency-key"];
      if (key) postKeys.set(path, key); // Kept only in memory for read-only recovery.
    }
  });
  page.on("response", response => {
    const path = pathname(response.url());
    if (!path.startsWith("/api/laboratories/") && path !== "/api/laboratories" && path !== "/api/auth/sign-in") return;
    const started = requestStarted.get(response.request());
    process.stdout.write(`IMP006_UI_HTTP method=${response.request().method()} path=${path} status=${response.status()} duration_ms=${started === undefined ? "unknown" : Date.now() - started}\n`);
  });
  page.on("requestfailed", request => {
    const path = pathname(request.url());
    if (path.startsWith("/api/laboratories/") || path === "/api/laboratories" || path === "/api/auth/sign-in") {
      process.stdout.write(`IMP006_UI_REQUEST_FAILED method=${request.method()} path=${path}\n`);
    }
  });

  await phase("login", async () => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(password);
    const signedIn = await postResponse(page, "/api/auth/sign-in", () => page.getByRole("button", { name: "ENTRAR" }).click(), 200);
    expect((await signedIn.json() as { destination?: string }).destination).toBe("/workspace");
    await expect(page).toHaveURL(/\/workspace$/, { timeout: navigationTimeoutMs });
  });
  let laboratoryId = "";
  const labCard = page.locator("li").filter({ hasText: labName }).first();
  await phase("laboratory", async () => {
    await page.getByLabel("Nome do laboratório").fill(labName);
    const created = await postResponse(page, "/api/laboratories", () => page.getByRole("button", { name: "Criar laboratório" }).click(), 201);
    laboratoryId = responseId((await created.json() as { laboratory?: { id?: unknown } }).laboratory?.id);
    await observeUi("laboratory-navigation", async () => {
      await expect(labCard).toBeVisible({ timeout: assertionTimeoutMs });
      await expect(labCard.getByRole("link", { name: "ACESSAR LABORATÓRIO" })).toHaveAttribute("href", `/dashboard/laboratories/${laboratoryId}`);
      await labCard.getByRole("link", { name: "ACESSAR LABORATÓRIO" }).click();
      await expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}$`), { timeout: navigationTimeoutMs });
    });
  });

  let areaId = "";
  await phase("area", async () => {
    await page.getByLabel("Navegação principal").getByRole("link", { name: "Áreas" }).click();
    await page.getByRole("link", { name: "Nova área" }).click();
    await page.getByLabel("Nome da área").fill(areaName);
    await page.getByLabel("Latitude").fill("-3");
    await page.getByLabel("Longitude").fill("-38");
    const created = await postResponse(page, `/api/laboratories/${laboratoryId}/areas`, () => page.getByRole("button", { name: "Confirmar ponto e cadastrar" }).click(), 201);
    areaId = responseId((await created.json() as { area?: { id?: unknown } }).area?.id);
    expect(created.headers().location).toBe(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}`);
    await observeUi("area-navigation", () => expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}$`), { timeout: navigationTimeoutMs }));
  });

  let collectionId = "";
  await phase("collection", async () => {
    await page.getByRole("link", { name: "Registrar coleta" }).click();
    await page.getByLabel("Ocorrência em campo").fill("2026-09-20T12:00:00-03:00");
    await page.getByRole("button", { name: "Revisar coleta" }).click();
    const path = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections`;
    const created = await postResponse(page, path, () => page.getByRole("button", { name: "Confirmar coleta" }).click(), 201);
    collectionId = responseId((await created.json() as { collection?: { id?: unknown } }).collection?.id);
    expect(created.headers().location).toBe(`${path}/${collectionId}`);
    await observeUi("collection-navigation", async () => {
      await expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}$`), { timeout: navigationTimeoutMs });
      await expect(page.getByRole("link", { name: "Ver dados ambientais" })).toBeVisible({ timeout: assertionTimeoutMs });
    });
  });
  const collectionUrl = page.url();
  const diagnosisBase = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}/ihfr-diagnosis`;
  async function currentDiagnosis(): Promise<PublicDiagnosis | null> {
    const response = await page.request.get(`${diagnosisBase}/current`);
    expect(response.status()).toBe(200);
    return (await response.json() as { diagnosis: PublicDiagnosis | null }).diagnosis;
  }

  await phase("environmental", async () => {
    await page.getByRole("link", { name: "Ver dados ambientais" }).click();
    await expect(page.getByText("Nenhum dado ambiental registrado")).toBeVisible({ timeout: assertionTimeoutMs });
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
    const path = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}/environmental-data`;
    const confirmed = await postResponse(page, path, () => page.getByRole("button", { name: "Confirmar dados ambientais" }).click(), 201);
    expect((await confirmed.json() as { environmentalData?: unknown }).environmentalData).toBeTruthy();
    expect(confirmed.headers().location).toBe(path);
    await observeUi("environmental-navigation", async () => {
      await expect(page).toHaveURL(new RegExp(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}/environmental-data$`), { timeout: navigationTimeoutMs });
      await expect(page.getByText(/Conjunto confirmado e imutável/)).toBeVisible({ timeout: assertionTimeoutMs });
    });
  });
  await phase("environmental-reload", async () => {
    await page.reload();
    await expect(page.getByText(/Conjunto confirmado e imutável/)).toBeVisible({ timeout: assertionTimeoutMs });
    await page.getByRole("link", { name: "Voltar à coleta" }).click();
  });

  await phase("eligibility", async () => {
    await page.getByLabel("Uso predominante da terra").selectOption("FOREST");
    await page.getByLabel("Origem da observação").selectOption("FIELD_OBSERVATION");
    await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
    await page.getByRole("button", { name: "Verificar elegibilidade" }).click();
    await expect(page.getByRole("status").filter({ hasText: "ELIGIBLE" })).toBeVisible({ timeout: assertionTimeoutMs });
  });
  let firstDiagnosisId = "";
  await phase("create", async () => {
    await page.getByRole("button", { name: "Criar diagnóstico" }).click();
    const created = await postResponse(page, `${diagnosisBase}/diagnoses`, () => page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click(), 201);
    const payload = await created.json() as { diagnosis: PublicDiagnosis | null; outcome: string };
    expect(payload.outcome).toBe("SUCCEEDED");
    firstDiagnosisId = responseId(payload.diagnosis?.id);
  });
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
  const summary = page.getByRole("region", { name: "Diagnóstico IHFR experimental", exact: true });
  await phase("diagnosis-reload", async () => {
    expectInitialVector(await currentDiagnosis());
    await expect(summary).toContainText("0.29 · MODERATE", { timeout: assertionTimeoutMs });
    await expect(summary).toContainText("HIGH");
    for (const value of ["ihfr-measurement-v1", "ihfr-diagnosis-input-experimental-v0.1.0", "CURRENT", "CONTRATO_EXPERIMENTAL", "VALIDACAO_CIENTIFICA_PENDENTE", "SUJEITO_A_RECALIBRACAO", "NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO"]) await expect(summary).toContainText(value);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.reload();
    await expect(summary).toContainText("0.29 · MODERATE", { timeout: assertionTimeoutMs });
    expectInitialVector(await currentDiagnosis());
  });

  await phase("history", async () => {
    await page.getByRole("link", { name: "Resumo" }).click();
    await page.getByRole("region", { name: "Histórico" }).getByRole("link", { name: /Coleta confirmada/ }).first().click();
    await expect(page).toHaveURL(collectionUrl, { timeout: navigationTimeoutMs });
    await expect(summary).toContainText("0.29 · MODERATE", { timeout: assertionTimeoutMs });
    expectInitialVector(await currentDiagnosis());
  });
  let secondDiagnosisId = "";
  await phase("replace", async () => {
    await page.getByLabel("Uso predominante da terra").selectOption("URBAN");
    await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
    await page.getByRole("button", { name: "Substituir diagnóstico" }).click();
    const replaced = await postResponse(page, `${diagnosisBase}/diagnoses`, () => page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click(), 201);
    const payload = await replaced.json() as { diagnosis: PublicDiagnosis | null; outcome: string };
    expect(payload.outcome).toBe("SUCCEEDED");
    secondDiagnosisId = responseId(payload.diagnosis?.id);
    expect(secondDiagnosisId).not.toBe(firstDiagnosisId);
    await expect(summary).toContainText("0.35 · MODERATE", { timeout: assertionTimeoutMs });
    expect(await currentDiagnosis()).toMatchObject({ id: secondDiagnosisId, lifecycleState: "CURRENT" });
    const prior = await page.request.get(`${diagnosisBase}/diagnoses/${firstDiagnosisId}`);
    expect(prior.status()).toBe(200);
    expect((await prior.json()).diagnosis.lifecycleState).toBe("SUPERSEDED");
  });

  await phase("revoke", async () => {
    await page.getByLabel("Motivo da revogação").fill("Verificação E2E do ciclo experimental");
    await page.getByRole("button", { name: "Revogar diagnóstico" }).click();
    const path = `${diagnosisBase}/diagnoses/${secondDiagnosisId}/revocations`;
    let revoked: Response;
    try {
      revoked = await postResponse(page, path, () => page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click(), 200);
    } catch (error) {
      if (error instanceof MissingContextualPostResponseError) {
        const key = postKeys.get(path);
        if (!key) process.stdout.write("IMP006_UI_RECOVERY operation_status=key-not-observed\n");
        else {
        try {
          const snapshot = await recoverIhfrAfterMissingResponse(error, page.request, diagnosisBase, key);
          const operation = snapshot.operation.body as { outcome?: string; diagnosis?: { lifecycleState?: string } } | null;
          const current = snapshot.current.body as { diagnosis?: { lifecycleState?: string } | null } | null;
          process.stdout.write(`IMP006_UI_RECOVERY operation_status=${snapshot.operation.status} outcome=${operation?.outcome ?? "unknown"} lifecycle=${operation?.diagnosis?.lifecycleState ?? "unknown"} current_status=${snapshot.current.status} current_lifecycle=${current?.diagnosis?.lifecycleState ?? "none"}\n`);
        } catch { process.stdout.write("IMP006_UI_RECOVERY operation_status=unavailable\n"); }
        }
      }
      throw error;
    }
    const payload = await revoked.json() as { diagnosis: PublicDiagnosis | null; outcome: string };
    expect(payload.outcome).toBe("SUCCEEDED");
    expect(payload.diagnosis?.id).toBe(secondDiagnosisId);
    await observeUi("revoke-visual-absence", () => expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible({ timeout: assertionTimeoutMs }));
    expect(await currentDiagnosis()).toBeNull();
    const priorCurrent = await page.request.get(`${diagnosisBase}/diagnoses/${secondDiagnosisId}`);
    expect(priorCurrent.status()).toBe(200);
    expect((await priorCurrent.json()).diagnosis.lifecycleState).toBe("REVOKED");
  });
  expect(errors).toEqual([]);
  process.stdout.write(`IMP-006 UI run ${run}: laboratory=${laboratoryId}, area=${areaId}, collection=${collectionId}; preserved for review.\n`);
});

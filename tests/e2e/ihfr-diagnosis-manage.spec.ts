import { fillCollectionOccurrence } from "./support/collection-occurrence";
import { expect, test, type Page } from "@playwright/test";
import { Client } from "pg";
import { signSessionToken } from "../../src/app/api/server/auth/session";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing isolated IMP-006 E2E fixture: ${name}`);
  return value;
};

async function authenticate(page: Page, actorId: string, baseURL: string) {
  await page.context().clearCookies();
  await page.context().addCookies([{ name: "auth_token", value: signSessionToken(actorId), url: baseURL }]);
}

async function operationRows(collectionUrl: string): Promise<number> {
  const schema = required("IMP006_TEST_SCHEMA");
  if (!/^imp006_test_[0-9a-f]{32}$/.test(schema)) throw new Error("IMP-006 E2E schema is not owned");
  const collectionId = collectionUrl.split("/").at(-1);
  if (!collectionId || !/^[0-9a-f-]{36}$/i.test(collectionId)) throw new Error("IMP-006 E2E collection is invalid");
  const client = new Client({ connectionString: required("TEST_DATABASE_URL") });
  await client.connect();
  try {
    await client.query(`SET search_path TO "${schema}"`);
    const selected = await client.query("SELECT current_schema() AS schema");
    if (selected.rows[0]?.schema !== schema) throw new Error("IMP-006 E2E schema isolation failed");
    const result = await client.query(`SELECT count(*)::int AS count FROM "IHFRDiagnosisOperation" WHERE "collectionDataId"=$1`, [collectionId]);
    return result.rows[0].count as number;
  } finally { await client.end(); }
}

async function confirmByKeyboard(page: Page, trigger: ReturnType<Page["getByRole"]>) {
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await dialog.getByRole("button", { name: "Confirmar" }).click();
}

test("collection, environmental confirmation and IHFR creation work without browser randomUUID", async ({ page }, info) => {
  test.setTimeout(120_000);
  const baseURL = String(info.project.use.baseURL);
  if (new URL(baseURL).hostname === "127.0.0.1") {
    await page.addInitScript(() => {
      Object.defineProperty(window.crypto, "randomUUID", { configurable: true, value: undefined });
    });
  }
  await authenticate(page, required("IMP006_E2E_OWNER_ID"), baseURL);
  const collectionNewUrl = required("IMP006_E2E_MANAGE_URL").replace(/\/collections\/[^/]+$/, "/collections/new");
  await page.goto(collectionNewUrl);
  expect(await page.evaluate(() => typeof crypto.randomUUID)).toBe("undefined");
  expect(await page.evaluate(() => typeof crypto.getRandomValues)).toBe("function");
  if (new URL(baseURL).hostname !== "127.0.0.1") expect(await page.evaluate(() => window.isSecureContext)).toBe(false);
  await fillCollectionOccurrence(page, "2026-09-24T09:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  const collectionPost = page.waitForResponse((response) => response.url().endsWith("/collections") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Confirmar coleta" }).click();
  const confirmedCollection = await collectionPost;
  expect(confirmedCollection.status()).toBe(201);
  expect(confirmedCollection.request().headers()["idempotency-key"]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  const collectionId = (await confirmedCollection.json()).collection.id as string;
  const collectionUrl = collectionNewUrl.replace(/\/new$/, `/${collectionId}`);
  await expect(page).toHaveURL(`${baseURL}${collectionUrl}`);

  await page.goto(`${collectionUrl}/environmental-data/new`);
  await expect(page.locator('[name="water.waterSourceType"]')).toHaveCount(1);
  for (const [field, value] of Object.entries({
    "water.waterSourceType": "RIVER_STREAM", "water.hasSpring": "false", "water.waterAvailability": "PERMANENT",
    "soil.soilTexture": "SANDY", "soil.compactionLevel": "LOW", "soil.erosionSigns": "NONE",
    "vegetation.fragmentationLevel": "LOW", "vegetation.landscapeDegradation": "LOW",
  })) await page.locator(`[name="${field}"]`).selectOption(value);
  for (const [field, value] of Object.entries({ "soil.infiltrationRateMmPerHour": "0", "vegetation.vegetationCoverPercent": "100", "terrain.drainageDensityKmPerKm2": "1.5", "terrain.elevationMeters": "180", "terrain.slopePercent": "45" })) await page.locator(`[name="${field}"]`).fill(value);
  await page.getByRole("button", { name: "Revisar dados" }).click();
  await expect(page.getByRole("heading", { name: "Revisar dados ambientais" })).toBeVisible();
  const environmentalPost = page.waitForResponse((response) => response.url().endsWith("/environmental-data") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Confirmar dados ambientais" }).click();
  const confirmedEnvironmental = await environmentalPost;
  expect(confirmedEnvironmental.status()).toBe(201);
  expect(confirmedEnvironmental.request().headers()["idempotency-key"]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  await expect(page).toHaveURL(`${baseURL}${collectionUrl}/environmental-data`);

  await page.goto(collectionUrl);
  await page.getByLabel("Uso predominante da terra").selectOption("FOREST");
  await page.getByLabel("Data e hora da observação").fill("2026-09-24T12:00");
  const eligibility = page.waitForResponse((response) => response.url().includes("/ihfr-diagnosis/eligibility") && response.request().method() === "GET");
  await page.getByRole("button", { name: "Verificar elegibilidade" }).click();
  const eligible = await eligibility;
  expect(eligible.status()).toBe(200);
  expect((await eligible.json()).outcome).toBe("ELIGIBLE");
  const created = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/diagnoses") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Criar diagnóstico" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  const response = await created;
  expect(response.status()).toBe(201);
  expect(response.request().headers()["idempotency-key"]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  await expect(page.getByRole("status").first()).toContainText("Vigente: sim");
  await expect(page.getByRole("status").last()).toBeFocused();
});

test("OWNER and contextual ADMIN create, replace, revoke and recover with one stable key", async ({ page }, info) => {
  test.setTimeout(90_000);
  const actors = [
    { id: required("IMP006_E2E_OWNER_ID"), url: required("IMP006_E2E_MANAGE_URL") },
    { id: required("IMP006_E2E_ADMIN_ID"), url: required("IMP006_E2E_ADMIN_MANAGE_URL") },
  ];
  for (const actor of actors) {
    await authenticate(page, actor.id, String(info.project.use.baseURL));
    await page.goto(actor.url);
    await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
    await page.getByLabel("Uso predominante da terra").selectOption("FOREST");
    await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
    await page.getByRole("button", { name: "Verificar elegibilidade" }).click();
    await expect(page.getByRole("status").first()).toContainText("ELIGIBLE");

    const create = page.getByRole("button", { name: "Criar diagnóstico" });
    const firstWrite = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/diagnoses") && response.request().method() === "POST");
    await confirmByKeyboard(page, create);
    const createdResponse = await firstWrite;
    expect(createdResponse.status()).toBe(201);
    const created = await createdResponse.json();
    expect(created.outcome).toBe("SUCCEEDED");
    await expect(page.getByRole("status").last()).toBeFocused();
    await expect(page.getByRole("status").first()).toContainText("Vigente: sim");
    await expect(page.getByRole("button", { name: "Substituir diagnóstico" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Revogar diagnóstico" })).toBeVisible();
    const createdKey = createdResponse.request().headers()["idempotency-key"];
    const recovered = await page.request.get(`${new URL(createdResponse.url()).origin}${new URL(createdResponse.url()).pathname.replace(/\/diagnoses$/, `/operations/${createdKey}`)}`);
    expect(recovered.status()).toBe(200);
    expect((await recovered.json()).diagnosis.id).toBe(created.diagnosis.id);

    const externalBody = { ...(createdResponse.request().postDataJSON() as Record<string, unknown>), mode: "REPLACE", expectedCurrentDiagnosisId: created.diagnosis.id,
      supplement: { ...((createdResponse.request().postDataJSON() as Record<string, unknown>).supplement as Record<string, unknown>), landUseType: "URBAN" } };
    const externalResponse = await page.request.post(createdResponse.url(), { headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, data: externalBody });
    expect(externalResponse.status()).toBe(201);
    const external = await externalResponse.json();
    const staleWrite = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/diagnoses") && response.request().method() === "POST");
    const refreshedCurrent = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/current") && response.request().method() === "GET");
    const refreshedEligibility = page.waitForResponse((response) => response.url().includes("/ihfr-diagnosis/eligibility") && response.request().method() === "GET");
    await page.getByRole("button", { name: "Substituir diagnóstico" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
    expect((await staleWrite).status()).toBe(409);
    expect((await (await refreshedCurrent).json()).diagnosis.id).toBe(external.diagnosis.id);
    expect((await (await refreshedEligibility).json()).currentDiagnosisId).toBe(external.diagnosis.id);
    await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toContainText("vigente mudou");
    await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toBeFocused();
    await expect(page.locator('section[aria-labelledby="ihfr-diagnosis-heading"]')).toContainText(String(external.diagnosis.displayScore));
    await expect(page.getByRole("status").first()).toContainText("Vigente: sim");

    let timedOutKey = "";
    await page.route("**/ihfr-diagnosis/diagnoses", (route) => {
      timedOutKey = route.request().headers()["idempotency-key"];
      void route.abort("timedout");
    }, { times: 1 });
    await page.getByRole("button", { name: "Substituir diagnóstico" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
    await expect(page.getByRole("button", { name: "Recuperar resultado" })).toBeVisible();
    await page.getByRole("button", { name: "Recuperar resultado" }).click();
    await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toContainText("mesma chave");
    await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toBeFocused();
    const repeated = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/diagnoses") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Repetir com a mesma chave" }).click();
    const replacement = await repeated;
    expect(replacement.status()).toBe(201);
    expect(replacement.request().headers()["idempotency-key"]).toBe(timedOutKey);
    await expect(page.getByRole("status").last()).toContainText("registrado");
    await expect(page.getByRole("status").last()).toBeFocused();
    await expect(page.getByRole("status").first()).toContainText("Vigente: sim");

    await page.getByLabel("Motivo da revogação").fill("Correção autorizada");
    const revoked = page.waitForResponse((response) => response.url().endsWith("/revocations") && response.request().method() === "POST");
    await confirmByKeyboard(page, page.getByRole("button", { name: "Revogar diagnóstico" }));
    expect((await revoked).status()).toBe(200);
    await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
    await expect(page.getByRole("status").last()).toBeFocused();
    await expect(page.getByRole("status").first()).toContainText("Vigente: não");
    await page.setViewportSize({ width: 320, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.setViewportSize({ width: 1280, height: 900 });
  }
});

test("MEMBER and linked OWNER in inactive laboratory have no management controls in the DOM", async ({ page }, info) => {
  for (const scenario of [
    { id: required("IMP006_E2E_MEMBER_ID"), url: required("IMP006_E2E_COLLECTION_URL") },
    { id: required("IMP006_E2E_OWNER_ID"), url: required("IMP006_E2E_INACTIVE_COLLECTION_URL") },
  ]) {
    await authenticate(page, scenario.id, String(info.project.use.baseURL));
    await page.goto(scenario.url);
    await expect(page.getByRole("button", { name: /criar diagnóstico|substituir diagnóstico|revogar diagnóstico/i })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Diagnóstico IHFR experimental" })).toBeVisible();
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);
  }
});

test("well-formed incompatible version reaches the real API and shows a recoverable terminal", async ({ page }, info) => {
  test.setTimeout(90_000);
  await authenticate(page, required("IMP006_E2E_OWNER_ID"), String(info.project.use.baseURL));
  const collectionUrl = required("IMP006_E2E_INCOMPATIBLE_URL");
  await page.goto(collectionUrl);
  await page.getByLabel("Uso predominante da terra").selectOption("FOREST");
  await page.getByLabel("Data e hora da observação").fill("2026-09-20T12:00");
  let sent: Record<string, unknown> | undefined;
  await page.route("**/ihfr-diagnosis/diagnoses", async (route) => {
    const original = route.request().postDataJSON() as Record<string, unknown>;
    sent = { ...original, versions: { ...(original.versions as Record<string, unknown>), mathContractVersion: "ihfr-math-experimental-v0.1.0" } };
    await route.continue({ postData: JSON.stringify(sent) });
  }, { times: 1 });
  const posted = page.waitForResponse((response) => response.url().endsWith("/ihfr-diagnosis/diagnoses") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Criar diagnóstico" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  const response = await posted;
  expect(response.status()).toBe(422);
  expect((await response.json()).error.code).toBe("INCOMPATIBLE_VERSION");
  await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toContainText("Versão incompatível");
  await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toBeFocused();
  await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
  const key = response.request().headers()["idempotency-key"];
  const endpoint = response.url();
  expect(await operationRows(collectionUrl)).toBe(1);
  expect(sent).toBeDefined();
  const replay = await page.request.post(endpoint, { headers: { "content-type": "application/json", "idempotency-key": key }, data: sent });
  expect(replay.status()).toBe(422);
  expect((await replay.json()).error.code).toBe("INCOMPATIBLE_VERSION");
  expect(await operationRows(collectionUrl)).toBe(1);
  const recovered = await page.request.get(endpoint.replace(/\/diagnoses$/, `/operations/${key}`));
  expect(recovered.status()).toBe(200);
  expect(await recovered.json()).toEqual({ outcome: "INCOMPATIBLE_VERSION", diagnosis: null, insufficiencyReasons: [] });
  for (const [status, code] of [[400, "INVALID_INPUT"], [500, "TECHNICAL_FAILURE"]] as const) {
    await page.route("**/ihfr-diagnosis/diagnoses", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error: { code, message: "Controlled E2E error" } }) }), { times: 1 });
    await page.getByRole("button", { name: "Criar diagnóstico" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
    await expect(page.locator('section[aria-labelledby="ihfr-management-heading"] [role="alert"]')).toBeFocused();
    if (status === 400) await expect(page.getByRole("button", { name: "Recuperar resultado" })).toHaveCount(0);
    else await expect(page.getByRole("button", { name: "Recuperar resultado" })).toBeVisible();
  }
});

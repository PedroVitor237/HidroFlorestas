import { expect, test, type BrowserContext, type TestInfo } from "@playwright/test";

import { signSessionToken } from "../../src/app/api/server/auth/session";
import {
  COLLECTION_FIXTURES,
  cleanupCollectionFixtures,
  countCollectionFixtures,
  createCollectionFixtureClient,
  setupCollectionFixtures,
} from "../fixtures/collections";

async function login(context: BrowserContext, info: TestInfo, userIndex = 0) {
  await context.addCookies([
    {
      name: "auth_token",
      value: signSessionToken(COLLECTION_FIXTURES.userIds[userIndex]),
      url: String(info.project.use.baseURL),
    },
  ]);
}

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);
test.beforeAll(async () => setupCollectionFixtures(process.env));
test.afterAll(async () => {
  await cleanupCollectionFixtures(process.env);
  expect(await countCollectionFixtures(process.env)).toEqual({
    users: 0,
    laboratories: 0,
    memberships: 0,
    areas: 0,
    collections: 0,
  });
});

test("US1 starts only from the explicit authorized area without persistence", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  for (const userIndex of [0, 1, 2]) {
    await test.step(`context role fixture ${userIndex}`, async () => {
      await login(context, info, userIndex);
      const response = await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(
        `/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`,
      );
      await expect(page.getByRole("heading", { name: "Registrar coleta" })).toBeVisible();
      const registration = page.getByRole("region", { name: "Registrar coleta" });
      await expect(registration).toContainText("IMP-004 E2E laboratory 0");
      await expect(registration).toContainText("IMP-004 E2E area 0");
    });
  }
  expect((await countCollectionFixtures(process.env)).collections).toBe(2);
});

test("US1 rejects crossed, missing, revoked, ineligible and inactive mutation contexts", async ({ page, context }, info) => {
  const [laboratoryId, inactiveLaboratoryId] = COLLECTION_FIXTURES.laboratoryIds;
  const [areaId, inactiveAreaId] = COLLECTION_FIXTURES.areaIds;
  await login(context, info, 0);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${inactiveAreaId}/collections/new`))?.status()).toBe(404);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/00000000-0000-4000-8000-000000000999/collections/new`))?.status()).toBe(404);
  await login(context, info, 3);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`))?.status()).toBe(404);

  const client = createCollectionFixtureClient(process.env.TEST_DATABASE_URL!);
  try {
    await client.researchersLinked.delete({
      where: { userId_laboratoryRoomId: { userId: COLLECTION_FIXTURES.userIds[2], laboratoryRoomId: laboratoryId } },
    });
    await login(context, info, 2);
    expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`))?.status()).toBe(404);
    await client.researchersLinked.create({ data: { userId: COLLECTION_FIXTURES.userIds[2], laboratoryRoomId: laboratoryId, role: "MEMBER" } });
    await client.user.update({ where: { id: COLLECTION_FIXTURES.userIds[2] }, data: { status: "BLOCKED" } });
    const blocked = await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
    expect(blocked?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Registrar coleta" })).toHaveCount(0);
    await client.user.update({ where: { id: COLLECTION_FIXTURES.userIds[2] }, data: { status: "ACTIVE" } });
  } finally {
    await client.$disconnect();
  }
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${inactiveLaboratoryId}/areas/${inactiveAreaId}/collections/new`);
  await expect(
    page.getByRole("region", { name: "Registrar coleta" }).getByText(/Laboratório inativo.*somente leitura/i),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /revisar/i })).toHaveCount(0);
});

test("US2 validates an explicit temporal offset in memory without POST", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  let postCount = 0;
  await page.route(`**/api/laboratories/${laboratoryId}/areas/${areaId}/collections`, async (route) => {
    if (route.request().method() === "POST") postCount += 1;
    await route.continue();
  });
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);

  const occurrence = page.getByLabel("Ocorrência em campo");
  const temporalError = page.locator("#occurredAt-error");
  await occurrence.focus();
  await page.keyboard.press("Enter");
  await expect(temporalError).toContainText(/data.*horário.*fuso/i);

  await occurrence.fill("2026-09-15 09:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(temporalError).toContainText(/RFC 3339|fuso/i);
  await expect(occurrence).toHaveValue("2026-09-15 09:00");

  await occurrence.fill("2099-09-15T09:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(temporalError).toContainText(/futuro/i);

  await occurrence.fill("2026-09-15T09:00:00.123-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await expect(page.getByRole("heading", { name: "Revisão" })).toBeVisible();
  await expect(page.getByText("2026-09-15T09:00:00.123-03:00", { exact: true })).toBeVisible();
  expect(postCount).toBe(0);
  expect((await countCollectionFixtures(process.env)).collections).toBe(2);
});

test("US3 reviews derived authorship and confirms once after a double click", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  let postCount = 0;
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith(`/api/laboratories/${laboratoryId}/areas/${areaId}/collections`)) {
      postCount += 1;
    }
  });
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
  await page.getByLabel("Ocorrência em campo").fill("2026-09-15T09:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  const review = page.getByRole("region", { name: "Revisão" });
  await expect(review.getByText("Será registrada por você", { exact: true })).toBeVisible();
  await expect(review.getByText(/person-0@|OWNER|ADMIN|MEMBER|userId/i)).toHaveCount(0);
  expect(postCount).toBe(0);
  const confirm = page.getByRole("button", { name: "Confirmar coleta" });
  const confirmationResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().endsWith(`/api/laboratories/${laboratoryId}/areas/${areaId}/collections`),
  );
  await confirm.dblclick();
  expect((await confirmationResponse).status()).toBe(201);
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/[0-9a-f-]{36}$`),
    { timeout: 15_000 },
  );
  expect(postCount).toBe(1);
  expect((await countCollectionFixtures(process.env)).collections).toBe(3);
});

test("US3 retries a failed confirmation with the same key and surfaces access loss", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  const keys: string[] = [];
  let attempt = 0;
  await page.route(`**/api/laboratories/${laboratoryId}/areas/${areaId}/collections`, async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    keys.push(route.request().headers()["idempotency-key"] ?? "");
    attempt += 1;
    if (attempt === 1) {
      await route.abort("timedout");
      return;
    }
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        error: {
          code: "NOT_FOUND",
          message: "Recurso não encontrado.",
        },
      }),
    });
  });
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`);
  await page.getByLabel("Ocorrência em campo").fill("2026-09-15T09:00:00-03:00");
  await page.getByRole("button", { name: "Revisar coleta" }).click();
  await page.getByRole("button", { name: "Confirmar coleta" }).click();
  const review = page.getByRole("region", { name: "Revisão" });
  await expect(review.getByRole("alert")).toContainText(/tente novamente/i);
  await page.getByRole("button", { name: /tentar novamente/i }).click();
  await expect(review.getByRole("alert")).toContainText(/acesso|não encontrado/i);
  assertKeysAreStable(keys);
});

test("US3 converges concurrent real POSTs and rejects a divergent replay", async ({ context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  const api = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections`;
  const key = "40000000-0000-4000-8000-000000000433";
  const before = (await countCollectionFixtures(process.env)).collections;
  await login(context, info, 0);
  const options = {
    headers: { "Idempotency-Key": key },
    data: { occurredAt: "2026-09-15T08:30:00-03:00" },
  };
  const responses = await Promise.all([
    context.request.post(api, options),
    context.request.post(api, options),
  ]);
  expect(responses.map((response) => response.status()).sort()).toEqual([200, 201]);
  const payloads = await Promise.all(responses.map((response) => response.json()));
  expect(payloads[0].collection.id).toBe(payloads[1].collection.id);
  expect((await countCollectionFixtures(process.env)).collections).toBe(before + 1);

  const conflict = await context.request.post(api, {
    headers: { "Idempotency-Key": key },
    data: { occurredAt: "2026-09-15T08:31:00-03:00" },
  });
  expect(conflict.status()).toBe(409);
  expect((await conflict.json()).error.code).toBe("CONFLICT");
  expect((await countCollectionFixtures(process.env)).collections).toBe(before + 1);
});

test("US4 reads a minimal immutable detail for current roles and inactive laboratories", async ({ page, context }, info) => {
  const [laboratoryId, inactiveLaboratoryId] = COLLECTION_FIXTURES.laboratoryIds;
  const [areaId, inactiveAreaId] = COLLECTION_FIXTURES.areaIds;
  const [collectionId, inactiveCollectionId] = COLLECTION_FIXTURES.collectionIds;
  for (const userIndex of [0, 1, 2]) {
    await login(context, info, userIndex);
    await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}`);
    await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toBeVisible();
    const detail = page.getByRole("article", { name: "Detalhe da coleta" });
    await expect(detail.getByText("2026-09-15T09:00:00.000-03:00", { exact: true })).toBeVisible();
    await expect(detail.getByText("2026-09-15T12:05:00.000Z", { exact: true })).toBeVisible();
    await expect(detail).not.toContainText(/userId|confirmationKey|observations|IHFR/i);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toBeVisible();
  }
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${inactiveLaboratoryId}/areas/${inactiveAreaId}/collections/${inactiveCollectionId}`);
  await expect(page.getByText(/somente leitura/i).last()).toBeVisible();
  await expect(page.getByRole("article", { name: "Detalhe da coleta" }).getByText("2026-09-15T15:00:00.000+01:30", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /editar|excluir/i })).toHaveCount(0);
});

test("US4 hides crossed, missing and revoked collection contexts", async ({ page, context }, info) => {
  const [laboratoryId, otherLaboratoryId] = COLLECTION_FIXTURES.laboratoryIds;
  const [areaId, otherAreaId] = COLLECTION_FIXTURES.areaIds;
  const collectionId = COLLECTION_FIXTURES.collectionIds[0];
  await login(context, info, 3);
  expect((await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}`))?.status()).toBe(404);
  await login(context, info, 0);
  await page.goto(`/dashboard/laboratories/${otherLaboratoryId}/areas/${otherAreaId}/collections/${collectionId}`);
  await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toHaveCount(0);
  expect((await context.request.get(`/api/laboratories/${otherLaboratoryId}/areas/${otherAreaId}/collections/${collectionId}`)).status()).toBe(404);
  const missing = "00000000-0000-4000-8000-000000000999";
  await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${missing}`);
  await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toHaveCount(0);
  expect((await context.request.get(`/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${missing}`)).status()).toBe(404);
});

test("US4 detail remains keyboard-usable across responsive viewports", async ({ page, context }, info) => {
  const laboratoryId = COLLECTION_FIXTURES.laboratoryIds[0];
  const areaId = COLLECTION_FIXTURES.areaIds[0];
  const collectionId = COLLECTION_FIXTURES.collectionIds[0];
  await login(context, info, 0);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}`);
    const detail = page.getByRole("article");
    await expect(detail).toBeVisible();
    expect((await detail.boundingBox())?.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe("BODY");
  }
});

test("US4 completes independent form-to-detail flows in two laboratory contexts", async ({ page, context }, info) => {
  const cases = [
    { userIndex: 0, laboratoryId: COLLECTION_FIXTURES.laboratoryIds[0], areaId: COLLECTION_FIXTURES.areaIds[0], occurredAt: "2026-09-15T07:00:00-03:00" },
    { userIndex: 3, laboratoryId: COLLECTION_FIXTURES.laboratoryIds[2], areaId: COLLECTION_FIXTURES.areaIds[2], occurredAt: "2026-09-15T06:00:00-03:00" },
  ];
  const before = (await countCollectionFixtures(process.env)).collections;
  for (const current of cases) {
    await login(context, info, current.userIndex);
    await page.goto(`/dashboard/laboratories/${current.laboratoryId}/areas/${current.areaId}/collections/new`);
    await page.getByLabel("Ocorrência em campo").fill(current.occurredAt);
    await page.getByRole("button", { name: "Revisar coleta" }).click();
    const responsePromise = page.waitForResponse((response) =>
      response.request().method() === "POST" && response.url().endsWith(`/api/laboratories/${current.laboratoryId}/areas/${current.areaId}/collections`),
    );
    await page.getByRole("button", { name: "Confirmar coleta" }).click();
    const response = await responsePromise;
    const payload = await response.json();
    expect(response.headers()["location"]).toBe(`/api/laboratories/${current.laboratoryId}/areas/${current.areaId}/collections/${payload.collection.id}`);
    await expect(page).toHaveURL(`/dashboard/laboratories/${current.laboratoryId}/areas/${current.areaId}/collections/${payload.collection.id}`);
    await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toBeVisible();
  }
  expect((await countCollectionFixtures(process.env)).collections).toBe(before + 2);
});

function assertKeysAreStable(keys: string[]) {
  expect(keys).toHaveLength(2);
  expect(keys[0]).not.toBe("");
  expect(keys[1]).toBe(keys[0]);
}

import { expect, test } from "@playwright/test";
import type { Page, Response } from "@playwright/test";

import { AUTH_FIXTURE_USERS } from "../fixtures/auth-users";

const password = process.env.E2E_USER_PASSWORD;
const protectedContentMarkers = [
  "Você ainda não participa de um laboratório.",
  "Atividade e Gerenciamento",
] as const;

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ mode: "serial" });

function sortedKeys(value: unknown): string[] {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).sort()
    : [];
}

async function expectSafePublicUserEnvelope(response: Response, signIn = false) {
  const body: unknown = await response.json();
  expect(sortedKeys(body)).toEqual(signIn ? ["destination", "success", "user"] : ["success", "user"]);
  if (signIn) {
    expect((body as { destination?: unknown }).destination).toBe("/workspace");
  }

  const user =
    body !== null && typeof body === "object" && "user" in body
      ? body.user
      : undefined;
  expect(sortedKeys(user)).toEqual(["firstName", "image", "lastName"]);

  const safeTypes =
    user !== null && typeof user === "object"
      ? {
          firstName: typeof (user as Record<string, unknown>).firstName,
          image: typeof (user as Record<string, unknown>).image,
          lastName: typeof (user as Record<string, unknown>).lastName,
        }
      : null;
  expect(safeTypes).toEqual({
    firstName: "string",
    image: "string",
    lastName: "string",
  });
}

async function expectUnauthenticatedRouteWithoutFlash(
  page: Page,
  observedMarkers: string[],
  path: "/workspace" | "/dashboard",
) {
  observedMarkers.length = 0;
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login$/);
  await page.waitForLoadState("networkidle");
  expect(observedMarkers, `${path} rendered protected content`).toEqual([]);
}

test.beforeEach(() => {
  if (!password) {
    throw new Error("E2E_USER_PASSWORD is required for authenticated access E2E");
  }
});

test("prevents protected-content flash on delayed unauthenticated navigation", async ({
  browser,
}) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const observedMarkers: string[] = [];

  await page.exposeFunction("recordProtectedContent", (marker: string) => {
    observedMarkers.push(marker);
  });
  await page.addInitScript((markers) => {
    const reported = new Set<string>();
    const inspect = () => {
      const visibleText = document.body?.innerText ?? "";
      for (const marker of markers) {
        if (visibleText.includes(marker) && !reported.has(marker)) {
          reported.add(marker);
          void (
            window as unknown as Window & {
              recordProtectedContent: (observedMarker: string) => Promise<void>;
            }
          ).recordProtectedContent(marker);
        }
      }
    };

    new MutationObserver(inspect).observe(document, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    document.addEventListener("DOMContentLoaded", inspect, { once: true });
  }, protectedContentMarkers);

  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400,
    downloadThroughput: 250_000,
    uploadThroughput: 125_000,
    connectionType: "cellular3g",
  });

  try {
    await expectUnauthenticatedRouteWithoutFlash(
      page,
      observedMarkers,
      "/workspace",
    );
    await expectUnauthenticatedRouteWithoutFlash(
      page,
      observedMarkers,
      "/dashboard",
    );
  } finally {
    await cdp.send("Network.disable");
    await context.close();
  }
});

test("validates the production HTTPS session lifecycle without exposing secrets", async ({
  page,
  context,
}) => {
  const issuedAfter = Math.floor(Date.now() / 1000);
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(AUTH_FIXTURE_USERS[0].email);
  await page.getByLabel("Senha", { exact: true }).fill(password!);

  const signInPromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/sign-in"),
  );
  await page.getByRole("button", { name: "ENTRAR" }).click();
  const signInResponse = await signInPromise;

  expect(signInResponse.status()).toBe(200);
  await expectSafePublicUserEnvelope(signInResponse, true);
  await expect(page).toHaveURL(/\/workspace$/);

  const authCookie = (await context.cookies()).find(
    (cookie) => cookie.name === "auth_token",
  );
  expect(Boolean(authCookie)).toBe(true);
  expect({
    httpOnly: authCookie?.httpOnly,
    path: authCookie?.path,
    sameSite: authCookie?.sameSite,
    secure: authCookie?.secure,
  }).toEqual({
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: true,
  });
  const lifetimeSeconds = Math.round((authCookie?.expires ?? 0) - issuedAfter);
  expect(lifetimeSeconds).toBeGreaterThanOrEqual(604_740);
  expect(lifetimeSeconds).toBeLessThanOrEqual(604_860);

  const mePromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/me"),
  );
  await page.reload();
  const meResponse = await mePromise;
  expect(meResponse.status()).toBe(200);
  expect(meResponse.headers()["cache-control"]).toBe("no-store");
  await expectSafePublicUserEnvelope(meResponse);
  await expect(page).toHaveURL(/\/workspace$/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/workspace$/);

  const logoutPromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/logout"),
  );
  await page.goto("/logout");
  const logoutResponse = await logoutPromise;
  expect(logoutResponse.status()).toBe(200);
  await expect(page).toHaveURL(/\/login$/);
  expect(
    (await context.cookies()).some((cookie) => cookie.name === "auth_token"),
  ).toBe(false);

  await page.goBack();
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto("/logout");
    await expect(page).toHaveURL(/\/login$/);
  }
});

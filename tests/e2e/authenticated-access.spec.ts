import { expect, test } from "@playwright/test";
import type { BrowserContext, TestInfo } from "@playwright/test";
import jwt from "jsonwebtoken";

import {
  AUTH_FIXTURE_USERS,
  runAuthFixtureCommand,
} from "../fixtures/auth-users";
import {
  readJwtSecret,
  signSessionToken,
} from "../../src/app/api/server/auth/session";

const password = process.env.E2E_USER_PASSWORD;

test.describe.configure({ mode: "serial" });

function configuredBaseUrl(testInfo: TestInfo): string {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string") {
    throw new Error("Playwright baseURL is required");
  }
  return baseURL;
}

async function setAuthCookie(
  context: BrowserContext,
  testInfo: TestInfo,
  value: string,
) {
  await context.addCookies([
    {
      name: "auth_token",
      value,
      url: configuredBaseUrl(testInfo),
    },
  ]);
}

test.describe("authenticated access", () => {
  test.beforeEach(() => {
    if (!password) {
      throw new Error("E2E_USER_PASSWORD is required for authenticated access E2E");
    }
  });

  test("rejects syntactically invalid input before credential lookup", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/sign-in", {
      data: { email: "invalid", password },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      code: "INVALID_REQUEST",
      message: "Informe um email e uma senha válidos.",
    });
  });

  test("rejects well-formed incorrect and ineligible credentials uniformly", async ({
    request,
  }) => {
    const attempts = [
      { email: AUTH_FIXTURE_USERS[0].email, password: `${password}-wrong` },
      ...AUTH_FIXTURE_USERS.slice(1).map((user) => ({
        email: user.email,
        password,
      })),
    ];

    for (const credentials of attempts) {
      const response = await request.post("/api/auth/sign-in", {
        data: credentials,
      });
      expect(response.status()).toBe(401);
      expect(await response.json()).toEqual({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Email ou senha inválidos.",
      });
      expect(response.headers()["set-cookie"]).toBeUndefined();
    }
  });

  test("logs an ACTIVE user into workspace with an exact public DTO and safe cookie", async ({
    page,
    context,
  }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(AUTH_FIXTURE_USERS[0].email);
    await page.getByLabel("Senha", { exact: true }).fill(password!);

    const responsePromise = page.waitForResponse(
      (response) => response.url().endsWith("/api/auth/sign-in"),
    );
    await page.getByRole("button", { name: "ENTRAR" }).click();
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      user: {
        firstName: AUTH_FIXTURE_USERS[0].firstName,
        lastName: AUTH_FIXTURE_USERS[0].lastName,
        image: AUTH_FIXTURE_USERS[0].image,
      },
    });
    await expect(page).toHaveURL(/\/workspace$/);

    const authCookie = (await context.cookies()).find(
      (cookie) => cookie.name === "auth_token",
    );
    expect(authCookie).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    expect(authCookie?.expires).toBeGreaterThan(Date.now() / 1000 + 600_000);
  });

  test("restores an ACTIVE session across reload and both private trees", async (
    { page, context },
    testInfo,
  ) => {
    await setAuthCookie(
      context,
      testInfo,
      signSessionToken(AUTH_FIXTURE_USERS[0].id, readJwtSecret()),
    );

    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/workspace$/);
    await page.reload();
    await expect(page).toHaveURL(/\/workspace$/);
    await expect(
      page.getByRole("heading", {
        name: `Olá, ${AUTH_FIXTURE_USERS[0].firstName}! 👋 Bem-vindo ao Ambiente de Análises HIDROFLORESTAS`,
        exact: true,
      }),
    ).toBeVisible();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("denies missing, malformed, tampered, expired, invalid-payload, and orphan sessions", async (
    { page, context },
    testInfo,
  ) => {
    const secret = readJwtSecret();
    const valid = signSessionToken(AUTH_FIXTURE_USERS[0].id, secret);
    const cases: Array<{ name: string; token?: string }> = [
      { name: "missing" },
      { name: "malformed", token: "not-a-jwt" },
      {
        name: "tampered",
        token: `${valid.slice(0, -1)}${valid.endsWith("a") ? "b" : "a"}`,
      },
      {
        name: "expired",
        token: jwt.sign({ userId: AUTH_FIXTURE_USERS[0].id, exp: 1 }, secret, {
          algorithm: "HS256",
        }),
      },
      {
        name: "invalid-payload",
        token: jwt.sign({ role: "ADMIN" }, secret, { algorithm: "HS256" }),
      },
      {
        name: "orphan",
        token: signSessionToken(
          "00000000-0000-4000-8000-000000000099",
          secret,
        ),
      },
    ];

    for (const sessionCase of cases) {
      await context.clearCookies();
      if (sessionCase.token) {
        await setAuthCookie(context, testInfo, sessionCase.token);
      }

      await page.goto("/workspace");
      await expect(page, sessionCase.name).toHaveURL(/\/login$/);
      await expect(page.getByRole("heading", { name: "FAÇA SEU LOGIN" })).toBeVisible();
    }
  });

  test("denies sessions for every user that is not ACTIVE", async (
    { page, context },
    testInfo,
  ) => {
    for (const user of AUTH_FIXTURE_USERS.slice(1)) {
      await setAuthCookie(
        context,
        testInfo,
        signSessionToken(user.id, readJwtSecret()),
      );
      await page.goto("/dashboard");
      await expect(page, user.status).toHaveURL(/\/login$/);
    }
  });

  test("expires an obsolete cookie through /me without exposing protected fields", async (
    { context },
    testInfo,
  ) => {
    await setAuthCookie(context, testInfo, "invalid-session");
    const response = await context.request.get("/api/auth/me");

    expect(response.status()).toBe(401);
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(await response.json()).toEqual({
      success: false,
      code: "UNAUTHENTICATED",
      message: "Não autenticado. Faça login novamente.",
    });
    expect((await context.cookies()).some((cookie) => cookie.name === "auth_token")).toBe(
      false,
    );
  });

  test("revokes protected access on the next validation after ACTIVE becomes BLOCKED", async (
    { page, context },
    testInfo,
  ) => {
    await setAuthCookie(
      context,
      testInfo,
      signSessionToken(AUTH_FIXTURE_USERS[0].id, readJwtSecret()),
    );
    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/workspace$/);

    try {
      await runAuthFixtureCommand("block-active", process.env);
      await page.reload();
      await expect(page).toHaveURL(/\/login$/);
    } finally {
      await runAuthFixtureCommand("restore-active", process.env);
    }
  });

  test("logout prevents back, reload, and direct access to both private trees", async (
    { page, context },
    testInfo,
  ) => {
    await setAuthCookie(
      context,
      testInfo,
      signSessionToken(AUTH_FIXTURE_USERS[0].id, readJwtSecret()),
    );
    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/workspace$/);

    await page.goto("/logout");
    await expect(page).toHaveURL(/\/login$/);
    expect((await context.cookies()).some((cookie) => cookie.name === "auth_token")).toBe(
      false,
    );

    await page.goBack();
    await expect(page).toHaveURL(/\/login$/);
    await page.reload();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/workspace");
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("repeated logout without a session remains stable", async ({ page, context }) => {
    await context.clearCookies();

    for (let attempt = 0; attempt < 2; attempt += 1) {
      await page.goto("/logout");
      await expect(page).toHaveURL(/\/login$/);
      expect(
        (await context.cookies()).some((cookie) => cookie.name === "auth_token"),
      ).toBe(false);
    }
  });
});

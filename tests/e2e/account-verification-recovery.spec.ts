import { expect, test, type Page } from "@playwright/test";
import { AccountMailHarness, type SyntheticAccountMail } from "../fixtures/account-mail-harness";

// Gate A only: local synthetic transport; these tests never prove remote Gmail delivery.
test.use({ trace: "off", screenshot: "off", video: "off" });
const publicUser = { firstName: "Conta", lastName: "Teste", image: "" };
const challengeId = "00000000-0000-4000-8000-000000000012";
async function clearSensitiveInputs(page: Page) {
  if (page.isClosed()) return;
  await page.locator('input[type="password"], input[autocomplete="one-time-code"], input[autocomplete="new-password"], input[autocomplete="current-password"]').evaluateAll(inputs => {
    for (const input of inputs) if (input instanceof HTMLInputElement) { input.value = ""; input.removeAttribute("value"); }
  }).catch(() => { /* A closing page has no later DOM snapshot. */ });
}
test.afterEach(async ({ page }) => { await clearSensitiveInputs(page); });

test.describe("account forms and privacy", () => {
  test("verification preserves a zero prefix, announces errors, and obeys server cooldown", async ({ page }) => {
    await page.clock.install();
    let attempts = 5, observedCode = "";
    const state = () => ({ success: true, status: "PENDING", challengeId, expiresAt: new Date(Date.now() + 900_000).toISOString(), resendAvailableAt: new Date(Date.now() + 60_000).toISOString(), attemptsRemaining: attempts });
    await page.route("**/api/auth/email-verification", route => route.fulfill({ json: state() }));
    await page.route("**/api/auth/email-verification/confirm", route => {
      observedCode = route.request().postDataJSON().code;
      attempts = 4;
      return route.fulfill({ status: 400, json: { success: false, code: "INVALID_PROOF", message: "Código inválido. Confira o código mais recente." } });
    });
    await page.route("**/api/auth/email-verification/resend", route => route.fulfill({ status: 429, json: { success: false, code: "RATE_LIMITED", message: "Aguarde antes de reenviar.", retryAfterSeconds: 90 } }));
    await page.goto("/verify-email");
    await page.getByLabel("Código de verificação").fill("000042");
    await page.getByRole("button", { name: "Confirmar e-mail" }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("Código inválido");
    await expect(page.locator('p[role="alert"]')).toBeFocused();
    expect(observedCode === "000042").toBe(true);
    await expect(page.getByRole("button", { name: /Reenviar código/ })).toBeDisabled();
    await page.clock.fastForward(65_000);
    await page.getByRole("button", { name: "Reenviar código", exact: true }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("Aguarde");
    await expect(page.getByRole("button", { name: /Reenviar código em/ })).toBeDisabled();
  });

  test("expired verification offers a resend and a lost session offers legitimate login", async ({ page }) => {
    await page.route("**/api/auth/email-verification", route => route.fulfill({ json: { success: true, status: "PENDING", challengeId, expiresAt: new Date(Date.now() - 1000).toISOString(), resendAvailableAt: null, attemptsRemaining: 0 } }));
    await page.goto("/verify-email");
    await expect(page.getByText("O código expirou. Solicite um novo para continuar.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmar e-mail" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Reenviar código", exact: true })).toBeEnabled();
    await page.unroute("**/api/auth/email-verification");
    await page.route("**/api/auth/email-verification", route => route.fulfill({ status: 401, json: { success: false, code: "UNAUTHENTICATED", message: "Faça login para retomar." } }));
    await page.reload();
    await expect(page.getByRole("link", { name: "Ir para o login" })).toBeVisible();
  });

  test("reset removes the fragment, preserves the proof on GET, and recovers after reload", async ({ page }) => {
    let posts = 0;
    await page.route("**/api/auth/password-reset/confirm", route => { posts++; return route.fulfill({ json: { success: true, message: "Senha redefinida. Faça login novamente." } }); });
    await page.goto(`/reset-password#token=${"a".repeat(43)}`);
    await expect(page.getByLabel("Nova senha", { exact: true })).toBeVisible();
    expect(new URL(page.url()).hash.length).toBe(0);
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
    await page.getByLabel("Nova senha", { exact: true }).fill("Uma frase de teste segura");
    await page.getByLabel("Confirmar nova senha", { exact: true }).fill("Outra frase de teste segura");
    await page.getByRole("button", { name: "Redefinir senha", exact: true }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("confirmação");
    expect(posts).toBe(0);
    await page.reload();
    await expect(page.getByText(/Reabra o link original/)).toBeVisible();
    expect(posts).toBe(0);
    expect(await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length)).toBe(0);
  });

  test("forgot password works by keyboard on mobile and displays a neutral response", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route("**/api/auth/password-reset/request", route => route.fulfill({ status: 202, json: { success: true, message: "Se a conta puder receber a mensagem, confira seu e-mail." } }));
    await page.goto("/login");
    await page.getByRole("link", { name: "Esqueceu sua senha?" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByLabel("E-mail", { exact: true }).fill("unknown@accounts-test.hidroflorestas.invalid");
    await page.getByLabel("E-mail", { exact: true }).press("Enter");
    await expect(page.getByRole("status")).toContainText("Se a conta puder receber");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("a new reset fragment in an existing tab is removed and clears the previous form without consuming it", async ({ page }) => {
    let posts = 0;
    await page.route("**/api/auth/password-reset/confirm", route => { posts++; return route.fulfill({ json: { success: true, message: "Senha redefinida. Faça login novamente." } }); });
    await page.goto(`/reset-password#token=${"a".repeat(43)}`);
    await page.getByLabel("Nova senha", { exact: true }).fill("Uma frase de teste segura");
    await page.getByLabel("Confirmar nova senha", { exact: true }).fill("Outra frase de teste segura");
    await page.getByRole("button", { name: "Redefinir senha", exact: true }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("confirmação");
    await page.evaluate(() => { window.location.hash = `token=${"b".repeat(43)}`; });
    await expect(page.getByLabel("Nova senha", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Confirmar nova senha", { exact: true })).toHaveValue("");
    await expect(page.locator('p[role="alert"]')).toHaveCount(0);
    expect(new URL(page.url()).hash.length).toBe(0);
    expect(posts).toBe(0);
    expect(await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length)).toBe(0);
  });
});

test.describe("browser account journeys with a deterministic outbox transport", () => {
  test.skip(process.env.ACCOUNTS_LOCAL_POSTGRESQL !== "1", "The synthetic mail adapter requires the owned account regression runner.");
  test.describe.configure({ mode: "serial", timeout: 90_000 });
  let mail: AccountMailHarness;
  const emails: string[] = [];
  const plannedEmails = (process.env.ACCOUNT_E2E_EMAILS ?? "").split(",");
  const password = process.env.E2E_USER_PASSWORD ?? "";
  const newPassword = `${password}-new`;
  test.beforeAll(async () => {
    if (plannedEmails.length !== 2 || new Set(plannedEmails).size !== 2 || plannedEmails.some(email => !/^account-e2e-[a-z0-9-]+@accounts-test\.hidroflorestas\.invalid$/.test(email))) throw new Error("Owned account runner did not provide two exact synthetic mailboxes.");
    mail = await AccountMailHarness.start();
  });
  test.afterAll(async () => {
    if (mail) {
      try {
        // A failed assertion may leave its synthetic password-change notice queued.
        // Consume it through the same guarded transport before exact fixture cleanup.
        for (let batch = 0; batch < 5; batch++) if ((await mail.process()).metrics.pending === 0) break;
        await mail.cleanup(emails);
      } finally { await mail.close(); }
    }
  });

  async function received(recipient: string, subject: RegExp): Promise<SyntheticAccountMail> {
    let found: SyntheticAccountMail | undefined;
    for (let batch = 0; batch < 5 && !found; batch++) {
      const result = await mail.process();
      found = result.received.find(message => message.recipient === recipient && subject.test(message.subject));
      if (result.metrics.pending === 0 && !found) throw new Error(`Synthetic account mail was not received: ${JSON.stringify({ ...result.metrics, receivedCount: result.received.length, recipientMatched: result.received.some(message => message.recipient === recipient), subjectMatched: result.received.some(message => subject.test(message.subject)) })}; contents omitted.`);
    }
    if (!found) throw new Error("Expected synthetic account message was not received by the test transport.");
    return found;
  }

  async function login(page: Page, email: string, value: string) {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("E-mail", { exact: true }).fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(value);
    await page.getByRole("button", { name: "ENTRAR", exact: true }).click();
  }

  async function register(page: Page) {
    const email = plannedEmails[emails.length];
    if (!email) throw new Error("Synthetic account fixture exhausted its exact mailboxes.");
    emails.push(email);
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Nome", { exact: true }).fill(publicUser.firstName);
    await page.getByLabel("Sobrenome", { exact: true }).fill(publicUser.lastName);
    await page.getByLabel("E-mail", { exact: true }).fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(password);
    const completed = page.waitForResponse(response => response.url().endsWith("/api/auth/sign-up") && response.request().method() === "POST");
    await page.getByRole("button", { name: "CRIAR CONTA", exact: true }).click();
    const response = await completed;
    if (!response.ok()) {
      const headers = await response.request().allHeaders();
      const origin = headers.origin === undefined ? "absent" : headers.origin === "null" ? "null" : headers.origin === new URL(page.url()).origin ? "same-origin" : "different-origin";
      throw new Error(`Synthetic sign-up failed: status=${response.status()}, origin=${origin}, fetchSite=${headers["sec-fetch-site"] ?? "absent"}; request contents omitted.`);
    }
    await expect(page).toHaveURL(/\/verify-email$/);
    return email;
  }

  async function verify(page: Page, email: string) {
    const message = await received(email, /Confirme seu e-mail/);
    const code = /código de verificação é:\s*([0-9]{6})/.exec(message.text)?.[1];
    if (!code) throw new Error("Synthetic verification message did not contain a six-digit code.");
    await page.getByLabel("Código de verificação").fill(code);
    await page.getByRole("button", { name: "Confirmar e-mail" }).click();
    await expect(page).toHaveURL(/\/workspace$/);
  }

  async function openReset(page: Page, email: string) {
    const message = await received(email, /Recupere sua senha/);
    const link = /https:\/\/[^\s]+\/reset-password#token=[A-Za-z0-9_-]{43}/.exec(message.text)?.[0];
    if (!link) throw new Error("Synthetic reset message did not contain its expected link.");
    const url = new URL(link);
    // Local HTTP Gate A uses the same path/fragment under the owned browser origin.
    try { await page.goto(`${url.pathname}${url.hash}`); } catch { throw new Error("Could not open the synthetic reset page; proof details omitted."); }
    await expect(page.getByLabel("Nova senha", { exact: true })).toBeVisible();
    expect(new URL(page.url()).hash.length).toBe(0);
    return url.hash;
  }

  async function submitPassword(page: Page, value: string) {
    await page.getByLabel("Nova senha", { exact: true }).fill(value);
    await page.getByLabel("Confirmar nova senha", { exact: true }).fill(value);
    await page.getByRole("button", { name: "Redefinir senha", exact: true }).click();
    await expect(page.getByRole("link", { name: "Entrar com a nova senha" })).toBeVisible();
  }

  test("registers, verifies from received mail, logs out, resumes, and revokes another browser after reset", async ({ page, browser }) => {
    const email = await register(page);
    expect((await page.request.get("/api/laboratories")).status()).toBe(401);
    await page.reload();
    await expect(page.getByLabel("Código de verificação")).toBeVisible();
    await page.getByRole("button", { name: "Sair", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await login(page, email, password);
    await expect(page).toHaveURL(/\/verify-email$/);
    await verify(page, email);
    await expect(page.getByText(/Nenhum laboratório|Criar laboratório/).first()).toBeVisible();
    await page.getByRole("link", { name: "Sair", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await login(page, email, password);
    await expect(page).toHaveURL(/\/workspace$/);
    const other = await browser.newContext({ baseURL: test.info().project.use.baseURL });
    let recovery: Page | undefined;
    try {
      recovery = await other.newPage();
      await recovery.goto("/forgot-password");
      await recovery.waitForLoadState("networkidle");
      await recovery.getByLabel("E-mail", { exact: true }).fill(email);
      await recovery.getByRole("button", { name: "Solicitar link de recuperação" }).click();
      await expect(recovery.getByRole("status")).toContainText("Se a conta puder receber");
      const fragment = await openReset(recovery, email);
      await submitPassword(recovery, newPassword);
      expect((await page.request.get("/api/auth/me")).status()).toBe(401);
      await login(page, email, password);
      await expect(page.locator('p[role="alert"]')).toContainText("inválidos");
      await login(page, email, newPassword);
      await expect(page).toHaveURL(/\/workspace$/);
      // Reopen from another page, as an email link does; changing only the
      // fragment on the success page would be same-document navigation.
      await recovery.goto("/login");
      try { await recovery.goto(`/reset-password${fragment}`); } catch { throw new Error("Could not reopen the synthetic reset page; proof details omitted."); }
      await recovery.getByLabel("Nova senha", { exact: true }).fill(`${newPassword}-unused`);
      await recovery.getByLabel("Confirmar nova senha", { exact: true }).fill(`${newPassword}-unused`);
      await recovery.getByRole("button", { name: "Redefinir senha", exact: true }).click();
      await expect(recovery.getByRole("link", { name: "Solicitar novo link" })).toBeVisible();
      await received(email, /senha.*alterada|senha.*atualizada/i);
      await page.getByRole("link", { name: "Alterar senha", exact: true }).click();
      await page.getByLabel("Senha atual", { exact: true }).fill(newPassword);
      await page.getByLabel("Nova senha", { exact: true }).fill(password);
      await page.getByLabel("Confirmar nova senha", { exact: true }).fill(password);
      await page.getByRole("button", { name: "Alterar senha", exact: true }).click();
      await expect(page).toHaveURL(/\/login$/);
      expect((await page.request.get("/api/auth/me")).status()).toBe(401);
      await received(email, /senha.*alterada|senha.*atualizada/i);
    } finally {
      if (recovery) await clearSensitiveInputs(recovery);
      await other.close().catch(() => { /* Playwright may have closed it after a test timeout. */ });
    }
  });

  test("an ACTIVE unverified account can reset and then returns to verification", async ({ page }) => {
    const email = await register(page);
    await received(email, /Confirme seu e-mail/);
    await page.goto("/forgot-password");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("E-mail", { exact: true }).fill(email);
    await page.getByRole("button", { name: "Solicitar link de recuperação" }).click();
    await expect(page.getByRole("status")).toContainText("Se a conta puder receber");
    await openReset(page, email);
    await submitPassword(page, newPassword);
    await received(email, /senha.*alterada|senha.*atualizada/i);
    await login(page, email, newPassword);
    await expect(page).toHaveURL(/\/verify-email$/);
    expect((await page.request.get("/api/auth/me")).status()).toBe(401);
  });
});

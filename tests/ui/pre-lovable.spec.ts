import { test, expect, type Page } from "@playwright/test";
import { build } from "esbuild";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { readFile } from "node:fs/promises";
import path from "node:path";

let bundle: string;
let css: string;
const navigation = `
import { useSyncExternalStore } from 'react';
const subscribe = cb => { addEventListener('popstate', cb); return () => removeEventListener('popstate', cb); };
export function usePathname() { return useSyncExternalStore(subscribe, () => location.pathname); }
const navigate = href => { history.pushState({}, '', href); dispatchEvent(new PopStateEvent('popstate')); };
export function useRouter() { return { push: navigate, replace: navigate, refresh() {} }; }
`;

test.beforeAll(async () => {
  const result = await build({
    entryPoints: ["tests/ui/harness.tsx"], bundle: true, write: false, format: "iife", jsx: "automatic",
    loader: { ".png": "dataurl" }, define: { "process.env.NODE_ENV": '"development"' },
    plugins: [{ name: "offline-next", setup(builder) {
      builder.onResolve({ filter: /^next\/(navigation|link|image)$/ }, args => ({ path: args.path, namespace: "offline-next" }));
      builder.onLoad({ filter: /.*/, namespace: "offline-next" }, args => ({ loader: "tsx", resolveDir: process.cwd(), contents:
        args.path === "next/navigation" ? navigation : args.path === "next/link" ? `
import React from 'react';
export default function Link({href,children,...props}) { return <a href={href} {...props} onClick={e=>{ e.preventDefault(); history.pushState({},'',href); dispatchEvent(new PopStateEvent('popstate')); }}>{children}</a>; }
` : `import React from 'react'; export default function Image({priority,fill,...props}) { return <img {...props} />; }` }));
    } }],
  });
  bundle = result.outputFiles[0].text;
  const stylesheet = await readFile("src/app/globals.css", "utf8");
  css = (await postcss([tailwind()]).process(stylesheet, { from: path.resolve("src/app/globals.css") })).css;
});

async function open(page: Page, view: string) {
  await page.route("http://ui.test/**", async route => {
    const url = new URL(route.request().url());
    if (url.pathname === "/bundle.js") return route.fulfill({ contentType: "application/javascript", body: bundle });
    if (url.pathname === "/styles.css") return route.fulfill({ contentType: "text/css", body: css });
    if (url.pathname === "/api/auth/me") return route.fulfill({ json: { success: true, user: { firstName: "Teste", lastName: "UI", image: "" } } });
    if (url.pathname.startsWith("/api/")) return route.fulfill({ status: 500, json: { success: false, code: "INTERNAL_ERROR", message: "Falha simulada" } });
    return route.fulfill({ contentType: "text/html", body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>' });
  });
  await page.goto(`http://ui.test${view}`);
}

async function focusWithKeyboard(page: Page, target: ReturnType<Page["getByRole"]>) {
  for (let index = 0; index < 30; index++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate(node => node === document.activeElement)) return;
  }
  throw new Error("Control not reachable using Tab");
}

for (const width of [1280, 375]) {
  for (const view of ["/workspace", "/dashboard/laboratories/test", "/admin"]) {
    test(`logout keyboard, failure/retry and cleared UI: ${view} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await open(page, view);
      const exits = page.getByRole("link", { name: "Sair", exact: true }).filter({ visible: true });
      await expect(exits).toHaveCount(1);
      await expect(exits).toBeVisible();
      await expect(page.getByTestId("session")).toHaveText("Sessão ativa");
      await page.route("**/api/auth/logout", route => route.fulfill({ status: 500, json: { success: false, code: "INTERNAL_ERROR", message: "Falha simulada" } }));
      await focusWithKeyboard(page, exits);
      await page.keyboard.press("Enter");
      await expect(page.getByRole("alert")).toHaveText(/Falha simulada/);
      await expect(page.getByTestId("session")).toHaveText("Sessão ativa");
      await page.route("**/api/auth/logout", route => route.fulfill({ json: { success: true } }));
      const retry = page.getByRole("button", { name: "Tentar novamente" });
      await focusWithKeyboard(page, retry);
      await page.keyboard.press("Enter");
      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
      await expect(page.getByTestId("session")).toHaveText("Sem sessão");
    });
  }
}

for (const [zone, expectedLocal, offset] of [
  ["America/Fortaleza", "2026-10-01T09:00", "-03:00"],
  ["UTC", "2026-10-01T12:00", "+00:00"],
  ["Asia/Kathmandu", "2026-10-01T17:45", "+05:45"],
]) {
  test(`collection initial/edit/review/retry/send/read in ${zone}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: zone, hasTouch: true, viewport: { width: 375, height: 800 } });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date("2026-10-01T12:00:00.000Z"));
    await open(page, "/collection");
    const dateTime = page.getByLabel("Data e hora da coleta");
    await expect(dateTime).toHaveValue(expectedLocal);
    await expect(page.getByLabel("Offset UTC")).toHaveValue(offset);
    await dateTime.fill("2026-09-30T09:15:16.123");
    await focusWithKeyboard(page, page.getByRole("button", { name: "Revisar coleta" }));
    await page.keyboard.press("Enter");
    await expect(page.getByText(`30/09/2026 09:15:16.123 (UTC${offset})`)).toBeVisible();
    await page.getByRole("button", { name: "Voltar e corrigir" }).tap();
    await expect(dateTime).toHaveValue("2026-09-30T09:15:16.123");
    await page.getByRole("button", { name: "Revisar coleta" }).click();
    const attempts: { body: { occurredAt: string }; key: string | undefined }[] = [];
    await page.route("**/api/laboratories/**/collections", async route => {
      const request = route.request();
      const body = request.postDataJSON() as { occurredAt: string };
      attempts.push({ body, key: request.headers()["idempotency-key"] });
      if (attempts.length === 1) return route.abort("failed");
      await page.evaluate(value => sessionStorage.setItem("test-occurredAt", value), body.occurredAt);
      return route.fulfill({ status: 201, headers: { Location: `${new URL(request.url()).pathname}/00000000-0000-4000-8000-000000000431` }, json: { collection: { id: "00000000-0000-4000-8000-000000000431" } } });
    });
    await page.getByRole("button", { name: "Confirmar coleta" }).click();
    await expect(page.getByRole("alert")).toHaveText(/Tente novamente/);
    await page.getByRole("button", { name: "Tentar novamente" }).click();
    await expect(page.getByRole("heading", { name: "Detalhe da coleta" })).toBeVisible();
    await expect(page.getByText(`30/09/2026 09:15:16.123 (UTC${offset})`)).toBeVisible();
    expect(attempts).toHaveLength(2);
    expect(attempts[0]).toEqual(attempts[1]);
    expect(attempts[0].body).toEqual({ occurredAt: `2026-09-30T09:15:16.123${offset}` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await context.close();
  });
}

for (const [label, value] of [["Floresta", "FOREST"], ["Pastagem", "PASTURE"], ["Sistema agroflorestal (SAF)", "AGROFORESTRY"]]) {
  test(`Portuguese ${label} sends ${value}; visible touch/keyboard help`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await open(page, "/diagnosis");
    const select = page.getByLabel("Uso predominante da terra");
    await expect(select.locator("option")).toHaveText(["Indeterminado ou ausente", "Floresta", "Sistema agroflorestal (SAF)", "Agricultura", "Pastagem", "Pastagem degradada", "Solo exposto", "Área urbanizada"]);
    await focusWithKeyboard(page, select);
    await select.selectOption({ label });
    await expect(page.locator("#land-use-help")).toBeVisible();
    await expect(select).toHaveAttribute("aria-describedby", "land-use-help");
    await page.getByLabel("Data e hora da observação").fill("2026-09-30T09:00");
    let sent: { supplement?: { landUseType?: string } } | undefined;
    await page.route("**/ihfr-diagnosis/diagnoses", route => {
      sent = route.request().postDataJSON();
      return route.fulfill({ status: 422, json: { error: { code: "INCOMPATIBLE_VERSION" } } });
    });
    await page.getByRole("button", { name: "Criar diagnóstico" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
    await expect.poll(() => sent?.supplement?.landUseType).toBe(value);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "pre-lovable.spec.ts",
  workers: 1,
  timeout: 30_000,
  use: { headless: true, browserName: "chromium", launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {} },
  outputDir: "../../test-results/pre-lovable",
});

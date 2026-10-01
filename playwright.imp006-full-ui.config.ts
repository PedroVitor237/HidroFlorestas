import { defineConfig, devices } from "@playwright/test";

if (!process.env.PLAYWRIGHT_BASE_URL || !process.env.IMP006_UI_EMAIL || !process.env.IMP006_UI_PASSWORD || !process.env.IMP006_UI_RUN_ID) throw new Error("Owned IMP-006 full UI environment is required");

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "full-ui-flow.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL: process.env.PLAYWRIGHT_BASE_URL },
});

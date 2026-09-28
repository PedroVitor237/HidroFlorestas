import { defineConfig, devices } from "@playwright/test";

if (!process.env.PLAYWRIGHT_BASE_URL || !process.env.IMP006_TEST_SCHEMA || !process.env.JWT_SECRET) {
  throw new Error("IMP-006 isolated browser environment is required");
}

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "ihfr-diagnosis-*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL: process.env.PLAYWRIGHT_BASE_URL },
});

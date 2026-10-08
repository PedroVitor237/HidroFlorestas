import { defineConfig, devices } from "@playwright/test";
if (!process.env.PLAYWRIGHT_BASE_URL || !process.env.IMP006_TEST_SCHEMA || !process.env.DELETION_E2E_IDS) throw new Error("Owned deletion schema harness required");
export default defineConfig({ testDir: "./tests/e2e", testMatch: "account-deletion.spec.ts", fullyParallel: false, workers: 1, retries: 0, reporter: "list", use: { ...devices["Desktop Chrome"], baseURL: process.env.PLAYWRIGHT_BASE_URL, trace: "off", screenshot: "off", video: "off" } });

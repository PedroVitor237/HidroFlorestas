import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore:
    process.env.AUTH_HTTPS_E2E === "1"
      ? undefined
      : "**/authenticated-access-https.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        env: {
          ...process.env,
          DATABASE_URL: process.env.TEST_DATABASE_URL ?? "",
        },
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});

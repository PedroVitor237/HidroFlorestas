import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { validateAuthFixtureEnvironment } from "./tests/fixtures/auth-users";
import { withPublicSchema } from "./tests/fixtures/areas";
dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.test.local", quiet: true });
Object.assign(process.env, { NODE_ENV: "test" });
validateAuthFixtureEnvironment(process.env);

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore:
    process.env.AUTH_HTTPS_E2E === "1"
      ? "**/full-ui-flow.spec.ts"
      : ["**/authenticated-access-https.spec.ts", "**/full-ui-flow.spec.ts"],
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
          DATABASE_URL: withPublicSchema(process.env.TEST_DATABASE_URL ?? ""),
          NODE_ENV: "development",
        },
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});

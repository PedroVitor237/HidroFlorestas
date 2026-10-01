import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { validateAuthFixtureEnvironment } from "./tests/fixtures/auth-users";
import { withPublicSchema } from "./tests/fixtures/areas";
dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.test.local", quiet: true });
Object.assign(process.env, { NODE_ENV: "test" });
validateAuthFixtureEnvironment(process.env);

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const localRegression = process.env.IMP006_LOCAL_POSTGRESQL === "1";
if (localRegression) {
  const target = new URL(process.env.TEST_DATABASE_URL ?? "");
  const reference = new URL(process.env.DATABASE_URL ?? "");
  const browserTarget = new URL(baseURL);
  const https = process.env.AUTH_HTTPS_E2E === "1";
  if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" ||
      target.hostname !== "127.0.0.1" || target.port !== "55426" || target.pathname !== "/imp006_regression_v2_test" ||
      reference.hostname !== "127.0.0.1" || reference.port !== "55426" || reference.pathname !== "/imp006_regression_v2_reference" ||
      (process.env.AUTH_HTTPS_E2E !== undefined && !https) ||
      browserTarget.hostname !== "127.0.0.1" || browserTarget.protocol !== (https ? "https:" : "http:") ||
      browserTarget.username || browserTarget.password || browserTarget.pathname !== "/" || browserTarget.search || browserTarget.hash ||
      (!https && baseURL !== "http://127.0.0.1:3000") || (https && !process.env.PLAYWRIGHT_BASE_URL)) {
    throw new Error("Owned local regression database guard failed for the Playwright server");
  }
}
const serverEnvironment: Record<string, string> = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);
serverEnvironment.NODE_ENV = "development";
if (!process.env.PLAYWRIGHT_BASE_URL) serverEnvironment.DATABASE_URL = withPublicSchema(process.env.TEST_DATABASE_URL ?? "");
delete serverEnvironment.IMP006_LOCAL_REGRESSION_PUBLIC;
if (localRegression) serverEnvironment.IMP006_LOCAL_REGRESSION_PUBLIC = "1";

export default defineConfig({
  testDir: "./tests/e2e",
  // These specs have dedicated runners that provision their required fixtures.
  testIgnore:
    process.env.AUTH_HTTPS_E2E === "1"
      ? ["**/full-ui-flow.spec.ts", "**/ihfr-diagnosis-*.spec.ts"]
      : ["**/authenticated-access-https.spec.ts", "**/full-ui-flow.spec.ts", "**/ihfr-diagnosis-*.spec.ts"],
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
        command: "npm run dev -- --hostname 127.0.0.1",
        env: serverEnvironment,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});

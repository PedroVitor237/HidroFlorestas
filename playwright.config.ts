import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { validateAuthFixtureEnvironment } from "./tests/fixtures/auth-users";
import { withPublicSchema } from "./tests/fixtures/areas";
import { localPostgresqlContext } from "./src/app/api/server/lib/local-postgresql-context";
dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.test.local", quiet: true });
Object.assign(process.env, { NODE_ENV: "test" });
validateAuthFixtureEnvironment(process.env);

const ownAccountsServer = process.env.ACCOUNTS_LOCAL_POSTGRESQL === "1";
const defaultBaseURL = ownAccountsServer ? "http://127.0.0.1:3001" : "http://127.0.0.1:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseURL;
const localRegression = process.env.IMP006_LOCAL_POSTGRESQL === "1";
if (ownAccountsServer && !localRegression) throw new Error("Account regression requires the owned local PostgreSQL guard");
if (localRegression) {
  const context = localPostgresqlContext();
  const target = new URL(process.env.TEST_DATABASE_URL ?? "");
  const reference = new URL(process.env.DATABASE_URL ?? "");
  const browserTarget = new URL(baseURL);
  const https = process.env.AUTH_HTTPS_E2E === "1";
  if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" ||
      target.hostname !== "127.0.0.1" || target.port !== context.port || target.pathname !== `/${context.testDatabase}` ||
      reference.hostname !== "127.0.0.1" || reference.port !== context.port || reference.pathname !== `/${context.referenceDatabase}` ||
      (process.env.AUTH_HTTPS_E2E !== undefined && !https) ||
      browserTarget.hostname !== "127.0.0.1" || browserTarget.protocol !== (https ? "https:" : "http:") ||
      browserTarget.username || browserTarget.password || browserTarget.pathname !== "/" || browserTarget.search || browserTarget.hash ||
      (!https && baseURL !== defaultBaseURL) || (https && !process.env.PLAYWRIGHT_BASE_URL)) {
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
// The guarded account regression server admits generated synthetic mailboxes only.
// No remote or application environment inherits this test override.
if (localRegression && ownAccountsServer) {
  const recipients = (process.env.ACCOUNT_E2E_EMAILS ?? "").split(",");
  if (recipients.length !== 2 || new Set(recipients).size !== 2 || recipients.some((value) => !/^account-e2e-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}@accounts-test\.hidroflorestas\.invalid$/.test(value)) || process.env.ACCOUNT_TESTER_ALLOWLIST !== recipients.join(",")) {
    throw new Error("Account regression requires its two exact synthetic recipients");
  }
  serverEnvironment.ACCOUNT_TESTER_ALLOWLIST = recipients.join(",");
  serverEnvironment.ACCOUNT_E2E_EMAILS = recipients.join(",");
}

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
        command: `npm run dev -- --hostname 127.0.0.1${ownAccountsServer ? " --port 3001" : ""}`,
        env: serverEnvironment,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});

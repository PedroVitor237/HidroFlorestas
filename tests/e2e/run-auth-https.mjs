import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { createServer as createHttpsServer, request as httpsRequest } from "node:https";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer as createTcpServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  countAuthFixtureUsers,
  runAuthFixtureCommand,
  validateAuthFixtureEnvironment,
} from "../fixtures/auth-users.ts";

const cwd = fileURLToPath(new URL("../..", import.meta.url));
const runnerPath = fileURLToPath(import.meta.url);
const bootstrapMarker = "HIDROFLORESTAS_HTTPS_E2E_BOOTSTRAPPED";
const inheritedE2eVariables = [
  "DATABASE_URL",
  "TEST_DATABASE_URL",
  "TEST_DATABASE_CONFIRMATION",
  "NODE_ENV",
  "JWT_SECRET",
  "E2E_USER_PASSWORD",
  "PLAYWRIGHT_BASE_URL",
  "AUTH_HTTPS_E2E",
];

if (process.env[bootstrapMarker] !== "1") {
  const cleanEnvironment = { ...process.env, [bootstrapMarker]: "1" };
  for (const name of inheritedE2eVariables) delete cleanEnvironment[name];

  const bootstrap = spawn(
    process.execPath,
    ["--env-file=.env.e2e.local", "--import=tsx", runnerPath],
    { cwd, env: cleanEnvironment, stdio: "inherit" },
  );
  bootstrap.on("close", (code, signal) => {
    process.exitCode =
      code ?? (signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 1);
  });
} else {
  await runHttpsValidation();
}

async function runHttpsValidation() {
  const sensitiveValues = [
    "DATABASE_URL",
    "TEST_DATABASE_URL",
    "JWT_SECRET",
    "E2E_USER_PASSWORD",
    "PLAYWRIGHT_BASE_URL",
  ]
    .map((name) => process.env[name])
    .filter((value) => typeof value === "string" && value.length > 0);

  const sanitize = (value) => {
    let safe = value;
    for (const secret of sensitiveValues) {
      safe = safe.split(secret).join("<REDACTED>");
    }
    return safe
      .replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, "<REDACTED_DATABASE_URL>")
      .replace(/auth_token=[^;\s]+/gi, "auth_token=<REDACTED>")
      .replace(
        /[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
        "<REDACTED_JWT>",
      );
  };

  let activeCommand;
  let nextServer;
  let httpsProxy;
  let interruptedSignal;
  let setupStarted = false;
  let primaryExit = 1;
  let teardownPassed = false;
  let remainingFixtureUsers;
  let temporaryDirectory;

  const handleSignal = (signal) => {
    interruptedSignal = signal;
    activeCommand?.kill(signal);
  };
  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);

  const runCommand = (command, args, options = {}) =>
    new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd,
        env: options.env ?? process.env,
        stdio: options.silent ? "ignore" : ["ignore", "pipe", "pipe"],
      });
      activeCommand = child;

      if (!options.silent) {
        for (const channel of ["stdout", "stderr"]) {
          child[channel].setEncoding("utf8");
          child[channel].on("data", (chunk) => {
            process[channel].write(sanitize(chunk));
          });
        }
      }

      child.on("error", () => resolve(1));
      child.on("close", (code, signal) => {
        activeCommand = undefined;
        resolve(
          code ??
            (signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 1),
        );
      });
    });

  const startCommand = (command, args, environment) => {
    const child = spawn(command, args, {
      cwd,
      env: environment,
      stdio: ["ignore", "pipe", "pipe"],
    });
    for (const channel of ["stdout", "stderr"]) {
      child[channel].setEncoding("utf8");
      child[channel].on("data", (chunk) => {
        process[channel].write(sanitize(chunk));
      });
    }
    return child;
  };

  try {
    const safeEnvironment = validateAuthFixtureEnvironment(process.env);
    if (!process.env.JWT_SECRET?.trim() || !process.env.E2E_USER_PASSWORD) {
      throw new Error("Required HTTPS E2E environment is incomplete");
    }

    const existingFixtureUsers = await countAuthFixtureUsers(process.env);
    process.stdout.write("fixtureAdapterAuthentication: PASS\n");
    process.stdout.write(`existingFixtureUsers: ${existingFixtureUsers}\n`);
    if (existingFixtureUsers !== 0) {
      throw new Error("HTTPS E2E requires an initially clean fixture allowlist");
    }

    const productionEnvironment = {
      ...process.env,
      DATABASE_URL: safeEnvironment.testDatabaseUrl,
      NODE_ENV: "production",
    };
    delete productionEnvironment.E2E_USER_PASSWORD;
    delete productionEnvironment.TEST_DATABASE_CONFIRMATION;
    delete productionEnvironment[bootstrapMarker];

    const buildExit = await runCommand("npm", ["run", "build"], {
      env: productionEnvironment,
    });
    process.stdout.write(`productionBuild: ${buildExit === 0 ? "PASS" : "FAIL"}\n`);
    if (buildExit !== 0 || interruptedSignal) {
      primaryExit = buildExit || signalExit(interruptedSignal);
      return;
    }

    temporaryDirectory = await mkdtemp(join(tmpdir(), "hidroflorestas-auth-https-"));
    const certificatePath = join(temporaryDirectory, "localhost-cert.pem");
    const keyPath = join(temporaryDirectory, "localhost-key.pem");
    const certificateExit = await runCommand(
      "openssl",
      [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-days",
        "1",
        "-subj",
        "/CN=localhost",
        "-addext",
        "subjectAltName=DNS:localhost,IP:127.0.0.1",
        "-keyout",
        keyPath,
        "-out",
        certificatePath,
      ],
      { silent: true },
    );
    process.stdout.write(
      `temporaryCertificate: ${certificateExit === 0 ? "PASS" : "FAIL"}\n`,
    );
    if (certificateExit !== 0 || interruptedSignal) {
      primaryExit = certificateExit || signalExit(interruptedSignal);
      return;
    }

    const applicationPort = await availableLoopbackPort();
    const httpsPort = await availableLoopbackPort();

    setupStarted = true;
    await runAuthFixtureCommand("setup", process.env);
    process.stdout.write("setup: PASS\n");
    const preparedFixtureUsers = await countAuthFixtureUsers(process.env);
    process.stdout.write(`preparedFixtureUsers: ${preparedFixtureUsers}\n`);
    if (preparedFixtureUsers !== 4) {
      throw new Error("HTTPS E2E fixture setup did not prepare four users");
    }
    if (interruptedSignal) {
      primaryExit = signalExit(interruptedSignal);
      return;
    }

    nextServer = startCommand(
      "./node_modules/.bin/next",
      ["start", "-H", "127.0.0.1", "-p", String(applicationPort)],
      productionEnvironment,
    );
    await waitForHttp(applicationPort, () => Boolean(interruptedSignal));
    if (interruptedSignal) {
      primaryExit = signalExit(interruptedSignal);
      return;
    }

    httpsProxy = createHttpsServer(
      {
        cert: await readFile(certificatePath),
        key: await readFile(keyPath),
      },
      (request, response) => {
        const upstream = httpRequest(
          {
            headers: {
              ...request.headers,
              host: `127.0.0.1:${applicationPort}`,
              "x-forwarded-host": request.headers.host ?? "127.0.0.1",
              "x-forwarded-proto": "https",
            },
            hostname: "127.0.0.1",
            method: request.method,
            path: request.url,
            port: applicationPort,
          },
          (upstreamResponse) => {
            response.writeHead(
              upstreamResponse.statusCode ?? 502,
              upstreamResponse.headers,
            );
            upstreamResponse.pipe(response);
          },
        );
        upstream.on("error", () => {
          if (!response.headersSent) response.writeHead(502);
          response.end("Upstream unavailable");
        });
        request.pipe(upstream);
      },
    );
    await new Promise((resolve, reject) => {
      httpsProxy.once("error", reject);
      httpsProxy.listen(httpsPort, "127.0.0.1", resolve);
    });
    await waitForHttps(httpsPort, () => Boolean(interruptedSignal));
    if (interruptedSignal) {
      primaryExit = signalExit(interruptedSignal);
      return;
    }
    process.stdout.write("productionHttpsServer: PASS\n");

    const playwrightEnvironment = {
      ...process.env,
      AUTH_HTTPS_E2E: "1",
      PLAYWRIGHT_BASE_URL: `https://127.0.0.1:${httpsPort}`,
    };
    const e2eExit = await runCommand(
      "./node_modules/.bin/playwright",
      [
        "test",
        "tests/e2e/authenticated-access-https.spec.ts",
        "--output",
        join(temporaryDirectory, "playwright-results"),
      ],
      { env: playwrightEnvironment },
    );
    process.stdout.write(`httpsE2e: ${e2eExit === 0 ? "PASS" : "FAIL"}\n`);
    primaryExit = e2eExit;
  } catch (error) {
    process.stderr.write(
      `${sanitize(error instanceof Error ? error.message : "HTTPS E2E failed")}\n`,
    );
    primaryExit = interruptedSignal ? signalExit(interruptedSignal) : 1;
  } finally {
    await stopHttpsServer(httpsProxy);
    await stopChild(nextServer);

    if (setupStarted) {
      for (let attempt = 1; attempt <= 2 && !teardownPassed; attempt += 1) {
        try {
          await runAuthFixtureCommand("teardown", process.env);
          teardownPassed = true;
        } catch {
          process.stdout.write(`teardownAttempt${attempt}: FAIL\n`);
        }
      }
      process.stdout.write(`teardown: ${teardownPassed ? "PASS" : "FAIL"}\n`);
    }

    try {
      remainingFixtureUsers = await countAuthFixtureUsers(process.env);
      process.stdout.write(`remainingFixtureUsers: ${remainingFixtureUsers}\n`);
    } catch {
      process.stdout.write("remainingFixtureUsers: UNKNOWN\n");
    }

    if (temporaryDirectory) {
      await rm(temporaryDirectory, { force: true, recursive: true });
    }
    process.stdout.write("temporaryArtifacts: REMOVED\n");
    process.off("SIGINT", handleSignal);
    process.off("SIGTERM", handleSignal);
  }

  const cleanupPassed =
    (!setupStarted || teardownPassed) && remainingFixtureUsers === 0;
  process.exitCode =
    primaryExit !== 0 ? primaryExit : cleanupPassed ? 0 : 1;
}

function signalExit(signal) {
  return signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 1;
}

function availableLoopbackPort() {
  return new Promise((resolve, reject) => {
    const server = createTcpServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(port, shouldStop) {
  await waitForResponse(
    () => httpRequest({ hostname: "127.0.0.1", path: "/login", port }),
    shouldStop,
  );
}

async function waitForHttps(port, shouldStop) {
  await waitForResponse(
    () =>
      httpsRequest({
        hostname: "127.0.0.1",
        path: "/login",
        port,
        rejectUnauthorized: false,
      }),
    shouldStop,
  );
}

async function waitForResponse(createRequest, shouldStop) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (shouldStop?.()) throw new Error("HTTPS E2E interrupted");
    const ready = await new Promise((resolve) => {
      const request = createRequest();
      request.once("response", (response) => {
        response.resume();
        resolve((response.statusCode ?? 500) < 500);
      });
      request.once("error", () => resolve(false));
      request.end();
    });
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Timed out waiting for loopback service");
}

function stopHttpsServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("close", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

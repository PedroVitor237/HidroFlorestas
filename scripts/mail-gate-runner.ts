import { spawn } from "node:child_process";
import dotenv from "dotenv";
import { createWriteStream } from "node:fs";
import { readFile, appendFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { mailSnapshotFingerprint, redactMailValidation } from "./mail-validation-diagnostics";

async function main() {
  // Match the CLIs' private dotenv source before collecting/redacting child output.
  // Existing harness database variables keep precedence over the private file.
  dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env", quiet: true, override: false });
  const [gate, outputRoot, script] = process.argv.slice(2);
  if (!/^[A-Za-z0-9]+$/.test(gate ?? "") || !outputRoot || !script) throw new Error("Invalid gate arguments");
  const outputFile = join(outputRoot, `${gate.toLowerCase()}-${Date.now()}.log`);
  const output = createWriteStream(outputFile);
  const npmCli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  const startedUtc = new Date().toISOString();
  const snapshot = await mailSnapshotFingerprint();
  const args = script === "regression-setup" ? ["--import=tsx", "scripts/imp006-local-regression-setup.ts"] : script === "clean-install" ? ["--import=tsx", "scripts/mail-clean-install.ts"] : [npmCli, "run", script];
  const env = { ...process.env };
  if (script === "build") Object.assign(env, { NODE_ENV: "production" });
  const child = spawn(process.execPath, args, { env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  for (const stream of [child.stdout, child.stderr]) {
    let pending = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      pending += chunk;
      if (pending.length > 1_048_576) { child.kill(); pending = ""; output.write("Output line too large; collector stopped child.\n"); return; }
      const lines = pending.split("\n"); pending = lines.pop() ?? "";
      for (const line of lines) output.write(redactMailValidation(line, env) + "\n");
    });
    stream.on("end", () => { if (pending) output.write(redactMailValidation(pending, env)); });
  }
  const exitCode = await new Promise<number>((resolve, reject) => { child.once("error", reject); child.once("close", (code) => resolve(code ?? 1)); });
  await new Promise<void>((resolve) => output.end(resolve));
  const result = !exitCode ? "PASS" : gate === "Smoke" && (await readFile(outputFile, "utf8")).includes("Gmail smoke BLOQUEIO_DE_SETUP:") ? "BLOQUEIO_DE_SETUP" : "FAIL";
  const record = { gate, command: script === "regression-setup" ? "node --import=tsx scripts/imp006-local-regression-setup.ts" : script === "clean-install" ? "node --import=tsx scripts/mail-clean-install.ts" : `npm run ${script}`, snapshot, startedUtc, endedUtc: new Date().toISOString(), exitCode, result, environment: "Windows/Node24.19/owned-loopback-PostgreSQL17", log: outputFile };
  await appendFile(join(outputRoot, "results.jsonl"), JSON.stringify(record) + "\n");
  process.stdout.write(JSON.stringify(record) + "\n");
  const lines = (await readFile(outputFile, "utf8")).trimEnd().split(/\r?\n/);
  process.stdout.write(lines.slice(-18).join("\n") + "\n");
  process.exitCode = exitCode;
}
void main().catch(() => { process.stderr.write("Gate collector failed without disclosing environment.\n"); process.exitCode = 1; });

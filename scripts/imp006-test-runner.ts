import { spawn } from "node:child_process";
import { readOnlyImp006Preflight } from "./imp006-test-preflight";

const suites: Record<string, string> = {
  contract: "tests/contract/*.test.ts",
  integration: "tests/integration/*.test.ts",
  migration: "tests/migration/*.test.ts",
  "ihfr-insufficiency": "tests/integration/ihfr-diagnosis-persisted-insufficiency.test.ts",
};

async function main() {
  const pattern = suites[process.argv[2]];
  if (!pattern) throw new Error("Select contract, integration or migration");
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "test" };
  const verified = await readOnlyImp006Preflight(env);
  process.stdout.write(`IMP-006 read-only preflight passed: target ${verified.fingerprint}, schema ${verified.schema}. Tests may write to isolated schemas.\n`);
  const child = spawn(process.execPath, ["--import=tsx", "--test", "--test-concurrency=1", pattern], { env, stdio: "inherit", windowsHide: true });
  const code = await new Promise<number>((resolve, reject) => { child.once("error", reject); child.once("exit", (exit, signal) => resolve(exit ?? (signal ? 1 : 0))); });
  if (code !== 0) process.exitCode = code;
}

void main().catch((error) => { process.stderr.write(`IMP-006 preflight: ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; });

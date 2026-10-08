import { describeImp006Error, runImp006Gate } from "./imp006-gate-diagnostics";
import { readOnlyImp006Preflight } from "./imp006-test-preflight";

const suites: Record<string, string> = {
  contract: "tests/contract/*.test.ts",
  integration: "tests/integration/*.test.ts",
  migration: "tests/migration/*.test.ts",
  "ihfr-insufficiency": "tests/integration/ihfr-diagnosis-persisted-insufficiency.test.ts",
};

async function main() {
  const suite = process.argv[2];
  const pattern = suites[suite];
  if (!pattern) throw new Error("Select contract, integration or migration");
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "test" };
  const preflightStarted = Date.now();
  const verified = await readOnlyImp006Preflight(env);
  process.stdout.write(`IMP-006 read-only preflight passed: target ${verified.fingerprint}, schema ${verified.schema}, duration_ms=${Date.now() - preflightStarted}. Tests may write to isolated schemas.\n`);
  const result = await runImp006Gate(suite, [...(suite === "integration" ? ["--conditions=react-server"] : []), "--import=tsx", "--test", "--test-concurrency=1", pattern], env,
    { fingerprint: verified.fingerprint, schema: verified.schema, attempt: 1 });
  if (result.exitCode !== 0) process.exitCode = result.exitCode;
}

void main().catch((error) => { process.stderr.write(`IMP-006 gate: ${describeImp006Error(error, process.env)}\n`); process.exitCode = 1; });

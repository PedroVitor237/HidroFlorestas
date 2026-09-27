import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

const secretNames = [
  "DATABASE_URL", "TEST_DATABASE_URL", "JWT_SECRET", "E2E_USER_PASSWORD",
  "IMP006_UI_PASSWORD", "PASSWORD", "AUTH_TOKEN",
] as const;

export function redactImp006Diagnostics(value: string, env: Record<string, string | undefined>): string {
  let safe = value;
  const secrets = secretNames.map((name) => env[name]).filter((secret): secret is string => Boolean(secret));
  for (const secret of [...new Set(secrets)].sort((left, right) => right.length - left.length)) {
    safe = safe.replaceAll(secret, "<REDACTED>");
  }
  return safe
    .replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, "<REDACTED_DATABASE_URL>")
    .replace(/\b(Authorization|Cookie|Set-Cookie|X-Api-Key):[^\r\n]*/gi, "$1: <REDACTED>")
    .replace(/\bBearer\s+[^\s"'<>]+/gi, "Bearer <REDACTED>")
    .replace(/\bauth_token=[^;\s"'<>]+/gi, "auth_token=<REDACTED>")
    .replace(/\b(password|token|secret)=([^\s;&"'<>]+)/gi, "$1=<REDACTED>")
    .replace(/\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "<REDACTED_JWT>");
}

export function describeImp006Error(error: unknown, env: Record<string, string | undefined>): string {
  const seen = new Set<unknown>();
  const parts: string[] = [];
  const visit = (current: unknown) => {
    if (!current || seen.has(current)) return;
    seen.add(current);
    if (!(current instanceof Error)) { parts.push(String(current)); return; }
    const withCode = current as Error & { code?: unknown; sqlState?: unknown };
    const code = typeof withCode.code === "string" ? ` code=${withCode.code}` : "";
    const sqlState = typeof withCode.sqlState === "string" ? ` sqlstate=${withCode.sqlState}` : "";
    parts.push(`${current.name}: ${current.message}${code}${sqlState}`);
    if (current instanceof AggregateError) for (const item of current.errors) visit(item);
    visit(current.cause);
  };
  visit(error);
  return redactImp006Diagnostics(parts.join(" <- caused by: "), env);
}

export interface Imp006GateResult {
  exitCode: number;
  durationMs: number;
  logPath: string;
}

/** Keeps the complete sanitized child output in a private temporary log. */
export async function runImp006Gate(
  phase: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  context: { fingerprint?: string; schema?: string; runId?: string; attempt?: number } = {},
): Promise<Imp006GateResult> {
  if (!/^[a-z0-9-]+$/.test(phase)) throw new Error("Invalid gate phase");
  const directory = await mkdtemp(join(tmpdir(), "hidroflorestas-imp006-gate-"));
  const logPath = join(directory, `${phase}.log`);
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const lines: string[] = [];
  const details = [
    `phase=${phase}`, `attempt=${context.attempt ?? 1}`,
    context.fingerprint ? `target=${context.fingerprint}` : undefined,
    context.schema ? `schema=${context.schema}` : undefined,
    context.runId ? `run=${context.runId}` : undefined,
  ].filter(Boolean).join(" ");
  const startLine = `[${startedAt}] START ${details}\n`;
  lines.push(startLine);
  process.stdout.write(startLine);

  const child = spawn(process.execPath, args, { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  const attach = (stream: NodeJS.ReadableStream | null, destination: NodeJS.WriteStream, label: string) => {
    if (!stream) return;
    let pending = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      pending += chunk;
      const complete = pending.split("\n");
      pending = complete.pop() ?? "";
      for (const line of complete) {
        const safe = redactImp006Diagnostics(line, env);
        lines.push(`${label}: ${safe}\n`);
        destination.write(`${safe}\n`);
      }
    });
    stream.on("end", () => {
      if (!pending) return;
      const safe = redactImp006Diagnostics(pending, env);
      lines.push(`${label}: ${safe}\n`);
      destination.write(`${safe}\n`);
    });
  };
  attach(child.stdout, process.stdout, "stdout");
  attach(child.stderr, process.stderr, "stderr");

  const outcome = await new Promise<{ code: number; error?: unknown }>((resolve) => {
    let spawnError: unknown;
    child.once("error", (error) => { spawnError = error; });
    child.once("close", (code, signal) => resolve({ code: code ?? (signal ? 1 : 0), error: spawnError }));
  });
  const durationMs = Math.round(performance.now() - started);
  if (outcome.error) lines.push(`spawn-error: ${describeImp006Error(outcome.error, env)}\n`);
  const endLine = `[${new Date().toISOString()}] END ${details} exit=${outcome.code} duration_ms=${durationMs}\n`;
  lines.push(endLine);
  await writeFile(logPath, lines.join(""), { encoding: "utf8", mode: 0o600 });
  process.stdout.write(endLine);
  process.stdout.write(`IMP-006 sanitized gate log: ${logPath}\n`);
  return { exitCode: outcome.code, durationMs, logPath };
}

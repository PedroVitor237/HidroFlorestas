import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { redactImp006Diagnostics } from "./imp006-gate-diagnostics";

export function redactMailValidation(value: string, env: Record<string, string | undefined>) {
  let safe = value;
  const secrets = new Set(["SMTP_USER", "SMTP_APP_PASSWORD", "MAIL_FROM", "MAIL_PAYLOAD_ENCRYPTION_KEYS", "MAIL_IDEMPOTENCY_KEY", "MAIL_WORKER_SECRET", "MAIL_SMOKE_RECIPIENT", "MAIL_SMOKE_ALLOWED_RECIPIENT", "ACCOUNT_PROOF_KEYS", "ACCOUNT_REQUEST_KEY", "ACCOUNT_TESTER_ALLOWLIST"].map((name) => env[name]).filter((secret): secret is string => !!secret));
  if (env.SMTP_APP_PASSWORD) secrets.add(env.SMTP_APP_PASSWORD.replaceAll(" ", ""));
  for (const name of ["MAIL_PAYLOAD_ENCRYPTION_KEYS", "ACCOUNT_PROOF_KEYS"]) {
    try {
      const keys: unknown = JSON.parse(env[name] ?? "");
      if (keys && typeof keys === "object" && !Array.isArray(keys)) for (const key of Object.values(keys)) if (typeof key === "string" && key) secrets.add(key);
    } catch { /* Invalid configuration is handled by the runtime, without raw diagnostics. */ }
  }
  for (const recipient of (env.ACCOUNT_TESTER_ALLOWLIST ?? "").split(",")) if (recipient.trim()) secrets.add(recipient.trim());
  for (const secret of [...secrets].filter(Boolean).sort((a, b) => b.length - a.length)) safe = safe.replaceAll(secret, "<REDACTED>");
  return redactImp006Diagnostics(safe, env);
}

export type MailSnapshotFile = { path: string; sha256: string };
export function isMailSnapshotPath(file: string): boolean {
  if (/\.(?:zip|log|clixml|tsbuildinfo)$/i.test(file) || /(?:^|\/)\.env(?:\.|$)/.test(file)) return false;
  return /^(?:src\/|tests\/|scripts\/|prisma\/|public\/|package(?:-lock)?\.json$|(?:next|prisma|postcss|tailwind|eslint|playwright)(?:\.[a-z0-9-]+)*\.config\.(?:[cm]?js|ts)$|(?:tsconfig(?:\.[a-z0-9-]+)?|components|vercel)\.json$|\.(?:gitignore|vercelignore)$)/.test(file);
}

/** Exact functional inputs, including untracked feature files; never private dotenv or validation output. */
export async function mailSnapshotManifest(): Promise<MailSnapshotFile[]> {
  const paths = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter(isMailSnapshotPath);
  return Promise.all([...new Set(paths)].sort().map(async (path) => ({ path, sha256: createHash("sha256").update(await readFile(path)).digest("hex") })));
}

export async function mailSnapshotFingerprint() {
  return createHash("sha256").update(JSON.stringify(await mailSnapshotManifest())).digest("hex");
}

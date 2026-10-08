import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { redactImp006Diagnostics } from "./imp006-gate-diagnostics";

export function redactMailValidation(value: string, env: Record<string, string | undefined>) {
  let safe = value;
  const secrets = new Set(["SMTP_USER", "SMTP_APP_PASSWORD", "MAIL_FROM", "MAIL_PAYLOAD_ENCRYPTION_KEYS", "MAIL_IDEMPOTENCY_KEY", "MAIL_WORKER_SECRET", "MAIL_SMOKE_RECIPIENT", "MAIL_SMOKE_ALLOWED_RECIPIENT"].map((name) => env[name]).filter((secret): secret is string => !!secret));
  if (env.SMTP_APP_PASSWORD) secrets.add(env.SMTP_APP_PASSWORD.replaceAll(" ", ""));
  try {
    const keys: unknown = JSON.parse(env.MAIL_PAYLOAD_ENCRYPTION_KEYS ?? "");
    if (keys && typeof keys === "object" && !Array.isArray(keys)) for (const key of Object.values(keys)) if (typeof key === "string" && key) secrets.add(key);
  } catch { /* Invalid configuration is handled by the runtime, without raw diagnostics. */ }
  for (const secret of [...secrets].filter(Boolean).sort((a, b) => b.length - a.length)) safe = safe.replaceAll(secret, "<REDACTED>");
  return redactImp006Diagnostics(safe, env);
}

export async function mailSnapshotFingerprint() {
  const paths = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter((file) => /^(src\/|tests\/|scripts\/|prisma\/|package(?:-lock)?\.json$|playwright\.config\.ts$|tsconfig\.json$|eslint\.config\.mjs$|\.gitignore$)/.test(file)).sort();
  const digest = createHash("sha256");
  for (const file of [...new Set(paths)]) { digest.update(file).update("\0").update(await readFile(file)).update("\0"); }
  return digest.digest("hex");
}

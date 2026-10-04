import "server-only";
import { AccountError, normalizeEmail } from "./contracts";
import { readAccountProtection, type AccountProtection } from "./proof";
import { readMailProtection, type MailProtection } from "../mail/crypto";
import { validatePublicUrl } from "../mail/contracts";

export type AccountPolicy = {
  verificationTtlMs: number; maxCodeAttempts: number; cooldownMs: number; verificationSendsPerHour: number;
  resetTtlMs: number; resetRequestsPerHour: number; globalRequestsPerHour: number;
  protection: AccountProtection; mail: MailProtection; testerAllowlist: ReadonlySet<string> | null;
};
function integer(env: Record<string, string | undefined>, name: string, fallback: number, min: number, max: number) {
  const raw = env[name]; const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max || (raw !== undefined && !/^[0-9]+$/.test(raw))) throw new AccountError("PROVIDER_UNAVAILABLE");
  return value;
}
export function readAccountPolicy(env: Record<string, string | undefined> = process.env): AccountPolicy {
  try {
    if (env.ACCOUNT_POLICY_ENABLED !== "1") throw new Error();
    const publicUrl = validatePublicUrl(env.APP_PUBLIC_URL);
    const protection = readAccountProtection(env), mail = readMailProtection(env, publicUrl);
    const allKeys = [...protection.keys.values(), protection.requestKey, ...mail.keys.values(), mail.idempotencyKey];
    if (allKeys.some((key, i) => allKeys.some((other, j) => i !== j && key.equals(other)))) throw new Error();
    if (env.JWT_SECRET && allKeys.some((key) => key.equals(Buffer.from(env.JWT_SECRET!, "base64")))) throw new Error();
    const testerAllowlist = env.ACCOUNT_TESTER_ALLOWLIST ? new Set(env.ACCOUNT_TESTER_ALLOWLIST.split(",").map((value) => normalizeEmail(value).canonical)) : null;
    return { verificationTtlMs: 1000 * integer(env, "ACCOUNT_VERIFICATION_TTL_SECONDS", 900, 60, 3600), maxCodeAttempts: integer(env, "ACCOUNT_VERIFICATION_ATTEMPTS", 5, 1, 10),
      cooldownMs: 1000 * integer(env, "ACCOUNT_RESEND_COOLDOWN_SECONDS", 60, 30, 3600), verificationSendsPerHour: integer(env, "ACCOUNT_VERIFICATION_SENDS_PER_HOUR", 5, 1, 20),
      resetTtlMs: 1000 * integer(env, "ACCOUNT_RESET_TTL_SECONDS", 1800, 60, 3600), resetRequestsPerHour: integer(env, "ACCOUNT_RESET_REQUESTS_PER_HOUR", 3, 1, 10),
      globalRequestsPerHour: integer(env, "ACCOUNT_GLOBAL_REQUESTS_PER_HOUR", 100, 1, 10000), protection, mail, testerAllowlist };
  } catch { throw new AccountError("PROVIDER_UNAVAILABLE"); }
}

import "server-only";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { AccountError } from "./contracts";

export type AccountProtection = { keys: ReadonlyMap<string, Buffer>; activeKeyId: string; requestKey: Buffer };
function key(value: unknown): Buffer {
  if (typeof value !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(value)) throw new Error();
  const buffer = Buffer.from(value, "base64");
  if (buffer.length !== 32 || buffer.toString("base64") !== value) throw new Error();
  return buffer;
}
export function readAccountProtection(env: Record<string, string | undefined>): AccountProtection {
  try {
    const raw: unknown = JSON.parse(env.ACCOUNT_PROOF_KEYS ?? "");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error();
    const keys = new Map(Object.entries(raw).map(([id, value]) => { if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) throw new Error(); return [id, key(value)] as const; }));
    const activeKeyId = env.ACCOUNT_PROOF_ACTIVE_KEY_ID ?? "";
    if (!keys.has(activeKeyId) || keys.size > 10) throw new Error();
    return { keys, activeKeyId, requestKey: key(env.ACCOUNT_REQUEST_KEY) };
  } catch { throw new AccountError("PROVIDER_UNAVAILABLE"); }
}
export const generateVerificationCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
export const generateResetToken = () => randomBytes(32).toString("base64url");
function mac(key: Buffer, value: unknown): string { return createHmac("sha256", key).update(JSON.stringify(value)).digest("hex"); }
export function accountMac(protection: AccountProtection, value: unknown): string { return mac(protection.requestKey, ["account-request-v1", value]); }
export function proofMac(protection: AccountProtection, keyId: string, value: unknown): string {
  const secret = protection.keys.get(keyId); if (!secret) throw new AccountError("INVALID_PROOF");
  return mac(secret, ["account-proof-v1", value]);
}
export function emailBinding(protection: AccountProtection, keyId: string, user: { id: string; email: string; credentialVersion: number }): string {
  return proofMac(protection, keyId, ["email-binding", user.id, user.email.trim().toLowerCase(), user.credentialVersion]);
}
export function verificationDigest(protection: AccountProtection, keyId: string, id: string, user: { id: string; email: string; credentialVersion: number }, code: string): string {
  return proofMac(protection, keyId, ["EMAIL_VERIFICATION", id, user.id, user.email.trim().toLowerCase(), user.credentialVersion, code]);
}
export function resetDigest(protection: AccountProtection, keyId: string, token: string): string { return proofMac(protection, keyId, ["PASSWORD_RESET", token]); }
export function safeDigestEqual(left: string, right: string): boolean {
  return /^[0-9a-f]{64}$/.test(left) && /^[0-9a-f]{64}$/.test(right) && timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

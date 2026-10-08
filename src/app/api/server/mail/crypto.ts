import "server-only";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { MailError } from "./contracts";

export type MailProtection = { keys: ReadonlyMap<string, Buffer>; activeKeyId: string; idempotencyKey: Buffer; publicUrl: string };
export type EncryptedPayload = { version: 1; keyId: string; iv: string; tag: string; data: string };

function key(value: unknown) {
  if (typeof value !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(value)) throw new MailError("CONFIGURATION");
  const bytes = Buffer.from(value, "base64");
  if (bytes.length !== 32 || bytes.toString("base64") !== value) throw new MailError("CONFIGURATION");
  return bytes;
}

export function readMailProtection(env: Record<string, string | undefined>, publicUrl: string): MailProtection {
  try {
    const source: unknown = JSON.parse(env.MAIL_PAYLOAD_ENCRYPTION_KEYS ?? "");
    if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error();
    const keys = new Map(Object.entries(source).map(([id, value]) => {
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) throw new Error();
      return [id, key(value)] as const;
    }));
    const activeKeyId = env.MAIL_PAYLOAD_ACTIVE_KEY_ID ?? "";
    if (!keys.has(activeKeyId) || keys.size > 10) throw new Error();
    return { keys, activeKeyId, idempotencyKey: key(env.MAIL_IDEMPOTENCY_KEY), publicUrl };
  } catch { throw new MailError("CONFIGURATION"); }
}

function aad(id: string, template: string, keyId: string) { return Buffer.from(JSON.stringify(["hidroflorestas-mail-v1", id, template, keyId])); }

export function encryptMail(value: unknown, id: string, template: string, protection: MailProtection): EncryptedPayload {
  const secret = protection.keys.get(protection.activeKeyId);
  if (!secret || secret.length !== 32) throw new MailError("CONFIGURATION");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret, iv);
  cipher.setAAD(aad(id, template, protection.activeKeyId));
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { version: 1, keyId: protection.activeKeyId, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") };
}

export function decryptMail(value: unknown, id: string, template: string, protection: MailProtection): unknown {
  try {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    const envelope = value as EncryptedPayload;
    if (envelope.version !== 1 || Object.keys(envelope).sort().join() !== "data,iv,keyId,tag,version" || typeof envelope.keyId !== "string") throw new Error();
    const secret = protection.keys.get(envelope.keyId);
    if (!secret || typeof envelope.data !== "string" || envelope.data.length > 16_384) throw new Error();
    const iv = Buffer.from(envelope.iv, "base64"), tag = Buffer.from(envelope.tag, "base64");
    if (iv.length !== 12 || tag.length !== 16) throw new Error();
    const decipher = createDecipheriv("aes-256-gcm", secret, iv);
    decipher.setAAD(aad(id, template, envelope.keyId));
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.data, "base64")), decipher.final()]).toString("utf8"));
  } catch { throw new MailError("PAYLOAD"); }
}

export function mailContentMac(value: string, protection: MailProtection) { return createHmac("sha256", protection.idempotencyKey).update(value).digest("hex"); }

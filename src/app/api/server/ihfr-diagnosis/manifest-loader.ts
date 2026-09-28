import { createHash } from "node:crypto";
import activeManifest from "../../../../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.1.json";
import historicalManifest from "../../../../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.0.json";
import { IHFR_CONTRACT } from "./ihfr-diagnosis.constants";

export type VerifiedManifest = Readonly<Record<string, unknown>>;

export function canonicalizeIHFRValue(value: unknown): string { return JSON.stringify(sortRecursively(value)); }
export function hashCanonicalIHFRValue(value: unknown): string { return `sha256:${createHash("sha256").update(canonicalizeIHFRValue(value), "utf8").digest("hex")}`; }

function verifyManifest(source: unknown, expectedVersion: string, expectedHash: string): VerifiedManifest {
  if (!isRecord(source)) throw new Error("IHFR_MANIFEST_INVALID");
  if (source.mathContractVersion !== expectedVersion || source.contractHash !== expectedHash || source.algorithmVersion !== IHFR_CONTRACT.algorithmVersion) throw new Error("IHFR_MANIFEST_INCOMPATIBLE");
  const { contractHash: _declaredHash, ...hashable } = source;
  void _declaredHash;
  if (hashCanonicalIHFRValue(hashable) !== expectedHash) throw new Error("IHFR_MANIFEST_HASH_MISMATCH");
  return deepFreeze(structuredClone(source));
}

const active = verifyManifest(activeManifest, IHFR_CONTRACT.activeMathVersion, IHFR_CONTRACT.contractHash);
const historical = verifyManifest(historicalManifest, IHFR_CONTRACT.historicalMathVersion, "sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b");

export function loadActiveIHFRManifest(): VerifiedManifest { return active; }
export function loadHistoricalIHFRManifest(): VerifiedManifest { return historical; }

function sortRecursively(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortRecursively);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortRecursively(value[key])]));
}
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function deepFreeze<T>(value: T): T { if (value && typeof value === "object") { for (const nested of Object.values(value)) deepFreeze(nested); Object.freeze(value); } return value; }

import { parseEnvironmentalInput } from "@/types/environmental-data.validation";
import { createHash } from "node:crypto";
import type { EnvironmentalPayload } from "@/types/environmental-data.type";
export { parseEnvironmentalInput, EnvironmentalValidationError } from "@/types/environmental-data.validation";
export function canonicalPayload(payload: EnvironmentalPayload) { return JSON.stringify(parseEnvironmentalInput(payload)); }
export function hashPayload(payload: EnvironmentalPayload) { return createHash("sha256").update(canonicalPayload(payload)).digest("hex"); }

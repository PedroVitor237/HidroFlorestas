export type Imp006AuditMode = "list" | "assert-zero";

export function parseImp006AuditMode(args: string[]): Imp006AuditMode {
  if (args.length === 0 || (args.length === 1 && args[0] === "list")) return "list";
  if (args.length === 1 && args[0] === "assert-zero") return "assert-zero";
  throw new Error("IMP-006 audit mode must be list or assert-zero");
}

export function imp006AuditExitCode(mode: Imp006AuditMode, candidateCount: number): number {
  if (!Number.isSafeInteger(candidateCount) || candidateCount < 0) throw new Error("Invalid IMP-006 candidate count");
  return mode === "assert-zero" && candidateCount > 0 ? 1 : 0;
}

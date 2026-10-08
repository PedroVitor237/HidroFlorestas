export const DELETION_BLOCKER_LABELS = {
  LABORATORIES: "Laboratórios criados",
  MEMBERSHIPS: "Participações em laboratórios",
  AREAS: "Áreas cadastradas",
  COLLECTIONS: "Coletas cadastradas",
  MEASUREMENTS: "Conjuntos de medições ambientais",
  IHFR_INPUTS: "Suplementos de dados IHFR",
  IHFR_OPERATIONS: "Operações IHFR",
  IHFR_HISTORY: "Histórico IHFR",
  ADMINISTRATIVE_HISTORY: "Histórico administrativo",
  LAST_ACTIVE_ADMIN: "Sua conta é o único administrador ativo",
  OTHER_LINKS: "Outros registros vinculados",
} as const;
export type DeletionBlocker = { code: keyof typeof DELETION_BLOCKER_LABELS; label: string; count: number | null };
export type AccountDeletionState = { success: true; canDelete: boolean; blockers: DeletionBlocker[]; returnTo: "/workspace" | "/admin" | "/verify-email" };
export type AccountDeletionErrorCode = "INVALID_REQUEST" | "INVALID_CREDENTIALS" | "UNAUTHENTICATED" | "ACCOUNT_LINKED" | "RATE_LIMITED" | "MAIL_CLEANUP_PENDING" | "CONCURRENT_CHANGE" | "INTERNAL_ERROR";
export class AccountDeletionError extends Error {
  constructor(public readonly code: AccountDeletionErrorCode, public readonly blockers: DeletionBlocker[] = [], public readonly retryAfterSeconds?: number) { super(code); this.name = "AccountDeletionError"; }
}
export const DELETION_MESSAGES: Record<AccountDeletionErrorCode, string> = {
  INVALID_REQUEST: "Informe sua senha atual e confirme que deseja excluir a conta.",
  INVALID_CREDENTIALS: "A senha atual está incorreta.",
  UNAUTHENTICATED: "Faça login novamente para continuar.",
  ACCOUNT_LINKED: "Sua conta possui vínculos que precisam ser resolvidos antes da exclusão.",
  RATE_LIMITED: "Aguarde antes de tentar novamente.",
  MAIL_CLEANUP_PENDING: "Há uma operação pendente. Aguarde um pouco e tente novamente.",
  CONCURRENT_CHANGE: "A conta foi alterada durante a solicitação. Atualize a página e tente novamente.",
  INTERNAL_ERROR: "Não foi possível excluir a conta. Tente novamente.",
};
function exact(value: unknown, keys: string[]): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value)) && Object.keys(value).sort().join() === keys.sort().join();
}
export function parseAccountDeletionInput(value: unknown): { currentPassword: string; confirmDeletion: true } {
  if (!exact(value, ["currentPassword", "confirmDeletion"]) || value.confirmDeletion !== true || typeof value.currentPassword !== "string" || !value.currentPassword.trim() || value.currentPassword.length > 4096) throw new AccountDeletionError("INVALID_REQUEST");
  return { currentPassword: value.currentPassword, confirmDeletion: true };
}
export function parseAccountDeletionState(value: unknown): AccountDeletionState | null {
  if (!exact(value, ["success", "canDelete", "blockers", "returnTo"]) || value.success !== true || typeof value.canDelete !== "boolean" || !Array.isArray(value.blockers) || !["/workspace", "/admin", "/verify-email"].includes(String(value.returnTo))) return null;
  const blockers: DeletionBlocker[] = [];
  for (const item of value.blockers) {
    if (!exact(item, ["code", "label", "count"]) || typeof item.code !== "string" || !Object.hasOwn(DELETION_BLOCKER_LABELS, item.code)) return null;
    const code = item.code as DeletionBlocker["code"];
    if (item.label !== DELETION_BLOCKER_LABELS[code] || blockers.some(b => b.code === code) || !(code === "OTHER_LINKS" && item.count === null) && (!Number.isSafeInteger(item.count) || Number(item.count) < 1)) return null;
    blockers.push({ code, label: DELETION_BLOCKER_LABELS[code], count: item.count as number | null });
  }
  if (value.canDelete !== (blockers.length === 0)) return null;
  return { success: true, canDelete: value.canDelete, blockers, returnTo: value.returnTo as AccountDeletionState["returnTo"] };
}

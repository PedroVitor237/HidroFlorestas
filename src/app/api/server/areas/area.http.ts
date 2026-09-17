import { NextResponse } from "next/server";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { AreaAccessError, type AreaErrorCode } from "./area.authorization";
const messages: Record<AreaErrorCode, string> = {
  INVALID_INPUT: "Confira os campos informados.", UNAUTHENTICATED: "Faça login para continuar.", NOT_FOUND: "Recurso não encontrado.", FORBIDDEN: "Você não tem permissão para esta ação.", READ_ONLY: "Este laboratório está em modo somente leitura.", CONFLICT: "O registro mudou. Atualize a página e tente novamente.", INTERNAL_ERROR: "Não foi possível concluir a operação.",
};
export function areaJson(data: unknown, status = 200, extra: Record<string, string> = {}) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...extra } }); }
export function areaError(error: unknown) {
  let code: AreaErrorCode = error instanceof AreaAccessError ? error.code : "INTERNAL_ERROR";
  if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") code = "UNAUTHENTICATED";
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2034") code = "CONFLICT";
  const status = { INVALID_INPUT: 400, UNAUTHENTICATED: 401, NOT_FOUND: 404, FORBIDDEN: 403, READ_ONLY: 409, CONFLICT: 409, INTERNAL_ERROR: 500 }[code];
  return areaJson({ error: { code, message: messages[code] } }, status);
}
export async function readAreaBody(request: Request) { try { return await request.json() as unknown; } catch { throw new AreaAccessError("INVALID_INPUT"); } }

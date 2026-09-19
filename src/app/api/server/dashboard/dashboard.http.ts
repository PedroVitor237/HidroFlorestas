import { NextResponse } from "next/server";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { AreaAccessError } from "../areas/area.authorization";
import { DashboardError } from "./dashboard.contracts";

export function dashboardJson(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
export function dashboardError(error: unknown) {
  let code = "INTERNAL_ERROR", status = 500, message = "Não foi possível carregar o dashboard.";
  if (error instanceof DashboardError && error.code === "INVALID_CURSOR") { code = "INVALID_CURSOR"; status = 400; message = "O cursor do histórico é inválido."; }
  else if (error instanceof AreaAccessError) {
    code = error.code === "UNAUTHENTICATED" ? "UNAUTHENTICATED" : error.code === "NOT_FOUND" ? "NOT_FOUND" : "INTERNAL_ERROR";
    status = code === "UNAUTHENTICATED" ? 401 : code === "NOT_FOUND" ? 404 : 500;
    message = code === "UNAUTHENTICATED" ? "Faça login para continuar." : code === "NOT_FOUND" ? "Recurso não encontrado." : message;
  } else if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") { code = "UNAUTHENTICATED"; status = 401; message = "Faça login para continuar."; }
  return dashboardJson({ error: { code, message } }, status);
}


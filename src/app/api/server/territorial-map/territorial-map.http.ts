import { NextResponse } from "next/server";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { AreaAccessError } from "../areas/area.authorization";

export function territorialJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function territorialError(error: unknown) {
  let code = "INTERNAL_ERROR", status = 500, message = "Não foi possível carregar a visão territorial.";
  if (error instanceof AreaAccessError) {
    code = error.code === "UNAUTHENTICATED" ? "UNAUTHENTICATED" : error.code === "NOT_FOUND" ? "NOT_FOUND" : "INTERNAL_ERROR";
    status = code === "UNAUTHENTICATED" ? 401 : code === "NOT_FOUND" ? 404 : 500;
    message = code === "UNAUTHENTICATED" ? "Faça login para continuar." : code === "NOT_FOUND" ? "Recurso não encontrado." : message;
  } else if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") {
    code = "UNAUTHENTICATED"; status = 401; message = "Faça login para continuar.";
  }
  return territorialJson({ error: { code, message } }, status);
}

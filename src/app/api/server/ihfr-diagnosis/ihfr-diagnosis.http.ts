const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };
import { AreaAccessError } from "../areas/area.authorization";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { IHFRDiagnosisServiceError } from "../services/ihfr-diagnosis.service";

export function ihfrJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers });
}

export function ihfrNotImplemented() {
  return ihfrJson({ error: { code: "NOT_IMPLEMENTED", message: "IHFR diagnosis route is not implemented" } }, 501);
}

export function ihfrError(error: unknown) {
  if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") return ihfrJson({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, 401);
  if ((error instanceof TypeError && error.message === "INVALID_CONTEXT") || (error instanceof AreaAccessError && ["NOT_FOUND", "UNAUTHENTICATED"].includes(error.code)) || (error instanceof IHFRDiagnosisServiceError && error.code === "NOT_FOUND")) return ihfrJson({ error: { code: "NOT_FOUND", message: "Resource not found" } }, 404);
  return ihfrJson({ error: { code: "INTERNAL_ERROR", message: "Unable to process IHFR diagnosis" } }, 500);
}

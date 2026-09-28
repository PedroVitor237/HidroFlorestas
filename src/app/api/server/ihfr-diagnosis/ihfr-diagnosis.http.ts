const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };
import { AreaAccessError } from "../areas/area.authorization";
import { AuthBoundaryError } from "../middlewares/auth.middleware";
import { IHFRDiagnosisServiceError } from "../services/ihfr-diagnosis.service";

export function ihfrJson(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...headers, ...extraHeaders } });
}

export function ihfrNotImplemented() {
  return ihfrJson({ error: { code: "NOT_IMPLEMENTED", message: "IHFR diagnosis route is not implemented" } }, 501);
}

export function ihfrError(error: unknown) {
  if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") return ihfrJson({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, 401);
  if (error instanceof AreaAccessError && error.code === "UNAUTHENTICATED") return ihfrJson({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, 401);
  if (error instanceof TypeError && error.message === "INVALID_REQUEST") return ihfrJson({ error: { code: "INVALID_INPUT", message: "Invalid input" } }, 400);
  if ((error instanceof IHFRDiagnosisServiceError && error.code === "INVALID_INPUT") || (error instanceof AreaAccessError && error.code === "INVALID_INPUT")) return ihfrJson({ error: { code: "INVALID_INPUT", message: "Invalid input" } }, 400);
  if ((error instanceof TypeError && error.message === "INVALID_CONTEXT") || (error instanceof AreaAccessError && error.code === "NOT_FOUND") || (error instanceof IHFRDiagnosisServiceError && error.code === "NOT_FOUND")) return ihfrJson({ error: { code: "NOT_FOUND", message: "Resource not found" } }, 404);
  if (error instanceof AreaAccessError && error.code === "FORBIDDEN") return ihfrJson({ error: { code: "FORBIDDEN", message: "Action forbidden" } }, 403);
  if (error instanceof AreaAccessError && error.code === "READ_ONLY") return ihfrJson({ error: { code: "READ_ONLY", message: "Laboratory is read only" } }, 409);
  if (error instanceof IHFRDiagnosisServiceError && error.code === "STATE_CONFLICT") return ihfrJson({ error: { code: "STATE_CONFLICT", message: "Diagnosis state changed" } }, 409);
  if (error instanceof IHFRDiagnosisServiceError && error.code === "IDEMPOTENCY_CONFLICT") return ihfrJson({ error: { code: "IDEMPOTENCY_CONFLICT", message: "Idempotency key was used for another request" } }, 409);
  if (error instanceof IHFRDiagnosisServiceError && error.code === "INCOMPATIBLE_VERSION") return ihfrJson({ error: { code: "INCOMPATIBLE_VERSION", message: "Incompatible IHFR version" } }, 422);
  return ihfrJson({ error: { code: "TECHNICAL_FAILURE", message: "Unable to process IHFR diagnosis" } }, 500);
}

import { NextRequest, NextResponse } from "next/server";
import { AuthBoundaryError, requireAuth } from "../../server/middlewares/auth.middleware";
import type { AuthenticatedPrincipal } from "../../server/auth/auth.core";
import laboratoriesService, { type LaboratoriesService, type RiskActionResult } from "../../server/services/laboratories.service";
import { LABORATORY_MESSAGES, laboratoryFailure, parseRiskActionInput } from "../../server/laboratories/laboratory.contracts";

type Dependencies = { requireAuth: () => Promise<AuthenticatedPrincipal>; service: Pick<LaboratoriesService, "details" | "deactivate" | "delete"> };
type Context = { params: Promise<{ laboratoryId: string }> };
const NO_STORE = { "Cache-Control": "no-store" };

function failure(reason: Exclude<RiskActionResult, { success: true }>["reason"]) {
  const values = {
    NOT_FOUND: ["NOT_FOUND", LABORATORY_MESSAGES.notFound, 404],
    FORBIDDEN: ["FORBIDDEN", LABORATORY_MESSAGES.forbidden, 403],
    CONFIRMATION_MISMATCH: ["CONFIRMATION_MISMATCH", LABORATORY_MESSAGES.confirmationMismatch, 400],
    LABORATORY_HAS_DATA: ["LABORATORY_HAS_DATA", LABORATORY_MESSAGES.laboratoryHasData, 409],
    INTERNAL_ERROR: ["INTERNAL_ERROR", LABORATORY_MESSAGES.internalError, 500],
  } as const;
  const [code, message, status] = values[reason];
  return NextResponse.json(laboratoryFailure(code, message), { status, headers: NO_STORE });
}

export function createLaboratorySettingsHandlers(dependencies: Dependencies) {
  async function authenticate(): Promise<{ principal: AuthenticatedPrincipal; response?: never } | { principal?: never; response: NextResponse }> {
    try { return { principal: await dependencies.requireAuth() } as const; }
    catch (error) {
      const unauthenticated = error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED";
      return { response: NextResponse.json(laboratoryFailure(unauthenticated ? "UNAUTHENTICATED" : "INTERNAL_ERROR", unauthenticated ? LABORATORY_MESSAGES.unauthenticated : LABORATORY_MESSAGES.internalError), { status: unauthenticated ? 401 : 500, headers: NO_STORE }) } as const;
    }
  }
  async function parseRequest(request: NextRequest) {
    try { return parseRiskActionInput(await request.json()); } catch { return { success: false as const }; }
  }
  return {
    GET: async (_request: NextRequest, context: Context) => {
      const auth = await authenticate(); if (auth.response) return auth.response;
      const { laboratoryId } = await context.params;
      const result = await dependencies.service.details(auth.principal.id, laboratoryId);
      return result.success ? NextResponse.json({ success: true, details: result.details }, { headers: NO_STORE }) : failure(result.reason);
    },
    PATCH: async (request: NextRequest, context: Context) => {
      const auth = await authenticate(); if (auth.response) return auth.response;
      const parsed = await parseRequest(request); if (!parsed.success) return NextResponse.json(laboratoryFailure("INVALID_REQUEST", LABORATORY_MESSAGES.invalidRequest), { status: 400, headers: NO_STORE });
      const { laboratoryId } = await context.params;
      const result = await dependencies.service.deactivate(auth.principal.id, laboratoryId, parsed.confirmationName);
      return result.success ? NextResponse.json({ success: true, action: "DEACTIVATED" }, { headers: NO_STORE }) : failure(result.reason);
    },
    DELETE: async (request: NextRequest, context: Context) => {
      const auth = await authenticate(); if (auth.response) return auth.response;
      const parsed = await parseRequest(request); if (!parsed.success) return NextResponse.json(laboratoryFailure("INVALID_REQUEST", LABORATORY_MESSAGES.invalidRequest), { status: 400, headers: NO_STORE });
      const { laboratoryId } = await context.params;
      const result = await dependencies.service.delete(auth.principal.id, laboratoryId, parsed.confirmationName);
      return result.success ? NextResponse.json({ success: true, action: "DELETED" }, { headers: NO_STORE }) : failure(result.reason);
    },
  };
}

const handlers = createLaboratorySettingsHandlers({ requireAuth, service: laboratoriesService });
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;

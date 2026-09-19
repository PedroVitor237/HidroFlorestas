import { NextRequest, NextResponse } from "next/server";
import { AuthBoundaryError, requireAuth } from "../server/middlewares/auth.middleware";
import type { AuthenticatedPrincipal } from "../server/auth/auth.core";
import laboratoriesService, { type LaboratoriesService } from "../server/services/laboratories.service";
import { LABORATORY_MESSAGES, laboratoryFailure, parseCreateLaboratoryInput } from "../server/laboratories/laboratory.contracts";

type Dependencies = { requireAuth: () => Promise<AuthenticatedPrincipal>; service: Pick<LaboratoriesService, "listAccessible" | "create"> };
const NO_STORE = { "Cache-Control": "no-store" };

function authFailure(error: unknown) {
  const unauthorized = error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED";
  return NextResponse.json(
    laboratoryFailure(unauthorized ? "UNAUTHENTICATED" : "INTERNAL_ERROR", unauthorized ? LABORATORY_MESSAGES.unauthenticated : LABORATORY_MESSAGES.internalError),
    { status: unauthorized ? 401 : 500, headers: NO_STORE },
  );
}

export function createLaboratoriesHandlers(dependencies: Dependencies) {
  return {
    GET: async () => {
      try {
        const principal = await dependencies.requireAuth();
        const result = await dependencies.service.listAccessible(principal.id);
        return result.success
          ? NextResponse.json({ success: true, laboratories: result.laboratories }, { headers: NO_STORE })
          : NextResponse.json(laboratoryFailure("INTERNAL_ERROR", LABORATORY_MESSAGES.internalError), { status: 500, headers: NO_STORE });
      } catch (error) { return authFailure(error); }
    },
    POST: async (request: NextRequest) => {
      try {
        const principal = await dependencies.requireAuth();
        let body: unknown;
        try { body = await request.json(); } catch { body = undefined; }
        const parsed = parseCreateLaboratoryInput(body);
        if (!parsed.success) return NextResponse.json(parsed.failure, { status: 400, headers: NO_STORE });
        const result = await dependencies.service.create(principal.id, parsed.data.name);
        if (result.success) return NextResponse.json({ success: true, laboratory: result.laboratory }, { status: 201, headers: NO_STORE });
        if (result.reason === "LIMIT_REACHED") return NextResponse.json(laboratoryFailure("LABORATORY_LIMIT_REACHED", LABORATORY_MESSAGES.limitReached), { status: 409, headers: NO_STORE });
        if (result.reason === "CONFLICT") return NextResponse.json(laboratoryFailure("CONFLICT", LABORATORY_MESSAGES.conflict), { status: 409, headers: NO_STORE });
        return NextResponse.json(laboratoryFailure("INTERNAL_ERROR", LABORATORY_MESSAGES.internalError), { status: 500, headers: NO_STORE });
      } catch (error) { return authFailure(error); }
    },
  };
}

const handlers = createLaboratoriesHandlers({ requireAuth, service: laboratoriesService });
export const GET = handlers.GET;
export const POST = handlers.POST;

import { validResourceId } from "../areas/area.authorization";
import { IHFRDiagnosisServiceError, type IHFRDiagnosisService, type IHFRRevocationRequest } from "../services/ihfr-diagnosis.service";
import { parseIHFRRouteContext } from "./ihfr-diagnosis.contracts";
import { ihfrError, ihfrJson } from "./ihfr-diagnosis.http";

type Dependencies = {
  requireAuth(): Promise<{ id: string }>;
  service: Pick<IHFRDiagnosisService, "authorizeWrite" | "revoke">;
};

export function createIHFRRevocationHandler(dependencies: Dependencies) {
  return async function POST(
    request: Request,
    route: {
      params: Promise<{
        laboratoryId: string;
        areaId: string;
        collectionId: string;
        diagnosisId: string;
      }>;
    },
  ) {
    try {
      const principal = await dependencies.requireAuth();
      const params = await route.params;
      const context = parseIHFRRouteContext({ laboratoryId: params.laboratoryId, areaId: params.areaId, collectionId: params.collectionId });
      await dependencies.service.authorizeWrite(principal.id, context);
      if (!validResourceId(params.diagnosisId)) throw new IHFRDiagnosisServiceError("NOT_FOUND");
      if (new URL(request.url).search || !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get("content-type") ?? "")) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      const key = request.headers.get("idempotency-key");
      if (!key || !validResourceId(key)) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      let body: unknown;
      try { body = await request.json(); } catch { throw new IHFRDiagnosisServiceError("INVALID_INPUT"); }
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 2 || !Object.hasOwn(body, "expectedCurrentDiagnosisId") || !Object.hasOwn(body, "reason")) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      const input = body as IHFRRevocationRequest;
      if (!validResourceId(input.expectedCurrentDiagnosisId) || typeof input.reason !== "string" || input.reason.trim().length === 0 || input.reason.length > 500) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      const result = await dependencies.service.revoke(principal.id, context, params.diagnosisId, input, key);
      return ihfrJson(result.response);
    } catch (error) {
      return ihfrError(error);
    }
  };
}

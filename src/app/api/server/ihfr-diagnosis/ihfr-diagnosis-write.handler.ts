import { parseIHFRDiagnosisRequest, parseIHFRRouteContext } from "./ihfr-diagnosis.contracts";
import { ihfrError, ihfrJson } from "./ihfr-diagnosis.http";
import { IHFRDiagnosisServiceError, type IHFRDiagnosisService } from "../services/ihfr-diagnosis.service";

type Dependencies = { requireAuth(): Promise<{ id: string }>; service: Pick<IHFRDiagnosisService, "authorizeWrite" | "createOrReplace"> };

export function createIHFRWriteHandler(dependencies: Dependencies) {
  return async function POST(request: Request, route: { params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }> }) {
    try {
      const principal = await dependencies.requireAuth();
      const context = parseIHFRRouteContext(await route.params);
      await dependencies.service.authorizeWrite(principal.id, context);
      const url = new URL(request.url);
      if (url.search) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      const contentType = request.headers.get("content-type") ?? "";
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(contentType)) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      const key = request.headers.get("idempotency-key");
      if (!key || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) throw new IHFRDiagnosisServiceError("INVALID_INPUT");
      let body: unknown;
      try { body = await request.json(); } catch { throw new IHFRDiagnosisServiceError("INVALID_INPUT"); }
      let parsed: ReturnType<typeof parseIHFRDiagnosisRequest>;
      try { parsed = parseIHFRDiagnosisRequest(body); } catch { throw new IHFRDiagnosisServiceError("INVALID_INPUT"); }
      const result = await dependencies.service.createOrReplace(principal.id, context, parsed, key);
      if (result.response.outcome === "INCOMPATIBLE_VERSION") throw new IHFRDiagnosisServiceError("INCOMPATIBLE_VERSION");
      const status = result.response.outcome === "SUCCEEDED" && !result.replayed ? 201 : 200;
      const location: Record<string, string> = {};
      if (status === 201 && result.response.diagnosis) location.Location = `${url.pathname.replace(/\/$/, "")}/${result.response.diagnosis.id}`;
      return ihfrJson(result.response, status, location);
    } catch (error) {
      return ihfrError(error);
    }
  };
}

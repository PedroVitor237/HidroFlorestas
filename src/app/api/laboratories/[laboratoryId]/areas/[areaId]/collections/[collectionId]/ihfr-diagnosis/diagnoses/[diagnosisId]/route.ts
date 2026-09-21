import { ihfrError, ihfrJson } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http";
import { parseIHFRRouteContext } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";
export async function GET(_request?: Request, route?: { params: Promise<{laboratoryId:string;areaId:string;collectionId:string;diagnosisId:string}> }) {
  try { const principal=await requireAuth(); const params=await route?.params; const context=parseIHFRRouteContext(params); return ihfrJson({ diagnosis: await ihfrDiagnosisService.readDetail(principal.id,context,params?.diagnosisId ?? "") }); } catch(error) { return ihfrError(error); }
}

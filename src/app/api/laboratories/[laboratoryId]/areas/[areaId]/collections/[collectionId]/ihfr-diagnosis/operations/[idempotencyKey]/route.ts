import { createIHFROperationHandler } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";
export const GET = createIHFROperationHandler({ requireAuth, service: ihfrDiagnosisService });

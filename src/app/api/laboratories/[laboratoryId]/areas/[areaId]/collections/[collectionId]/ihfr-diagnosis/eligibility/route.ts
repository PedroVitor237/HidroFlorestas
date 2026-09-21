import { createIHFREligibilityHandler } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";

export const GET = createIHFREligibilityHandler({ requireAuth, service: ihfrDiagnosisService });

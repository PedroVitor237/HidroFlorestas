import { createIHFRDetailHandler } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";

export const GET = createIHFRDetailHandler({ requireAuth, service: ihfrDiagnosisService });

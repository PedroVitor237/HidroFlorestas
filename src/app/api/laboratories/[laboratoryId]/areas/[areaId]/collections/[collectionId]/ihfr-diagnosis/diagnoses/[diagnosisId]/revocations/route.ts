import { createIHFRRevocationHandler } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";

export const POST = createIHFRRevocationHandler({ requireAuth, service: ihfrDiagnosisService });

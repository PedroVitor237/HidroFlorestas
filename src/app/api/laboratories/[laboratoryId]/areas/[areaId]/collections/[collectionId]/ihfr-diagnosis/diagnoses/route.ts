import { createIHFRWriteHandler } from "@/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";

export const POST = createIHFRWriteHandler({ requireAuth, service: ihfrDiagnosisService });

import { handleMailTrigger } from "../../../server/mail/trigger";
import { runConfiguredMailWorker } from "../../../server/mail/runtime";

export const runtime = "nodejs";
export const maxDuration = 60;
export const GET = (request: Request) => handleMailTrigger(request, runConfiguredMailWorker);
export const POST = GET;

import type { NextRequest } from "next/server";
import type { AccountService } from "./service";
import { AccountDeletionError, DELETION_MESSAGES } from "./deletion.contracts";
import { accountBody, accountErrorResponse, accountIngress, accountResponse, checkAccountCsrf, expireAccountCookies } from "./http";
import { AUTH_COOKIE_NAME, VERIFICATION_COOKIE_NAME } from "../auth/session";

const statuses = { INVALID_REQUEST: 400, INVALID_CREDENTIALS: 401, UNAUTHENTICATED: 401, ACCOUNT_LINKED: 409, RATE_LIMITED: 429, MAIL_CLEANUP_PENDING: 503, CONCURRENT_CHANGE: 503, INTERNAL_ERROR: 500 };
export function createDeletionHandlers(deps: { service: () => Promise<Pick<AccountService, "deletionState" | "deleteAccount">>; nodeEnvironment?: string; environment?: Record<string, string | undefined> }) {
  const token = (request: NextRequest) => request.cookies.get(AUTH_COOKIE_NAME)?.value ?? request.cookies.get(VERIFICATION_COOKIE_NAME)?.value;
  const failure = (error: unknown) => {
    if (!(error instanceof AccountDeletionError)) return accountErrorResponse(error);
    const response = accountResponse({ success: false, code: error.code, message: DELETION_MESSAGES[error.code], ...(error.blockers.length ? { blockers: error.blockers } : {}), ...(error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}) }, statuses[error.code]);
    if (error.retryAfterSeconds) response.headers.set("Retry-After", String(error.retryAfterSeconds));
    return response;
  };
  return {
    async GET(request: NextRequest) {
      try {
        if (request.nextUrl.search) throw new AccountDeletionError("INVALID_REQUEST");
        return accountResponse(await (await deps.service()).deletionState(token(request)));
      } catch (error) { return failure(error); }
    },
    async DELETE(request: NextRequest) {
      try {
        checkAccountCsrf(request, deps.environment);
        if (request.nextUrl.search) throw new AccountDeletionError("INVALID_REQUEST");
        const input = await accountBody(request);
        await (await deps.service()).deleteAccount(token(request), input, accountIngress(request, deps.environment));
        const response = accountResponse({ success: true });
        expireAccountCookies(response, deps.nodeEnvironment);
        return response;
      } catch (error) { return failure(error); }
    },
  };
}
export const deletionHandlers = createDeletionHandlers({ service: async () => (await import("./service")).accounts });

import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";
import { randomInt } from "node:crypto";
import { requireAuth } from "../middlewares/auth.middleware";
import type { AccountService } from "./service";
import { AccountError, ACCOUNT_MESSAGES, RESET_REQUEST_MESSAGE } from "./contracts";
import { AUTH_COOKIE_NAME, VERIFICATION_COOKIE_NAME, getAuthCookieOptions, getExpiredAuthCookieOptions, getVerificationCookieOptions } from "../auth/session";
import { validatePublicUrl } from "../mail/contracts";

const status = { INVALID_REQUEST: 400, INVALID_CREDENTIALS: 401, UNAUTHENTICATED: 401, INVALID_PROOF: 400, RATE_LIMITED: 429, ACCOUNT_EXISTS: 409, IDEMPOTENCY_CONFLICT: 409, PROVIDER_UNAVAILABLE: 503, INTERNAL_ERROR: 500, FORBIDDEN: 403 };
export const ACCOUNT_RESPONSE_HEADERS = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "Pragma": "no-cache" };
export function accountResponse(value: unknown, code = 200): NextResponse { return NextResponse.json(value, { status: code, headers: ACCOUNT_RESPONSE_HEADERS }); }
export function accountErrorResponse(error: unknown): NextResponse {
  const safe = error instanceof AccountError ? error : new AccountError("INTERNAL_ERROR");
  const response = accountResponse({ success: false, code: safe.code, message: ACCOUNT_MESSAGES[safe.code], ...(safe.retryAfterSeconds ? { retryAfterSeconds: safe.retryAfterSeconds } : {}) }, status[safe.code]);
  if (safe.retryAfterSeconds) response.headers.set("Retry-After", String(safe.retryAfterSeconds));
  return response;
}
function isLoopback(hostname: string): boolean { return ["localhost", "127.0.0.1", "[::1]"].includes(hostname); }
function externalAccountOrigin(request: Request, environment: Record<string, string | undefined>): string {
  if (environment.ACCOUNT_TRUSTED_INGRESS === "vercel") {
    if (environment.VERCEL !== "1") throw new AccountError("FORBIDDEN");
    try { return validatePublicUrl(environment.APP_PUBLIC_URL); } catch { throw new AccountError("FORBIDDEN"); }
  }
  if (environment.ACCOUNT_TRUSTED_INGRESS === "local") {
    const productionHarness = environment.AUTH_HTTPS_E2E === "1" && environment.TEST_DATABASE_CONFIRMATION === "HIDROFLORESTAS_AUTH_TEST" && environment.IMP006_LOCAL_REGRESSION_PUBLIC === "1";
    if (environment.VERCEL === "1" || environment.ACCOUNTS_LOCAL_POSTGRESQL !== "1" || (environment.ACCOUNTS_LOCAL_APP !== "1" && environment.IMP006_LOCAL_REGRESSION_PUBLIC !== "1") || (environment.NODE_ENV === "production" && !productionHarness)) throw new AccountError("FORBIDDEN");
    try {
      const host = request.headers.get("host"); if (!host) throw new Error();
      const upstream = new URL(`${new URL(request.url).protocol}//${host}`);
      if (!isLoopback(upstream.hostname) || upstream.username || upstream.password || upstream.pathname !== "/" || upstream.search || upstream.hash) throw new Error();
      const external = environment.ACCOUNT_LOCAL_APP_ORIGIN ? new URL(environment.ACCOUNT_LOCAL_APP_ORIGIN) : upstream;
      if (!isLoopback(external.hostname) || !["http:", "https:"].includes(external.protocol) || external.username || external.password || external.pathname !== "/" || external.search || external.hash || !external.port) throw new Error();
      if (!environment.ACCOUNT_LOCAL_APP_ORIGIN && (external.port !== "3001" || external.protocol !== "http:")) throw new Error();
      if (environment.NODE_ENV === "production" && (external.protocol !== "https:" || !environment.ACCOUNT_LOCAL_APP_ORIGIN)) throw new Error();
      return external.origin;
    } catch { throw new AccountError("FORBIDDEN"); }
  }
  return new URL(request.url).origin;
}
export function checkAccountCsrf(request: Request, environment: Record<string, string | undefined> = process.env): void {
  const site = request.headers.get("sec-fetch-site"), origin = request.headers.get("origin");
  if (site === "cross-site" || site === "same-site") throw new AccountError("FORBIDDEN");
  if (origin) {
    try { if (new URL(origin).origin !== externalAccountOrigin(request, environment) || origin === "null") throw new Error(); }
    catch { throw new AccountError("FORBIDDEN"); }
  }
}
// This is the network ingress identity, not the browser's HTTP Origin. Only an
// explicitly selected trusted platform may supply it; otherwise use one shared bucket.
export function accountIngress(request: Request, environment: Record<string, string | undefined> = process.env): string {
  if (environment.ACCOUNT_TRUSTED_INGRESS === "local" && environment.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname)) return "local-development";
  if (environment.ACCOUNT_TRUSTED_INGRESS === "vercel" && environment.VERCEL === "1") {
    const value = request.headers.get("x-vercel-forwarded-for")?.trim();
    if (value && isIP(value)) return value;
  }
  return "unknown-ingress";
}
export async function accountBody(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new AccountError("INVALID_REQUEST");
  const reader = request.body?.getReader(); if (!reader) throw new AccountError("INVALID_REQUEST");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > 16_384) { await reader.cancel(); throw new AccountError("INVALID_REQUEST"); } chunks.push(chunk.value); }
    const body = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
  } catch { throw new AccountError("INVALID_REQUEST"); }
  finally { reader.releaseLock(); }
}
export function expireAccountCookies(response: NextResponse, nodeEnvironment: string | undefined = process.env.NODE_ENV) {
  for (const name of [AUTH_COOKIE_NAME, VERIFICATION_COOKIE_NAME]) response.cookies.set(name, "", getExpiredAuthCookieOptions(nodeEnvironment));
}
export function accountSessionResponse(result: { user: unknown; destination: string; token: string; purpose: "session" | "email-verification" }, code = 200, nodeEnvironment: string | undefined = process.env.NODE_ENV) {
  const response = accountResponse({ success: true, user: result.user, destination: result.destination }, code);
  expireAccountCookies(response, nodeEnvironment);
  response.cookies.set(result.purpose === "session" ? AUTH_COOKIE_NAME : VERIFICATION_COOKIE_NAME, result.token, result.purpose === "session" ? getAuthCookieOptions(nodeEnvironment) : getVerificationCookieOptions(nodeEnvironment));
  return response;
}
type AccountHttpService = Pick<AccountService, "signup" | "verificationState" | "confirmVerification" | "resend" | "requestReset" | "confirmReset" | "changePassword">;
type AccountHttpDependencies = { service: () => Promise<AccountHttpService>; requireUser?: () => Promise<{ id: string }>; nodeEnvironment?: string; environment?: Record<string, string | undefined>; resetResponseDelay?: (started: number) => Promise<void> };
export function createAccountHttpHandlers(deps: AccountHttpDependencies) {
  const failure = (error: unknown) => accountErrorResponse(error && typeof error === "object" && "code" in error && error.code === "UNAUTHORIZED" ? new AccountError("UNAUTHENTICATED") : error);
  return {
    async signup(request: NextRequest) {
      try { checkAccountCsrf(request, deps.environment); const service = await deps.service(); const result = await service.signup(await accountBody(request), request.headers.get("idempotency-key") ?? "", accountIngress(request, deps.environment)); return accountSessionResponse(result, result.reused ? 200 : 201, deps.nodeEnvironment); }
      catch (error) { return failure(error); }
    },
    async verificationState(request: NextRequest) {
      try { const service = await deps.service(); return accountResponse(await service.verificationState(request.cookies.get(VERIFICATION_COOKIE_NAME)?.value)); }
      catch (error) { return failure(error); }
    },
    async verificationConfirm(request: NextRequest) {
      try { checkAccountCsrf(request, deps.environment); const service = await deps.service(); return accountSessionResponse(await service.confirmVerification(request.cookies.get(VERIFICATION_COOKIE_NAME)?.value, await accountBody(request), accountIngress(request, deps.environment)), 200, deps.nodeEnvironment); }
      catch (error) { return failure(error); }
    },
    async verificationResend(request: NextRequest) {
      try { checkAccountCsrf(request, deps.environment); const service = await deps.service(); return accountResponse(await service.resend(request.cookies.get(VERIFICATION_COOKIE_NAME)?.value, await accountBody(request), request.headers.get("idempotency-key") ?? "", accountIngress(request, deps.environment))); }
      catch (error) { return failure(error); }
    },
    async resetRequest(request: NextRequest) {
      const started = performance.now();
      try {
        checkAccountCsrf(request, deps.environment); const service = await deps.service();
        await service.requestReset(await accountBody(request), request.headers.get("idempotency-key") ?? "", accountIngress(request, deps.environment));
        if (deps.resetResponseDelay) await deps.resetResponseDelay(started);
        else {
          const remaining = 500 + randomInt(0, 51) - (performance.now() - started);
          if (remaining > 0) await new Promise<void>((resolve) => setTimeout(resolve, remaining));
        }
        return accountResponse({ success: true, message: RESET_REQUEST_MESSAGE }, 202);
      } catch (error) { return failure(error); }
    },
    async resetConfirm(request: NextRequest) {
      try { checkAccountCsrf(request, deps.environment); const service = await deps.service(); await service.confirmReset(await accountBody(request), accountIngress(request, deps.environment)); const response = accountResponse({ success: true, message: "Senha redefinida. Faça login novamente." }); expireAccountCookies(response, deps.nodeEnvironment); return response; }
      catch (error) { return failure(error); }
    },
    async changePassword(request: NextRequest) {
      try { checkAccountCsrf(request, deps.environment); const user = await (deps.requireUser ?? requireAuth)(); const service = await deps.service(); await service.changePassword(user.id, await accountBody(request), accountIngress(request, deps.environment)); const response = accountResponse({ success: true, message: "Senha alterada. Faça login novamente." }); expireAccountCookies(response, deps.nodeEnvironment); return response; }
      catch (error) { return failure(error); }
    },
  };
}
const configured = createAccountHttpHandlers({ service: async () => (await import("./service")).accounts });
export const signupHandler = configured.signup;
export const verificationStateHandler = configured.verificationState;
export const verificationConfirmHandler = configured.verificationConfirm;
export const verificationResendHandler = configured.verificationResend;
export const resetRequestHandler = configured.resetRequest;
export const resetConfirmHandler = configured.resetConfirm;
export const changePasswordHandler = configured.changePassword;

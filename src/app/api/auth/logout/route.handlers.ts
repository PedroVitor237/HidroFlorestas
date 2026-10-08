import { NextResponse } from "next/server";
import { accountErrorResponse, checkAccountCsrf, ACCOUNT_RESPONSE_HEADERS } from "../../server/accounts/http";

import { internalErrorFailure } from "../../server/auth/auth.contracts";
import {
    AUTH_COOKIE_NAME,
    VERIFICATION_COOKIE_NAME,
    getExpiredAuthCookieOptions,
} from "../../server/auth/session";

type LogoutHandlerDependencies = {
    nodeEnvironment?: string;
    expireCookie?: (response: NextResponse) => void;
};

export function createLogoutHandler(dependencies: LogoutHandlerDependencies = {}) {
    return async function logoutHandler(request?: Request) {
        try {
            if (request) checkAccountCsrf(request);
            const response = NextResponse.json({ success: true as const }, { headers: ACCOUNT_RESPONSE_HEADERS });
            const expireCookie = dependencies.expireCookie ?? ((target: NextResponse) => {
                target.cookies.set(
                    AUTH_COOKIE_NAME,
                    "",
                    getExpiredAuthCookieOptions(dependencies.nodeEnvironment),
                );
                target.cookies.set(VERIFICATION_COOKIE_NAME, "", getExpiredAuthCookieOptions(dependencies.nodeEnvironment));
            });

            expireCookie(response);
            return response;
        } catch (error) {
            if (error instanceof Error && error.name === "AccountError") return accountErrorResponse(error);
            return NextResponse.json(internalErrorFailure(), { status: 500, headers: ACCOUNT_RESPONSE_HEADERS });
        }
    };
}

export const POST = createLogoutHandler({
    nodeEnvironment: process.env.NODE_ENV,
});

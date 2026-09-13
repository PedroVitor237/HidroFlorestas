import { NextResponse } from "next/server";

import { internalErrorFailure } from "../../server/auth/auth.contracts";
import {
    AUTH_COOKIE_NAME,
    getExpiredAuthCookieOptions,
} from "../../server/auth/session";

type LogoutHandlerDependencies = {
    nodeEnvironment?: string;
    expireCookie?: (response: NextResponse) => void;
};

export function createLogoutHandler(dependencies: LogoutHandlerDependencies = {}) {
    return async function logoutHandler() {
        try {
            const response = NextResponse.json({ success: true as const });
            const expireCookie = dependencies.expireCookie ?? ((target: NextResponse) => {
                target.cookies.set(
                    AUTH_COOKIE_NAME,
                    "",
                    getExpiredAuthCookieOptions(dependencies.nodeEnvironment),
                );
            });

            expireCookie(response);
            return response;
        } catch {
            return NextResponse.json(internalErrorFailure(), { status: 500 });
        }
    };
}

export const POST = createLogoutHandler({
    nodeEnvironment: process.env.NODE_ENV,
});

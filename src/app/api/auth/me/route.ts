import { NextRequest, NextResponse } from "next/server";

import {
    internalErrorFailure,
    serializePublicUser,
    unauthenticatedFailure,
} from "../../server/auth/auth.contracts";
import type { AuthenticatedPrincipal } from "../../server/auth/auth.core";
import {
    AUTH_COOKIE_NAME,
    getExpiredAuthCookieOptions,
} from "../../server/auth/session";
import {
    AuthBoundaryError,
    requireAuth,
} from "../../server/middlewares/auth.middleware";

type MeHandlerDependencies = {
    requireAuth: () => Promise<AuthenticatedPrincipal>;
    nodeEnvironment?: string;
};

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export function createMeHandler(dependencies: MeHandlerDependencies) {
    return async function meHandler(req: NextRequest) {
        try {
            const principal = await dependencies.requireAuth();
            return NextResponse.json(
                {
                    success: true as const,
                    user: serializePublicUser(principal),
                },
                { headers: NO_STORE_HEADERS },
            );
        } catch (error) {
            if (
                error instanceof AuthBoundaryError &&
                error.code === "UNAUTHORIZED"
            ) {
                const response = NextResponse.json(unauthenticatedFailure(), {
                    status: 401,
                    headers: NO_STORE_HEADERS,
                });

                if (req.cookies.has(AUTH_COOKIE_NAME)) {
                    response.cookies.set(
                        AUTH_COOKIE_NAME,
                        "",
                        getExpiredAuthCookieOptions(dependencies.nodeEnvironment),
                    );
                }
                return response;
            }

            return NextResponse.json(internalErrorFailure(), {
                status: 500,
                headers: NO_STORE_HEADERS,
            });
        }
    };
}

export const GET = createMeHandler({
    requireAuth,
    nodeEnvironment: process.env.NODE_ENV,
});

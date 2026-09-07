import { NextRequest, NextResponse } from "next/server";
import auth from "../../server/services/auth.service";
import type { SignInServiceResult } from "../../server/services/auth.service";
import {
    internalErrorFailure,
    invalidCredentialsFailure,
    invalidRequestFailure,
    parseSignInInput,
    serializePublicUser,
    type SignInInput,
} from "../../server/auth/auth.contracts";
import {
    AUTH_COOKIE_NAME,
    getAuthCookieOptions,
} from "../../server/auth/session";

type SignInHandlerDependencies = {
    signIn: (input: SignInInput) => Promise<SignInServiceResult>;
    nodeEnvironment?: string;
};

export function createSignInHandler(dependencies: SignInHandlerDependencies) {
    return async function signInHandler(req: NextRequest) {
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(invalidRequestFailure(), { status: 400 });
        }

        const parsed = parseSignInInput(body);
        if (!parsed.success) {
            return NextResponse.json(parsed.failure, { status: 400 });
        }

        try {
            const result = await dependencies.signIn(parsed.data);

            if (!result.success) {
                if (result.reason === "INVALID_CREDENTIALS") {
                    return NextResponse.json(invalidCredentialsFailure(), { status: 401 });
                }

                return NextResponse.json(internalErrorFailure(), { status: 500 });
            }

            const response = NextResponse.json({
                success: true as const,
                user: serializePublicUser(result.user),
            });
            response.cookies.set(
                AUTH_COOKIE_NAME,
                result.token,
                getAuthCookieOptions(dependencies.nodeEnvironment),
            );
            return response;
        } catch {
            return NextResponse.json(internalErrorFailure(), { status: 500 });
        }
    };
}

export const POST = createSignInHandler({
    signIn: (input) => auth.signIn(input),
    nodeEnvironment: process.env.NODE_ENV,
});

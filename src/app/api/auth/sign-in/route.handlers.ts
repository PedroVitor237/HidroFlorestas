import { NextRequest, NextResponse } from "next/server";
import { accountBody, accountErrorResponse, accountIngress, accountSessionResponse, checkAccountCsrf, ACCOUNT_RESPONSE_HEADERS } from "../../server/accounts/http";
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
    signIn: (input: SignInInput, request?: NextRequest) => Promise<SignInServiceResult>;
    nodeEnvironment?: string;
};

export function createSignInHandler(dependencies: SignInHandlerDependencies) {
    return async function signInHandler(req: NextRequest) {
        let body: unknown;
        try {
            checkAccountCsrf(req);
            body = await accountBody(req);
        } catch (error) {
            if (error instanceof Error && error.name === "AccountError" && "code" in error && error.code !== "INVALID_REQUEST") return accountErrorResponse(error);
            return NextResponse.json(invalidRequestFailure(), { status: 400, headers: ACCOUNT_RESPONSE_HEADERS });
        }

        const parsed = parseSignInInput(body);
        if (!parsed.success) {
            return NextResponse.json(parsed.failure, { status: 400, headers: ACCOUNT_RESPONSE_HEADERS });
        }

        try {
            const result = await dependencies.signIn(parsed.data, req);

            if (!result.success) {
                if (result.reason === "INVALID_CREDENTIALS") {
                    return NextResponse.json(invalidCredentialsFailure(), { status: 401, headers: ACCOUNT_RESPONSE_HEADERS });
                }

                return NextResponse.json(internalErrorFailure(), { status: 500, headers: ACCOUNT_RESPONSE_HEADERS });
            }

            if (result.purpose) return accountSessionResponse({ ...result, purpose: result.purpose }, 200, dependencies.nodeEnvironment);
            const response = NextResponse.json({
                success: true as const,
                user: serializePublicUser(result.user),
                destination: result.destination,
            }, { headers: ACCOUNT_RESPONSE_HEADERS });
            response.cookies.set(
                AUTH_COOKIE_NAME,
                result.token,
                getAuthCookieOptions(dependencies.nodeEnvironment),
            );
            return response;
        } catch (error) {
            if (error instanceof Error && error.name === "AccountError") return accountErrorResponse(error);
            return NextResponse.json(internalErrorFailure(), { status: 500, headers: ACCOUNT_RESPONSE_HEADERS });
        }
    };
}

export const POST = createSignInHandler({
    signIn: async (input, request) => {
        const { accounts } = await import("../../server/accounts/service");
        return accounts.login(input, request ? accountIngress(request) : "unknown-ingress");
    },
    nodeEnvironment: process.env.NODE_ENV,
});

import { cookies } from "next/headers";
import {
    authenticateSession,
    type SessionAuthenticationResult,
} from "../auth/auth.core";
import { AUTH_COOKIE_NAME, verifySessionToken } from "../auth/session";
import userService from "../services/users.service";

type AuthAdapters = {
    readToken: () => Promise<string | undefined>;
    authenticateSession: (token: string | undefined) => Promise<SessionAuthenticationResult>;
};

export class AuthBoundaryError extends Error {
    constructor(public readonly code: "UNAUTHORIZED" | "INTERNAL_ERROR") {
        super(code);
        this.name = "AuthBoundaryError";
    }
}

export async function requireAuthWithAdapters(adapters: AuthAdapters) {
    const token = await adapters.readToken();
    const result = await adapters.authenticateSession(token);

    if (!result.success) {
        throw new AuthBoundaryError(
            result.reason === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "INTERNAL_ERROR",
        );
    }

    return result.principal;
}

export async function requireAuth() {
    return requireAuthWithAdapters({
        readToken: async () => {
            const cookieStore = await cookies();
            return cookieStore.get(AUTH_COOKIE_NAME)?.value;
        },
        authenticateSession: (token) =>
            authenticateSession(token, {
                verifyToken: verifySessionToken,
                findCurrentIdentity: (id) => userService.getCurrentIdentityById(id),
            }),
    });
}

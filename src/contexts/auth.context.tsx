'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    parseAuthEnvelope,
    type AuthEnvelope,
    type PublicUserDto,
} from "@/types/auth.type";

type FetchOptions = {
    force?: boolean;
    redirectOnUnauthenticated?: boolean;
};

type SignInData = {
    email: string;
    password: string;
};

type SignUpData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

type AuthActionResult =
    | { success: true }
    | { success: false; message: string };

type AuthContextType = {
    user: PublicUserDto | null;
    fetchUserData: (options?: FetchOptions) => Promise<void>;
    signIn: (data: SignInData) => Promise<AuthActionResult>;
    signUp: (data: SignUpData, idempotencyKey: string) => Promise<AuthActionResult>;
    logout: () => Promise<AuthActionResult>;
    clearAuthenticatedUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const CONNECTION_FAILURE_MESSAGE = "Não foi possível conectar ao servidor.";
const INVALID_RESPONSE_MESSAGE = "Não foi possível concluir a solicitação.";

async function readAuthEnvelope(response: Response): Promise<AuthEnvelope | null> {
    try {
        return parseAuthEnvelope(await response.json());
    } catch {
        return null;
    }
}

function publicMessage(value: unknown, fallback: string): string {
    if (
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        typeof value.message === "string"
    ) {
        return value.message;
    }
    return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUserDto | null>(null);
    const router = useRouter();

    const fetchUserData = useCallback(async (options?: FetchOptions) => {
        if (user && !options?.force) {
            return;
        }

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            const result = await readAuthEnvelope(response);

            if (
                response.ok &&
                result?.success === true &&
                "user" in result
            ) {
                setUser(result.user);
                return;
            }

            if (
                response.status === 401 &&
                result?.success === false &&
                result.code === "UNAUTHENTICATED"
            ) {
                setUser(null);
                toast.warning(result.message);
                if (options?.redirectOnUnauthenticated) {
                    router.replace("/login");
                    router.refresh();
                }
                return;
            }

            const message = result?.success === false
                ? result.message
                : INVALID_RESPONSE_MESSAGE;
            toast.error(message);
        } catch {
            toast.error(CONNECTION_FAILURE_MESSAGE);
        }
    }, [user, router]);

    const signIn = useCallback(async (
        data: SignInData,
    ): Promise<AuthActionResult> => {
        toast.loading("Entrando...", { id: "login" });

        try {
            const response = await fetch("/api/auth/sign-in", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await readAuthEnvelope(response);

            if (
                !response.ok ||
                result?.success !== true ||
                !("user" in result)
            ) {
                const message = result?.success === false ? result.message : INVALID_RESPONSE_MESSAGE;
                toast.error(message, { id: "login" });
                return { success: false, message };
            }

            setUser(result.destination === "/verify-email" ? null : result.user);
            toast.success(result.destination === "/verify-email" ? "Confirme seu e-mail para continuar." : "Login realizado com sucesso!", { id: "login" });
            router.push(result.destination ?? "/workspace");
            router.refresh();
            return { success: true };
        } catch {
            toast.error(CONNECTION_FAILURE_MESSAGE, { id: "login" });
            return { success: false, message: CONNECTION_FAILURE_MESSAGE };
        }
    }, [router]);

    async function signUp(data: SignUpData, idempotencyKey: string): Promise<AuthActionResult> {
        toast.loading("Criando conta...", { id: "signup" });

        try {
            const response = await fetch("/api/auth/sign-up", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
                body: JSON.stringify(data),
            });
            const result = await readAuthEnvelope(response);

            if (!response.ok || result?.success !== true || !("user" in result)) {
                const message = publicMessage(result, "Não foi possível criar a conta. Tente novamente.");
                toast.error(message, {
                    id: "signup",
                });
                return { success: false, message };
            }

            setUser(result.destination === "/verify-email" ? null : result.user);
            toast.success("Solicitação recebida. Confira seu e-mail.", { id: "signup" });
            router.push(result.destination ?? "/verify-email");
            router.refresh();
            return { success: true };
        } catch {
            toast.error(CONNECTION_FAILURE_MESSAGE, { id: "signup" });
            return { success: false, message: CONNECTION_FAILURE_MESSAGE };
        }
    }

    const logout = useCallback(async (): Promise<AuthActionResult> => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            const result = await readAuthEnvelope(response);

            if (
                !response.ok ||
                result?.success !== true ||
                "user" in result
            ) {
                const message =
                    result?.success === false && result.code === "INTERNAL_ERROR"
                        ? result.message
                        : INVALID_RESPONSE_MESSAGE;
                toast.error(message, { id: "logout" });
                return { success: false, message };
            }

            setUser(null);
            router.replace("/login");
            router.refresh();
            return { success: true };
        } catch {
            toast.error(CONNECTION_FAILURE_MESSAGE, { id: "logout" });
            return { success: false, message: CONNECTION_FAILURE_MESSAGE };
        }
    }, [router]);

    return (
        <AuthContext.Provider
            value={{ user, fetchUserData, signIn, signUp, logout, clearAuthenticatedUser: () => setUser(null) }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}

export function AuthSessionRestorer() {
    const { fetchUserData } = useAuth();

    useEffect(() => {
        void fetchUserData({ redirectOnUnauthenticated: true });
        const onPageHide = (event: PageTransitionEvent) => {
            if (event.persisted) document.documentElement.style.visibility = "hidden";
        };
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) window.location.reload();
        };
        window.addEventListener("pagehide", onPageHide);
        window.addEventListener("pageshow", onPageShow);
        return () => {
            window.removeEventListener("pagehide", onPageHide);
            window.removeEventListener("pageshow", onPageShow);
        };
    }, [fetchUserData]);

    return null;
}

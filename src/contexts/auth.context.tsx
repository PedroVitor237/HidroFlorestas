'use client';

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserType } from "@/app/api/server/types/database-tables.type";


type FetchOptions = {
    force?: boolean;
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

type AuthContextType = {
    user: UserType | null;
    fetchUserData: (options?: FetchOptions) => Promise<void>;
    signIn: (data: SignInData) => Promise<boolean>;
    signUp: (data: SignUpData) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();

    async function fetchUserData(options?: FetchOptions) {

        if (user && !options?.force) {
            return;
        }

        try {

            const res = await fetch("/api/auth/me", {
                method: 'POST',
                credentials: "include"
            });

            if (res.status === 401) {

                toast.warning("Sua sessão expirou. Faça login novamente.");

                logout();
                return;
            }

            if (!res.ok) {
                throw new Error("Erro ao buscar usuário");
            }

            const data = await res.json();

            setUser(data.user);

        } catch (error) {

            console.error("Erro ao buscar usuário", error);

        }

    }

    async function signIn(data: SignInData) {

        const promise = fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        toast.loading("Entrando...", { id: "login" });

        try {

            const res = await promise;
            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Erro ao fazer login", { id: "login" });
                return false;
            }

            toast.success("Login realizado com sucesso!", { id: "login" });

            await fetchUserData({ force: true });

            router.push("/dashboard");

            return true;

        } catch {

            toast.error("Erro ao conectar ao servidor", { id: "login" });
            return false;

        }

    }

    async function signUp(data: SignUpData) {

        const promise = fetch("/api/auth/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        toast.loading("Criando conta...", { id: "signup" });

        try {

            const res = await promise;
            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Erro ao criar conta", { id: "signup" });
                return false;
            }

            toast.success("Conta criada com sucesso!", { id: "signup" });

            await fetchUserData({ force: true });

            router.push("/dashboard");

            return true;

        } catch {

            toast.error("Erro ao conectar ao servidor", { id: "signup" });
            return false;

        }

    }

    function logout() {

        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00";

        setUser(null);

        router.push("/login");

    }

    return (
        <AuthContext.Provider
            value={{
                user,
                fetchUserData,
                signIn,
                signUp,
                logout
            }}
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
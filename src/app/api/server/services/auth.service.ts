import userService from "./users.service";
import { UserType } from "../types/database-tables.type";
import {
    authenticateCredentials,
    type CredentialUser,
} from "../auth/auth.core";
import {
    authenticatedDestination,
    serializePublicUser,
    type SignInInput,
} from "../auth/auth.contracts";
import { verifySessionToken, type SessionPurpose } from "../auth/session";
import type { PublicUserDto } from "@/types/auth.type";

export type AuthServiceDependencies = {
    findCredentialUser: (email: string) => Promise<CredentialUser | null>;
    comparePassword: (plainText: string, hash: string) => Promise<boolean>;
    issueToken: (userId: string, credentialVersion?: number, purpose?: SessionPurpose) => string;
};

export type SignUpServiceDependencies = {
    getUserByEmail: (email: string) => Promise<{ id: string } | null>;
    hashPassword: (plainText: string) => Promise<string>;
    createUser: (data: Pick<UserType, "email" | "firstName" | "lastName"> & {
        password: string;
        status: "ACTIVE";
    }) => Promise<{
        id: string;
        firstName: string;
        lastName: string;
        image: string;
    } | null>;
    issueToken: (userId: string) => string;
};

export type SignInServiceResult =
    | { success: true; token: string; user: PublicUserDto; destination: "/admin" | "/workspace" | "/verify-email"; purpose?: SessionPurpose }
    | { success: false; reason: "INVALID_CREDENTIALS" | "INTERNAL_ERROR" };

export class AuthService {

    constructor(
        private readonly signInDependencies?: AuthServiceDependencies,
        private readonly signUpDependencies?: SignUpServiceDependencies,
    ) {}

    verifyToken(token: string) {
        return verifySessionToken(token);
    }

    async signUp(data: UserType, idempotencyKey?: string) {
        if (!this.signUpDependencies) {
            const { accounts } = await import("../accounts/service");
            return accounts.signup(data, idempotencyKey ?? "", "internal-unknown");
        }
        try {

            const { email, password } = data;

            if (!email || !password) {
                return { success: false, message: "Email e senha obrigatórios" };
            }

            const userExists = await this.signUpDependencies.getUserByEmail(email);

            if (userExists) {
                return { success: false, message: "já há uma conta com este e-mail." };
            }

            const hashedPassword = await this.signUpDependencies.hashPassword(password);

            const user = await this.signUpDependencies.createUser({
                email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: hashedPassword,
                status: "ACTIVE",
            });

            if (!user) {
                return { success: false, message: "Erro ao criar usuário" };
            }

            const token = this.signUpDependencies.issueToken(user.id);

            return {
                success: true,
                token,
                user: serializePublicUser(user)
            };

        } catch {
            return { success: false, message: "Erro interno no cadastro" };
        }
    }

    async signIn(input: SignInInput): Promise<SignInServiceResult> {
        if (!this.signInDependencies) {
            const { accounts } = await import("../accounts/service");
            return accounts.login(input, "internal-unknown");
        }
        const result = await authenticateCredentials(input, this.signInDependencies);

        if (!result.success) {
            return result;
        }

        return {
            success: true,
            token: result.token,
            user: serializePublicUser(result.principal),
            destination: result.purpose === "email-verification" ? "/verify-email" : authenticatedDestination(result.principal.role),
            ...(result.purpose ? { purpose: result.purpose } : {}),
        };
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string) {
        try {

            const { accounts } = await import("../accounts/service");
            await accounts.changePassword(userId, { currentPassword, newPassword, confirmPassword: newPassword }, "internal-unknown");

            return {
                success: true,
                message: "Senha atualizada com sucesso"
            };

        } catch {
            return { success: false, message: "Erro ao atualizar senha" };
        }
    }

    async updateUser(userId: string, data: Partial<UserType>) {
        try {

            if (data.password) {
                delete data.password;
            }

            const user = await userService.updateUser(userId, data);

            if (!user) {
                return { success: false, message: "Erro ao atualizar usuário" };
            }

            return {
                success: true,
                user: serializePublicUser(user)
            };

        } catch {
            return { success: false, message: "Erro ao atualizar usuário" };
        }
    }

}

const auth = new AuthService();
export default auth;

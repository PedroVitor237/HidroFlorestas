import bcrypt from "bcrypt";
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
import { signSessionToken, verifySessionToken } from "../auth/session";
import type { PublicUserDto } from "@/types/auth.type";

const SALT_ROUNDS = 10;

export type AuthServiceDependencies = {
    findCredentialUser: (email: string) => Promise<CredentialUser | null>;
    comparePassword: (plainText: string, hash: string) => Promise<boolean>;
    issueToken: (userId: string) => string;
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
    | { success: true; token: string; user: PublicUserDto; destination: "/admin" | "/workspace" }
    | { success: false; reason: "INVALID_CREDENTIALS" | "INTERNAL_ERROR" };

const defaultSignInDependencies: AuthServiceDependencies = {
    findCredentialUser: (email) => userService.getCredentialUserByEmail(email),
    comparePassword: bcrypt.compare,
    issueToken: signSessionToken,
};

const defaultSignUpDependencies: SignUpServiceDependencies = {
    getUserByEmail: (email) => userService.getUserByEmail(email),
    hashPassword: (plainText) => bcrypt.hash(plainText, SALT_ROUNDS),
    createUser: (data) => userService.create(data),
    issueToken: signSessionToken,
};

export class AuthService {

    constructor(
        private readonly signInDependencies: AuthServiceDependencies = defaultSignInDependencies,
        private readonly signUpDependencies: SignUpServiceDependencies = defaultSignUpDependencies,
    ) {}

    verifyToken(token: string) {
        return verifySessionToken(token);
    }

    async signUp(data: UserType) {
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
        const result = await authenticateCredentials(input, this.signInDependencies);

        if (!result.success) {
            return result;
        }

        return {
            success: true,
            token: result.token,
            user: serializePublicUser(result.principal),
            destination: authenticatedDestination(result.principal.role),
        };
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string) {
        try {

            const user = await userService.getUserById(userId);

            if (!user || !user.password) {
                return { success: false, message: "Usuário não encontrado" };
            }

            const passwordMatch = await bcrypt.compare(currentPassword, user.password);

            if (!passwordMatch) {
                return { success: false, message: "Senha atual inválida" };
            }

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

            await userService.updatePassword(userId, hashedPassword);

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
                user
            };

        } catch {
            return { success: false, message: "Erro ao atualizar usuário" };
        }
    }

}

const auth = new AuthService();
export default auth;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "./users.service";
import { UserType } from "../types/database-tables.type";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export type PayloadToken = {
    userId: string;
};

export class AuthService {

    private generateToken(payload: PayloadToken) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: "7d"
        });
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as PayloadToken;
        } catch {
            return null;
        }
    }

    async signUp(data: UserType) {
        try {

            const { email, password } = data;

            if (!email || !password) {
                return { success: false, message: "Email e senha obrigatórios" };
            }

            const userExists = await userService.getUserByEmail(email);

            if (userExists) {
                return { success: false, message: "já há uma conta com este e-mail." };
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await userService.create({
                ...data,
                password: hashedPassword,
            });

            if (!user) {
                return { success: false, message: "Erro ao criar usuário" };
            }

            const token = this.generateToken({
                userId: user.id
            });

            return {
                success: true,
                token,
                user
            };

        } catch {
            return { success: false, message: "Erro interno no cadastro" };
        }
    }

    async signIn(email: string, password: string) {
        try {

            const user = await userService.getUserByEmail(email);

            if (!user || !user.password) {
                return { success: false, message: "Email ou senha inválidos" };
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return { success: false, message: "Email ou senha inválidos" };
            }

            if (user.status === "BLOCKED" || user.status === "INACTIVE") {
                return { success: false, message: "Usuário inativo ou bloqueado" };
            }

            const token = this.generateToken({
                userId: user.id
            });

            return {
                success: true,
                token,
                user
            };

        } catch {
            return { success: false, message: "Erro interno no login" };
        }
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
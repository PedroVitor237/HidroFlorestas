import { prisma } from "../lib/prisma";
import { UserType } from "../types/database-tables.type";

export class UserService {

    async getCredentialUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
                password: true,
                status: true,
                role: true,
                isAdmin: true,
            },
        });
    }

    async getCurrentIdentityById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
                status: true,
                role: true,
                isAdmin: true,
            },
        });
    }

    async create(data: UserType) {
        try {
            const user = await prisma.user.create({
                data: {
                    ...data,
                    password: data.password as string
                }
            });

            return user;
        } catch {
            return null;
        }
    }

    async getUserById(id: string) {
        try {
            return await prisma.user.findUnique({
                where: { id }
            });
        } catch {
            return null;
        }
    }

    async getUserByEmail(email: string) {
        try {
            return await prisma.user.findUnique({
                where: { email }
            });
        } catch {
            return null;
        }
    }

    async updatePassword(userId: string, password: string) {
        try {
            return await prisma.user.update({
                where: { id: userId },
                data: { password }
            });
        } catch {
            return null;
        }
    }

    async updateUser(userId: string, data: Partial<UserType>) {
        try {
            return await prisma.user.update({
                where: { id: userId },
                data
            });
        } catch {
            return null;
        }
    }
}

const userService = new UserService();
export default userService;

import { prisma } from "../lib/prisma";
import { UserType } from "../types/database-tables.type";
import { Prisma } from "@/generated/prisma";
import type { CredentialUser } from "../auth/auth.core";
import { normalizeEmail } from "../accounts/contracts";

export class UserService {

    async getCredentialUserByEmail(email: string) {
        const canonical = normalizeEmail(email).canonical;
        const matches = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "User" WHERE lower(btrim("email"))=${canonical} LIMIT 2`);
        if (matches.length !== 1) return null;
        return prisma.user.findUnique({
            where: { id: matches[0].id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
                password: true,
                status: true,
                role: true,
                credentialVersion: true,
                emailVerifiedAt: true,
                verificationRequired: true,
            },
        });
    }

    async revalidateCredentialUser(user: CredentialUser) {
        return prisma.$transaction(async (tx) => {
            await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "User" WHERE "id"=${user.id} FOR UPDATE`);
            return tx.user.findFirst({ where: { id: user.id, password: user.password, credentialVersion: user.credentialVersion ?? 0 }, select: {
                id: true, firstName: true, lastName: true, image: true, status: true, role: true,
                credentialVersion: true, emailVerifiedAt: true, verificationRequired: true,
            } });
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
                credentialVersion: true,
                emailVerifiedAt: true,
                verificationRequired: true,
            },
        });
    }

    async create(data: UserType) {
        try {
            const address = normalizeEmail(data.email);
            const user = await prisma.user.create({
                data: {
                    ...data,
                    email: address.factual,
                    emailCanonical: address.canonical,
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
            const canonical = normalizeEmail(email).canonical;
            const matches = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`SELECT "id" FROM "User" WHERE lower(btrim("email"))=${canonical} LIMIT 2`);
            if (matches.length !== 1) return null;
            return await prisma.user.findUnique({
                where: { id: matches[0].id }
            });
        } catch {
            return null;
        }
    }

    async updateUser(userId: string, data: Partial<UserType>) {
        try {
            return await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
                    ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
                    ...(data.image !== undefined ? { image: data.image } : {}),
                }
            });
        } catch {
            return null;
        }
    }
}

const userService = new UserService();
export default userService;

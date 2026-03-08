import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import userService from "../services/users.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function requireAuth() {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("UNAUTHORIZED");
    }

    try {

        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await userService.getUserById(payload.userId);

        if (!user) {
            throw new Error("UNAUTHORIZED");
        }

        return user;

    } catch {
        throw new Error("UNAUTHORIZED");
    }
}
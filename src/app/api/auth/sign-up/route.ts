'use server';

import { NextRequest, NextResponse } from "next/server";
import auth from "../../server/services/auth.service";

export async function POST(req: NextRequest) {
    try {

        const body: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        } = await req.json();

        const result = await auth.signUp(body);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        const response = NextResponse.json({
            success: true,
            user: result.user
        });

        response.cookies.set("auth_token", result.token as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Ocorreu um erro inesperado em nossos servidores." },
            { status: 500 }
        );
    }
}
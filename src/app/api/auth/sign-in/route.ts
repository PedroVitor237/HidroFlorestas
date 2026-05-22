'use server';

import { NextRequest, NextResponse } from "next/server";
import auth from "../../server/services/auth.service";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const result = await auth.signIn(body.email, body.password);

        if (!result.success) {
            return NextResponse.json(result, { status: 401 });
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
        console.error("Erro ao processar a requisição de login");
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Ocorreu um erro inesperado em nossos servidores." },
            { status: 500 }
        );
    }
}
'use server';
import { NextResponse } from "next/server";
import { requireAuth } from "../../server/middlewares/auth.middleware";

export async function POST() {
    try {

        const user = await requireAuth();

        return NextResponse.json({
            success: true,
            user: {...user, password: undefined}
        });

    } catch (error) {

        if (error instanceof Error) {

            if (error.message === "UNAUTHORIZED") {
                return NextResponse.json(
                    { success: false, message: "Não autenticado" },
                    { status: 401 }
                );
            }

        }

        return NextResponse.json(
            { success: false, message: "Erro interno" },
            { status: 500 }
        );
    }
}
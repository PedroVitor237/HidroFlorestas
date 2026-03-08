import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {

    const token = req.cookies.get("token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
};
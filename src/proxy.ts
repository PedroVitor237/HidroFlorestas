import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/workspace");
    
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        const dashboardUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/workspace/:path*", "/login", "/register"]
};
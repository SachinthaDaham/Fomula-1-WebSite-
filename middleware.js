/**
 * middleware.js
 * Protects the /dashboard route: redirects unauthenticated users to /login.
 */

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Only protect /dashboard routes
    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("f1manager_token")?.value;

        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            // Token is invalid or expired
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("from", pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.set("f1manager_token", "", { maxAge: 0, path: "/" });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};

/**
 * app/api/auth/logout/route.js
 * POST /api/auth/logout — Clear the JWT cookie to log out
 */

import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { success: true, message: "Logged out successfully." },
        { status: 200 }
    );

    response.cookies.set("f1manager_token", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });

    return response;
}

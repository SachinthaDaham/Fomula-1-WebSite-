/**
 * app/api/auth/me/route.js
 * GET /api/auth/me — Verify current session and return user profile
 */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const token = request.cookies.get("f1manager_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: decoded.userId,
                    name: decoded.name,
                    email: decoded.email,
                    role: decoded.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid or expired session." },
            { status: 401 }
        );
    }
}

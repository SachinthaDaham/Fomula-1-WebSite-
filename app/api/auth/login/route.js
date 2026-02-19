/**
 * app/api/auth/login/route.js
 * POST /api/auth/login — Authenticate user and issue JWT cookie
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not defined in environment variables.");
            return NextResponse.json(
                { success: false, message: "Server configuration error: JWT_SECRET is missing." },
                { status: 500 }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful.",
                data: { id: user._id, name: user.name, email: user.email, role: user.role },
            },
            { status: 200 }
        );

        response.cookies.set("f1manager_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("[AUTH LOGIN ERROR]", error);
        return NextResponse.json(
            { success: false, message: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

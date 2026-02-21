/**
 * app/api/auth/register/route.js
 * POST /api/auth/register — Create a new user account
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // 1. Sanitize Inputs
        const trimmedName = name?.trim();
        const trimmedEmail = email?.trim()?.toLowerCase();
        const trimmedPassword = password?.trim();

        // 2. Strict Validation
        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            return NextResponse.json(
                { success: false, message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        if (trimmedPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return NextResponse.json(
                { success: false, message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(trimmedPassword, 12);

        const user = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword,
            role: "user", // Explicitly set role to user
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully.",
                data: { id: user._id, name: user.name, email: user.email, role: user.role },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[AUTH REGISTER ERROR]", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return NextResponse.json({ success: false, message: `Validation Error: ${messages.join(", ")}` }, { status: 400 });
        }
        return NextResponse.json(
            { success: false, message: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

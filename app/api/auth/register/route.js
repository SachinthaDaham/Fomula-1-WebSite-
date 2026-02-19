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

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
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

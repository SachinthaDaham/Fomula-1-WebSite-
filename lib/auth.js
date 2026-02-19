import jwt from "jsonwebtoken";
import { AppError } from "./errors";

/**
 * ensures the current request is from an authenticated admin.
 * throws AppError if not.
 */
export async function ensureAdmin(request) {
    const token = request.cookies.get("f1manager_token")?.value;

    if (!token) {
        throw new AppError("Not authenticated.", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            throw new AppError("Forbidden: Admin access required.", 403);
        }
        return decoded;
    } catch (error) {
        if (error.name === "AppError") throw error;
        throw new AppError("Invalid or expired session.", 401);
    }
}

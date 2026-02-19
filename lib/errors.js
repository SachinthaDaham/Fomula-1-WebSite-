/**
 * lib/errors.js — Centralized Error Handling
 *
 * Provides:
 *  - AppError: a structured error class with HTTP status codes
 *  - withErrorHandler: a higher-order function that wraps route handlers
 *    and converts thrown AppErrors (or unexpected errors) into consistent
 *    JSON responses, so every route stays clean and DRY.
 */

import { NextResponse } from "next/server";

// ─── Custom Error Class ───────────────────────────────────────────────────────

/**
 * AppError extends the native Error with an HTTP status code and optional
 * field-level validation errors array.
 *
 * Usage:
 *   throw new AppError("Team not found.", 404);
 *   throw new AppError("Validation failed.", 400, ["name is required"]);
 */
export class AppError extends Error {
    /**
     * @param {string}   message  - Human-readable error description
     * @param {number}   status   - HTTP status code (400, 404, 409, 422, 500…)
     * @param {string[]} [errors] - Optional array of field-level error messages
     */
    constructor(message, status = 500, errors = []) {
        super(message);
        this.name = "AppError";
        this.status = status;
        this.errors = errors;
    }
}

// ─── Route Handler Wrapper ────────────────────────────────────────────────────

/**
 * withErrorHandler wraps an async Next.js route handler and catches:
 *  - AppError → returns its status + message + errors
 *  - Any other Error → logs it and returns a generic 500
 *
 * @param {Function} handler - Async route handler (request, context) => NextResponse
 * @returns {Function} Wrapped handler safe to export from route files
 *
 * Usage in a route file:
 *   export const GET = withErrorHandler(async (req, ctx) => { ... });
 */
export function withErrorHandler(handler) {
    return async function (request, context) {
        try {
            return await handler(request, context);
        } catch (err) {
            // Known application error — return structured response
            if (err instanceof AppError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: err.message,
                        ...(err.errors.length > 0 && { errors: err.errors }),
                    },
                    { status: err.status }
                );
            }

            // Unexpected runtime error — log and return generic 500
            console.error("[Unhandled Error]", err);
            return NextResponse.json(
                { success: false, message: "An unexpected internal server error occurred." },
                { status: 500 }
            );
        }
    };
}

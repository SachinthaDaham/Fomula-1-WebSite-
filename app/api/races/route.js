/**
 * app/api/races/route.js
 *
 * GET  /api/races  — List all races
 * POST /api/races  — Create a new race
 */

import { NextResponse } from "next/server";
import { racesStore } from "@/lib/store";
import { AppError, withErrorHandler } from "@/lib/errors";

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRaceBody(body) {
    const errors = [];
    if (!body.name || typeof body.name !== "string" || !body.name.trim())
        errors.push("'name' is required.");
    if (!body.circuit || typeof body.circuit !== "string" || !body.circuit.trim())
        errors.push("'circuit' is required.");
    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))
        errors.push("'date' is required in YYYY-MM-DD format.");
    if (body.season === undefined || isNaN(Number(body.season)) || Number(body.season) < 1950)
        errors.push("'season' is required and must be a valid year (>= 1950).");
    if (errors.length > 0) throw new AppError("Validation failed.", 400, errors);
}

// ─── GET /api/races ───────────────────────────────────────────────────────────

export const GET = withErrorHandler(async () => {
    const races = racesStore.getAll();
    // Sort by date ascending
    const sorted = [...races].sort((a, b) => new Date(a.date) - new Date(b.date));
    return NextResponse.json({ success: true, count: sorted.length, data: sorted }, { status: 200 });
});

// ─── POST /api/races ──────────────────────────────────────────────────────────

export const POST = withErrorHandler(async (request) => {
    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });

    validateRaceBody(body);

    const race = racesStore.create(body);
    return NextResponse.json({ success: true, message: "Race created.", data: race }, { status: 201 });
});

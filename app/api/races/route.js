/**
 * app/api/races/route.js
 *
 * GET  /api/races  — List all races
 * POST /api/races  — Create a new race
 */

import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth";
import Race from "@/models/Race";
import { AppError, withErrorHandler } from "@/lib/errors";
import connectDB from "@/lib/mongodb";

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

export const GET = withErrorHandler(async (request) => {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");

    const query = {};
    if (season) query.season = Number(season);

    const races = await Race.find(query).sort({ date: 1 });
    return NextResponse.json({ success: true, count: races.length, data: races }, { status: 200 });
});

// ─── POST /api/races ──────────────────────────────────────────────────────────

export const POST = withErrorHandler(async (request) => {
    await ensureAdmin(request);
    await connectDB();

    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });

    validateRaceBody(body);

    // Auto-increment ID if not provided
    if (!body.id) {
        const lastRace = await Race.findOne().sort({ id: -1 });
        body.id = lastRace ? lastRace.id + 1 : 1000;
    }

    const race = await Race.create(body);
    return NextResponse.json({ success: true, message: "Race created.", data: race }, { status: 201 });
});

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Race from "@/models/Race";
import { withErrorHandler, AppError } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";
import { enforceRaceNotFinalized } from "@/lib/rules";

// Helper to parse ID
function parseId(raw) {
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) throw new AppError("ID must be a positive integer.", 400);
    return id;
}

// ─── GET /api/races/:id ───────────────────────────────────────────────────────

export const GET = withErrorHandler(async (_, { params }) => {
    await connectDB();
    const id = parseId(params.id);
    const race = await Race.findOne({ id }).lean();
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    return NextResponse.json({ success: true, data: race });
});

// ─── PUT /api/races/:id ───────────────────────────────────────────────────────

export const PUT = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const id = parseId(params.id);

    const race = await Race.findOne({ id });
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    // Business Rule Check
    enforceRaceNotFinalized(race);

    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });

    if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        throw new AppError("'date' must be in YYYY-MM-DD format.", 400);
    }

    const updated = await Race.findOneAndUpdate({ id }, body, { new: true });
    return NextResponse.json({ success: true, message: "Race updated.", data: updated });
});

// ─── DELETE /api/races/:id ────────────────────────────────────────────────────

export const DELETE = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const id = parseId(params.id);

    const race = await Race.findOne({ id });
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    // Business Rule Check
    enforceRaceNotFinalized(race);

    await Race.findOneAndDelete({ id });

    return NextResponse.json({ success: true, message: `Race "${race.name}" deleted.` });
});

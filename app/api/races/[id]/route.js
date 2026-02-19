/**
 * app/api/races/[id]/route.js
 *
 * GET    /api/races/:id  — Get a single race with its results
 * PUT    /api/races/:id  — Update race details (blocked if finalized)
 * DELETE /api/races/:id  — Delete race (blocked if finalized)
 */

import { NextResponse } from "next/server";
import { racesStore, resultsStore, driversStore, teamsStore } from "@/lib/store";
import { AppError, withErrorHandler } from "@/lib/errors";
import { enforceRaceNotFinalized } from "@/lib/rules";

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) throw new AppError("ID must be a positive integer.", 400);
    return id;
}

// ─── GET /api/races/:id ───────────────────────────────────────────────────────

export const GET = withErrorHandler(async (_, { params }) => {
    const id = parseId(params.id);
    const race = racesStore.getById(id);
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    // Enrich results with driver and team names
    const results = resultsStore.getByRace(id);
    const allDrivers = driversStore.getAll();
    const allTeams = teamsStore.getAll();

    const enrichedResults = results.map((r) => ({
        ...r,
        driverName: allDrivers.find((d) => d.id === r.driverId)?.name ?? "Unknown",
        teamName: allTeams.find((t) => t.id === r.teamId)?.name ?? "Unknown",
    }));

    return NextResponse.json(
        { success: true, data: { ...race, results: enrichedResults } },
        { status: 200 }
    );
});

// ─── PUT /api/races/:id ───────────────────────────────────────────────────────

export const PUT = withErrorHandler(async (request, { params }) => {
    const id = parseId(params.id);
    const race = racesStore.getById(id);
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    // Finalized races cannot be modified
    enforceRaceNotFinalized(race);

    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });

    if (!body.name && !body.circuit && !body.date && body.season === undefined) {
        throw new AppError("Provide at least one field to update.", 400);
    }

    if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        throw new AppError("'date' must be in YYYY-MM-DD format.", 400);
    }

    const updated = racesStore.update(id, body);
    return NextResponse.json({ success: true, message: "Race updated.", data: updated }, { status: 200 });
});

// ─── DELETE /api/races/:id ────────────────────────────────────────────────────

export const DELETE = withErrorHandler(async (_, { params }) => {
    const id = parseId(params.id);
    const race = racesStore.getById(id);
    if (!race) throw new AppError(`Race with ID ${id} not found.`, 404);

    // Finalized races cannot be deleted
    enforceRaceNotFinalized(race);

    // Also remove all associated results
    resultsStore.removeByRace(id);
    racesStore.remove(id);

    return NextResponse.json(
        { success: true, message: `Race "${race.name}" and its results deleted.` },
        { status: 200 }
    );
});

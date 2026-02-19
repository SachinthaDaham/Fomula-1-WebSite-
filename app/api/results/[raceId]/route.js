/**
 * app/api/results/[raceId]/route.js
 *
 * GET  /api/results/:raceId  — Get all results for a race (enriched)
 * POST /api/results/:raceId  — Add a result entry for a race
 *
 * Business rules enforced on POST:
 *  - Race must not be finalized
 *  - Driver must be active (not retired)
 *  - Driver cannot appear twice in the same race
 *  - Position must be unique per race (DNFs exempt)
 *  - Fastest lap only for top-10 finishers
 *  - Only one fastest lap per race
 *  - Driver must belong to a valid team
 */

import { NextResponse } from "next/server";
import { resultsStore, racesStore, driversStore, teamsStore } from "@/lib/store";
import { AppError, withErrorHandler } from "@/lib/errors";
import { calculatePoints } from "@/lib/points";
import {
    enforceRaceNotFinalized,
    enforceDriverIsActive,
    enforceNoDuplicateDriverInRace,
    enforceUniquePosition,
    enforceFastestLapRule,
    enforceOneFastestLap,
} from "@/lib/rules";

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) throw new AppError("ID must be a positive integer.", 400);
    return id;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateResultBody(body) {
    const errors = [];
    if (body.driverId === undefined || isNaN(Number(body.driverId)))
        errors.push("'driverId' is required and must be a valid integer.");
    if (body.position === undefined || isNaN(Number(body.position)) || Number(body.position) < 1)
        errors.push("'position' is required and must be a positive integer.");
    if (errors.length > 0) throw new AppError("Validation failed.", 400, errors);
}

// ─── GET /api/results/:raceId ─────────────────────────────────────────────────

export const GET = withErrorHandler(async (_, { params }) => {
    const raceId = parseId(params.raceId);
    const race = racesStore.getById(raceId);
    if (!race) throw new AppError(`Race with ID ${raceId} not found.`, 404);

    const results = resultsStore.getByRace(raceId);
    const allDrivers = driversStore.getAll();
    const allTeams = teamsStore.getAll();

    // Enrich results with driver/team names and sort by position
    const enriched = results
        .map((r) => ({
            ...r,
            driverName: allDrivers.find((d) => d.id === r.driverId)?.name ?? "Unknown",
            teamName: allTeams.find((t) => t.id === r.teamId)?.name ?? "Unknown",
        }))
        .sort((a, b) => {
            // DNFs go to the bottom; then sort by position ascending
            if (a.dnf && !b.dnf) return 1;
            if (!a.dnf && b.dnf) return -1;
            return a.position - b.position;
        });

    return NextResponse.json(
        { success: true, race: race.name, count: enriched.length, data: enriched },
        { status: 200 }
    );
});

// ─── POST /api/results/:raceId ────────────────────────────────────────────────

export const POST = withErrorHandler(async (request, { params }) => {
    const raceId = parseId(params.raceId);

    // Ensure race exists
    const race = racesStore.getById(raceId);
    if (!race) throw new AppError(`Race with ID ${raceId} not found.`, 404);

    // ── Rule 4: Immutable after finalization ──
    enforceRaceNotFinalized(race);

    const body = await request.json().catch(() => { throw new AppError("Invalid JSON body.", 400); });
    validateResultBody(body);

    const driverId = Number(body.driverId);
    const position = Number(body.position);
    const fastestLap = Boolean(body.fastestLap);
    const dnf = Boolean(body.dnf);

    // Ensure driver exists
    const driver = driversStore.getById(driverId);
    if (!driver) throw new AppError(`Driver with ID ${driverId} not found.`, 404);

    // ── Rule 2: Retired drivers cannot race ──
    enforceDriverIsActive(driver);

    // Get existing results for this race (for duplicate/position checks)
    const existingResults = resultsStore.getByRace(raceId);

    // ── Rule 5: No duplicate driver per race ──
    enforceNoDuplicateDriverInRace(existingResults, driverId);

    // ── Rule 6: Unique position per race ──
    enforceUniquePosition(existingResults, position, dnf);

    // ── Rule 3: Fastest lap only for top-10 finishers ──
    enforceFastestLapRule(fastestLap, position, dnf);

    // ── Rule 7: Only one fastest lap per race ──
    enforceOneFastestLap(existingResults, fastestLap);

    // Calculate points using the official F1 points system
    const points = calculatePoints(position, fastestLap, dnf);

    // Persist the result
    const result = resultsStore.create({
        raceId,
        driverId,
        teamId: driver.teamId,
        position,
        fastestLap,
        dnf,
        points,
    });

    // Transition race to "ongoing" if it was still "pending"
    if (race.status === "pending") {
        racesStore.setStatus(raceId, "ongoing");
    }

    return NextResponse.json(
        {
            success: true,
            message: `Result added for ${driver.name}. Points awarded: ${points}.`,
            data: result,
        },
        { status: 201 }
    );
});

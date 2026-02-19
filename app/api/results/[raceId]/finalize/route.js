/**
 * app/api/results/[raceId]/finalize/route.js
 *
 * POST /api/results/:raceId/finalize
 *
 * Finalizes a race:
 *  1. Validates the race exists and is not already finalized
 *  2. Requires at least one result entry before finalizing
 *  3. Locks the race (status → "finalized") — results become immutable
 *  4. Computes and adds constructor (team) points for each team that scored
 *
 * This is a one-way operation. Once finalized, the race cannot be
 * modified or deleted, and no new results can be added.
 */

import { NextResponse } from "next/server";
import { racesStore, resultsStore, teamsStore } from "@/lib/store";
import { AppError, withErrorHandler } from "@/lib/errors";
import { calculateConstructorPoints } from "@/lib/points";

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (isNaN(id) || id <= 0) throw new AppError("ID must be a positive integer.", 400);
    return id;
}

// ─── POST /api/results/:raceId/finalize ───────────────────────────────────────

export const POST = withErrorHandler(async (_, { params }) => {
    const raceId = parseId(params.raceId);

    // Ensure race exists
    const race = racesStore.getById(raceId);
    if (!race) throw new AppError(`Race with ID ${raceId} not found.`, 404);

    // Block if already finalized
    if (race.status === "finalized") {
        throw new AppError(`Race "${race.name}" is already finalized.`, 409);
    }

    // Require at least one result before finalizing
    const results = resultsStore.getByRace(raceId);
    if (results.length === 0) {
        throw new AppError(
            `Cannot finalize "${race.name}" — no race results have been entered yet.`,
            422
        );
    }

    // ── Compute constructor points ──
    // Find all unique teams that participated in this race
    const participatingTeamIds = [...new Set(results.map((r) => r.teamId))];

    const constructorSummary = [];
    for (const teamId of participatingTeamIds) {
        const pointsEarned = calculateConstructorPoints(results, teamId);
        if (pointsEarned > 0) {
            // Add points to the team's running total
            teamsStore.addConstructorPoints(teamId, pointsEarned);
            const team = teamsStore.getById(teamId);
            constructorSummary.push({ teamId, teamName: team?.name, pointsEarned });
        }
    }

    // ── Lock the race ──
    racesStore.setStatus(raceId, "finalized");

    return NextResponse.json(
        {
            success: true,
            message: `Race "${race.name}" has been finalized. Results are now immutable.`,
            constructorPointsAwarded: constructorSummary,
            totalResults: results.length,
        },
        { status: 200 }
    );
});

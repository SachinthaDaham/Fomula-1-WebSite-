/**
 * app/api/drivers/route.js
 * Returns driver list - when season is given, returns all active drivers
 * enriched with their points for that season.
 */

import { NextResponse } from "next/server";
import { driversStore, teamsStore, resultsStore } from "@/lib/store";
import { withErrorHandler } from "@/lib/errors";
import { enforceMaxDriversPerTeam } from "@/lib/rules";

export const GET = withErrorHandler(async (request) => {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const status = searchParams.get("status");
    const season = searchParams.get("season");

    let drivers = driversStore.getAll();

    // When filtering by season: do NOT filter out drivers; instead enrich with
    // season points. Return all Active drivers so the paddock view is always populated.
    // If a specific status is requested, honour it; otherwise default to "Active".
    const effectiveStatus = status || (season ? "Active" : null);

    if (teamId) drivers = drivers.filter(d => d.teamId === Number(teamId));
    if (effectiveStatus) drivers = drivers.filter(d => (d.status || "Active").toLowerCase() === effectiveStatus.toLowerCase());

    const allTeams = teamsStore.getAll();

    // Build points-for-season lookup when season param is present
    let seasonPointsMap = {};
    if (season) {
        const seasonResults = resultsStore.getBySeason(season);
        seasonResults.forEach(r => {
            if (!seasonPointsMap[r.driverId]) seasonPointsMap[r.driverId] = 0;
            seasonPointsMap[r.driverId] += r.points;
        });
    }

    const enriched = drivers.map(d => ({
        ...d,
        teamName: allTeams.find(t => t.id === d.teamId)?.name ?? "Unknown",
        seasonPoints: seasonPointsMap[d.id] ?? 0,
    }));

    // If season given, sort by season points descending
    if (season) {
        enriched.sort((a, b) => b.seasonPoints - a.seasonPoints);
    }

    return NextResponse.json({ success: true, count: enriched.length, data: enriched }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    const body = await request.json();

    if (body.status === "Active") {
        enforceMaxDriversPerTeam(driversStore.getAll(), body.teamId);
    }

    const driver = driversStore.create(body);
    return NextResponse.json({ success: true, message: "Driver created.", data: driver }, { status: 201 });
});

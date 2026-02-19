/**
 * app/api/teams/route.js (Updated)
 */

import { NextResponse } from "next/server";
import { teamsStore, driversStore } from "@/lib/store";
import { withErrorHandler } from "@/lib/errors";

export const GET = withErrorHandler(async () => {
    const teams = teamsStore.getAll();
    const allDrivers = driversStore.getAll();

    const enriched = teams.map((t) => ({
        ...t,
        driverCount: allDrivers.filter((d) => d.teamId === t.id && d.status === "Active").length,
        reserveCount: allDrivers.filter((d) => d.teamId === t.id && d.status === "Reserve").length,
    }));

    return NextResponse.json({ success: true, count: enriched.length, data: enriched }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    const body = await request.json();
    const team = teamsStore.create(body);
    return NextResponse.json({ success: true, message: "Team created.", data: team }, { status: 201 });
});

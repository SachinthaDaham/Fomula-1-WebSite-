/**
 * app/api/teams/[id]/route.js
 * 
 * Individual Team Intelligence Endpoint
 */

import { NextResponse } from "next/server";
import { teamsStore, driversStore, newsStore } from "@/lib/store";
import { withErrorHandler } from "@/lib/errors";

export const GET = withErrorHandler(async (request, { params }) => {
    const { id } = params;
    const team = teamsStore.getById(id);

    if (!team) {
        return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Enrich with current drivers and related news
    const drivers = driversStore.getAll().filter(d => d.teamId === Number(id));
    const news = newsStore.getByTeam(id);

    const fullData = {
        ...team,
        drivers,
        relatedNews: news
    };

    return NextResponse.json({ success: true, data: fullData }, { status: 200 });
});

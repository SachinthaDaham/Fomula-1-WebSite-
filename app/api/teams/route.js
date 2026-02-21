import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Driver from "@/models/Driver";
import { withErrorHandler } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async () => {
    await connectDB();
    const teams = await Team.find({}).lean();
    const allDrivers = await Driver.find({}).lean();

    const enriched = teams.map((t) => ({
        ...t,
        driverCount: allDrivers.filter((d) => d.teamId === t.id && d.status === "Active").length,
        reserveCount: allDrivers.filter((d) => d.teamId === t.id && (d.status === "Reserve" || d.status === "Third")).length,
    }));

    return NextResponse.json({ success: true, count: enriched.length, data: enriched }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    await ensureAdmin(request);
    await connectDB();
    const body = await request.json();

    // Basic Validation before hitting DB
    if (!body.name) {
        return NextResponse.json(
            { success: false, message: "Team name is required." },
            { status: 400 }
        );
    }

    if (!body.id) {
        const lastTeam = await Team.findOne().sort({ id: -1 });
        body.id = lastTeam ? lastTeam.id + 1 : 1;
    }

    const team = await Team.create(body);
    return NextResponse.json({ success: true, message: "Team created.", data: team }, { status: 201 });
});

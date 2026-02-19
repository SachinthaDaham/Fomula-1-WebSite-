import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";
import Team from "@/models/Team";
import { withErrorHandler, AppError } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async (request) => {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const status = searchParams.get("status");
    const season = searchParams.get("season");

    let query = {};
    if (teamId) query.teamId = Number(teamId);
    if (status) query.status = status;

    const drivers = await Driver.find(query).lean();
    const allTeams = await Team.find({}).lean();

    const data = drivers.map(d => ({
        ...d,
        id: d.id, // Ensure numeric id is present for frontend
        teamName: allTeams.find(t => t.id === d.teamId)?.name ?? "Unknown",
    }));

    return NextResponse.json({ success: true, count: data.length, data }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    await ensureAdmin(request);
    await connectDB();
    const body = await request.json();

    // Auto-increment numeric ID if not provided (simple logic for now)
    if (!body.id) {
        const lastDriver = await Driver.findOne().sort({ id: -1 });
        body.id = lastDriver ? lastDriver.id + 1 : 1;
    }

    const driver = await Driver.create(body);
    return NextResponse.json({ success: true, message: "Driver created.", data: driver }, { status: 201 });
});

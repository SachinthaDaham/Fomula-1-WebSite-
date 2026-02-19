import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Driver from "@/models/Driver";
import { withErrorHandler, AppError } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async (request, { params }) => {
    await connectDB();
    const { id } = params;
    const team = await Team.findOne({ id: Number(id) }).lean();
    if (!team) throw new AppError("Team not found.", 404);

    const drivers = await Driver.find({ teamId: team.id }).lean();
    const data = {
        ...team,
        drivers
    };

    return NextResponse.json({ success: true, data });
});

export const PUT = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const team = await Team.findOneAndUpdate({ id: Number(id) }, body, { new: true });
    if (!team) throw new AppError("Team not found.", 404);
    return NextResponse.json({ success: true, message: "Team updated.", data: team });
});

export const DELETE = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const team = await Team.findOneAndDelete({ id: Number(id) });
    if (!team) throw new AppError("Team not found.", 404);
    return NextResponse.json({ success: true, message: "Team deleted." });
});

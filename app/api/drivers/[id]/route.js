import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";
import Team from "@/models/Team";
import { withErrorHandler, AppError } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async (request, { params }) => {
    await connectDB();
    const { id } = params;
    const driver = await Driver.findOne({ id: Number(id) }).lean();
    if (!driver) throw new AppError("Driver not found.", 404);

    const team = await Team.findOne({ id: driver.teamId }).lean();
    const data = {
        ...driver,
        teamName: team?.name ?? "Unknown"
    };

    return NextResponse.json({ success: true, data });
});

export const PUT = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const driver = await Driver.findOneAndUpdate({ id: Number(id) }, body, { new: true });
    if (!driver) throw new AppError("Driver not found.", 404);
    return NextResponse.json({ success: true, message: "Driver updated.", data: driver });
});

export const DELETE = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const driver = await Driver.findOneAndDelete({ id: Number(id) });
    if (!driver) throw new AppError("Driver not found.", 404);
    return NextResponse.json({ success: true, message: "Driver deleted." });
});

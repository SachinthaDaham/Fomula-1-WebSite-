import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/models/News";
import { withErrorHandler, AppError } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async (request, { params }) => {
    await connectDB();
    const { id } = params;
    const item = await News.findOne({ id: Number(id) }).lean();
    if (!item) throw new AppError("Article not found.", 404);
    return NextResponse.json({ success: true, data: item });
});

export const PUT = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const item = await News.findOneAndUpdate({ id: Number(id) }, body, { new: true });
    if (!item) throw new AppError("Article not found.", 404);
    return NextResponse.json({ success: true, message: "Article updated.", data: item });
});

export const DELETE = withErrorHandler(async (request, { params }) => {
    await ensureAdmin(request);
    await connectDB();
    const { id } = params;
    const item = await News.findOneAndDelete({ id: Number(id) });
    if (!item) throw new AppError("Article not found.", 404);
    return NextResponse.json({ success: true, message: "Article deleted." });
});

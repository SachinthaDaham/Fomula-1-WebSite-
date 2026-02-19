import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/models/News";
import { withErrorHandler } from "@/lib/errors";
import { ensureAdmin } from "@/lib/auth";

export const GET = withErrorHandler(async (request) => {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const season = searchParams.get("season");

    let query = {};
    if (category) query.category = { $regex: new RegExp(category, "i") };
    if (season) query.season = Number(season);

    const news = await News.find(query).sort({ date: -1 }).lean();

    return NextResponse.json({ success: true, count: news.length, data: news }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    await ensureAdmin(request);
    await connectDB();
    const body = await request.json();

    if (!body.id) {
        const lastNews = await News.findOne().sort({ id: -1 });
        body.id = lastNews ? lastNews.id + 1 : 1;
    }

    const item = await News.create(body);
    return NextResponse.json({ success: true, message: "Article published.", data: item }, { status: 201 });
});

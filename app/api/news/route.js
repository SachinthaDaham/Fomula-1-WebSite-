/**
 * app/api/news/route.js
 * 
 * Provides editorial content for the platform.
 */

import { NextResponse } from "next/server";
import { newsStore } from "@/lib/store";
import { withErrorHandler } from "@/lib/errors";

export const GET = withErrorHandler(async (request) => {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const season = searchParams.get("season");

    let news = newsStore.getAll();
    if (category) news = news.filter(n => n.category.toLowerCase() === category.toLowerCase());
    if (season) news = news.filter(n => n.season === Number(season));

    return NextResponse.json({ success: true, count: news.length, data: news }, { status: 200 });
});

export const POST = withErrorHandler(async (request) => {
    const body = await request.json();
    const item = newsStore.create(body);
    return NextResponse.json({ success: true, message: "Article published.", data: item }, { status: 201 });
});

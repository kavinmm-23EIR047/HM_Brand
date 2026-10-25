import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "full";
    const category = searchParams.get("category");
    const requestedLimit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || (type === "autocomplete" ? "6" : "20"), 10) || 20));

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return NextResponse.json({
        success: true,
        query: "",
        totalHits: 0,
        hits: [],
        suggestions: [],
        source: "postgres",
      });
    }

    // 1. Call PostgreSQL backend search endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    let url = `${backendUrl}/products/search?q=${encodeURIComponent(trimmedQuery)}&type=${type}&limit=${requestedLimit}`;
    if (category && category !== "all") {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Product search is temporarily unavailable.", hits: [], suggestions: [] },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (!data.success || !Array.isArray(data.hits)) {
      return NextResponse.json(
        { success: false, error: "Product search is temporarily unavailable.", hits: [], suggestions: [] },
        { status: 502 }
      );
    }

    return NextResponse.json({ ...data, source: "backend" });
  } catch (error: any) {
    console.error("[Search API] Unexpected error in GET /api/search:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed. Please try again.",
        hits: [],
        suggestions: [],
      },
      { status: 500 }
    );
  }
}

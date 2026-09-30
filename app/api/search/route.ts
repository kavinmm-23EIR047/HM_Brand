import { NextRequest, NextResponse } from "next/server";
import { products as staticFallbackProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "full";
    const category = searchParams.get("category");
    const requestedLimit = parseInt(searchParams.get("limit") || (type === "autocomplete" ? "6" : "20"), 10);

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

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.hits)) {
          return NextResponse.json(data);
        }
      }
    } catch (err: any) {
      console.warn("[Search API] Backend PostgreSQL search call failed, using graceful fallback:", err?.message || err);
    }

    // 2. Graceful Fallback if backend is temporarily unreachable
    console.warn(`[Search API] Fallback in-memory search triggered for query "${trimmedQuery}"`);
    let fallbackItems: any[] = [];

    try {
      const dbRes = await fetch(`${backendUrl}/products?limit=100`, { cache: "no-store" });
      const dbJson = await dbRes.json();
      if (dbJson.success && Array.isArray(dbJson.data)) {
        fallbackItems = dbJson.data;
      }
    } catch {
      fallbackItems = staticFallbackProducts;
    }

    const qLower = trimmedQuery.toLowerCase();
    const filtered = fallbackItems.filter((p: any) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || p.categories?.[0]?.category?.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(qLower) || cat.includes(qLower) || desc.includes(qLower);
    });

    const suggestions = Array.from(new Set(filtered.map((p) => p.name))).slice(0, 8);

    return NextResponse.json({
      success: true,
      query: trimmedQuery,
      totalHits: filtered.length,
      hits: filtered.slice(0, requestedLimit),
      suggestions,
      source: "fallback",
    });
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

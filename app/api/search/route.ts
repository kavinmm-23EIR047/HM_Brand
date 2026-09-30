import { NextRequest, NextResponse } from "next/server";
import { searchMeiliProducts, MeiliProduct } from "@/lib/meilisearch";
import { products as staticFallbackProducts, Product } from "@/lib/products";

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
      });
    }

    // 1. Attempt server-side Meilisearch search
    let filter: string | undefined = undefined;
    if (category && category !== "all") {
      filter = `category = "${category}"`;
    }

    const meiliResult = await searchMeiliProducts(trimmedQuery, {
      limit: Math.min(requestedLimit, 50),
      isAutocomplete: type === "autocomplete",
      filter,
    });

    if (meiliResult && Array.isArray(meiliResult.hits)) {
      const hits = meiliResult.hits;

      // Extract unique suggestions for autocomplete dropdown
      const suggestionsSet = new Set<string>();
      hits.forEach((h: MeiliProduct) => {
        if (h.name) suggestionsSet.add(h.name);
        if (h.category) suggestionsSet.add(h.category);
      });

      return NextResponse.json({
        success: true,
        query: trimmedQuery,
        totalHits: meiliResult.totalHits,
        hits,
        suggestions: Array.from(suggestionsSet).slice(0, 8),
        processingTimeMs: meiliResult.processingTimeMs,
        source: "meilisearch",
      });
    }

    // 2. Graceful Fallback: If Meilisearch is temporarily unreachable, fallback to database/memory search
    console.warn(`[Search API] Fallback search triggered for query "${trimmedQuery}"`);
    let fallbackItems: any[] = [];

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
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

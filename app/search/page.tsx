"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotSearch } from "@/components/mascot-art";
import type { Product } from "@/lib/products";

function hitToProduct(hit: any): Product {
  const shortDesc = hit.shortDescription || "";
  const quantityPart = shortDesc.includes("·") ? shortDesc.split("·")[0]?.trim() : (shortDesc || "150 GMS");
  const notePart = shortDesc.includes("·")
    ? shortDesc.split("·").slice(1).join("·").trim()
    : (hit.description ? hit.description.slice(0, 90) : "Handcrafted natural fragrance.");

  return {
    slug: hit.slug,
    name: hit.name,
    category: hit.category || "Agarbatti & Flora",
    subCategory: notePart || "Natural Heritage Aroma",
    note: hit.description ? hit.description.slice(0, 100) : (notePart || "Handcrafted natural fragrance."),
    description: hit.description || hit.name,
    mrp: typeof hit.mrp === "string" && hit.mrp.startsWith("₹") ? hit.mrp : `₹${hit.mrp || hit.price}`,
    price: typeof hit.price === "number" ? hit.price : parseFloat(hit.price || 0),
    quantity: quantityPart || "150 GMS",
    burnTime: "45-50 mins per stick",
    fragranceNotes: ["Natural Resins", "Essential Oils", "Botanicals"],
    benefits: [
      "100% natural organic ingredients",
      "Zero harmful charcoal or synthetic toxins",
      "Uplifts daily rituals and home ambiance",
    ],
    howToUse: [
      "Place stick in agarbatti holder.",
      "Light tip until flame appears, then gently blow out.",
    ],
    image: hit.image || "/images/media_1790142713668.jpg",
    badge: hit.couponCode ? `COUPON: ${hit.couponCode}` : (hit.isFeatured ? "Featured" : undefined),
    rating: hit.rating || 4.9,
    reviewCount: hit.reviewCount || 28,
    inStock: hit.inStock !== false,
    featured: hit.isFeatured,
    couponCode: hit.couponCode,
  };
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery.trim()));
  const [searchSource, setSearchSource] = useState<string>("meilisearch");

  // Keep debounced query in sync with input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results whenever debounced query changes
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setSuggestions([]);
      setHasSearched(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setHasSearched(true);

    // Keep URL parameter up to date cleanly
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("q", trimmed);
      window.history.replaceState(null, "", url.toString());
    }

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}&type=full&limit=30`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.hits)) {
          setResults(data.hits.map(hitToProduct));
          setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
          setSearchSource(data.source || "meilisearch");
        } else {
          setResults([]);
        }
      })
      .catch((err) => {
        console.error("Search failed:", err);
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setDebouncedQuery(text);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQuery(query);
          }}
          className="relative flex items-center bg-white border-2 border-[#6B4226] rounded-2xl p-2 shadow-solid-sm transition-all focus-within:border-[#E85D04] focus-within:ring-2 focus-within:ring-[#E85D04]/20"
        >
          {loading ? (
            <Loader2 className="text-[#E85D04] ml-3 animate-spin" size={22} />
          ) : (
            <Search className="text-[#E85D04] ml-3" size={22} />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name, category, or note (typos welcome!)..."
            className="flex-1 px-4 py-2 text-sm text-[#292524] bg-transparent outline-none font-sans"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
              className="text-xs font-bold text-[#6B4226] bg-[#F4D35E]/40 hover:bg-[#F4D35E]/80 px-3 py-1.5 rounded-lg mr-1 transition"
            >
              Clear
            </button>
          )}
        </form>

        {/* Suggested Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-[#6B4226] font-bold">Suggested:</span>
          {["HM Super Series", "Bhimseni Camphor", "Cup Sambrani", "Kesar Loban", "Chandan Dhoop", "chcolate"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelectSuggestion(s)}
              className="bg-[#FFF8E7] border border-[#C89B3C] text-[#6B4226] px-3 py-1 rounded-full hover:bg-[#E85D04] hover:text-white transition font-semibold"
            >
              ✦ {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Empty State */}
      {!hasSearched || !query.trim() ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <MascotSearch size={160} />
          <h3 className="font-display text-2xl text-[#6B4226] font-bold mt-4">
            Type to find your sacred essentials
          </h3>
          <p className="text-xs text-[#292524]/70 mt-2 leading-relaxed">
            Search our complete catalogue of pure natural agarbattis, camphor chunks, and sambrani cups with typo-tolerant Meilisearch.
          </p>
        </div>
      ) : loading && results.length === 0 ? (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 text-[#E85D04] animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-[#6B4226]">Searching sacred catalogue...</p>
        </div>
      ) : results.length === 0 ? (
        /* Professional Empty State as required by specification */
        <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm flex flex-col items-center">
          <MascotSearch size={140} />
          <h3 className="font-display text-2xl sm:text-3xl text-[#6B4226] font-bold mt-4">
            No products found for &ldquo;{query}&rdquo;
          </h3>

          <div className="mt-5 text-left bg-white/80 border border-[#C89B3C]/50 rounded-2xl p-4 sm:p-5 w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-wider text-[#B23A48] mb-2 flex items-center gap-1.5">
              <AlertCircle size={14} /> Try:
            </p>
            <ul className="text-xs sm:text-sm text-[#292524]/85 space-y-1.5 list-disc pl-5">
              <li>checking the spelling</li>
              <li>using fewer words</li>
              <li>searching by product name or category</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
              className="bg-white border border-[#6B4226] text-[#6B4226] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#FAF4ED] transition"
            >
              Clear Search
            </button>
            <Link
              href="/shop"
              className="btn-saffron px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-block"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#C89B3C]/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#B23A48] uppercase tracking-wider">
                Found {results.length} Sacred Result{results.length === 1 ? "" : "s"}
              </span>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {searchSource === "meilisearch" ? "⚡ Powered by Meilisearch" : "Database Search"}
              </span>
            </div>
            {suggestions.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6B4226]">
                <Sparkles size={14} className="text-[#E85D04]" />
                <span className="font-semibold">Related:</span>
                {suggestions.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="underline hover:text-[#E85D04] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <InnerPage
      eyebrow="PRODUCT SEARCH"
      title="Find What Your Altar Needs"
      subtitle="Search across our complete handcrafted collection of pure spiritual essentials."
    >
      <Suspense fallback={<div className="p-12 text-center text-[#6B4226]">Loading search...</div>}>
        <SearchPageContent />
      </Suspense>
    </InnerPage>
  );
}

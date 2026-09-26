"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotSearch } from "@/components/mascot-art";
import { products } from "@/lib/products";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        (p.fragranceNotes && p.fragranceNotes.some((n) => n.toLowerCase().includes(q)))
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center bg-white border-2 border-[#6B4226] rounded-2xl p-2 shadow-solid-sm">
          <Search className="text-[#E85D04] ml-3" size={22} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for agarbatti, bhimseni camphor, cup sambrani..."
            className="flex-1 px-4 py-2 text-sm text-[#292524] bg-transparent outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-bold text-[#6B4226] bg-[#F4D35E]/40 px-3 py-1.5 rounded-lg mr-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Suggested Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-[#6B4226] font-bold">Suggested:</span>
          {["HM Super Series", "Bhimseni Camphor", "Cup Sambrani", "Kesar Loban", "Chandan Dhoop"].map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="bg-[#FFF8E7] border border-[#C89B3C] text-[#6B4226] px-3 py-1 rounded-full hover:bg-[#E85D04] hover:text-white transition font-semibold"
            >
              ✦ {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results or Empty State */}
      {!query.trim() ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <MascotSearch size={160} />
          <h3 className="font-display text-2xl text-[#6B4226] font-bold mt-4">
            Type to find your sacred essentials
          </h3>
          <p className="text-xs text-[#292524]/70 mt-2 leading-relaxed">
            Search our complete Coimbatore catalogue of pure natural agarbattis, camphor chunks, and sambrani cups.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-12 text-center max-w-xl mx-auto shadow-sm flex flex-col items-center">
          <MascotSearch size={160} />
          <h3 className="font-display text-3xl text-[#6B4226] font-bold mt-4">
            No items found for &ldquo;{query}&rdquo;
          </h3>
          <p className="text-sm text-[#292524]/70 mt-2 max-w-sm">
            Try checking for spelling variations or browse all our available collections.
          </p>
          <Link
            href="/shop"
            className="btn-saffron mt-6 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider inline-block"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#C89B3C]/40">
            <span className="text-xs font-bold text-[#B23A48] uppercase tracking-wider">
              Found {results.length} Sacred Results
            </span>
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


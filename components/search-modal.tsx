"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useStore } from "@/components/store";
import { MascotSearch } from "@/components/mascot-art";

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchSource, setSearchSource] = useState<string>("meilisearch");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search input (250ms) to avoid requesting on every single keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search against our server-side Meilisearch API
  useEffect(() => {
    if (!debouncedQuery) {
      setHits([]);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&type=autocomplete&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (isCurrent && data.success) {
          setHits(data.hits || []);
          setSuggestions(data.suggestions || []);
          setSearchSource(data.source || "meilisearch");
        }
      })
      .catch((err) => {
        console.warn("Search autocomplete fetch error", err);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setDebouncedQuery("");
      setHits([]);
      setSuggestions([]);
    }
  }, [isSearchOpen]);

  const handleExecuteSearch = useCallback(
    (searchQuery: string) => {
      const q = searchQuery.trim();
      if (!q) return;
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [router, setIsSearchOpen]
  );

  if (!isSearchOpen) return null;

  const popularTags = [
    "Bhimseni Camphor",
    "HM Super Series",
    "Cup Sambrani",
    "Kesar Loban",
    "Chandan Dhoop",
    "Kasturi",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative flex min-h-[100dvh] items-start justify-center px-2 pb-8 pt-12 sm:min-h-screen sm:px-4 sm:pt-20 sm:pb-12">
        <div className="relative w-full max-w-2xl bg-sacredCream border-2 border-antiqueGold rounded-2xl shadow-2xl overflow-hidden text-charcoal">
          {/* Search Header */}
          <div className="flex items-center gap-2 border-b border-antiqueGold/40 bg-turmeric/20 p-3 sm:gap-3 sm:p-5">
            <Search className="text-saffron shrink-0" size={22} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  e.preventDefault();
                  handleExecuteSearch(query);
                }
              }}
              placeholder="Search sacred agarbatti, camphor, sambrani..."
              className="min-w-0 flex-1 border-none bg-transparent text-sm text-charcoal outline-none placeholder-charcoal/40 sm:text-base font-sans"
            />
            {loading && <Loader2 size={16} className="text-[#E85D04] animate-spin shrink-0" />}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs font-bold text-earthBrown bg-sacredCream px-2 py-1 rounded shrink-0 hover:bg-white transition"
              >
                CLEAR
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-earthBrown hover:bg-sacredCream rounded-full transition shrink-0"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search-As-You-Type Suggestions Bar */}
          {query.trim() && (
            <div className="bg-[#FFF8E7] border-b border-antiqueGold/30 p-2.5 sm:p-3 space-y-2">
              <button
                type="button"
                onClick={() => handleExecuteSearch(query)}
                className="w-full flex items-center justify-between text-left p-2 rounded-xl bg-white hover:bg-[#F4D35E]/30 border border-[#C89B3C]/30 text-xs font-bold text-[#6B4226] transition group shadow-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search size={14} className="text-[#E85D04] shrink-0" />
                  <span className="truncate">
                    Search for &ldquo;<strong className="text-[#A90C35]">{query}</strong>&rdquo;
                  </span>
                </div>
                <span className="text-[10px] text-[#292524]/50 group-hover:text-[#6B4226] flex items-center gap-1 shrink-0 ml-2">
                  Press Enter <ArrowRight size={11} />
                </span>
              </button>

              {suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#292524]/60 mr-1">
                    Suggestions:
                  </span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        handleExecuteSearch(s);
                      }}
                      className="text-[11px] bg-white hover:bg-[#E85D04] hover:text-white text-[#6B4226] border border-[#C89B3C]/40 px-2.5 py-0.5 rounded-full font-semibold transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Content */}
          <div className="max-h-[65dvh] overflow-y-auto p-4 sm:max-h-[60vh] sm:p-6">
            {!query.trim() ? (
              <div>
                <p className="text-xs font-bold tracking-widest text-kumkum uppercase mb-3">
                  Popular Sacred Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        handleExecuteSearch(tag);
                      }}
                      className="text-xs bg-sacredCream border border-antiqueGold text-earthBrown hover:bg-templeOrange hover:text-sacredCream px-3.5 py-2 rounded-full font-semibold transition"
                    >
                      ✦ {tag}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-antiqueGold/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-xl text-earthBrown">
                      Explore Sacred Categories
                    </h4>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      Find authentic products for daily worship
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-bold text-saffron hover:text-kumkum flex items-center gap-1"
                  >
                    View All <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : loading || debouncedQuery !== query.trim() ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-saffron animate-spin mb-3" />
                <p className="text-xs font-semibold text-earthBrown">Searching sacred catalogue...</p>
              </div>
            ) : hits.length === 0 ? (
              <div className="text-center py-6 flex flex-col items-center max-w-md mx-auto">
                <MascotSearch size={140} />
                <h3 className="font-display text-2xl text-earthBrown mt-4">
                  No products found for &ldquo;{debouncedQuery || query}&rdquo;
                </h3>
                <div className="text-xs text-charcoal/80 mt-3 space-y-1.5 text-left bg-white p-4 rounded-2xl border border-antiqueGold/40 w-full shadow-xs">
                  <p className="font-bold text-[#6B4226]">Try:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-[#292524]/85 text-xs pl-2">
                    <li>checking the spelling</li>
                    <li>using fewer words</li>
                    <li>searching by product name or category</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        handleExecuteSearch(tag);
                      }}
                      className="text-xs bg-white border border-antiqueGold text-earthBrown hover:bg-saffron hover:text-white px-3 py-1.5 rounded-full font-semibold transition shadow-xs"
                    >
                      ✦ {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <p className="text-xs font-bold tracking-widest text-kumkum uppercase">
                    Found {hits.length} Sacred Items
                  </p>
                  <button
                    onClick={() => handleExecuteSearch(query)}
                    className="text-xs font-bold text-saffron hover:text-kumkum flex items-center gap-1"
                  >
                    View All Results <ArrowRight size={12} />
                  </button>
                </div>

                {hits.map((product) => {
                  const highlightedName = product._formatted?.name || product.name;
                  const highlightedCategory = product._formatted?.category || product.category;

                  return (
                    <Link
                      key={product.id || product.slug}
                      href={`/product/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-antiqueGold/30 bg-white p-2.5 transition group hover:border-saffron hover:shadow-xs sm:p-3.5"
                    >
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-earthBrown/20 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-turmeric/40 border border-earthBrown/20 flex items-center justify-center text-xl shrink-0">
                            🪔
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4
                            className="truncate font-display text-sm text-earthBrown transition group-hover:text-saffron sm:text-base font-bold"
                            dangerouslySetInnerHTML={{ __html: highlightedName }}
                          />
                          <p
                            className="text-xs text-charcoal/60 truncate"
                            dangerouslySetInnerHTML={{
                              __html: `${highlightedCategory} • ${product.shortDescription || "Natural Heritage"}`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-bold text-kumkum">₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="block text-[11px] text-charcoal/50 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Loader2, Search, Sparkles, X } from "lucide-react";
import { useStore } from "@/components/store";

const RECENT_KEY = "hm_recent_searches";
const MAX_RECENT_SEARCHES = 6;

type SearchHit = {
  id?: string;
  slug: string;
  name: string;
  category?: string;
  categories?: string[];
  shortDescription?: string;
  price?: number;
  mrp?: number;
  image?: string;
};

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, dbProducts } = useStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setHits([]);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&type=autocomplete&limit=8`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Search is unavailable");
        if (active) {
          setHits(Array.isArray(data.hits) ? data.hits : []);
          setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
        }
      })
      .catch(() => {
        if (active) {
          setHits([]);
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setDebouncedQuery("");
      setHits([]);
      setSuggestions([]);
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      if (Array.isArray(stored)) {
        setRecentSearches(stored.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT_SEARCHES));
      }
    } catch {
      setRecentSearches([]);
    }

    const timer = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 639px)").matches) mobileInputRef.current?.focus();
      else inputRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isSearchOpen]);

  const handleExecuteSearch = useCallback((value: string) => {
    const term = value.trim();
    if (!term) return;

    setRecentSearches((current) => {
      const updated = [term, ...current.filter((item) => item.toLowerCase() !== term.toLowerCase())]
        .slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        // Search still works when browser storage is unavailable.
      }
      return updated;
    });
    setIsSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  }, [router, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // Ignore storage restrictions.
    }
  };

  const removeRecent = (term: string) => {
    setRecentSearches((current) => {
      const updated = current.filter((item) => item !== term);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage restrictions.
      }
      return updated;
    });
  };

  const featuredProducts = [...dbProducts]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6);
  const showResults = Boolean(query.trim());

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        className="absolute inset-0 bg-[#123936]/60 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
        aria-label="Close search overlay"
      />
      <div className="relative flex h-[100dvh] items-stretch justify-center sm:h-full sm:items-start sm:overflow-y-auto sm:px-4 sm:py-12 lg:pt-[10vh]">
        <div className="relative flex h-full w-full max-w-[960px] flex-col overflow-hidden bg-[#FFF9EC] text-brand-ink shadow-2xl sm:h-auto sm:max-h-[84vh] sm:rounded-3xl sm:ring-1 sm:ring-white/70">
          <div className="hidden shrink-0 items-center gap-3 border-b border-brand-border-alt px-6 py-5 sm:flex lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-brand-border focus-within:ring-2 focus-within:ring-brand-primary/40">
              <Search size={20} className="shrink-0 text-brand-primary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleExecuteSearch(query);
                  if (event.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="Search products by name, fragrance, or category..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-muted"
              />
              {loading && <Loader2 size={17} className="animate-spin text-brand-primary" />}
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>}
            </div>
            <kbd className="rounded-lg bg-[#F4E6C8] px-2.5 py-2 text-ui-11 font-bold text-[#76573C]">Ctrl K</kbd>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full text-brand-primary transition hover:bg-[#F4EBD9]"
              aria-label="Close search"
            >
              <X size={21} />
            </button>
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-brand-border-alt px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] sm:hidden">
            <button onClick={() => setIsSearchOpen(false)} className="grid h-9 w-9 place-items-center text-brand-primary" aria-label="Close search"><X size={21} /></button>
            <h2 className="text-sm font-extrabold">Search products</h2>
            <span className="w-9" />
          </div>
          <div className="shrink-0 px-4 py-3 sm:hidden">
            <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 ring-1 ring-brand-border focus-within:ring-2 focus-within:ring-brand-primary/40">
              <Search size={19} className="shrink-0 text-brand-primary" />
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleExecuteSearch(query);
                  if (event.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="Search products..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-muted"
              />
              {loading && <Loader2 size={16} className="animate-spin text-brand-primary" />}
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:py-6 lg:px-8">
            {!showResults ? (
              <div className="space-y-7">
                {recentSearches.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-extrabold"><Clock3 size={16} className="text-brand-primary" />Recent searches</h3>
                      <button onClick={clearRecent} className="text-xs font-semibold text-brand-deep hover:underline">Clear all</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div key={term} className="flex items-center gap-1 rounded-full border border-brand-border bg-white px-3 py-2 text-sm">
                          <button onClick={() => handleExecuteSearch(term)} className="max-w-[220px] truncate text-left">{term}</button>
                          <button onClick={() => removeRecent(term)} aria-label={`Remove ${term}`} className="ml-1 text-brand-muted hover:text-brand-primary"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {featuredProducts.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3 border-t border-brand-border-alt pt-5">
                      <h3 className="flex items-center gap-2 text-sm font-extrabold"><Sparkles size={16} className="text-brand-primary" />Products from our catalogue</h3>
                      <Link href="/shop" onClick={() => setIsSearchOpen(false)} className="flex shrink-0 items-center gap-1 text-xs font-bold text-brand-deep">Browse shop <ArrowRight size={13} /></Link>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredProducts.map((product) => (
                        <Link
                          key={product.id || product.slug}
                          href={`/product/${product.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="group flex min-w-0 items-center gap-3 rounded-2xl border border-transparent bg-white p-3 transition hover:border-brand-border hover:shadow-md"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F7E8C8]">
                            {product.image && <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold group-hover:text-brand-primary">{product.name}</p>
                            <p className="truncate text-xs text-brand-muted">{product.category}</p>
                          </div>
                          <span className="shrink-0 font-price text-sm font-bold text-brand-primary">₹{product.price}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
                {featuredProducts.length === 0 && recentSearches.length === 0 && (
                  <p className="py-12 text-center text-sm text-brand-muted">Search our live product catalogue by name or category.</p>
                )}
              </div>
            ) : loading || debouncedQuery !== query.trim() ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-primary" />
                <p className="text-sm font-semibold text-brand-muted">Searching the live catalogue...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-b border-brand-border-alt pb-4">
                    <span className="w-full text-xs font-bold uppercase tracking-wider text-brand-muted">Suggestions</span>
                    {suggestions.map((suggestion) => (
                      <button key={suggestion} onClick={() => handleExecuteSearch(suggestion)} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-brand-primary ring-1 ring-brand-border hover:bg-brand-primary hover:text-white">{suggestion}</button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">{hits.length} {hits.length === 1 ? "product" : "products"} found</p>
                  <button onClick={() => handleExecuteSearch(query)} className="flex items-center gap-1 text-xs font-bold text-brand-deep">View all results <ArrowRight size={13} /></button>
                </div>
                {hits.length > 0 ? (
                  <div className="space-y-2">
                    {hits.map((product) => (
                      <Link
                        key={product.id || product.slug}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-transparent transition hover:ring-brand-border hover:shadow-md sm:p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7E8C8] sm:h-14 sm:w-14">
                            {product.image && <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-brand-ink group-hover:text-brand-deep">{product.name}</p>
                            <p className="truncate text-xs text-brand-muted">{product.category || product.categories?.[0] || "HM Agarbattis"}{product.shortDescription ? ` · ${product.shortDescription}` : ""}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="font-price text-sm font-bold text-brand-primary">₹{product.price ?? 0}</span>
                          {product.mrp && product.price && product.mrp > product.price && <span className="font-price block text-xs text-brand-muted line-through">₹{product.mrp}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-9 w-9 text-brand-border" />
                    <h3 className="mt-3 font-bold">No products found</h3>
                    <p className="mt-1 text-sm text-brand-muted">Try another product name, fragrance, or category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

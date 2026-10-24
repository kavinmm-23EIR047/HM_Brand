"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, Loader2, Clock3, Grid2X2, ChevronRight } from "lucide-react";
import { useStore } from "@/components/store";
import { MascotSearch } from "@/components/mascot-art";

const API = "/api/search";
const RECENT_KEY = "hm_recent_searches";
const popularTags = ["Bhimseni Camphor", "HM Super Series", "Cup Sambrani", "Kesar Loban", "Chandan Dhoop", "Kasturi"];
const sacredCategories = [
  { name: "Agarbatti", note: "Divine Fragrances", image: "/images/products/hm_glory_agarbatti.jpg", slug: "agarbatti" },
  { name: "Camphor", note: "Pure & Natural", image: "/images/products/hm_camphor_no25.jpg", slug: "camphor" },
  { name: "Sambrani", note: "Traditional Bliss", image: "/images/products/hm_pure_loban_cup_sambrani.jpg", slug: "sambhrani-powder" },
  { name: "Dhoop & Loban", note: "Spiritual Essence", image: "/images/products/hm_italian_mehak_dhoop.jpg", slug: "dhoop-stick-bambooless-stick" },
  { name: "Pooja Essentials", note: "For Every Ritual", image: "/images/products/hm_indian_bakhoor_dhoop.jpg", slug: "pooja-essentials" },
  { name: "Gift Packs", note: "Thoughtful Gifting", image: "/images/special_offer_gift_transparent.png", slug: "gift-sets" },
];

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, dbProducts, dbCategories } = useStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) { setHits([]); setSuggestions([]); setLoading(false); return; }
    let current = true;
    setLoading(true);
    fetch(`${API}?q=${encodeURIComponent(debouncedQuery)}&type=autocomplete&limit=8`)
      .then((res) => res.json())
      .then((data) => { if (current && data.success) { setHits(data.hits || []); setSuggestions(data.suggestions || []); } })
      .catch((err) => console.warn("Search autocomplete fetch error", err))
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [debouncedQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      try { const stored = localStorage.getItem(RECENT_KEY); if (stored) setRecentSearches(JSON.parse(stored)); } catch {}
      const timer = setTimeout(() => {
        if (window.matchMedia("(max-width: 639px)").matches) mobileInputRef.current?.focus();
        else inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
    setQuery(""); setDebouncedQuery(""); setHits([]); setSuggestions([]);
  }, [isSearchOpen]);

  const handleExecuteSearch = useCallback((value: string) => {
    const q = value.trim();
    if (!q) return;
    setRecentSearches((current) => {
      const updated = [q, ...current.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const clearRecent = () => { setRecentSearches([]); try { localStorage.removeItem(RECENT_KEY); } catch {} };
  const removeRecent = (item: string) => setRecentSearches((current) => {
    const updated = current.filter((value) => value !== item);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch {}
    return updated;
  });
  const categoryCards = dbCategories.length ? dbCategories.map((category: any) => ({
    name: category.name,
    note: category.description || "Explore collection",
    image: category.imageUrl || "/images/products/hm_glory_agarbatti.jpg",
    slug: category.slug,
  })) : sacredCategories;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-label="Search products">
      <button className="absolute inset-0 bg-[#123936]/55 backdrop-blur-[3px]" onClick={() => setIsSearchOpen(false)} aria-label="Close search overlay" />
      <div className="relative flex h-[100dvh] items-stretch justify-center sm:h-full sm:items-start sm:overflow-y-auto sm:px-4 sm:py-12 lg:pt-[12vh]">
        <div className="relative flex h-full w-full max-w-[920px] flex-col overflow-hidden bg-[#FFF8E8] text-[#173B3A] shadow-2xl sm:h-auto sm:max-h-[84vh] sm:rounded-2xl">
          <div className="hidden shrink-0 items-center gap-3 border-b border-[#E8D7B3] px-6 py-5 sm:flex lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-white px-4 py-3 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-[#9E1830]/30">
              <Search size={21} className="shrink-0 text-[#A90C35]" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleExecuteSearch(query); if (e.key === "Escape") setIsSearchOpen(false); }} placeholder="Search sacred agarbatti, camphor, sambrani, pooja items..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8B8B7F]" />
              {loading && <Loader2 size={16} className="animate-spin text-[#A90C35]" />}
              {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="text-[#815D42]"><X size={17} /></button>}
            </div>
            <kbd className="rounded-lg bg-[#F4E6C8] px-2.5 py-2 text-[11px] font-bold text-[#76573C]">Ctrl</kbd><kbd className="-ml-2 rounded-lg bg-[#F4E6C8] px-2.5 py-2 text-[11px] font-bold text-[#76573C]">K</kbd>
            <button onClick={() => setIsSearchOpen(false)} className="ml-1 grid h-10 w-10 place-items-center rounded-full text-[#8C1830] hover:bg-[#F4EBD9]" aria-label="Close search"><X size={21} /></button>
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-[#E8D7B3] px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] sm:hidden">
            <button onClick={() => setIsSearchOpen(false)} className="grid h-9 w-9 place-items-center text-[#9E1830]" aria-label="Back"><ArrowRight className="rotate-180" size={20} /></button>
            <h2 className="text-sm font-extrabold">Search</h2>
            <button onClick={() => setIsSearchOpen(false)} className="grid h-9 w-9 place-items-center text-[#9E1830]" aria-label="Close search"><X size={21} /></button>
          </div>
          <div className="shrink-0 px-4 py-3 sm:hidden">
            <div className="flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-3 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-[#9E1830]/30">
              <Search size={19} className="shrink-0 text-[#A90C35]" />
              <input ref={mobileInputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleExecuteSearch(query); if (e.key === "Escape") setIsSearchOpen(false); }} placeholder="Search agarbatti, camphor..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#898A80]" />
              {loading && <Loader2 size={15} className="animate-spin text-[#A90C35]" />}
              {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="text-[#815D42]"><X size={16} /></button>}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:py-6 lg:px-8">
            {!query.trim() ? <div className="space-y-6 sm:space-y-7">
              {recentSearches.length > 0 && <section>
                <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-extrabold"><Clock3 size={16} className="text-[#9E1830]" />Recent Searches</h3><button onClick={clearRecent} className="text-xs font-semibold text-[#A90C35]">Clear all</button></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">{recentSearches.map((item) => {
                  const match = dbProducts.find((product) => product.name.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(product.name.toLowerCase()));
                  return <div key={item} className="flex min-w-0 items-center gap-2 rounded-xl bg-white p-2">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F7E8C8]">{match?.image ? <img src={match.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-lg">🪔</span>}</div>
                    <button onClick={() => handleExecuteSearch(item)} className="min-w-0 flex-1 text-left text-[11px] font-medium leading-snug text-[#173B3A]">{item}</button>
                    <button aria-label={`Remove ${item}`} onClick={() => removeRecent(item)} className="shrink-0 p-1 text-[#9A7356]"><X size={13} /></button>
                  </div>;
                })}</div>
              </section>}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold"><Sparkles size={16} className="text-[#9E1830]" />Popular Searches</h3>
                <div className="flex flex-wrap gap-2">{popularTags.map((tag) => <button key={tag} onClick={() => handleExecuteSearch(tag)} className="rounded-lg bg-white px-3.5 py-2 text-[11px] font-semibold text-[#9E1830] transition hover:bg-[#9E1830] hover:text-white sm:text-xs"><span className="mr-1">✦</span>{tag}</button>)}</div>
              </section>
              <section className="border-t border-[#E8D7B3] pt-5">
                <div className="mb-4 flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-sm font-extrabold"><Grid2X2 size={17} className="text-[#9E1830]" />Explore Sacred Categories</h3><Link href="/shop" onClick={() => setIsSearchOpen(false)} className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#A90C35]">View All <ArrowRight size={13} /></Link></div>
                <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">{categoryCards.map((category: any) => <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setIsSearchOpen(false)} className="group flex min-w-0 items-center gap-2 rounded-2xl bg-white/80 p-2 transition hover:shadow-card sm:gap-3 sm:p-2.5"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7E8C8] sm:h-14 sm:w-14"><img src={category.image} alt="" className="h-full w-full object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold sm:text-xs">{category.name}</p><p className="truncate text-[9px] text-[#758078] sm:text-[10px]">{category.note}</p></div><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#F5E5C4] text-[#9E1830]"><ChevronRight size={15} /></span></Link>)}</div>
              </section>
            </div> : loading || debouncedQuery !== query.trim() ? <div className="flex flex-col items-center justify-center py-12"><Loader2 className="mb-3 h-8 w-8 animate-spin text-[#A90C35]" /><p className="text-xs font-semibold text-[#76573C]">Searching the catalogue...</p></div> : <div className="space-y-3">
              {suggestions.length > 0 && <div className="flex flex-wrap gap-2 border-b border-[#E8D7B3] pb-3"><span className="w-full text-[10px] font-bold uppercase tracking-wider text-[#758078]">Suggestions</span>{suggestions.map((item) => <button key={item} onClick={() => handleExecuteSearch(item)} className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#9E1830]">{item}</button>)}</div>}
              <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-[#9E1830]">{hits.length} {hits.length === 1 ? "item" : "items"} found</p><button onClick={() => handleExecuteSearch(query)} className="flex items-center gap-1 text-xs font-bold text-[#A90C35]">View all <ArrowRight size={13} /></button></div>
              {hits.length ? hits.map((product) => {
                const name = product._formatted?.name || product.name;
                const category = product._formatted?.category || product.category;
                return <Link key={product.id || product.slug} href={`/product/${product.slug}`} onClick={() => setIsSearchOpen(false)} className="group flex min-w-0 items-center justify-between gap-3 rounded-xl bg-white p-2.5 transition hover:shadow-card sm:p-3.5">
                  <div className="flex min-w-0 items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7E8C8]">{product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center">🪔</span>}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-[#173B3A] group-hover:text-[#A90C35]" dangerouslySetInnerHTML={{ __html: name }} /><p className="truncate text-[11px] text-[#758078]" dangerouslySetInnerHTML={{ __html: `${category || "Sacred essentials"} · ${product.shortDescription || "Natural heritage"}` }} /></div></div>
                  <div className="shrink-0 text-right"><span className="font-price font-bold text-[#9E1830] tabular-nums">₹{product.price}</span>{product.mrp && product.mrp > product.price && <span className="font-price block text-[10px] text-[#758078] line-through tabular-nums">₹{product.mrp}</span>}</div>
                </Link>;
              }) : <div className="flex flex-col items-center py-6 text-center"><MascotSearch size={120} /><h3 className="mt-3 font-bold">No products found for “{query}”</h3><p className="mt-1 text-xs text-[#758078]">Try another product name or category.</p><div className="mt-4 flex flex-wrap justify-center gap-2">{popularTags.slice(0, 4).map((tag) => <button key={tag} onClick={() => handleExecuteSearch(tag)} className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#9E1830]">{tag}</button>)}</div></div>}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

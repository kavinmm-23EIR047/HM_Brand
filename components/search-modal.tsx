"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import { products } from "@/lib/products";
import { MascotSearch } from "@/components/mascot-art";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.note.toLowerCase().includes(query.toLowerCase()) ||
          (p.fragranceNotes && p.fragranceNotes.some((n) => n.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  const popularTags = ["Bhimseni Camphor", "HM Super Series", "Cup Sambrani", "Kesar Loban", "Chandan Dhoop", "Kasturi"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative min-h-screen px-4 pt-20 pb-12 flex justify-center items-start">
        <div className="relative w-full max-w-2xl bg-sacredCream border-2 border-antiqueGold rounded-2xl shadow-2xl overflow-hidden text-charcoal">
          {/* Search Header */}
          <div className="p-5 border-b border-antiqueGold/40 bg-turmeric/20 flex items-center gap-3">
            <Search className="text-saffron" size={22} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sacred agarbatti, camphor, sambrani..."
              className="flex-1 bg-transparent border-none outline-none font-sans text-base text-charcoal placeholder-charcoal/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs font-bold text-earthBrown bg-sacredCream px-2 py-1 rounded"
              >
                CLEAR
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-earthBrown hover:bg-sacredCream rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div>
                <p className="text-xs font-bold tracking-widest text-kumkum uppercase mb-3">Popular Sacred Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs bg-sacredCream border border-antiqueGold text-earthBrown hover:bg-templeOrange hover:text-sacredCream px-3.5 py-2 rounded-full font-semibold transition"
                    >
                      ✦ {tag}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-antiqueGold/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-xl text-earthBrown">Explore Sacred Categories</h4>
                    <p className="text-xs text-charcoal/70 mt-0.5">Find authentic products for daily worship</p>
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
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center">
                <MascotSearch size={140} />
                <h3 className="font-display text-2xl text-earthBrown mt-4">Let&apos;s find something meaningful</h3>
                <p className="text-sm text-charcoal/70 mt-2 max-w-sm">
                  We couldn&apos;t find an exact match for &ldquo;{query}&rdquo;. Try searching for camphor, dhoop, or agarbatti.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest text-kumkum uppercase mb-2">
                  Found {filtered.length} Sacred Items
                </p>
                {filtered.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3.5 bg-white border border-antiqueGold/30 rounded-xl hover:border-saffron transition group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-turmeric/40 border border-earthBrown/20 flex items-center justify-center text-xl shrink-0">
                        🪔
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-earthBrown group-hover:text-saffron transition">
                          {product.name}
                        </h4>
                        <p className="text-xs text-charcoal/60">{product.category} • {product.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-kumkum">₹{product.price}</span>
                      <span className="block text-[11px] text-charcoal/50 line-through">{product.mrp}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

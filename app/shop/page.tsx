"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, Sparkles, X } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotSearch } from "@/components/mascot-art";
import { products, categories } from "@/lib/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        // Price filter
        if (selectedPriceRange === "under-150" && p.price >= 150) return false;
        if (selectedPriceRange === "150-200" && (p.price < 150 || p.price > 200)) return false;
        if (selectedPriceRange === "above-200" && p.price <= 200) return false;
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchNote = p.note.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchNote && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#C89B3C]/40">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B23A48] bg-[#F4D35E]/30 px-3 py-1.5 rounded-full border border-[#C89B3C]">
            {filteredProducts.length} Sacred Items
          </span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-xs font-bold text-[#6B4226] hover:text-[#B23A48] flex items-center gap-1"
            >
              <span>Category: {selectedCategory}</span>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="text-xs bg-white border border-[#C89B3C] rounded-lg px-3.5 py-2 pr-8 text-[#292524] placeholder-[#292524]/50 outline-[#E85D04]"
            />
            <Search size={14} className="absolute right-2.5 top-2.5 text-[#6B4226]/60 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold bg-[#FFF8E7] border border-[#C89B3C] rounded-lg px-3 py-2 text-[#6B4226] outline-[#E85D04]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden btn-outline-earth px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Main Shop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`lg:col-span-3 space-y-8 ${
            mobileFilterOpen ? "block" : "hidden lg:block"
          } bg-[#FFF8E7] p-6 rounded-xl border-2 border-[#C89B3C]/40 h-fit`}
        >
          {/* Categories */}
          <div>
            <h3 className="font-display text-xl text-[#6B4226] font-bold mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-[#E85D04]" />
              Sacred Categories
            </h3>
            <div className="space-y-1.5">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-md transition flex items-center justify-between ${
                    selectedCategory === cat
                      ? "bg-[#E85D04] text-[#FFF8E7] font-bold"
                      : "text-[#6B4226] hover:bg-[#F4D35E]/30"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-75">
                    {cat === "All"
                      ? products.length
                      : products.filter((p) => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-6 border-t border-[#C89B3C]/30">
            <h3 className="font-display text-xl text-[#6B4226] font-bold mb-3">Price Range</h3>
            <div className="space-y-2 text-xs font-semibold text-[#6B4226]">
              {[
                { id: "all", label: "All Prices" },
                { id: "under-150", label: "Under ₹150" },
                { id: "150-200", label: "₹150 to ₹200" },
                { id: "above-200", label: "Above ₹200" },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === p.id}
                    onChange={() => setSelectedPriceRange(p.id)}
                    className="accent-[#E85D04]"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedPriceRange("all");
              setSearchQuery("");
            }}
            className="w-full btn-outline-earth py-2.5 text-center text-xs tracking-wider uppercase rounded-md font-bold"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#FFF8E7] rounded-2xl border-2 border-[#C89B3C]/40 p-12 text-center flex flex-col items-center">
              <MascotSearch size={160} />
              <h3 className="font-display text-3xl text-[#6B4226] mt-4 font-bold">
                No Sacred Items Found
              </h3>
              <p className="text-sm text-[#292524]/70 mt-2 max-w-md">
                We couldn&apos;t find products matching your selected filters. Try clearing some filters or searching for another fragrance.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedPriceRange("all");
                  setSearchQuery("");
                }}
                className="btn-saffron mt-6 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <InnerPage
      eyebrow="EXPLORE THE CATALOGUE"
      title="Sacred Fragrances & Puja Essentials"
      subtitle="Handcrafted incense sticks, crystalline Bhimseni camphor, wild sambrani cups, and festive formulations from Coimbatore."
    >
      <Suspense fallback={<div className="p-12 text-center text-[#6B4226]">Loading sacred collection...</div>}>
        <ShopContent />
      </Suspense>
    </InnerPage>
  );
}

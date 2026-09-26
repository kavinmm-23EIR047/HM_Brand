"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, Sparkles, X } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotSearch } from "@/components/mascot-art";
import { RitualArt } from "@/components/illustrations/RitualArt";
import { products, categories } from "@/lib/products";

const categoryIllustrations = {
  Agarbatti: "incense",
  Camphor: "camphor",
  Sambrani: "sambrani",
  Loban: "loban",
  Dhoop: "sandalwood",
  "Premium Fragrances": "diya",
  "Special Collections": "gift",
} as const;

const matchesCategory = (product: (typeof products)[number], category: string) => {
  if (category === "All") return true;
  if (category === "Premium Fragrances") return product.category === "Agarbatti";
  return product.category.toLowerCase() === category.toLowerCase();
};

const getCategoryCount = (category: string) =>
  category === "All" ? products.length : products.filter((product) => matchesCategory(product, category)).length;

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
        if (!matchesCategory(p, selectedCategory)) {
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
          const matchSubCategory = p.subCategory?.toLowerCase().includes(q) || false;
          const matchDescription = p.description.toLowerCase().includes(q);
          const matchFragrance = p.fragranceNotes?.some((note) => note.toLowerCase().includes(q)) || false;
          if (!matchName && !matchNote && !matchCat && !matchSubCategory && !matchDescription && !matchFragrance) return false;
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
      <section aria-labelledby="shop-categories-heading" className="mb-8 rounded-2xl bg-[#f8f0df] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold tracking-[.16em] text-[#a90c35]">FIND YOUR FRAGRANCE</p>
            <h2 id="shop-categories-heading" className="mt-1 text-lg font-extrabold tracking-[-.025em] text-[#173b3a] sm:text-xl">Shop by category</h2>
          </div>
          <span className="text-xs text-[#65736b]">Choose a ritual to narrow your search</span>
        </div>
        <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-4 lg:grid-cols-8 lg:gap-3">
          {["All", ...categories].map((category) => {
            const count = getCategoryCount(category);
            const isSelected = selectedCategory === category;
            const artKind = category === "All" ? "natural" : categoryIllustrations[category as keyof typeof categoryIllustrations];
            return (
              <button key={category} type="button" onClick={() => setSelectedCategory(category)} aria-pressed={isSelected} className={`group flex min-w-0 flex-col items-center rounded-xl px-1.5 py-2 text-center transition ${isSelected ? "bg-white shadow-sm ring-1 ring-[#3f7d45]/30" : "hover:bg-white/75"}`}>
                <span className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full transition group-hover:scale-105 sm:h-14 sm:w-14 ${isSelected ? "bg-[#dcebc9]" : "bg-white"}`}>
                  <RitualArt kind={artKind} className="h-full w-full p-1" />
                </span>
                <span className={`mt-1.5 line-clamp-2 text-[10px] font-bold leading-tight sm:text-[11px] ${isSelected ? "text-[#a90c35]" : "text-[#244038]"}`}>{category === "All" ? "All products" : category}</span>
                <span className="mt-0.5 text-[9px] text-[#758078]">{count} items</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 border-b border-[#e7dcc7] pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#e1edcf] px-3 py-1.5 text-xs font-bold text-[#28623f]">
            {filteredProducts.length} products
          </span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="flex items-center gap-1 text-xs font-bold text-[#173b3a] hover:text-[#a90c35]"
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
              aria-label="Search products"
              className="rounded-full border border-[#e6d8c0] bg-white px-4 py-2.5 pr-9 text-[13px] text-[#173b3a] placeholder:text-[#829087] outline-none transition focus:border-[#a90c35] focus:ring-2 focus:ring-[#a90c35]/10"
            />
            <Search size={15} className="pointer-events-none absolute right-3 top-3 text-[#a90c35]/75" />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
            className="rounded-full border border-[#e6d8c0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#173b3a] outline-none focus:border-[#a90c35]"
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
          } h-fit rounded-2xl bg-white p-5 shadow-sm`}
        >
          {/* Categories */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-base font-extrabold text-[#173b3a]">
              <Sparkles size={16} className="text-[#e28b2d]" />
              Filter by category
            </h3>
            <div className="space-y-1.5">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-md transition flex items-center justify-between ${
                    selectedCategory === cat
                    ? "bg-[#286b45] font-bold text-white"
                      : "text-[#38534a] hover:bg-[#f5f0e5]"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-75">
                    {cat === "All"
                      ? products.length
                      : getCategoryCount(cat)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-[#eee5d5] pt-5">
            <h3 className="mb-3 text-base font-extrabold text-[#173b3a]">Price range</h3>
            <div className="space-y-2.5 text-xs font-semibold text-[#38534a]">
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
            className="w-full rounded-full border border-[#286b45]/30 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#286b45] transition hover:bg-[#286b45] hover:text-white"
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
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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

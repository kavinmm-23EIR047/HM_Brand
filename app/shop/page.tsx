"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, Sparkles, X, ShieldCheck, Leaf, Heart } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Category Pills Strip */}
      <section aria-labelledby="shop-categories-heading" className="rounded-3xl bg-gradient-to-r from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-5 sm:p-6 border-2 border-[#F6C84C]/60 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-[#9E1830] uppercase">FIND YOUR SACRED FRAGRANCE</p>
            <h2 id="shop-categories-heading" className="mt-0.5 text-lg font-extrabold tracking-tight text-[#173B3A] sm:text-xl font-heading">
              Shop by Category
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#6B4226]">Choose a ritual category to filter</span>
        </div>

        <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-4 lg:grid-cols-8 lg:gap-3">
          {["All", ...categories].map((category) => {
            const count = getCategoryCount(category);
            const isSelected = selectedCategory === category;
            const artKind = category === "All" ? "natural" : categoryIllustrations[category as keyof typeof categoryIllustrations];
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isSelected}
                className={`group flex min-w-0 flex-col items-center rounded-2xl px-2 py-2.5 text-center transition ${
                  isSelected
                    ? "bg-white shadow-md border-2 border-[#9E1830] scale-105"
                    : "bg-white/60 hover:bg-white border border-[#F6C84C]/40"
                }`}
              >
                <span className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full transition group-hover:scale-110 sm:h-14 sm:w-14 ${
                  isSelected ? "bg-[#FFF4D6]" : "bg-white"
                }`}>
                  <RitualArt kind={artKind} className="h-full w-full p-1" />
                </span>
                <span className={`mt-1.5 line-clamp-2 text-[10px] font-bold leading-tight sm:text-[11px] ${
                  isSelected ? "text-[#9E1830]" : "text-[#173B3A]"
                }`}>
                  {category === "All" ? "All Products" : category}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold text-[#6B4226]/80">{count} items</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 border-b border-[#F6C84C]/30 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#9E1830] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
            {filteredProducts.length} Sacred Items
          </span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="flex items-center gap-1 rounded-full bg-[#FFF4D6] border border-[#F6C84C]/60 px-3 py-1 text-xs font-bold text-[#9E1830] hover:bg-[#9E1830] hover:text-white transition"
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
              placeholder="Search fragrance, notes..."
              aria-label="Search products"
              className="rounded-full border border-[#F6C84C]/60 bg-white px-4 py-2 text-xs text-[#173B3A] placeholder:text-[#173B3A]/50 outline-none transition focus:border-[#9E1830] focus:ring-2 focus:ring-[#9E1830]/15 pr-9 font-medium shadow-2xs"
            />
            <Search size={14} className="pointer-events-none absolute right-3 top-2.5 text-[#9E1830]" />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
            className="rounded-full border border-[#F6C84C]/60 bg-white px-4 py-2 text-xs font-bold text-[#173B3A] outline-none focus:border-[#9E1830] shadow-2xs cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden bg-white border border-[#F6C84C]/60 px-3.5 py-2 rounded-full text-xs font-bold text-[#9E1830] flex items-center gap-1.5 shadow-2xs"
          >
            <SlidersHorizontal size={13} /> Filters
          </button>
        </div>
      </div>

      {/* Main Shop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters Desktop */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? "block" : "hidden lg:block"
          } h-fit rounded-3xl bg-white p-6 border-2 border-[#F6C84C]/50 shadow-sm`}
        >
          {/* Categories */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#173B3A] uppercase tracking-wider font-heading">
              <Sparkles size={14} className="text-[#F47A20]" />
              Filter by Category
            </h3>
            <div className="space-y-1.5">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-between ${
                    selectedCategory === cat
                      ? "bg-[#9E1830] text-white shadow-xs"
                      : "text-[#173B3A] hover:bg-[#FFF4D6]"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] ${selectedCategory === cat ? "text-white/80" : "text-[#6B4226]"}`}>
                    {cat === "All" ? products.length : getCategoryCount(cat)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-[#F6C84C]/20 pt-5">
            <h3 className="mb-3 text-sm font-extrabold text-[#173B3A] uppercase tracking-wider font-heading">
              Price Range
            </h3>
            <div className="space-y-2 text-xs font-semibold text-[#173B3A]">
              {[
                { id: "all", label: "All Prices" },
                { id: "under-150", label: "Under ₹150" },
                { id: "150-200", label: "₹150 to ₹200" },
                { id: "above-200", label: "Above ₹200" },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2.5 cursor-pointer hover:text-[#9E1830]">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === p.id}
                    onChange={() => setSelectedPriceRange(p.id)}
                    className="accent-[#9E1830]"
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
            className="w-full rounded-full border border-[#9E1830] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#9E1830] transition hover:bg-[#9E1830] hover:text-white active:scale-95"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#F6C84C]/50 p-12 text-center flex flex-col items-center shadow-sm">
              <MascotSearch size={160} />
              <h3 className="font-heading text-2xl text-[#173B3A] mt-4 font-bold">
                No Sacred Items Found
              </h3>
              <p className="text-xs sm:text-sm text-[#292524]/75 mt-2 max-w-md">
                We couldn&apos;t find products matching your selected filters. Try clearing some filters or searching for another fragrance.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedPriceRange("all");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#9E1830] hover:bg-[#851227] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider transition shadow-md hover:scale-105 active:scale-95"
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
      eyebrow="EXPLORE THE SACRED CATALOGUE"
      title="Authentic Fragrances &amp; Pooja Essentials"
      subtitle="Handcrafted incense sticks, crystalline Bhimseni camphor, wild sambrani cups, and festive formulations from Coimbatore."
    >
      <Suspense fallback={<div className="p-12 text-center text-[#9E1830] font-bold">Loading sacred collection...</div>}>
        <ShopContent />
      </Suspense>
    </InnerPage>
  );
}

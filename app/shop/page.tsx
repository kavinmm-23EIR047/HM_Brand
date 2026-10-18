"use client";

import React, { useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Search,
  Sparkles,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Truck,
  Award,
  ChevronDown,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotSearch } from "@/components/mascot-art";
import { RitualArt } from "@/components/illustrations/RitualArt";
import { useStore } from "@/components/store";
import { categories, subCategoriesMap } from "@/lib/products";

// Metadata and visuals for the 9 canonical categories matching reference design
const categoryMeta: Record<
  string,
  { label: string; image?: string; art: string; subtitle?: string }
> = {
  Agarbatti: {
    label: "Agarbatti Sticks",
    image: "/images/agarbatti_cutout.jpg",
    art: "incense",
    subtitle: "Flora & Fragrance",
  },
  Camphor: {
    label: "Camphor Items",
    image: "/images/camphor_cutout.jpg",
    art: "camphor",
    subtitle: "Pure Bhimseni",
  },
  "Dhoop Stick / Bamboo-less Stick": {
    label: "Dhoop Sticks",
    image: "/images/brochure-incense-boxes.png",
    art: "loban",
    subtitle: "Bambooless",
  },
  "Incense Cones": {
    label: "Incense Cones",
    image: "/images/media_1790142713668.jpg",
    art: "loban",
    subtitle: "Sacred Cones",
  },
  "Havan Cups": {
    label: "Havan Cups",
    image: "/images/sambrani.jpg",
    art: "sambrani",
    subtitle: "Instant Sambrani",
  },
  "Sambrani Powder": {
    label: "Sambrani Powder",
    image: "/images/sambrani.jpg",
    art: "sambrani",
    subtitle: "Natural Resin",
  },
  "Pooja Essentials": {
    label: "Pooja Essentials",
    image: "/images/hm_bhimseni_camphor_aarti_scene.png",
    art: "diya",
    subtitle: "Daily Worship",
  },
  "Gift Sets": {
    label: "Gift Sets",
    image: "/images/special_offer_gift.png",
    art: "gift",
    subtitle: "Sacred Gifting",
  },
  "Family Pack": {
    label: "Family Pack",
    image: "/images/hm_family_pack_mascot.jpg",
    art: "gift",
    subtitle: "Value Packs",
  },
};

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSubcategory = searchParams.get("subcategory") || "All";

  const { dbProducts, dbCategories } = useStore();

  const allProducts = dbProducts || [];
  const categoryNames =
    dbCategories && dbCategories.length > 0
      ? dbCategories.filter((c: any) => !c.parentId).map((c) => c.name)
      : categories;

  const matchesCategory = (product: any, category: string) => {
    if (category === "All") return true;
    const catLower = category.toLowerCase().trim();
    const prodCatLower = (product.category || "").toLowerCase().trim();
    const prodSubCatLower = (product.subCategory || "").toLowerCase().trim();
    const productCategoryLabels = Array.isArray(product.categoryLabels)
      ? product.categoryLabels.map((label: string) => label.toLowerCase().trim())
      : [];

    if (catLower === "agarbatti") {
      if (
        prodCatLower.includes("agarbatti") ||
        prodCatLower.includes("exclusive") ||
        prodCatLower.includes("budget pack") ||
        prodCatLower.includes("super series") ||
        prodSubCatLower.includes("exclusive") ||
        prodSubCatLower.includes("budget pack") ||
        prodSubCatLower.includes("super series")
      ) {
        return true;
      }
    }

    if (productCategoryLabels.includes(catLower)) return true;
    if (prodCatLower === catLower || prodSubCatLower === catLower) return true;
    if (prodCatLower.includes(catLower) || catLower.includes(prodCatLower)) return true;
    if (prodSubCatLower.includes(catLower) || catLower.includes(prodSubCatLower)) return true;

    const catWords = catLower.split(/\s+/);
    return catWords.some(
      (word) =>
        word.length > 3 &&
        (prodCatLower.includes(word) ||
          prodSubCatLower.includes(word) ||
          productCategoryLabels.some((label: string) => label.includes(word)))
    );
  };

  const getCategoryCount = (category: string) =>
    category === "All"
      ? allProducts.length
      : allProducts.filter((product) => matchesCategory(product, category)).length;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [pricePreset, setPricePreset] = useState<"all" | "0-100" | "100-300" | "300+">("all");
  const [maxPriceSlider, setMaxPriceSlider] = useState<number>(500);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Category horizontal carousel ref & scroll handlers
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setPricePreset("all");
    setMaxPriceSlider(500);
    setSearchQuery("");
  };

  // Find subcategories belonging to current category selection
  const availableSubcategories = useMemo(() => {
    const subs = new Set<string>();

    if (selectedCategory !== "All" && dbCategories && dbCategories.length > 0) {
      const parentCat = dbCategories.find(
        (c: any) => !c.parentId && c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (parentCat) {
        dbCategories
          .filter((c: any) => c.parentId === parentCat.id)
          .forEach((c: any) => subs.add(c.name));
      }
    }

    if (selectedCategory === "Agarbatti" || selectedCategory === "All") {
      (subCategoriesMap["Agarbatti"] || []).forEach((s) => subs.add(s));
    }

    allProducts.forEach((p) => {
      if (selectedCategory === "All" || matchesCategory(p, selectedCategory)) {
        if (p.subCategory) subs.add(p.subCategory);
      }
    });

    return Array.from(subs).sort();
  }, [selectedCategory, dbCategories, allProducts]);

  const getSubcategoryCount = (subcat: string) => {
    return allProducts.filter((p) => {
      if (!matchesCategory(p, selectedCategory)) return false;
      if (subcat === "All") return true;
      return (p.subCategory || "").toLowerCase() === subcat.toLowerCase();
    }).length;
  };

  // Typo-tolerant Meilisearch integration
  const [meiliSlugs, setMeiliSlugs] = useState<Set<string> | null>(null);

  React.useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setMeiliSlugs(null);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=full&limit=50`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.hits)) {
            const slugs = new Set<string>();
            data.hits.forEach((h: any) => {
              if (h.slug) slugs.add(String(h.slug).toLowerCase());
              if (h.name) slugs.add(String(h.name).toLowerCase());
            });
            setMeiliSlugs(slugs);
          } else {
            setMeiliSlugs(new Set());
          }
        })
        .catch(() => setMeiliSlugs(null));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category filter
        if (!matchesCategory(p, selectedCategory)) {
          return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== "All") {
          const pSub = (p.subCategory || "").toLowerCase().trim();
          const selSub = selectedSubcategory.toLowerCase().trim();
          if (pSub !== selSub) {
            return false;
          }
        }

        // Price range presets
        if (pricePreset === "0-100" && p.price > 100) return false;
        if (pricePreset === "100-300" && (p.price < 100 || p.price > 300)) return false;
        if (pricePreset === "300+" && p.price < 300) return false;

        // Price slider ceiling (if slider was moved below max)
        if (maxPriceSlider < 500 && p.price > maxPriceSlider) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pSlug = (p.slug || "").toLowerCase();
          const pName = (p.name || "").toLowerCase();
          const meiliMatch = meiliSlugs ? meiliSlugs.has(pSlug) || meiliSlugs.has(pName) : false;
          if (meiliMatch) return true;

          const matchName = pName.includes(q);
          const matchNote = (p.note || "").toLowerCase().includes(q);
          const matchCat = (p.category || "").toLowerCase().includes(q);
          const matchSubCategory = (p.subCategory || "").toLowerCase().includes(q);
          const matchDescription = (p.description || "").toLowerCase().includes(q);
          const matchFragrance =
            p.fragranceNotes?.some((note: string) => note.toLowerCase().includes(q)) || false;
          if (
            !matchName &&
            !matchNote &&
            !matchCat &&
            !matchSubCategory &&
            !matchDescription &&
            !matchFragrance
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allProducts,
    selectedCategory,
    selectedSubcategory,
    pricePreset,
    maxPriceSlider,
    sortBy,
    searchQuery,
    meiliSlugs,
  ]);

  const isAnyFilterActive =
    selectedCategory !== "All" ||
    selectedSubcategory !== "All" ||
    pricePreset !== "all" ||
    maxPriceSlider < 500 ||
    Boolean(searchQuery.trim());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-5 sm:space-y-6 font-sans">
      {/* ─── BREADCRUMB ─── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#748078]">
        <Link href="/" className="hover:text-[#9E1830] transition-colors">
          Home
        </Link>
        <span className="text-stone-300">›</span>
        <span
          onClick={() => handleSelectCategory("All")}
          className="cursor-pointer hover:text-[#9E1830] transition-colors"
        >
          All Products
        </span>
        <span className="text-stone-300">›</span>
        <span className="text-[#9E1830] font-semibold">
          {selectedCategory === "All" ? "Authentic Fragrances & Pooja Essentials" : selectedCategory}
        </span>
      </nav>

      {/* ─── 1. SPLIT HERO BANNER (Authentic Fragrances & Pooja Essentials) ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FAF3E0]/70 px-5 py-4 sm:px-8 sm:py-5 lg:px-9 lg:py-5 border border-[#C89B3C]/20 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          {/* Left: Titles & Trust Badges */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
            <h1 className="font-playfair text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight tracking-tight">
              <span className="text-[#9E1830]">Authentic Fragrances</span>{" "}
              <span className="text-[#9E1830]">&amp;</span>{" "}
              <span className="text-[#173B3A]">Pooja Essentials</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#52625A] leading-relaxed max-w-xl">
              Handcrafted incense sticks, crystalline bhimseni camphor, pure sambrani, dhoop sticks,
              and traditional pooja essentials from Coimbatore’s trusted Vedic heritage.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 pt-1 text-[11px] sm:text-xs font-semibold text-[#173B3A]">
              <span className="inline-flex items-center gap-1.5">
                <Leaf size={14} className="text-[#2D6A4F]" />
                Pure &amp; Natural
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#F47A20]" />
                Traditional Fragrances
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Award size={14} className="text-[#9E1830]" />
                Premium Quality
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck size={14} className="text-[#4C7FA8]" />
                Pan India Delivery
              </span>
            </div>
          </div>

          {/* Right: Divine Atmospheric Image (Compact Height) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative h-32 min-[420px]:h-36 sm:h-44 lg:h-48 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none overflow-hidden rounded-2xl flex items-center justify-center lg:justify-end">
              <img
                src="/images/hm_puja_products_scene.png"
                alt="Authentic pooja essentials altar"
                className="h-full w-full object-contain object-center lg:object-right transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("hm_temple_heritage_puja_scene")) {
                    target.src = "/images/hm_temple_heritage_puja_scene.png";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. SLIDE-BASED CATEGORIES CAROUSEL ("catgories is slide based") ─── */}
      <section aria-label="Browse by Category" className="relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-space text-[10px] sm:text-xs font-bold tracking-widest text-[#9E1830] uppercase block">
              SACRED REPERTOIRE
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#173B3A]">
              Shop by Category
            </h2>
          </div>

          {/* Arrow navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Scroll categories left"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-[#173B3A] shadow-xs border border-stone-200 hover:border-[#9E1830] hover:text-[#9E1830] transition active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Scroll categories right"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-[#173B3A] shadow-xs border border-stone-200 hover:border-[#9E1830] hover:text-[#9E1830] transition active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-3 overflow-x-auto scroll-smooth py-2 px-1 snap-x scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Canonical Category Cards in Slider */}
          {categoryNames.map((catKey) => {
            const meta = categoryMeta[catKey] || {
              label: catKey,
              art: "natural",
              subtitle: "Pure Formula",
            };
            const isSelected = selectedCategory === catKey;
            const count = getCategoryCount(catKey);

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleSelectCategory(catKey)}
                aria-pressed={isSelected}
                className={`group flex flex-col items-center justify-between rounded-2xl bg-white p-3 sm:p-3.5 text-center transition-all duration-200 shrink-0 w-[114px] sm:w-[130px] cursor-pointer snap-start ${
                  isSelected
                    ? "border-2 border-[#9E1830] shadow-sm bg-white scale-[1.02]"
                    : "border border-stone-200/90 hover:border-[#9E1830]/40 hover:shadow-xs"
                }`}
              >
                {/* Visual Thumbnail */}
                <div
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center overflow-hidden mb-2 p-1.5 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? "bg-[#FFF4D6]" : "bg-[#FAF3E0]/70"
                  }`}
                >
                  {meta.image ? (
                    <img
                      src={meta.image}
                      alt={meta.label}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <RitualArt kind={(meta.art || "natural") as any} className="h-full w-full p-1" />
                  )}
                </div>

                {/* Title & Count */}
                <div className="w-full">
                  <span
                    className={`block text-xs sm:text-[13px] font-bold leading-tight line-clamp-2 ${
                      isSelected ? "text-[#9E1830]" : "text-[#173B3A]"
                    }`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium block mt-0.5">
                    {count} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 3. ACTIVE FILTERS CHIP BAR & SORT CONTROL ─── */}
      <div className="flex flex-col gap-3 border-y border-stone-200/70 py-3 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        {/* Left: Active Chips & Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All Products Pill */}
          <button
            type="button"
            onClick={() => handleSelectCategory("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === "All"
                ? "bg-[#9E1830] text-white shadow-xs"
                : "bg-white text-[#173B3A] border border-stone-200 hover:border-[#9E1830]"
            }`}
          >
            All Products ({allProducts.length})
          </button>

          {/* Active Category Chip */}
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => handleSelectCategory("All")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E0] text-[#9E1830] border border-[#C89B3C]/30 px-3 py-1.5 text-xs font-bold hover:bg-[#9E1830] hover:text-white transition"
            >
              <span>{categoryMeta[selectedCategory]?.label || selectedCategory}</span>
              <X size={13} />
            </button>
          )}

          {/* Active Subcategory Chip */}
          {selectedSubcategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedSubcategory("All")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E0] text-[#9E1830] border border-[#C89B3C]/30 px-3 py-1.5 text-xs font-bold hover:bg-[#9E1830] hover:text-white transition"
            >
              <span>{selectedSubcategory}</span>
              <X size={13} />
            </button>
          )}

          {/* Active Price Preset Chip */}
          {pricePreset !== "all" && (
            <button
              type="button"
              onClick={() => setPricePreset("all")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E0] text-[#9E1830] border border-[#C89B3C]/30 px-3 py-1.5 text-xs font-bold hover:bg-[#9E1830] hover:text-white transition"
            >
              <span>
                {pricePreset === "0-100" ? "₹0 - ₹100" : pricePreset === "100-300" ? "₹100 - ₹300" : "₹300+"}
              </span>
              <X size={13} />
            </button>
          )}

          {/* Active Search Query Chip */}
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E0] text-[#9E1830] border border-[#C89B3C]/30 px-3 py-1.5 text-xs font-bold hover:bg-[#9E1830] hover:text-white transition"
            >
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <X size={13} />
            </button>
          )}

          {/* Clear All Link */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-[#9E1830] hover:underline px-2 py-1"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Right: Quick Search, Sort, and Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agarbatti, camphor..."
              aria-label="Search catalog"
              className="w-44 sm:w-56 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-[#173B3A] placeholder:text-stone-400 outline-none focus:border-[#9E1830] transition pr-8 shadow-xs"
            />
            <Search size={13} className="pointer-events-none absolute right-3 top-2.5 text-stone-400" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="appearance-none rounded-full border border-stone-200 bg-white pl-3.5 pr-8 py-1.5 text-xs font-semibold text-[#173B3A] outline-none focus:border-[#9E1830] shadow-xs cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-stone-400" />
          </div>

          {/* Mobile Filter Sheet Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold text-[#173B3A] shadow-xs hover:border-[#9E1830]"
          >
            <SlidersHorizontal size={13} className="text-[#9E1830]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ─── 4. MAIN LAYOUT: DESKTOP FILTERS SIDEBAR + PRODUCT GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 rounded-3xl bg-white p-6 border border-stone-200/80 shadow-xs sticky top-24">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-playfair font-bold text-lg text-[#173B3A]">Filters</h3>
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-semibold text-[#9E1830] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Checkboxes List */}
          <div>
            <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
              Category
            </h4>
            <div className="space-y-2">
              {categoryNames.map((catKey) => {
                const isChecked = selectedCategory === catKey;
                const count = getCategoryCount(catKey);
                const displayLabel = categoryMeta[catKey]?.label || catKey;

                return (
                  <label
                    key={catKey}
                    className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] transition group select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            handleSelectCategory("All");
                          } else {
                            handleSelectCategory(catKey);
                          }
                        }}
                        className="h-4 w-4 rounded border-stone-300 text-[#9E1830] focus:ring-[#9E1830] accent-[#9E1830] cursor-pointer"
                      />
                      <span className={`truncate ${isChecked ? "font-bold text-[#9E1830]" : "font-normal"}`}>
                        {displayLabel}
                      </span>
                    </div>
                    <span className="text-stone-400 font-medium text-[11px] shrink-0 ml-2">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if available) */}
          {availableSubcategories.length > 0 && (
            <div className="border-t border-stone-100 pt-5">
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
                Sub Category
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubcategory === "All"}
                      onChange={() => setSelectedSubcategory("All")}
                      className="accent-[#9E1830] cursor-pointer"
                    />
                    <span className={selectedSubcategory === "All" ? "font-bold text-[#9E1830]" : ""}>
                      All
                    </span>
                  </div>
                </label>

                {availableSubcategories.map((subcat) => {
                  const isChecked = selectedSubcategory === subcat;
                  const count = getSubcategoryCount(subcat);

                  return (
                    <label
                      key={subcat}
                      className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={isChecked}
                          onChange={() => setSelectedSubcategory(subcat)}
                          className="accent-[#9E1830] cursor-pointer"
                        />
                        <span className={`truncate ${isChecked ? "font-bold text-[#9E1830]" : ""}`}>
                          {subcat}
                        </span>
                      </div>
                      <span className="text-stone-400 font-medium text-[11px] shrink-0 ml-2">
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range Slider & Preset Pills */}
          <div className="border-t border-stone-100 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A]">
                Price Range
              </h4>
              <span className="text-xs font-bold text-[#9E1830]">
                Up to ₹{maxPriceSlider}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={maxPriceSlider}
              onChange={(e) => {
                setMaxPriceSlider(Number(e.target.value));
                setPricePreset("all");
              }}
              className="w-full accent-[#9E1830] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>₹0</span>
              <span>₹500</span>
            </div>

            {/* Preset Pills */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { id: "all", label: "All" },
                { id: "0-100", label: "₹0 - ₹100" },
                { id: "100-300", label: "₹100 - ₹300" },
                { id: "300+", label: "₹300+" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPricePreset(p.id as any);
                    setMaxPriceSlider(500);
                  }}
                  className={`rounded-lg py-1.5 px-2 text-[11px] font-semibold transition ${
                    pricePreset === p.id
                      ? "bg-[#9E1830] text-white"
                      : "bg-stone-100 text-[#173B3A] hover:bg-stone-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center flex flex-col items-center border border-stone-200/80 shadow-xs">
              <MascotSearch size={140} />
              <h3 className="font-playfair text-2xl text-[#173B3A] mt-4 font-bold">
                No Sacred Items Found
              </h3>
              <p className="text-sm text-stone-500 mt-2 max-w-md leading-relaxed">
                We couldn&apos;t find products matching your selected filters. Try clearing some filters or
                choosing another category.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#9E1830] hover:bg-[#851227] text-white px-6 py-2.5 font-semibold text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 5. MOBILE FILTER DRAWER (MODAL SHEET) ─── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-playfair font-bold text-lg text-[#173B3A]">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-[#173B3A]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 py-5">
              {/* Category Checkboxes */}
              <div>
                <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
                  Category
                </h4>
                <div className="space-y-2.5">
                  {categoryNames.map((catKey) => {
                    const isChecked = selectedCategory === catKey;
                    const count = getCategoryCount(catKey);
                    const displayLabel = categoryMeta[catKey]?.label || catKey;

                    return (
                      <label
                        key={catKey}
                        className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                handleSelectCategory("All");
                              } else {
                                handleSelectCategory(catKey);
                              }
                            }}
                            className="h-4 w-4 rounded accent-[#9E1830]"
                          />
                          <span className={isChecked ? "font-bold text-[#9E1830]" : ""}>
                            {displayLabel}
                          </span>
                        </div>
                        <span className="text-stone-400 text-[11px]">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Preset Filter */}
              <div className="border-t border-stone-100 pt-5">
                <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
                  Price Range
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "0-100", label: "₹0 - ₹100" },
                    { id: "100-300", label: "₹100 - ₹300" },
                    { id: "300+", label: "₹300+" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPricePreset(p.id as any)}
                      className={`rounded-lg py-2 px-3 text-xs font-semibold ${
                        pricePreset === p.id
                          ? "bg-[#9E1830] text-white"
                          : "bg-stone-100 text-[#173B3A]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply & Close */}
            <div className="mt-auto pt-4 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-full bg-[#9E1830] text-white py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full text-center text-xs font-semibold text-stone-500 hover:text-[#9E1830] py-1"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <InnerPage
      eyebrow="AUTHENTIC FRAGRANCES & POOJA ESSENTIALS"
      title="Authentic Fragrances & Pooja Essentials"
      subtitle="Handcrafted incense sticks, crystalline bhimseni camphor, wild sambrani cups, and authentic sacred formulations."
      showHero={false}
    >
      <Suspense
        fallback={
          <div className="p-16 text-center text-[#9E1830] font-bold">
            Loading sacred collection...
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </InnerPage>
  );
}

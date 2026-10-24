"use client";

import React, { useState, useMemo, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Search,
  Sparkles,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Award,
  Heart,
  ShoppingBag,
  Star,
  LayoutGrid,
  List,
  RotateCcw,
  Home,
  Gem,
  Flame,
} from "lucide-react";
import { useStore } from "@/components/store";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { categories, subCategoriesMap, mapDbProductToProduct } from "@/lib/products";

// Metadata and visuals for the 9 canonical categories matching reference design
const categoryMeta: Record<
  string,
  {
    label: string;
    tag: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    bannerImage: string;
    image: string;
    features: string[];
    subcategories: string[];
  }
> = {
  All: {
    label: "All Categories",
    tag: "PURE & TRADITIONAL",
    titlePart1: "Sacred",
    titlePart2: "Fragrances",
    description:
      "Experience the divine purity of natural agarbattis, crystalline bhimseni camphor, wild sambrani cups, and authentic sacred pooja essentials.",
    bannerImage: "/images/camphor_banner.jpg",
    image: "/images/products/hm_camphor_no25.jpg",
    features: ["100% Natural", "Pure & Safe", "Traditional Use", "Premium Quality"],
    subcategories: [],
  },
  Camphor: {
    label: "Camphor Items",
    tag: "PURE & TRADITIONAL",
    titlePart1: "Camphor",
    titlePart2: "Items",
    description:
      "Experience the divine purity of natural camphor, crafted for pooja, meditation, and spiritual well-being.",
    bannerImage: "/images/camphor_banner.jpg",
    image: "/images/products/hm_camphor_no25.jpg",
    features: ["100% Natural", "Pure & Safe", "Traditional Use", "Premium Quality"],
    subcategories: [
      "Regular Camphor",
      "Bhimseni Camphor",
      "Camphor Tablets",
      "Pooja Camphor",
      "Aromatic Camphor",
      "Camphor Powder",
    ],
  },
  Agarbatti: {
    label: "Agarbatti Sticks",
    tag: "TEMPLE HERITAGE",
    titlePart1: "Agarbatti",
    titlePart2: "Sticks",
    description:
      "Sacred flora incense rolled with temple resins, natural flower petals, and aromatic herbs for daily rituals.",
    bannerImage: "/images/hm_puja_products_scene.png",
    image: "/images/products/hm_glory_agarbatti.jpg",
    features: ["100% Charcoal Free", "Pure Temple Flora", "Long Lasting", "Vedic Heritage"],
    subcategories: ["Exclusive", "Super Series", "Budget Pack (12 pcs)"],
  },
  "Dhoop Stick / Bamboo-less Stick": {
    label: "Dhoop Stick Bamboo-less",
    tag: "VEDIC WELLNESS",
    titlePart1: "Dhoop Stick",
    titlePart2: "Bamboo-less",
    description:
      "Pure bamboo-less dhoop sticks releasing rich, tranquil aromas of sacred herbs, woods, and essential oils.",
    bannerImage: "/images/hm_wellness_incense_scene.png",
    image: "/images/products/hm_italian_mehak_dhoop.jpg",
    features: ["Bamboo-less", "Dense Sacred Aroma", "Zero Harmful Smoke", "Meditation Grade"],
    subcategories: ["Indian Bakhoor", "Italian Mehak"],
  },
  "Incense Cones": {
    label: "Incense Cone",
    tag: "SACRED AROMA",
    titlePart1: "Incense",
    titlePart2: "Cones",
    description:
      "Dense, aromatic cones infused with natural essential resins and woods for focused meditation and evening puja.",
    bannerImage: "/images/hm_temple_heritage_puja_scene.png",
    image: "/images/products/hm_pure_loban_cup_sambrani.jpg",
    features: ["Instant Rich Smoke", "Natural Resins", "Concentrated Aroma", "Clean Burning"],
    subcategories: [],
  },
  "Havan Cups": {
    label: "Havan Cups",
    tag: "TRADITIONAL YAGNA",
    titlePart1: "Havan",
    titlePart2: "Cups",
    description:
      "Ready-to-light charcoal-free cups infused with pure sambrani, loban, guggal, and sacred havan samagri.",
    bannerImage: "/images/hm_temple_heritage_puja_scene.png",
    image: "/images/products/hm_pure_loban_cup_sambrani.jpg",
    features: ["Ready to Light", "Pure Sambrani", "Negative Energy Cleanser", "Havan Samagri"],
    subcategories: ["Cup Sambrani"],
  },
  "Sambrani Powder": {
    label: "Sambrani Powder",
    tag: "ANCIENT PURITY",
    titlePart1: "Sambrani",
    titlePart2: "Powder",
    description:
      "Natural Benzoin and pure tree resin powder for traditional dhoop burners, home purification, and festive pujas.",
    bannerImage: "/images/hm_puja_products_scene.png",
    image: "/images/products/hm_pure_loban_cup_sambrani.jpg",
    features: ["Benzoin Resin", "Air Purifier", "Traditional Aroma", "Vastu Cleansing"],
    subcategories: ["Exclusive 4-in-1 Loban Series"],
  },
  "Pooja Essentials": {
    label: "Pooja Essentials",
    tag: "DIVINE RITUALS",
    titlePart1: "Pooja",
    titlePart2: "Essentials",
    description:
      "Authentic puja items, brass deepams, pure oils, and sacred accessories crafted for daily mandir rituals.",
    bannerImage: "/images/hm_puja_products_scene.png",
    image: "/images/hm_bhimseni_camphor_aarti_scene.png",
    features: ["Temple Grade", "Authentic Items", "Pure Brass & Oils", "Daily Worship"],
    subcategories: [],
  },
  "Gift Sets": {
    label: "Gift Sets",
    tag: "SACRED BLESSINGS",
    titlePart1: "Gift",
    titlePart2: "Sets",
    description:
      "Thoughtfully curated festive gift boxes containing sacred agarbattis, pure camphor, and divine aromas.",
    bannerImage: "/images/hm_temple_heritage_puja_scene.png",
    image: "/images/special_offer_gift.png",
    features: ["Festive Packaging", "Assorted Fragrances", "Spiritual Gifting", "Premium Quality"],
    subcategories: [],
  },
  "Family Pack": {
    label: "Family Pack",
    tag: "VALUE BLESSINGS",
    titlePart1: "Family",
    titlePart2: "Pack",
    description:
      "Economical jumbo packs of long-burning incense and sacred camphor for joint families and temple pujas.",
    bannerImage: "/images/hm_puja_products_scene.png",
    image: "/images/hm_flagship_mascot_transparent.png",
    features: ["Mega Value", "Multi-Fragrance", "Daily Puja Supply", "10-in-1 Assortment"],
    subcategories: ["10-in-1 Family Pack"],
  },
};

// Canonical category list ordered precisely as requested
const canonicalCategories = [
  "Agarbatti",
  "Camphor",
  "Dhoop Stick / Bamboo-less Stick",
  "Incense Cones",
  "Havan Cups",
  "Sambrani Powder",
  "Pooja Essentials",
  "Gift Sets",
  "Family Pack",
];

// Helper to determine product badge - ONLY use backend data
function getProductBadge(product: any) {
  if (!product.badge) return null;
  const bLower = product.badge.toLowerCase();
  if (bLower.includes("best") || bLower.includes("bestseller")) {
    return { text: product.badge, bg: "bg-[#F47A20]" };
  }
  if (bLower.includes("pure") || bLower.includes("natural")) {
    return { text: product.badge, bg: "bg-[#287541]" };
  }
  if (bLower.includes("new")) {
    return { text: product.badge, bg: "bg-[#0284C7]" };
  }
  return { text: product.badge, bg: "bg-[#9E1830]" };
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Camphor";
  const initialSubcategory = searchParams.get("subcategory") || "All";

  const { dbProducts, dbCategories, add, toggleWishlist, isInWishlist } = useStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fallback direct API fetch if store hasn't populated yet
  useEffect(() => {
    if (dbProducts && dbProducts.length > 0) {
      setProductsList(dbProducts);
    } else {
      setLoading(true);
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      fetch(`${api}/products?limit=100`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setProductsList(json.data.map((item: any) => mapDbProductToProduct(item)));
          }
        })
        .catch((err) => console.error("Error fetching shop products:", err))
        .finally(() => setLoading(false));
    }
  }, [dbProducts]);

  const allProducts = productsList;

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [pricePreset, setPricePreset] = useState<"all" | "0-100" | "100-300" | "300+">("all");
  const [maxPriceSlider, setMaxPriceSlider] = useState<number>(500);
  const [availability, setAvailability] = useState<{ inStock: boolean; outOfStock: boolean }>({
    inStock: true,
    outOfStock: false,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Category horizontal scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategoryTrack = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Category matching helper
  const matchesCategory = (product: any, category: string) => {
    if (category === "All") return true;
    const catLower = category.toLowerCase().trim();
    const prodCatLower = (product.category || "").toLowerCase().trim();
    const prodSubCatLower = (product.subCategory || "").toLowerCase().trim();
    const productCategoryLabels = Array.isArray(product.categoryLabels)
      ? product.categoryLabels.map((l: string) => l.toLowerCase().trim())
      : [];

    // Special category aliasing
    if (catLower === "camphor") {
      return (
        prodCatLower.includes("camphor") ||
        prodSubCatLower.includes("camphor") ||
        productCategoryLabels.some((l: string) => l.includes("camphor")) ||
        product.name.toLowerCase().includes("camphor")
      );
    }

    if (catLower === "agarbatti") {
      return (
        prodCatLower.includes("agarbatti") ||
        prodCatLower.includes("exclusive") ||
        prodCatLower.includes("budget pack") ||
        prodCatLower.includes("super series") ||
        productCategoryLabels.some(
          (l: string) =>
            l.includes("agarbatti") ||
            l.includes("exclusive") ||
            l.includes("super series") ||
            l.includes("budget pack")
        )
      );
    }

    if (catLower.includes("dhoop")) {
      return (
        prodCatLower.includes("dhoop") ||
        prodCatLower.includes("bambooless") ||
        prodCatLower.includes("bakhoor") ||
        prodCatLower.includes("mehak")
      );
    }

    if (catLower.includes("havan") || catLower.includes("chandan cups")) {
      return (
        prodCatLower.includes("havan") ||
        prodCatLower.includes("chandan cups") ||
        productCategoryLabels.some((l: string) => l.includes("chandan") || l.includes("havan"))
      );
    }

    if (catLower.includes("sambrani") || catLower.includes("sambhrani")) {
      return (
        prodCatLower.includes("sambrani") ||
        prodCatLower.includes("sambhrani") ||
        productCategoryLabels.some((l: string) => l.includes("sambrani") || l.includes("sambhrani"))
      );
    }

    if (catLower.includes("family")) {
      return prodCatLower.includes("family") || product.name.toLowerCase().includes("family");
    }

    if (productCategoryLabels.includes(catLower)) return true;
    if (prodCatLower === catLower || prodSubCatLower === catLower) return true;
    if (prodCatLower.includes(catLower) || catLower.includes(prodCatLower)) return true;

    return false;
  };

  const getCategoryCount = (catKey: string) => {
    return allProducts.filter((p) => matchesCategory(p, catKey)).length;
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");
    setVisibleCount(8);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setPricePreset("all");
    setMaxPriceSlider(500);
    setAvailability({ inStock: true, outOfStock: false });
    setSearchQuery("");
    setVisibleCount(8);
  };

  // Derive dynamic subcategory list for current category
  const dynamicSubcategories = useMemo(() => {
    const currentMeta = categoryMeta[selectedCategory];
    if (currentMeta && currentMeta.subcategories.length > 0) {
      return currentMeta.subcategories;
    }

    // Dynamic extraction from products in current category
    const subs = new Set<string>();
    allProducts.forEach((p) => {
      if (matchesCategory(p, selectedCategory)) {
        if (p.subCategory && p.subCategory !== "Natural Heritage Aroma") {
          subs.add(p.subCategory);
        }
        if (Array.isArray(p.categoryLabels)) {
          p.categoryLabels.forEach((label: string) => {
            if (label.toLowerCase() !== selectedCategory.toLowerCase()) {
              subs.add(label);
            }
          });
        }
      }
    });

    return Array.from(subs).filter((s) => s.length > 2);
  }, [selectedCategory, allProducts]);

  const getSubcategoryCount = (sub: string) => {
    const subLower = sub.toLowerCase();
    return allProducts.filter((p) => {
      if (!matchesCategory(p, selectedCategory)) return false;
      const nameMatch = p.name.toLowerCase().includes(subLower);
      const subCatMatch = (p.subCategory || "").toLowerCase().includes(subLower);
      const labelsMatch = (p.categoryLabels || []).some((l: string) =>
        l.toLowerCase().includes(subLower)
      );
      return nameMatch || subCatMatch || labelsMatch;
    }).length;
  };

  // Dynamic In Stock & Out of Stock counts for current category
  const inStockCount = useMemo(() => {
    return allProducts.filter(
      (p) => matchesCategory(p, selectedCategory) && ((p.stockQuantity ?? 1) > 0 || p.inStock)
    ).length;
  }, [allProducts, selectedCategory]);

  const outOfStockCount = useMemo(() => {
    return allProducts.filter(
      (p) => matchesCategory(p, selectedCategory) && ((p.stockQuantity ?? 0) === 0 && !p.inStock)
    ).length;
  }, [allProducts, selectedCategory]);

  // Main Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category
        if (!matchesCategory(p, selectedCategory)) return false;

        // Subcategory
        if (selectedSubcategory !== "All") {
          const subLower = selectedSubcategory.toLowerCase();
          const nameMatch = p.name.toLowerCase().includes(subLower);
          const subCatMatch = (p.subCategory || "").toLowerCase().includes(subLower);
          const labelsMatch = (p.categoryLabels || []).some((l: string) =>
            l.toLowerCase().includes(subLower)
          );
          if (!nameMatch && !subCatMatch && !labelsMatch) return false;
        }

        // Availability Filter
        const isProductInStock = (p.stockQuantity ?? 1) > 0 || p.inStock;
        if (availability.inStock && !availability.outOfStock && !isProductInStock) {
          return false;
        }
        if (!availability.inStock && availability.outOfStock && isProductInStock) {
          return false;
        }

        // Price presets
        if (pricePreset === "0-100" && p.price > 100) return false;
        if (pricePreset === "100-300" && (p.price < 100 || p.price > 300)) return false;
        if (pricePreset === "300+" && p.price < 300) return false;

        // Price slider
        if (maxPriceSlider < 500 && p.price > maxPriceSlider) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pName = (p.name || "").toLowerCase();
          const pDesc = (p.description || "").toLowerCase();
          const pNote = (p.note || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          if (!pName.includes(q) && !pDesc.includes(q) && !pNote.includes(q) && !pCat.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 4.9) - (a.rating || 4.9);
        if (sortBy === "newest") return (b.id || "").localeCompare(a.id || "");
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    allProducts,
    selectedCategory,
    selectedSubcategory,
    availability,
    pricePreset,
    maxPriceSlider,
    searchQuery,
    sortBy,
  ]);

  const activeMeta = categoryMeta[selectedCategory] || categoryMeta.All;
  const isAnyFilterActive =
    selectedCategory !== "All" ||
    selectedSubcategory !== "All" ||
    pricePreset !== "all" ||
    maxPriceSlider < 500 ||
    !availability.inStock ||
    availability.outOfStock ||
    Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBF8F3] text-[#173B3A] font-sans">
      <div>
        <Navigation />
        <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8 space-y-6 pt-4 pb-16">
        
        {/* ─── 1. BREADCRUMB ─── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-stone-500"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[#9E1830] hover:text-[#7A1225] transition-colors"
          >
            <Home size={14} className="text-[#9E1830]" />
            <span>Home</span>
          </Link>
          <span className="text-stone-300">›</span>
          <button
            type="button"
            onClick={() => handleSelectCategory("All")}
            className="hover:text-[#9E1830] transition-colors"
          >
            Shop
          </button>
          <span className="text-stone-300">›</span>
          <span className="text-[#9E1830] font-semibold">
            {selectedCategory === "All" ? "All Products" : activeMeta.label}
          </span>
        </nav>

        {/* ─── 2. EDITORIAL HERO CATEGORY BANNER ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF9EE] via-[#FFF3E1] to-[#FCECC9] border border-[#EADBBD] p-6 sm:p-8 lg:p-10 shadow-xs">
          {/* Subtle Corner Leaf Ornaments */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 opacity-25 bg-[radial-gradient(#287541_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 opacity-25 bg-[radial-gradient(#9E1830_1px,transparent_1px)] [background-size:12px_12px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-2 sm:space-y-3">
              <span className="inline-block font-tagline text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#9E1830]">
                {activeMeta.tag}
              </span>

              <h1 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold leading-tight uppercase tracking-wide">
                <span className="text-[#173B3A]">{activeMeta.titlePart1}</span>{" "}
                <span className="text-[#9E1830]">{activeMeta.titlePart2}</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#173B3A]/85 leading-relaxed max-w-xl font-sans">
                {activeMeta.description}
              </p>

              {/* 4 Feature Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#EADBBD] px-3 py-1.5 text-[11px] font-semibold text-[#173B3A] shadow-2xs">
                  <Leaf size={13} className="text-[#287541]" />
                  <span>100% Natural</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#EADBBD] px-3 py-1.5 text-[11px] font-semibold text-[#173B3A] shadow-2xs">
                  <ShieldCheck size={13} className="text-[#9E1830]" />
                  <span>Pure &amp; Safe</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#EADBBD] px-3 py-1.5 text-[11px] font-semibold text-[#173B3A] shadow-2xs">
                  <Sparkles size={13} className="text-[#F47A20]" />
                  <span>Traditional Use</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#EADBBD] px-3 py-1.5 text-[11px] font-semibold text-[#173B3A] shadow-2xs">
                  <Gem size={13} className="text-[#B45309]" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Right Focal Image */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative h-44 sm:h-52 lg:h-60 w-full max-w-[420px] rounded-2xl overflow-hidden shadow-md border-2 border-white/80 bg-white/40">
                <img
                  src={activeMeta.bannerImage}
                  alt={activeMeta.label}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("camphor_banner")) {
                      target.src = "/images/camphor_banner.jpg";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. SHOP BY CATEGORY ROW ─── */}
        <section aria-label="Shop by Category" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-brand text-lg sm:text-2xl font-bold uppercase tracking-wider text-[#173B3A]">
              Shop by Category
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCategoryTrack("left")}
                aria-label="Scroll left"
                className="h-8 w-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-[#173B3A] hover:border-[#9E1830] hover:text-[#9E1830] transition shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCategoryTrack("right")}
                aria-label="Scroll right"
                className="h-8 w-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-[#173B3A] hover:border-[#9E1830] hover:text-[#9E1830] transition shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Category Cards Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-stretch gap-3 overflow-x-auto scroll-smooth py-1 scrollbar-none snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {canonicalCategories.map((catKey) => {
              const meta = categoryMeta[catKey] || {
                label: catKey,
                image: "/images/products/hm_glory_agarbatti.jpg",
              };
              const isSelected = selectedCategory === catKey;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleSelectCategory(catKey)}
                  className={`group flex flex-col items-center justify-between rounded-2xl p-2.5 sm:p-3 text-center transition-all duration-200 shrink-0 w-[114px] sm:w-[124px] lg:shrink lg:flex-1 lg:w-auto cursor-pointer snap-start ${
                    isSelected
                      ? "border-2 border-[#9E1830] bg-[#FFF5F6] shadow-xs"
                      : "border border-stone-200/80 bg-white hover:border-[#EADBBD] hover:bg-[#FFFDF9]"
                  }`}
                >
                  {/* Category Thumbnail Box */}
                  <div
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center overflow-hidden mb-2 p-1.5 transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? "bg-[#FFE8EC]" : "bg-[#FAF4EB]"
                    }`}
                  >
                    <img
                      src={meta.image}
                      alt={meta.label}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`block text-xs font-bold leading-tight line-clamp-2 ${
                      isSelected ? "text-[#9E1830]" : "text-[#173B3A]"
                    }`}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── 4. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start pt-2">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-[#EADBBD]/80 shadow-2xs space-y-6 sticky top-24">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-playfair font-bold text-lg text-[#173B3A]">Filters</h3>
              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-semibold text-[#9E1830] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Section */}
            <div>
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
                Category
              </h4>
              <div className="space-y-2">
                {/* "All" Checkbox */}
                <label className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] transition select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedCategory === "All" && selectedSubcategory === "All"}
                      onChange={() => handleSelectCategory("All")}
                      className="h-4 w-4 rounded accent-[#9E1830] cursor-pointer"
                    />
                    <span
                      className={
                        selectedCategory === "All" && selectedSubcategory === "All"
                          ? "font-bold text-[#9E1830]"
                          : "font-normal"
                      }
                    >
                      All
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-[11px]">
                    ({allProducts.length})
                  </span>
                </label>

                {/* Subcategories of active category, or all categories if "All" is active */}
                {selectedCategory !== "All" && dynamicSubcategories.length > 0
                  ? dynamicSubcategories.map((subcat) => {
                      const isChecked = selectedSubcategory === subcat;
                      const count = getSubcategoryCount(subcat);

                      return (
                        <label
                          key={subcat}
                          className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] transition select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setSelectedSubcategory(isChecked ? "All" : subcat);
                                setVisibleCount(8);
                              }}
                              className="h-4 w-4 rounded accent-[#9E1830] cursor-pointer"
                            />
                            <span
                              className={`truncate ${
                                isChecked ? "font-bold text-[#9E1830]" : "font-normal"
                              }`}
                            >
                              {subcat}
                            </span>
                          </div>
                          <span className="text-stone-400 font-medium text-[11px] shrink-0 ml-2">
                            ({count})
                          </span>
                        </label>
                      );
                    })
                  : canonicalCategories.map((catKey) => {
                      const isChecked = selectedCategory === catKey;
                      const count = getCategoryCount(catKey);
                      const displayLabel = categoryMeta[catKey]?.label || catKey;

                      return (
                        <label
                          key={catKey}
                          className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] transition select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectCategory(isChecked ? "All" : catKey)}
                              className="h-4 w-4 rounded accent-[#9E1830] cursor-pointer"
                            />
                            <span
                              className={`truncate ${
                                isChecked ? "font-bold text-[#9E1830]" : "font-normal"
                              }`}
                            >
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

            {/* Price Range Filter */}
            <div className="border-t border-stone-100 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A]">
                  Price Range
                </h4>
                <span className="text-xs font-bold text-[#9E1830] tabular-nums">
                  ₹0 - ₹{maxPriceSlider}
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
                  setVisibleCount(8);
                }}
                className="w-full accent-[#9E1830] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-medium tabular-nums">
                <span>₹0</span>
                <span>₹500</span>
              </div>

              {/* Price Preset Pills Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
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
                      setVisibleCount(8);
                    }}
                    className={`rounded-lg py-1.5 px-2 text-xs font-semibold transition tabular-nums text-center ${
                      pricePreset === p.id
                        ? "bg-[#9E1830] text-white"
                        : "bg-[#F5F5F5] text-[#173B3A] hover:bg-stone-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="border-t border-stone-100 pt-5 space-y-3">
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A]">
                Availability
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={availability.inStock}
                      onChange={(e) => {
                        setAvailability((prev) => ({ ...prev, inStock: e.target.checked }));
                        setVisibleCount(8);
                      }}
                      className="h-4 w-4 rounded accent-[#9E1830] cursor-pointer"
                    />
                    <span className={availability.inStock ? "font-bold text-[#173B3A]" : ""}>
                      In Stock
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-[11px]">
                    ({inStockCount})
                  </span>
                </label>

                <label className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer hover:text-[#9E1830] select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={availability.outOfStock}
                      onChange={(e) => {
                        setAvailability((prev) => ({ ...prev, outOfStock: e.target.checked }));
                        setVisibleCount(8);
                      }}
                      className="h-4 w-4 rounded accent-[#9E1830] cursor-pointer"
                    />
                    <span className={availability.outOfStock ? "font-bold text-[#173B3A]" : ""}>
                      Out of Stock
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-[11px]">
                    ({outOfStockCount})
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT AREA */}
          <div className="lg:col-span-9 space-y-5">
            
            {/* Top Toolbar (Product count, Sort dropdown, Grid/List view toggle) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-3 sm:px-4 border border-[#EADBBD]/70 shadow-2xs">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#173B3A]">
                  {selectedCategory === "All" ? "All Products" : activeMeta.label}
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  ({filteredProducts.length})
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-[#173B3A]"
                >
                  <SlidersHorizontal size={13} className="text-[#9E1830]" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products"
                    className="appearance-none rounded-lg border border-stone-200 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-[#173B3A] outline-none focus:border-[#9E1830] cursor-pointer shadow-2xs"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrival</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 text-stone-400"
                  />
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-md transition ${
                      viewMode === "grid"
                        ? "bg-[#9E1830] text-white shadow-2xs"
                        : "text-stone-500 hover:text-[#173B3A]"
                    }`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`p-1.5 rounded-md transition ${
                      viewMode === "list"
                        ? "bg-[#9E1830] text-white shadow-2xs"
                        : "text-stone-500 hover:text-[#173B3A]"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid / List */}
            {loading ? (
              <div className="p-16 text-center text-[#9E1830] font-bold">
                Loading authentic collection...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Flame size={44} className="mx-auto text-[#9E1830]/50" />
                <h4 className="font-playfair text-xl font-bold text-[#173B3A]">
                  No Products Match Your Filter
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing selected categories or price filters to see more authentic items.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="rounded-full bg-[#9E1830] px-5 py-2 text-xs font-bold text-white hover:bg-[#801224] transition shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
                {filteredProducts.slice(0, visibleCount).map((product) => {
                  const badge = getProductBadge(product);
                  const isWishlisted = isInWishlist(product.slug);

                  return (
                    <div
                      key={product.slug || product.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-[#EADBBD]/60 bg-white p-3 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#EADBBD]"
                    >
                      {/* Top Image Box */}
                      <div className="relative aspect-square w-full rounded-xl bg-[#FAF6EE] overflow-hidden flex items-center justify-center p-3">
                        <Link
                          href={`/product/${product.slug}`}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <img
                            src={product.image || "/images/products/hm_camphor_no25.jpg"}
                            alt={product.name}
                            className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (!target.src.includes("hm_camphor_no25")) {
                                target.src = "/images/products/hm_camphor_no25.jpg";
                              }
                            }}
                          />
                        </Link>

                        {/* Top Badge */}
                        {badge && (
                          <span
                            className={`absolute left-2.5 top-2.5 z-10 rounded-md px-2 py-0.5 text-[9px] font-bold text-white shadow-2xs ${badge.bg}`}
                          >
                            {badge.text}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.slug);
                          }}
                          aria-label="Wishlist"
                          className="absolute right-2.5 top-2.5 z-10 h-7 w-7 rounded-full bg-white/95 flex items-center justify-center shadow-xs transition hover:scale-110 cursor-pointer"
                        >
                          <Heart
                            size={13}
                            className={
                              isWishlisted
                                ? "fill-[#9E1830] text-[#9E1830]"
                                : "text-stone-500 hover:text-[#9E1830]"
                            }
                          />
                        </button>
                      </div>

                      {/* Content Box */}
                      <div className="pt-3 flex flex-1 flex-col justify-between">
                        <div>
                          {/* Rating & Review Count */}
                          <div className="flex items-center gap-1.5 text-xs mb-1.5">
                            <Star size={13} className="fill-[#F47A20] text-[#F47A20]" />
                            <span className="font-bold text-xs text-[#111827]">
                              {product.rating || 4.9}
                            </span>
                            <span className="text-[#4B5563] text-xs font-medium">
                              ({product.reviewCount || 128})
                            </span>
                          </div>

                          {/* Product Title */}
                          <Link href={`/product/${product.slug}`}>
                            <h4 className="font-brand text-base sm:text-lg font-bold uppercase tracking-wider text-[#111827] line-clamp-1 group-hover:text-[#9E1830] transition-colors">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Subtitle / Note */}
                          <p className="text-xs sm:text-[13px] text-[#374151] font-medium line-clamp-1 mt-1">
                            {product.subCategory || product.note || "Pure & Natural Camphor"}
                          </p>
                        </div>

                        {/* Price & Add Button */}
                        <div className="mt-3.5 flex items-center justify-between gap-1.5 pt-2 border-t border-stone-100">
                          <div className="flex items-baseline gap-1">
                            <span className="font-brand font-extrabold text-base sm:text-lg text-[#9E1830]">
                              ₹{product.price}
                            </span>
                            {product.mrp && product.mrp !== `₹${product.price}` && (
                              <span className="text-xs text-[#6B7280] line-through font-medium">
                                {product.mrp}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => product.inStock && add(product)}
                            disabled={!product.inStock}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#9E1830] hover:bg-[#801224] text-white px-4 py-2 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag size={13} />
                            <span>{product.inStock ? "Add" : "Sold"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-3">
                {filteredProducts.slice(0, visibleCount).map((product) => {
                  const badge = getProductBadge(product);
                  const isWishlisted = isInWishlist(product.slug);

                  return (
                    <div
                      key={product.slug || product.id}
                      className="group flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-[#EADBBD]/70 bg-white p-4 shadow-2xs transition hover:shadow-md"
                    >
                      {/* Image */}
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-xl bg-[#FAF6EE] overflow-hidden flex items-center justify-center p-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <img
                            src={product.image || "/images/products/hm_camphor_no25.jpg"}
                            alt={product.name}
                            className="h-full w-full object-contain mix-blend-multiply"
                          />
                        </Link>
                        {badge && (
                          <span
                            className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-bold text-white ${badge.bg}`}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs">
                          <Star size={13} className="fill-[#F47A20] text-[#F47A20]" />
                          <span className="font-bold text-xs text-[#111827]">
                            {product.rating || 4.9}
                          </span>
                          <span className="text-[#4B5563] text-xs font-medium">
                            ({product.reviewCount || 128})
                          </span>
                        </div>
                        <Link href={`/product/${product.slug}`}>
                          <h4 className="font-brand text-base sm:text-lg font-bold uppercase tracking-wider text-[#111827] hover:text-[#9E1830] transition-colors">
                            {product.name}
                          </h4>
                        </Link>
                        <p className="text-xs sm:text-sm text-[#374151] font-medium line-clamp-2 max-w-xl">
                          {product.description || product.note}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-brand font-extrabold text-lg sm:text-xl text-[#9E1830]">
                            ₹{product.price}
                          </div>
                          {product.mrp && product.mrp !== `₹${product.price}` && (
                            <div className="text-xs text-[#6B7280] line-through font-medium">
                              {product.mrp}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.slug)}
                            aria-label="Wishlist"
                            className="h-8 w-8 rounded-full border border-stone-200 bg-white flex items-center justify-center"
                          >
                            <Heart
                              size={14}
                              className={
                                isWishlisted
                                  ? "fill-[#9E1830] text-[#9E1830]"
                                  : "text-stone-400 hover:text-[#9E1830]"
                              }
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => product.inStock && add(product)}
                            disabled={!product.inStock}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#9E1830] hover:bg-[#801224] text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-colors"
                          >
                            <ShoppingBag size={13} />
                            <span>{product.inStock ? "Add to Cart" : "Sold Out"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── 5. LOAD MORE PRODUCTS PAGINATION ─── */}
            {filteredProducts.length > visibleCount && (
              <div className="pt-6 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EADBBD] bg-[#FFF8F0] px-7 py-2.5 text-xs sm:text-sm font-semibold text-[#9E1830] shadow-2xs hover:bg-[#FFEEDB] transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Load More Products</span>
                </button>
                <span className="text-[11px] text-stone-500 font-medium">
                  Showing {Math.min(visibleCount, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── 6. MOBILE FILTER MODAL DRAWER ─── */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />
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
                {/* Categories */}
                <div>
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-[#173B3A] mb-3">
                    Category
                  </h4>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between text-xs text-[#173B3A] cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategory === "All"}
                          onChange={() => handleSelectCategory("All")}
                          className="h-4 w-4 rounded accent-[#9E1830]"
                        />
                        <span className={selectedCategory === "All" ? "font-bold text-[#9E1830]" : ""}>
                          All Categories
                        </span>
                      </div>
                      <span className="text-stone-400 text-[11px]">({allProducts.length})</span>
                    </label>

                    {canonicalCategories.map((catKey) => {
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
                              onChange={() => handleSelectCategory(isChecked ? "All" : catKey)}
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

                {/* Price Presets */}
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
                        className={`rounded-lg py-2 px-3 text-xs font-semibold tabular-nums ${
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

              {/* Actions */}
              <div className="mt-auto pt-4 border-t border-stone-100 space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-lg bg-[#9E1830] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs"
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
      </div>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-[#9E1830] font-bold">
          Loading sacred collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
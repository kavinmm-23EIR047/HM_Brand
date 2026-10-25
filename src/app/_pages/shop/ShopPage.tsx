"use client";

import React, { useState, useMemo, useRef, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { mapDbProductToProduct } from "@/lib/products";
import { ShopPageSkeleton } from "@/components/loading-skeletons";

const CATEGORY_IMAGE_SEARCH_TERMS: Record<string, string[]> = {
  "incense-cones": ["guggal", "incense"],
  "havan-cups": ["cup sambarani", "havan cup", "sambrani cup"],
  "pooja-essentials": ["dani machine", "pooja", "puja"],
  "gift-sets": ["10 in 1", "gift set", "combo pack"],
};

// Helper to determine product badge - ONLY use backend data
function getProductBadge(product: any) {
  if (!product.badge) return null;
  const bLower = product.badge.toLowerCase();
  if (bLower.includes("best") || bLower.includes("bestseller")) {
    return { text: product.badge, bg: "bg-brand-orange" };
  }
  if (bLower.includes("pure") || bLower.includes("natural")) {
    return { text: product.badge, bg: "bg-brand-green-dark" };
  }
  if (bLower.includes("new")) {
    return { text: product.badge, bg: "bg-[#0284C7]" };
  }
  return { text: product.badge, bg: "bg-brand-primary" };
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || (searchParams.get("search") ? "All" : "Camphor");
  const initialSubcategory = searchParams.get("subcategory") || "All";

  const { add, toggleWishlist, isInWishlist } = useStore();

  const addToCartAndReview = (product: any) => {
    if (!product.inStock) return;
    add(product);
    router.push("/cart");
  };

  const [productsList, setProductsList] = useState<any[]>([]);
  const [backendCategories, setBackendCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const loadProducts = async () => {
      setLoading(true);
      let catalogueLoaded = false;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const records: any[] = [];
      const categoriesRequest = fetch(`${api}/categories`, { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) return [];
          const json = await response.json();
          return json.success && Array.isArray(json.data) ? json.data : [];
        })
        .catch(() => []);

      try {
        for (let page = 1; page <= 100; page += 1) {
          const response = await fetch(`${api}/products?page=${page}&limit=500`, { cache: "no-store" });
          if (!response.ok) throw new Error("Product catalogue is unavailable.");
          const json = await response.json();
          if (!json.success || !Array.isArray(json.data)) throw new Error("Product catalogue response is invalid.");
          records.push(...json.data);
          if (!json.meta?.hasNextPage) break;
        }

        const uniqueProducts = new Map<string, any>();
        records.forEach((record) => {
          const key = record.slug || record.id;
          if (key) uniqueProducts.set(String(key), mapDbProductToProduct(record));
        });
        const categories = await categoriesRequest;
        if (active) {
          setProductsList(Array.from(uniqueProducts.values()));
          setBackendCategories(categories);
          setLoadError("");
          catalogueLoaded = true;
        }
      } catch (error) {
        console.error("Error fetching backend products:", error);
        if (active) {
          setProductsList([]);
          setBackendCategories([]);
          setLoadError("The product catalogue is loading. Retrying connection…");
        }
      } finally {
        if (!active) return;
        if (catalogueLoaded) {
          setLoading(false);
        } else {
          retryTimer = setTimeout(() => {
            void loadProducts();
          }, 5000);
        }
      }
    };

    void loadProducts();
    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  const allProducts = productsList;
  const categoryOptions = useMemo(() => {
    const productCategoryNames = new Set<string>();
    allProducts.forEach((product) => {
      if (product.category) productCategoryNames.add(product.category.toLowerCase().trim());
      product.categoryLabels?.forEach((name: string) => {
        if (name) productCategoryNames.add(name.toLowerCase().trim());
      });
    });

    const topLevelBackendCategories = backendCategories.filter((category) => !category.parentId);
    const source = topLevelBackendCategories.length > 0
      ? topLevelBackendCategories
      : Array.from(productCategoryNames).map((name) => ({ name, slug: name }));

    return source
      .map((category: any) => {
        const categoryName = category.name?.toLowerCase().trim();
        const representativeProduct = allProducts.find((product) => {
          const productCategories = [product.category, ...(product.categoryLabels || [])]
            .filter(Boolean)
            .map((name: string) => name.toLowerCase().trim());
          return product.image && productCategories.includes(categoryName);
        });
        const imageTerms = CATEGORY_IMAGE_SEARCH_TERMS[category.slug] || [];
        const relatedProduct = imageTerms.length > 0
          ? allProducts.find((product) => {
              if (!product.image) return false;
              const searchable = `${product.name} ${product.slug} ${product.category} ${product.subCategory || ""} ${product.description}`.toLowerCase();
              return imageTerms.some((term) => searchable.includes(term));
            })
          : undefined;

        return {
          id: category.id || category.slug || category.name,
          name: category.name,
          slug: category.slug || category.name,
          imageUrl: category.imageUrl || representativeProduct?.image || relatedProduct?.image || "",
          description: category.description || "",
          displayOrder: category.displayOrder ?? Number.MAX_SAFE_INTEGER,
        };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  }, [allProducts, backendCategories]);
  const subcategoryOptions = useMemo(() => {
    const options = new Map<string, { id: string; name: string; parentId?: string; parentName: string; displayOrder: number }>();
    backendCategories.forEach((category) => {
      if (!category.parentId) return;
      const parent = backendCategories.find((entry) => entry.id === category.parentId);
      if (!parent || !category.name) return;
      options.set(`${parent.id}:${category.name.toLowerCase()}`, {
        id: category.id,
        name: category.name,
        parentId: parent.id,
        parentName: parent.name,
        displayOrder: category.displayOrder ?? Number.MAX_SAFE_INTEGER,
      });
    });
    allProducts.forEach((product) => {
      if (!product.subCategory?.trim()) return;
      const parent = categoryOptions.find((category) => category.name.toLowerCase() === product.category.toLowerCase());
      if (!parent) return;
      const key = `${parent.id}:${product.subCategory.toLowerCase().trim()}`;
      if (!options.has(key)) {
        options.set(key, {
          id: key,
          name: product.subCategory.trim(),
          parentId: parent.id,
          parentName: parent.name,
          displayOrder: Number.MAX_SAFE_INTEGER,
        });
      }
    });
    return Array.from(options.values()).sort((a, b) =>
      a.parentName.localeCompare(b.parentName) || a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)
    );
  }, [allProducts, backendCategories, categoryOptions]);
  const categoryButtons = useMemo(() => categoryOptions.flatMap((category) => {
    const children = subcategoryOptions
      .filter((subcategory) => subcategory.parentId === category.id)
      .map((subcategory) => {
        const backendSubcategory = backendCategories.find((entry) => entry.id === subcategory.id);
        const productImage = allProducts.find((product) =>
          product.subCategory?.toLowerCase().trim() === subcategory.name.toLowerCase().trim() &&
          [product.category, ...(product.categoryLabels || [])]
            .filter(Boolean)
            .some((name: string) => name.toLowerCase().trim() === category.name.toLowerCase().trim()) &&
          product.image
        )?.image;
        return {
          id: subcategory.id,
          slug: subcategory.id,
          name: subcategory.name,
          imageUrl: backendSubcategory?.imageUrl || productImage || category.imageUrl,
          parentName: category.name,
        };
      });

    return [{ ...category, parentName: "" }, ...children];
  }), [allProducts, backendCategories, categoryOptions, subcategoryOptions]);
  const priceCeiling = useMemo(() => {
    const highestPrice = allProducts.reduce((highest, product) => Math.max(highest, product.price || 0), 0);
    return Math.max(100, Math.ceil(highestPrice / 100) * 100);
  }, [allProducts]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategoryKeys, setSelectedSubcategoryKeys] = useState<string[]>([]);
  const [pricePreset, setPricePreset] = useState<"all" | "0-100" | "100-300" | "300+">("all");
  const [maxPriceSlider, setMaxPriceSlider] = useState<number | null>(null);
  const [availability, setAvailability] = useState<{ inStock: boolean; outOfStock: boolean }>({
    inStock: true,
    outOfStock: false,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory === "All") {
      setSelectedCategories([]);
      setSelectedSubcategoryKeys([]);
      return;
    }
    if (!initialCategory || categoryOptions.length === 0) return;
    const normalized = initialCategory.toLowerCase().trim();
    const match = categoryOptions.find((category) =>
      category.name.toLowerCase().trim() === normalized ||
      category.slug.toLowerCase().trim() === normalized ||
      category.name.toLowerCase().includes(normalized)
    );
    if (!match) return;

    const subcategory = initialSubcategory === "All"
      ? undefined
      : subcategoryOptions.find((option) =>
          option.parentId === match.id &&
          option.name.toLowerCase().trim() === initialSubcategory.toLowerCase().trim()
        );
    setSelectedCategories(subcategory ? [] : [match.name]);
    setSelectedSubcategoryKeys(subcategory ? [subcategory.id] : []);
  }, [categoryOptions, subcategoryOptions, initialCategory, initialSubcategory]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Category horizontal scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategoryTrack = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const matchesCategory = (product: any, category: string) => {
    if (category === "All") return true;
    const selected = category.toLowerCase().trim();
    const labels = [product.category, ...(Array.isArray(product.categoryLabels) ? product.categoryLabels : [])]
      .filter(Boolean)
      .map((label: string) => label.toLowerCase().trim());
    const categoryOption = categoryOptions.find((option) =>
      option.slug.toLowerCase().trim() === selected || option.name.toLowerCase().trim() === selected
    );
    const selectedName = categoryOption?.name.toLowerCase().trim() || selected;
    return labels.includes(selectedName);
  };
  const getCategoryCount = (catKey: string) => {
    return allProducts.filter((p) => matchesCategory(p, catKey)).length;
  };

  const matchesSelectedCategories = (product: any) => {
    if (selectedCategories.length === 0 && selectedSubcategoryKeys.length === 0) return true;

    const matchesRootCategory = selectedCategories.some((category) => matchesCategory(product, category));
    const matchesSubcategory = subcategoryOptions.some((subcategory) =>
      selectedSubcategoryKeys.includes(subcategory.id) &&
      matchesCategory(product, subcategory.parentName) &&
      (product.subCategory || "").toLowerCase().trim() === subcategory.name.toLowerCase().trim()
    );

    return matchesRootCategory || matchesSubcategory;
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategories(cat === "All" ? [] : [cat]);
    setSelectedSubcategoryKeys([]);
    setVisibleCount(8);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]
    );
    setVisibleCount(8);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategoryKeys((current) => current.includes(subcategoryId)
      ? current.filter((item) => item !== subcategoryId)
      : [...current, subcategoryId]
    );
    setVisibleCount(8);
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategoryKeys([]);
    setPricePreset("all");
    setMaxPriceSlider(null);
    setAvailability({ inStock: true, outOfStock: false });
    setSearchQuery("");
    setVisibleCount(8);
  };

  const getSubcategoryCount = (sub: string, parentCategory: string) => {
    return allProducts.filter((p) => {
      if (!matchesCategory(p, parentCategory)) return false;
      return (p.subCategory || "").toLowerCase().trim() === sub.toLowerCase().trim();
    }).length;
  };

  // Dynamic In Stock & Out of Stock counts for current category
  const inStockCount = useMemo(() => {
    return allProducts.filter(
      (p) => matchesSelectedCategories(p) && p.inStock
    ).length;
  }, [allProducts, selectedCategories, selectedSubcategoryKeys, subcategoryOptions]);

  const outOfStockCount = useMemo(() => {
    return allProducts.filter(
      (p) => matchesSelectedCategories(p) && !p.inStock
    ).length;
  }, [allProducts, selectedCategories, selectedSubcategoryKeys, subcategoryOptions]);

  // Main Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category
        if (!matchesSelectedCategories(p)) return false;

        // Availability Filter
        const isProductInStock = p.inStock;
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
        if (maxPriceSlider !== null && p.price > maxPriceSlider) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pName = (p.name || "").toLowerCase();
          const pDesc = (p.description || "").toLowerCase();
          const pNote = (p.note || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          const pCategoryLabels = (p.categoryLabels || []).join(" ").toLowerCase();
          if (!pName.includes(q) && !pDesc.includes(q) && !pNote.includes(q) && !pCat.includes(q) && !pCategoryLabels.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.id || "").localeCompare(a.id || "");
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    allProducts,
    selectedCategories,
    selectedSubcategoryKeys,
    subcategoryOptions,
    availability,
    pricePreset,
    maxPriceSlider,
    searchQuery,
    sortBy,
  ]);

  const selectedSubcategories = subcategoryOptions.filter((subcategory) => selectedSubcategoryKeys.includes(subcategory.id));
  const activeCategoryName = selectedCategories.length === 1
    ? selectedCategories[0]
    : selectedCategories.length === 0 && selectedSubcategories.length === 1
      ? selectedSubcategories[0].parentName
      : "";
  const activeCategory = categoryOptions.find((category) => category.name === activeCategoryName);
  const activeLabel = selectedCategories.length === 0 && selectedSubcategories.length === 0
    ? "All Products"
    : selectedCategories.length + selectedSubcategories.length > 1
      ? "Selected Categories"
      : selectedSubcategories.length === 1
        ? `${selectedSubcategories[0].parentName} · ${selectedSubcategories[0].name}`
        : selectedCategories[0] || "All Products";
  const allProductsImage = allProducts.find((product) => product.image)?.image;
  const allProductsSelected = selectedCategories.length === 0 && selectedSubcategoryKeys.length === 0;
  const isAnyFilterActive =
    selectedCategories.length > 0 ||
    selectedSubcategoryKeys.length > 0 ||
    pricePreset !== "all" ||
    maxPriceSlider !== null ||
    !availability.inStock ||
    availability.outOfStock ||
    Boolean(searchQuery.trim());

  if (loading) {
    return <ShopPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBF8F3] text-brand-ink font-sans">
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
            className="inline-flex items-center gap-1 text-brand-primary hover:text-[#7A1225] transition-colors"
          >
            <Home size={14} className="text-brand-primary" />
            <span>Home</span>
          </Link>
          <span className="text-stone-300">›</span>
          <button
            type="button"
            onClick={() => handleSelectCategory("All")}
            className="hover:text-brand-primary transition-colors"
          >
            Shop
          </button>
          <span className="text-stone-300">›</span>
          <span className="text-brand-primary font-semibold">
            {activeLabel}
          </span>
        </nav>

        {/* ─── 2. EDITORIAL HERO CATEGORY BANNER ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-surface-cream via-[#FFF3E1] to-[#FCECC9] border border-brand-border p-6 sm:p-8 lg:p-10 shadow-xs">
          {/* Subtle Corner Leaf Ornaments */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 opacity-25 bg-[radial-gradient(#287541_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 opacity-25 bg-[radial-gradient(var(--brand-primary)_1px,transparent_1px)] [background-size:12px_12px]" />

          <div className={`grid grid-cols-1 gap-6 items-center relative z-10 ${activeCategory?.imageUrl ? "lg:grid-cols-12" : ""}`}>
            {/* Left Content */}
            <div className={activeCategory?.imageUrl ? "lg:col-span-7 space-y-2 sm:space-y-3" : "space-y-2 sm:space-y-3"}>
              <h1 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold leading-tight uppercase tracking-wide">
                <span className="text-brand-ink">{activeLabel}</span>
              </h1>

              {activeCategory?.description && <p className="max-w-xl font-sans text-sm leading-relaxed text-brand-ink/85">{activeCategory.description}</p>}
            </div>

            {activeCategory?.imageUrl && (
              <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
                <div className="relative h-44 w-full max-w-[420px] overflow-hidden rounded-2xl border-2 border-white/80 bg-white/40 shadow-md sm:h-52 lg:h-60">
                  <img src={activeCategory.imageUrl} alt={activeCategory.name} className="h-full w-full object-cover object-center" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── 3. SHOP BY CATEGORY ROW ─── */}
        <section aria-label="Shop by Category" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-brand text-lg sm:text-2xl font-bold uppercase tracking-wider text-brand-ink">
              Shop by Category
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCategoryTrack("left")}
                aria-label="Scroll left"
                className="h-8 w-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-brand-ink hover:border-brand-primary hover:text-brand-primary transition shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCategoryTrack("right")}
                aria-label="Scroll right"
                className="h-8 w-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-brand-ink hover:border-brand-primary hover:text-brand-primary transition shadow-2xs"
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
            <button
              type="button"
              aria-pressed={allProductsSelected}
              onClick={() => handleSelectCategory("All")}
              className={`group flex min-h-[116px] w-[116px] shrink-0 snap-start flex-col items-center justify-between rounded-2xl p-2.5 text-center transition-all duration-200 cursor-pointer sm:min-h-[124px] sm:w-[132px] sm:p-3 lg:w-[148px] ${
                allProductsSelected
                  ? "border-2 border-brand-primary bg-[#FFF5F6] shadow-xs"
                  : "border border-stone-200/80 bg-white hover:border-brand-border hover:bg-[#FFFDF9]"
              }`}
            >
              <div className={`relative mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 ${allProductsSelected ? "bg-[#FFE8EC]" : "bg-[#FAF4EB]"}`}>
                {allProductsImage
                  ? <img src={allProductsImage} alt="All products" loading="lazy" className="h-full w-full object-contain" />
                  : <span className="font-brand text-lg font-bold text-brand-primary">All</span>}
              </div>
              <span className={`block text-xs font-bold leading-tight ${allProductsSelected ? "text-brand-primary" : "text-brand-ink"}`}>All Products</span>
            </button>
            {categoryButtons.map((category) => {
              const isSubcategory = Boolean(category.parentName);
              const subcategory = isSubcategory
                ? subcategoryOptions.find((option) => option.id === category.slug)
                : undefined;
              const isSelected = isSubcategory
                ? Boolean(subcategory && selectedSubcategoryKeys.includes(subcategory.id))
                : selectedCategories.includes(category.name);

              return (
                <button
                  key={`${category.parentName || "root"}-${category.slug}`}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (isSubcategory) {
                      setSelectedCategories([]);
                      setSelectedSubcategoryKeys(isSelected || !subcategory ? [] : [subcategory.id]);
                      setVisibleCount(8);
                    } else {
                      handleSelectCategory(category.name);
                    }
                  }}
                  className={`group flex min-h-[116px] w-[116px] shrink-0 snap-start flex-col items-center justify-between rounded-2xl p-2.5 text-center transition-all duration-200 cursor-pointer sm:min-h-[124px] sm:w-[132px] sm:p-3 lg:w-[148px] ${
                    isSelected
                      ? "border-2 border-brand-primary bg-[#FFF5F6] shadow-xs"
                      : "border border-stone-200/80 bg-white hover:border-brand-border hover:bg-[#FFFDF9]"
                  }`}
                >
                  <div className={`relative mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 ${isSelected ? "bg-[#FFE8EC]" : "bg-[#FAF4EB]"}`}>
                    {category.imageUrl
                      ? <img src={category.imageUrl} alt={category.name} loading="lazy" className="h-full w-full object-contain" />
                      : <span className="font-brand text-lg font-bold text-brand-primary">{category.name.slice(0, 1)}</span>}
                  </div>

                  {/* Label */}
                  <span
                    className={`block break-words text-xs font-bold leading-tight ${
                      isSelected ? "text-brand-primary" : "text-brand-ink"
                    }`}
                  >
                    {category.parentName && <span className="block text-[9px] font-medium text-brand-muted">{category.parentName}</span>}
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── 4. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start pt-2">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-brand-border/80 shadow-2xs space-y-6 sticky top-24">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-playfair font-bold text-lg text-brand-ink">Filters</h3>
              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Section */}
            <div>
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-brand-ink mb-3">
                Category
              </h4>
              <div className="space-y-2">
                {/* "All" Checkbox */}
                <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer hover:text-brand-primary transition select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={allProductsSelected}
                      onChange={() => handleSelectCategory("All")}
                      className="h-4 w-4 rounded accent-[var(--brand-primary)] cursor-pointer"
                    />
                    <span
                      className={
                        allProductsSelected
                          ? "font-bold text-brand-primary"
                          : "font-normal"
                      }
                    >
                      All
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-ui-11">
                    ({allProducts.length})
                  </span>
                </label>

                {categoryOptions.map((category) => {
                  const isChecked = selectedCategories.includes(category.name);
                  const count = getCategoryCount(category.name);

                  return (
                    <React.Fragment key={category.slug}>
                      <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer hover:text-brand-primary transition select-none">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(category.name)}
                            className="h-4 w-4 rounded accent-[var(--brand-primary)] cursor-pointer"
                          />
                          <span className={`break-words ${isChecked ? "font-bold text-brand-primary" : "font-normal"}`}>
                            {category.name}
                          </span>
                        </div>
                        <span className="text-stone-400 font-medium text-ui-11 shrink-0 ml-2">({count})</span>
                      </label>
                      {subcategoryOptions.filter((subcategory) => subcategory.parentId === category.id).map((subcategory) => {
                        const subcategoryChecked = selectedSubcategoryKeys.includes(subcategory.id);
                        const subcategoryCount = getSubcategoryCount(subcategory.name, category.name);
                        return (
                          <label key={subcategory.id} className="ml-6 flex items-center justify-between text-xs text-brand-ink/80 cursor-pointer hover:text-brand-primary transition select-none">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={subcategoryChecked}
                                onChange={() => {
                                  toggleSubcategory(subcategory.id);
                                }}
                                className="h-4 w-4 rounded accent-[var(--brand-primary)] cursor-pointer"
                              />
                              <span className={`break-words ${subcategoryChecked ? "font-bold text-brand-primary" : "font-normal"}`}>{subcategory.name}</span>
                            </div>
                            <span className="ml-2 shrink-0 text-ui-11 text-stone-400">({subcategoryCount})</span>
                          </label>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="border-t border-stone-100 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-space text-xs font-bold uppercase tracking-wider text-brand-ink">
                  Price Range
                </h4>
                <span className="text-xs font-bold text-brand-primary tabular-nums">
                  ₹0 - ₹{maxPriceSlider ?? priceCeiling}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max={priceCeiling}
                step="10"
                value={maxPriceSlider ?? priceCeiling}
                onChange={(e) => {
                  setMaxPriceSlider(Number(e.target.value));
                  setPricePreset("all");
                  setVisibleCount(8);
                }}
                className="w-full accent-[var(--brand-primary)] cursor-pointer"
              />
              <div className="flex justify-between text-ui-10 text-stone-400 font-medium tabular-nums">
                <span>₹0</span>
                <span>₹{priceCeiling}</span>
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
                      setMaxPriceSlider(null);
                      setVisibleCount(8);
                    }}
                    className={`rounded-lg py-1.5 px-2 text-xs font-semibold transition tabular-nums text-center ${
                      pricePreset === p.id
                        ? "bg-brand-primary text-white"
                        : "bg-[#F5F5F5] text-brand-ink hover:bg-stone-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="border-t border-stone-100 pt-5 space-y-3">
              <h4 className="font-space text-xs font-bold uppercase tracking-wider text-brand-ink">
                Availability
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer hover:text-brand-primary select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={availability.inStock}
                      onChange={(e) => {
                        setAvailability((prev) => ({ ...prev, inStock: e.target.checked }));
                        setVisibleCount(8);
                      }}
                      className="h-4 w-4 rounded accent-[var(--brand-primary)] cursor-pointer"
                    />
                    <span className={availability.inStock ? "font-bold text-brand-ink" : ""}>
                      In Stock
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-ui-11">
                    ({inStockCount})
                  </span>
                </label>

                <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer hover:text-brand-primary select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={availability.outOfStock}
                      onChange={(e) => {
                        setAvailability((prev) => ({ ...prev, outOfStock: e.target.checked }));
                        setVisibleCount(8);
                      }}
                      className="h-4 w-4 rounded accent-[var(--brand-primary)] cursor-pointer"
                    />
                    <span className={availability.outOfStock ? "font-bold text-brand-ink" : ""}>
                      Out of Stock
                    </span>
                  </div>
                  <span className="text-stone-400 font-medium text-ui-11">
                    ({outOfStockCount})
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT AREA */}
          <div className="lg:col-span-9 space-y-5">
            
            {/* Top Toolbar (Product count, Sort dropdown, Grid/List view toggle) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-3 sm:px-4 border border-brand-border/70 shadow-2xs">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-brand-ink">
                  {activeLabel}
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
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-ink"
                >
                  <SlidersHorizontal size={13} className="text-brand-primary" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products"
                    className="appearance-none rounded-lg border border-stone-200 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-brand-ink outline-none focus:border-brand-primary cursor-pointer shadow-2xs"
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
                        ? "bg-brand-primary text-white shadow-2xs"
                        : "text-stone-500 hover:text-brand-ink"
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
                        ? "bg-brand-primary text-white shadow-2xs"
                        : "text-stone-500 hover:text-brand-ink"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid / List */}
            {loadError ? (
              <div className="rounded-2xl border border-brand-border bg-white p-12 text-center text-sm text-brand-muted">{loadError}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Flame size={44} className="mx-auto text-brand-primary/50" />
                <h4 className="font-playfair text-xl font-bold text-brand-ink">
                  No Products Match Your Filter
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing selected categories or price filters to see more authentic items.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="rounded-full bg-brand-primary px-5 py-2 text-xs font-bold text-white hover:bg-brand-mid-hover transition shadow-xs"
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
                      className="group relative flex min-h-[278px] flex-col justify-between rounded-2xl border border-brand-border/60 bg-white p-3 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-brand-border sm:min-h-[360px]"
                    >
                      {/* Top Image Box */}
                      <div className="relative aspect-square w-full rounded-xl bg-brand-surface-soft overflow-hidden flex items-center justify-center p-3">
                        <Link
                          href={`/product/${product.slug}`}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {product.image ? (
                            <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                          ) : (
                            <span className="px-2 text-center text-xs font-medium text-brand-muted">Image unavailable</span>
                          )}
                        </Link>

                        {/* Top Badge */}
                        {badge && (
                          <span
                            className={`absolute left-2.5 top-2.5 z-10 rounded-md px-2 py-0.5 text-ui-9 font-bold text-white shadow-2xs ${badge.bg}`}
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
                                ? "fill-brand-primary text-brand-primary"
                                : "text-stone-500 hover:text-brand-primary"
                            }
                          />
                        </button>
                      </div>

                      {/* Content Box */}
                      <div className="pt-3 flex flex-1 flex-col justify-between">
                        <div>
                          {/* Rating & Review Count */}
                          {product.rating > 0 && <div className="mb-1.5 flex items-center gap-1.5 text-xs">
                            <Star size={13} className="fill-brand-orange text-brand-orange" />
                            <span className="font-bold text-xs text-brand-heading">{product.rating}</span>
                            {product.reviewCount > 0 && <span className="text-brand-gray text-xs font-medium">({product.reviewCount})</span>}
                          </div>}

                          {/* Product Title */}
                          <Link href={`/product/${product.slug}`} aria-label={`View ${product.name} details`}>
                            <h4 title={product.name} className="line-clamp-1 min-h-5 font-brand text-sm sm:text-lg font-bold uppercase tracking-wider text-brand-heading group-hover:text-brand-primary transition-colors">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Subtitle / Note */}
                          {(product.subCategory || product.note) && <p title={product.subCategory || product.note} className="mt-1 min-h-10 line-clamp-2 text-xs font-medium leading-relaxed text-brand-slate sm:min-h-[44px] sm:text-ui-13">{product.subCategory || product.note}</p>}
                        </div>

                        {/* Price & Add Button */}
                        <div className="mt-3.5 flex items-center justify-between gap-1.5 pt-2 border-t border-stone-100">
                          <div className="flex items-baseline gap-1">
                            <span className="font-brand font-extrabold text-base sm:text-lg text-brand-primary">
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
                            onClick={() => addToCartAndReview(product)}
                            disabled={!product.inStock}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-primary hover:bg-brand-mid-hover text-white px-4 py-2 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className="group flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-brand-border/70 bg-white p-4 shadow-2xs transition hover:shadow-md"
                    >
                      {/* Image */}
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-xl bg-brand-surface-soft overflow-hidden flex items-center justify-center p-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain" /> : <span className="text-center text-xs text-brand-muted">Image unavailable</span>}
                        </Link>
                        {badge && (
                          <span
                            className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-ui-9 font-bold text-white ${badge.bg}`}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                        {product.rating > 0 && <div className="flex items-center justify-center gap-1.5 text-xs sm:justify-start">
                          <Star size={13} className="fill-brand-orange text-brand-orange" />
                          <span className="font-bold text-xs text-brand-heading">{product.rating}</span>
                          {product.reviewCount > 0 && <span className="text-brand-gray text-xs font-medium">({product.reviewCount})</span>}
                        </div>}
                        <Link href={`/product/${product.slug}`}>
                          <h4 className="font-brand text-base sm:text-lg font-bold uppercase tracking-wider text-brand-heading hover:text-brand-primary transition-colors">
                            {product.name}
                          </h4>
                        </Link>
                        <p className="text-xs sm:text-sm text-brand-slate font-medium leading-relaxed max-w-xl">
                          {product.description || product.note}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-brand font-extrabold text-lg sm:text-xl text-brand-primary">
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
                                  ? "fill-brand-primary text-brand-primary"
                                  : "text-stone-400 hover:text-brand-primary"
                              }
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCartAndReview(product)}
                            disabled={!product.inStock}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary hover:bg-brand-mid-hover text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-colors"
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
                  className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-[#FFF8F0] px-7 py-2.5 text-xs sm:text-sm font-semibold text-brand-primary shadow-2xs hover:bg-[#FFEEDB] transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Load More Products</span>
                </button>
                <span className="text-ui-11 text-stone-500 font-medium">
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
                <h3 className="font-playfair font-bold text-lg text-brand-ink">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-brand-ink"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 py-5">
                {/* Categories */}
                <div>
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-brand-ink mb-3">
                    Category
                  </h4>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allProductsSelected}
                          onChange={() => handleSelectCategory("All")}
                          className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                        />
                        <span className={allProductsSelected ? "font-bold text-brand-primary" : ""}>
                          All Categories
                        </span>
                      </div>
                      <span className="text-stone-400 text-ui-11">({allProducts.length})</span>
                    </label>

                    {categoryOptions.map((category) => {
                      const isChecked = selectedCategories.includes(category.name);
                      const count = getCategoryCount(category.name);
                      return (
                        <React.Fragment key={category.slug}>
                          <label className="flex items-center justify-between text-xs text-brand-ink cursor-pointer">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={isChecked} onChange={() => toggleCategory(category.name)} className="h-4 w-4 rounded accent-[var(--brand-primary)]" />
                              <span className={isChecked ? "font-bold text-brand-primary" : ""}>{category.name}</span>
                            </div>
                            <span className="text-stone-400 text-ui-11">({count})</span>
                          </label>
                          {subcategoryOptions.filter((subcategory) => subcategory.parentId === category.id).map((subcategory) => {
                            const subcategoryChecked = selectedSubcategoryKeys.includes(subcategory.id);
                            const subcategoryCount = getSubcategoryCount(subcategory.name, category.name);
                            return (
                              <label key={subcategory.id} className="ml-6 flex items-center justify-between text-xs text-brand-ink/80 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subcategoryChecked}
                                    onChange={() => {
                                      toggleSubcategory(subcategory.id);
                                    }}
                                    className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                                  />
                                  <span className={subcategoryChecked ? "font-bold text-brand-primary" : ""}>{subcategory.name}</span>
                                </div>
                                <span className="text-stone-400 text-ui-11">({subcategoryCount})</span>
                              </label>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Price Presets */}
                <div className="border-t border-stone-100 pt-5">
                  <h4 className="font-space text-xs font-bold uppercase tracking-wider text-brand-ink mb-3">
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
                            ? "bg-brand-primary text-white"
                            : "bg-stone-100 text-brand-ink"
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
                  className="w-full rounded-lg bg-brand-primary py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full text-center text-xs font-semibold text-stone-500 hover:text-brand-primary py-1"
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
        <div className="p-16 text-center text-brand-primary font-bold">
          Loading sacred collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

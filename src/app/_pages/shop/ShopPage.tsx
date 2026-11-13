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
import { hasProductRating, mapDbProductToProduct } from "@/lib/products";
import { ShopPageSkeleton } from "@/components/loading-skeletons";
import { SacredDiyaSvg } from "@/components/sacred-icons";

const CATEGORY_IMAGE_SEARCH_TERMS: Record<string, string[]> = {
  "incense-cones": ["guggal", "incense"],
  "havan-cups": ["cup sambarani", "havan cup", "sambrani cup"],
  "pooja-essentials": ["dani machine", "pooja", "puja"],
  "gift-sets": ["10 in 1", "gift set", "combo pack"],
};
const SHOP_CATEGORY_BANNER_IMAGE = "/images/hm_puja_products_scene.png";

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
  const initialCategory = searchParams.get("category") || "All";
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
      let firstPageLoaded = false;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const uniqueProducts = new Map<string, any>();
      const categoriesRequest = fetch(`${api}/categories`, { cache: "no-store", signal: AbortSignal.timeout(10000) })
        .then(async (response) => {
          if (!response.ok) return [];
          const json = await response.json();
          return json.success && Array.isArray(json.data) ? json.data : [];
        })
        .catch(() => [])
        .then((categories) => {
          if (active) setBackendCategories(categories);
          return categories;
        });

      try {
        for (let page = 1; page <= 100; page += 1) {
          const response = await fetch(`${api}/products?page=${page}&limit=100`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
          if (!response.ok) throw new Error("Product catalogue is unavailable.");
          const json = await response.json();
          if (!json.success || !Array.isArray(json.data)) throw new Error("Product catalogue response is invalid.");
          json.data.forEach((record: any) => {
            const key = record.slug || record.id;
            if (key) uniqueProducts.set(String(key), mapDbProductToProduct(record));
          });
          if (active) {
            setProductsList(Array.from(uniqueProducts.values()));
            setLoadError("");
            if (!firstPageLoaded) {
              firstPageLoaded = true;
              setLoading(false);
            }
          }
          if (!json.meta?.hasNextPage) break;
        }
        await categoriesRequest;
      } catch (error) {
        console.error("Error fetching backend products:", error);
        if (active && !firstPageLoaded) {
          setProductsList([]);
          setLoadError("The product catalogue is loading. Retrying connection…");
        } else if (active) {
          console.warn("Additional product pages could not be loaded; the available catalogue remains visible.");
        }
      } finally {
        if (!active) return;
        if (firstPageLoaded) {
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
  const PRODUCTS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsTopRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hasChosenViewMode, setHasChosenViewMode] = useState(false);

  // Independent collapsible dropdown sections (no auto-closing)
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [expandedCategorySlug, setExpandedCategorySlug] = useState<string | null>(null);

  const toggleCategoryDropdown = (slug: string) => {
    setExpandedCategorySlug((prev) => (prev === slug ? null : slug));
  };

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 639px)");
    const syncDefaultView = () => {
      if (!hasChosenViewMode) setViewMode(mobileViewport.matches ? "list" : "grid");
    };

    syncDefaultView();
    mobileViewport.addEventListener("change", syncDefaultView);
    return () => mobileViewport.removeEventListener("change", syncDefaultView);
  }, [hasChosenViewMode]);

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
    setCurrentPage(1);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]
    );
    setCurrentPage(1);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategoryKeys((current) => current.includes(subcategoryId)
      ? current.filter((item) => item !== subcategoryId)
      : [...current, subcategoryId]
    );
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategoryKeys([]);
    setPricePreset("all");
    setMaxPriceSlider(null);
    setAvailability({ inStock: true, outOfStock: false });
    setSearchQuery("");
    setCurrentPage(1);
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

        // Search query with Indian phonetic support (c <-> k)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const altQ = q.startsWith("c") ? "k" + q.slice(1) : q.startsWith("k") ? "c" + q.slice(1) : "";
          const pName = (p.name || "").toLowerCase();
          const pDesc = (p.description || "").toLowerCase();
          const pNote = (p.note || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          const pCategoryLabels = (p.categoryLabels || []).join(" ").toLowerCase();
          const matchDirect = pName.includes(q) || pDesc.includes(q) || pNote.includes(q) || pCat.includes(q) || pCategoryLabels.includes(q);
          const matchAlt = altQ && (pName.includes(altQ) || pDesc.includes(altQ) || pCat.includes(altQ) || pCategoryLabels.includes(altQ));
          if (!matchDirect && !matchAlt) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (searchQuery.trim() && sortBy === "featured") {
          const q = searchQuery.toLowerCase().trim();
          const aName = (a.name || "").toLowerCase();
          const bName = (b.name || "").toLowerCase();
          const aStarts = aName.startsWith(q);
          const bStarts = bName.startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          const aWordStarts = aName.split(/\s+/).some((w: string) => w.startsWith(q));
          const bWordStarts = bName.split(/\s+/).some((w: string) => w.startsWith(q));
          if (aWordStarts && !bWordStarts) return -1;
          if (!aWordStarts && bWordStarts) return 1;
        }
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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const selectedSubcategories = subcategoryOptions.filter((subcategory) => selectedSubcategoryKeys.includes(subcategory.id));
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
    <div className="min-h-screen flex flex-col justify-between bg-brand-surface-alt text-brand-ink font-sans">
      <div>
        <Navigation />
        <div className="page-container space-y-4 pt-3 pb-8 md:pb-12">

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

          {/* ─── 2. SHOP BY CATEGORY (COMPACT CHIPS STRIP) ─── */}
          <section aria-label="Shop by Category" className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-brand text-sm sm:text-base font-bold uppercase tracking-wider text-brand-heading">
                  Shop by Category
                </h2>
                <span className="text-[11px] font-semibold text-brand-slate bg-brand-surface-warm px-2 py-0.5 rounded-full border border-brand-border/60">
                  {categoryButtons.length + 1}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategoryTrack("left")}
                  aria-label="Scroll left"
                  className="h-7 w-7 rounded-full border border-brand-border bg-white flex items-center justify-center text-brand-heading hover:border-brand-primary hover:text-brand-primary transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategoryTrack("right")}
                  aria-label="Scroll right"
                  className="h-7 w-7 rounded-full border border-brand-border bg-white flex items-center justify-center text-brand-heading hover:border-brand-primary hover:text-brand-primary transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Compact Category Chips Track */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 scrollbar-none snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* All Products Pill */}
              <button
                type="button"
                aria-pressed={allProductsSelected}
                onClick={() => handleSelectCategory("All")}
                className={`group inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-[10px] px-3 transition-all duration-200 cursor-pointer shadow-2xs ${allProductsSelected
                    ? "bg-brand-primary text-white border border-brand-accent/50 shadow-xs scale-[1.02]"
                    : "bg-white text-brand-heading border border-brand-border hover:border-brand-primary/50 hover:bg-brand-surface-warm/40"
                  }`}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full ${allProductsSelected ? "bg-white/20" : "bg-brand-surface-warm"}`}>
                  {allProductsImage
                    ? <img src={allProductsImage} alt="All products" loading="lazy" className="h-full w-full object-cover" />
                    : <span className={`text-[10px] font-bold ${allProductsSelected ? "text-white" : "text-brand-primary"}`}>All</span>}
                </div>
                <span className="font-sans text-xs font-semibold whitespace-nowrap">All Products</span>
              </button>

              {/* Category Pills */}
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
                        setCurrentPage(1);
                      } else {
                        handleSelectCategory(category.name);
                      }
                    }}
                    className={`group inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-[10px] px-3 transition-all duration-200 cursor-pointer shadow-2xs ${isSelected
                        ? "bg-brand-primary text-white border border-brand-accent/50 shadow-xs scale-[1.02]"
                        : "bg-white text-brand-heading border border-brand-border hover:border-brand-primary/50 hover:bg-brand-surface-warm/40"
                      }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full ${isSelected ? "bg-white/20" : "bg-brand-surface-warm"}`}>
                      {category.imageUrl
                        ? <img src={category.imageUrl} alt={category.name} loading="lazy" className="h-full w-full object-cover" />
                        : <span className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-brand-primary"}`}>{category.name.slice(0, 1)}</span>}
                    </div>

                    <span className="font-sans text-xs font-semibold whitespace-nowrap">
                      {category.parentName && <span className="opacity-70 font-normal mr-1">{category.parentName}:</span>}
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─── 3. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCT GRID ─── */}
          <div className="flex flex-col lg:flex-row gap-5 xl:gap-6 items-start pt-1.5">

            {/* DESKTOP SIDEBAR FILTERS (Increased Width & Compact Height) */}
            <aside className="hidden lg:flex w-[285px] xl:w-[310px] shrink-0 flex-col rounded-2xl bg-white border border-brand-border/80 shadow-2xs p-3.5 sm:px-4 sm:py-3.5 space-y-2.5 sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto">

              {/* Top Header Row */}
              <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-heading/80">
                  Filters
                </span>
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs font-semibold text-brand-primary hover:text-brand-hover hover:underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Browse categories Section (Independent Collapsible Dropdown) */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((prev) => !prev)}
                  aria-expanded={categoriesOpen}
                  className="w-full flex items-center justify-between py-0.5 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans font-bold text-xs sm:text-[13px] text-brand-heading group-hover:text-brand-primary transition-colors">
                      Browse categories
                    </h3>
                    {(selectedCategories.length > 0 || selectedSubcategoryKeys.length > 0) && (
                      <span className="text-[10px] font-bold bg-brand-primary text-white rounded-full px-1.5 py-0.5 leading-none">
                        {selectedCategories.length + selectedSubcategoryKeys.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-stone-400 group-hover:text-brand-primary transition-transform duration-200 ${
                      categoriesOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="space-y-0.5 pt-0.5 animate-in fade-in duration-150">
                    {/* All Products Row */}
                    <label className="flex items-center justify-between py-0.5 px-1 rounded-md hover:bg-brand-surface-warm/40 text-xs text-brand-heading font-medium hover:text-brand-primary cursor-pointer transition select-none">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allProductsSelected}
                          onChange={() => handleSelectCategory("All")}
                          className="h-3.5 w-3.5 rounded accent-[var(--brand-primary)] cursor-pointer"
                        />
                        <span className={allProductsSelected ? "font-bold text-brand-primary" : ""}>
                          All Products
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-slate font-normal tabular-nums">
                        ({allProducts.length})
                      </span>
                    </label>

                    {categoryOptions.map((category) => {
                      const isChecked = selectedCategories.includes(category.name);
                      const count = getCategoryCount(category.name);
                      const subs = subcategoryOptions.filter((s) => s.parentId === category.id);
                      const hasSubs = subs.length > 0;
                      const isOpen = expandedCategorySlug === category.slug;

                      return (
                        <div key={category.slug} className="space-y-0.5">
                          <div className="flex items-center justify-between py-0.5 px-1 rounded-md hover:bg-brand-surface-warm/40 transition group">
                            <label className="flex items-center gap-2 text-xs text-brand-heading font-medium hover:text-brand-primary cursor-pointer select-none flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategory(category.name)}
                                className="h-3.5 w-3.5 rounded accent-[var(--brand-primary)] cursor-pointer"
                              />
                              <span className={`truncate ${isChecked ? "font-bold text-brand-primary" : ""}`}>
                                {category.name}
                              </span>
                            </label>

                            <div className="flex items-center gap-1 shrink-0 ml-1.5">
                              <span className="text-[11px] text-brand-slate font-normal tabular-nums">
                                ({count})
                              </span>
                              {hasSubs && (
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryDropdown(category.slug)}
                                  aria-label={`Toggle ${category.name} subcategories`}
                                  className="h-5 w-5 flex items-center justify-center text-stone-400 hover:text-brand-primary transition-colors cursor-pointer rounded"
                                >
                                  <ChevronDown
                                    size={12}
                                    className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-primary" : ""}`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Subcategories (Expanded Dropdown) */}
                          {hasSubs && isOpen && (
                            <div className="ml-4 pl-2 border-l border-brand-border/70 space-y-0.5 py-0.5">
                              {subs.map((subcategory) => {
                                const subcategoryChecked = selectedSubcategoryKeys.includes(subcategory.id);
                                const subcategoryCount = getSubcategoryCount(subcategory.name, category.name);
                                return (
                                  <label
                                    key={subcategory.id}
                                    className="flex items-center justify-between text-xs text-brand-slate hover:text-brand-primary cursor-pointer select-none py-0.5 px-1 rounded hover:bg-brand-surface-warm/40 transition"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={subcategoryChecked}
                                        onChange={() => toggleSubcategory(subcategory.id)}
                                        className="h-3 w-3 rounded accent-[var(--brand-primary)] cursor-pointer"
                                      />
                                      <span className={`truncate ${subcategoryChecked ? "font-bold text-brand-primary" : "font-normal"}`}>
                                        {subcategory.name}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-brand-slate font-normal tabular-nums ml-1.5">
                                      ({subcategoryCount})
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Price range Section (Independent Collapsible Dropdown) */}
              <div className="border-t border-brand-border/60 pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => setPriceOpen((prev) => !prev)}
                  aria-expanded={priceOpen}
                  className="w-full flex items-center justify-between py-0.5 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans text-xs sm:text-[13px] font-bold text-brand-heading group-hover:text-brand-primary transition-colors">
                      Price range
                    </h4>
                    {(pricePreset !== "all" || maxPriceSlider !== null) && (
                      <span className="text-[10px] font-bold bg-brand-primary text-white rounded px-1.5 py-0.2 leading-none">
                        ₹0-₹{maxPriceSlider ?? priceCeiling}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-stone-400 group-hover:text-brand-primary transition-transform duration-200 ${
                      priceOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  />
                </button>

                {priceOpen && (
                  <div className="space-y-2 pt-0.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-primary leading-none">
                      <span>₹0</span>
                      <span>₹{maxPriceSlider ?? priceCeiling}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={priceCeiling}
                      step="10"
                      value={maxPriceSlider ?? priceCeiling}
                      onChange={(e) => {
                        setMaxPriceSlider(Number(e.target.value));
                        setPricePreset("all");
                        setCurrentPage(1);
                      }}
                      className="w-full h-1.5 accent-[var(--brand-primary)] cursor-pointer"
                    />

                    {/* Price Range Buttons - 2x2 Grid with Increased Width & Lightly Reduced Height */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      {[
                        { id: "all", label: "All" },
                        { id: "0-100", label: "₹0 - ₹100" },
                        { id: "100-300", label: "₹100 - ₹300" },
                        { id: "300+", label: "₹300+" },
                      ].map((p) => {
                        const isSelected = pricePreset === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPricePreset(p.id as any);
                              setMaxPriceSlider(null);
                              setCurrentPage(1);
                            }}
                            className={`h-8 rounded-[10px] px-2 text-xs font-semibold transition-all duration-200 tabular-nums flex items-center justify-center cursor-pointer select-none ${
                              isSelected
                                ? "bg-brand-primary text-white border border-[#C89B3C]/50 shadow-xs"
                                : "bg-white text-brand-heading hover:bg-[#F5EFE3]/50 border border-brand-border hover:border-brand-primary/50 shadow-2xs"
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. In store status / Availability Section (Independent Collapsible Dropdown) */}
              <div className="border-t border-brand-border/60 pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => setAvailabilityOpen((prev) => !prev)}
                  aria-expanded={availabilityOpen}
                  className="w-full flex items-center justify-between py-0.5 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans text-xs sm:text-[13px] font-bold text-brand-heading group-hover:text-brand-primary transition-colors">
                      In store status
                    </h4>
                    {(!availability.inStock || availability.outOfStock) && (
                      <span className="text-[10px] font-bold bg-brand-primary text-white rounded px-1.5 py-0.2 leading-none">
                        Filtered
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-stone-400 group-hover:text-brand-primary transition-transform duration-200 ${
                      availabilityOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  />
                </button>

                {availabilityOpen && (
                  <div className="space-y-0.5 pt-0.5 animate-in fade-in duration-150">
                    <label className="flex items-center justify-between py-0.5 px-1 rounded-md hover:bg-brand-surface-warm/40 text-xs text-brand-heading cursor-pointer select-none transition">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={availability.inStock}
                          onChange={(e) => {
                            setAvailability((prev) => ({ ...prev, inStock: e.target.checked }));
                            setCurrentPage(1);
                          }}
                          className="h-3.5 w-3.5 rounded accent-[var(--brand-primary)] cursor-pointer"
                        />
                        <span className={availability.inStock ? "font-semibold text-brand-heading" : "text-brand-slate"}>
                          In stock
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-slate tabular-nums">({inStockCount})</span>
                    </label>

                    <label className="flex items-center justify-between py-0.5 px-1 rounded-md hover:bg-brand-surface-warm/40 text-xs text-brand-heading cursor-pointer select-none transition">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={availability.outOfStock}
                          onChange={(e) => {
                            setAvailability((prev) => ({ ...prev, outOfStock: e.target.checked }));
                            setCurrentPage(1);
                          }}
                          className="h-3.5 w-3.5 rounded accent-[var(--brand-primary)] cursor-pointer"
                        />
                        <span className={availability.outOfStock ? "font-semibold text-brand-heading" : "text-brand-slate"}>
                          Out of stock
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-slate tabular-nums">({outOfStockCount})</span>
                    </label>
                  </div>
                )}
              </div>

            </aside>

            {/* MAIN PRODUCT AREA */}
            <div ref={productsTopRef} className="flex-1 min-w-0 space-y-5">

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
                      {allProducts.some((p) => hasProductRating(p)) && (
                        <option value="rating">Customer Rating</option>
                      )}
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
                      onClick={() => {
                        setViewMode("grid");
                        setHasChosenViewMode(true);
                      }}
                      aria-label="Grid view"
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition ${viewMode === "grid"
                          ? "bg-brand-primary text-white shadow-2xs"
                          : "text-stone-500 hover:text-brand-ink"
                        }`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("list");
                        setHasChosenViewMode(true);
                      }}
                      aria-label="List view"
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-md transition ${viewMode === "list"
                          ? "bg-brand-primary text-white shadow-2xs"
                          : "text-stone-500 hover:text-brand-ink"
                        }`}
                    >
                      <List size={16} />
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
                  {paginatedProducts.map((product) => {
                    const badge = getProductBadge(product);
                    const isWishlisted = isInWishlist(product.slug);

                    return (
                      <div
                        key={product.slug || product.id}
                        className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-border sm:min-h-[320px]"
                      >
                        {/* Top Image Box: Balanced Square Aspect Ratio Frame - Clean Full-Bleed with Rounded Corners */}
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl border-b border-brand-border/70 bg-brand-surface-warm/30">
                          <Link
                            href={`/product/${product.slug}`}
                            className="relative block h-full w-full overflow-hidden"
                          >
                            {product.image ? (
                              <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE3] to-[#FFFDF8] p-4 text-center select-none">
                                <SacredDiyaSvg className="h-10 w-10 text-brand-primary/80 transition transform group-hover:scale-110" />
                                <span className="font-sans text-xs font-bold text-brand-primary mt-2 tracking-wider">HM PURITY</span>
                                <span className="font-sans text-[11px] text-brand-slate mt-0.5">{product.subCategory || product.category || "Devotional Essentials"}</span>
                              </div>
                            )}
                          </Link>

                          {/* Floating Top Badge */}
                          {badge && (
                            <div className="absolute left-2.5 top-2.5 z-10 max-w-[calc(100%-3.5rem)] pointer-events-none">
                              <span
                                className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full px-2.5 py-1 text-[10px] sm:text-xs leading-tight font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md text-brand-primary border border-brand-border/80 shadow-xs"
                              >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                                <span className="truncate">{badge.text}</span>
                              </span>
                            </div>
                          )}

                          {/* Floating Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.slug);
                            }}
                            aria-label="Wishlist"
                            className={`absolute right-2.5 top-2.5 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-brand-border/80 flex items-center justify-center shadow-xs transition-all duration-200 active:scale-90 cursor-pointer ${
                              isWishlisted
                                ? "bg-brand-primary text-white border-brand-primary scale-105"
                                : "bg-white/95 backdrop-blur-md text-brand-heading hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-105"
                            }`}
                          >
                            <Heart
                              size={14}
                              className={
                                isWishlisted
                                  ? "fill-current text-white"
                                  : "text-brand-heading"
                              }
                            />
                          </button>
                        </div>

                        {/* Content Box */}
                        <div className="p-3.5 sm:p-4 flex flex-1 flex-col justify-between">
                          <div>
                            {/* Rating & Review Count (Backend data only) */}
                            {hasProductRating(product) && <div className="mb-1.5 flex items-center gap-1.5 text-xs">
                              <Star size={13} className="fill-brand-accent text-brand-accent" />
                              <span className="font-bold text-xs text-brand-heading">{product.rating.toFixed(1)}</span>
                              <span className="text-brand-slate text-xs font-medium">({product.reviewCount})</span>
                            </div>}

                            {/* Product Title - Manrope 16px Semibold */}
                            <Link href={`/product/${product.slug}`} aria-label={`View ${product.name} details`}>
                              <h4 title={product.name} className="line-clamp-1 min-h-5 font-sans text-[15px] sm:text-[16px] font-semibold text-brand-heading group-hover:text-brand-primary transition-colors leading-snug">
                                {product.name}
                              </h4>
                            </Link>

                            {/* Subtitle / Note */}
                            {(product.subCategory || product.note) && <p title={product.subCategory || product.note} className="mt-1 min-h-10 line-clamp-2 text-xs font-normal leading-relaxed text-brand-slate sm:min-h-[40px]">{product.subCategory || product.note}</p>}
                            {Boolean(product.bundleQuantity && product.bundleQuantity > 1) && (
                              <p className="mt-1 text-[11px] font-semibold text-brand-primary">
                                {product.bundleQuantity}-Box Bundle · ₹{Math.round(product.price / (product.bundleQuantity || 1))}/box
                              </p>
                            )}
                          </div>

                          {/* Price & Add Button */}
                          <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-brand-border/60">
                            <div className="flex items-baseline gap-1">
                              <span className="font-sans font-bold text-[17px] sm:text-[18px] text-brand-primary">
                                ₹{product.price}
                              </span>
                              {product.mrp && product.mrp !== `₹${product.price}` && (
                                <span className="text-xs text-brand-slate line-through font-medium">
                                  {product.mrp}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => addToCartAndReview(product)}
                              disabled={!product.inStock}
                              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary hover:bg-brand-hover border border-brand-accent/40 text-white px-3 sm:px-4 py-2 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                  {paginatedProducts.map((product) => {
                    const badge = getProductBadge(product);
                    const isWishlisted = isInWishlist(product.slug);

                    return (
                      <div
                        key={product.slug || product.id}
                        className="group flex items-stretch gap-3 rounded-2xl border border-brand-border/70 bg-white p-3 shadow-2xs transition hover:shadow-md sm:gap-4 sm:p-4"
                      >
                        {/* Image */}
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-brand-surface-warm/30 border border-brand-border/70 overflow-hidden flex items-center justify-center">
                          <Link
                            href={`/product/${product.slug}`}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {product.image ? (
                              <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE3] to-[#FFFDF8] p-2 text-center select-none">
                                <SacredDiyaSvg className="h-7 w-7 text-brand-primary/80" />
                                <span className="font-sans text-[9px] font-bold text-brand-primary mt-1">HM PURITY</span>
                              </div>
                            )}
                          </Link>
                          {badge && (
                            <span
                              className="absolute left-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full px-2 py-0.5 text-[9px] leading-tight font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md text-brand-primary border border-brand-border/80 shadow-xs"
                            >
                              {badge.text}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 text-left">
                          <div className="min-w-0">
                          {hasProductRating(product) && <div className="mb-0.5 flex items-center gap-1.5 text-xs">
                            <Star size={13} className="fill-brand-accent text-brand-accent" />
                            <span className="font-bold text-xs text-brand-heading">{product.rating.toFixed(1)}</span>
                            <span className="text-brand-slate text-xs font-medium">({product.reviewCount})</span>
                          </div>}
                          <Link href={`/product/${product.slug}`}>
                            <h4 className="line-clamp-1 font-sans text-sm sm:text-base font-semibold text-brand-heading hover:text-brand-primary transition-colors">
                              {product.name}
                            </h4>
                          </Link>
                          <p className="mt-0.5 line-clamp-2 text-xs text-brand-slate font-medium leading-snug">
                            {product.note || product.subCategory}
                          </p>
                          {Boolean(product.bundleQuantity && product.bundleQuantity > 1) && (
                            <p className="mt-0.5 text-[11px] font-semibold text-brand-primary">
                              {product.bundleQuantity}-Box Bundle · ₹{Math.round(product.price / (product.bundleQuantity || 1))}/box
                            </p>
                          )}
                          </div>

                        {/* Price & Action */}
                          <div className="flex items-center justify-between gap-2 border-t border-brand-border/60 pt-2 mt-auto">
                          <div className="flex min-w-0 items-baseline gap-1">
                            <div className="font-sans font-bold text-sm sm:text-base text-brand-primary">
                              ₹{product.price}
                            </div>
                            {product.mrp && product.mrp !== `₹${product.price}` && (
                              <div className="truncate text-[10px] sm:text-xs text-brand-slate line-through font-medium">
                                {product.mrp}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.slug)}
                              aria-label="Wishlist"
                              className={`h-9 w-9 rounded-full border border-brand-border/80 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 ${
                                isWishlisted
                                  ? "bg-brand-primary text-white border-brand-primary"
                                  : "bg-white text-brand-heading hover:bg-brand-primary hover:text-white hover:border-brand-primary"
                              }`}
                            >
                              <Heart
                                size={15}
                                className={
                                  isWishlisted
                                    ? "fill-current text-white"
                                    : "text-brand-heading"
                                }
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => addToCartAndReview(product)}
                              disabled={!product.inStock}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary hover:bg-brand-hover border border-brand-accent/40 text-white px-3.5 sm:px-4 text-xs sm:text-sm font-semibold shadow-2xs transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag size={14} />
                              <span className="sm:hidden">{product.inStock ? "Add" : "Sold"}</span>
                              <span className="hidden sm:inline">{product.inStock ? "Add to Cart" : "Sold Out"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ─── 5. NUMBERED PAGINATION (1, 2, 3...) ─── */}
              {totalPages > 1 && (
                <nav aria-label="Product pagination" className="pt-8 pb-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-border/70">
                  <p className="font-sans text-xs text-brand-slate font-medium">
                    Showing <span className="font-bold text-brand-heading">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</span>–<span className="font-bold text-brand-heading">{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-bold text-brand-heading">{filteredProducts.length}</span> products
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage((p) => p - 1);
                          productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-[10px] border border-brand-border bg-white px-3 text-xs font-semibold text-brand-heading shadow-2xs hover:border-brand-primary hover:text-brand-primary disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                    >
                      <ChevronLeft size={14} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          aria-current={isActive ? "page" : undefined}
                          className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[10px] font-sans text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                            isActive
                              ? "bg-brand-primary text-white border border-brand-accent/40 shadow-xs"
                              : "bg-white text-brand-heading border border-brand-border hover:border-brand-primary hover:text-brand-primary hover:bg-brand-surface-warm/40"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage((p) => p + 1);
                          productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-[10px] border border-brand-border bg-white px-3 text-xs font-semibold text-brand-heading shadow-2xs hover:border-brand-primary hover:text-brand-primary disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>

          {/* ─── 6. MOBILE FILTER MODAL DRAWER (Freshlyo-style) ─── */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-5 shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between border-b border-brand-border/70 pb-3">
                  <h3 className="font-sans font-bold text-base text-brand-heading">Browse categories</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Close filters"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-brand-heading cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 py-3 flex-1 overflow-y-auto">
                  {/* 1. Categories Dropdown */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setCategoriesOpen((prev) => !prev)}
                      aria-expanded={categoriesOpen}
                      className="w-full flex items-center justify-between py-1 text-left cursor-pointer group select-none"
                    >
                      <h4 className="font-sans text-xs font-bold text-brand-heading group-hover:text-brand-primary">
                        Browse categories
                      </h4>
                      <ChevronDown
                        size={15}
                        className={`text-stone-400 transition-transform duration-200 ${categoriesOpen ? "rotate-180 text-brand-primary" : ""}`}
                      />
                    </button>

                    {categoriesOpen && (
                      <div className="space-y-1 pt-1 pl-1 animate-in fade-in duration-150">
                        <label className="flex items-center justify-between text-xs text-brand-heading font-medium cursor-pointer py-1.5 px-1 rounded hover:bg-brand-surface-warm/40">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={allProductsSelected}
                              onChange={() => handleSelectCategory("All")}
                              className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                            />
                            <span className={allProductsSelected ? "font-bold text-brand-primary" : ""}>
                              All Products
                            </span>
                          </div>
                          <span className="text-stone-400 text-[11px] tabular-nums">({allProducts.length})</span>
                        </label>

                        {categoryOptions.map((category) => {
                          const isChecked = selectedCategories.includes(category.name);
                          const count = getCategoryCount(category.name);
                          const subs = subcategoryOptions.filter((s) => s.parentId === category.id);
                          const hasSubs = subs.length > 0;
                          const isOpen = expandedCategorySlug === category.slug;

                          return (
                            <div key={category.slug} className="space-y-0.5">
                              <div className="flex items-center justify-between py-1 px-1 rounded hover:bg-brand-surface-warm/40">
                                <label className="flex items-center gap-2 text-xs text-brand-heading font-medium cursor-pointer flex-1 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleCategory(category.name)}
                                    className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                                  />
                                  <span className={`truncate ${isChecked ? "font-bold text-brand-primary" : ""}`}>{category.name}</span>
                                </label>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  <span className="text-stone-400 text-[11px] tabular-nums">({count})</span>
                                  {hasSubs && (
                                    <button
                                      type="button"
                                      onClick={() => toggleCategoryDropdown(category.slug)}
                                      className="h-6 w-6 flex items-center justify-center text-stone-400 hover:text-brand-primary cursor-pointer"
                                      aria-label={`Toggle ${category.name} subcategories`}
                                    >
                                      <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-primary" : ""}`} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              {hasSubs && isOpen && (
                                <div className="ml-5 pl-2.5 border-l-2 border-brand-border/70 space-y-1 py-1">
                                  {subs.map((subcategory) => {
                                    const subcategoryChecked = selectedSubcategoryKeys.includes(subcategory.id);
                                    const subcategoryCount = getSubcategoryCount(subcategory.name, category.name);
                                    return (
                                      <label key={subcategory.id} className="flex items-center justify-between text-xs text-brand-slate cursor-pointer py-1 px-1 rounded hover:bg-brand-surface-warm/40">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <input
                                            type="checkbox"
                                            checked={subcategoryChecked}
                                            onChange={() => toggleSubcategory(subcategory.id)}
                                            className="h-3.5 w-3.5 rounded accent-[var(--brand-primary)]"
                                          />
                                          <span className={`truncate ${subcategoryChecked ? "font-bold text-brand-primary" : ""}`}>{subcategory.name}</span>
                                        </div>
                                        <span className="text-stone-400 text-[10px] tabular-nums ml-2">({subcategoryCount})</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. Price Range Dropdown */}
                  <div className="border-t border-brand-border/60 pt-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setPriceOpen((prev) => !prev)}
                      aria-expanded={priceOpen}
                      className="w-full flex items-center justify-between py-1 text-left cursor-pointer group select-none"
                    >
                      <h4 className="font-sans text-xs font-bold text-brand-heading group-hover:text-brand-primary">Price range</h4>
                      <ChevronDown
                        size={15}
                        className={`text-stone-400 transition-transform duration-200 ${priceOpen ? "rotate-180 text-brand-primary" : ""}`}
                      />
                    </button>
                    {priceOpen && (
                      <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-primary">
                          <span>₹0</span>
                          <span>₹{maxPriceSlider ?? priceCeiling}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={priceCeiling}
                          step="10"
                          value={maxPriceSlider ?? priceCeiling}
                          onChange={(e) => {
                            setMaxPriceSlider(Number(e.target.value));
                            setPricePreset("all");
                            setCurrentPage(1);
                          }}
                          className="w-full accent-[var(--brand-primary)] cursor-pointer"
                        />
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {[
                            { id: "all", label: "All" },
                            { id: "0-100", label: "₹0 - ₹100" },
                            { id: "100-300", label: "₹100 - ₹300" },
                            { id: "300+", label: "₹300+" },
                          ].map((p) => {
                            const isSelected = pricePreset === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setPricePreset(p.id as any);
                                  setMaxPriceSlider(null);
                                  setCurrentPage(1);
                                }}
                                className={`h-8 rounded-[10px] px-2 text-xs font-semibold transition-all duration-200 tabular-nums flex items-center justify-center cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-brand-primary text-white border border-[#C89B3C]/50 shadow-xs"
                                    : "bg-white text-brand-heading hover:bg-[#F5EFE3]/50 border border-brand-border shadow-2xs"
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Availability Dropdown */}
                  <div className="border-t border-brand-border/60 pt-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setAvailabilityOpen((prev) => !prev)}
                      aria-expanded={availabilityOpen}
                      className="w-full flex items-center justify-between py-1 text-left cursor-pointer group select-none"
                    >
                      <h4 className="font-sans text-xs font-bold text-brand-heading group-hover:text-brand-primary">In store status</h4>
                      <ChevronDown
                        size={15}
                        className={`text-stone-400 transition-transform duration-200 ${availabilityOpen ? "rotate-180 text-brand-primary" : ""}`}
                      />
                    </button>
                    {availabilityOpen && (
                      <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                        <label className="flex items-center justify-between py-1.5 px-1 rounded text-xs text-brand-heading cursor-pointer select-none hover:bg-brand-surface-warm/40">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={availability.inStock}
                              onChange={(e) => {
                                setAvailability((prev) => ({ ...prev, inStock: e.target.checked }));
                                setCurrentPage(1);
                              }}
                              className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                            />
                            <span>In stock</span>
                          </div>
                          <span className="text-stone-400 text-[11px] tabular-nums">({inStockCount})</span>
                        </label>
                        <label className="flex items-center justify-between py-1.5 px-1 rounded text-xs text-brand-heading cursor-pointer select-none hover:bg-brand-surface-warm/40">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={availability.outOfStock}
                              onChange={(e) => {
                                setAvailability((prev) => ({ ...prev, outOfStock: e.target.checked }));
                                setCurrentPage(1);
                              }}
                              className="h-4 w-4 rounded accent-[var(--brand-primary)]"
                            />
                            <span>Out of stock</span>
                          </div>
                          <span className="text-stone-400 text-[11px] tabular-nums">({outOfStockCount})</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-brand-border/70 space-y-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full rounded-[10px] bg-brand-primary py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer hover:bg-brand-hover transition-colors"
                  >
                    Apply Filters ({filteredProducts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleClearAllFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-center text-xs font-semibold text-brand-slate hover:text-brand-primary py-1 cursor-pointer"
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

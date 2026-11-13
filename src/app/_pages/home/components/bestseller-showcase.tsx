"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Star,
  Leaf,
  ShieldCheck,
  Tag,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/components/store";
import { hasProductRating, type Product } from "@/lib/products";
import {
  AromaFlameSvg,
  EditorialStarSvg,
  KalashCrownSvg,
  SacredBotanicalSvg,
  SacredDiyaSvg,
  SacredLotusSvg,
} from "@/components/sacred-icons";

const FILTER_TABS = [
  { id: "all", label: "All Products" },
  { id: "agarbatti", label: "Agarbatti" },
  { id: "camphor", label: "Camphor" },
  { id: "dhoop", label: "Dhoop Stick" },
  { id: "cone", label: "Incense Cones" },
  { id: "havan", label: "Havan Cups" },
  { id: "sambrani", label: "Sambrani Powder" },
  { id: "pooja", label: "Pooja Essentials" },
  { id: "gift", label: "Gift Sets" },
  { id: "family", label: "Family Pack" },
];

const TAB_CATEGORY_KEYWORDS: Record<string, string[]> = {
  agarbatti: ["agarbatti"],
  camphor: ["camphor"],
  dhoop: ["dhoop"],
  cone: ["incense cone", "cone"],
  havan: ["havan cup", "chandan cup"],
  sambrani: ["sambrani powder", "sambhrani powder"],
  pooja: ["pooja essential"],
  gift: ["gift set"],
  family: ["family pack"],
};

function productMatchesTab(product: any, tabId: string): boolean {
  if (tabId === "all") return true;
  const keywords = TAB_CATEGORY_KEYWORDS[tabId] || [tabId.toLowerCase()];
  const labels = [product.category, ...(Array.isArray(product.categoryLabels) ? product.categoryLabels : [])]
    .filter(Boolean)
    .map((label: string) => label.toLowerCase());

  return labels.some((label) => keywords.some((kw) => label.includes(kw)));
}

function TabIcon({ id, className = "h-3.5 w-3.5" }: { id: string; className?: string }) {
  switch (id) {
    case "all":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "agarbatti":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="6" y1="20" x2="16" y2="4" />
          <line x1="10" y1="20" x2="19" y2="6" />
        </svg>
      );
    case "camphor":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
      );
    case "dhoop":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3v18M8 8c2-2 6-2 8 0M8 14c2-2 6-2 8 0" />
        </svg>
      );
    case "cone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3L5 20h14L12 3z" />
        </svg>
      );
    case "havan":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 9h12l-2 9H8L6 9z" />
          <path d="M10 5l2-2 2 2" />
        </svg>
      );
    case "sambrani":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 13h14l-1.5 6h-11L5 13z" />
          <path d="M8 13l4-4 4 4" />
        </svg>
      );
    case "pooja":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2c-.5 2-2 3-2 5a2 2 0 1 0 4 0c0-2-1.5-3-2-5z" />
          <path d="M6 13h12l-1 5H7l-1-5z" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13M19 12H3" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
      );
    default:
      return <Leaf className={className} />;
  }
}

// Only render badges if present in backend data (no hardcoded fallback)
function getBadgeInfo(product: Product) {
  if (!product.badge) return null;

  const b = product.badge.toLowerCase();
  if (b.includes("bestseller") || b.includes("best")) {
    return {
      text: product.badge,
      icon: <KalashCrownSvg className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />,
      className: "bg-brand-surface-promo text-brand-amber-bright border-brand-yellow-bright",
    };
  }
  if (b.includes("new")) {
    return {
      text: product.badge,
      icon: <SacredBotanicalSvg className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />,
      className: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
    };
  }
  if (b.includes("trend")) {
    return {
      text: product.badge,
      icon: <AromaFlameSvg className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />,
      className: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    };
  }
  if (b.includes("coupon") || b.includes("off")) {
    return {
      text: product.badge,
      icon: <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-primary shrink-0" />,
      className: "bg-brand-surface-warm text-brand-primary border-brand-accent",
    };
  }
  return {
    text: product.badge,
    icon: <EditorialStarSvg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-primary" />,
    className: "bg-brand-surface-promo text-brand-primary border-brand-border",
  };
}

export function BestsellerShowcase() {
  const router = useRouter();
  const { dbProducts, add, toggleWishlist, isInWishlist, isInitialDataLoading } = useStore();
  const [activeTab, setActiveTab] = useState("all");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(1);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  const visibleTabs = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return FILTER_TABS;
    return FILTER_TABS.filter((tab) => tab.id === "all" || dbProducts.some((product) => productMatchesTab(product, tab.id)));
  }, [dbProducts]);

  // Filter products by selected tab
  const filteredProducts = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return [];
    return dbProducts.filter((product) => productMatchesTab(product, activeTab));
  }, [dbProducts, activeTab]);

  const displayedProducts = filteredProducts.slice(0, 8);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updatePosition = () => {
      const pages = Math.max(1, Math.ceil(slider.scrollWidth / slider.clientWidth));
      const page = Math.min(pages - 1, Math.round(slider.scrollLeft / slider.clientWidth));
      setSlideCount(pages);
      setActiveSlide(page);
    };

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(slider);
    return () => observer.disconnect();
  }, [displayedProducts.length]);

  useEffect(() => {
    if (autoplayPaused || slideCount < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;
      const lastPosition = slider.scrollWidth - slider.clientWidth;
      const nextPosition = slider.scrollLeft + slider.clientWidth >= lastPosition - 8
        ? 0
        : slider.scrollLeft + slider.clientWidth;
      slider.scrollTo({ left: nextPosition, behavior: "smooth" });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [autoplayPaused, slideCount, displayedProducts.length]);

  const goToSlide = (slide: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollTo({ left: Math.min(slide * slider.clientWidth, slider.scrollWidth - slider.clientWidth), behavior: "smooth" });
    setActiveSlide(slide);
  };

  if (!dbProducts || dbProducts.length === 0) {
    if (!isInitialDataLoading) return null;
    return (
      <section aria-label="Loading popular products" aria-busy="true" className="w-full bg-brand-surface-alt py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-brand-border/50" />
            <div className="h-7 w-3/4 max-w-lg animate-pulse rounded bg-brand-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-brand-border/70 bg-white p-2.5">
                <div className="aspect-square animate-pulse rounded-xl bg-brand-border/40" />
                <div className="space-y-2 p-2 pt-3">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-brand-border/40" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-brand-border/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-brand-surface-alt py-6 sm:py-14 font-sans">
        <div
          className="page-container relative z-10"
          onMouseEnter={() => setAutoplayPaused(true)}
          onMouseLeave={() => setAutoplayPaused(false)}
          onFocusCapture={() => setAutoplayPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAutoplayPaused(false);
          }}
          onTouchStart={() => setAutoplayPaused(true)}
          onTouchEnd={() => setAutoplayPaused(false)}
        >
        
        {/* ========================================================================= */}
        {/* 1. HEADER AREA WITH TITLE & TOP-RIGHT VIEW ALL BUTTON                     */}
        {/* ========================================================================= */}
        <div className="flex flex-row items-start sm:items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-8">
          
          {/* Left: Eyebrow, Heading & Narrative */}
          <div className="min-w-0 flex-1 max-w-xl">
            <span className="font-brand text-[10px] sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1">
              OUR BEST SELLERS
            </span>
            <h2 className="font-brand text-lg sm:text-2xl lg:text-3xl font-bold text-brand-heading tracking-wide leading-tight uppercase">
              Popular Picks for a <span className="text-brand-primary">Peaceful Home</span>
            </h2>
            <p className="mt-1 sm:mt-2 font-sans text-xs sm:text-sm text-brand-slate leading-snug sm:leading-relaxed font-normal">
              Pure agarbattis, camphor &amp; daily pooja essentials.
            </p>
          </div>

          {/* Right: 4 Mini Trust Icons (xl+) & View All Corner Button */}
          <div className="flex shrink-0 items-center gap-5 lg:gap-6">
            
            {/* 4 Mini Trust Pills */}
            <div className="hidden xl:grid grid-cols-4 gap-3.5">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center mb-1">
                  <Leaf size={18} />
                </div>
                <span className="text-xs font-bold text-brand-heading block">100% Natural</span>
                <span className="text-xs text-brand-gray block font-medium -mt-0.5">Pure Botanicals</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-1">
                  <SacredLotusSvg className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-brand-heading block">Traditional</span>
                <span className="text-xs text-brand-gray block font-medium -mt-0.5">Vedic Formula</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-amber/15 text-brand-amber flex items-center justify-center mb-1">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-bold text-brand-heading block">Family Safe</span>
                <span className="text-xs text-brand-gray block font-medium -mt-0.5">Non-Toxic</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-green-deep/15 text-brand-green-deep flex items-center justify-center mb-1">
                  <Truck size={18} />
                </div>
                <span className="text-xs font-bold text-brand-heading block">Fast Dispatch</span>
                <span className="text-xs text-brand-gray block font-medium -mt-0.5">Direct Delivery</span>
              </div>
            </div>

            {/* Right Corner View All Button (Auto-slide handles carousel) */}
            <Link
              href="/shop"
              className="inline-flex min-h-8 sm:min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary hover:bg-brand-hover border border-brand-accent/40 px-3.5 py-1.5 sm:px-5 sm:py-2 font-sans text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              <span className="sm:hidden">View All</span>
              <span className="hidden sm:inline">View All Products</span>
              <ArrowRight size={13} />
            </Link>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY FILTER TABS ROW                                              */}
        {/* ========================================================================= */}
        <div className="mb-3.5 w-full sm:mb-7">
          <div
            role="group"
            aria-label="Product categories. Swipe horizontally to see all categories."
            className="scrollbar-none flex w-full snap-x snap-mandatory items-center gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-0.5 sm:gap-2 sm:px-1 sm:py-1"
          >
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex h-8 shrink-0 snap-start items-center justify-center gap-1.5 rounded-[10px] px-2.5 sm:h-10 sm:gap-2 sm:px-4 font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-tight transition-all duration-200 shadow-2xs cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-brand-primary text-white border border-brand-accent/40 shadow-sm"
                      : "bg-white text-brand-heading border border-brand-border hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  <TabIcon id={tab.id} className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT SHOWCASE (BORDER CUTTING DESIGN WITH FULL WIDTH IMAGES)        */}
        {/* ========================================================================= */}
        <div className="relative w-full">
          <div
            ref={sliderRef}
            role="region"
            aria-label="Bestselling products"
            onScroll={() => {
              const slider = sliderRef.current;
              if (slider) setActiveSlide(Math.min(slideCount - 1, Math.round(slider.scrollLeft / slider.clientWidth)));
            }}
            className="scrollbar-none flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth px-0.5 py-1.5 sm:gap-5 sm:py-3"
          >
            {displayedProducts.map((product) => {
              const productImg = product.image || product.images?.[0]?.url;
              const badge = getBadgeInfo(product);
              const wishlisted = isInWishlist(product.slug);

              return (
                <div
                  key={product.slug}
                  className="group flex min-w-0 w-[calc((100%_-_0.625rem)_/_2)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-border hover:shadow-md min-[640px]:w-[calc((100%_-_2.5rem)_/_3)] lg:w-[calc((100%_-_3.75rem)_/_4)]"
                >
                  {/* Top Image: Balanced Square Aspect Ratio Frame - Clean Full-Bleed with Rounded Corners */}
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl border-b border-brand-border/70 bg-brand-surface-warm/30">
                    <Link href={`/product/${product.slug}`} className="relative block h-full w-full overflow-hidden">
                      {productImg ? (
                        <img
                          src={productImg}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes("hm_glory_agarbatti")) {
                              target.src = "/images/products/hm_glory_agarbatti.jpg";
                            }
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE3] to-[#FFFDF8] p-4 text-center select-none">
                          <SacredDiyaSvg className="h-10 w-10 text-brand-primary/80 transition-transform duration-500 group-hover:scale-110" />
                          <span className="font-sans text-xs font-bold text-brand-primary mt-2 tracking-wider">HM PURITY</span>
                          <span className="font-sans text-[11px] text-brand-slate mt-0.5">{product.subCategory || product.category || "Devotional Essentials"}</span>
                        </div>
                      )}
                    </Link>

                    {/* Status Badge - Floating Top Left with Frosted Glass */}
                    {badge && (
                      <div className="absolute left-2.5 top-2.5 z-10 max-w-[calc(100%-3.5rem)] pointer-events-none">
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] leading-tight font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md text-brand-primary border border-brand-border/80 shadow-xs">
                          <span className="shrink-0">{badge.icon}</span>
                          <span className="truncate">{badge.text}</span>
                        </span>
                      </div>
                    )}

                    {/* Wishlist Heart Button - Floating Top Right with Frosted Glass */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.slug);
                      }}
                      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-brand-border/80 transition-all duration-200 active:scale-90 shadow-xs cursor-pointer ${
                        wishlisted
                          ? "bg-brand-primary text-white border-brand-primary scale-105"
                          : "bg-white/95 backdrop-blur-md text-brand-heading hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-105"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={wishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Bottom Content Area: Clear padding */}
                  <div className="p-2.5 sm:p-4 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Product Name - Manrope 16px Semibold */}
                      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name} details`}>
                        <h3 className="break-words font-sans text-[14px] sm:text-[16px] font-semibold text-brand-heading group-hover:text-brand-primary transition-colors leading-snug line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Subtitle / Series */}
                      <p className="font-sans text-[11px] sm:text-xs text-brand-slate font-normal leading-relaxed mt-0.5 sm:mt-1 line-clamp-1">
                        {product.subCategory || product.category || "Flora Series"}
                      </p>

                      {/* Rating (Backend data only) */}
                      {hasProductRating(product) && (
                        <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
                          <Star size={12} fill="var(--brand-accent)" className="text-brand-accent sm:h-[13px] sm:w-[13px]" />
                          <span className="text-xs sm:text-sm font-bold text-brand-heading">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-[11px] sm:text-xs text-brand-slate font-medium">
                            ({product.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Price & Add to Cart Row */}
                    <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-brand-border/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-sans text-[17px] sm:text-[18px] font-bold text-brand-primary block leading-none">
                            ₹{product.price}
                          </span>
                          {product.mrp && product.mrp !== `₹${product.price}` && (
                            <span className="font-sans text-[11px] sm:text-xs text-brand-slate line-through font-medium">
                              {product.mrp}
                            </span>
                          )}
                        </div>
                        <span className="font-sans text-[11px] sm:text-xs text-brand-slate font-medium block mt-0.5 sm:mt-1 truncate">
                          {product.bundleQuantity && product.bundleQuantity > 1
                            ? `${product.bundleQuantity}-Box Bundle (₹${Math.round(product.price / product.bundleQuantity)}/box)`
                            : `(${product.quantity || "Standard Pack"})`}
                        </span>
                      </div>

                      {/* Add to Cart Squircle Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!product.inStock) return;
                          add(product);
                          router.push("/cart");
                        }}
                        disabled={!product.inStock}
                        aria-label="Add to cart"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-primary hover:bg-brand-hover border border-brand-accent/40 text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {slideCount > 1 && (
            <nav aria-label="Bestseller slider pages" className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: slideCount }, (_, slide) => (
                <button
                  key={slide}
                  type="button"
                  onClick={() => goToSlide(slide)}
                  aria-label={`Show product group ${slide + 1}`}
                  aria-current={activeSlide === slide ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === slide ? "w-9 bg-brand-primary" : "w-2.5 bg-brand-border hover:bg-brand-primary/60"}`}
                />
              ))}
            </nav>
          )}

        </div>

      </div>

    </section>
  );
}

"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Leaf,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

const FILTER_TABS = [
  { id: "all", label: "All Products" },
  { id: "agarbatti", label: "Agarbatti" },
  { id: "camphor", label: "Camphor" },
  { id: "dhoop", label: "Dhoop Stick" },
  { id: "cone", label: "Incense Cones" },
  { id: "havan", label: "Havan Cups" },
  { id: "pooja", label: "Pooja Essentials" },
  { id: "gift", label: "Gift Sets" },
  { id: "family", label: "Family Pack" },
];

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
      icon: "👑",
      className: "bg-brand-surface-promo text-brand-amber-bright border-brand-yellow-bright",
    };
  }
  if (b.includes("new")) {
    return {
      text: product.badge,
      icon: "🍃",
      className: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
    };
  }
  if (b.includes("trend")) {
    return {
      text: product.badge,
      icon: "🔥",
      className: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    };
  }
  if (b.includes("coupon") || b.includes("off")) {
    return {
      text: product.badge,
      icon: "🏷️",
      className: "bg-brand-surface-warm text-brand-primary border-brand-accent",
    };
  }
  return {
    text: product.badge,
    icon: "✦",
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

  const moveSlider = (direction: "previous" | "next") => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const nextSlide = (activeSlide + (direction === "next" ? 1 : -1) + slideCount) % slideCount;
    slider.scrollTo({
      left: Math.min(nextSlide * slider.clientWidth, slider.scrollWidth - slider.clientWidth),
      behavior: "smooth",
    });
    setActiveSlide(nextSlide);
  };

  // Filter products by selected tab
  const filteredProducts = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return [];
    if (activeTab === "all") return dbProducts;

    return dbProducts.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pLabels = (p.categoryLabels || []).map((l) => l.toLowerCase());
      const pName = (p.name || "").toLowerCase();
      const target = activeTab.toLowerCase();

      return pCat.includes(target) || pLabels.some((l) => l.includes(target)) || pName.includes(target);
    });
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
      <section aria-label="Loading popular products" aria-busy="true" className="w-full border-y border-brand-accent/35 bg-brand-surface-alt py-8 sm:py-12">
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
    <section className="relative w-full overflow-hidden bg-brand-surface-alt py-12 sm:py-16 border-y border-brand-accent/35 font-sans">
      
      {/* Soft Ambient Corner Accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-brand-primary/10 blur-3xl" />

        <div
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] 2xl:max-w-[1560px]"
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
        {/* 1. HEADER AREA WITH TITLE, TRUST PILLARS & VIEW ALL BUTTON                */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          
          {/* Left: Eyebrow, Heading & Narrative */}
          <div className="max-w-xl">
            <span className="font-brand text-ui-11 sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1.5">
              OUR BEST SELLERS
            </span>
            <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold text-brand-heading tracking-wide leading-tight uppercase">
              Popular Picks for a <span className="text-brand-primary">Peaceful Home</span>
            </h2>
            <p className="mt-2 font-sans text-xs sm:text-sm text-brand-slate leading-relaxed font-normal">
              Handpicked agarbattis, camphor, pooja essentials and more to bring positivity and divine fragrance into your everyday life.
            </p>
          </div>

          {/* Right: 4 Mini Trust Icons & View All Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-6">
            
            {/* 4 Mini Trust Pills */}
            <div className="hidden sm:grid grid-cols-4 gap-3.5">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center mb-1">
                  <Leaf size={18} />
                </div>
                <span className="text-xs font-bold text-brand-heading block">100% Natural</span>
                <span className="text-xs text-brand-gray block font-medium -mt-0.5">Pure Botanicals</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-1">
                  <span className="text-base">🪷</span>
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

            {/* Action Buttons: View All + Carousel Nav Arrows (Clean Header Placement) */}
            <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end sm:gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-orange-deep px-4 py-2 font-brand text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-[#C85610] hover:scale-105 active:scale-95 whitespace-nowrap sm:min-h-11 sm:px-6 sm:py-3 sm:text-sm sm:tracking-wider"
              >
                <span>View All Products</span>
                <ArrowRight size={14} />
              </Link>
              <div className="flex shrink-0 items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => moveSlider("previous")}
                  aria-label="Previous products"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:bg-brand-primary hover:text-white sm:h-11 sm:w-11"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlider("next")}
                  aria-label="Next products"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:bg-brand-primary hover:text-white sm:h-11 sm:w-11"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY FILTER TABS ROW                                              */}
        {/* ========================================================================= */}
        <div className="mb-6 w-full sm:mb-8">
          <div
            role="group"
            aria-label="Product categories. Swipe horizontally to see all categories."
            className="scrollbar-none flex w-full snap-x snap-mandatory items-center gap-1.5 overflow-x-auto scroll-smooth px-1 py-1 sm:gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex h-9 shrink-0 snap-start items-center justify-center gap-1.5 rounded-full px-3 sm:h-10 sm:gap-2 sm:px-4 font-brand text-[10px] min-[420px]:text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight transition-colors duration-200 shadow-2xs cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-white text-brand-heading border border-brand-border hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  <TabIcon id={tab.id} className="h-3.5 w-3.5 shrink-0" />
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
            className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-0.5 py-3 sm:gap-5"
          >
            {displayedProducts.map((product) => {
              const productImg = product.image || product.images?.[0]?.url;
              const badge = getBadgeInfo(product);
              const wishlisted = isInWishlist(product.slug);

              return (
                <div
                  key={product.slug}
                  className="group flex min-w-0 w-[calc((100%_-_0.75rem)_/_2)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs transition-all duration-300 hover:border-brand-accent hover:shadow-lg min-[640px]:w-[calc((100%_-_2.5rem)_/_3)] lg:w-[calc((100%_-_3.75rem)_/_4)]"
                >
                  {/* Top Image: Full Width Edge-to-Edge with Bottom Dividing Border */}
                  <div className="relative h-[118px] min-[380px]:h-[140px] w-full shrink-0 overflow-hidden border-b border-brand-border/70 bg-brand-surface-alt sm:h-[176px] lg:h-[220px]">
                    <Link href={`/product/${product.slug}`} className="absolute inset-0 block">
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
                        <div className="flex h-full w-full flex-col items-center justify-center text-brand-ink/40 text-xs">
                          <span className="text-3xl">🪔</span>
                          <span className="font-brand text-xs font-bold text-brand-primary mt-1 tracking-wider">HM PURITY</span>
                        </div>
                      )}
                    </Link>

                    {/* Status Badge - Render ONLY if present from Backend */}
                    {badge && (
                      <div className="absolute left-2.5 top-2.5 z-10 pointer-events-none">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ui-10 sm:text-ui-11 font-bold uppercase tracking-wider border shadow-2xs backdrop-blur-xs ${badge.className}`}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </span>
                      </div>
                    )}

                    {/* Wishlist Heart Button - Top Right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.slug);
                      }}
                      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90 shadow-2xs backdrop-blur-xs cursor-pointer ${
                        wishlisted
                          ? "bg-brand-primary text-white"
                          : "bg-white/95 text-brand-ink hover:bg-brand-primary hover:text-white"
                      }`}
                    >
                      <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Bottom Content Area: Clear padding */}
                  <div className="p-3.5 sm:p-4 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Product Name */}
                      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name} details`}>
                        <h3 className="break-words font-brand text-sm sm:text-lg font-bold uppercase tracking-wider text-brand-heading group-hover:text-brand-primary transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Subtitle / Series */}
                      <p className="font-sans text-xs sm:text-ui-13 text-brand-slate font-medium leading-relaxed mt-1">
                        {product.subCategory || product.category || "Flora Series"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Star size={13} fill="var(--brand-orange)" className="text-brand-orange" />
                        <span className="text-xs sm:text-sm font-bold text-brand-heading">
                          {product.rating || 4.9}
                        </span>
                        <span className="text-xs text-brand-gray font-medium">
                          ({product.reviewCount || 48})
                        </span>
                      </div>
                    </div>

                    {/* Bottom Price & Add to Cart Row */}
                    <div className="mt-3 pt-2.5 border-t border-brand-surface-soft flex items-center justify-between gap-2">
                      <div>
                        <span className="font-brand text-xl sm:text-2xl font-extrabold text-brand-primary block leading-none">
                          ₹{product.price}
                        </span>
                        <span className="font-sans text-xs text-brand-gray font-medium block mt-1">
                          ({product.quantity || "50 sticks"})
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
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary hover:bg-brand-hover text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ShoppingCart size={16} />
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

      {/* Decorative Bottom-Left Incense & Flower Accent */}
      <div
        className="pointer-events-none absolute -left-6 -bottom-6 w-44 h-44 sm:w-60 sm:h-60 opacity-30 mix-blend-multiply select-none"
        style={{
          maskImage: "radial-gradient(circle at 35% 65%, black 50%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at 35% 65%, black 50%, transparent 95%)",
        }}
      >
        <Image
          src="/images/purity/natural-ingredients.jpg"
          alt=""
          fill
          sizes="250px"
          className="object-contain rotate-12"
        />
      </div>

    </section>
  );
}

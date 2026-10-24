"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
      className: "bg-[#FFF4E5] text-[#D97706] border-[#FCD34D]",
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
      className: "bg-[#FFF4D6] text-[#9E1830] border-[#F6C84C]",
    };
  }
  return {
    text: product.badge,
    icon: "✦",
    className: "bg-[#FFF4E5] text-[#9E1830] border-[#EADBBD]",
  };
}

export function BestsellerShowcase() {
  const { dbProducts, add, toggleWishlist, isInWishlist } = useStore();
  const [activeTab, setActiveTab] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

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

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth;
    const newScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  };


  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const index = Math.round((scrollLeft / maxScroll) * 4);
    setActiveDot(Math.min(4, Math.max(0, index)));
  };

  if (!dbProducts || dbProducts.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7EE] py-12 sm:py-16 border-y border-[#F6C84C]/35 font-sans">
      
      {/* Soft Ambient Corner Accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-[#9E1830]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. HEADER AREA WITH TITLE, TRUST PILLARS & VIEW ALL BUTTON                */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          
          {/* Left: Eyebrow, Heading & Narrative */}
          <div className="max-w-xl">
            <span className="font-brand text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#9E1830] uppercase block mb-1.5">
              OUR BEST SELLERS
            </span>
            <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] tracking-wide leading-tight uppercase">
              Popular Picks for a <span className="text-[#9E1830]">Peaceful Home</span>
            </h2>
            <p className="mt-2 font-sans text-xs sm:text-sm text-[#374151] leading-relaxed font-normal">
              Handpicked agarbattis, camphor, pooja essentials and more to bring positivity and divine fragrance into your everyday life.
            </p>
          </div>

          {/* Right: 4 Mini Trust Icons & View All Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-6">
            
            {/* 4 Mini Trust Pills */}
            <div className="hidden sm:grid grid-cols-4 gap-3.5">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-[#3F7D45]/15 text-[#3F7D45] flex items-center justify-center mb-1">
                  <Leaf size={18} />
                </div>
                <span className="text-xs font-bold text-[#111827] block">100% Natural</span>
                <span className="text-xs text-[#4B5563] block font-medium -mt-0.5">Pure Botanicals</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-[#9E1830]/15 text-[#9E1830] flex items-center justify-center mb-1">
                  <span className="text-base">🪷</span>
                </div>
                <span className="text-xs font-bold text-[#111827] block">Traditional</span>
                <span className="text-xs text-[#4B5563] block font-medium -mt-0.5">Vedic Formula</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-[#B45309]/15 text-[#B45309] flex items-center justify-center mb-1">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-bold text-[#111827] block">Family Safe</span>
                <span className="text-xs text-[#4B5563] block font-medium -mt-0.5">Non-Toxic</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-[#2F855A]/15 text-[#2F855A] flex items-center justify-center mb-1">
                  <Truck size={18} />
                </div>
                <span className="text-xs font-bold text-[#111827] block">Fast Dispatch</span>
                <span className="text-xs text-[#4B5563] block font-medium -mt-0.5">Direct Delivery</span>
              </div>
            </div>

            {/* Action Buttons: View All + Carousel Nav Arrows (Clean Header Placement) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/shop"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E56A20] hover:bg-[#C85610] text-white px-5 sm:px-6 py-2.5 sm:py-3 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span>View All Products</span>
                <ArrowRight size={14} />
              </Link>

              {/* Prev / Next Navigation Arrows - In Header to Never Cut Corner Cards */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Previous products"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#EADBBD] bg-white flex items-center justify-center text-[#111827] hover:border-[#9E1830] hover:bg-[#9E1830] hover:text-white transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Next products"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#EADBBD] bg-white flex items-center justify-center text-[#111827] hover:border-[#9E1830] hover:bg-[#9E1830] hover:text-white transition shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY FILTER TABS ROW                                              */}
        {/* ========================================================================= */}
        <div className="mb-8 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-2xs cursor-pointer text-center whitespace-nowrap ${
                    isActive
                      ? "bg-[#9E1830] text-white shadow-sm scale-105"
                      : "bg-white text-[#111827] border border-[#EADBBD] hover:border-[#9E1830] hover:text-[#9E1830]"
                  }`}
                >
                  <TabIcon id={tab.id} className="h-4 w-4 shrink-0" />
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
          {/* Scrollable Track - Border cutting design where rightmost card peeks at the edge */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth py-3 px-1 sm:px-2 snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product) => {
              const productImg = product.image || product.images?.[0]?.url;
              const badge = getBadgeInfo(product);
              const wishlisted = isInWishlist(product.slug);

              return (
                <div
                  key={product.slug}
                  className="flex-none w-[220px] min-[420px]:w-[240px] sm:w-[255px] md:w-[270px] lg:w-[280px] xl:w-[290px] flex flex-col justify-between rounded-2xl bg-white border border-[#EADBBD] hover:border-2 hover:border-[#F6C84C] hover:shadow-lg transition-all duration-300 group snap-start overflow-hidden shadow-2xs"
                >
                  {/* Top Image: Full Width Edge-to-Edge with Bottom Dividing Border */}
                  <div className="relative aspect-[4/3.5] sm:aspect-[4/3.6] w-full overflow-hidden bg-[#FAF7EE] border-b border-[#EADBBD]/70">
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
                        <div className="flex h-full w-full flex-col items-center justify-center text-[#173B3A]/40 text-xs">
                          <span className="text-3xl">🪔</span>
                          <span className="font-brand text-xs font-bold text-[#9E1830] mt-1 tracking-wider">HM PURITY</span>
                        </div>
                      )}
                    </Link>

                    {/* Status Badge - Render ONLY if present from Backend */}
                    {badge && (
                      <div className="absolute left-2.5 top-2.5 z-10 pointer-events-none">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border shadow-2xs backdrop-blur-xs ${badge.className}`}>
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
                          ? "bg-[#9E1830] text-white"
                          : "bg-white/95 text-[#173B3A] hover:bg-[#9E1830] hover:text-white"
                      }`}
                    >
                      <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Bottom Content Area: Clear padding */}
                  <div className="p-3.5 sm:p-4 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Product Name */}
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-brand text-base sm:text-lg font-bold uppercase tracking-wider text-[#111827] group-hover:text-[#9E1830] transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Subtitle / Series */}
                      <p className="font-sans text-xs sm:text-[13px] text-[#374151] font-medium line-clamp-1 mt-1">
                        {product.subCategory || product.category || "Flora Series"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Star size={13} fill="#F47A20" className="text-[#F47A20]" />
                        <span className="text-xs sm:text-sm font-bold text-[#111827]">
                          {product.rating || 4.9}
                        </span>
                        <span className="text-xs text-[#4B5563] font-medium">
                          ({product.reviewCount || 48})
                        </span>
                      </div>
                    </div>

                    {/* Bottom Price & Add to Cart Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#FAF6EE] flex items-center justify-between gap-2">
                      <div>
                        <span className="font-brand text-xl sm:text-2xl font-extrabold text-[#9E1830] block leading-none">
                          ₹{product.price}
                        </span>
                        <span className="font-sans text-xs text-[#4B5563] font-medium block mt-1">
                          ({product.quantity || "50 sticks"})
                        </span>
                      </div>

                      {/* Add to Cart Squircle Button */}
                      <button
                        type="button"
                        onClick={() => product.inStock && add(product)}
                        disabled={!product.inStock}
                        aria-label="Add to cart"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#9E1830] hover:bg-[#800F23] text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. CAROUSEL PAGINATION INDICATOR DOTS                                     */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {[0, 1, 2, 3, 4].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => {
                if (!scrollRef.current) return;
                const { scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (maxScroll > 0) {
                  scrollRef.current.scrollTo({
                    left: (dot / 4) * maxScroll,
                    behavior: "smooth",
                  });
                }
                setActiveDot(dot);
              }}
              aria-label={`Go to slide ${dot + 1}`}
              className={`block rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === dot ? "h-2 w-8 bg-[#9E1830]" : "h-2 w-2 bg-[#E5D7B7] hover:bg-[#9E1830]/60"
              }`}
            />
          ))}
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

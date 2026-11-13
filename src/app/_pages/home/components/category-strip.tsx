"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Package, Sparkles, X, Zap } from "lucide-react";
import { RitualArt } from "@/components/illustrations/RitualArt";
import { useStore } from "@/components/store";

interface CategoryItem {
  name: string;
  slug: string;
  subtitle: string;
  href: string;
  circleBg: string;
  arrowBg: string;
  textColor: string;
  art: any;
  subCategories?: {
    name: string;
    slug: string;
    desc: string;
    price?: string;
    badge?: string;
    icon: "sparkles" | "package" | "zap";
    art: any;
    children?: { name: string; slug: string }[];
  }[];
}

const UNIFIED_CIRCLE_BG = "bg-brand-primary";
const UNIFIED_ARROW_BG = "bg-brand-accent text-brand-ink";
const UNIFIED_TEXT_COLOR = "text-brand-ink";

const categoryPresets: Record<string, { circleBg: string; arrowBg: string; textColor: string; art: any }> = {
  "agarbatti": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "incense" },
  "camphor": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "camphor" },
  "dhoop-stick-bambooless-stick": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "dhoop-stick" },
  "dhoop-stick-bamboo-less-stick": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "dhoop-stick" },
  "incense-cone": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "cone" },
  "incense-cones": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "cone" },
  "chandan-cups": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "chandan-cup" },
  "havan-cups": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "chandan-cup" },
  "sambhrani-powder": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "sambrani-powder" },
  "sambrani-powder": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "sambrani-powder" },
  "pooja-essentials": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "diya" },
  "gift-sets": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "gift-set" },
  "family-pack": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "family-pack" },
  // Compatibility fallbacks
  "agarbatti-flora": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "incense" },
  "bhimseni-camphor": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "camphor" },
  "sambrani": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "sambrani-powder" },
  "loban-dhoop": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "dhoop-stick" },
  "sandalwood": { circleBg: UNIFIED_CIRCLE_BG, arrowBg: UNIFIED_ARROW_BG, textColor: UNIFIED_TEXT_COLOR, art: "chandan-cup" },
};

const agarbattiSubcategories = [
  {
    name: "Exclusive",
    slug: "exclusive",
    price: "₹125",
    badge: "50–65 Sticks",
    desc: "MRP ₹125 · Signature collection · 50–65 sticks",
    icon: "sparkles" as const,
    art: "incense" as const,
    children: [
      { name: "Pancharudhra", slug: "pancha-rudhra" },
      { name: "Real Stone", slug: "real-stone" },
      { name: "Cardamom", slug: "cardamom" },
      { name: "Kesar Loban", slug: "kesar-loban" },
      { name: "Karpoor Loban", slug: "karpoor-loban" },
      { name: "Kasturi", slug: "kasturi" },
      { name: "Amora", slug: "amora" },
      { name: "Javadu", slug: "javadu" },
      { name: "Champa", slug: "champa" },
      { name: "Megadhooth", slug: "megadhooth" },
      { name: "Fancy Flora", slug: "fancy-flora" },
    ],
  },
  {
    name: "Budget Pack",
    slug: "budget-pack",
    price: "₹120",
    badge: "12-Box Bundle",
    desc: "₹12 MRP/box · 12 sticks/box · 12-Box Bundle (₹120)",
    icon: "package" as const,
    art: "family-pack" as const,
    children: [
      { name: "Jasmine", slug: "jasmine-budget-pack" },
      { name: "Kewda", slug: "kewda-budget-pack" },
      { name: "Champa", slug: "champa-budget-pack" },
      { name: "Glory", slug: "glory-budget-pack" },
      { name: "Sandalwood", slug: "sandal-wood-budget-pack" },
      { name: "Pineapple", slug: "pineapple-budget-pack" },
      { name: "Rose", slug: "rose-budget-pack" },
      { name: "Ecstasy", slug: "ecstasy-budget-pack" },
      { name: "Fantasy", slug: "fantasy-budget-pack" },
      { name: "Loban", slug: "loban-super-budget-pack" },
      { name: "Lavender", slug: "lavender-budget-pack" },
    ],
  },
  {
    name: "Super Series",
    slug: "super-series",
    price: "₹75",
    badge: "100g Pack",
    desc: "MRP ₹75 · 100gms · 6 signature fragrances",
    icon: "zap" as const,
    art: "dhoop-stick" as const,
    children: [
      { name: "Rose", slug: "rose" },
      { name: "Glory", slug: "glory" },
      { name: "Lavender", slug: "lavender" },
      { name: "Sandalwood", slug: "sandal-wood" },
      { name: "Loban", slug: "loban" },
      { name: "Guggal", slug: "guggal" },
    ],
  },
];

const fallbackCategories: CategoryItem[] = [
  {
    name: "Agarbatti",
    slug: "agarbatti",
    subtitle: "Divine Handcrafted",
    href: "/shop?category=agarbatti",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "incense" as const,
    subCategories: agarbattiSubcategories,
  },
  {
    name: "Camphor",
    slug: "camphor",
    subtitle: "HM & Bhimseni Camphor",
    href: "/shop?category=camphor",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "camphor" as const,
  },
  {
    name: "Dhoop Stick",
    slug: "dhoop-stick",
    subtitle: "4-inch · 5.5 mm Thick",
    href: "/shop?category=dhoop-stick",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "dhoop-stick" as const,
  },
  {
    name: "Incense Cones",
    slug: "incense-cones",
    subtitle: "Charcoal-free Cones",
    href: "/shop?category=incense-cones",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "cone" as const,
  },
  {
    name: "Havan Cups",
    slug: "havan-cups",
    subtitle: "Sacred Ritual Cups",
    href: "/shop?category=havan-cups",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "chandan-cup" as const,
  },
  {
    name: "Sambrani Powder",
    slug: "sambrani-powder",
    subtitle: "Pure Resin Smoke",
    href: "/shop?category=sambrani-powder",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "sambrani-powder" as const,
  },
  {
    name: "Pooja Essentials",
    slug: "pooja-essentials",
    subtitle: "Daily Temple Needs",
    href: "/shop?category=pooja-essentials",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "diya" as const,
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    subtitle: "Festive Bundles",
    href: "/shop?category=gift-sets",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "gift-set" as const,
  },
  {
    name: "Family Pack",
    slug: "family-pack",
    subtitle: "Economy Assortment",
    href: "/shop?category=family-pack",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "family-pack" as const,
  },
];

function getPreset(slug: string, name: string, idx: number) {
  const s = (slug || "").toLowerCase().trim();
  const n = (name || "").toLowerCase().trim();
  if (categoryPresets[s]) return categoryPresets[s];
  for (const [key, val] of Object.entries(categoryPresets)) {
    if (s.includes(key) || key.includes(s) || n.includes(key) || key.includes(n)) {
      return val;
    }
  }
  const allPresets = Object.values(categoryPresets);
  return allPresets[idx % allPresets.length];
}

export function CategoryStrip() {
  const { dbCategories } = useStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>("exclusive");
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(1);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Strict canonical 9 categories (eliminates any old legacy database categories)
  const categories: CategoryItem[] = fallbackCategories.map((item) => {
    const dbMatch = dbCategories?.find((c) => c.slug === item.slug);
    if (dbMatch) {
      return {
        ...item,
        name: dbMatch.name || item.name,
        subtitle: dbMatch.description || item.subtitle,
      };
    }
    return item;
  });

  const moveSlider = (targetSlide: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const nextSlide = (targetSlide + slideCount) % slideCount;
    slider.scrollTo({
      left: Math.min(nextSlide * slider.clientWidth, slider.scrollWidth - slider.clientWidth),
      behavior: "smooth",
    });
    setActiveSlide(nextSlide);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updatePosition = () => {
      if (!slider.clientWidth) return;
      const pages = Math.max(1, Math.ceil(slider.scrollWidth / slider.clientWidth));
      const page = Math.min(pages - 1, Math.round(slider.scrollLeft / slider.clientWidth));
      setSlideCount(pages);
      setActiveSlide(page);
    };

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(slider);
    return () => observer.disconnect();
  }, [categories.length]);

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
  }, [autoplayPaused, slideCount, categories.length]);

  const activeSubCategoryOwner = categories.find(
    (c) => c.slug === activeDropdown && c.subCategories && c.subCategories.length > 0
  );
  const activeSub = activeSubCategoryOwner?.subCategories?.find((s) => s.slug === activeSubTab) || activeSubCategoryOwner?.subCategories?.[0];

  return (
    <section
      className="relative z-30 w-full overflow-visible bg-brand-surface-alt py-3.5 sm:py-6"
      ref={containerRef}
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => {
        setAutoplayPaused(false);
        setActiveDropdown(null);
      }}
      onFocusCapture={() => setAutoplayPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAutoplayPaused(false);
      }}
      onTouchStart={() => setAutoplayPaused(true)}
      onTouchEnd={() => setAutoplayPaused(false)}
    >
      <div className="page-container">
        
        {/* Section Header */}
        <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-4">
          <span className="hidden h-px w-8 bg-brand-primary/30 sm:inline-block" />
          <span className="flex-1 text-center font-brand text-[11px] sm:text-xs font-bold tracking-[.14em] text-brand-primary uppercase sm:tracking-[.2em]">
            EXPLORE SACRED CATEGORIES
          </span>
          <span className="hidden h-px w-8 bg-brand-primary/30 sm:inline-block" />
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => moveSlider(activeSlide - 1)} aria-label="Previous categories" className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:text-brand-primary sm:h-11 sm:w-11">
              <ChevronLeft size={16} />
            </button>
            <button type="button" onClick={() => moveSlider(activeSlide + 1)} aria-label="Next categories" className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:text-brand-primary sm:h-11 sm:w-11">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 9 Category Circles Container */}
        <div className="relative">
          <div
            ref={sliderRef}
            role="region"
            aria-label="Shop by category"
            onScroll={() => {
              const slider = sliderRef.current;
              if (slider) setActiveSlide(Math.min(slideCount - 1, Math.round(slider.scrollLeft / slider.clientWidth)));
            }}
            className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 pt-1 sm:gap-4 lg:gap-5"
          >
            {categories.map((item, idx) => {
              const hasSubs = Boolean(item.subCategories && item.subCategories.length > 0);
              const isDropdownOpen = activeDropdown === item.slug;

              return (
                <div
                  key={item.slug || idx}
                  className="group relative flex w-[calc((100%_-_1rem)_/_3)] shrink-0 snap-start flex-col items-center px-0.5 text-center min-[640px]:w-[calc((100%_-_3rem)_/_4)] lg:w-[calc((100%_-_5rem)_/_6)]"
                  onMouseEnter={() => {
                    if (hasSubs && typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                      setActiveDropdown(item.slug);
                    }
                  }}
                >
                  {/* Main Action Link */}
                  <Link
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className="flex min-h-[104px] w-full flex-col items-center justify-start rounded-2xl px-1.5 py-1.5 transition-colors duration-300 hover:bg-brand-surface-soft sm:min-h-0 sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
                  >
                    {/* Circle with SVG Illustration & Arrow Icon */}
                    <div className="relative mb-2 h-[60px] w-[60px] min-[360px]:h-[68px] min-[360px]:w-[68px] sm:h-[94px] sm:w-[94px]">
                      <div className={`h-full w-full overflow-hidden rounded-full ${item.circleBg} shadow-sm ring-4 ring-white border border-brand-accent/45 transition-all duration-300 group-hover:ring-brand-accent group-hover:shadow-md`}>
                        <RitualArt kind={item.art} className="h-full w-full scale-[1.12] p-1.5" />
                      </div>

                      <div className={`absolute bottom-0 right-0 w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full ${item.arrowBg} flex items-center justify-center shadow-sm transition-transform duration-300 border-2 border-white sm:group-hover:scale-110`}>
                        {hasSubs ? <ChevronDown size={13} className="text-brand-ink" /> : <ArrowRight size={13} className="text-brand-ink" />}
                      </div>
                    </div>

                    {/* Category Title */}
                    <div className="max-w-full break-words font-brand text-ui-11 sm:text-ui-13 font-bold leading-snug text-brand-heading sm:group-hover:text-brand-primary sm:max-w-[128px] tracking-wide uppercase">
                      {item.name}
                    </div>
                  </Link>

                  {/* Accessible Click/Tap Toggle Button for Subcategories */}
                  {hasSubs && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(isDropdownOpen ? null : item.slug);
                      }}
                      aria-expanded={isDropdownOpen}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-primary text-ui-11 font-bold text-brand-accent px-3 py-1 shadow-2xs border border-brand-accent/60 hover:bg-brand-hover hover:border-brand-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                      <span>3 Series</span>
                      <ChevronDown size={11} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-white" : ""}`} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Luxury Non-Clipped Subcategory Flyout Panel */}
          {activeSubCategoryOwner && (
            <div className="absolute left-0 right-0 sm:left-0 sm:right-auto sm:w-[620px] top-full z-50 pt-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-[#FFFDF8] shadow-[0_24px_60px_rgba(48,41,35,0.18)]">
                
                {/* 1. Header with Royal Crimson Gradient & Temple Gold */}
                <div className="flex items-center justify-between gap-3 border-b border-[#EAE1D3] bg-gradient-to-r from-[#9E1830] via-[#851327] to-[#9E1830] px-4 py-3 sm:px-6 sm:py-3.5 text-white">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] text-[#C89B3C] uppercase">
                      <Sparkles size={12} className="text-[#C89B3C]" /> {activeSubCategoryOwner.name} Collections
                    </p>
                    <h3 className="font-heading text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
                      Select a Series to Browse Fragrances
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(null)}
                    aria-label="Close categories"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* 2. Side-by-Side Series Circles Strip */}
                <div className="bg-[#F5EFE3]/70 px-3 py-2.5 sm:px-5 sm:py-3 border-b border-[#EAE1D3]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#746B62]">
                      Explore by Series ({activeSubCategoryOwner.subCategories?.length || 3})
                    </span>
                    <span className="text-[10px] font-semibold text-brand-primary">
                      Tap series circle to switch
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {activeSubCategoryOwner.subCategories?.map((sub) => {
                      const isTabActive = activeSub?.slug === sub.slug;
                      return (
                        <button
                          key={sub.slug}
                          type="button"
                          onClick={() => setActiveSubTab(sub.slug)}
                          className={`group/circle flex flex-col items-center p-2 rounded-xl transition-all duration-200 cursor-pointer text-center relative border ${
                            isTabActive
                              ? "bg-white shadow-xs border-[#C89B3C] ring-2 ring-[#C89B3C]/35 scale-[1.02]"
                              : "bg-white/60 hover:bg-white border-[#EAE1D3] hover:border-[#C89B3C]/60"
                          }`}
                        >
                          {/* Series Main Circle with Side Circle Badge */}
                          <div className="relative mb-1.5">
                            <div
                              className={`h-11 w-11 sm:h-13 sm:w-13 rounded-full overflow-hidden p-1 transition-all duration-200 ${
                                isTabActive
                                  ? "bg-brand-primary ring-2 ring-[#C89B3C] shadow-sm"
                                  : "bg-brand-primary/85 group-hover/circle:bg-brand-primary group-hover/circle:scale-105"
                              }`}
                            >
                              <RitualArt kind={sub.art} className="h-full w-full scale-[1.12]" />
                            </div>

                            {/* Small Side Circle Badge at bottom right */}
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold border border-white shadow-2xs ${
                                isTabActive
                                  ? "bg-[#C89B3C] text-[#302923]"
                                  : "bg-[#F5EFE3] text-[#746B62] group-hover/circle:bg-[#C89B3C] group-hover/circle:text-[#302923]"
                              }`}
                            >
                              {sub.children?.length || 0}
                            </div>
                          </div>

                          <span className={`text-[11px] sm:text-xs font-bold leading-tight ${isTabActive ? "text-brand-primary" : "text-[#302923]"}`}>
                            {sub.name}
                          </span>
                          <span className="text-[10px] text-brand-primary font-semibold mt-0.5">
                            {sub.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Active Series Details Card with Prominent Side Circle */}
                {activeSub && (
                  <div className="p-3.5 sm:p-5 space-y-3">
                    {/* Series Hero Banner with Side Circle */}
                    <div className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl bg-white border border-[#EAE1D3] shadow-2xs">
                      {/* Prominent Side Circle */}
                      <div className="relative shrink-0">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-brand-primary p-1.5 border-2 border-[#C89B3C] ring-4 ring-[#F5EFE3] shadow-sm overflow-hidden">
                          <RitualArt kind={activeSub.art} className="h-full w-full scale-[1.15]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#C89B3C] text-[#302923] flex items-center justify-center font-bold text-[10px] border-2 border-white shadow-2xs">
                          {activeSub.children?.length || 0}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="font-heading text-sm sm:text-base font-bold text-[#302923]">
                            {activeSub.name} Series
                          </h4>
                          {activeSub.badge && (
                            <span className="inline-block rounded-full bg-[#F5EFE3] border border-[#C89B3C]/40 px-2 py-0.5 text-[10px] font-bold text-brand-primary">
                              {activeSub.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-[#746B62] leading-snug">
                          {activeSub.desc}
                        </p>
                        <div className="mt-1.5">
                          <Link
                            href={`/shop?category=agarbatti&subcategory=${encodeURIComponent(activeSub.name)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:text-brand-hover hover:underline"
                          >
                            Browse entire {activeSub.name} range <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Fragrance List Header */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#746B62] mb-2 px-1">
                        <span>Fragrances in {activeSub.name} ({activeSub.children?.length || 0})</span>
                        <span className="text-[10px] font-normal normal-case text-stone-500">Click to view product</span>
                      </div>

                      {/* Fragrance Chips with Mini Side Circles */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[160px] overflow-y-auto pr-1">
                        {activeSub.children?.map((child, idx) => (
                          <Link
                            key={child.slug}
                            href={`/product/${child.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group/chip inline-flex items-center gap-1.5 rounded-full border border-[#EAE1D3] bg-white px-2.5 py-1 text-xs font-semibold text-[#302923] shadow-2xs transition-all duration-150 hover:border-brand-primary hover:bg-[#9E1830] hover:text-white hover:scale-[1.02]"
                          >
                            {/* Mini Side Circle */}
                            <span className="h-4 w-4 rounded-full bg-[#F5EFE3] group-hover/chip:bg-white/20 border border-[#C89B3C]/50 group-hover/chip:border-white/50 flex items-center justify-center text-[9px] font-bold text-brand-primary group-hover/chip:text-white shrink-0 transition-colors">
                              {idx + 1}
                            </span>
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Luxury Footer */}
                <div className="border-t border-[#EAE1D3] bg-[#F5EFE3]/80 px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-sans text-[#746B62] hidden sm:inline">
                    Handcrafted in Coimbatore · 100% Charcoal-Free
                  </span>
                  <Link
                    href="/shop?category=agarbatti"
                    onClick={() => setActiveDropdown(null)}
                    className="flex min-h-9 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-hover hover:scale-[1.01]"
                  >
                    View All 28 Agarbatti Fragrances <ArrowRight size={13} />
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>

        {slideCount > 1 && (
          <nav aria-label="Category slider pages" className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: slideCount }, (_, slide) => (
              <button
                key={slide}
                type="button"
                onClick={() => moveSlider(slide)}
                aria-label={`Show category group ${slide + 1}`}
                aria-current={activeSlide === slide ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === slide ? "w-9 bg-brand-primary" : "w-2.5 bg-brand-border hover:bg-brand-primary/60"}`}
              />
            ))}
          </nav>
        )}

      </div>
    </section>
  );
}

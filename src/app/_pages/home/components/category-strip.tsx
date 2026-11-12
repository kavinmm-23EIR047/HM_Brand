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
    icon: "sparkles" | "package" | "zap";
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
    desc: "MRP ₹125 · Signature collection · 50–65 sticks",
    icon: "sparkles" as const,
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
    desc: "₹12 MRP/box · 12 sticks/box · 12-Box Bundle (₹120)",
    icon: "package" as const,
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
    desc: "MRP ₹75 · 100gms · 6 signature fragrances",
    icon: "zap" as const,
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

  return (
    <section
      className="relative z-30 w-full overflow-visible border-y border-brand-border bg-white py-5 sm:py-7"
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
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
          <span className="hidden h-px w-8 bg-brand-primary/30 sm:inline-block" />
          <span className="flex-1 text-center font-brand text-xs font-bold tracking-[.15em] text-brand-primary uppercase sm:tracking-[.2em]">
            EXPLORE SACRED CATEGORIES
          </span>
          <span className="hidden h-px w-8 bg-brand-primary/30 sm:inline-block" />
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => moveSlider(activeSlide - 1)} aria-label="Previous categories" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:text-brand-primary sm:h-11 sm:w-11">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => moveSlider(activeSlide + 1)} aria-label="Next categories" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-brand-heading shadow-2xs transition hover:border-brand-primary hover:text-brand-primary sm:h-11 sm:w-11">
              <ChevronRight size={18} />
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

                  {/* Accessible Click/Tap Toggle Button for Subcategories (Never Clipped!) */}
                  {hasSubs && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(isDropdownOpen ? null : item.slug);
                      }}
                      aria-expanded={isDropdownOpen}
                      className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-primary text-ui-11 font-bold text-brand-accent px-2.5 py-0.5 shadow-2xs border border-brand-accent/50 hover:bg-brand-hover transition"
                    >
                      <span>3 Series</span>
                      <ChevronDown size={11} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Non-Clipped Flyout Panel Positioned Outside overflow-x-auto */}
          {activeSubCategoryOwner && (
            <div className="absolute left-0 top-full z-50 w-full max-w-[600px] pt-2.5 text-left animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-border bg-white shadow-[0_20px_50px_rgba(23,59,58,0.18)]">
                <div className="flex items-start justify-between gap-4 border-b border-brand-border bg-brand-surface-soft px-5 py-4 sm:px-6">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-brand-primary uppercase">
                      <Sparkles size={14} className="text-brand-orange" /> {activeSubCategoryOwner.name} Collections
                    </p>
                    <p className="mt-1 text-xs text-[#68756D]">Choose a series, then pick a fragrance.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(null)}
                    aria-label="Close Agarbatti categories"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-border bg-white text-brand-ink transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  {activeSubCategoryOwner.subCategories?.map((sub) => (
                    <section
                      key={sub.slug}
                      className={`rounded-2xl border border-brand-border/80 bg-brand-surface-bright p-3.5 ${!sub.children ? "sm:col-span-2 sm:order-last" : ""}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-surface-warm text-brand-primary">
                          {sub.icon === "sparkles" ? <Sparkles size={16} /> : sub.icon === "package" ? <Package size={16} /> : <Zap size={16} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/shop?category=agarbatti&subcategory=${encodeURIComponent(sub.name)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="text-xs font-extrabold text-brand-ink transition hover:text-brand-primary"
                          >
                            {sub.name}
                          </Link>
                          <p className="mt-0.5 text-ui-11 leading-relaxed text-[#5F6D66]">{sub.desc}</p>
                        </div>
                        <Link
                          href={`/shop?category=agarbatti&subcategory=${encodeURIComponent(sub.name)}`}
                          onClick={() => setActiveDropdown(null)}
                          aria-label={`Browse ${sub.name}`}
                          className="mt-1 text-brand-primary transition hover:translate-x-0.5"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                      {sub.children && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {sub.children.map((child) => (
                            <Link
                              key={child.slug}
                              href={`/product/${child.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="rounded-full border border-brand-border bg-white px-2.5 py-1 text-ui-11 font-semibold text-brand-ink transition hover:border-brand-primary hover:bg-brand-primary hover:text-white"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                <div className="border-t border-brand-border bg-brand-surface-soft px-4 py-3 sm:px-5">
                  <Link
                    href="/shop?category=agarbatti"
                    onClick={() => setActiveDropdown(null)}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-hover"
                  >
                    View all {activeSubCategoryOwner.name} <ArrowRight size={14} />
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

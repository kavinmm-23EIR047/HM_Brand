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

const UNIFIED_CIRCLE_BG = "bg-gradient-to-br from-brand-primary via-[#851327] to-[#660B1C]";
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
    desc: "Signature fragrance collection",
    icon: "sparkles" as const,
    children: ["Cardamom", "Kasturi", "Karpoor Loban", "Kesar Loban", "Pancha Rudhra", "Real Stone", "Fancy Flora"]
      .map((name) => ({ name, slug: name.toLowerCase().replaceAll(" ", "-") })),
  },
  { name: "Budget Pack (12 pcs)", slug: "budget-pack-12-pcs", desc: "Brochure entry: ₹12 · 16 NOS", icon: "package" as const },
  {
    name: "Super Series",
    slug: "super-series",
    desc: "Ten brochure fragrances",
    icon: "zap" as const,
    children: ["Rose", "Pineapple", "Sandal", "Glory", "Fantasy", "Jasmine", "Lavender", "Ecstasy", "Kewda", "Loban"]
      .map((name) => ({ name, slug: name.toLowerCase().replaceAll(" ", "-") })),
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
    subtitle: "99.9% Pure Pine",
    href: "/shop?category=camphor",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "camphor" as const,
  },
  {
    name: "Dhoop Stick / Bambooless",
    slug: "dhoop-stick-bambooless-stick",
    subtitle: "Pure Herbal Sticks",
    href: "/shop?category=dhoop-stick-bambooless-stick",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "dhoop-stick" as const,
  },
  {
    name: "Incense Cone",
    slug: "incense-cone",
    subtitle: "Charcoal-free Cones",
    href: "/shop?category=incense-cone",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "cone" as const,
  },
  {
    name: "Chandan Cups",
    slug: "chandan-cups",
    subtitle: "Sacred Sandalwood",
    href: "/shop?category=chandan-cups",
    circleBg: UNIFIED_CIRCLE_BG,
    arrowBg: UNIFIED_ARROW_BG,
    textColor: UNIFIED_TEXT_COLOR,
    art: "chandan-cup" as const,
  },
  {
    name: "Sambhrani Powder",
    slug: "sambhrani-powder",
    subtitle: "Pure Resin Smoke",
    href: "/shop?category=sambhrani-powder",
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <section
      className="relative z-30 w-full overflow-visible border-b border-brand-accent/30 bg-[#fffaf0] py-4 sm:py-6"
      ref={containerRef}
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => setAutoplayPaused(false)}
      onFocusCapture={() => setAutoplayPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAutoplayPaused(false);
      }}
      onTouchStart={() => setAutoplayPaused(true)}
      onTouchEnd={() => setAutoplayPaused(false)}
    >
      <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
          <span className="hidden h-px w-8 bg-brand-primary/30 sm:inline-block" />
          <span className="flex-1 text-center font-brand text-ui-11 font-bold tracking-[.15em] text-brand-primary uppercase sm:text-xs sm:tracking-[.2em]">
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
                onMouseEnter={() => hasSubs && setActiveDropdown(item.slug)}
                onMouseLeave={() => hasSubs && setActiveDropdown(null)}
              >
                {/* Main Action Link */}
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) setActiveDropdown(null);
                  }}
                  className="flex min-h-[112px] w-full flex-col items-center justify-start rounded-2xl px-1.5 py-2 transition-colors duration-300 hover:bg-white/70 sm:min-h-0 sm:rounded-none sm:px-0 sm:py-0 sm:hover:bg-transparent"
                >
                  {/* Circle with SVG Illustration & Arrow Icon */}
                  <div className="relative mb-2 h-[58px] w-[58px] min-[360px]:h-[66px] min-[360px]:w-[66px] sm:h-[94px] sm:w-[94px]">
                    <div className={`h-full w-full overflow-hidden rounded-full ${item.circleBg} shadow-md ring-4 ring-white border border-brand-accent/45 transition-all duration-300 group-hover:ring-brand-accent group-hover:shadow-lg`}>
                      <RitualArt kind={item.art} className="h-full w-full scale-[1.12] p-1.5" />
                    </div>

                    {/* Golden Arrow Badge / Series Indicator */}
                    <div className={`absolute bottom-0 right-0 w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full ${item.arrowBg} flex items-center justify-center shadow-md transition-transform duration-300 border-2 border-white sm:group-hover:scale-110`}>
                      {hasSubs ? <ChevronDown size={13} className="text-brand-ink" /> : <ArrowRight size={13} className="text-brand-ink" />}
                    </div>
                  </div>

                  {/* Category Title */}
                  <div className="max-w-full break-words font-brand text-[11px] min-[360px]:text-xs sm:text-ui-13 font-bold leading-snug text-brand-heading sm:group-hover:text-brand-primary sm:max-w-[120px] tracking-wide uppercase">
                    {item.name}
                  </div>

                  {/* Subcategory Hint Badge for Agarbatti */}
                  {hasSubs && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-primary text-ui-10 sm:text-xs font-bold text-brand-accent px-2.5 py-0.5 shadow-xs border border-brand-accent/60">
                      <span>3 Series</span>
                      <ChevronDown size={10} />
                    </span>
                  )}
                </Link>

                {/* Interactive Dropdown / Flyout Menu for Subcategories */}
                {hasSubs && isDropdownOpen && (
                  <div className={`absolute top-full z-50 w-[min(580px,calc(100vw-1.5rem))] pt-3 text-left animate-in fade-in slide-in-from-top-1 duration-150 ${
                    idx > 4 ? "right-0" : "left-0"
                  }`}>
                    <div className="overflow-hidden rounded-3xl border border-[#E8D8B2] bg-white shadow-[0_20px_55px_rgba(36,44,35,0.2)]">
                      <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-brand-surface to-white px-5 py-4 sm:px-6">
                        <div>
                          <p className="flex items-center gap-2 text-ui-10 font-extrabold tracking-[.16em] text-brand-primary uppercase">
                            <Sparkles size={14} className="text-brand-orange" /> Agarbatti collections
                          </p>
                          <p className="mt-1 text-xs text-[#68756D]">Choose a series, then pick a fragrance.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          aria-label="Close Agarbatti categories"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#60716A] transition hover:bg-[#F4E9D4] hover:text-brand-primary"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-5">
                        {item.subCategories?.map((sub) => (
                          <section
                            key={sub.slug}
                            className={`rounded-2xl border border-[#EDE5D5] bg-[#FFFEFB] p-3.5 ${!sub.children ? "sm:col-span-2 sm:order-last" : ""}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-surface-warm text-brand-primary">
                                {sub.icon === "sparkles" ? <Sparkles size={16} /> : sub.icon === "package" ? <Package size={16} /> : <Zap size={16} />}
                              </span>
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/shop?category=${encodeURIComponent(sub.name)}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="text-xs font-extrabold text-brand-ink transition hover:text-brand-primary"
                                >
                                  {sub.name}
                                </Link>
                                <p className="mt-0.5 text-ui-10 leading-relaxed text-[#75827B]">{sub.desc}</p>
                              </div>
                              <Link
                                href={`/shop?category=${encodeURIComponent(sub.name)}`}
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
                                    href={`/shop?category=${encodeURIComponent(child.name)}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="rounded-full border border-[#E8D8B2] bg-white px-2.5 py-1 text-ui-10 font-semibold text-[#455A50] transition hover:border-brand-primary hover:bg-brand-primary hover:text-white"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </section>
                        ))}
                      </div>

                      <div className="border-t border-[#F1E7D5] bg-[#FFFCF5] px-4 py-3 sm:px-5">
                        <Link
                          href="/shop?category=agarbatti"
                          onClick={() => setActiveDropdown(null)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#7E1027]"
                        >
                          View all Agarbatti <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

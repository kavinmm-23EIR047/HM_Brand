"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { RitualArt } from "./illustrations/RitualArt";
import { useStore } from "./store";

const categoryPresets: Record<string, { circleBg: string; arrowBg: string; textColor: string; art: any }> = {
  "agarbatti": { circleBg: "bg-[#9E1830]", arrowBg: "bg-[#F47A20]", textColor: "text-[#9E1830]", art: "incense" },
  "camphor": { circleBg: "bg-[#2563EB]", arrowBg: "bg-[#0284C7]", textColor: "text-[#1E40AF]", art: "camphor" },
  "dhoop-stick-bamboo-less-stick": { circleBg: "bg-[#7C3AED]", arrowBg: "bg-[#F47A20]", textColor: "text-[#6D28D9]", art: "sandalwood" },
  "incense-cones": { circleBg: "bg-[#059669]", arrowBg: "bg-[#10B981]", textColor: "text-[#065F46]", art: "sandalwood" },
  "havan-cups": { circleBg: "bg-[#B45309]", arrowBg: "bg-[#F59E0B]", textColor: "text-[#92400E]", art: "sambrani" },
  "sambrani-powder": { circleBg: "bg-[#EA580C]", arrowBg: "bg-[#9E1830]", textColor: "text-[#C2410C]", art: "loban" },
  "pooja-essentials": { circleBg: "bg-[#D97706]", arrowBg: "bg-[#9E1830]", textColor: "text-[#B45309]", art: "diya" },
  "gift-sets": { circleBg: "bg-[#0D9488]", arrowBg: "bg-[#14B8A6]", textColor: "text-[#0F766E]", art: "gift" },
  "family-pack": { circleBg: "bg-[#E11D48]", arrowBg: "bg-[#F43F5E]", textColor: "text-[#BE123C]", art: "natural" },
};

const fallbackCategories = [
  { name: "Agarbatti", subtitle: "Divine Handcrafted", href: "/shop?category=agarbatti", circleBg: "bg-[#9E1830]", arrowBg: "bg-[#F47A20]", textColor: "text-[#9E1830]", art: "incense" as const },
  { name: "Camphor", subtitle: "100% Pure & Residue-Free", href: "/shop?category=camphor", circleBg: "bg-[#2563EB]", arrowBg: "bg-[#0284C7]", textColor: "text-[#1E40AF]", art: "camphor" as const },
  { name: "Dhoop Stick / Bamboo-less Stick", subtitle: "Bamboo-Free Pure Aroma", href: "/shop?category=dhoop-stick-bamboo-less-stick", circleBg: "bg-[#7C3AED]", arrowBg: "bg-[#F47A20]", textColor: "text-[#6D28D9]", art: "sandalwood" as const },
  { name: "Incense Cones", subtitle: "Sacred Meditation Cones", href: "/shop?category=incense-cones", circleBg: "bg-[#059669]", arrowBg: "bg-[#10B981]", textColor: "text-[#065F46]", art: "sandalwood" as const },
  { name: "Havan Cups", subtitle: "Purifying Sambrani Cups", href: "/shop?category=havan-cups", circleBg: "bg-[#B45309]", arrowBg: "bg-[#F59E0B]", textColor: "text-[#92400E]", art: "sambrani" as const },
  { name: "Sambrani Powder", subtitle: "Traditional Natural Resin", href: "/shop?category=sambrani-powder", circleBg: "bg-[#EA580C]", arrowBg: "bg-[#9E1830]", textColor: "text-[#C2410C]", art: "loban" as const },
  { name: "Pooja Essentials", subtitle: "Daily Temple Offerings", href: "/shop?category=pooja-essentials", circleBg: "bg-[#D97706]", arrowBg: "bg-[#9E1830]", textColor: "text-[#B45309]", art: "diya" as const },
  { name: "Gift Sets", subtitle: "Festive Divine Boxes", href: "/shop?category=gift-sets", circleBg: "bg-[#0D9488]", arrowBg: "bg-[#14B8A6]", textColor: "text-[#0F766E]", art: "gift" as const },
  { name: "Family Pack", subtitle: "Value Multi-Fragrance Packs", href: "/shop?category=family-pack", circleBg: "bg-[#E11D48]", arrowBg: "bg-[#F43F5E]", textColor: "text-[#BE123C]", art: "natural" as const },
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ONLY top-level categories (no subcategories like Exclusive, Budget Pack, Super Series)
  const onlyMainCategories = (dbCategories || []).filter((cat: any) => !cat.parentId);

  const categories = onlyMainCategories.length > 0
    ? onlyMainCategories.map((cat, idx) => {
        const preset = getPreset(cat.slug, cat.name, idx);
        return {
          name: cat.name,
          subtitle: cat.description || "Handcrafted sacred fragrance",
          href: `/shop?category=${encodeURIComponent(cat.slug || cat.name)}`,
          circleBg: preset.circleBg,
          arrowBg: preset.arrowBg,
          textColor: preset.textColor,
          art: preset.art,
        };
      })
    : fallbackCategories;

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
  }, []);

  const scrollByAmount = useCallback((amount: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (amount > 0 && el.scrollLeft >= maxScroll - 20) {
      // Loop smoothly back to start
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (amount < 0 && el.scrollLeft <= 20) {
      // Loop smoothly to end
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: amount, behavior: "smooth" });
    }
  }, []);

  // Continuous gentle auto-slide every 2.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      scrollByAmount(190);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused, scrollByAmount]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, categories]);

  return (
    <section className="relative w-full overflow-hidden bg-[#fffaf0] py-5 sm:py-7 border-y border-[#F6C84C]/40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header with Title & Arrow Controls */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-space text-[10px] sm:text-xs font-black tracking-[.22em] text-[#9E1830] uppercase">
              SHOP BY CATEGORY
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#6B4226]/70 bg-[#FFF4D6] px-2 py-0.5 rounded-full border border-[#F6C84C]/40">
              <Sparkles size={10} className="text-[#F47A20]" />
              {categories.length} Sacred Categories
            </span>
          </div>

          {/* Left / Right Carousel Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollByAmount(-220)}
              aria-label="Previous categories"
              className={`grid h-8 w-8 place-items-center rounded-full bg-white border border-[#F6C84C]/60 text-[#173B3A] shadow-xs transition hover:bg-[#9E1830] hover:text-white active:scale-95 ${
                !canScrollLeft ? "opacity-70" : "opacity-100"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(220)}
              aria-label="Next categories"
              className={`grid h-8 w-8 place-items-center rounded-full bg-white border border-[#F6C84C]/60 text-[#173B3A] shadow-xs transition hover:bg-[#9E1830] hover:text-white active:scale-95 ${
                !canScrollRight ? "opacity-70" : "opacity-100"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Auto-sliding Category Carousel */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 2500);
          }}
          className="hide-scrollbar flex items-start gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-2 pt-1 select-none"
        >
          {categories.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex w-[90px] min-[360px]:w-[100px] sm:w-[120px] shrink-0 flex-col items-center px-1 py-1 text-center transition-all duration-300"
            >
              {/* Solid Color Circle with Icon & Arrow Badge */}
              <div className="relative mb-2.5 h-[68px] w-[68px] min-[360px]:h-[78px] min-[360px]:w-[78px] sm:h-[96px] sm:w-[96px]">
                <div className={`h-full w-full overflow-hidden rounded-full ${item.circleBg} shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-108 group-hover:shadow-xl`}>
                  <RitualArt kind={item.art} className="h-full w-full scale-[1.12] p-1.5 transition duration-300 group-hover:rotate-6" />
                </div>

                {/* Round Arrow Badge */}
                <div className={`absolute bottom-0 right-0 w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full ${item.arrowBg} text-white flex items-center justify-center shadow-md group-hover:scale-115 transition-transform duration-300 border-2 border-white`}>
                  <ArrowRight size={13} />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className={`font-heading text-xs sm:text-sm font-extrabold leading-tight ${item.textColor} group-hover:text-[#9E1830] transition line-clamp-2`}>
                {item.name}
              </div>
              <span className="sr-only">{item.subtitle}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

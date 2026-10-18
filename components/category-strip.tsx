"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Package, Sparkles, X, Zap } from "lucide-react";
import { RitualArt } from "./illustrations/RitualArt";
import { useStore } from "./store";

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

const categoryPresets: Record<string, { circleBg: string; arrowBg: string; textColor: string; art: any }> = {
  "agarbatti": { circleBg: "bg-[#9E1830]", arrowBg: "bg-[#F47A20]", textColor: "text-[#9E1830]", art: "incense" },
  "camphor": { circleBg: "bg-[#4C7FA8]", arrowBg: "bg-[#F47A20]", textColor: "text-[#4C7FA8]", art: "camphor" },
  "dhoop-stick-bambooless-stick": { circleBg: "bg-[#3F7D45]", arrowBg: "bg-[#F47A20]", textColor: "text-[#3F7D45]", art: "loban" },
  "dhoop-stick-bamboo-less-stick": { circleBg: "bg-[#3F7D45]", arrowBg: "bg-[#F47A20]", textColor: "text-[#3F7D45]", art: "loban" },
  "incense-cone": { circleBg: "bg-[#F47A20]", arrowBg: "bg-[#9E1830]", textColor: "text-[#F47A20]", art: "loban" },
  "incense-cones": { circleBg: "bg-[#F47A20]", arrowBg: "bg-[#9E1830]", textColor: "text-[#F47A20]", art: "loban" },
  "chandan-cups": { circleBg: "bg-[#F6C84C]", arrowBg: "bg-[#9E1830]", textColor: "text-[#173B3A]", art: "sandalwood" },
  "havan-cups": { circleBg: "bg-[#F6C84C]", arrowBg: "bg-[#9E1830]", textColor: "text-[#173B3A]", art: "sandalwood" },
  "sambhrani-powder": { circleBg: "bg-[#D96B27]", arrowBg: "bg-[#9E1830]", textColor: "text-[#D96B27]", art: "sambrani" },
  "sambrani-powder": { circleBg: "bg-[#D96B27]", arrowBg: "bg-[#9E1830]", textColor: "text-[#D96B27]", art: "sambrani" },
  "pooja-essentials": { circleBg: "bg-[#7653A6]", arrowBg: "bg-[#F47A20]", textColor: "text-[#7653A6]", art: "diya" },
  "gift-sets": { circleBg: "bg-[#5F8559]", arrowBg: "bg-[#F47A20]", textColor: "text-[#5F8559]", art: "gift" },
  "family-pack": { circleBg: "bg-[#A90C35]", arrowBg: "bg-[#F47A20]", textColor: "text-[#A90C35]", art: "gift" },
  // Compatibility fallbacks
  "agarbatti-flora": { circleBg: "bg-[#9E1830]", arrowBg: "bg-[#F47A20]", textColor: "text-[#9E1830]", art: "incense" },
  "bhimseni-camphor": { circleBg: "bg-[#4C7FA8]", arrowBg: "bg-[#F47A20]", textColor: "text-[#4C7FA8]", art: "camphor" },
  "sambrani": { circleBg: "bg-[#D96B27]", arrowBg: "bg-[#9E1830]", textColor: "text-[#D96B27]", art: "sambrani" },
  "loban-dhoop": { circleBg: "bg-[#3F7D45]", arrowBg: "bg-[#F47A20]", textColor: "text-[#3F7D45]", art: "loban" },
  "sandalwood": { circleBg: "bg-[#F6C84C]", arrowBg: "bg-[#9E1830]", textColor: "text-[#173B3A]", art: "sandalwood" },
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
    circleBg: "bg-[#9E1830]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#9E1830]",
    art: "incense" as const,
    subCategories: agarbattiSubcategories,
  },
  {
    name: "Camphor",
    slug: "camphor",
    subtitle: "99.9% Pure Pine",
    href: "/shop?category=camphor",
    circleBg: "bg-[#4C7FA8]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#4C7FA8]",
    art: "camphor" as const,
  },
  {
    name: "Dhoop Stick / Bambooless",
    slug: "dhoop-stick-bambooless-stick",
    subtitle: "Pure Herbal Sticks",
    href: "/shop?category=dhoop-stick-bambooless-stick",
    circleBg: "bg-[#3F7D45]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#3F7D45]",
    art: "loban" as const,
  },
  {
    name: "Incense Cone",
    slug: "incense-cone",
    subtitle: "Charcoal-free Cones",
    href: "/shop?category=incense-cone",
    circleBg: "bg-[#F47A20]",
    arrowBg: "bg-[#9E1830]",
    textColor: "text-[#F47A20]",
    art: "loban" as const,
  },
  {
    name: "Chandan Cups",
    slug: "chandan-cups",
    subtitle: "Sacred Sandalwood",
    href: "/shop?category=chandan-cups",
    circleBg: "bg-[#F6C84C]",
    arrowBg: "bg-[#9E1830]",
    textColor: "text-[#173B3A]",
    art: "sandalwood" as const,
  },
  {
    name: "Sambhrani Powder",
    slug: "sambhrani-powder",
    subtitle: "Pure Resin Smoke",
    href: "/shop?category=sambhrani-powder",
    circleBg: "bg-[#D96B27]",
    arrowBg: "bg-[#9E1830]",
    textColor: "text-[#D96B27]",
    art: "sambrani" as const,
  },
  {
    name: "Pooja Essentials",
    slug: "pooja-essentials",
    subtitle: "Daily Temple Needs",
    href: "/shop?category=pooja-essentials",
    circleBg: "bg-[#7653A6]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#7653A6]",
    art: "diya" as const,
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    subtitle: "Festive Bundles",
    href: "/shop?category=gift-sets",
    circleBg: "bg-[#5F8559]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#5F8559]",
    art: "gift" as const,
  },
  {
    name: "Family Pack",
    slug: "family-pack",
    subtitle: "Economy Assortment",
    href: "/shop?category=family-pack",
    circleBg: "bg-[#A90C35]",
    arrowBg: "bg-[#F47A20]",
    textColor: "text-[#A90C35]",
    art: "gift" as const,
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

  return (
    <section className="w-full overflow-visible bg-[#fffaf0] py-4 sm:py-6 border-b border-[#F6C84C]/30 relative z-30" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#9E1830]/30 hidden sm:inline-block" />
          <span className="font-space text-[10px] sm:text-[11px] font-extrabold tracking-[.2em] text-[#9E1830] uppercase">
            EXPLORE SACRED CATEGORIES
          </span>
          <span className="h-px w-8 bg-[#9E1830]/30 hidden sm:inline-block" />
        </div>

        {/* 9 Category Circles Container */}
        <div className="hide-scrollbar flex snap-x snap-mandatory items-start gap-3 overflow-x-auto pb-3 pt-1 sm:justify-between sm:gap-4 sm:overflow-visible">
          {categories.map((item, idx) => {
            const hasSubs = Boolean(item.subCategories && item.subCategories.length > 0);
            const isDropdownOpen = activeDropdown === item.slug;

            return (
              <div
                key={item.slug || idx}
                className="relative group flex w-[86px] min-[380px]:w-[96px] shrink-0 snap-start flex-col items-center px-1 text-center sm:w-auto"
                onMouseEnter={() => hasSubs && setActiveDropdown(item.slug)}
                onMouseLeave={() => hasSubs && setActiveDropdown(null)}
              >
                {/* Main Action Link */}
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (hasSubs && window.innerWidth < 768 && activeDropdown !== item.slug) {
                      e.preventDefault();
                      setActiveDropdown(item.slug);
                    }
                  }}
                  className="flex flex-col items-center group-hover:scale-105 transition-transform duration-300"
                >
                  {/* Circle with SVG Illustration & Arrow Icon */}
                  <div className="relative mb-2 h-[64px] w-[64px] min-[360px]:h-[74px] min-[360px]:w-[74px] sm:h-[90px] sm:w-[90px]">
                    <div className={`h-full w-full overflow-hidden rounded-full ${item.circleBg} shadow-md ring-4 ring-white transition-all duration-300 group-hover:ring-[#F6C84C]`}>
                      <RitualArt kind={item.art} className="h-full w-full scale-[1.12] p-1.5" />
                    </div>

                    {/* Arrow Badge / Series Indicator */}
                    <div className={`absolute bottom-0 right-0 w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full ${item.arrowBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white`}>
                      {hasSubs ? <ChevronDown size={13} className="text-white" /> : <ArrowRight size={13} />}
                    </div>
                  </div>

                  {/* Category Title */}
                  <div className={`font-heading text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold leading-tight ${item.textColor} group-hover:underline max-w-[90px] sm:max-w-[100px] line-clamp-2`}>
                    {item.name}
                  </div>

                  {/* Subcategory Hint Badge for Agarbatti */}
                  {hasSubs && (
                    <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[#9E1830] text-[8px] sm:text-[9px] font-extrabold text-[#F6C84C] px-2 py-0.5 shadow-2xs border border-[#F6C84C]/60">
                      <span>3 Series</span>
                      <ChevronDown size={9} />
                    </span>
                  )}
                </Link>

                {/* Interactive Dropdown / Flyout Menu for Subcategories */}
                {hasSubs && isDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 w-[min(580px,calc(100vw-1.5rem))] pt-3 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="overflow-hidden rounded-3xl border border-[#E8D8B2] bg-white shadow-[0_20px_55px_rgba(36,44,35,0.2)]">
                      <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#FFF8E7] to-white px-5 py-4 sm:px-6">
                        <div>
                          <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[.16em] text-[#9E1830] uppercase">
                            <Sparkles size={14} className="text-[#F47A20]" /> Agarbatti collections
                          </p>
                          <p className="mt-1 text-xs text-[#68756D]">Choose a series, then pick a fragrance.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(null)}
                          aria-label="Close Agarbatti categories"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#60716A] transition hover:bg-[#F4E9D4] hover:text-[#9E1830]"
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
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFF4D6] text-[#9E1830]">
                                {sub.icon === "sparkles" ? <Sparkles size={16} /> : sub.icon === "package" ? <Package size={16} /> : <Zap size={16} />}
                              </span>
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/shop?category=${encodeURIComponent(sub.name)}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="text-xs font-extrabold text-[#173B3A] transition hover:text-[#9E1830]"
                                >
                                  {sub.name}
                                </Link>
                                <p className="mt-0.5 text-[10px] leading-relaxed text-[#75827B]">{sub.desc}</p>
                              </div>
                              <Link
                                href={`/shop?category=${encodeURIComponent(sub.name)}`}
                                onClick={() => setActiveDropdown(null)}
                                aria-label={`Browse ${sub.name}`}
                                className="mt-1 text-[#9E1830] transition hover:translate-x-0.5"
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
                                    className="rounded-full border border-[#E8D8B2] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#455A50] transition hover:border-[#9E1830] hover:bg-[#9E1830] hover:text-white"
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
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9E1830] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#7E1027]"
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

      </div>
    </section>
  );
}

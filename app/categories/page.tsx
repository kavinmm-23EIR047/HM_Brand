"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { categories, products } from "@/lib/products";

const categoryDetails: Record<string, { icon: string; desc: string; ritual: string }> = {
  Agarbatti: {
    icon: "🔥",
    desc: "Handcrafted traditional flora and masala incense sticks rolled with natural resins and essential oils.",
    ritual: "Ideal for morning prayers, meditation, and daily household sanctification.",
  },
  Camphor: {
    icon: "💎",
    desc: "100% pure crystalline Bhimseni camphor that burns cleanly without soot or black ash.",
    ritual: "Purifies negative energy and elevates aarti offerings before the deity.",
  },
  Sambrani: {
    icon: "🪔",
    desc: "Wild Paal Sambrani and pure benzoin packed into ready-to-ignite herbal cups.",
    ritual: "Ancient South Indian temple ritual to clear dampness and invoke divine grace.",
  },
  Loban: {
    icon: "🌿",
    desc: "Aromatic golden tree resins infused with Himalayan saffron and holy herbs.",
    ritual: "Burned during dusk to bring prosperity, calm, and protection.",
  },
  Dhoop: {
    icon: "🌸",
    desc: "Bamboo-free pure sandalwood and herbal cones for rich, lingering fragrance.",
    ritual: "Perfect for deep mantra chanting, pranayama, and sacred gatherings.",
  },
  "Premium Fragrances": {
    icon: "✨",
    desc: "Exotic and contemporary spiritual aromas fusing traditional herbs with rare botanicals.",
    ritual: "Welcoming guests and setting a tranquil atmosphere in modern living spaces.",
  },
  "Special Collections": {
    icon: "🏛️",
    desc: "Vedic formulations including Pancha Rudhra and Himalayan fossilized amber.",
    ritual: "Created specifically for festive homams, Gruhapravesam, and deep spiritual practice.",
  },
};

export default function CategoriesPage() {
  return (
    <InnerPage
      eyebrow="SACRED CATEGORIES"
      title="Find What Your Ritual Needs"
      subtitle="Discover authentic puja products, fragrant resins, and sacred essentials categorized by ritual and purpose."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((c) => {
            const slug = c.toLowerCase().replaceAll(" ", "-");
            const info = categoryDetails[c] || {
              icon: "🪔",
              desc: "Traditional HM Brand sacred essential.",
              ritual: "Authentic formulation for daily puja rituals.",
            };
            const count = products.filter((p) => p.category === c).length;

            return (
              <article
                key={c}
                className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 hover:border-[#6B4226] transition-all duration-300 flex flex-col justify-between hover:shadow-solid-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{info.icon}</span>
                    <span className="text-xs font-bold bg-[#F4D35E]/40 border border-[#C89B3C] text-[#6B4226] px-2.5 py-1 rounded-full">
                      {count} Products
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl text-[#6B4226] font-bold group-hover:text-[#E85D04] transition">
                    {c}
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans">
                    {info.desc}
                  </p>

                  <div className="mt-4 p-3 bg-[#F4D35E]/20 rounded-lg border border-[#C89B3C]/30 text-xs text-[#6B4226]">
                    <span className="font-bold text-[#E85D04]">Ritual Benefit: </span>
                    <span>{info.ritual}</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#C89B3C]/30 flex items-center justify-between">
                  <Link
                    href={`/category/${slug}`}
                    className="btn-saffron px-5 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5"
                  >
                    <span>Explore {c}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </InnerPage>
  );
}

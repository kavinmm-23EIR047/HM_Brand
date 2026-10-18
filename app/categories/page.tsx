"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { RitualArt } from "@/components/illustrations/RitualArt";
import { useStore } from "@/components/store";
import { categories as defaultCategories, categoryTree } from "@/lib/products";

const categoryDetails: Record<string, { art: any; description: string; bestFor: string }> = {
  "Agarbatti": {
    art: "incense",
    description: "Divine handcrafted traditional agarbattis, botanical blends, and classic aromas.",
    bestFor: "Daily prayer, meditation, and continuous soothing home fragrance."
  },
  "Camphor": {
    art: "camphor",
    description: "100% pure crystalline Bhimseni and refined camphor for sacred aarti and purification.",
    bestFor: "Aarti thalis, havan, and dispersing negative energies."
  },
  "Dhoop Stick / Bambooless Stick": {
    art: "loban",
    description: "Pure herbal bambooless dhoop sticks crafted without bamboo core or charcoal.",
    bestFor: "Clean burning, quiet reflection, and mindful pranayama."
  },
  "Dhoop Stick / Bamboo-less Stick": {
    art: "loban",
    description: "Pure herbal bambooless dhoop sticks crafted without bamboo core or charcoal.",
    bestFor: "Clean burning, quiet reflection, and mindful pranayama."
  },
  "Incense Cone": {
    art: "loban",
    description: "Natural charcoal-free aromatic dhoop cones and divine herbal cones.",
    bestFor: "Intense bursts of sacred smoke, altar rituals, and quick purification."
  },
  "Incense Cones": {
    art: "loban",
    description: "Natural charcoal-free aromatic dhoop cones and divine herbal cones.",
    bestFor: "Intense bursts of sacred smoke, altar rituals, and quick purification."
  },
  "Chandan Cups": {
    art: "sandalwood",
    description: "Pure sandalwood-infused resin cups that emit rich, sacred temple aroma.",
    bestFor: "Deep meditation, peaceful evenings, and holy rituals."
  },
  "Havan Cups": {
    art: "sandalwood",
    description: "Pure sandalwood-infused resin cups that emit rich, sacred temple aroma.",
    bestFor: "Deep meditation, peaceful evenings, and holy rituals."
  },
  "Sambhrani Powder": {
    art: "sambrani",
    description: "Traditional pure benzoin resin powder for sacred havan coals and incense burners.",
    bestFor: "Home purification, Friday dusk rituals, and positive vibrations."
  },
  "Sambrani Powder": {
    art: "sambrani",
    description: "Traditional pure benzoin resin powder for sacred havan coals and incense burners.",
    bestFor: "Home purification, Friday dusk rituals, and positive vibrations."
  },
  "Pooja Essentials": {
    art: "diya",
    description: "Complete traditional worship supplies, sacred wicks, and temple essentials.",
    bestFor: "Daily nitya puja, festive preparations, and mandir needs."
  },
  "Gift Sets": {
    art: "gift",
    description: "Luxury festive boxes and beautifully curated fragrance hampers.",
    bestFor: "Weddings, housewarmings, Diwali gifting, and auspicious occasions."
  },
  "Family Pack": {
    art: "gift",
    description: "Economy mega value packs featuring assorted divine fragrance varieties.",
    bestFor: "Large households, continuous daily rituals, and festive seasons."
  },
};

export default function CategoriesPage() {
  const { dbProducts, dbCategories } = useStore();

  const allProducts = dbProducts || [];
  const categoriesList = dbCategories && dbCategories.length > 0
    ? dbCategories.filter((c: any) => !c.parentId).map((c) => c.name)
    : defaultCategories;

  return (
    <InnerPage
      eyebrow="EXPLORE THE RANGE"
      title="Find the right fragrance for your ritual"
      subtitle="Browse by product type and purpose. Each category includes a short guide to help you choose what fits your home and routine."
    >
      <div className="mx-auto grid max-w-[1368px] grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {categoriesList.map((category) => {
          const info = categoryDetails[category] || {
            art: "incense",
            description: "Handcrafted pure fragrance crafted with traditional herbs and oils.",
            bestFor: "Daily home prayer and mindful rituals."
          };
          const count = allProducts.filter((p) => {
            const pCat = (p.category || "").toLowerCase();
            const cCat = category.toLowerCase();
            return Boolean(pCat) && (pCat.includes(cCat) || cCat.includes(pCat));
          }).length;
          const branches = categoryTree.find((entry) => entry.name === category)?.children;

          return (
            <article key={category} className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6 border border-[#F6C84C]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#FFF4D6] sm:h-24 sm:w-24">
                    <RitualArt kind={info.art} className="h-full w-full p-1" />
                  </div>
                  <span className="rounded-full bg-[#FFF4D6] border border-[#F6C84C]/60 px-3 py-1 text-[10px] font-bold text-[#9E1830]">{count} items</span>
                </div>
                <h2 className="mt-4 text-xl font-extrabold tracking-[-.025em] text-[#173b3a] transition group-hover:text-[#a90c35] sm:text-2xl">{category}</h2>
                <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-[#52625a]">{info.description}</p>

                {branches && (
                  <div className="mt-3 rounded-xl bg-[#FFF8E7] p-3 border border-[#F6C84C]/40">
                    <p className="text-[10px] font-bold text-[#9E1830] uppercase tracking-wider mb-1.5">Category groups:</p>
                    <CategoryBranches branches={branches} />
                  </div>
                )}

                <div className="mt-4 rounded-xl bg-[#f8f2e5] px-4 py-3 text-xs leading-relaxed text-[#43574d]">
                  <span className="font-extrabold text-[#a90c35]">Good for: </span>{info.bestFor}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#FFF4D6]">
                <Link href={`/shop?category=${encodeURIComponent(category)}`} className="inline-flex items-center gap-2 rounded-full bg-[#F47A20] hover:bg-[#9E1830] px-5 py-2.5 text-xs font-extrabold text-white transition">
                  Browse {category} <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </InnerPage>
  );
}

function CategoryBranches({ branches }: { branches: typeof categoryTree }) {
  return (
    <div className="space-y-2">
      {branches.map((branch) => (
        <div key={branch.name}>
          <Link
            href={`/shop?category=${encodeURIComponent(branch.name)}`}
            className="inline-flex text-[11px] font-bold text-[#183c31] hover:text-[#9E1830]"
          >
            {branch.name}
          </Link>
          {branch.children && (
            <div className="mt-1 flex flex-wrap gap-1.5 border-l border-[#F6C84C]/70 pl-2">
              {branch.children.map((child) => (
                <Link
                  key={child.name}
                  href={`/shop?category=${encodeURIComponent(child.name)}`}
                  className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-[#F6C84C]/60 text-[#52625a] hover:bg-[#9E1830] hover:text-white transition"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

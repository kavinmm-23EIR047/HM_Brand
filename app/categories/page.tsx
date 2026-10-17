"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { RitualArt } from "@/components/illustrations/RitualArt";
import { categories } from "@/lib/products";
import { useStore } from "@/components/store";

const categoryDetails: Record<string, { art: string; description: string; bestFor: string }> = {
  Agarbatti: { art: "incense", description: "Handcrafted masala and floral incense, blended with natural resins and botanical notes.", bestFor: "Daily prayer, meditation and welcoming a fresh fragrance into your home." },
  Camphor: { art: "camphor", description: "Crystalline Bhimseni camphor for aarti and simple home rituals.", bestFor: "Puja thalis, evening aarti and a crisp, clean aroma." },
  "Dhoop Stick / Bamboo-less Stick": { art: "sandalwood", description: "Bamboo-free pure sandalwood and herbal sticks crafted for uninterrupted meditation.", bestFor: "Deep meditation, pranayama and evening quiet." },
  "Incense Cones": { art: "sandalwood", description: "Fragrant incense cones with rich aromas of chandan and herbs.", bestFor: "Mindful moments and prayer rooms." },
  "Havan Cups": { art: "sambrani", description: "Mess-free herbal havan cups recreating ancient sacred sanctum atmosphere.", bestFor: "Homas, daily purification and festive occasions." },
  "Sambrani Powder": { art: "loban", description: "Pure resin powder and herbal blends with rich, earthy fragrance notes.", bestFor: "Dusk rituals and blessing the home atmosphere." },
  "Pooja Essentials": { art: "diya", description: "Essential sacred items thoughtfully formulated for everyday prayer rituals.", bestFor: "Daily puja thali needs and sacred ceremonies." },
  "Gift Sets": { art: "gift", description: "Thoughtfully grouped fragrance essentials for festivals and meaningful occasions.", bestFor: "Celebrations, housewarmings and thoughtful gifting." },
  "Family Pack": { art: "incense", description: "10-in-1 aroma family pack with 10 divine fragrances for the whole family.", bestFor: "Variety lovers and complete household wellness." },
  Sambrani: { art: "sambrani", description: "Traditional sambrani cups with the warm, resinous aroma of benzoin.", bestFor: "Dusk rituals and creating a calm, fragrant atmosphere." },
  Loban: { art: "loban", description: "Aromatic tree resins and dhoop blends with rich, earthy fragrance notes.", bestFor: "Evening rituals, quiet reflection and special gatherings." },
  Dhoop: { art: "sandalwood", description: "Sandalwood and herbal dhoop with a warm fragrance for mindful moments.", bestFor: "Meditation, pranayama and slower evenings at home." },
};

export default function CategoriesPage() {
  const { dbProducts, dbCategories } = useStore();

  const displayCategories = dbCategories && dbCategories.length > 0
    ? dbCategories.filter((c: any) => !c.parentId).map((c) => c.name)
    : categories;

  const allProducts = dbProducts || [];

  const getProductCount = (category: string) => {
    const catLower = category.toLowerCase().trim();
    return allProducts.filter((p) => {
      const pCat = (p.category || "").toLowerCase().trim();
      return pCat === catLower || pCat.includes(catLower) || catLower.includes(pCat);
    }).length;
  };

  return (
    <InnerPage
      eyebrow="EXPLORE THE RANGE"
      title="Find the right fragrance for your ritual"
      subtitle="Browse by product type and purpose. Each category includes a short guide to help you choose what fits your home and routine."
    >
      <div className="mx-auto grid max-w-[1368px] grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {displayCategories.map((category) => {
          const info = categoryDetails[category] || {
            art: "incense",
            description: "Handcrafted natural formulation with botanical resins and essential oils.",
            bestFor: "Daily worship and uplifting sacred spaces.",
          };
          const count = getProductCount(category);
          return (
            <article key={category} className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e5efdb] sm:h-24 sm:w-24">
                  <RitualArt kind={info.art as any} className="h-full w-full p-1" />
                </div>
                <span className="rounded-full bg-[#e5efdb] px-3 py-1 text-[10px] font-bold text-[#286b45]">{count} items</span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold tracking-[-.025em] text-[#173b3a] transition group-hover:text-[#a90c35] sm:text-2xl">{category}</h2>
              <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-[#52625a]">{info.description}</p>
              <div className="mt-4 rounded-xl bg-[#f8f2e5] px-4 py-3 text-xs leading-relaxed text-[#43574d]">
                <span className="font-extrabold text-[#a90c35]">Good for </span>{info.bestFor}
              </div>
              <Link href={`/shop?category=${encodeURIComponent(category)}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#286b45] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#a90c35]">
                Browse {category} <ArrowRight size={14} />
              </Link>
            </article>
          );
        })}
      </div>
    </InnerPage>
  );
}

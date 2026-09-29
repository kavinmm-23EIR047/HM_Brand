"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Sun, Flame, Moon, Gift } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { collectionsList, products } from "@/lib/products";

const collectionVisuals: Record<string, { image: string; icon: any; aura: string; desc: string }> = {
  "morning-puja": {
    image: "/images/hm_wellness_incense_scene.png",
    icon: Sun,
    aura: "from-[#FFF4D6] to-[#FFF0D7]",
    desc: "Start your morning with fresh botanical aromas that clear mental fog, invite positive vibrational energy, and fill your prayer space with divine grace.",
  },
  "evening-dhyana": {
    image: "/images/hm_mindful_ritual_scene.png",
    icon: Moon,
    aura: "from-[#F5E9F8] to-[#FFF8E7]",
    desc: "Calm your senses after a long day. Deep sandalwood, pure loban, and gentle florals designed for tranquil meditation, quiet reading, and restful sleep.",
  },
  "temple-heritage": {
    image: "/images/hm_puja_products_scene.png",
    icon: Flame,
    aura: "from-[#FFF4D6] to-[#FCEECC]",
    desc: "Authentic South Indian temple fragrances. Rich cup sambrani, pure Bhimseni camphor, and sacred flora agarbattis handcrafted according to ancient tradition.",
  },
  "festive-gifting": {
    image: "/images/special_offer_gift_transparent.png",
    icon: Gift,
    aura: "from-[#FFE8E8] to-[#FFF8E7]",
    desc: "Thoughtfully curated festive gift boxes and luxury bundles to share blessings, health, and aromatic serenity with loved ones on special occasions.",
  },
};

export default function CollectionsPage() {
  return (
    <InnerPage
      eyebrow="SACRED RITUAL COLLECTIONS"
      title="Curated Fragrances for Every Mindful Moment"
      subtitle="Whether you are beginning your morning with prayer, unwinding in evening meditation, or preparing for festive poojas, explore our handcrafted collections."
    >
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* Quick Jump Navigation Pill Strip */}
        <nav aria-label="Browse collections" className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {collectionsList.map((collection) => (
            <a
              key={collection.id}
              href={`#${collection.id}`}
              className="shrink-0 rounded-full border border-[#F6C84C]/60 bg-white px-4 py-2 text-xs font-bold text-[#173B3A] shadow-xs transition hover:bg-[#9E1830] hover:text-white hover:border-[#9E1830]"
            >
              ✦ {collection.title}
            </a>
          ))}
        </nav>

        {/* Collections Sections */}
        {collectionsList.map((collection, index) => {
          const collectionProducts = products.filter((product) =>
            collection.items.includes(product.slug)
          );
          const meta = collectionVisuals[collection.id] || {
            image: "/images/hm_wellness_incense_scene.png",
            icon: Sparkles,
            aura: "from-[#FFF4D6] to-[#FFF8E7]",
            desc: collection.description,
          };
          const IconComponent = meta.icon;

          return (
            <section
              key={collection.id}
              id={collection.id}
              className="scroll-mt-28 overflow-hidden rounded-3xl border-2 border-[#F6C84C]/50 bg-white p-5 sm:p-8 lg:p-10 shadow-md space-y-8"
            >
              {/* Collection Header Banner */}
              <div className={`rounded-2xl bg-gradient-to-r ${meta.aura} p-6 sm:p-8 border border-[#F6C84C]/40 flex flex-col lg:flex-row items-center justify-between gap-6`}>
                
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-[#9E1830] text-[#F6C84C] flex items-center justify-center shadow-xs">
                      <IconComponent size={16} />
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9E1830]">
                      {collection.subtitle}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
                    {collection.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-sm text-[#292524]/85 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                {/* Collection Illustration Asset */}
                <div className="relative w-40 h-32 sm:w-52 sm:h-40 shrink-0 flex items-center justify-center">
                  <Image
                    src={meta.image}
                    alt={collection.title}
                    fill
                    unoptimized
                    className="object-contain drop-shadow-md"
                  />
                </div>

              </div>

              {/* Product Grid */}
              {collectionProducts.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {collectionProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-[#FFF8E7] p-6 text-center text-sm text-[#292524]/80 border border-[#F6C84C]/30">
                  <p>Explore all handcrafted items to curate your personal ritual collection.</p>
                  <Link href="/shop" className="inline-flex items-center gap-1.5 font-bold text-[#9E1830] mt-2 hover:underline">
                    <span>Browse the Complete Shop</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </section>
          );
        })}

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-8 sm:p-12 text-white border-2 border-[#F6C84C]/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-script text-2xl sm:text-3xl text-[#F6C84C]">
              Need a Custom Ritual Set?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
              Curate Your Own Daily Pooja &amp; Meditation Bundle
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Mix and match agarbattis, dhoop cones, and pure camphor for your sacred rituals.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-[#F47A20] hover:text-white text-[#173B3A] px-7 py-3.5 font-bold text-xs sm:text-sm transition shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Explore All Products</span>
            <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Sun, Flame, Moon, Gift } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store";
import { collectionsList, mapDbProductToProduct } from "@/lib/products";

const collectionVisuals: Record<string, { icon: any; aura: string }> = {
  "morning-puja": { icon: Sun, aura: "from-[#FFF4D6] to-[#FFF0D7]" },
  "evening-dhyana": { icon: Moon, aura: "from-[#F5E9F8] to-[#FFF8E7]" },
  "temple-heritage": { icon: Flame, aura: "from-[#FFF4D6] to-[#FCEECC]" },
  "festive-gifting": { icon: Gift, aura: "from-[#FFE8E8] to-[#FFF8E7]" },
};

export default function CollectionsPage() {
  const { dbProducts } = useStore();
  const allProducts = dbProducts || [];
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    fetch(`${api}/collections`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data) && j.data.length > 0) {
          setCollections(j.data);
        } else {
          setCollections(collectionsList);
        }
      })
      .catch(() => setCollections(collectionsList));
  }, []);

  const activeCollections = collections.length > 0 ? collections : collectionsList;

  return (
    <InnerPage
      eyebrow="SACRED RITUAL COLLECTIONS"
      title="Curated Fragrances for Every Mindful Moment"
      subtitle="Whether you are beginning your morning with prayer, unwinding in evening meditation, or preparing for festive poojas, explore our handcrafted collections."
    >
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* Quick Jump Navigation Pill Strip */}
        <nav aria-label="Browse collections" className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {activeCollections.map((collection) => (
            <a
              key={collection.id}
              href={`#${collection.slug || collection.id}`}
              className="shrink-0 rounded-full border border-[#F6C84C]/60 bg-white px-4 py-2 text-xs font-bold text-[#173B3A] shadow-xs transition hover:bg-[#9E1830] hover:text-white hover:border-[#9E1830]"
            >
              ✦ {collection.title}
            </a>
          ))}
        </nav>

        {/* Collections Sections */}
        {activeCollections.map((collection) => {
          let collectionProducts: any[] = [];
          if (Array.isArray(collection.products) && collection.products.length > 0) {
            collectionProducts = collection.products.map((link: any) => {
              const product = allProducts.find((entry) => entry.id === link.productId || entry.slug === link.product?.slug);
              return product || (link.product ? mapDbProductToProduct(link.product) : null);
            }).filter(Boolean);
          } else if (Array.isArray(collection.items)) {
            collectionProducts = allProducts.filter((product) =>
              collection.items.includes(product.slug)
            );
          }

          const slug = collection.slug || collection.id;
          const meta = collectionVisuals[slug] || {
            icon: Sparkles,
            aura: "from-[#FFF4D6] to-[#FFF8E7]",
          };
          const IconComponent = meta.icon;

          return (
            <section
              key={collection.id}
              id={slug}
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
                      {collection.subtitle || "CURATED COLLECTION"}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
                    {collection.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-sm text-[#292524]/85 leading-relaxed">
                    {collection.description || "Explore products curated for your daily rituals."}
                  </p>
                </div>

                {/* Collection Illustration Asset */}
                <div className="relative w-40 h-32 sm:w-52 sm:h-40 shrink-0 flex items-center justify-center">
                  <Image
                    src={collection.bannerUrl || "/images/hm_wellness_incense_scene.png"}
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
                  {collectionProducts.map((product: any) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-[#FFF8E7] p-6 text-center text-sm text-[#292524]/80 border border-[#F6C84C]/30">
                  <p>This collection is being curated. Check back soon for products.</p>
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
          <div className="space-y-2">
            <span className="font-space text-xs font-bold tracking-[.2em] text-[#F6C84C] uppercase">
              EXPERIENCE PURITY EVERY DAY
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold">
              Need Help Choosing the Right Fragrance?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl">
              From fresh morning floral sticks to deep meditative dhoop and pure Bhimseni camphor, our experts are here to guide your sacred daily rituals.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#F6C84C] text-[#173B3A] font-extrabold px-6 py-3 text-xs sm:text-sm shadow-md transition hover:bg-white"
          >
            <span>Explore All Fragrances</span>
            <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

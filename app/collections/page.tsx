"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { collectionsList, products } from "@/lib/products";

export default function CollectionsPage() {
  return (
    <InnerPage
      eyebrow="CURATED RITUALS"
      title="Divine Ritual Collections"
      subtitle="Themed fragrance ensembles curated to transform everyday rituals into deeply meaningful spiritual experiences."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {collectionsList.map((col, idx) => {
          const colProducts = products.filter((p) => col.items.includes(p.slug));

          return (
            <section
              key={col.id}
              className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C]/40 p-8 sm:p-10 shadow-solid-sm overflow-hidden"
            >
              {/* Header Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-[#C89B3C]/30">
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B23A48] uppercase tracking-widest">
                    <Sparkles size={14} />
                    <span>{col.subtitle}</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#292524]/75 max-w-2xl leading-relaxed font-sans">
                    {col.description}
                  </p>
                </div>

                <div className="lg:col-span-4 lg:text-right">
                  <Link
                    href="/shop"
                    className="btn-saffron px-6 py-3 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2"
                  >
                    <span>Shop Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Product Previews in this Collection */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {colProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </InnerPage>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { festivalsList, products } from "@/lib/products";

export default function FestivalsPage() {
  return (
    <InnerPage
      eyebrow="FESTIVALS & SACRED OCCASIONS"
      title="Celebrate Every Auspicious Moment"
      subtitle="From the grand illumination of Diwali to everyday morning prayer, discover thoughtfully curated sacred essentials for India's cherished traditions."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivalsList.map((f) => (
            <article
              key={f.id}
              className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 hover:border-[#6B4226] transition-all duration-300 flex flex-col justify-between hover:shadow-solid-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#E85D04] text-[#FFF8E7] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {f.dateText}
                  </span>
                  <span className="text-xl">🪔</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl text-[#6B4226] font-bold group-hover:text-[#E85D04] transition">
                  {f.name}
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans">
                  {f.description}
                </p>

                <div className="mt-5 p-3.5 bg-[#F4D35E]/20 rounded-lg border border-[#C89B3C]/40 text-xs text-[#6B4226]">
                  <span className="font-bold text-[#B23A48]">Ritual Note: </span>
                  <span>{f.ritualNote}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#C89B3C]/30 flex items-center justify-between">
                <span className="text-xs font-bold text-[#588157]">
                  ✦ {f.recommendedCategory}
                </span>
                <Link
                  href={`/category/${f.recommendedCategory.toLowerCase()}`}
                  className="btn-saffron px-4 py-2 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5"
                >
                  <span>Shop Essentials</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Highlight Festival Essentials Grid */}
        <section className="bg-[#F4D35E]/15 rounded-3xl border-2 border-[#6B4226] p-8 sm:p-12 shadow-solid-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#B23A48] uppercase block">
              FESTIVAL ESSENTIALS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] mt-2">
              Most Loved Festive Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#292524]/75 mt-2 font-sans">
              Hand-picked bestsellers ready for your family ceremonies and celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.featured)
              .slice(0, 3)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </section>
      </div>
    </InnerPage>
  );
}

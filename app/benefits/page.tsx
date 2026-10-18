"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
export default function BenefitsPage() {
  const [content, setContent] = useState<any>({});
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    fetch(`${api}/content/pages/benefits`).then((r) => r.json()).then((j) => { if (j.success && j.data) setContent(j.data); }).catch(() => {});
  }, []);
  const comparisonData: any[] = Array.isArray(content.comparison) ? content.comparison : [];
  const ingredients: any[] = Array.isArray(content.ingredients) ? content.ingredients : [];
  return (
    <InnerPage
      eyebrow={content.eyebrow || "HOLISTIC PURITY & AYURVEDA"}
      title={content.title || "The Sacred Natural Benefits of Pure Botanical Fragrance"}
      subtitle={content.subtitle || "Discover why botanical incense and sacred aromatics elevate daily rituals."}
    >
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* HERO SECTION WITH AYURVEDIC BOTANICAL ART */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-10 lg:p-12 border-2 border-[#F6C84C]/60 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#287541]/30 bg-[#287541]/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#287541] uppercase">
                <Sparkles size={12} className="text-[#F47A20]" />
                <span>{content.heroBadge || "100% CHARCOAL-FREE BOTANICAL WELLNESS"}</span>
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173B3A] leading-tight">
                {content.heroTitle || "Breathe clean, pure, and spiritually uplifting fragrance."}
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#292524]/85 leading-relaxed">
                {content.heroDescription || "In traditional Ayurveda, fragrance is a sacred part of mindful living. Pure resins, camphor, and herbal incense bring a gentle aroma to your space."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#F6C84C]/40 shadow-xs">
                  <span className="text-xs font-bold text-[#9E1830] block">0% Charcoal</span>
                  <span className="text-xs text-[#292524]/75 mt-0.5 block">Zero toxic black smoke or indoor soot</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#F6C84C]/40 shadow-xs">
                  <span className="text-xs font-bold text-[#287541] block">100% Botanicals</span>
                  <span className="text-xs text-[#292524]/75 mt-0.5 block">Natural resins, flower powders &amp; herbs</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[380px] aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-[#F6C84C]/60 bg-white/70 p-4 shadow-md flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/hm_ayurvedic_journal_scene.png"
                    alt="Ayurvedic Botanical Ingredients and Urli Lamp"
                    fill
                    unoptimized
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISON TABLE: HM BRAND VS COMMERCIAL CHARCOAL INCENSE */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E1830]">
              THE PURITY DIFFERENCE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              {content.comparisonTitle || "HM Agarbattis vs. Ordinary Market Incense"}
            </h2>
            <p className="text-sm text-[#292524]/80">
              {content.comparisonDescription || "See why switching to pure botanical incense transforms your daily ritual."}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-[#F6C84C]/50 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F6C84C]/30 bg-[#FFF4D6]">
                  <th className="p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider text-[#173B3A]">Feature</th>
                  <th className="p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider text-[#9E1830] bg-[#FFF0D7]/80">
                    ✦ HM Agarbattis (Pure Botanicals)
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Ordinary Charcoal Incense
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6C84C]/20 text-xs sm:text-sm">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-[#FFF8E7]/50 transition">
                    <td className="p-4 sm:p-5 font-bold text-[#173B3A]">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#287541] bg-[#FFF0D7]/40 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#287541] shrink-0 mt-0.5" />
                      <span>{row.hm}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-[#6B7280]">
                      <div className="flex items-start gap-2">
                        <XCircle size={16} className="text-[#DC2626] shrink-0 mt-0.5" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SACRED BOTANICAL INGREDIENTS */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#F47A20]">
              PURE HERBAL HERITAGE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              {content.ingredientsTitle || "Sacred Ingredients & Their Benefits"}
            </h2>
            <p className="text-sm text-[#292524]/80">
              {content.ingredientsDescription || "Each natural resin and herb is selected for its uplifting aromatherapeutic energy."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ingredients.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-white p-6 border border-[#F6C84C]/50 shadow-sm hover:border-[#9E1830] transition hover:shadow-md space-y-3"
              >
                <div className="text-3xl">{item.icon}</div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#9E1830] bg-[#FFF4D6] px-2.5 py-0.5 rounded-full border border-[#F6C84C]/40">
                  {item.tag}
                </span>
                <h3 className="font-heading text-lg font-extrabold text-[#173B3A]">
                  {item.name}
                </h3>
                <p className="text-xs text-[#292524]/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA TO SHOP */}
        <section className="rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-8 sm:p-12 text-white border-2 border-[#F6C84C]/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-script text-2xl sm:text-3xl text-[#F6C84C]">
              {content.ctaEyebrow || "Experience Natural Purity"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
              {content.ctaTitle || "Transform Your Home With Clean Temple Fragrances"}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {content.ctaDescription || "Shop natural agarbattis, camphor, and sambrani crafted in Coimbatore."}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-[#F47A20] hover:text-white text-[#173B3A] px-7 py-3.5 font-bold text-xs sm:text-sm transition shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Shop Pure Products</span>
            <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

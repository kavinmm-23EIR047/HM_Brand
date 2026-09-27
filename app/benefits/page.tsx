"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, FlaskConical, Award, Sparkles, CheckCircle2, XCircle, Heart, Wind, Sun, Moon } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MandalaMotif } from "@/components/illustrations";

const comparisonData = [
  {
    feature: "Base Material",
    hm: "Pure flower petals, herbal powders & natural tree resins",
    others: "Cheap black charcoal powder & coal dust",
  },
  {
    feature: "Fragrance Source",
    hm: "100% therapeutic essential oils & botanical extracts",
    others: "Synthetic chemicals, phthalates & artificial musk",
  },
  {
    feature: "Smoke Quality",
    hm: "Light, gentle white fragrant smoke (clean indoor air)",
    others: "Heavy, dark soot that stains walls & irritates lungs",
  },
  {
    feature: "Respiratory Safety",
    hm: "Safe for kids, elders, and pets (zero throat burn)",
    others: "Causes headaches, coughing, and indoor air pollution",
  },
  {
    feature: "Spiritual Vibration",
    hm: "Authentic Agamic sacred formulation for temple peace",
    others: "Commercial mass-produced synthetic perfume",
  },
];

const ingredients = [
  {
    name: "Bhimseni Camphor",
    tag: "PURITY & CLARITY",
    desc: "100% pure edible-grade camphor from tree bark. Clears mental fog, dispels negative energy, and purifies indoor atmosphere.",
    icon: "💎",
  },
  {
    name: "Sacred Loban & Sambrani",
    tag: "POSITIVE AURA",
    desc: "Ancient tree resin with proven antimicrobial properties. Creates an authentic South Indian temple ambiance and calms anxiety.",
    icon: "🪵",
  },
  {
    name: "Mysore Sandalwood",
    tag: "MEDITATION & PEACE",
    desc: "Soothing woody aroma that activates the third-eye chakra and promotes deep meditative stillness and sound sleep.",
    icon: "🌿",
  },
  {
    name: "Fresh Temple Flowers",
    tag: "DEVOTION & JOY",
    desc: "Naturally harvested rose, jasmine, and marigold petals that uplift mood and evoke divine blessings in your home.",
    icon: "🌸",
  },
];

export default function BenefitsPage() {
  return (
    <InnerPage
      eyebrow="HOLISTIC PURITY & AYURVEDA"
      title="The Sacred Natural Benefits of Pure Botanical Fragrance"
      subtitle="Discover why burning 100% charcoal-free agarbattis, pure Bhimseni camphor, and sacred sambrani elevates your health, mental peace, and spiritual aura."
    >
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* HERO SECTION WITH AYURVEDIC BOTANICAL ART */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-10 lg:p-12 border-2 border-[#F6C84C]/60 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#287541]/30 bg-[#287541]/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#287541] uppercase">
                <Sparkles size={12} className="text-[#F47A20]" />
                <span>100% CHARCOAL-FREE BOTANICAL WELLNESS</span>
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173B3A] leading-tight">
                Breathe clean, pure, and spiritually uplifting fragrance.
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#292524]/85 leading-relaxed">
                In traditional Ayurveda, fragrance is not merely an aroma—it is a sacred healing medicine for the mind, body, and soul. Burning pure resins, camphor, and herbal incense purifies the subtle energy of your living space while protecting your respiratory health.
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
              HM Agarbattis vs. Ordinary Market Incense
            </h2>
            <p className="text-sm text-[#292524]/80">
              See why switching to pure botanical incense transforms your daily ritual.
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
              Sacred Ingredients &amp; Their Benefits
            </h2>
            <p className="text-sm text-[#292524]/80">
              Each natural resin and herb is selected for its uplifting aromatherapeutic energy.
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
              Experience Natural Purity
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
              Transform Your Home With Clean Temple Fragrances
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Shop 100% natural agarbattis, Bhimseni camphor, and cup sambrani crafted in Coimbatore.
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

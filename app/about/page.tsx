"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, ShieldCheck, Leaf, Flower2 } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotNamaste, MascotMeditate, MascotAgarbatti } from "@/components/mascot-art";
import { AuspiciousSeal, TempleGopuram } from "@/components/divine-motifs";

export default function AboutPage() {
  return (
    <InnerPage
      eyebrow="OUR COIMBATORE STORY"
      title="Made for Moments That Matter"
      subtitle="We believe the smallest rituals can make everyday life feel deeply grounded, fragrant, and sacred."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Story Intro */}
        <section className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-8 sm:p-12 shadow-solid-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold tracking-[0.2em] text-[#B23A48] uppercase block">
              HERITAGE & ROOTS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#6B4226] font-bold leading-tight">
              Crafting Divine Fragrances in the Heart of Tamil Nadu
            </h2>
            <p className="text-sm sm:text-base text-[#292524]/80 leading-relaxed font-sans">
              Headquartered in Peelamedu, Coimbatore, <strong>HM Agarbattis</strong> was born from a timeless aspiration: to bring the authentic, peaceful fragrance of traditional South Indian temple sanctums into modern Indian households.
            </p>
            <p className="text-sm sm:text-base text-[#292524]/80 leading-relaxed font-sans">
              From our flagship <em>HM Super Series</em> to raw <em>Bhimseni Camphor</em> and <em>Paal Cup Sambrani</em>, every formulation is blended with natural flower extracts, sacred wood powders, and wild tree resins.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <AuspiciousSeal />
              <div className="text-xs text-[#6B4226] font-semibold space-y-1">
                <p className="text-[#E85D04] font-bold text-sm">Coimbatore Crafted</p>
                <p>100% Traditional Masala Method</p>
                <p>Cruelty-Free & Natural Botanicals</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-[#F4D35E]/20 p-8 rounded-3xl border-2 border-[#6B4226] flex flex-col items-center">
              <MascotNamaste size={220} />
              <span className="font-display text-lg font-bold text-[#6B4226] mt-4">
                HM Spiritual Companion
              </span>
            </div>
          </div>
        </section>

        {/* Timeline & Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#588157]/20 text-[#588157] flex items-center justify-center mb-4">
                <Leaf size={24} />
              </div>
              <span className="text-xs font-bold text-[#588157] uppercase tracking-wider block">Pillar 01</span>
              <h3 className="font-display text-2xl text-[#6B4226] font-bold mt-1">
                Pure Botanical Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-[#292524]/75 mt-3 leading-relaxed font-sans">
                We strictly reject synthetic dipping solvents and toxic black charcoal. Our incense sticks and cones are rolled using pure halmaddi, honey, dried herbs, and sacred tree gums.
              </p>
            </div>
          </div>

          <div className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E85D04]/20 text-[#E85D04] flex items-center justify-center mb-4">
                <Sparkles size={24} />
              </div>
              <span className="text-xs font-bold text-[#E85D04] uppercase tracking-wider block">Pillar 02</span>
              <h3 className="font-display text-2xl text-[#6B4226] font-bold mt-1">
                Authentic Temple Ambience
              </h3>
              <p className="text-xs sm:text-sm text-[#292524]/75 mt-3 leading-relaxed font-sans">
                Our formulas are designed to recreate the serene sanctum of ancient temples. A gentle flame, an aromatic trail, and immediate inner tranquility.
              </p>
            </div>
          </div>

          <div className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B23A48]/20 text-[#B23A48] flex items-center justify-center mb-4">
                <Heart size={24} />
              </div>
              <span className="text-xs font-bold text-[#B23A48] uppercase tracking-wider block">Pillar 03</span>
              <h3 className="font-display text-2xl text-[#6B4226] font-bold mt-1">
                Devotion in Every Package
              </h3>
              <p className="text-xs sm:text-sm text-[#292524]/75 mt-3 leading-relaxed font-sans">
                Every box is packed with utmost care and dispatched fresh from Coimbatore. We ensure that our spiritual products reach your mandir in pristine condition.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[#F4D35E]/20 p-10 rounded-3xl border-2 border-[#6B4226] text-center max-w-3xl mx-auto shadow-solid-sm space-y-4">
          <h3 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold">
            Experience the Fragrance of Devotion
          </h3>
          <p className="text-xs sm:text-sm text-[#292524]/75 max-w-xl mx-auto font-sans leading-relaxed">
            Invite auspicious positivity and pure aromas into your home today.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="btn-saffron px-8 py-3.5 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore The Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </InnerPage>
  );
}

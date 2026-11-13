import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { IndiaTricolorMarkSvg } from "@/components/sacred-icons";

export function BentoPromos() {
  return (
    <section className="bg-brand-surface-alt py-6 sm:py-11">
      <div className="page-container">
        <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-12">

          {/* MAIN FLAGSHIP CARD: 10-IN-1 AROMA FAMILY PACK */}
          <article className="relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-primary text-white border border-brand-primary shadow-sm lg:col-span-7">

            <div className="relative z-10 flex w-full flex-col justify-between p-4 sm:p-7 h-full">

              {/* TOP ROW: Text Left, Image Right */}
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-7 flex-1">

                {/* LEFT SIDE CONTENT */}
                <div className="flex-1 space-y-2.5 sm:space-y-3 w-full">
                  {/* Clean Top Eyebrow Badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-2.5 py-0.5 text-[9px] sm:text-[11px] font-bold tracking-wider text-brand-ink shadow-xs uppercase whitespace-nowrap">
                    <IndiaTricolorMarkSvg className="h-3 w-4 sm:h-3.5 sm:w-5" />
                    <span>1ST TIME IN INDIA</span>
                  </div>

                  {/* Main Clear Title */}
                  <div>
                    <h2 className="text-lg sm:text-2xl lg:text-ui-26 font-bold leading-snug tracking-wide text-white font-brand uppercase">
                      10 in 1 Aroma Family Pack
                    </h2>
                    <p className="mt-0.5 font-tagline text-xs sm:text-sm text-brand-accent-soft font-semibold tracking-wide">
                      10 Divine Fragrances in One Box
                    </p>
                  </div>

                  {/* Concise, Feel-Good Copy */}
                  <p className="font-sans text-xs sm:text-sm text-white/90 font-normal leading-snug sm:leading-relaxed max-w-md">
                    Pure botanical blends (Kewda, Loban, Rose, Sandal &amp; more) &mdash; 100% charcoal-free.
                  </p>

                  {/* Price & CTA Row */}
                  <div className="pt-1.5 flex flex-wrap items-center gap-3">
                    <div className="flex items-baseline gap-2 bg-black/30 border border-brand-accent/60 px-3 py-1.5 rounded-lg">
                      <span className="font-price text-xs line-through text-white/75 tabular-nums">₹120</span>
                      <span className="font-brand text-lg sm:text-xl font-bold text-brand-accent-soft tabular-nums">₹100</span>
                    </div>

                    <Link
                      href="/shop?category=Family%20Pack"
                      className="inline-flex min-h-9 sm:min-h-10 items-center gap-1.5 rounded-full bg-brand-accent hover:bg-brand-orange hover:text-white text-brand-heading px-3.5 py-1.5 sm:px-5 sm:py-2 font-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-95 whitespace-nowrap"
                    >
                      <span>Buy Family Pack</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* RIGHT SIDE IMAGE (Mascot) */}
                <div className="relative w-full sm:w-[45%] h-44 sm:h-full min-h-[190px] flex items-center justify-center">
                  <Image
                    src="/images/hm_flagship_mascot_transparent.png"
                    alt="HM Brand Divine Mascot with 10-in-1 Assorted Incense & Camphor"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 30vw"
                    className="object-contain object-center"
                  />
                </div>

              </div>

              {/* BOTTOM TRUST LINE */}
              <div className="border-t border-white/20 pt-3 mt-5 flex items-center justify-between text-xs text-white/90 font-medium w-full">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-brand-accent" /> 100% Charcoal-Free
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span>Coimbatore Crafted</span>
                  <IndiaTricolorMarkSvg className="h-3.5 w-5" />
                </span>
              </div>
            </div>

          </article>

          {/* RIGHT COLUMN: 2 SUPPORTING WELLBEING CARDS */}
          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-2">

            {/* Card 1: Wellness & Harmony */}
            <article className="group relative flex min-h-[144px] items-center justify-between gap-3 overflow-hidden rounded-2xl bg-[#EAF3DF] px-4 py-3.5 sm:gap-4 sm:rounded-3xl sm:p-6 shadow-xs border border-[#CBE0B5] transition hover:border-brand-forest/50">
              {/* Left Content */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                <span className="font-brand text-ui-11 font-bold tracking-wider text-brand-forest uppercase block">
                  WELLNESS &amp; HARMONY
                </span>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight tracking-wide text-brand-heading font-brand uppercase">
                  Pure Home Fragrance
                </h3>
                <p className="text-xs leading-relaxed text-[#1F2937]/90 font-normal line-clamp-2">
                  Botanical aromas to relax, purify air, and bring positive energy.
                </p>
                <div className="pt-0.5 sm:pt-1">
                  <Link
                    href="/shop"
                    className="inline-flex min-h-9 sm:min-h-10 items-center gap-1.5 rounded-full bg-brand-forest-dark hover:bg-brand-forest px-3.5 py-1.5 sm:px-4 sm:py-2 font-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white transition shadow-xs active:scale-95 whitespace-nowrap"
                  >
                    <span>Shop Essentials</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Right Image: Framed & Proportional */}
              <div className="relative h-24 w-24 sm:w-36 sm:h-36 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#CBE0B5] bg-white p-1 flex items-center justify-center">
                <Image
                  src="/images/hm_cardamom_promo_green.jpg"
                  alt="HM Brand Cardamom Incense Sticks with natural cardamom pods and flowers"
                  fill
                  sizes="(max-width: 640px) 96px, 144px"
                  className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>

            {/* Card 2: Mindful Living */}
            <article className="group relative flex min-h-[144px] items-center justify-between gap-3 overflow-hidden rounded-2xl bg-brand-ink px-4 py-3.5 sm:gap-4 sm:rounded-3xl sm:p-6 text-white shadow-xs border border-brand-ink transition hover:border-brand-accent/60">
              {/* Left Content */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                <span className="font-brand text-ui-11 font-bold tracking-wider text-[#FDE68A] uppercase block">
                  NATURAL PURITY
                </span>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight tracking-wide text-white font-brand uppercase">
                  100% Charcoal-Free
                </h3>
                <p className="text-xs leading-relaxed text-white/90 font-normal line-clamp-2">
                  Clean white smoke that protects family health with zero soot.
                </p>
                <div className="pt-0.5 sm:pt-1">
                  <Link
                    href="/about"
                    className="inline-flex min-h-9 sm:min-h-10 items-center gap-1.5 rounded-full bg-brand-accent hover:bg-brand-orange hover:text-white px-3.5 py-1.5 sm:px-4 sm:py-2 font-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-ink transition shadow-xs active:scale-95 whitespace-nowrap"
                  >
                    <span>Explore Benefits</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Right Image: Framed & Proportional */}
              <div className="relative h-24 w-24 sm:w-36 sm:h-36 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-white/15 bg-white/10 p-1 flex items-center justify-center">
                <Image
                  src="/images/hm_charcoal_free_promo_blue.jpg"
                  alt="HM Brand Pure Loban Cup Sambrani Charcoal-Free with Brass Diya"
                  fill
                  sizes="(max-width: 640px) 96px, 144px"
                  className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>

          </div>

        </div>
      </div>
    </section>
  );
}

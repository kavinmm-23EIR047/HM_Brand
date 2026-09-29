import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export function BentoPromos() {
  return (
    <section className="bg-[#FFF4D6] py-6 sm:py-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-5 lg:grid-cols-12">
          
          {/* MAIN FLAGSHIP CARD: 10-IN-1 AROMA FAMILY PACK */}
          <article className="relative flex min-h-[360px] sm:min-h-[390px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#9E1830] via-[#851227] to-[#5A0919] text-white border-2 border-[#F6C84C]/60 shadow-xl lg:col-span-7">
            
            <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-8 lg:w-[58%] space-y-4">
              
              <div className="space-y-3">
                {/* Clean Top Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F6C84C] px-3 py-1 text-[10px] sm:text-xs font-black tracking-wider text-[#173B3A] shadow-xs uppercase">
                  <span>🇮🇳 1ST TIME IN INDIA</span>
                </div>

                {/* Main Clear Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white font-heading">
                    10 in 1 Aroma Family Pack
                  </h2>
                  <p className="mt-1 font-sans text-xs sm:text-sm text-[#F6C84C] font-semibold">
                    Smell of Purity • 10 Divine Fragrances in One Box
                  </p>
                </div>

                {/* Concise, Feel-Good Copy */}
                <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed max-w-md">
                  Handcrafted with pure botanical resins — Kewda, Loban, Rose, Sandalwood, Lavender, Jasmine &amp; more. 100% charcoal-free for pure daily devotion.
                </p>

                {/* Price & CTA Row */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-1.5 bg-black/25 border border-[#F6C84C]/40 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] line-through text-white/60 font-semibold">₹120</span>
                    <span className="text-base sm:text-lg font-black text-[#F6C84C]">₹100</span>
                  </div>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-[#F47A20] hover:text-white text-[#173B3A] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-md transition hover:scale-105 active:scale-95"
                  >
                    <span>Buy Family Pack</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Mobile Mascot Visual */}
                <div className="relative mt-3 flex items-center justify-center h-44 sm:h-52 w-full lg:hidden">
                  <Image
                    src="/images/hm_puja_products_scene.png"
                    alt="10 in 1 Family Pack - 1st Time in India"
                    fill
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-contain object-bottom drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Bottom Trust Line */}
              <div className="border-t border-white/15 pt-3 flex items-center justify-between text-[11px] text-white/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#F6C84C]" /> 100% Charcoal-Free
                </span>
                <span>Coimbatore Crafted 🇮🇳</span>
              </div>
            </div>

            {/* Desktop Mascot Visual */}
            <div className="pointer-events-none absolute -bottom-1 -right-2 top-2 hidden w-[44%] items-center justify-center lg:flex">
              <Image
                src="/images/hm_puja_products_scene.png"
                alt="10 in 1 Family Pack - 1st Time in India"
                fill
                sizes="(min-width: 1024px) 34vw, 0px"
                className="object-contain object-bottom drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </article>

          {/* RIGHT COLUMN: 2 SUPPORTING WELLBEING CARDS */}
          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-2">
            
            {/* Card 1: Wellness & Harmony */}
            <article className="group relative flex min-h-[175px] sm:min-h-[190px] items-center overflow-hidden rounded-3xl bg-[#dcebc9] p-5 sm:p-6 shadow-sm border border-[#3F7D45]/30 transition hover:shadow-md">
              <div className="relative z-10 w-[58%] pr-1 space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-widest text-[#36764c] uppercase block">
                  WELLNESS &amp; HARMONY
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-[#173b3a] font-heading">
                  Pure Home Fragrance
                </h3>
                <p className="text-xs leading-relaxed text-[#385650] line-clamp-2">
                  Botanical aromas to relax, purify air, and bring positive energy.
                </p>
                <div className="pt-1">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#39824d] hover:bg-[#225f3a] px-3.5 py-1.5 text-xs font-extrabold text-white transition shadow-2xs active:scale-95"
                  >
                    <span>Shop Essentials</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="pointer-events-none absolute right-2 sm:right-3 top-2 bottom-2 w-[42%] flex items-center justify-center">
                <Image
                  src="/images/hm_wellness_incense_scene.png"
                  alt="HM Sandalwood Agarbatti incense sticks and ritual essentials"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                  className="object-contain object-center drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>

            {/* Card 2: Mindful Living */}
            <article className="group relative flex min-h-[175px] sm:min-h-[190px] items-center overflow-hidden rounded-3xl bg-[#4e82a8] p-5 sm:p-6 text-white shadow-sm border border-[#4e82a8]/40 transition hover:shadow-md">
              <div className="relative z-10 w-[58%] pr-1 space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-widest text-[#FFD54C] uppercase block">
                  NATURAL PURITY
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-white font-heading">
                  100% Charcoal-Free
                </h3>
                <p className="text-xs leading-relaxed text-white/90 line-clamp-2">
                  Clean white smoke that protects family health with zero soot.
                </p>
                <div className="pt-1">
                  <Link
                    href="/benefits"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F47A20] hover:bg-[#d65a12] px-3.5 py-1.5 text-xs font-extrabold text-white transition shadow-2xs active:scale-95"
                  >
                    <span>Explore Benefits</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="pointer-events-none absolute right-2 sm:right-3 top-2 bottom-2 w-[42%] flex items-center justify-center">
                <Image
                  src="/images/hm_mindful_ritual_scene.png"
                  alt="Mindful ritual scene with incense and flowers"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                  className="object-contain object-center drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>

          </div>

        </div>
      </div>
    </section>
  );
}

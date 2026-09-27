import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Star } from "lucide-react";

export function BentoPromos() {
  return (
    <section className="bg-[#FFF4D6] py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-4 lg:grid-cols-12">
          <article className="relative flex min-h-[380px] overflow-hidden rounded-[24px] bg-[#a91437] text-white shadow-[0_12px_28px_-18px_rgba(80,5,25,.6)] lg:col-span-7">
            <div className="relative z-10 flex w-full flex-col justify-between p-5 sm:p-8 lg:w-[58%]">
              <div>
                <span className="inline-flex rounded-full bg-[#ffd54c] px-3.5 py-1 text-[10px] font-extrabold tracking-[.13em] text-[#173b3a] shadow-xs">
                  LIMITED TIME OFFER
                </span>
                <h2 className="mt-3 max-w-[540px] text-2xl sm:text-4xl lg:text-[38px] font-extrabold leading-[1.05] tracking-[-.03em] text-white">
                  The 10-in-1 Family Pack
                </h2>
                <p className="mt-2 max-w-[480px] text-xs sm:text-sm leading-relaxed text-white/90">
                  India’s 10 most sacred & authentic fragrances in one festive pack for your daily prayers.
                </p>
                <div className="mt-4 flex max-w-[560px] flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold text-white/95">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5"><Sparkles size={13} className="text-[#ffd54c]" />10 Divine Fragrances</span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5"><ShieldCheck size={13} className="text-[#ffd54c]" />100% Charcoal-Free</span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5"><Star size={13} className="text-[#ffd54c]" />Festival Special</span>
                </div>
                
                <div className="mt-5 flex items-center gap-3">
                  <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#ffd34b] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-[#183a34] shadow-md transition hover:bg-white hover:scale-105 active:scale-95">
                    Shop Family Pack <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Mobile Transparent Crayonism Scene */}
                <div className="relative mt-3 flex items-center justify-center h-52 sm:h-64 w-full lg:hidden">
                  <Image
                    src="/images/hm_puja_products_scene.png"
                    alt="HM Agarbattis sacred puja fragrances and products"
                    fill
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-contain object-bottom drop-shadow-xl"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] text-white/90">
                <span className="font-medium">Pure Botanical Resins • Non-Toxic</span>
                <span className="font-extrabold text-[#ffd54c] text-xs sm:text-sm bg-black/25 px-2.5 py-0.5 rounded-full">Special Price: ₹150</span>
              </div>
            </div>

            {/* Desktop Transparent Crayonism Scene */}
            <div className="pointer-events-none absolute -bottom-1 -right-2 top-2 hidden w-[45%] items-center justify-center lg:flex">
              <Image
                src="/images/hm_puja_products_scene.png"
                alt="HM Agarbattis sacred puja fragrances and products"
                fill
                sizes="(min-width: 1024px) 34vw, 0px"
                className="object-contain object-bottom drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </article>

          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-2">
            {/* Card 1: Wellness & Harmony */}
            <article className="group relative flex min-h-[200px] sm:min-h-[220px] items-center overflow-hidden rounded-[24px] bg-[#dcebc9] p-5 sm:p-6 shadow-[0_8px_20px_-16px_rgba(23,59,58,.55)] border border-[#3F7D45]/25 transition hover:shadow-md">
              <div className="relative z-10 w-[56%] sm:w-[58%] pr-1 space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-[.12em] text-[#36764c] uppercase block">WELLNESS &amp; HARMONY</span>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-[-.02em] text-[#173b3a]">Create a Peaceful Space</h3>
                <p className="text-xs leading-relaxed text-[#385650] line-clamp-2">Natural fragrances to relax, purify and focus your mind.</p>
                <div className="pt-2">
                  <Link href="/shop" className="inline-flex items-center gap-1.5 rounded-full bg-[#39824d] px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-extrabold text-white transition hover:bg-[#225f3a] shadow-xs active:scale-95">
                    <span>Shop Essentials</span> <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none absolute right-1 sm:right-3 top-2 bottom-2 w-[44%] sm:w-[42%] flex items-center justify-center">
                <Image
                  src="/images/hm_wellness_incense_scene.png"
                  alt="HM Sandalwood Agarbatti incense sticks and sandalwood ritual essentials"
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                  className="object-contain object-center drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>

            {/* Card 2: Mindful Living */}
            <article className="group relative flex min-h-[200px] sm:min-h-[220px] items-center overflow-hidden rounded-[24px] bg-[#4e82a8] p-5 sm:p-6 text-white shadow-[0_8px_20px_-16px_rgba(23,59,58,.55)] border border-[#4e82a8]/40 transition hover:shadow-md">
              <div className="relative z-10 w-[56%] sm:w-[58%] pr-1 space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-[.12em] text-[#ffcf61] uppercase block">MINDFUL LIVING</span>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-[-.02em] text-white">Mindful Living, Everyday</h3>
                <p className="text-xs leading-relaxed text-white/90 line-clamp-2">Turn simple moments into meaningful daily rituals.</p>
                <div className="pt-2">
                  <Link href="/about#benefits" className="inline-flex items-center gap-1.5 rounded-full bg-[#f47a20] px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d65a12] shadow-xs active:scale-95">
                    <span>Explore Benefits</span> <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none absolute right-1 sm:right-3 top-2 bottom-2 w-[44%] sm:w-[42%] flex items-center justify-center">
                <Image
                  src="/images/hm_mindful_ritual_scene.png"
                  alt="Traditional glowing brass diya and aromatic sambrani dhoop cup"
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

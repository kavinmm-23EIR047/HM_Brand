import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Star } from "lucide-react";

export function BentoPromos() {
  return (
    <section className="bg-[#FFF4D6] py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-4 lg:grid-cols-12">
          <article className="relative flex min-h-[340px] overflow-hidden rounded-[24px] bg-[#a91437] text-white shadow-[0_12px_28px_-18px_rgba(80,5,25,.6)] lg:col-span-7">
            <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-8 lg:w-[68%]">
              <div>
                <span className="inline-flex rounded-full bg-[#ffd54c] px-3.5 py-1 text-[10px] font-extrabold tracking-[.13em] text-[#173b3a]">LIMITED TIME OFFER</span>
                <h2 className="mt-3 max-w-[540px] text-3xl font-extrabold leading-[1.04] tracking-[-.04em] text-white sm:text-4xl lg:text-[42px]">The 10-in-1 Family Pack</h2>
                <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-white/90 sm:text-base">India’s 10 beautiful fragrances in one pack for your everyday rituals.</p>
                <div className="mt-5 flex max-w-[560px] flex-wrap gap-2 text-[11px] font-semibold text-white/95">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2"><Sparkles size={15} className="text-[#ffd54c]" />10 Unique Fragrances</span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2"><ShieldCheck size={15} className="text-[#ffd54c]" />Premium Quality</span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2"><Star size={15} className="text-[#ffd54c]" />Perfect for Festivals</span>
                </div>
                <Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffd34b] px-6 py-3 text-sm font-extrabold text-[#183a34] shadow-md transition hover:bg-white">
                  Shop Family Pack <ArrowRight size={17} />
                </Link>
                <div className="relative ml-auto mt-2 h-28 w-[72%] sm:h-36 lg:hidden">
                  <Image src="/images/brochure-incense-boxes.png" alt="HM incense fragrances shown in the brochure" fill sizes="72vw" className="object-contain object-right-bottom" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] text-white/85">
                <span>Pure Ingredients • No Charcoal</span><span className="font-extrabold text-[#ffd54c]">Special Price: ₹150</span>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-4 right-3 top-4 hidden w-[34%] lg:block">
              <Image src="/images/brochure-incense-boxes.png" alt="HM incense fragrances shown in the brochure" fill sizes="(min-width: 1024px) 24vw, 0px" className="object-contain object-center" />
            </div>
          </article>

          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-2">
            <article className="relative flex min-h-[190px] items-center overflow-hidden rounded-[22px] bg-[#dcebc9] px-6 py-5 shadow-[0_8px_20px_-16px_rgba(23,59,58,.55)] sm:px-7">
              <div className="relative z-10 max-w-[68%]">
                <span className="text-[10px] font-extrabold tracking-[.12em] text-[#36764c]">WELLNESS &amp; HARMONY</span>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#173b3a]">Create a Peaceful Space</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#385650]">Natural fragrances to relax, purify and focus your mind.</p>
                <Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#39824d] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#225f3a]">Shop Essentials <ArrowRight size={14} /></Link>
              </div>
              <div className="pointer-events-none absolute -bottom-2 -right-4 top-2 w-[39%]">
                <Image src="/images/mascot_10.png" alt="HM mascot with incense and a peaceful temple setting" fill sizes="(min-width: 1024px) 16vw, 40vw" className="object-contain object-bottom" />
              </div>
            </article>

            <article className="relative flex min-h-[190px] items-center overflow-hidden rounded-[22px] bg-[#4e82a8] px-6 py-5 text-white shadow-[0_8px_20px_-16px_rgba(23,59,58,.55)] sm:px-7">
              <div className="relative z-10 max-w-[68%]">
                <span className="text-[10px] font-extrabold tracking-[.12em] text-[#ffcf61]">MINDFUL LIVING</span>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-.03em]">Mindful Living, Everyday</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/90">Turn simple moments into meaningful daily rituals.</p>
                <Link href="/about#benefits" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f47a20] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d65a12]">Explore Benefits <ArrowRight size={14} /></Link>
              </div>
              <div className="pointer-events-none absolute -bottom-2 -right-3 top-1 w-[38%]">
                <Image src="/images/mascot_13.png" alt="HM mascot beside a temple, flowers and a diya" fill sizes="(min-width: 1024px) 16vw, 40vw" className="object-contain object-bottom" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

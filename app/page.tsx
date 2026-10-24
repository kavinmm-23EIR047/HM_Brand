"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CategoryStrip } from "@/components/category-strip";
import { HeroBannerSlider } from "@/components/hero-banner-slider";
import { TrustStrip } from "@/components/trust-strip";
import { BentoPromos } from "@/components/bento-promos";
import { DeliveryReachBanner } from "@/components/delivery-reach-banner";
import { Testimonials } from "@/components/testimonials";
import { OurStorySection } from "@/components/our-story-section";
import { BestsellerShowcase } from "@/components/bestseller-showcase";
import { useStore } from "@/components/store";

export default function HomePage() {
  const { dbProducts } = useStore();


  return (
    <div className="min-h-screen bg-sandalLight text-[#173B3A] flex flex-col justify-between w-full max-w-full overflow-x-hidden font-sans">
      
      {/* 1. ANNOUNCEMENT BAR & NAVBAR */}
      <Navigation />

      <main className="w-full max-w-full overflow-x-hidden">
        {/* 2. HERO CAROUSEL */}
        <HeroBannerSlider />

        {/* 3. VISUAL CATEGORY NAVIGATION (7 CIRCLES) */}
        <CategoryStrip />

        {/* 4. BESTSELLERS PRODUCT SHOWCASE (CATEGORY TABS & DIRECT CONVERSION) */}
        <BestsellerShowcase />

        {/* 5. THE HM PURITY PROMISE (CORE BRAND DIFFERENTIATOR & TRUST PILLARS) */}
        <TrustStrip />

        {/* 6. BENTO PROMO GRID (10-IN-1 FAMILY PACK OFFER & VALUE BUNDLES) */}
        <BentoPromos />

        {/* 7. DELIVERY REACH BANNER (100+ SOUTH INDIA DISTRICTS FAST DISPATCH) */}
        <DeliveryReachBanner />

        {/* 9. CUSTOMER REVIEWS & VERIFIED BUYER SOCIAL PROOF */}
        <Testimonials />

        {/* 10. BRAND STORY & VEDIC WELLBEING */}
        <OurStorySection />

        {/* 11. FINAL CTA BANNER ("Discover the Divine Within - Shop Sacred Collection") */}
        <section className="section-spacing bg-sandalLight px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-2xl rounded-bl-2xl sm:rounded-tl-[52px] sm:rounded-br-[52px] sm:rounded-tr-3xl sm:rounded-bl-3xl bg-gradient-to-r from-[#3e1b60] via-[#562d7c] to-[#351654] p-4 sm:p-8 lg:p-10">
            
            {/* Background Ambient Glow & Mandala Watermark */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#F6C84C]/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-[#9E1830]/25 blur-3xl" />

            {/* True Horizontal Layout (Side-by-Side on Mobile & Desktop) */}
            <div className="relative z-10 flex flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-8">
              
              {/* Left Column: Concise Content & Action */}
              <div className="w-[58%] sm:w-[62%] lg:w-[65%] space-y-2 sm:space-y-3.5 pr-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F6C84C]/50 bg-white/10 px-2.5 py-0.5 text-[9px] sm:text-xs font-bold tracking-widest text-[#F6C84C] uppercase backdrop-blur-xs">
                  <Sparkles size={11} className="text-[#F6C84C] shrink-0" />
                  <span>SACRED TEMPLE HERITAGE</span>
                </span>

                <div>
                  <span className="font-script text-xl sm:text-2xl lg:text-3xl text-[#F6C84C] font-normal block leading-tight">
                    Discover the Divine Within
                  </span>
                  <h2 className="mt-0.5 font-heading text-sm sm:text-lg lg:text-xl font-bold text-white leading-snug">
                    Bring Sacred Fragrance &amp; Peace Into Your Everyday Life
                  </h2>
                </div>

                <p className="font-sans text-[11px] sm:text-sm text-white/90 leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                  Pure handcrafted agarbattis, Bhimseni camphor &amp; sambrani delivered directly from Coimbatore.
                </p>

                {/* 2 Micro Badges on Tablet/Desktop */}
                <div className="hidden sm:flex items-center gap-2 pt-0.5 text-[11px] text-white/95 font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1">
                    <ShieldCheck size={13} className="text-[#F6C84C]" /> 100% Charcoal-Free
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1">
                    ✦ Pure Botanicals
                  </span>
                </div>

                <div className="pt-1.5 sm:pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#F6C84C] px-4 py-2 sm:px-7 sm:h-12 sm:py-3 font-bold text-[11px] sm:text-xs tracking-wide text-[#173B3A] transition hover:bg-[#F47A20] hover:text-white"
                  >
                    <span>Shop Sacred Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Die-Cut Arched Window Radius Frame */}
              <div className="w-[42%] sm:w-[38%] lg:w-[35%] flex items-center justify-center shrink-0">
                <div className="group relative aspect-[4/5] w-full max-w-[150px] min-[400px]:max-w-[180px] sm:max-w-[240px] lg:max-w-[280px] overflow-hidden rounded-t-full rounded-b-2xl sm:rounded-b-3xl bg-gradient-to-t from-black/35 via-white/5 to-white/15 p-2 sm:p-3.5 shadow-card backdrop-blur-xs flex items-center justify-center">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#ffd54c]/20 via-transparent to-transparent" />
                  <div className="relative h-full w-full">
                    <Image
                      src="/images/hm_find_god_within_shrine.png"
                      alt="HM sacred temple shrine with glowing brass diya, incense smoke, lotus and temple bells"
                      fill
                      sizes="(max-width: 640px) 180px, 280px"
                      className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 11. GRAND MAROON FOOTER */}
      <Footer />

    </div>
  );
}

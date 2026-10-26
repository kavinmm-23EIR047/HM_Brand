"use client";

import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CategoryStrip } from "./components/category-strip";
import { HeroBannerSlider } from "./components/hero-banner-slider";
import { TrustStrip } from "./components/trust-strip";
import { BentoPromos } from "./components/bento-promos";
import { DeliveryReachBanner } from "./components/delivery-reach-banner";
import { Testimonials } from "./components/testimonials";
import { OurStorySection } from "./components/our-story-section";
import { BestsellerShowcase } from "./components/bestseller-showcase";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sandalLight text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-hidden font-sans">
      
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

        {/* 11. WHATSAPP COMMUNITY CTA */}
        <section className="section-spacing bg-sandalLight px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#4A154B] via-[#401249] to-[#330E3B] p-4 sm:p-6 md:p-7 border border-[#D4AF37]/40 shadow-xl">
            
            {/* Background Ambient Golden & Violet Glow */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#F59E0B]/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#9E1830]/20 blur-3xl" />

            {/* Side-by-Side Balanced Horizontal Layout on Mobile & Desktop */}
            <div className="relative z-10 flex flex-row items-center justify-between gap-3 sm:gap-6">
              
              {/* Left Column: Simple Concise Content & Action Button */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2 pr-1">
                {/* Help desk badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F6C84C]/50 bg-black/20 px-2.5 py-0.5 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#F6C84C] backdrop-blur-xs">
                  <MessageCircle size={11} className="text-[#F6C84C] shrink-0" />
                  <span>WHATSAPP HELP DESK</span>
                </div>

                {/* Heading */}
                <div>
                  <span className="font-serif italic text-sm sm:text-lg lg:text-xl text-[#F6C84C] block leading-tight">
                    Ask us directly
                  </span>
                  <h2 className="mt-0.5 font-serif text-sm sm:text-xl lg:text-2xl font-extrabold text-white uppercase tracking-wide leading-tight">
                    HERE TO HELP.
                  </h2>
                </div>

                {/* Simple Short Description */}
                <p className="text-[11px] sm:text-xs text-white/85 leading-normal max-w-xs font-normal">
                  Chat with our team about products and orders.
                </p>

                {/* WhatsApp Action Button */}
                <div className="pt-1 sm:pt-2">
                  <a
                    href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I need help with an enquiry.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-full bg-[#F6C84C] hover:bg-[#E5B535] active:scale-95 text-[#2D0F3F] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1.5 sm:px-5 sm:py-2.5 shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
                  >
                    <MessageCircle size={13} className="fill-current text-[#2D0F3F]" />
                    <span>Chat with help desk</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              {/* Right Column: Generated Mascot pointing to phone with WhatsApp Chat */}
              <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-amber-400/20 bg-[#350E3E] flex items-center justify-center">
                <Image
                  src="/images/mascot_whatsapp_scene.jpg"
                  alt="HM Brand mascot presenting WhatsApp chat scene"
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 1024px) 160px, 192px"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
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

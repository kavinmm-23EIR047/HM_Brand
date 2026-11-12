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
    <div className="min-h-screen bg-brand-surface-bright text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-clip font-sans">
      
      {/* 1. ANNOUNCEMENT BAR & NAVBAR */}
      <Navigation />

      <main className="w-full max-w-full overflow-x-clip">
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

        {/* 11. WHATSAPP COMMUNITY CTA — SOLID SOHO EDITORIAL CONCIERGE BANNER */}
        <section className="section-spacing bg-brand-surface-alt border-t border-brand-border/70">
          <div className="page-container">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-brand-ink p-5 sm:p-8 lg:p-10 border border-brand-border/40 shadow-card">
              {/* Side-by-Side Balanced Horizontal Layout on Mobile & Desktop */}
              <div className="relative z-10 flex flex-row items-center justify-between gap-4 sm:gap-8">
                
                {/* Left Column: Simple Concise Content & Action Button */}
                <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 pr-1">
                  {/* Help desk badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/50 bg-black/25 px-3 py-1 text-ui-11 sm:text-xs font-bold uppercase tracking-wider text-brand-accent">
                    <MessageCircle size={12} className="text-brand-accent shrink-0" />
                    <span>WHATSAPP HELP DESK</span>
                  </div>

                  {/* Heading */}
                  <div>
                    <span className="font-serif italic text-sm sm:text-lg lg:text-xl text-brand-accent block leading-tight">
                      Ask us directly
                    </span>
                    <h2 className="mt-0.5 font-brand text-lg sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wide leading-tight">
                      Here to Help.
                    </h2>
                  </div>

                  {/* Simple Short Description */}
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md font-normal">
                    Chat directly with our Coimbatore team about fragrances, bundles, or your order status.
                  </p>

                  {/* WhatsApp Action Button */}
                  <div className="pt-1 sm:pt-2">
                    <a
                      href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I need help with an enquiry.")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-accent hover:bg-brand-orange hover:text-white active:scale-[0.98] text-brand-ink font-brand font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-sm transition-all whitespace-nowrap cursor-pointer"
                    >
                      <MessageCircle size={15} className="fill-current" />
                      <span>Chat with help desk</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Right Column: Mascot */}
                <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden shadow-md border border-brand-accent/35 bg-white flex items-center justify-center">
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
          </div>
        </section>
      </main>

      {/* 11. GRAND MAROON FOOTER */}
      <Footer />

    </div>
  );
}

"use client";

import { ArrowRight, Clock, MessageCircle, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-brand-surface-alt text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-clip font-sans">
      
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

        {/* 11. WHATSAPP COMMUNITY CTA — CLEAN SOHO EDITORIAL CONCIERGE BAR */}
        <section className="bg-brand-surface-alt py-6 sm:py-10">
          <div className="page-container">
            <div className="rounded-2xl border border-brand-border bg-white p-4 sm:p-6 lg:px-8 lg:py-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-8">
                {/* Left: Concierge Emblem & Copy */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                  <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-[#CBE0B5] bg-[#EAF5EC] text-[#14532D]">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                  </div>

                  <div className="min-w-0">
                    <span className="font-brand text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#14532D] block">
                      WHATSAPP HELP DESK
                    </span>
                    <h2 className="mt-0.5 font-brand text-base sm:text-xl font-bold uppercase tracking-wide text-brand-heading leading-tight">
                      Here to Help.
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-brand-slate leading-snug">
                      Quick help with scents, bundles &amp; orders.
                    </p>
                  </div>
                </div>

                {/* Middle: Concierge Hours & Origin (Balances Desktop Row) */}
                <div className="hidden md:flex items-center gap-6 border-l border-brand-border pl-6 shrink-0 text-xs font-medium text-brand-slate">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-[#14532D] shrink-0" />
                    <span>Mon&ndash;Sat &middot; 9am&ndash;7pm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-brand-primary shrink-0" />
                    <span>Coimbatore Team</span>
                  </div>
                </div>

                {/* Right: Compact Action Row */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-brand-border/70">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-gray md:hidden">
                    <Clock size={12} className="text-[#14532D] shrink-0" />
                    <span>Mon&ndash;Sat &middot; 9am&ndash;7pm</span>
                  </span>
                  <a
                    href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I need help with an enquiry.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-[#14532D] hover:bg-[#0F3F22] text-white font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 shadow-2xs transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap cursor-pointer ml-auto border border-[#C89B3C]/30"
                  >
                    <MessageCircle size={14} className="shrink-0" />
                    <span>Chat on WhatsApp</span>
                    <ArrowRight size={13} className="shrink-0" />
                  </a>
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

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Leaf, FlaskConical, ShieldCheck, Award, MapPin, Phone, Mail
} from "lucide-react";
import { MandalaMotif, MeditationYogaDrawing, ToranMaalai } from "./illustrations";

function InstagramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-brand-red-black via-brand-primary to-brand-red-shadow text-white font-sans rounded-t-[32px] sm:rounded-t-[48px] border-t-2 border-brand-accent/50 shadow-[0_-20px_60px_rgba(0,0,0,0.35)]">

      {/* 1. ANIMATED FESTIVE MARIGOLD TORAN GARLAND AT TOP */}
      <div className="relative hidden w-full overflow-hidden pointer-events-none select-none z-20 sm:block">
        <ToranMaalai />
      </div>

      {/* 2. AMBIENT SACRED BACKGROUND ARTWORKS: MANDALA ON RIGHT + SACRED YOGA DESIGN ON LEFT */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* RIGHT SIDE: Sacred Rotating Golden Mandala Watermark */}
        <MandalaMotif
          className="absolute -bottom-24 -right-24 h-[440px] w-[440px] sm:h-[560px] sm:w-[560px] opacity-20"
          speed={70}
          counterRotate={true}
          strokeColor="var(--brand-accent)"
          strokeWidth={1.5}
          withDrawingEffect={true}
          withGlow={true}
        />

        {/* LEFT / TOP-LEFT: Sacred Golden Meditating Yogi with Radiating Lotus Crown Halo (Fully Visible) */}
        <div className="absolute top-8 sm:top-12 -left-6 sm:left-4 md:left-8 hidden sm:block opacity-20 sm:opacity-25 pointer-events-none">
          <MeditationYogaDrawing
            strokeColor="var(--brand-accent)"
            fillColor="var(--brand-accent)"
            withGlow={true}
            className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] text-brand-accent"
          />
        </div>
      </div>

      {/* 3. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-10 relative z-10 w-full space-y-8">

        {/* TOP BRAND STRIP: Brand Logo, Quote & 4 Trust Pills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center rounded-2xl border border-white/15 bg-[#620c23]/65 p-4 sm:rounded-3xl sm:p-6 backdrop-blur-sm shadow-lg">

          {/* Logo & Philosophy */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group" aria-label="HM Brand home">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <Image
                    src="/images/brand_logo_gold_transparent.png"
                    alt="HM Brand - Smell of Purity"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="font-brand text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-white">
                    HM <span className="text-brand-accent">BRAND</span>
                  </span>
                  <span className="font-tagline text-xs sm:text-ui-13 text-brand-accent-soft tracking-[0.18em] uppercase font-bold -mt-0.5 whitespace-nowrap">
                    Discover the Divine Within
                  </span>
                </div>
              </Link>
              <span className="rounded-full bg-brand-accent px-3 py-0.5 text-ui-10 sm:text-xs font-bold text-brand-ink shadow-xs whitespace-nowrap uppercase tracking-wider">
                🇮🇳 1ST TIME IN INDIA: 10-IN-1 PACK
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xl">
              <span className="font-brand text-xs sm:text-sm text-brand-accent-soft font-bold block mb-1 tracking-wider uppercase">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </span>
              Handcrafted in Peelamedu, Coimbatore with pure botanical resins, herbs, and flower extracts.
            </p>
          </div>

          {/* 4 Feature Pills (Compact 2x2 Grid on Mobile & Desktop) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-black/35 px-3.5 py-2.5 rounded-xl border border-brand-accent/40 flex items-center gap-2 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <Leaf size={16} className="text-brand-accent shrink-0" />
              <span className="text-white/95">100% Natural</span>
            </div>
            <div className="bg-black/35 px-3.5 py-2.5 rounded-xl border border-brand-accent/40 flex items-center gap-2 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <ShieldCheck size={16} className="text-brand-accent shrink-0" />
              <span className="text-white/95">No Charcoal</span>
            </div>
            <div className="bg-black/35 px-3.5 py-2.5 rounded-xl border border-brand-accent/40 flex items-center gap-2 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <FlaskConical size={16} className="text-brand-accent shrink-0" />
              <span className="text-white/95">No Chemicals</span>
            </div>
            <div className="bg-black/35 px-3.5 py-2.5 rounded-xl border border-brand-accent/40 flex items-center gap-2 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <Award size={16} className="text-brand-accent shrink-0" />
              <span className="text-white/95">Made in India</span>
            </div>
          </div>

        </div>

        {/* MIDDLE GRID: 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

          {/* COLUMN 1: Categories */}
          <div className="space-y-3.5">
            <h4 className="font-brand font-bold text-sm sm:text-base text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
              <span>✦</span> Categories
            </h4>
            <ul className="space-y-2 text-sm sm:text-ui-15 font-medium text-white/95">
              <li><Link href="/category/Agarbatti" className="hover:text-brand-accent transition inline-block">Agarbatti &amp; Flora</Link></li>
              <li><Link href="/category/Camphor" className="hover:text-brand-accent transition inline-block">Bhimseni Camphor</Link></li>
              <li><Link href="/category/Sambrani" className="hover:text-brand-accent transition inline-block">Cup Sambrani</Link></li>
              <li><Link href="/category/Loban" className="hover:text-brand-accent transition inline-block">Loban &amp; Dhoop</Link></li>
              <li><Link href="/category/Dhoop" className="hover:text-brand-accent transition inline-block">Sandalwood Cones</Link></li>
              <li><Link href="/offers" className="hover:text-brand-accent transition inline-block">10-in-1 Family Pack</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="space-y-3.5">
            <h4 className="font-brand font-bold text-sm sm:text-base text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
              <span>✦</span> Quick Links
            </h4>
            <ul className="space-y-2 text-sm sm:text-ui-15 font-medium text-white/95">
              <li><Link href="/about" className="hover:text-brand-accent transition inline-block">Our Story</Link></li>
              <li><Link href="/benefits" className="hover:text-brand-accent transition inline-block">Natural Benefits</Link></li>
              <li><Link href="/blog" className="hover:text-brand-accent transition inline-block">Blog &amp; Wellness</Link></li>
              <li><Link href="/collections" className="hover:text-brand-accent transition inline-block">Collections</Link></li>
              <li><Link href="/offers" className="hover:text-brand-accent transition inline-block">Special Offers</Link></li>
              <li><Link href="/contact" className="hover:text-brand-accent transition inline-block">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: Workshop & Direct Contact */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <h4 className="font-brand font-bold text-sm sm:text-base text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
              <span>✦</span> Contact &amp; Workshop
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-white/95 font-medium">
              <p className="flex items-start gap-1.5 leading-snug">
                <MapPin size={15} className="text-brand-accent shrink-0 mt-0.5" />
                <span>143A, Peelamedu Main Rd, Sowripalayam, Coimbatore - 641028</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone size={14} className="text-brand-accent shrink-0" />
                <a href="tel:+919345633399" className="hover:text-brand-accent transition">+91 9345633399, 6382177441</a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail size={14} className="text-brand-accent shrink-0" />
                <a href="mailto:jayamassociatescoimbatore@gmail.com" className="truncate hover:text-brand-accent transition">jayamassociatescoimbatore@gmail.com</a>
              </p>
              <p className="flex items-center gap-1.5 pt-0.5">
                <InstagramIcon size={14} className="text-brand-accent shrink-0" />
                <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-accent hover:underline">@hmagarbatti5</a>
              </p>
            </div>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <h4 className="font-brand font-bold text-sm sm:text-base text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
              <span>✦</span> Join Our Circle
            </h4>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Receive auspicious offers, new launches &amp; wellness tips.
            </p>
            <div className="space-y-2 pt-1">
              <input
                suppressHydrationWarning
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs sm:text-sm text-brand-ink bg-brand-surface-warm px-3.5 py-2.5 rounded-xl focus:outline-none font-medium placeholder:text-brand-ink/60 shadow-inner"
              />
              <button suppressHydrationWarning className="w-full bg-brand-orange hover:bg-brand-accent hover:text-brand-ink text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md active:scale-95 cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/85 text-center sm:text-left">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved. • <Link href="/admin" className="hover:text-brand-accent transition underline font-semibold">Admin Console</Link></p>
          <div className="flex items-center gap-1.5 font-tagline text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-brand-accent">
            <span>Discover the Divine Within</span>
            <Heart size={14} className="text-brand-orange fill-brand-orange ml-1" />
          </div>
          <p>Handcrafted in Coimbatore, India 🇮🇳</p>
        </div>

      </div>
    </footer>
  );
}

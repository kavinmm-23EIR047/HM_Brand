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
    <footer className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-[#800f24] via-[#9E1830] to-[#3f0510] text-white font-sans rounded-t-[32px] sm:rounded-t-[48px] border-t-2 border-[#F6C84C]/50 shadow-[0_-20px_60px_rgba(0,0,0,0.35)]">
      
      {/* 1. ANIMATED FESTIVE MARIGOLD TORAN GARLAND AT TOP */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-20">
        <ToranMaalai />
      </div>

      {/* 2. AMBIENT SACRED BACKGROUND ARTWORKS: MANDALA ON RIGHT + SACRED YOGA DESIGN ON LEFT */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* RIGHT SIDE: Sacred Rotating Golden Mandala Watermark */}
        <MandalaMotif 
          className="absolute -bottom-24 -right-24 h-[440px] w-[440px] sm:h-[560px] sm:w-[560px] opacity-20" 
          speed={70} 
          counterRotate={true}
          strokeColor="#F6C84C" 
          strokeWidth={1.5} 
          withDrawingEffect={true}
          withGlow={true}
        />

        {/* LEFT / TOP-LEFT: Sacred Golden Meditating Yogi with Radiating Lotus Crown Halo (Fully Visible) */}
        <div className="absolute top-8 sm:top-12 -left-6 sm:left-4 md:left-8 opacity-20 sm:opacity-25 pointer-events-none">
          <MeditationYogaDrawing 
            strokeColor="#F6C84C" 
            fillColor="#F6C84C" 
            withGlow={true}
            className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] text-[#F6C84C]"
          />
        </div>
      </div>

      {/* 3. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10 relative z-10 w-full space-y-8">
        
        {/* TOP BRAND STRIP: Brand Logo, Quote & 4 Trust Pills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-white/15 pb-8">
          
          {/* Logo & Philosophy */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-block group" aria-label="HM Brand home">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/brand_logo_gold_transparent.png"
                    alt="HM Brand - Smell of Purity"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </Link>
              <span className="rounded-full bg-[#F6C84C] px-3 py-1 text-[10px] sm:text-xs font-black text-[#173B3A] shadow-xs whitespace-nowrap">
                🇮🇳 1ST TIME IN INDIA: 10-IN-1 PACK
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xl">
              <span className="text-[#F6C84C] font-semibold italic block mb-0.5">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </span>
              Handcrafted in Peelamedu, Coimbatore with pure botanical resins, herbs, and flower extracts.
            </p>
          </div>

          {/* 4 Feature Pills (Compact 2x2 Grid on Mobile & Desktop) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-black/25 px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
              <Leaf size={15} className="text-[#F6C84C] shrink-0" />
              <span className="text-white/95">100% Natural</span>
            </div>
            <div className="bg-black/25 px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck size={15} className="text-[#F6C84C] shrink-0" />
              <span className="text-white/95">No Charcoal</span>
            </div>
            <div className="bg-black/25 px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
              <FlaskConical size={15} className="text-[#F6C84C] shrink-0" />
              <span className="text-white/95">No Chemicals</span>
            </div>
            <div className="bg-black/25 px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
              <Award size={15} className="text-[#F6C84C] shrink-0" />
              <span className="text-white/95">Made in India</span>
            </div>
          </div>

        </div>

        {/* MIDDLE GRID: 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* COLUMN 1: Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1">
              <span>✦</span> Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/90">
              <li><Link href="/category/Agarbatti" className="hover:text-[#F6C84C] transition inline-block">Agarbatti &amp; Flora</Link></li>
              <li><Link href="/category/Camphor" className="hover:text-[#F6C84C] transition inline-block">Bhimseni Camphor</Link></li>
              <li><Link href="/category/Sambrani" className="hover:text-[#F6C84C] transition inline-block">Cup Sambrani</Link></li>
              <li><Link href="/category/Loban" className="hover:text-[#F6C84C] transition inline-block">Loban &amp; Dhoop</Link></li>
              <li><Link href="/category/Dhoop" className="hover:text-[#F6C84C] transition inline-block">Sandalwood Cones</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition inline-block">10-in-1 Family Pack</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1">
              <span>✦</span> Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/90">
              <li><Link href="/about" className="hover:text-[#F6C84C] transition inline-block">Our Story</Link></li>
              <li><Link href="/benefits" className="hover:text-[#F6C84C] transition inline-block">Natural Benefits</Link></li>
              <li><Link href="/blog" className="hover:text-[#F6C84C] transition inline-block">Blog &amp; Wellness</Link></li>
              <li><Link href="/collections" className="hover:text-[#F6C84C] transition inline-block">Collections</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition inline-block">Special Offers</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition inline-block">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: Workshop & Direct Contact */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1">
              <span>✦</span> Contact &amp; Workshop
            </h4>
            <div className="space-y-2 text-xs text-white/90">
              <p className="flex items-start gap-1.5 leading-snug">
                <MapPin size={14} className="text-[#F6C84C] shrink-0 mt-0.5" />
                <span>143A, Peelamedu Main Rd, Sowripalayam, Coimbatore - 641028</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone size={13} className="text-[#F6C84C] shrink-0" />
                <a href="tel:+919345633399" className="hover:text-[#F6C84C] transition">+91 9345633399, 6382177441</a>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail size={13} className="text-[#F6C84C] shrink-0" />
                <a href="mailto:jayamassociatescoimbatore@gmail.com" className="truncate hover:text-[#F6C84C] transition">jayamassociatescoimbatore@gmail.com</a>
              </p>
              <p className="flex items-center gap-1.5 pt-0.5">
                <InstagramIcon size={13} className="text-[#F6C84C] shrink-0" />
                <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noopener noreferrer" className="font-bold text-[#F6C84C] hover:underline">@hmagarbatti5</a>
              </p>
            </div>
          </div>

          {/* COLUMN 4: Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1">
              <span>✦</span> Join Our Circle
            </h4>
            <p className="text-xs text-white/85 leading-relaxed">
              Receive auspicious offers, new launches &amp; wellness tips.
            </p>
            <div className="space-y-2">
              <input
                suppressHydrationWarning
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs text-[#173B3A] bg-[#FFF4D6] px-3 py-2 rounded-xl focus:outline-none font-medium placeholder:text-[#173B3A]/60 shadow-inner"
              />
              <button suppressHydrationWarning className="w-full bg-[#F47A20] hover:bg-[#F6C84C] hover:text-[#173B3A] text-white py-2 rounded-xl font-bold text-xs transition shadow-md active:scale-95">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/75 text-center sm:text-left">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved. • <Link href="/admin" className="hover:text-[#F6C84C] transition underline font-semibold">Admin Console</Link></p>
          <div className="flex items-center gap-1 font-script text-base text-[#F6C84C]">
            <span>Find Your God Within</span>
            <Heart size={14} className="text-[#F47A20] fill-[#F47A20] ml-1" />
          </div>
          <p>Handcrafted in Coimbatore, India 🇮🇳</p>
        </div>


      </div>
    </footer>
  );
}

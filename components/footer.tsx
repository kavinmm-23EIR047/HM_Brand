"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Leaf, FlaskConical, ShieldCheck, Award
} from "lucide-react";
import { MandalaMotif, MeditationYogaDrawing, ToranMaalai } from "./illustrations";

export function Footer() {
  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-[#800f24] via-[#9E1830] to-[#3f0510] text-white font-sans rounded-t-[32px] sm:rounded-t-[52px] border-t-2 border-[#F6C84C]/50 shadow-[0_-20px_60px_rgba(0,0,0,0.35)]">
      
      {/* ========================================================================= */}
      {/* 1. ANIMATED MARIGOLD FLOWER & MANGO LEAF MAALAI (TORAN GARLAND) AT TOP    */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-20">
        <ToranMaalai />
      </div>

      {/* ========================================================================= */}
      {/* 2. BACKGROUND SACRED ART: 1 RIGHT MANDALA & 1 LEFT MEDITATION/YOGA ART     */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        
        {/* LEFT SIDE: Serene Meditation, Yoga & Divine Virtue Line Art Drawing */}
        <MeditationYogaDrawing 
          className="absolute -bottom-10 -left-10 h-[440px] w-[440px] sm:h-[520px] sm:w-[520px] opacity-25" 
          strokeColor="#FFD974" 
          strokeWidth={1.5} 
          glow={true}
        />

        {/* RIGHT SIDE: Single Grand Rotating Sacred Golden Mandala */}
        <MandalaMotif 
          className="absolute -bottom-24 -right-24 h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] opacity-25" 
          speed={60} 
          counterRotate={true}
          strokeColor="#F6C84C" 
          strokeWidth={1.6} 
          withDrawingEffect={true}
          withGlow={true}
        />

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN FOOTER CONTENT                                                    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 relative z-10 w-full">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 border-b border-white/20 pb-12">
          
          {/* COLUMN 1: Official Brand Logo & Trust Badges */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group" aria-label="HM Brand home">
              <div className="relative h-16 sm:h-20 w-44 sm:w-56 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/brand_logo_gold_transparent.png"
                  alt="HM Brand - Discover the Divine Within"
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-contain object-left drop-shadow-2xl"
                />
              </div>
            </Link>

            <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              Handcrafted with pure botanical ingredients, sacred herbs, and natural resins. HM Agarbattis brings you an authentic Indian fragrance experience for daily prayers, meditation, and mindful living.
            </p>

            {/* 4 Feature Pills with Cutout Radius */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-black/25 hover:bg-black/35 transition px-3 py-2 rounded-xl border border-[#F6C84C]/45 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <Leaf size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">100% Natural</span>
              </div>
              <div className="bg-black/25 hover:bg-black/35 transition px-3 py-2 rounded-xl border border-[#F6C84C]/45 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <ShieldCheck size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">No Charcoal</span>
              </div>
              <div className="bg-black/25 hover:bg-black/35 transition px-3 py-2 rounded-xl border border-[#F6C84C]/45 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <FlaskConical size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">No Chemicals</span>
              </div>
              <div className="bg-black/25 hover:bg-black/35 transition px-3 py-2 rounded-xl border border-[#F6C84C]/45 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <Award size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">Made in India</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Shop Categories */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-heading font-bold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1.5">
              <span>✦</span> Shop Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/90">
              <li><Link href="/category/Agarbatti" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Agarbatti &amp; Flora</Link></li>
              <li><Link href="/category/Camphor" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Bhimseni Camphor</Link></li>
              <li><Link href="/category/Sambrani" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Cup Sambrani</Link></li>
              <li><Link href="/category/Loban" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Loban &amp; Dhoop</Link></li>
              <li><Link href="/category/Dhoop" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Sandalwood Cones</Link></li>
              <li><Link href="/collections" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Pooja Essentials</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Gift Sets &amp; Bundles</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: Quick Links */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-heading font-bold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1.5">
              <span>✦</span> Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/90">
              <li><Link href="/about" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">About Us &amp; Story</Link></li>
              <li><Link href="/about#benefits" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Natural Benefits</Link></li>
              <li><Link href="/blog" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Blog &amp; Wellness</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Special Offers</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Help & Support */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-heading font-bold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1.5">
              <span>✦</span> Help &amp; Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/90">
              <li><Link href="/orders" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Track Your Order</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Shipping Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">Returns &amp; Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition hover:translate-x-1 inline-block">FAQs &amp; Support</Link></li>
            </ul>
          </div>

          {/* COLUMN 5: Newsletter & Community */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-heading font-bold text-xs text-[#F6C84C] uppercase tracking-wider flex items-center gap-1.5">
              <span>✦</span> Join Our Circle
            </h4>
            <p className="text-xs text-white/85 leading-relaxed">
              Get updates on new launches, offers and wellness tips.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs text-[#173B3A] bg-[#FFF4D6] px-3.5 py-2.5 rounded-xl focus:outline-none font-medium placeholder:text-[#173B3A]/60 shadow-inner"
              />
              <button className="w-full bg-[#F47A20] hover:bg-[#F6C84C] hover:text-[#173B3A] text-white py-2.5 rounded-xl font-bold text-xs transition shadow-md active:scale-95">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/75">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved.</p>
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

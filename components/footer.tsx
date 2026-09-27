"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, Heart, ArrowRight,
  Leaf, FlaskConical, ShieldCheck, Award, Sparkles
} from "lucide-react";
import { MandalaMotif } from "./illustrations";

export function Footer() {
  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-[#8f122a] via-[#9E1830] to-[#680b1e] text-white font-sans rounded-t-[36px] sm:rounded-t-[56px] border-t-4 border-[#F6C84C] shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
      
      {/* 1. Mountain Peak & Temple Arch Silhouette Top SVG */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 w-full overflow-hidden opacity-30" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
          {/* Mountain Ridge Layers */}
          <path d="M0,80 C180,30 320,70 540,25 C760,-15 920,60 1140,20 C1280,-5 1380,40 1440,30 L1440,0 L0,0 Z" fill="#ffd54c" fillOpacity="0.3" />
          <path d="M0,95 C220,50 440,90 720,40 C980,0 1200,75 1440,50 L1440,0 L0,0 Z" fill="#680b1e" fillOpacity="0.5" />
        </svg>
      </div>

      {/* 2. Marigold Floral Garlands (Toran) SVG Banner along top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 w-full flex justify-between overflow-hidden opacity-80" aria-hidden="true">
        <div className="w-full flex justify-around items-start">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center -mt-1">
              <span className="h-3 w-3 rounded-full bg-[#f47a20] shadow-xs border border-[#ffd54c]" />
              <span className="h-2 w-2 rounded-full bg-[#ffd54c] -mt-1 shadow-xs" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Left Temple Pillar (Thoon) Artwork */}
      <div className="pointer-events-none absolute -left-6 sm:-left-2 bottom-0 top-12 z-0 w-44 sm:w-64 lg:w-72 opacity-25 lg:opacity-35 select-none">
        <div className="relative h-full w-full">
          <Image
            src="/images/hm_temple_thoon_pillar.png"
            alt="Sacred South Indian temple pillar with marigold garlands and brass bell"
            fill
            sizes="(max-width: 640px) 180px, 300px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 4. Right Temple Pillar (Thoon) Artwork (Mirrored) */}
      <div className="pointer-events-none absolute -right-6 sm:-right-2 bottom-0 top-12 z-0 w-44 sm:w-64 lg:w-72 opacity-25 lg:opacity-35 select-none -scale-x-100">
        <div className="relative h-full w-full">
          <Image
            src="/images/hm_temple_thoon_pillar.png"
            alt="Sacred South Indian temple pillar with marigold garlands and brass bell"
            fill
            sizes="(max-width: 640px) 180px, 300px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 5. Central Background Mountain Temple Landscape */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10 lg:opacity-15 select-none overflow-hidden">
        <div className="relative h-[120%] w-[120%] max-w-7xl">
          <Image
            src="/images/hm_footer_mountain_temple.png"
            alt="Western Ghats sacred mountain temple landscape with marigolds and pillars"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 6. Rotating Sacred Mandala Motif */}
      <MandalaMotif className="mandala-footer absolute -bottom-36 -right-24 z-[1] h-[440px] w-[440px] opacity-15" speed={64} strokeColor="#FFD974" strokeWidth={2} />

      {/* 7. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 relative z-10 w-full">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 border-b border-white/20 pb-12">
          
          {/* COLUMN 1: Official Brand Logo */}
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
              <div className="bg-black/20 hover:bg-black/30 transition px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <Leaf size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">100% Natural</span>
              </div>
              <div className="bg-black/20 hover:bg-black/30 transition px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <ShieldCheck size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">No Charcoal</span>
              </div>
              <div className="bg-black/20 hover:bg-black/30 transition px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
                <FlaskConical size={15} className="text-[#F6C84C] shrink-0" />
                <span className="text-white/95">No Chemicals</span>
              </div>
              <div className="bg-black/20 hover:bg-black/30 transition px-3 py-2 rounded-xl border border-[#F6C84C]/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
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

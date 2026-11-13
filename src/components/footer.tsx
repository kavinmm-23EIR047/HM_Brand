"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Leaf, FlaskConical, ShieldCheck, Award,
  MapPin, Phone, Mail, ChevronDown, Sparkles
} from "lucide-react";
import { MandalaMotif, ToranMaalai } from "./illustrations";
import { CONTACT_ADDRESS, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/contact-info";
import { EditorialStarSvg, IndiaTricolorMarkSvg } from "@/components/sacred-icons";

function InstagramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* ── ILLUSTRATOR-STYLE SACRED VECTOR MOTIFS ── */

/** Illustrator-style traditional South Indian brass deepam / kuthuvilakku with golden radiating flame */
function IllustratorBrassDiya({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Golden Radiating Halo */}
      <circle cx="50" cy="38" r="28" fill="#FDE68A" opacity="0.18" />
      <circle cx="50" cy="38" r="18" fill="#F59E0B" opacity="0.25" />
      {/* Tiered Brass Lamp Base */}
      <ellipse cx="50" cy="88" rx="28" ry="7" fill="#C89B3C" stroke="#78350F" strokeWidth="1.8" />
      <path d="M36 88 C36 80 44 76 44 70 L56 70 C56 76 64 80 64 88 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
      {/* Central Brass Pillar Stem */}
      <rect x="47" y="58" width="6" height="13" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      <ellipse cx="50" cy="58" rx="14" ry="4" fill="#C89B3C" stroke="#78350F" strokeWidth="1.5" />
      {/* Lamp Oil Bowl */}
      <path d="M26 48 C26 64 74 64 74 48 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      <ellipse cx="50" cy="48" rx="24" ry="7" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
      {/* Sacred Ghee/Oil Reservoir */}
      <ellipse cx="50" cy="48" rx="18" ry="4.5" fill="#D97706" />
      {/* Sacred Wick */}
      <path d="M50 48 L50 38" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sacred Divine Flame (Auspicious Red, Orange & Gold) */}
      <path d="M50 16 C38 28 42 38 50 42 C58 38 62 28 50 16 Z" fill="#DC2626" />
      <path d="M50 22 C43 30 45 37 50 40 C55 37 57 30 50 22 Z" fill="#F59E0B" />
      <path d="M50 28 C47 33 48 37 50 39 C52 37 53 33 50 28 Z" fill="#FEF08A" />
      <circle cx="50" cy="35" r="2.5" fill="#FFFFFF" />
      {/* Auspicious Red Marigold Flower Petal */}
      <path d="M20 84 C14 80 18 74 24 76 C28 78 26 86 20 84 Z" fill="#E11D48" opacity="0.9" />
      <circle cx="21" cy="79" r="2" fill="#FDE68A" />
    </svg>
  );
}

/** Illustrator-style brass incense burner with burning sticks and wafting curls of sacred smoke */
function IllustratorAgarbattiStand({ className = "h-14 w-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Wafting White/Gold Incense Smoke Streams */}
      <path d="M42 24 C34 14 46 8 38 2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M55 18 C48 10 58 4 52 -1" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d="M68 20 C62 12 72 6 65 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M80 26 C74 16 84 10 78 4" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      {/* Slender Incense Sticks */}
      <path d="M38 58 L42 24" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 58 L55 18" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 58 L68 20" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M76 58 L80 26" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      {/* Glowing Embers at Tips */}
      <circle cx="42" cy="24" r="2.5" fill="#EF4444" />
      <circle cx="55" cy="18" r="2.5" fill="#F59E0B" />
      <circle cx="68" cy="20" r="2.5" fill="#EF4444" />
      <circle cx="80" cy="26" r="2.5" fill="#F59E0B" />
      <circle cx="55" cy="18" r="1.2" fill="#FFFFFF" />
      {/* Brass Boat Incense Burner */}
      <path d="M16 60 C26 74 94 74 104 60 L96 74 H24 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
      <ellipse cx="60" cy="60" rx="44" ry="7" fill="#C89B3C" stroke="#78350F" strokeWidth="1.8" />
      <ellipse cx="60" cy="60" rx="36" ry="4" fill="#78350F" />
      {/* Decorative Floral Accents */}
      <circle cx="18" cy="56" r="3" fill="#F59E0B" />
      <circle cx="102" cy="56" r="3" fill="#F59E0B" />
    </svg>
  );
}

/** Illustrator-style sacred South Indian temple gopuram line-art */
function IllustratorTempleGopuram({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* 5 Sacred Kalasams on Top */}
      <circle cx="50" cy="10" r="3" fill="#FDE68A" />
      <circle cx="42" cy="13" r="2.5" fill="#C89B3C" />
      <circle cx="58" cy="13" r="2.5" fill="#C89B3C" />
      <circle cx="34" cy="16" r="2" fill="#FDE68A" />
      <circle cx="66" cy="16" r="2" fill="#FDE68A" />
      {/* Gopuram Roof Arch */}
      <path d="M30 20 Q50 14 70 20 L68 28 H32 Z" stroke="#C89B3C" strokeWidth="1.5" fill="#C89B3C" fillOpacity="0.15" />
      {/* Tier 1 */}
      <path d="M28 28 H72 L70 42 H30 Z" stroke="#C89B3C" strokeWidth="1.5" fill="#C89B3C" fillOpacity="0.1" />
      <rect x="44" y="32" width="12" height="10" rx="1" stroke="#FDE68A" strokeWidth="1.2" />
      {/* Tier 2 */}
      <path d="M24 42 H76 L74 60 H26 Z" stroke="#C89B3C" strokeWidth="1.5" fill="#C89B3C" fillOpacity="0.12" />
      <rect x="42" y="46" width="16" height="14" rx="1" stroke="#FDE68A" strokeWidth="1.2" />
      {/* Tier 3 */}
      <path d="M20 60 H80 L78 82 H22 Z" stroke="#C89B3C" strokeWidth="1.5" fill="#C89B3C" fillOpacity="0.15" />
      <rect x="40" y="66" width="20" height="16" rx="2" stroke="#FDE68A" strokeWidth="1.2" />
      {/* Base Gateway Arch */}
      <path d="M16 82 H84 V115 H16 Z" stroke="#C89B3C" strokeWidth="1.8" fill="#C89B3C" fillOpacity="0.1" />
      <path d="M36 115 V96 Q50 88 64 96 V115 Z" stroke="#FDE68A" strokeWidth="1.8" fill="#FDE68A" fillOpacity="0.2" />
    </svg>
  );
}

/* ── Accordion section — collapsible on mobile, always open on desktop ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#C89B3C]/20 md:border-none">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between py-3.5 text-left font-brand font-bold text-xs uppercase tracking-widest text-[#FDE68A] md:hidden cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <EditorialStarSvg className="h-3.5 w-3.5 text-[#C89B3C]" />
          <span>{title}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-[#C89B3C] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop heading */}
      <h4 className="hidden md:flex items-center gap-2 pb-3.5 font-brand font-bold text-sm uppercase tracking-widest text-[#FDE68A] border-b border-[#C89B3C]/40">
        <EditorialStarSvg className="h-3.5 w-3.5 text-[#C89B3C]" />
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </h4>

      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 md:block ${open ? "max-h-96 pt-2 pb-4" : "max-h-0 md:max-h-none"}`}>
        <div className="md:pt-4">{children}</div>
      </div>
    </div>
  );
}

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  return (
    <footer
      id="site-footer"
      className="relative w-full bg-gradient-to-b from-[#9E1830] via-[#851327] to-[#6E0F1E] text-white font-sans border-t-2 border-[#C89B3C] shadow-2xl"
    >

      {/* ── 1. FESTIVE TORAN GARLAND (Mango Leaves & Marigolds at Top Rim) ── */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-20">
        <ToranMaalai />
      </div>

      {/* ── 2. BACKGROUND SACRED ILLUSTRATOR MOTIFS ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Left Side Illustrator Temple Gopuram */}
        <div className="absolute top-12 -left-8 opacity-15 rotate-6">
          <IllustratorTempleGopuram className="h-64 w-64" />
        </div>
        {/* Right Side Rotating Mandala */}
        <MandalaMotif
          className="absolute -bottom-24 -right-24 h-[440px] w-[440px] opacity-15"
          speed={60}
          counterRotate={true}
          strokeColor="#FDE68A"
          strokeWidth={1.2}
          withDrawingEffect={true}
          withGlow={true}
        />
      </div>

      {/* ── 3. BRAND TOP ROW (Logo + Trust Badges with Generous Height) ── */}
      <div className="relative z-10 border-b border-[#C89B3C]/30 bg-black/15">
        <div className="page-container py-6 sm:py-7 flex flex-wrap items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3.5 group" aria-label="HM Brand home">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-md">
              <Image src="/images/brand_logo_gold_transparent.png" alt="HM Brand" fill unoptimized sizes="56px" className="object-contain" />
            </div>
            <div className="leading-tight">
              <span className="font-brand text-lg sm:text-xl font-bold tracking-[0.16em] uppercase text-white block">
                HM <span className="text-[#FDE68A]">BRAND</span>
              </span>
              <span className="font-tagline text-xs text-[#FDE68A]/90 tracking-[0.16em] uppercase font-bold whitespace-nowrap block mt-0.5">
                Discover the Divine Within
              </span>
            </div>
          </Link>

          {/* Illustrator-Style Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {[
              { icon: <Leaf size={14} />, label: "100% Natural Botanicals" },
              { icon: <ShieldCheck size={14} />, label: "Charcoal-Free Resins" },
              { icon: <FlaskConical size={14} />, label: "Zero Toxic Chemicals" },
              { icon: <Award size={14} />, label: "Handcrafted in Coimbatore" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-[#C89B3C]/40 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-xs transition-colors backdrop-blur-xs"
              >
                <span className="text-[#FDE68A]">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. MAIN LINK GRID (Increased Height & Illustrator Artwork) ── */}
      <div className="relative z-10 page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#C89B3C]/25">

          {/* BOX 1 — Categories */}
          <div className="md:pr-8">
            <AccordionSection title="Categories">
              <ul className="space-y-3 text-sm text-white/90 font-medium">
                <li><Link href="/shop?category=Agarbatti" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Agarbatti &amp; Flora Sticks</Link></li>
                <li><Link href="/shop?category=Camphor" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Pure Bhimseni Camphor</Link></li>
                <li><Link href="/shop?category=Havan%20Cups" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Cup Sambrani &amp; Havan Cups</Link></li>
                <li><Link href="/shop?category=Dhoop%20Stick" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Bambooless Dhoop Sticks</Link></li>
                <li><Link href="/shop?category=Incense%20Cones" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Natural Incense Cones</Link></li>
                <li><Link href="/shop?category=Family%20Pack" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">10-in-1 Divine Family Pack</Link></li>
              </ul>
              {/* Illustrator Vector Accent */}
              <div className="pt-5 hidden md:block opacity-85">
                <IllustratorAgarbattiStand className="h-12 w-24 text-[#C89B3C]" />
              </div>
            </AccordionSection>
          </div>

          {/* BOX 2 — Quick Links */}
          <div className="md:px-8">
            <AccordionSection title="Quick Links">
              <ul className="space-y-3 text-sm text-white/90 font-medium">
                <li><Link href="/shop" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">All Sacred Collections</Link></li>
                <li><Link href="/about" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Our Vedic Story</Link></li>
                <li><Link href="/about#story" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Heritage &amp; Purity Promise</Link></li>
                <li><Link href="/wishlist" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Saved Wishlist</Link></li>
                <li><Link href="/account" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">My Customer Account</Link></li>
                <li><Link href="/contact" className="hover:text-[#FDE68A] hover:translate-x-1 transition-all inline-block">Contact Workshop</Link></li>
              </ul>
            </AccordionSection>
          </div>

          {/* BOX 3 — Contact & Workshop */}
          <div className="md:px-8">
            <AccordionSection title="Contact &amp; Workshop">
              <div className="space-y-3.5 text-xs sm:text-[13px] text-white/90 font-medium">
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin size={16} className="text-[#FDE68A] shrink-0 mt-0.5" />
                  <span>{CONTACT_ADDRESS}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-[#FDE68A] shrink-0" />
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-[#FDE68A] transition">{CONTACT_PHONE_DISPLAY}</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={15} className="text-[#FDE68A] shrink-0" />
                  <a href="mailto:jayamassociatescoimbatore@gmail.com" className="hover:text-[#FDE68A] transition break-all">jayamassociatescoimbatore@gmail.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <InstagramIcon size={15} className="text-[#FDE68A] shrink-0" />
                  <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FDE68A] hover:underline">@hmagarbatti5</a>
                </p>
              </div>
            </AccordionSection>
          </div>

          {/* BOX 4 — Newsletter & Brass Diya Art */}
          <div className="md:pl-8">
            <AccordionSection title="Join Our Circle">
              <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed mb-4">
                Receive auspicious festival offers, new fragrance launches &amp; sacred pooja wellness tips.
              </p>
              {newsletterSubscribed ? (
                <div className="rounded-[10px] border border-[#FDE68A]/60 bg-white/15 p-4 text-xs font-semibold text-[#FDE68A]">
                  Thank you! You are subscribed for seasonal divine HM Brand updates.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newsletterEmail.trim()) return;
                    setNewsletterSubscribed(true);
                    setNewsletterEmail("");
                  }}
                  className="space-y-2.5"
                >
                  <input
                    suppressHydrationWarning
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for updates"
                    className="w-full h-11 rounded-[10px] text-xs text-[#302923] bg-white px-3.5 focus:outline-none focus:ring-2 focus:ring-[#C89B3C] font-medium placeholder:text-stone-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="w-full h-11 rounded-[10px] bg-[#C89B3C] hover:bg-[#D4A84B] text-stone-950 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs border border-[#FDE68A]/40 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-stone-950" />
                    <span>Subscribe for Blessings</span>
                  </button>
                </form>
              )}

              {/* Illustrator Brass Diya Vector Art */}
              <div className="mt-5 flex items-center gap-3 pt-3 border-t border-[#C89B3C]/25">
                <IllustratorBrassDiya className="h-12 w-12 shrink-0 drop-shadow-md" />
                <p className="font-sans text-[11px] text-white/80 leading-snug">
                  Zero Charcoal • Pure Herbal Essential Oils • 100% Traditional South Indian Craftsmanship
                </p>
              </div>
            </AccordionSection>
          </div>

        </div>
      </div>

      {/* ── 5. BOTTOM BAR (Admin, Tagline, Developer Credits) ── */}
      <div className="relative z-10 border-t border-[#C89B3C]/30 bg-black/20">
        <div className="page-container py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/80 text-center">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved. •{" "}
            <Link href="/admin" className="hover:text-[#FDE68A] transition underline font-semibold">Admin</Link>
          </p>
          <div className="flex items-center gap-1.5 font-tagline font-bold tracking-[0.16em] uppercase text-[#FDE68A]">
            <span>Discover the Divine Within</span>
            <Heart size={12} className="text-[#FF5400] fill-[#FF5400] ml-1" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <span>Handcrafted in Coimbatore, India</span>
              <IndiaTricolorMarkSvg className="h-3.5 w-5" />
            </span>
            <span className="text-white/40">•</span>
            <span>
              Developed by{" "}
              <a
                href="https://akwebflairtechnologies.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FDE68A] hover:underline font-semibold transition-colors"
              >
                akwebflairtechnologies.in
              </a>
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}


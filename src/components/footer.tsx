"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, Leaf, FlaskConical, ShieldCheck, Award,
  MapPin, Phone, Mail, ChevronDown,
} from "lucide-react";
import { MandalaMotif, ToranMaalai } from "./illustrations";
import { CONTACT_ADDRESS, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/contact-info";

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

/* ── Accordion section — collapsible on mobile, always open on desktop ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-none">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between py-3 text-left font-brand font-bold text-xs uppercase tracking-widest text-brand-accent md:hidden"
      >
        <span className="flex items-center gap-1.5"><span>✦</span> {title}</span>
        <ChevronDown
          size={15}
          className={`text-brand-accent transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop heading */}
      <h4 className="hidden md:flex items-center gap-1.5 pb-3 font-brand font-bold text-sm uppercase tracking-widest text-brand-accent border-b border-brand-accent/30">
        <span>✦</span> <span dangerouslySetInnerHTML={{ __html: title }} />
      </h4>

      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 md:block ${open ? "max-h-96 pt-2 pb-3" : "max-h-0 md:max-h-none"}`}>
        <div className="md:pt-4">{children}</div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative w-full bg-gradient-to-b from-brand-red-black via-brand-primary to-brand-red-shadow text-white font-sans border-t-2 border-brand-accent/40"
    >

      {/* TORAN GARLAND */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none z-20">
        <ToranMaalai />
      </div>

      {/* AMBIENT MANDALA */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <MandalaMotif
          className="absolute -bottom-20 -right-20 h-[380px] w-[380px] opacity-10"
          speed={70}
          counterRotate={true}
          strokeColor="var(--brand-accent)"
          strokeWidth={1.2}
          withDrawingEffect={true}
          withGlow={true}
        />
      </div>

      {/* ── BRAND TOP BAR ── */}
      <div className="relative z-10 border-b border-white/10 bg-black/20">
        <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group" aria-label="HM Brand home">
            <div className="relative h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image src="/images/brand_logo_gold_transparent.png" alt="HM Brand" fill unoptimized sizes="44px" className="object-contain drop-shadow-xl" />
            </div>
            <div className="leading-tight">
              <span className="font-brand text-lg font-bold tracking-[0.16em] uppercase text-white block">
                HM <span className="text-brand-accent">BRAND</span>
              </span>
              <span className="font-tagline text-[10px] text-brand-accent-soft tracking-[0.18em] uppercase font-bold whitespace-nowrap">
                Discover the Divine Within
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Leaf size={13} />, label: "100% Natural" },
              { icon: <ShieldCheck size={13} />, label: "No Charcoal" },
              { icon: <FlaskConical size={13} />, label: "No Chemicals" },
              { icon: <Award size={13} />, label: "Made in India" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/10 border border-brand-accent/30 px-2.5 py-1 text-[11px] font-semibold text-white/90">
                <span className="text-brand-accent">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LINK GRID ── */}
      <div className="relative z-10 max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="md:grid md:grid-cols-4 md:divide-x md:divide-white/10">

          {/* BOX 1 — Categories */}
          <div className="md:pr-6">
            <AccordionSection title="Categories">
              <ul className="space-y-2 text-sm text-white/85 font-medium">
                <li><Link href="/category/Agarbatti" className="hover:text-brand-accent transition">Agarbatti &amp; Flora</Link></li>
                <li><Link href="/category/Camphor" className="hover:text-brand-accent transition">Bhimseni Camphor</Link></li>
                <li><Link href="/category/Sambrani" className="hover:text-brand-accent transition">Cup Sambrani</Link></li>
                <li><Link href="/category/Loban" className="hover:text-brand-accent transition">Loban &amp; Dhoop</Link></li>
                <li><Link href="/category/Dhoop" className="hover:text-brand-accent transition">Sandalwood Cones</Link></li>
                <li><Link href="/offers" className="hover:text-brand-accent transition">10-in-1 Family Pack</Link></li>
              </ul>
            </AccordionSection>
          </div>

          {/* BOX 2 — Quick Links */}
          <div className="md:px-6">
            <AccordionSection title="Quick Links">
              <ul className="space-y-2 text-sm text-white/85 font-medium">
                <li><Link href="/about" className="hover:text-brand-accent transition">Our Story</Link></li>
                <li><Link href="/benefits" className="hover:text-brand-accent transition">Natural Benefits</Link></li>
                <li><Link href="/blog" className="hover:text-brand-accent transition">Blog &amp; Wellness</Link></li>
                <li><Link href="/collections" className="hover:text-brand-accent transition">Collections</Link></li>
                <li><Link href="/offers" className="hover:text-brand-accent transition">Special Offers</Link></li>
                <li><Link href="/contact" className="hover:text-brand-accent transition">Contact Us</Link></li>
              </ul>
            </AccordionSection>
          </div>

          {/* BOX 3 — Contact */}
          <div className="md:px-6">
            <AccordionSection title="Contact &amp; Workshop">
              <div className="space-y-2.5 text-xs text-white/85 font-medium">
                <p className="flex items-start gap-1.5 leading-snug">
                  <MapPin size={14} className="text-brand-accent shrink-0 mt-0.5" />
                  <span>{CONTACT_ADDRESS}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone size={13} className="text-brand-accent shrink-0" />
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-brand-accent transition">{CONTACT_PHONE_DISPLAY}</a>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail size={13} className="text-brand-accent shrink-0" />
                  <a href="mailto:jayamassociatescoimbatore@gmail.com" className="hover:text-brand-accent transition text-[11px] break-all">jayamassociatescoimbatore@gmail.com</a>
                </p>
                <p className="flex items-center gap-1.5">
                  <InstagramIcon size={13} className="text-brand-accent shrink-0" />
                  <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-accent hover:underline">@hmagarbatti5</a>
                </p>
              </div>
            </AccordionSection>
          </div>

          {/* BOX 4 — Newsletter */}
          <div className="md:pl-6">
            <AccordionSection title="Join Our Circle">
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                Receive auspicious offers, new launches &amp; wellness tips.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 text-xs text-brand-ink bg-brand-surface-warm px-3 py-2.5 focus:outline-none font-medium placeholder:text-brand-ink/60"
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="bg-brand-orange hover:bg-brand-accent hover:text-brand-ink text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </AccordionSection>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 border-t border-white/15 bg-black/25">
        <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-white/70 text-center">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved. •{" "}
            <Link href="/admin" className="hover:text-brand-accent transition underline font-semibold">Admin</Link>
          </p>
          <div className="flex items-center gap-1.5 font-tagline font-bold tracking-[0.16em] uppercase text-brand-accent">
            <span>Discover the Divine Within</span>
            <Heart size={12} className="text-brand-orange fill-brand-orange ml-1" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Handcrafted in Coimbatore, India 🇮🇳</span>
            <span className="text-white/40">•</span>
            <span>
              Developed by{" "}
              <a
                href="https://akwebflairtechnologies.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline font-semibold transition-colors"
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


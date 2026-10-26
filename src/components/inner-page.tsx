"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MandalaMotif } from "./illustrations";

export function InnerPage({
  eyebrow,
  title,
  subtitle,
  showHero = true,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  showHero?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-sandalLight text-brand-ink font-sans antialiased selection:bg-brand-accent selection:text-brand-ink">
      <div>
        <Navigation />

        {/* Premium Temple Heritage Page Banner */}
        {showHero && (
          <section className="relative overflow-hidden bg-gradient-to-r from-brand-surface-warm via-brand-surface to-brand-surface-warm py-8 sm:py-10">
            {/* Ambient Background Glow & Rotating Golden Mandala */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 sm:h-96 sm:w-96 opacity-15">
              <MandalaMotif speed={90} strokeColor="var(--brand-orange)" strokeWidth={1.5} counterRotate={true} />
            </div>
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 opacity-10">
              <MandalaMotif speed={110} strokeColor="var(--brand-primary)" strokeWidth={1.4} />
            </div>

            <div className="page-container relative flex items-center justify-between gap-8">
              <div className="max-w-3xl space-y-3">
                
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-brand-brown/80">
                  <Link href="/" className="inline-flex items-center gap-1 transition hover:text-brand-primary">
                    <Home size={13} className="text-brand-orange" />
                    <span>Home</span>
                  </Link>
                  <ChevronRight size={13} className="text-brand-gold" />
                  <span className="truncate text-brand-primary font-bold">{title}</span>
                </nav>

                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1 font-brand text-ui-11 sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase shadow-2xs border border-brand-border">
                  <Sparkles size={13} className="text-brand-orange" />
                  <span>{eyebrow}</span>
                </div>

                {/* Page Title */}
                <h1 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold leading-tight tracking-wide text-brand-heading uppercase">
                  {title}
                </h1>

                {/* Subtitle / Feel-Good Copy */}
                {subtitle && (
                  <p className="max-w-2xl font-sans text-xs sm:text-sm leading-relaxed text-brand-slate font-normal">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Decorative Golden Sunburst Medallion (Desktop) */}
              <div className="hidden lg:flex shrink-0 items-center justify-center relative">
                <div className="h-36 w-36 rounded-full bg-brand-surface-warm p-2 flex items-center justify-center shadow-sm border border-brand-accent/30">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-primary to-[#6A0C1E] flex flex-col items-center justify-center text-center px-2 py-3 shadow-md border border-brand-accent/25 overflow-hidden">
                    <span className="font-brand text-ui-11 sm:text-xs font-bold text-brand-accent-soft uppercase tracking-wider leading-tight whitespace-nowrap">
                      Coimbatore
                    </span>
                    <span className="font-brand text-ui-9 sm:text-ui-10 font-bold text-white uppercase tracking-widest mt-1 leading-tight">
                      Pure<br />Heritage
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* Main Content Body */}
        <main>{children}</main>
      </div>

      <Footer />
    </div>
  );
}

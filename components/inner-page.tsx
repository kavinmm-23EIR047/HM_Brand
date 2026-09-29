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
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF8E7] text-[#173B3A] font-sans antialiased selection:bg-[#F6C84C] selection:text-[#173B3A]">
      <div>
        <Navigation />

        {/* Premium Temple Heritage Page Banner */}
        {showHero && (
          <section className="relative overflow-hidden border-b border-[#F6C84C]/40 bg-gradient-to-r from-[#FFF4D6] via-[#FFF8E7] to-[#FFF4D6] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 shadow-xs">
            {/* Ambient Background Glow & Rotating Golden Mandala */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 sm:h-96 sm:w-96 opacity-15">
              <MandalaMotif speed={90} strokeColor="#F47A20" strokeWidth={1.5} counterRotate={true} />
            </div>
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 opacity-10">
              <MandalaMotif speed={110} strokeColor="#9E1830" strokeWidth={1.4} />
            </div>

            <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-8">
              <div className="max-w-3xl space-y-3">
                
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#6B4226]/80">
                  <Link href="/" className="inline-flex items-center gap-1 transition hover:text-[#9E1830]">
                    <Home size={13} className="text-[#F47A20]" />
                    <span>Home</span>
                  </Link>
                  <ChevronRight size={13} className="text-[#C89B3C]" />
                  <span className="truncate text-[#9E1830] font-bold">{title}</span>
                </nav>

                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F6C84C]/70 bg-white/80 px-3 py-1 text-[10px] sm:text-xs font-extrabold tracking-widest text-[#9E1830] uppercase shadow-xs backdrop-blur-xs">
                  <Sparkles size={13} className="text-[#F47A20] animate-pulse" />
                  <span>{eyebrow}</span>
                </div>

                {/* Page Title */}
                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#173B3A] sm:text-4xl lg:text-5xl">
                  {title}
                </h1>

                {/* Subtitle / Feel-Good Copy */}
                {subtitle && (
                  <p className="max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-[#292524]/85">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Decorative Golden Sunburst Medallion (Desktop) */}
              <div className="hidden lg:flex shrink-0 items-center justify-center relative">
                <div className="h-32 w-32 rounded-full border-2 border-dashed border-[#F6C84C]/70 bg-[#FFF4D6] p-2 flex items-center justify-center shadow-inner">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-[#9E1830] to-[#6A0C1E] flex flex-col items-center justify-center text-center p-3 shadow-md">
                    <span className="font-script text-xl text-[#F6C84C]">Coimbatore</span>
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest mt-0.5">Pure Heritage</span>
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

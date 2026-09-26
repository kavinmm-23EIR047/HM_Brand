"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Home, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Leaf, Lotus } from "./illustrations";

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
    <div className="min-h-screen flex flex-col justify-between bg-[#fffaf0] text-[#173b3a]">
      <div>
        <Navigation />

        {/* Page Banner Header */}
        {showHero && <section className="relative overflow-hidden border-b border-[#eadfc9] bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Leaf className="pointer-events-none absolute -right-5 -top-16 h-56 w-44 rotate-12 text-[#37824c]/10" />
          <div className="relative mx-auto flex max-w-[1368px] items-center justify-between gap-8">
            <div className="max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#778078]">
                <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-[#a90c35]"><Home size={12} />Home</Link>
                <ChevronRight size={12} />
                <span className="truncate text-[#a90c35]">{title}</span>
              </nav>
              <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[.18em] text-[#a90c35] uppercase">
                <Sparkles size={13} className="text-[#e28b2d]" />
                <span>{eyebrow}</span>
              </div>
              <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[-.04em] text-[#173b3a] sm:text-4xl lg:text-[42px]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#52625a] sm:text-[15px]">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="relative mr-4 hidden h-36 w-44 shrink-0 items-center justify-center rounded-full bg-[#e7efda] sm:flex lg:mr-14 lg:h-40 lg:w-48">
              <div className="absolute inset-3 rounded-full border border-[#8baa73]/25" />
              <Lotus className="relative z-10 h-32 w-40 lg:h-36 lg:w-44" />
            </div>
          </div>
        </section>}

        {/* Inner Content */}
        <main>{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export function StoryTile({
  title,
  copy,
  href = "#",
  tag,
}: {
  title: string;
  copy: string;
  href?: string;
  tag?: string;
}) {
  return (
    <article className="bg-[#FFF8E7] p-7 rounded-xl border-2 border-[#C89B3C]/40 hover:border-[#6B4226] transition-all duration-300 flex flex-col justify-between hover:shadow-solid-sm group">
      <div>
        {tag && (
          <span className="inline-block bg-[#E85D04] text-[#FFF8E7] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mb-3">
            {tag}
          </span>
        )}
        <div className="w-10 h-10 rounded-full bg-[#F4D35E]/40 border border-[#6B4226]/20 flex items-center justify-center text-xl mb-4 text-[#6B4226]">
          🪔
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-[#6B4226] group-hover:text-[#E85D04] transition">
          {title}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#292524]/75 leading-relaxed font-sans">
          {copy}
        </p>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#B23A48] group-hover:text-[#E85D04] uppercase transition"
      >
        Explore Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
      </Link>
    </article>
  );
}

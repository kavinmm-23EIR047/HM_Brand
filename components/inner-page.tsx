"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function InnerPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF8E7] text-[#292524]">
      <div>
        <Navigation />

        {/* Page Banner Header */}
        <section className="bg-[#F4D35E]/20 border-b-2 border-[#C89B3C]/40 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#B23A48] uppercase">
              <Sparkles size={14} />
              <span>{eyebrow}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#6B4226] mt-3 max-w-3xl leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-[#292524]/75 max-w-2xl leading-relaxed font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </section>

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

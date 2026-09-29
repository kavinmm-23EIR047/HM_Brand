"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Leaf } from "./illustrations";
import { RitualArt } from "./illustrations/RitualArt";

export function TrustStrip() {
  const pillars = [
    {
      art: "natural" as const,
      badge: "100% Botanical",
      title: "100% Natural",
      subtitle: "Pure Herbs & Resins",
      desc: "Made with authentic flower oils, wood extracts & sacred resins.",
      accent: "text-[#3F7D45]",
      circleBg: "bg-[#3F7D45]/10 border-[#3F7D45]/30",
    },
    {
      art: "clean" as const,
      badge: "Zero Soot",
      title: "No Charcoal",
      subtitle: "Clean & Fresh Air",
      desc: "Pure aromatic smoke without choking carbon soot or black residue.",
      accent: "text-[#4C7FA8]",
      circleBg: "bg-[#4C7FA8]/10 border-[#4C7FA8]/30",
    },
    {
      art: "chemical-free" as const,
      badge: "Non-Toxic",
      title: "No Chemicals",
      subtitle: "Safe for Family & Kids",
      desc: "Free from synthetic DEP, artificial binders & harmful phthalates.",
      accent: "text-[#9E1830]",
      circleBg: "bg-[#9E1830]/10 border-[#9E1830]/30",
    },
    {
      art: "india" as const,
      badge: "Vedic Heritage",
      title: "Made in India",
      subtitle: "Coimbatore Crafted",
      desc: "Hand-rolled and packed with traditional Vedic care in Tamil Nadu.",
      accent: "text-[#F47A20]",
      circleBg: "bg-[#F47A20]/10 border-[#F47A20]/30",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#FFF8E7] py-8 sm:py-12 border-y border-[#F6C84C]/35 font-sans">
      <Leaf className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rotate-12 text-[#3F7D45]/10" />
      <Leaf className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 -rotate-45 text-[#3F7D45]/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] border border-[#F6C84C] px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9E1830] mb-2 shadow-xs">
            <Sparkles size={13} className="text-[#F47A20]" />
            <span>THE HM PURITY PROMISE</span>
            <Sparkles size={13} className="text-[#F47A20]" />
          </div>
          <h2 className="font-heading text-xl min-[360px]:text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
            Crafted for <span className="text-[#9E1830]">Pure Devotion</span> & Mindful Living
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 sm:p-5 border border-[#F6C84C]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Art & Badge */}
                <div className="flex items-start justify-between gap-1 mb-2.5">
                  <div className={`h-10 w-10 min-[360px]:h-12 min-[360px]:w-12 sm:h-14 sm:w-14 rounded-2xl border flex items-center justify-center p-1.5 ${item.circleBg} group-hover:scale-105 transition-transform duration-300`}>
                    <RitualArt kind={item.art} className="h-full w-full object-contain" />
                  </div>
                  <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#173B3A]/70 bg-[#FFF4D6] px-1.5 py-0.5 sm:px-2 rounded-md">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-heading font-extrabold text-xs min-[360px]:text-sm sm:text-base lg:text-lg text-[#173B3A] leading-tight group-hover:text-[#9E1830] transition">
                  {item.title}
                </h3>
                <p className={`font-sans text-[11px] sm:text-xs font-bold mt-0.5 ${item.accent}`}>
                  {item.subtitle}
                </p>
                <p className="font-sans text-[10px] sm:text-xs text-[#173B3A]/70 leading-relaxed mt-1.5 hidden min-[400px]:block">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Guarantee Check */}
              <div className="mt-2.5 pt-2 border-t border-[#FFF4D6] flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[#3F7D45]">
                <CheckCircle2 size={12} className="shrink-0" />
                <span className="truncate">Certified Pure Formula</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sacred Tagline Strip with Tamil & English Philosophy */}
        <div className="mt-5 sm:mt-8 bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 border-2 border-[#F6C84C]/50">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-base sm:text-lg">🪔</span>
              <span className="font-script text-lg sm:text-2xl text-[#F6C84C]">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/80 font-sans pl-0 md:pl-7">
              &ldquo;உருவத்திற்கு அப்பால், வாசனை பேசுகிறது; உங்கள் இதயத்தால் கேளுங்கள்.&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 bg-[#F6C84C] text-[#173B3A] text-[10px] sm:text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow-md tracking-wider">
              <span>🇮🇳 1ST TIME IN INDIA</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

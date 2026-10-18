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
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-2">
            THE HM PURITY PROMISE
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173B3A] tracking-tight">
            Crafted for <span className="text-[#9E1830]">Pure Devotion</span> & Mindful Living
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#52625A] leading-relaxed">
            Honoring centuries-old Vedic formulation secrets with ethically gathered botanicals and sacred wood extracts.
          </p>
        </div>

        {/* 4 Pillars - Clean Open Editorial Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center p-2 shadow-xs">
                  <RitualArt kind={item.art} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E1830] block">
                    {item.badge}
                  </span>
                  <h3 className="font-playfair font-bold text-lg text-[#173B3A] leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-semibold text-[#173B3A]/80">
                {item.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#52625A] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sacred Tagline Strip */}
        <div className="mt-12 sm:mt-16 bg-[#9E1830] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="font-playfair text-xl sm:text-2xl text-[#F6C84C] font-semibold italic">
              &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-white/80 font-sans">
              &ldquo;உருவத்திற்கு அப்பால், வாசனை பேசுகிறது; உங்கள் இதயத்தால் கேளுங்கள்.&rdquo;
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-[#FFF4D6] text-xs font-semibold uppercase px-4 py-2 rounded-full border border-white/20">
              <span>Coimbatore Vedic Heritage</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

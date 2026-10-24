import React from "react";
import { Leaf, ShieldCheck, Sparkles, Landmark } from "lucide-react";

export function TrustStrip() {
  const pillars = [
    {
      icon: Leaf,
      tag: "OUR INGREDIENTS",
      title: "100% Natural",
      subtitle: "PURE BOTANICALS",
      desc: "Made with 100% natural herbs, resins and botanical ingredients.",
      iconColor: "#3F7D45",
      badgeBg: "bg-[#EAF5EC]",
      badgeText: "text-[#287541]",
    },
    {
      icon: ShieldCheck,
      tag: "OUR PROCESS",
      title: "No Charcoal",
      subtitle: "CLEAN AND SAFE",
      desc: "Charcoal-free incense for a purer, longer-lasting and more natural fragrance.",
      iconColor: "#9E1830",
      badgeBg: "bg-[#FFF2F4]",
      badgeText: "text-[#9E1830]",
    },
    {
      icon: Sparkles,
      tag: "OUR FORMULA",
      title: "No Chemicals",
      subtitle: "GENTLE FOR EVERYONE",
      desc: "Free from harmful chemicals and synthetic ingredients for a safer, healthier choice.",
      iconColor: "#D97706",
      badgeBg: "bg-[#FFF9EE]",
      badgeText: "text-[#B45309]",
    },
    {
      icon: Landmark,
      tag: "OUR HERITAGE",
      title: "Made in India",
      subtitle: "COIMBATORE HERITAGE",
      desc: "Handcrafted in Coimbatore with traditional Vedic wisdom and methods.",
      iconColor: "#173B3A",
      badgeBg: "bg-[#E6F0EE]",
      badgeText: "text-[#173B3A]",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7EE] pt-8 sm:pt-10 pb-6 sm:pb-8 border-y border-[#F6C84C]/35 font-sans">
      
      {/* Soft Ambient Radial Glows (No Raster Image Watermarks) */}
      <div className="pointer-events-none absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#3F7D45]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#9E1830]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <span className="font-brand text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#9E1830] uppercase block mb-1.5">
            THE HM PURITY PROMISE
          </span>
          <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] uppercase tracking-wide leading-tight">
            Crafted for <span className="text-[#9E1830]">Pure Devotion</span> &amp; Mindful Living
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#374151] max-w-2xl mx-auto leading-relaxed font-normal">
            Experience warm, natural fragrances crafted with clean ingredients and time-honoured traditions to bring peace, positivity, and purity into your everyday life.
          </p>
        </div>

        {/* 4 Pillars with Vertical Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-[#E5D7B7]/80">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0 group"
              >
                {/* Luxury Icon Medallion */}
                <div className="relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFFDF8] to-[#F5EACB] border border-[#F6C84C]/60 shadow-sm mb-3.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-[#F6C84C]">
                  <div className="absolute inset-1 rounded-xl bg-white/70" />
                  <div className="relative z-10" style={{ color: item.iconColor }}>
                    <Icon size={32} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Tag / Eyebrow */}
                <span className="font-brand text-xs font-bold uppercase tracking-[0.18em] text-[#9E1830] block mb-1">
                  {item.tag}
                </span>

                {/* Title */}
                <h3 className="font-brand text-lg sm:text-xl font-bold text-[#111827] uppercase tracking-wide leading-tight mb-1">
                  {item.title}
                </h3>

                {/* Subtitle Badge */}
                <span className={`font-brand text-xs font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-md inline-block ${item.badgeBg} ${item.badgeText}`}>
                  {item.subtitle}
                </span>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-[#374151] font-medium leading-relaxed max-w-[240px]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SIDE-GAP BASED CRIMSON HERITAGE BANNER                                    */}
      {/* ========================================================================= */}
      <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#750C21] via-[#90142C] to-[#66091A] text-white py-4 sm:py-5 px-5 sm:px-8 lg:px-12 shadow-lg border border-[#F6C84C]/30">
          
          {/* Subtle Golden and Emerald Ambient Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#F6C84C]/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#2E6B36]/20 blur-2xl" />

          {/* Bottom-Left Botanical Leaf Illustration Accent */}
          <div className="pointer-events-none absolute bottom-1 left-2 sm:left-4 w-12 sm:w-16 h-12 sm:h-16 select-none opacity-85 z-10">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M12,90 Q30,42 68,32 Q45,64 12,90 Z" fill="#2E6B36" />
              <path d="M12,90 Q48,68 68,32" stroke="#F6C84C" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M30,70 Q44,60 54,52" stroke="#F6C84C" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M24,80 Q38,74 48,68" stroke="#F6C84C" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M6,95 Q18,52 46,46 Q30,76 6,95 Z" fill="#3F7D45" />
              <path d="M6,95 Q26,76 46,46" stroke="#F6C84C" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom-Right Golden Botanical Fine-Line Art Watermark */}
          <div className="pointer-events-none absolute bottom-1 right-2 sm:right-6 w-14 sm:w-20 h-14 sm:h-20 select-none opacity-30 text-[#F6C84C] z-10">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full">
              <path d="M90,90 Q65,40 30,30 Q50,65 90,90 Z" strokeWidth="1.5" />
              <path d="M90,90 Q60,65 30,30" strokeWidth="1.5" />
              <path d="M70,75 Q55,60 45,50" strokeWidth="1" />
              <path d="M75,85 Q65,72 55,65" strokeWidth="1" />
              <path d="M95,85 Q80,45 55,40 Q65,70 95,85 Z" strokeWidth="1.2" />
              <path d="M95,85 Q75,65 55,40" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Dual Quotes (English & Tamil) */}
            <div className="space-y-0.5 text-center md:text-left pl-0 sm:pl-10 lg:pl-12">
              <p className="font-brand text-base sm:text-lg lg:text-xl text-[#FDE68A] font-bold leading-snug tracking-wider uppercase">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </p>
              <p className="font-sans text-xs sm:text-sm text-white font-medium leading-relaxed tracking-wide">
                &ldquo;உருவத்தைத் தாண்டி, வாசனை பேசுகிறது – உங்கள் இதயத்துடன் கேளுங்கள்.&rdquo;
              </p>
            </div>

            {/* Right: Coimbatore Heritage Pill Badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A]/50 bg-white/15 backdrop-blur-xs px-5 py-2.5 font-brand text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white shadow-xs hover:bg-white/20 transition-colors whitespace-nowrap">
                <span>Coimbatore Vedic Heritage</span>
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

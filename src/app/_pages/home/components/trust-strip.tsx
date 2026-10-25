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
      iconColor: "var(--brand-green)",
      badgeBg: "bg-[#EAF5EC]",
      badgeText: "text-brand-green-dark",
    },
    {
      icon: ShieldCheck,
      tag: "OUR PROCESS",
      title: "No Charcoal",
      subtitle: "CLEAN AND SAFE",
      desc: "Charcoal-free incense for a purer, longer-lasting and more natural fragrance.",
      iconColor: "var(--brand-primary)",
      badgeBg: "bg-[#FFF2F4]",
      badgeText: "text-brand-primary",
    },
    {
      icon: Sparkles,
      tag: "OUR FORMULA",
      title: "No Chemicals",
      subtitle: "GENTLE FOR EVERYONE",
      desc: "Free from harmful chemicals and synthetic ingredients for a safer, healthier choice.",
      iconColor: "var(--brand-amber-bright)",
      badgeBg: "bg-brand-surface-cream",
      badgeText: "text-brand-amber",
    },
    {
      icon: Landmark,
      tag: "OUR HERITAGE",
      title: "Made in India",
      subtitle: "COIMBATORE HERITAGE",
      desc: "Handcrafted in Coimbatore with traditional Vedic wisdom and methods.",
      iconColor: "var(--brand-ink)",
      badgeBg: "bg-[#E6F0EE]",
      badgeText: "text-brand-ink",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-brand-surface-alt pt-8 sm:pt-10 pb-6 sm:pb-8 border-y border-brand-accent/35 font-sans">
      
      {/* Soft Ambient Radial Glows (No Raster Image Watermarks) */}
      <div className="pointer-events-none absolute -left-12 -top-12 w-48 h-48 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <span className="font-brand text-ui-11 sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1.5">
            THE HM PURITY PROMISE
          </span>
          <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold text-brand-heading uppercase tracking-wide leading-tight">
            Crafted for <span className="text-brand-primary">Pure Devotion</span> &amp; Mindful Living
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-slate max-w-2xl mx-auto leading-relaxed font-normal">
            Experience warm, natural fragrances crafted with clean ingredients and time-honoured traditions to bring peace, positivity, and purity into your everyday life.
          </p>
        </div>

        {/* Compact horizontal cards on mobile; four-column layout on desktop */}
        <div
          role="region"
          aria-label="HM purity promise"
          className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:gap-4 lg:grid lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-[#E5D7B7]/80 lg:overflow-visible lg:pb-0"
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex min-h-[154px] w-[min(88vw,340px)] shrink-0 snap-start items-start gap-3 rounded-2xl border border-brand-border bg-white/90 p-4 text-left shadow-2xs sm:w-[min(48vw,360px)] lg:min-h-0 lg:w-auto lg:shrink lg:snap-none lg:flex-col lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:pt-0 lg:text-center lg:shadow-none"
              >
                {/* Luxury Icon Medallion */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-accent/60 bg-gradient-to-br from-brand-surface-bright to-[#F5EACB] shadow-sm transition-all duration-300 group-hover:border-brand-accent group-hover:shadow-md lg:mb-3.5 lg:h-18 lg:w-18 lg:rounded-2xl">
                  <div className="absolute inset-1 rounded-xl bg-white/70" />
                  <div className="relative z-10" style={{ color: item.iconColor }}>
                    <Icon size={24} strokeWidth={1.8} className="lg:h-8 lg:w-8" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 lg:flex-none">
                  {/* Tag / Eyebrow */}
                  <span className="mb-1 block break-words font-brand text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary lg:text-xs lg:tracking-[0.18em]">
                    {item.tag}
                  </span>

                  {/* Title */}
                  <h3 className="mb-1 break-words font-brand text-base font-bold uppercase leading-tight tracking-wide text-brand-heading lg:text-lg xl:text-xl">
                    {item.title}
                  </h3>

                  {/* Subtitle Badge */}
                  <span className={`mb-2 inline-block max-w-full break-words rounded-md px-2.5 py-1 font-brand text-[10px] font-bold uppercase tracking-wide lg:px-3 lg:text-xs lg:tracking-wider ${item.badgeBg} ${item.badgeText}`}>
                    {item.subtitle}
                  </span>

                  {/* Description */}
                  <p className="max-w-[240px] text-xs font-medium leading-relaxed text-brand-slate lg:mx-auto lg:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SIDE-GAP BASED CRIMSON HERITAGE BANNER                                    */}
      {/* ========================================================================= */}
      <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#750C21] via-[#90142C] to-[#66091A] text-white py-4 sm:py-5 px-5 sm:px-8 lg:px-12 shadow-lg border border-brand-accent/30">
          
          {/* Subtle Golden and Emerald Ambient Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-accent/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#2E6B36]/20 blur-2xl" />

          {/* Bottom-Left Botanical Leaf Illustration Accent */}
          <div className="pointer-events-none absolute bottom-1 left-2 sm:left-4 w-12 sm:w-16 h-12 sm:h-16 select-none opacity-85 z-10">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M12,90 Q30,42 68,32 Q45,64 12,90 Z" fill="#2E6B36" />
              <path d="M12,90 Q48,68 68,32" stroke="var(--brand-accent)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M30,70 Q44,60 54,52" stroke="var(--brand-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M24,80 Q38,74 48,68" stroke="var(--brand-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M6,95 Q18,52 46,46 Q30,76 6,95 Z" fill="var(--brand-green)" />
              <path d="M6,95 Q26,76 46,46" stroke="var(--brand-accent)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom-Right Golden Botanical Fine-Line Art Watermark */}
          <div className="pointer-events-none absolute bottom-1 right-2 sm:right-6 w-14 sm:w-20 h-14 sm:h-20 select-none opacity-30 text-brand-accent z-10">
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
              <p className="font-brand text-base sm:text-lg lg:text-xl text-brand-accent-soft font-bold leading-snug tracking-wider uppercase">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </p>
              <p className="font-sans text-xs sm:text-sm text-white font-medium leading-relaxed tracking-wide">
                &ldquo;உருவத்தைத் தாண்டி, வாசனை பேசுகிறது – உங்கள் இதயத்துடன் கேளுங்கள்.&rdquo;
              </p>
            </div>

            {/* Right: Coimbatore Heritage Pill Badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent-soft/50 bg-white/15 backdrop-blur-xs px-5 py-2.5 font-brand text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white shadow-xs hover:bg-white/20 transition-colors whitespace-nowrap">
                <span>Coimbatore Vedic Heritage</span>
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

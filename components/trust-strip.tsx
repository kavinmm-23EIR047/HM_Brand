import React from "react";
import Image from "next/image";

export function TrustStrip() {
  const pillars = [
    {
      image: "/images/purity/natural-ingredients.jpg",
      tag: "OUR INGREDIENTS",
      title: "100% Natural",
      subtitle: "PURE BOTANICALS",
      desc: "Made with 100% natural herbs, resins and botanical ingredients.",
      alt: "Fresh green botanicals with blooming white jasmine flowers",
    },
    {
      image: "/images/purity/no-charcoal.jpg",
      tag: "OUR PROCESS",
      title: "No Charcoal",
      subtitle: "CLEAN AND SAFE",
      desc: "Charcoal-free incense for a purer, longer-lasting and more natural fragrance.",
      alt: "Burning incense stick in terracotta holder with fragrant white smoke",
    },
    {
      image: "/images/purity/no-chemicals.jpg",
      tag: "OUR FORMULA",
      title: "No Chemicals",
      subtitle: "GENTLE FOR EVERYONE",
      desc: "Free from harmful chemicals and synthetic ingredients for a safer, healthier choice.",
      alt: "Blooming sacred pink lotus water lily with floating petals",
    },
    {
      image: "/images/purity/made-in-india.jpg",
      tag: "OUR HERITAGE",
      title: "Made in India",
      subtitle: "COIMBATORE HERITAGE",
      desc: "Handcrafted in Coimbatore with traditional Vedic wisdom and methods.",
      alt: "South Indian golden stone temple tower gopuram with coconut palms",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7EE] pt-10 sm:pt-14 pb-0 border-y border-[#F6C84C]/35 font-sans">
      
      {/* Decorative Top-Left Botanical Watermark */}
      <div
        className="pointer-events-none absolute -left-6 -top-6 w-44 h-44 sm:w-64 sm:h-64 opacity-55 mix-blend-multiply select-none"
        style={{
          maskImage: "radial-gradient(circle at 35% 35%, black 50%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at 35% 35%, black 50%, transparent 95%)",
        }}
      >
        <Image
          src="/images/purity/natural-ingredients.jpg"
          alt=""
          fill
          className="object-contain -rotate-45"
        />
      </div>

      {/* Decorative Top-Right Temple Gopuram Silhouette Watermark */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 w-48 h-48 sm:w-72 sm:h-72 opacity-25 mix-blend-multiply select-none"
        style={{
          maskImage: "radial-gradient(circle at 65% 35%, black 50%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at 65% 35%, black 50%, transparent 95%)",
        }}
      >
        <Image
          src="/images/purity/made-in-india.jpg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="font-space text-xs font-bold tracking-[0.22em] text-[#9E1830] uppercase block mb-2.5">
            THE HM PURITY PROMISE
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#173B3A] tracking-tight leading-tight">
            Crafted for <span className="text-[#9E1830]">Pure Devotion</span> &amp; Mindful Living
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#173B3A]/75 max-w-2xl mx-auto leading-relaxed">
            Experience warm, natural fragrances crafted with clean ingredients and time-honoured traditions to bring peace, positivity, and purity into your everyday life.
          </p>
        </div>

        {/* 4 Pillars with Vertical Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-[#E5D7B7]/80">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center px-4 pt-6 sm:pt-0 group"
            >
              {/* Pillar Spot Artwork with Feathered Radial Vignette */}
              <div
                className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 mb-2 transition-transform duration-500 group-hover:scale-105"
                style={{
                  maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
                  className="object-contain mix-blend-multiply"
                />
              </div>

              {/* Tag / Eyebrow */}
              <span className="font-space text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#9E1830] block mb-1">
                {item.tag}
              </span>

              {/* Title */}
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#173B3A] leading-tight mb-1">
                {item.title}
              </h3>

              {/* Subtitle */}
              <span className="font-space text-[10px] sm:text-[11px] font-bold tracking-wider text-[#3F7D45] uppercase mb-2 block">
                {item.subtitle}
              </span>

              {/* Description */}
              <p className="font-sans text-xs text-[#173B3A]/70 leading-relaxed max-w-[240px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH FLUID ORGANIC WAVE BANNER (BORDER RADIUS DESIGN AS IN MOCKUP)  */}
      {/* ========================================================================= */}
      <div className="relative w-full mt-10 sm:mt-14 leading-none">
        
        {/* Layered Organic Wave Header */}
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14 lg:h-20 block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="crimsonMainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#750C21" />
                <stop offset="50%" stopColor="#90142C" />
                <stop offset="100%" stopColor="#66091A" />
              </linearGradient>
            </defs>

            {/* Backing Shadow Wave Layer for Depth */}
            <path
              d="M0,0 C120,32 240,62 420,70 C680,80 980,66 1200,50 C1320,42 1390,30 1440,18 L1440,90 L0,90 Z"
              fill="#4E0513"
              opacity="0.8"
            />

            {/* Foreground Organic Wave Ribbon */}
            <path
              d="M0,16 C140,48 260,76 460,82 C720,90 1000,76 1220,60 C1340,50 1400,38 1440,26 L1440,90 L0,90 Z"
              fill="url(#crimsonMainGrad)"
            />
          </svg>
        </div>

        {/* Main Crimson Ribbon Body */}
        <div className="relative w-full bg-gradient-to-r from-[#750C21] via-[#90142C] to-[#66091A] text-white pt-1 pb-7 sm:pb-9 px-4 sm:px-8 lg:px-12">
          
          {/* Bottom-Left Botanical Leaf Illustration Accent */}
          <div className="pointer-events-none absolute bottom-1 left-2 sm:left-6 w-16 sm:w-24 h-16 sm:h-24 select-none opacity-85 z-10">
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
          <div className="pointer-events-none absolute bottom-1 right-3 sm:right-8 w-20 sm:w-28 h-20 sm:h-28 select-none opacity-30 text-[#F6C84C] z-10">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full">
              <path d="M90,90 Q65,40 30,30 Q50,65 90,90 Z" strokeWidth="1.5" />
              <path d="M90,90 Q60,65 30,30" strokeWidth="1.5" />
              <path d="M70,75 Q55,60 45,50" strokeWidth="1" />
              <path d="M75,85 Q65,72 55,65" strokeWidth="1" />
              <path d="M95,85 Q80,45 55,40 Q65,70 95,85 Z" strokeWidth="1.2" />
              <path d="M95,85 Q75,65 55,40" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="relative z-20 mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] flex flex-col md:flex-row items-center justify-between gap-4 px-2 sm:px-4">
            
            {/* Left: Dual Quotes (English & Tamil) */}
            <div className="space-y-1 text-center md:text-left pl-0 sm:pl-10 lg:pl-12">
              <p className="font-playfair text-lg sm:text-xl lg:text-2xl text-[#F6C84C] font-normal italic leading-snug tracking-wide">
                &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
              </p>
              <p className="font-sans text-xs sm:text-sm text-white/95 leading-relaxed tracking-wide">
                &ldquo;உருவத்தைத் தாண்டி, வாசனை பேசுகிறது – உங்கள் இதயத்துடன் கேளுங்கள்.&rdquo;
              </p>
            </div>

            {/* Right: Coimbatore Heritage Pill Badge */}
            <div className="shrink-0 pr-0 sm:pr-8 lg:pr-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-xs px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#FFF4D6] shadow-2xs hover:bg-white/15 transition-colors whitespace-nowrap">
                <span>Coimbatore Vedic Heritage</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

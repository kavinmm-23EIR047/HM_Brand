"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Leaf, ShieldCheck, Sparkles, Landmark, ChevronLeft, ChevronRight } from "lucide-react";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeIdxRef = useRef(0);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseTemporarily = useCallback((ms = 4000) => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, ms);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[idx] as HTMLElement | undefined;
    if (card) {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const delta =
        cardRect.left + cardRect.width / 2 - (containerRect.left + containerRect.width / 2);
      container.scrollBy({ left: delta, behavior: "smooth" });
    }
    setActiveIdx(idx);
  }, []);

  const onScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = Array.from(container.children) as HTMLElement[];
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });
    setActiveIdx(closestIdx);
  }, []);

  // Autoslide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
      const next = (activeIdxRef.current + 1) % pillars.length;
      scrollTo(next);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, scrollTo, pillars.length]);

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-14 border-b border-brand-border font-sans">

      <div className="page-container relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="font-brand text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1.5">
            THE HM PURITY PROMISE
          </span>
          <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold text-brand-heading uppercase tracking-wide leading-tight">
            Crafted for <span className="text-brand-primary">Pure Devotion</span> &amp; Mindful Living
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-slate max-w-2xl mx-auto leading-relaxed font-normal">
            Experience warm, natural fragrances crafted with clean ingredients and time-honoured traditions to bring peace, positivity, and purity into your everyday life.
          </p>
        </div>

        {/* DESKTOP: 4-column grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:divide-x lg:divide-brand-border">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="group flex flex-col items-center px-5 pt-0 text-center">
                <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface-soft shadow-2xs transition-all duration-300 group-hover:border-brand-primary group-hover:shadow-sm mb-3.5">
                  <div className="relative z-10" style={{ color: item.iconColor }}>
                    <Icon size={32} strokeWidth={1.8} />
                  </div>
                </div>
                <span className="mb-1 block font-brand text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">{item.tag}</span>
                <h3 className="mb-1 font-brand text-lg xl:text-xl font-bold uppercase leading-tight tracking-wide text-brand-heading">{item.title}</h3>
                <span className={`mb-2 inline-block rounded-md px-3 py-1 font-brand text-xs font-bold uppercase tracking-wider ${item.badgeBg} ${item.badgeText}`}>{item.subtitle}</span>
                <p className="mx-auto max-w-[240px] text-sm font-medium leading-relaxed text-brand-slate">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* MOBILE: Snap slider with arrows + dots */}
        <div className="lg:hidden">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsPaused(true);
              }
            }}
            onMouseLeave={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsPaused(false);
              }
            }}
            onTouchStart={() => pauseTemporarily(5000)}
            onTouchEnd={() => pauseTemporarily(4000)}
            className="relative flex snap-x snap-mandatory overflow-x-auto gap-3 pb-2 no-scrollbar scrollbar-none"
            style={{
              paddingLeft: "calc((100% - min(82vw, 320px)) / 2)",
              paddingRight: "calc((100% - min(82vw, 320px)) / 2)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    pauseTemporarily(4000);
                    scrollTo(idx);
                  }}
                  className="flex min-w-[min(82vw,320px)] max-w-[320px] shrink-0 snap-center flex-col gap-3 rounded-2xl border border-brand-border bg-brand-surface-bright p-5 shadow-2xs cursor-pointer"
                >
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-brand-border bg-white shadow-2xs">
                    <div className="relative z-10" style={{ color: item.iconColor }}>
                      <Icon size={24} strokeWidth={1.8} />
                    </div>
                  </div>
                  <div>
                    <span className="mb-0.5 block font-brand text-xs font-bold uppercase tracking-[0.14em] text-brand-primary">{item.tag}</span>
                    <h3 className="mb-1 font-brand text-base font-bold uppercase leading-tight tracking-wide text-brand-heading">{item.title}</h3>
                    <span className={`mb-2 inline-block rounded-md px-2.5 py-1 font-brand text-ui-11 font-bold uppercase tracking-wide ${item.badgeBg} ${item.badgeText}`}>{item.subtitle}</span>
                    <p className="text-xs font-medium leading-relaxed text-brand-slate">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows + Dots navigation */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                pauseTemporarily(4000);
                scrollTo((activeIdx - 1 + pillars.length) % pillars.length);
              }}
              aria-label="Previous pillar"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white shadow-2xs transition active:scale-95 hover:border-brand-primary"
            >
              <ChevronLeft size={17} className="text-brand-primary" />
            </button>

            <div className="flex items-center gap-2">
              {pillars.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    pauseTemporarily(4000);
                    scrollTo(i);
                  }}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIdx ? "w-5 h-2 bg-brand-primary" : "w-2 h-2 bg-brand-border"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                pauseTemporarily(4000);
                scrollTo((activeIdx + 1) % pillars.length);
              }}
              aria-label="Next pillar"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white shadow-2xs transition active:scale-95 hover:border-brand-primary"
            >
              <ChevronRight size={17} className="text-brand-primary" />
            </button>
          </div>
        </div>

      </div>

      {/* Heritage banner — Solid Editorial Maroon */}
      <div className="page-container relative mt-8 sm:mt-10">
        <div className="relative overflow-hidden rounded-2xl bg-brand-primary text-white py-5 sm:py-6 px-5 sm:px-8 lg:px-12 shadow-card border border-brand-accent/35">
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
            <div className="space-y-0.5 text-center md:text-left pl-0 sm:pl-10 lg:pl-12">
              <p className="font-brand text-base sm:text-lg lg:text-xl text-brand-accent-soft font-bold leading-snug tracking-wider uppercase">
                &ldquo;Beyond Form, Fragrance Speaks &mdash; Listen With Your Heart.&rdquo;
              </p>
              <p className="font-sans text-xs sm:text-sm text-white font-medium leading-relaxed tracking-wide">
                &ldquo;உருவத்தைத் தாண்டி, வாசனை பேசுகிறது &ndash; உங்கள் இதயத்துடன் கேளுங்கள்.&rdquo;
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent-soft bg-brand-accent hover:bg-brand-accent-soft text-brand-primary-darkest px-5 py-2.5 font-brand text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] shadow-md transition-all whitespace-nowrap select-none">
                <span>Coimbatore Vedic Heritage</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

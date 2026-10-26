"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export function OurStorySection() {
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

  // Autoslide effect for mobile/tablet slider
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.innerWidth >= 640) return;
      const next = (activeIdxRef.current + 1) % 3; // 3 values
      scrollTo(next);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, scrollTo]);

  const values = [
    {
      number: "01",
      title: "Yoga & Mind",
      subtitle: "Ancient Tradition",
      description: "Find natural balance and mental clarity through pure botanical aromas.",
      icon: Leaf,
      accentColor: "var(--brand-green)",
      badgeBg: "bg-[#EAF5EC]",
      badgeText: "text-brand-green-dark",
      iconBg: "bg-brand-green/12",
      borderHover: "hover:border-brand-green/50",
    },
    {
      number: "02",
      title: "God & Prayer",
      subtitle: "Sacred Wellbeing",
      description: "Infuse your home and daily prayer rituals with divine temple fragrances.",
      icon: Heart,
      accentColor: "var(--brand-primary)",
      badgeBg: "bg-[#FFF2F4]",
      badgeText: "text-brand-primary",
      iconBg: "bg-brand-primary/12",
      borderHover: "hover:border-brand-primary/50",
    },
    {
      number: "03",
      title: "Pure Virtue",
      subtitle: "Better Tomorrow",
      description: "Crafted charcoal-free with pure ingredients for healthy, conscious living.",
      icon: Sparkles,
      accentColor: "var(--brand-amber-bright)",
      badgeBg: "bg-brand-surface-cream",
      badgeText: "text-brand-amber",
      iconBg: "bg-brand-orange/12",
      borderHover: "hover:border-brand-orange/50",
    },
  ];

  return (
    <section className="relative my-6 w-full overflow-hidden bg-brand-surface-alt pt-10 pb-7 sm:my-12 sm:py-18 lg:py-22 border-y border-brand-border/70 font-sans">
      {/* Soft decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-brand-border/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-brand-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* LEFT: STORY CONTENT */}
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            {/* Eyebrow */}
            <div className="mb-3.5 flex items-center gap-2">
              <span className="h-[2px] w-8 rounded-full bg-brand-orange" />
              <span className="font-brand text-ui-11 sm:text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
                OUR STORY &amp; HERITAGE
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="max-w-2xl font-brand text-xl sm:text-2xl lg:text-3xl font-bold leading-snug tracking-wide text-brand-heading uppercase">
              Bringing Nature,
              <br className="hidden sm:block" /> Tradition &amp; Wellbeing
              <span className="text-brand-green"> Together.</span>
            </h2>

            {/* Sub-narrative */}
            <p className="mt-3 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-brand-slate font-normal">
              At HM Agarbattis, we believe in the power of natural fragrances
              to create a calmer, happier and more positive life. Our products
              are thoughtfully crafted with pure ingredients, inspired by
              India&apos;s rich traditions and a modern mindful lifestyle.
            </p>

            {/* THREE VALUES — CENTERED SLIDER ON MOBILE, 3-COL GRID ON TABLET/DESKTOP */}
            <div className="mt-6 sm:mt-8">
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
                className="relative flex overflow-x-auto sm:grid sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-4.5 pb-2 snap-x snap-mandatory no-scrollbar px-[calc((100%-min(82vw,300px))/2)] sm:px-0"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  const isActive = idx === activeIdx;

                  return (
                    <div
                      key={value.number}
                      onClick={() => {
                        pauseTemporarily(4000);
                        scrollTo(idx);
                      }}
                      className={`group relative flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-5 transition-all duration-300 w-[min(82vw,300px)] sm:w-auto shrink-0 snap-center cursor-pointer sm:cursor-default ${
                        isActive
                          ? "border-[#9E1830] shadow-md ring-1 ring-[#9E1830]/20"
                          : "border-[#EADBBD] hover:border-[#9E1830]/50 hover:shadow-md"
                      }`}
                    >
                      {/* Top Header: Icon & Step Number */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${value.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                            style={{ color: value.accentColor }}
                          >
                            <Icon size={20} strokeWidth={2.2} />
                          </div>
                          <span className="font-serif text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9EC] border border-[#EADBBD] text-[#8C6D37] tabular-nums">
                            {value.number}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#173B3A] uppercase tracking-wide group-hover:text-[#9E1830] transition-colors leading-tight">
                          {value.title}
                        </h3>

                        {/* Subtitle Pill */}
                        <div className="mt-1.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${value.badgeBg} ${value.badgeText} shadow-2xs`}
                          >
                            {value.subtitle}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs sm:text-sm text-[#4A4036] font-normal leading-relaxed">
                          {value.description}
                        </p>
                      </div>

                      {/* Bottom subtle accent line */}
                      <div className="mt-4 pt-2.5 border-t border-[#F2EADB] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#173B3A]/70 uppercase tracking-wider">
                          HM Purity
                        </span>
                        <span
                          className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                          style={{ backgroundColor: value.accentColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOBILE ONLY: Navigations & Paginations */}
              <div className="mt-4 flex sm:hidden items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    pauseTemporarily(4000);
                    scrollTo((activeIdx - 1 + values.length) % values.length);
                  }}
                  aria-label="Previous value"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary shadow-xs transition hover:bg-brand-primary/5 active:scale-95"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                <div className="flex items-center gap-2">
                  {values.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        pauseTemporarily(4000);
                        scrollTo(i);
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={i === activeIdx ? "true" : undefined}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIdx
                          ? "w-6 bg-brand-primary"
                          : "w-2 bg-brand-border hover:bg-brand-slate/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    pauseTemporarily(4000);
                    scrollTo((activeIdx + 1) % values.length);
                  }}
                  aria-label="Next value"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary shadow-xs transition hover:bg-brand-primary/5 active:scale-95"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* CTA Action Row */}
            <div className="mt-5 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-6 sm:px-7 py-3 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Know Our Story</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green">
                <ShieldCheck size={16} className="text-brand-green" />
                <span>100% Charcoal-Free Heritage</span>
              </span>
            </div>
          </div>

          {/* RIGHT: ILLUSTRATION WITH ELEGANT PEDESTAL FRAME */}
          <div className="order-1 flex min-w-0 justify-center lg:order-2 lg:col-span-5">
            <div className="relative w-full max-w-[290px] sm:max-w-[360px] lg:max-w-[420px]">
              
              {/* Soft ambient golden-green glow behind the sacred flame mascot */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[12%] rounded-full bg-gradient-to-tr from-brand-accent/25 to-[#DDECCB]/50 blur-2xl"
              />

              <div className="relative aspect-square w-full">
                <Image
                  src="/images/hm_story_yoga_god_virtue.png"
                  alt="HM Agarbattis sacred flame mascot meditating on a lotus flower with diya and temple bell"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                  className="object-contain drop-shadow-xl transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>

              {/* Caption pill below */}
              <div className="mt-3 flex justify-center px-1 text-center">
                <span className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-brand-border bg-white/95 px-3 py-2 font-tagline text-[9px] font-bold uppercase leading-none tracking-[0.08em] text-brand-green shadow-xs whitespace-nowrap sm:px-4 sm:text-xs sm:tracking-[0.12em]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                  Rooted in Tradition · Made with Care
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

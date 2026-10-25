"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  const pillarsSliderRef = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState(0);
  const [canSlidePillars, setCanSlidePillars] = useState(false);
  const [pausePillarAutoplay, setPausePillarAutoplay] = useState(false);

  const pillars = [
    {
      number: "01",
      title: "Yoga & Mindful Living",
      badge: "CLARITY & INNER STILLNESS",
      desc: "Fragrance creates an immediate sensory anchor for deep meditation, conscious breathing, and mental focus.",
      image: "/images/about/pillar-yoga.jpg",
      alt: "Yoga and meditation spiritual illustration with warm golden glow",
    },
    {
      number: "02",
      title: "God & Sacred Devotion",
      badge: "TEMPLES & HOMES",
      desc: "Handcrafted with care to support your sacred practices and bring divine presence into every space.",
      image: "/images/about/pillar-temple.jpg",
      alt: "Sacred South Indian temple shrine with burning incense and glowing lamps",
    },
    {
      number: "03",
      title: "Pure Botanical Virtue",
      badge: "CLEAN & NATURAL",
      desc: "We reject all synthetic chemicals and use 100% natural ingredients for a healthier, safer, and more conscious world.",
      image: "/images/about/pillar-herbs.jpg",
      alt: "Traditional stone mortar and pestle with fresh Ayurvedic herbs and flower petals",
    },
  ];

  const reasons = [
    {
      title: "Zero Artificial Chemicals",
      desc: "100% natural botanicals, free from harmful chemicals and synthetic fragrance.",
      color: "var(--brand-green)",
      bg: "bg-brand-green/10",
      icon: (
        <svg className="w-6 h-6 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
    },
    {
      title: "Clean Indoor Air",
      desc: "Charcoal-free and toxin-free formulations for a healthier home environment.",
      color: "var(--brand-primary)",
      bg: "bg-brand-primary/10",
      icon: (
        <svg className="w-6 h-6 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
    {
      title: "Primal & Ayurvedic",
      desc: "Inspired by Ayurveda with therapeutic essential oils and natural resins.",
      color: "var(--brand-orange)",
      bg: "bg-brand-orange/10",
      icon: (
        <svg className="w-6 h-6 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9Z"/>
          <path d="M12 7v10"/>
          <path d="M8 12c1.5 2 2.5 3 4 3s2.5-1 4-3"/>
        </svg>
      ),
    },
    {
      title: "Artisanal Heritage",
      desc: "Handcrafted in Coimbatore with time-honoured methods and a deep respect for tradition.",
      color: "var(--brand-green)",
      bg: "bg-[#DDECCB]/70",
      icon: (
        <svg className="w-6 h-6 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20h10"/>
          <path d="M10 20c0-4-3-6-3-10a5 5 0 0 1 10 0c0 4-3 6-3 10"/>
          <path d="M12 6v4"/>
        </svg>
      ),
    },
  ];

  const goToPillar = (index: number) => {
    const slider = pillarsSliderRef.current;
    const card = slider?.children[index] as HTMLElement | undefined;
    if (!slider || !card) return;
    slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: "smooth" });
    setActivePillar(index);
  };

  useEffect(() => {
    const slider = pillarsSliderRef.current;
    if (!slider) return;
    const update = () => {
      const scrollable = slider.scrollWidth > slider.clientWidth + 2;
      setCanSlidePillars(scrollable);
      if (scrollable) {
        const firstCard = slider.firstElementChild as HTMLElement | null;
        const gap = Number.parseFloat(getComputedStyle(slider).columnGap) || 0;
        const step = (firstCard?.offsetWidth || slider.clientWidth) + gap;
        setActivePillar(Math.min(pillars.length - 1, Math.round(slider.scrollLeft / step)));
      } else {
        setActivePillar(0);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(slider);
    return () => observer.disconnect();
  }, [pillars.length]);

  useEffect(() => {
    if (!canSlidePillars || pausePillarAutoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      goToPillar((activePillar + 1) % pillars.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [activePillar, canSlidePillars, pausePillarAutoplay, pillars.length]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-hidden font-sans">
      <Navigation />

      <main className="w-full max-w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION                                                   */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-brand-surface-soft pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-brand-surface-warm blur-3xl opacity-60"
          />

          <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Headline, Narrative & Trust Pills */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-6">
                <div>
                  <span className="font-space text-xs sm:text-ui-13 font-bold tracking-[0.2em] text-brand-primary uppercase block mb-3">
                    OUR SACRED STORY &amp; HERITAGE
                  </span>
                  <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-snug tracking-tight">
                    Bringing Pure Nature, Devotion &amp; Wellbeing Into Every Home
                  </h1>
                </div>

                <p className="font-sans text-sm sm:text-base lg:text-lg text-brand-ink/80 leading-relaxed max-w-xl">
                  From our spiritual home in Coimbatore, HM Agarbattis preserves the timeless art of pure botanical fragrance for mindful living, daily prayer, and sacred peace.
                </p>

                <div>
                  <a
                    href="#story"
                    className="inline-flex items-center gap-2.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Know Our Story</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* 3 Pills Below CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-brand-green/25 px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <span className="text-brand-green">🍃</span>
                    <span>Natural Ingredients</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-brand-primary/25 px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <span className="text-brand-primary">🪷</span>
                    <span>Traditional Craftsmanship</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-brand-orange/25 px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <span className="text-brand-orange">🤍</span>
                    <span>Wellbeing for Every Home</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Altar Imagery with Floating Script */}
              <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white/80 bg-white group">
                  <Image
                    src="/images/about/hero-incense.jpg"
                    alt="Sacred South Indian puja altar with burning incense sticks releasing delicate fragrant smoke, blooming pink lotus and glowing brass diya"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gentle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Handwritten Script Note */}
                <div className="absolute -top-4 -right-2 sm:-top-6 sm:right-0 bg-white/95 backdrop-blur-md border border-brand-accent/60 rounded-2xl px-4 py-2 shadow-lg rotate-3 pointer-events-none z-10">
                  <span className="font-script text-xl sm:text-2xl text-brand-primary font-bold block whitespace-nowrap leading-tight">
                    Fragrance for a Better Tomorrow
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Organic Wave Transition to Section 2 */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className="relative block w-full h-8 sm:h-14 lg:h-20 text-[#F5F8F2]"
              viewBox="0 0 1440 80"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
            </svg>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: OUR STORY (WESTERN GHATS HERITAGE)                             */}
        {/* ========================================================================= */}
        <section id="story" className="relative w-full bg-[#F5F8F2] py-14 sm:py-20 lg:py-24 overflow-hidden scroll-mt-20">
          <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Spiritual Painting Illustration */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white group">
                  <Image
                    src="/images/about/western-ghats-heritage.jpg"
                    alt="Serene Indian woman in white saree meditating in front of ancient South Indian temple tower at the foothills of Western Ghats in golden sunrise mist"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Column: Narrative Copy */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="font-space text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-2">
                    OUR STORY
                  </span>
                  <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-tight">
                    Crafted with Pure Devotion at the Foothills of the Western Ghats
                  </h2>
                </div>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed">
                  HM Agarbattis was born out of a simple, heartfelt commitment to restore the sacred purity of traditional Indian incense. In a world full of mass-produced synthetic chemicals and black charcoal, we handcraft every stick and dhoop cone using pure botanical ingredients, authentic herbs, and natural resins.
                </p>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed">
                  Whether you are lighting an agarbatti for your morning puja, creating a serene environment for yoga and meditation, or filling your home with welcoming fragrance, HM Agarbattis brings you an uplifting, peaceful experience that connects you with the divine within.
                </p>

                {/* 3 Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink border border-brand-green/30 shadow-2xs">
                    <span>🍃</span>
                    <span>Coimbatore Heritage</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink border border-brand-primary/30 shadow-2xs">
                    <span>🪷</span>
                    <span>100% Charcoal-Free</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink border border-brand-orange/30 shadow-2xs">
                    <span>🤍</span>
                    <span>Pure Botanical Resins</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Organic Wave Transition to Section 3 */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className="relative block w-full h-8 sm:h-14 lg:h-18 text-brand-surface-bright"
              viewBox="0 0 1440 60"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,0 C320,60 480,10 720,40 C960,70 1200,20 1440,50 L1440,60 L0,60 Z" />
            </svg>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: OUR 3 SACRED PILLARS                                           */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-brand-surface-bright py-16 sm:py-24 overflow-hidden">
          <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="font-space text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-2">
                OUR 3 SACRED PILLARS
              </span>
              <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-tight">
                Mindfulness, Devotion &amp; Pure Virtue
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-ink/75 leading-relaxed">
                Every creation from HM Agarbattis is designed to nourish your daily spiritual journey.
              </p>
            </div>

            {/* Mobile pillar slider with desktop grid */}
            <div
              ref={pillarsSliderRef}
              role="region"
              aria-label="Our sacred pillars"
              onScroll={() => {
                const slider = pillarsSliderRef.current;
                const firstCard = slider?.firstElementChild as HTMLElement | null;
                if (!slider || !firstCard || !canSlidePillars) return;
                const gap = Number.parseFloat(getComputedStyle(slider).columnGap) || 0;
                setActivePillar(Math.min(pillars.length - 1, Math.round(slider.scrollLeft / (firstCard.offsetWidth + gap))));
              }}
              onMouseEnter={() => setPausePillarAutoplay(true)}
              onMouseLeave={() => setPausePillarAutoplay(false)}
              onFocusCapture={() => setPausePillarAutoplay(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPausePillarAutoplay(false);
              }}
              onTouchStart={() => setPausePillarAutoplay(true)}
              onTouchEnd={() => setPausePillarAutoplay(false)}
              className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 lg:gap-12"
            >
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.number}
                  className="group relative flex min-h-[205px] w-[min(72vw,320px)] shrink-0 snap-start flex-col items-start rounded-2xl border border-brand-border bg-white p-4 text-left shadow-sm sm:w-[min(62vw,360px)] md:min-h-0 md:w-auto md:shrink md:snap-none md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0 md:text-center md:shadow-none"
                >
                  <div className="mb-3 flex w-full items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${index === 0 ? "bg-brand-green/10 text-brand-green" : index === 1 ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-orange/10 text-brand-orange"}`}>
                      {index === 0 ? <Leaf size={19} /> : index === 1 ? <Heart size={19} /> : <Sparkles size={19} />}
                    </span>
                    <span className="rounded-full border border-brand-accent/50 bg-brand-surface-warm px-2.5 py-1 font-space text-[10px] font-bold text-brand-amber">{pillar.number}</span>
                  </div>
                  <h3 className="font-playfair text-lg font-bold leading-snug text-brand-ink md:text-xl">{pillar.title}</h3>
                  <span className="mt-1.5 mb-2 inline-flex rounded-md bg-brand-primary/5 px-2 py-1 font-space text-[10px] font-bold tracking-wide text-brand-primary uppercase">{pillar.badge}</span>
                  <p className="max-w-xs text-xs leading-relaxed text-brand-ink/75 md:text-sm">{pillar.desc}</p>
                  <div className="mt-auto flex w-full items-center justify-between border-t border-brand-border/60 pt-2.5 font-space text-[9px] font-semibold tracking-wider text-brand-muted md:mt-4">
                    <span>HM PURITY</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-brand-primary" : "bg-brand-green"}`} />
                  </div>
                </div>
              ))}
            </div>

            {canSlidePillars && (
              <nav aria-label="Pillar slider pagination" className="mt-4 flex items-center justify-center gap-2 md:hidden">
                {pillars.map((pillar, index) => (
                  <button
                    key={pillar.number}
                    type="button"
                    onClick={() => goToPillar(index)}
                    aria-label={`Show pillar ${index + 1}`}
                    aria-current={activePillar === index ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activePillar === index ? "w-9 bg-brand-primary" : "w-2.5 bg-brand-border hover:bg-brand-primary/60"}`}
                  />
                ))}
              </nav>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: HOLISTIC WELLBEING — WHY CHOOSE HM AGARBATTIS?                 */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-brand-surface-soft py-16 sm:py-24 border-t border-brand-accent/25 overflow-hidden">
          <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="font-space text-xs font-bold tracking-[0.2em] text-brand-green uppercase block mb-2">
                HOLISTIC WELLBEING
              </span>
              <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-tight">
                Why Choose HM Agarbattis?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-ink/75 leading-relaxed">
                Experience the clear, uplifting difference of pure botanical fragrance in your daily rituals.
              </p>
            </div>

            {/* 4 Reasons Editorial Grid with Subtle Separators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[var(--brand-accent)]/35">
              {reasons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center px-4 pt-6 sm:pt-0 group"
                >
                  {/* Icon Circle */}
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-2xs ${item.bg}`}
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-brand-ink mb-2 leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-brand-ink/75 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: ELEVATE YOUR DAILY RITUALS (BOTTOM CTA BANNER)                 */}
        {/* ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-gradient-to-r from-brand-rich-red via-brand-mid-rich to-brand-darkest text-white py-12 sm:py-16 lg:py-20">
          {/* Subtle Organic Background Curve */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: CTA Heading, Copy & Action */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <span className="font-space text-ui-11 sm:text-xs font-bold tracking-[0.25em] text-brand-accent uppercase block">
                  FIND YOUR GOD WITHIN
                </span>

                <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  Elevate Your Daily Rituals With Sacred Fragrance
                </h2>

                <p className="font-sans text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed max-w-xl">
                  Explore our complete handcrafted collection of agarbattis, camphor, dhoop sticks, and sambrani.
                </p>

                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-accent hover:bg-[#F4A220] text-brand-ink px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span>Explore The Shop</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Premium Incense Package & Altar Display */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/20 group">
                  <Image
                    src="/images/about/cta-ritual.jpg"
                    alt="Spiritual puja altar with burning agarbatti incense sticks, warm diya flame, and premium HM Agarbattis box package"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

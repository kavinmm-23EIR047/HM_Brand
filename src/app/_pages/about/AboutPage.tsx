"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Heart,
  Sparkles,
  CheckCircle2,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PureHeartCuppedSvg, SacredBotanicalSvg, SacredLotusSvg } from "@/components/sacred-icons";
import { FEATURED_WORKSHOP_SLIDES, type FeaturedSlide } from "@/lib/featured-workshop-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

export default function AboutPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSlidePlaying, setIsSlidePlaying] = useState(true);
  const [lightboxSlide, setLightboxSlide] = useState<FeaturedSlide | null>(null);

  const activeSlide = FEATURED_WORKSHOP_SLIDES[slideIndex];
  const totalSlides = FEATURED_WORKSHOP_SLIDES.length;

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide effect (4.5s)
  useEffect(() => {
    if (!isSlidePlaying || lightboxSlide) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isSlidePlaying, lightboxSlide, nextSlide]);

  const reasons = [
    {
      title: "No Synthetic Solvents",
      desc: "Made with genuine botanical resins and flower powders. We never use DEP, burning agents, or fake chemical perfumes.",
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
      title: "Gentle on Sensitive Noses",
      desc: "Pure botanical ingredients produce serene, light white smoke. Grandparents and kids can sit comfortably in the pooja room without coughing.",
      color: "var(--brand-primary)",
      bg: "bg-brand-primary/10",
      icon: (
        <svg className="w-6 h-6 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
    {
      title: "Fragrance That Actually Lasts",
      desc: "Authentic tree gums like loban and guggul diffuse slowly and leave a calm, peaceful temple scent long after pooja is done.",
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
      title: "Fresh from Coimbatore",
      desc: "Rolled, inspected, and packed in small batches in Coimbatore so you always receive fresh, aromatic stock.",
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

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-clip font-sans">
      <Navigation />

      <main className="w-full max-w-full overflow-x-clip">

        {/* ─── 1. HERO SECTION: CONVERSATIONAL & HONEST ─── */}
        <section className="relative w-full bg-brand-surface-alt pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-brand-border overflow-hidden">
          <div className="page-container relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="font-space text-xs sm:text-ui-13 font-bold tracking-wider text-brand-primary uppercase block mb-2">
                    A CONVERSATION FROM OUR WORKSHOP
                  </span>
                  <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-ink leading-snug tracking-tight">
                    Why we make our incense by hand, the traditional way.
                  </h1>
                </div>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed max-w-xl">
                  If you’ve ever lit an agarbatti and had to open the window because of suffocating black smoke or a headache, you already know why we started HM Agarbattis in Coimbatore.
                </p>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed max-w-xl">
                  We refused to use synthetic fillers, black dust, or harsh chemical perfumes. Instead, we use real tree gums like loban, natural guggul, crushed flower powders, and clean herbal pastes.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#story"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5"
                  >
                    <span>Read Our Story</span>
                    <ArrowRight size={15} />
                  </a>

                  <a
                    href="#workshop-reel"
                    className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-brand-surface-soft border border-brand-border text-brand-ink px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-2xs hover:border-brand-primary/60"
                  >
                    <Camera size={14} className="text-brand-green" />
                    <span>Watch Workshop Slides</span>
                  </a>
                </div>

                {/* 3 Clear Promises */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-green/30 px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <SacredBotanicalSvg className="h-4 w-4 text-brand-green" />
                    <span>Pure Tree Resins</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-primary/30 px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <SacredLotusSvg className="h-4 w-4" />
                    <span>Temple-Grade Purity</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-orange/30 px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                    <PureHeartCuppedSvg className="h-4 w-4 text-brand-orange" />
                    <span>Safe for Kids &amp; Elders</span>
                  </div>
                </div>
              </div>

              {/* Right: Enhanced Real Image */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-card border-2 border-brand-border ring-4 ring-white bg-white group">
                  <Image
                    src="/images/craftsmanship/featured/featured_01.webp"
                    alt="Artisan handcrafting pure incense paste in Coimbatore workshop"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 460px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    Coimbatore Workshop Floor
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 2. DETAILED STORY SECTION ─── */}
        <section id="story" className="relative w-full bg-brand-surface-alt py-14 sm:py-20 border-b border-brand-border scroll-mt-20">
          <div className="page-container relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-card border-2 border-brand-border ring-4 ring-white bg-white group">
                  <Image
                    src="/images/craftsmanship/featured/featured_02.webp"
                    alt="Artisans rolling incense sticks on traditional wooden tables"
                    fill
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    Hand-Rolling on Bamboo Splints
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="font-space text-xs font-bold tracking-wider text-brand-primary uppercase block">
                  HOW WE WORK
                </span>
                <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-tight">
                  No shortcuts, no chemicals, no mass-market compromises.
                </h2>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed">
                  Most people don’t realize that cheap commercial agarbattis often rely on artificial binding powders and synthetic fragrance oils diluted with harsh solvents. When lit, they produce suffocating dark smoke that leaves a greasy film on walls and irritates sensitive lungs.
                </p>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed">
                  We chose a completely different path. In our family-run workshop in Coimbatore, every stick is rolled by hand onto real bamboo splints. We blend pure tree gums like loban and guggul, natural bark powder (jigat), and authentic flower extracts. We then cure them slowly on wooden aeration racks so the essential oils stay locked inside.
                </p>

                <p className="font-sans text-sm sm:text-base text-brand-ink/80 leading-relaxed font-semibold text-brand-green">
                  When you light an HM stick, you get clean white smoke, a gentle temple fragrance, and absolute peace of mind.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 3. AUTO-SLIDING FEATURED WORKSHOP REEL (ENHANCED QUALITY) ─── */}
        <section id="workshop-reel" className="relative w-full bg-white py-14 sm:py-20 border-b border-brand-border scroll-mt-20">
          <div className="page-container">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-green mb-2">
                  <Camera size={13} className="shrink-0" />
                  <span>Interactive Workshop Reel</span>
                </div>
                <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide text-brand-heading leading-tight">
                  Step inside our workshop: 12 real crafting stages.
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-brand-slate max-w-xl">
                  Auto-sliding preview of our daily craftsmanship in Coimbatore. Pause anytime, zoom in, or click any slide below.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSlidePlaying((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink hover:border-brand-primary transition cursor-pointer"
                >
                  {isSlidePlaying ? <Pause size={12} className="text-brand-primary" /> : <Play size={12} className="text-brand-green" />}
                  <span>{isSlidePlaying ? "Pause" : "Play"}</span>
                </button>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous"
                  className="h-8 w-8 rounded-full border border-brand-border bg-white flex items-center justify-center hover:border-brand-primary transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next"
                  className="h-8 w-8 rounded-full border border-brand-border bg-white flex items-center justify-center hover:border-brand-primary transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Main Featured Slide */}
            <div
              onMouseEnter={() => setIsSlidePlaying(false)}
              onMouseLeave={() => setIsSlidePlaying(true)}
              className="rounded-2xl sm:rounded-3xl border border-brand-border bg-brand-surface-alt overflow-hidden shadow-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] bg-neutral-900 group">
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-3 py-1 border border-white/20">
                      Stage {activeSlide.index}: {activeSlide.stage}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxSlide(activeSlide)}
                    className="absolute top-3 right-3 z-10 rounded-full bg-black/60 hover:bg-black/90 text-white p-2 border border-white/25 transition cursor-pointer"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                  <div className="space-y-3">
                    <span className="font-brand text-[10px] sm:text-xs font-bold tracking-wider text-brand-primary uppercase block">
                      {activeSlide.eyebrow}
                    </span>
                    <h3 className="font-brand text-lg sm:text-xl font-bold text-brand-heading leading-snug">
                      {activeSlide.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                      {activeSlide.conversationalText}
                    </p>
                    <div className="rounded-xl border border-brand-green/30 bg-[#EAF5EC]/60 p-3 text-xs text-brand-ink flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-brand-green shrink-0" />
                      <span className="font-medium">{activeSlide.highlight}</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-border flex items-center justify-between">
                    <a
                      href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello HM Brand, I was reading your story on slide "${activeSlide.heading}" and I want to enquire about your incense.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#14532D] text-white text-xs font-semibold px-4 py-2 hover:bg-[#0F3F22] transition"
                    >
                      <MessageCircle size={14} />
                      <span>Ask Us on WhatsApp</span>
                    </a>

                    <Link
                      href="/craftsmanship"
                      className="text-xs font-bold text-brand-primary hover:underline"
                    >
                      Browse All 80 Photos →
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {FEATURED_WORKSHOP_SLIDES.map((slide, idx) => {
                const isSelected = idx === slideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      setSlideIndex(idx);
                      setIsSlidePlaying(false);
                    }}
                    className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected ? "border-brand-primary ring-2 ring-brand-primary/30" : "border-brand-border opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image src={slide.image} alt={slide.stage} fill sizes="96px" className="object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white text-center py-0.5 truncate">
                      {idx + 1}. {slide.stage}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── 4. WHAT MAKES HM DIFFERENT ─── */}
        <section className="relative w-full bg-brand-surface-alt py-16 sm:py-20 border-b border-brand-border">
          <div className="page-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-space text-xs font-bold tracking-wider text-brand-green uppercase block mb-1.5">
                HONEST DIFFERENCE
              </span>
              <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink leading-tight">
                Ever wondered why some agarbattis give you a headache?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-brand-slate">
                Here is exactly what we put in — and what we strictly keep out of every HM packet.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reasons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center rounded-2xl border border-brand-border bg-white p-6 shadow-2xs hover:border-brand-primary/50 transition group"
                >
                  <div className={`h-14 w-14 rounded-full border border-brand-border flex items-center justify-center mb-4 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-playfair text-base sm:text-lg font-bold text-brand-ink mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. BOTTOM CONVERSATIONAL CTA ─── */}
        <section className="relative w-full overflow-hidden bg-brand-primary text-white py-12 sm:py-16">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="font-space text-xs font-bold tracking-wider text-brand-accent uppercase block">
                  READY FOR A CLEANER POOJA ROOM?
                </span>

                <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  Try our 10-in-1 family pack or pure Bhimseni camphor.
                </h2>

                <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                  Order online or reach out directly on WhatsApp. We dispatch every order fresh from Coimbatore across South India within 24–48 hours.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-accent hover:bg-[#F4A220] text-brand-ink px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    <span>Browse All Products</span>
                    <ArrowRight size={15} />
                  </Link>

                  <a
                    href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I'd like to ask a few questions before placing an order.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 hover:bg-white/10 text-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition"
                  >
                    <MessageCircle size={15} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/20 group">
                  <Image
                    src="/images/craftsmanship/featured/featured_08.webp"
                    alt="HM Agarbattis 10-in-1 family pack prepared in Coimbatore"
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    Packed Fresh in Coimbatore
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {lightboxSlide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={() => setLightboxSlide(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSlide(null)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/20 hover:bg-white/30 text-white p-2.5 transition cursor-pointer"
          >
            <X size={20} />
          </button>

          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[70vh] bg-neutral-950 flex items-center justify-center">
              <Image
                src={lightboxSlide.image}
                alt={lightboxSlide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
                priority
              />
            </div>

            <div className="p-4 sm:p-5 bg-white text-brand-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-brand-border">
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block mb-1">
                  Stage {lightboxSlide.index}: {lightboxSlide.stage}
                </span>
                <h3 className="font-brand text-sm sm:text-base font-bold text-brand-heading leading-snug">
                  {lightboxSlide.heading}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed mt-0.5">
                  {lightboxSlide.conversationalText}
                </p>
              </div>

              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello HM Brand, I am looking at photo #${lightboxSlide.index} (${lightboxSlide.heading}) on your About page.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#14532D] text-white text-xs font-semibold px-4 py-2 hover:bg-[#0F3F22] transition shrink-0 whitespace-nowrap"
              >
                <MessageCircle size={14} />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Flame,
  Layers,
  Eye,
  LayoutGrid,
  Play,
  Pause,
  ShieldCheck,
  Leaf,
  Heart,
} from "lucide-react";
import {
  FEATURED_WORKSHOP_SLIDES,
  type FeaturedSlide,
} from "@/lib/featured-workshop-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

type WorkshopCategory = "all" | "pastes" | "crafting" | "camphor-sambrani" | "dispatch";
type ViewMode = "grid" | "slideshow";

interface FilterOption {
  id: WorkshopCategory;
  label: string;
  stageIndices: number[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "All Moments", stageIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "pastes", label: "Raw Pastes & Resins", stageIndices: [1, 3, 4] },
  { id: "crafting", label: "Hand-Rolling & Curing", stageIndices: [2, 5] },
  { id: "camphor-sambrani", label: "Pure Camphor & Sambrani", stageIndices: [6, 11] },
  { id: "dispatch", label: "Packaging & Dispatch", stageIndices: [7, 8, 9, 10, 12] },
];

export function WorkshopShowcase() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeFilter, setActiveFilter] = useState<WorkshopCategory>("all");
  const [showAllStages, setShowAllStages] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Slideshow state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter slides based on category
  const filteredSlides = FEATURED_WORKSHOP_SLIDES.filter((slide) => {
    if (activeFilter === "all") return true;
    const filter = FILTER_OPTIONS.find((f) => f.id === activeFilter);
    return filter ? filter.stageIndices.includes(slide.index) : true;
  });

  const totalSlides = FEATURED_WORKSHOP_SLIDES.length;

  // Curated 6 primary cards for the top Bento collage in "all" mode
  // 1. Stage 06 (Hero Camphor)
  // 2. Stage 01 (Paste Prep)
  // 3. Stage 02 (Hand Rolling)
  // 4. Stage 03 (Sacred Flower)
  // 5. Stage 04 (Forest Resins)
  // 6. Stage 05 (Curing Racks)
  // Plus remaining 6 stages shown when showAllStages is true
  const bentoHero = FEATURED_WORKSHOP_SLIDES[5]; // Stage 06
  const bentoStack1 = FEATURED_WORKSHOP_SLIDES[0]; // Stage 01
  const bentoStack2 = FEATURED_WORKSHOP_SLIDES[1]; // Stage 02
  const bentoRow1 = [
    FEATURED_WORKSHOP_SLIDES[2], // Stage 03
    FEATURED_WORKSHOP_SLIDES[3], // Stage 04
    FEATURED_WORKSHOP_SLIDES[4], // Stage 05
  ];
  const bentoRemainingRow1 = [
    FEATURED_WORKSHOP_SLIDES[6], // Stage 07
    FEATURED_WORKSHOP_SLIDES[7], // Stage 08
    FEATURED_WORKSHOP_SLIDES[8], // Stage 09
  ];
  const bentoRemainingRow2 = [
    FEATURED_WORKSHOP_SLIDES[9], // Stage 10
    FEATURED_WORKSHOP_SLIDES[10], // Stage 11
    FEATURED_WORKSHOP_SLIDES[11], // Stage 12
  ];

  // Slideshow controls
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (viewMode !== "slideshow" || !isPlaying) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [viewMode, isPlaying, nextSlide]);

  // Lightbox controls
  const openLightboxBySlide = (slide: FeaturedSlide) => {
    const fullIndex = FEATURED_WORKSHOP_SLIDES.findIndex((s) => s.id === slide.id);
    setLightboxIndex(fullIndex >= 0 ? fullIndex : 0);
  };

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % totalSlides));
  }, [lightboxIndex, totalSlides]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! - 1 + totalSlides) % totalSlides));
  }, [lightboxIndex, totalSlides]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowRight") nextLightbox();
      else if (e.key === "ArrowLeft") prevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  const activeLightboxSlide =
    lightboxIndex !== null ? FEATURED_WORKSHOP_SLIDES[lightboxIndex] : null;
  const currentSlide = FEATURED_WORKSHOP_SLIDES[currentSlideIndex];

  return (
    <section
      aria-labelledby="workshop-showcase-heading"
      className="relative w-full bg-[#FAF7F2] py-8 sm:py-14 lg:py-16 border-t border-brand-border/60 font-sans overflow-hidden"
    >
      <div className="page-container">

        {/* ─── Conversational Section Header ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6 sm:mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2.5">
              <Sparkles size={13} className="shrink-0 text-brand-accent" />
              <span>Peelamedu Workshop Story</span>
            </div>

            <h2
              id="workshop-showcase-heading"
              className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-heading leading-tight"
            >
              Handcrafted in Coimbatore, from Dawn to Devotion
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-brand-slate font-normal leading-relaxed">
              Every morning, our artisans blend natural flower petals, forest tree resins, and pure botanical herbs by hand. Explore the authentic moments behind our daily craft:
            </p>
          </div>

          {/* Quick Origin Badge & View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-border text-xs text-brand-ink font-semibold shadow-2xs">
              <MapPin size={13} className="text-brand-primary shrink-0" />
              <span>Peelamedu, Coimbatore</span>
            </div>

            {/* View Mode Switcher: Collage Grid vs Story Slideshow */}
            <div className="inline-flex items-center bg-white border border-brand-border rounded-full p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Collage Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("slideshow")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "slideshow"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                <Play size={12} className={isPlaying ? "text-brand-accent" : ""} />
                <span>Story Slideshow</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Filter Tabs / Story Journey Pills ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {FILTER_OPTIONS.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.id);
                  if (filter.id !== "all") setShowAllStages(true);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                    : "bg-white text-brand-ink/80 border-brand-border/80 hover:bg-white/90 hover:border-brand-primary/40"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#F0EAE1] text-brand-slate"
                  }`}
                >
                  {filter.stageIndices.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: MATHEMATICALLY PERFECT COLLAGE GRID                          */}
        {/* ========================================================================= */}
        {viewMode === "grid" && (
          <div className="space-y-4 sm:space-y-5">
            {activeFilter === "all" ? (
              /* ─── FULL BENTO COLLAGE (ZERO HOLES, ZERO ORPHAN CARDS) ─── */
              <>
                {/* 1. TOP BLOCK: Hero Card (8 cols) + 2 Stacked Cards (4 cols) = 12 Cols Exactly Aligned */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                  {/* Hero Spotlight Card */}
                  <article
                    onClick={() => openLightboxBySlide(bentoHero)}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl md:col-span-2 lg:col-span-8 min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] flex flex-col justify-end"
                  >
                    <Image
                      src={bentoHero.image}
                      alt={bentoHero.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                    {/* Soft bottom vignette only behind text (leaves top 75% photo completely clean) */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 pointer-events-none" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/95 text-white text-[11px] sm:text-xs font-bold px-3 py-1 shadow-md border border-white/20 uppercase tracking-wide">
                        <Flame size={12} className="text-brand-accent" />
                        <span>Stage {String(bentoHero.index).padStart(2, "0")} • {bentoHero.stage}</span>
                      </span>
                      <span className="rounded-full bg-black/60 hover:bg-black/90 text-white p-2 border border-white/25 transition shadow-sm group-hover:scale-110">
                        <Maximize2 size={13} />
                      </span>
                    </div>

                    <div className="relative z-20 p-4 sm:p-6 text-white space-y-1">
                      <h3 className="font-brand text-base sm:text-xl lg:text-2xl font-bold leading-tight drop-shadow-xs text-white">
                        Pure Bhimseni Camphor
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-200 font-normal line-clamp-1 opacity-90">
                        Sublimates completely with zero black residue · Clean cooling pine aroma
                      </p>
                    </div>
                  </article>

                  {/* Two Stacked Cards on Right (Match Exact Height of Hero on lg) */}
                  <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-4 sm:gap-5 justify-between">
                    {[bentoStack1, bentoStack2].map((slide) => (
                      <article
                        key={slide.id}
                        onClick={() => openLightboxBySlide(slide)}
                        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md flex-1 min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] flex flex-col justify-end"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          sizes="(max-width: 1024px) 50vw, 34vw"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Soft bottom vignette */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                          <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                            Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                          </span>
                          <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                            <Maximize2 size={12} />
                          </span>
                        </div>

                        <div className="relative z-20 p-3 sm:p-4 text-white">
                          <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug truncate drop-shadow-xs">
                            {slide.stage}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-stone-300 truncate mt-0.5 opacity-90">
                            {slide.highlight}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* 2. MIDDLE BLOCK: 3 Equal Cards = 12 Cols Exactly Aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                  {bentoRow1.map((slide) => (
                    <article
                      key={slide.id}
                      onClick={() => openLightboxBySlide(slide)}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md min-h-[220px] sm:min-h-[240px] lg:min-h-[250px] flex flex-col justify-end"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Soft bottom vignette */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                        <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                          Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                        </span>
                        <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                          <Maximize2 size={12} />
                        </span>
                      </div>

                      <div className="relative z-20 p-3 sm:p-4 text-white">
                        <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug truncate drop-shadow-xs">
                          {slide.stage}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-stone-300 truncate mt-0.5 opacity-90">
                          {slide.highlight}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* 3. HERITAGE ARCHITECTURAL BANNER (Spans Full Width 12 Cols) */}
                <div className="rounded-2xl sm:rounded-3xl border border-[#DFB75A]/60 bg-gradient-to-br from-[#FFFDF8] via-[#FAF6ED] to-[#F5EFE3] p-5 sm:p-7 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full border border-brand-primary/20">
                          <Sparkles size={11} className="text-brand-accent" />
                          <span>The Artisan Code</span>
                        </span>
                        <span className="font-mono text-[10px] text-brand-slate font-bold">PEELAMEDU • COIMBATORE</span>
                      </div>

                      <h3 className="font-brand text-base sm:text-xl font-bold text-brand-heading leading-snug">
                        Purity starts with the hands that roll it.
                      </h3>

                      <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                        No mass-production industrial shortcuts. Our incense, camphor, and sambrani are hand-crafted by skilled women in Peelamedu, bringing temple-grade peace into South Indian homes.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-ink">
                        <span className="inline-flex items-center gap-1.5 bg-white/80 border border-brand-border px-3 py-1 rounded-full">
                          <Leaf size={13} className="text-brand-green" />
                          <span>100% Tree Gums &amp; Resins</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-white/80 border border-brand-border px-3 py-1 rounded-full">
                          <ShieldCheck size={13} className="text-brand-primary" />
                          <span>Hand-Rolled on Bamboo</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-white/80 border border-brand-border px-3 py-1 rounded-full">
                          <Heart size={13} className="text-brand-orange" />
                          <span>Gentle Indoor Air</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                      <a
                        href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          "Hello HM Brand, I was reading your Peelamedu Workshop Story and I'd like to ask a question about your handmade products."
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#14532D] hover:bg-[#0F3F22] text-white text-xs font-semibold px-5 py-2.5 transition shadow-xs active:scale-95 whitespace-nowrap"
                      >
                        <MessageCircle size={15} />
                        <span>Chat with Workshop Artisan</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setShowAllStages((prev) => !prev)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white hover:border-brand-primary hover:text-brand-primary text-xs font-bold text-brand-ink px-5 py-2.5 transition shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Eye size={14} className="text-brand-primary" />
                        <span>{showAllStages ? "Collapse Remaining Stages" : "View Remaining 6 Stages"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. EXPANDED BLOCKS: 2 Rows of 3 Cards = 12 Cols Exactly Aligned */}
                {showAllStages && (
                  <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                      {bentoRemainingRow1.map((slide) => (
                        <article
                          key={slide.id}
                          onClick={() => openLightboxBySlide(slide)}
                          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md min-h-[220px] sm:min-h-[240px] lg:min-h-[250px] flex flex-col justify-end"
                        >
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          {/* Soft bottom vignette */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                            <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                              Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                            </span>
                            <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                              <Maximize2 size={12} />
                            </span>
                          </div>

                          <div className="relative z-20 p-3 sm:p-4 text-white">
                            <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug truncate drop-shadow-xs">
                              {slide.stage}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-stone-300 truncate mt-0.5 opacity-90">
                              {slide.highlight}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                      {bentoRemainingRow2.map((slide) => (
                        <article
                          key={slide.id}
                          onClick={() => openLightboxBySlide(slide)}
                          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md min-h-[220px] sm:min-h-[240px] lg:min-h-[250px] flex flex-col justify-end"
                        >
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          {/* Soft bottom vignette */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                            <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                              Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                            </span>
                            <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                              <Maximize2 size={12} />
                            </span>
                          </div>

                          <div className="relative z-20 p-3 sm:p-4 text-white">
                            <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug truncate drop-shadow-xs">
                              {slide.stage}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-stone-300 truncate mt-0.5 opacity-90">
                              {slide.highlight}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ─── FILTERED VIEW: CLEAN UNIFORM 3-COLUMN GRID ─── */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                {filteredSlides.map((slide) => (
                  <article
                    key={slide.id}
                    onClick={() => openLightboxBySlide(slide)}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md min-h-[240px] sm:min-h-[260px] flex flex-col justify-end"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Soft bottom vignette */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                      <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                        Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                      </span>
                      <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                        <Maximize2 size={12} />
                      </span>
                    </div>

                    <div className="relative z-20 p-3 sm:p-4 text-white">
                      <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug truncate drop-shadow-xs">
                        {slide.stage}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-stone-300 truncate mt-0.5 opacity-90">
                        {slide.highlight}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: CINEMATIC STORY SLIDESHOW (MOTION / GIF-LIKE JOURNEY)         */}
        {/* ========================================================================= */}
        {viewMode === "slideshow" && currentSlide && (
          <div className="rounded-2xl sm:rounded-3xl border border-[#DFB75A]/60 bg-white shadow-md overflow-hidden">
            {/* Top Play/Pause & Stage Indicator Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-brand-border/60 bg-[#FAF7F2] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border text-brand-ink font-bold hover:border-brand-primary transition cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} className="text-brand-primary" />
                      <span>Pause Auto-Play</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} className="text-brand-primary" />
                      <span>Play Slideshow</span>
                    </>
                  )}
                </button>
                <span className="text-brand-slate hidden sm:inline">
                  Auto-advances every 5 seconds
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-primary">
                  {String(currentSlideIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-1.5 rounded-full bg-white border border-brand-border text-brand-ink hover:bg-brand-primary hover:text-white transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-1.5 rounded-full bg-white border border-brand-border text-brand-ink hover:bg-brand-primary hover:text-white transition cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Stage Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Photo Stage with Zoom Trigger */}
              <div
                onClick={() => openLightboxBySlide(currentSlide)}
                className="group relative lg:col-span-7 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[440px] bg-neutral-900 cursor-pointer overflow-hidden"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute top-4 left-4 rounded-full bg-brand-primary/95 text-white text-xs font-bold px-3 py-1 shadow-md border border-white/20 uppercase tracking-wide">
                  Stage {String(currentSlide.index).padStart(2, "0")} • {currentSlide.stage}
                </div>

                <div className="absolute bottom-4 right-4 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 border border-white/25 transition shadow-sm group-hover:scale-110">
                  <Maximize2 size={16} />
                </div>
              </div>

              {/* Right Editorial Story Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-b from-white to-[#FAF7F2]">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                    <Sparkles size={12} className="text-brand-accent" />
                    <span>{currentSlide.eyebrow}</span>
                  </div>

                  <h3 className="font-brand text-xl sm:text-2xl font-bold text-brand-heading leading-snug">
                    {currentSlide.heading}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {currentSlide.conversationalText}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-green bg-[#EAF5EC] border border-[#CBE0B5] p-3 rounded-xl">
                    <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                    <span>{currentSlide.highlight}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hello HM Brand, I am watching your workshop slideshow at Stage #${currentSlide.index} ("${currentSlide.heading}") and I want to ask a question.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#14532D] hover:bg-[#0F3F22] text-white text-xs font-semibold px-4 py-2 transition shadow-xs active:scale-95"
                  >
                    <MessageCircle size={15} />
                    <span>Ask on WhatsApp</span>
                  </a>

                  <Link
                    href="/shop"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-2 transition shadow-xs active:scale-95"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom 12-Stage Thumbnail Scrubber Strip */}
            <div className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-brand-border/60 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2.5 min-w-max">
                {FEATURED_WORKSHOP_SLIDES.map((slide, idx) => {
                  const isActive = currentSlideIndex === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => {
                        setCurrentSlideIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`group relative flex items-center gap-2 p-1.5 rounded-xl border transition cursor-pointer ${
                        isActive
                          ? "bg-white border-brand-primary shadow-xs ring-2 ring-brand-primary/20"
                          : "bg-white/70 border-brand-border hover:bg-white hover:border-brand-primary/40"
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={slide.image}
                          alt={slide.stage}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left pr-2">
                        <span className="text-[10px] font-bold text-brand-primary block uppercase">
                          Stage {String(slide.index).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] font-semibold text-brand-ink truncate max-w-[110px] block">
                          {slide.stage}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── Bottom Actions Bar ─── */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-brand-slate font-medium">
            <Sparkles size={14} className="text-brand-accent shrink-0" />
            <span>Click any workshop stage photo to view recipe details and zoom</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello HM Brand, I'd like to ask a question about your handcrafted incense and workshop in Coimbatore."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#14532D] hover:bg-[#0F3F22] text-white text-xs font-semibold px-4 py-2 transition shadow-xs active:scale-95"
            >
              <MessageCircle size={15} />
              <span>Ask on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-2 transition shadow-xs active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>

      {/* ─── FULL-SCREEN ZOOM LIGHTBOX MODAL ─── */}
      {lightboxIndex !== null && activeLightboxSlide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close enlarged view"
            className="absolute top-4 right-4 z-50 rounded-full bg-white/20 hover:bg-white/30 text-white p-2.5 transition active:scale-95 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Prev photo */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 z-50 rounded-full bg-black/60 hover:bg-black/90 text-white p-3 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next photo */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 z-50 rounded-full bg-black/60 hover:bg-black/90 text-white p-3 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          {/* Modal Card */}
          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Stage */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[66vh] bg-neutral-950 flex items-center justify-center">
              <Image
                src={activeLightboxSlide.image}
                alt={activeLightboxSlide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
                priority
              />

              <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 border border-white/20">
                Stage {activeLightboxSlide.index} of {totalSlides} • {activeLightboxSlide.stage}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 sm:p-6 bg-white text-brand-ink flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-border">
              <div className="min-w-0 flex-1 space-y-1">
                <span className="rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block">
                  {activeLightboxSlide.eyebrow}
                </span>
                <h3 className="font-brand text-base sm:text-lg font-bold text-brand-heading leading-snug">
                  {activeLightboxSlide.heading}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {activeLightboxSlide.conversationalText}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-brand-green font-semibold">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{activeLightboxSlide.highlight}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello HM Brand, I am viewing workshop photo #${activeLightboxSlide.index} ("${activeLightboxSlide.heading}") and I want to ask a question.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#14532D] hover:bg-[#0F3F22] text-white text-xs font-semibold px-4 py-2 transition shrink-0 whitespace-nowrap"
                >
                  <MessageCircle size={14} />
                  <span>Ask on WhatsApp</span>
                </a>

                <Link
                  href="/shop"
                  onClick={() => setLightboxIndex(null)}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-hover transition px-2 py-1"
                >
                  <span>Shop Item</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

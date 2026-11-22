"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import {
  FEATURED_WORKSHOP_SLIDES,
  type FeaturedSlide,
} from "@/lib/featured-workshop-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

type WorkshopCategory = "all" | "pastes" | "crafting" | "camphor-sambrani" | "dispatch";

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
  const [activeFilter, setActiveFilter] = useState<WorkshopCategory>("all");
  const [showAllStages, setShowAllStages] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter slides based on category
  const filteredSlides = FEATURED_WORKSHOP_SLIDES.filter((slide) => {
    if (activeFilter === "all") return true;
    const filter = FILTER_OPTIONS.find((f) => f.id === activeFilter);
    return filter ? filter.stageIndices.includes(slide.index) : true;
  });

  // In "all" mode without showAll, show curated 7 items + 1 story card for a balanced collage
  const displayedSlides =
    activeFilter === "all" && !showAllStages
      ? [
          FEATURED_WORKSHOP_SLIDES[5], // Stage 6: Camphor Pressing (Flagship)
          FEATURED_WORKSHOP_SLIDES[0], // Stage 1: Morning Paste Preparation
          FEATURED_WORKSHOP_SLIDES[1], // Stage 2: Hand-Rolling Agarbattis
          FEATURED_WORKSHOP_SLIDES[3], // Stage 4: Raw Forest Resins
          FEATURED_WORKSHOP_SLIDES[4], // Stage 5: Drying & Curing Racks
          FEATURED_WORKSHOP_SLIDES[7], // Stage 8: Family Pack Boxing
          FEATURED_WORKSHOP_SLIDES[10], // Stage 11: Sambrani Dhoop Cups
        ]
      : filteredSlides;

  const totalSlides = FEATURED_WORKSHOP_SLIDES.length;

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

  // Keyboard controls for lightbox
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

  return (
    <section
      aria-labelledby="workshop-collage-heading"
      className="relative w-full bg-[#FAF7F2] py-10 sm:py-16 border-t border-brand-border/60 font-sans overflow-hidden"
    >
      <div className="page-container">

        {/* ─── Conversational Section Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2.5">
              <Sparkles size={13} className="shrink-0 text-brand-accent" />
              <span>Peelamedu Workshop Story</span>
            </div>

            <h2
              id="workshop-collage-heading"
              className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-heading leading-tight"
            >
              Handcrafted in Coimbatore, from Dawn to Devotion
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-brand-slate font-normal leading-relaxed">
              Every morning, our artisans blend natural flower petals, forest tree resins, and pure botanical herbs by hand. Explore the authentic moments behind our daily craft:
            </p>
          </div>

          {/* Quick Counter & Peelamedu Badge */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-border text-xs text-brand-ink font-semibold shadow-2xs">
              <MapPin size={13} className="text-brand-primary shrink-0" />
              <span>Peelamedu, Coimbatore</span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs text-brand-primary font-bold">
              <Layers size={13} />
              <span>12 Workshop Stages</span>
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

        {/* ─── Collage Style Grid Layout ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">

          {/* 1. HERO SPOTLIGHT CARD (Featured Camphor / Paste Preparation) */}
          {displayedSlides.length > 0 && (
            <article
              onClick={() => openLightboxBySlide(displayedSlides[0])}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-[#E8DFD1] shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl sm:col-span-2 lg:col-span-7 min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex flex-col justify-end"
            >
              {/* Background Photo with Zoom on Hover */}
              <Image
                src={displayedSlides[0].image}
                alt={displayedSlides[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Dark Ambient Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/95 text-white text-[11px] sm:text-xs font-bold px-3 py-1 shadow-md border border-white/20 uppercase tracking-wide">
                  <Flame size={12} className="text-brand-accent" />
                  <span>Stage {String(displayedSlides[0].index).padStart(2, "0")} • {displayedSlides[0].stage}</span>
                </span>

                <span className="rounded-full bg-black/60 hover:bg-black/90 text-white p-2 border border-white/25 transition shadow-sm group-hover:scale-110">
                  <Maximize2 size={14} />
                </span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-20 p-5 sm:p-7 text-white space-y-2">
                <span className="font-brand text-[10px] sm:text-xs font-extrabold tracking-widest text-brand-accent uppercase block">
                  {displayedSlides[0].eyebrow}
                </span>

                <h3 className="font-brand text-lg sm:text-2xl font-bold leading-snug drop-shadow-xs text-white">
                  {displayedSlides[0].heading}
                </h3>

                <p className="text-xs sm:text-sm text-stone-200 font-normal leading-relaxed line-clamp-2 max-w-xl">
                  {displayedSlides[0].conversationalText}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs text-brand-accent-soft font-semibold bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[280px]">{displayedSlides[0].highlight}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white/90 group-hover:text-brand-accent transition">
                    <span>Enlarge photo</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* 2. SECOND CARD (Handcrafting or Top Right 1) */}
          {displayedSlides.length > 1 && (
            <article
              onClick={() => openLightboxBySlide(displayedSlides[1])}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-[#E8DFD1] shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg sm:col-span-1 lg:col-span-5 min-h-[220px] sm:min-h-[240px] lg:min-h-[220px] flex flex-col justify-end"
            >
              <Image
                src={displayedSlides[1].image}
                alt={displayedSlides[1].alt}
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

              <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between">
                <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                  Stage {String(displayedSlides[1].index).padStart(2, "0")} • {displayedSlides[1].stage}
                </span>
                <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                  <Maximize2 size={12} />
                </span>
              </div>

              <div className="relative z-20 p-4 sm:p-5 text-white">
                <h4 className="font-brand text-sm sm:text-base font-bold leading-snug line-clamp-2">
                  {displayedSlides[1].heading}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-200 mt-1 line-clamp-2">
                  {displayedSlides[1].conversationalText}
                </p>
              </div>
            </article>
          )}

          {/* 3. THIRD CARD (Top Right 2) */}
          {displayedSlides.length > 2 && (
            <article
              onClick={() => openLightboxBySlide(displayedSlides[2])}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-[#E8DFD1] shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg sm:col-span-1 lg:col-span-5 min-h-[220px] sm:min-h-[240px] lg:min-h-[220px] flex flex-col justify-end"
            >
              <Image
                src={displayedSlides[2].image}
                alt={displayedSlides[2].alt}
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

              <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between">
                <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                  Stage {String(displayedSlides[2].index).padStart(2, "0")} • {displayedSlides[2].stage}
                </span>
                <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                  <Maximize2 size={12} />
                </span>
              </div>

              <div className="relative z-20 p-4 sm:p-5 text-white">
                <h4 className="font-brand text-sm sm:text-base font-bold leading-snug line-clamp-2">
                  {displayedSlides[2].heading}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-200 mt-1 line-clamp-2">
                  {displayedSlides[2].conversationalText}
                </p>
              </div>
            </article>
          )}

          {/* 4. HERITAGE STORY CALLOUT CARD (Embedded directly into the collage) */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#DFB75A]/60 bg-gradient-to-br from-[#FFFDF8] via-[#FAF6ED] to-[#F5EFE3] p-5 sm:p-6 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-4 min-h-[240px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full border border-brand-primary/20">
                  <Sparkles size={11} className="text-brand-accent" />
                  <span>The Artisan Code</span>
                </span>
                <span className="font-mono text-[10px] text-brand-slate font-bold">EST. COIMBATORE</span>
              </div>

              <h3 className="font-brand text-base sm:text-lg font-bold text-brand-heading leading-snug">
                Purity starts with the hands that roll it.
              </h3>

              <p className="text-xs text-brand-slate mt-2 leading-relaxed">
                No mass-production industrial shortcuts. Our incense, camphor, and sambrani are hand-crafted by skilled women in Peelamedu, bringing temple-grade peace into South Indian homes.
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border/70 mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-green">
                <CheckCircle2 size={14} className="text-brand-green shrink-0" />
                <span>100% Honest Ingredients</span>
              </div>

              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hello HM Brand, I was reading your Peelamedu Workshop Story and I'd like to ask a question about your handmade products."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-hover transition"
              >
                <MessageCircle size={13} />
                <span>Ask Workshop</span>
              </a>
            </div>
          </div>

          {/* 5. REMAINING COLLAGE ITEMS */}
          {displayedSlides.slice(3).map((slide) => (
            <article
              key={slide.id}
              onClick={() => openLightboxBySlide(slide)}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-[#E8DFD1] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md sm:col-span-1 lg:col-span-4 min-h-[230px] sm:min-h-[250px] flex flex-col justify-end"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />

              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                <span className="rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border border-white/20">
                  Stage {String(slide.index).padStart(2, "0")} • {slide.stage}
                </span>
                <span className="rounded-full bg-black/50 text-white p-1.5 border border-white/20 transition group-hover:scale-110">
                  <Maximize2 size={12} />
                </span>
              </div>

              <div className="relative z-20 p-4 text-white">
                <h4 className="font-brand text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                  {slide.heading}
                </h4>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                  {slide.highlight}
                </p>
              </div>
            </article>
          ))}

        </div>

        {/* ─── Bottom Actions & View All Toggle ─── */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {activeFilter === "all" && (
              <button
                type="button"
                onClick={() => setShowAllStages((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border bg-white text-xs font-bold text-brand-ink hover:border-brand-primary hover:text-brand-primary transition shadow-2xs cursor-pointer active:scale-95"
              >
                <Eye size={14} className="text-brand-primary" />
                <span>{showAllStages ? "Show Curated Collage (7)" : "View All 12 Workshop Stages"}</span>
              </button>
            )}

            <span className="text-xs text-brand-slate font-medium">
              Click any photo to read full recipe details
            </span>
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

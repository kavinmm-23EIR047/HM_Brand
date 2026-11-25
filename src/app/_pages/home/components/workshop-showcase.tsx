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
  Leaf,
  ShieldCheck,
  Heart,
} from "lucide-react";
import {
  FEATURED_WORKSHOP_SLIDES,
  type FeaturedSlide,
} from "@/lib/featured-workshop-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

export function WorkshopShowcase() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const totalSlides = FEATURED_WORKSHOP_SLIDES.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % totalSlides);
  }, [lightboxIndex, totalSlides]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + totalSlides) % totalSlides);
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

  const activeSlide =
    lightboxIndex !== null ? FEATURED_WORKSHOP_SLIDES[lightboxIndex] : null;

  return (
    <section
      aria-labelledby="workshop-gallery-heading"
      className="relative w-full bg-[#FAF7F2] py-10 sm:py-16 border-t border-brand-border/60 font-sans overflow-hidden"
    >
      <div className="page-container">

        {/* ========================================================================= */}
        {/* 1. HUMANIZED WORKSHOP EDITORIAL STORY (ABOVE THE GALLERY)                  */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-8 sm:mb-12">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
            <Sparkles size={13} className="shrink-0 text-brand-accent" />
            <span>Peelamedu Workshop Story</span>
          </div>

          {/* Main title */}
          <h2
            id="workshop-gallery-heading"
            className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-heading leading-tight"
          >
            Handcrafted in Coimbatore, from Dawn to Devotion
          </h2>

          {/* Humanized narrative copy */}
          <p className="text-xs sm:text-base text-brand-slate leading-relaxed font-normal max-w-2xl mx-auto">
            Before the sun rises over Coimbatore, our artisans begin blending crushed temple flower petals, forest tree resins, and pure botanical wood powders by hand. Every single stick is hand-rolled onto real bamboo and cured naturally on wooden aeration racks &mdash; bringing honest temple peace and pure white smoke into South Indian homes.
          </p>

          {/* 3 Core Purity Pillars */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-brand-ink">
            <span className="inline-flex items-center gap-1.5 bg-white border border-brand-border px-3.5 py-1.5 rounded-full shadow-2xs">
              <Leaf size={14} className="text-brand-green" />
              <span>100% Tree Gums &amp; Resins</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-brand-border px-3.5 py-1.5 rounded-full shadow-2xs">
              <ShieldCheck size={14} className="text-brand-primary" />
              <span>Hand-Rolled on Natural Bamboo</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-brand-border px-3.5 py-1.5 rounded-full shadow-2xs">
              <Heart size={14} className="text-brand-orange" />
              <span>Gentle White Smoke for Pooja</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3.5 py-1.5 rounded-full">
              <MapPin size={13} />
              <span>Peelamedu, Coimbatore</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PURE CLEAN PHOTO GALLERY (NO TEXT OVERLAYS BLOCKING THE IMAGES)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
          {FEATURED_WORKSHOP_SLIDES.map((slide, index) => (
            <article
              key={slide.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DFD1] shadow-2xs cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-primary/50"
            >
              {/* Pure Unobstructed High-Quality Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                loading={index < 4 ? "eager" : "lazy"}
              />

              {/* Minimal Clean Stage Badge (Top Left) */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <span className="inline-flex items-center rounded-full bg-black/65 backdrop-blur-md text-white px-2 py-0.5 text-[10px] font-bold tracking-wide border border-white/20">
                  {String(slide.index).padStart(2, "0")}
                </span>
              </div>

              {/* Subtle Zoom Icon (Top Right on Hover) */}
              <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/20 shadow-xs">
                  <Maximize2 size={12} />
                </span>
              </div>

              {/* Clean Minimal Title Pill at Bottom on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-2.5 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-bold truncate drop-shadow-xs">
                  {slide.stage}
                </p>
                <p className="text-[10px] text-brand-accent-soft truncate">
                  {slide.highlight}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 3. CLEAN BOTTOM BAR: WHATSAPP ARTISAN HOTLINE & SHOP EXPLORE               */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-slate text-center sm:text-left">
            Have questions about our handmade agarbattis, dhoop cups, or pure camphor? Chat directly with our Peelamedu workshop team.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello HM Brand, I was viewing your Peelamedu Workshop gallery and I'd like to ask a question about your handmade products."
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

      {/* ========================================================================= */}
      {/* 4. FULL-SCREEN LIGHTBOX MODAL WITH FULL STORY DETAILS                     */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && activeSlide && (
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
            aria-label="Close enlarged photo"
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

          {/* Modal Container */}
          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* High-Resolution Photo */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[66vh] bg-neutral-950 flex items-center justify-center">
              <Image
                src={activeSlide.image}
                alt={activeSlide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
                priority
              />

              <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 border border-white/20">
                Stage {activeSlide.index} of {totalSlides} &middot; {activeSlide.stage}
              </div>
            </div>

            {/* Story Details Card Below Image */}
            <div className="p-4 sm:p-6 bg-white text-brand-ink flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-border">
              <div className="min-w-0 flex-1 space-y-1">
                <span className="rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block">
                  {activeSlide.eyebrow}
                </span>
                <h3 className="font-brand text-base sm:text-lg font-bold text-brand-heading leading-snug">
                  {activeSlide.heading}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {activeSlide.conversationalText}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-brand-green font-semibold">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{activeSlide.highlight}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello HM Brand, I am viewing workshop photo #${activeSlide.index} ("${activeSlide.heading}") and I want to ask a question.`
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

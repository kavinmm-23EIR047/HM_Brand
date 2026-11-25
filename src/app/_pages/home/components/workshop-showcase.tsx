"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
          <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold text-brand-ink sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 sm:text-xs">
            <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
              <Leaf size={14} className="text-brand-green" />
              <span>100% Tree Gums &amp; Resins</span>
            </span>
            <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
              <ShieldCheck size={14} className="text-brand-primary" />
              <span>Hand-Rolled on Natural Bamboo</span>
            </span>
            <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
              <Heart size={14} className="text-brand-orange" />
              <span>Gentle White Smoke for Pooja</span>
            </span>
            <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2 py-2 text-center leading-tight text-brand-primary sm:min-h-0 sm:px-3.5 sm:py-1.5">
              <MapPin size={13} />
              <span>Peelamedu, Coimbatore</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PURE CLEAN PHOTO GALLERY (NO TEXT OVERLAYS BLOCKING THE IMAGES)        */}
        {/* ========================================================================= */}
        <Swiper
          modules={[A11y, Autoplay, Pagination]}
          className="workshop-gallery-swiper"
          slidesPerView={1.15}
          slidesPerGroup={1}
          spaceBetween={14}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={700}
          pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 4 }}
          a11y={{ paginationBulletMessage: "Go to workshop gallery page {{index}}" }}
          breakpoints={{
            640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
            900: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
          }}
        >
          {FEATURED_WORKSHOP_SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <article
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DFD1] shadow-2xs cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-primary/50"
              >
              {/* Pure Unobstructed High-Quality Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 640px) 86vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
              <div className="absolute inset-x-0 bottom-0 p-2.5 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100">
                <p className="font-brand text-white text-xs font-bold tracking-wide truncate drop-shadow-xs">
                  {slide.stage}
                </p>
                <p className="text-[10px] text-brand-accent-soft truncate">
                  {slide.highlight}
                </p>
              </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ========================================================================= */}
        {/* 3. CLEAN BOTTOM BAR: WHATSAPP ARTISAN HOTLINE & SHOP EXPLORE               */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-slate text-center sm:text-left">
            Have questions about our handmade agarbattis, dhoop cups, or pure camphor? Chat directly with our Peelamedu workshop team.
          </p>

          <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello HM Brand, I was viewing your Peelamedu Workshop gallery and I'd like to ask a question about your handmade products."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#14532D] px-2 py-2 text-[9px] font-semibold text-white shadow-xs transition active:scale-95 hover:bg-[#0F3F22] sm:w-auto sm:px-4 sm:text-xs"
            >
              <MessageCircle size={15} />
              <span>Ask on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-brand-primary px-2 py-2 text-[9px] font-bold uppercase tracking-wide text-white shadow-xs transition active:scale-95 hover:bg-brand-primary-hover sm:w-auto sm:gap-1.5 sm:px-5 sm:text-xs sm:tracking-wider"
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

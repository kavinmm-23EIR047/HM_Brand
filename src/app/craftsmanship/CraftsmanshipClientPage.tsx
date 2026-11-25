"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Sparkles,
  MapPin,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  CRAFTSMANSHIP_IMAGES,
  type CraftImage,
} from "@/lib/craftsmanship-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

export default function CraftsmanshipClientPage() {
  const [selectedImage, setSelectedImage] = useState<CraftImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const totalImages = CRAFTSMANSHIP_IMAGES.length;

  const openLightbox = (item: CraftImage, idx: number) => {
    setLightboxIndex(idx);
    setSelectedImage(item);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showNext = useCallback(() => {
    if (totalImages === 0) return;
    const nextIdx = (lightboxIndex + 1) % totalImages;
    setLightboxIndex(nextIdx);
    setSelectedImage(CRAFTSMANSHIP_IMAGES[nextIdx]);
  }, [lightboxIndex, totalImages]);

  const showPrev = useCallback(() => {
    if (totalImages === 0) return;
    const prevIdx = (lightboxIndex - 1 + totalImages) % totalImages;
    setLightboxIndex(prevIdx);
    setSelectedImage(CRAFTSMANSHIP_IMAGES[prevIdx]);
  }, [lightboxIndex, totalImages]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, showNext, showPrev]);

  return (
    <div className="min-h-screen bg-brand-surface-alt text-brand-ink flex flex-col justify-between w-full max-w-full overflow-x-clip font-sans">
      <Navigation />

      <main className="w-full max-w-full overflow-x-clip">
        {/* ========================================================================= */}
        {/* 1. HERO BANNER: HUMANIZED WORKSHOP STORY (ABOVE THE GALLERY)              */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#FAF7F0] pt-8 sm:pt-14 pb-10 sm:pb-16 border-b border-brand-border">
          <div className="page-container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-2 flex items-center justify-center gap-1.5 text-xs text-brand-slate">
                <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link>
                <span>/</span>
                <span className="font-semibold text-brand-primary">Workshop Craftsmanship</span>
              </nav>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
                <Sparkles size={13} className="shrink-0 text-brand-accent" />
                <span>Peelamedu, Coimbatore Workshop</span>
              </div>

              <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-brand-heading leading-tight">
                Behind Every Stick: <span className="text-brand-primary">Crafted With Devotion</span>
              </h1>

              <p className="text-xs sm:text-base text-brand-slate leading-relaxed font-normal max-w-2xl mx-auto">
                An authentic, step-by-step photographic view inside our Coimbatore workshop. From kneading raw tree gums and hand-rolling each bamboo stick to slow natural aeration racks and direct dispatch to South Indian homes.
              </p>

              {/* 4 Core Craft Guarantees */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold text-brand-ink sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:text-xs">
                <div className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
                  <Leaf className="h-4 w-4 text-brand-green" />
                  <span>100% Tree Gums &amp; Resins</span>
                </div>
                <div className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-primary" />
                  <span>Hand-Rolled on Natural Bamboo</span>
                </div>
                <div className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-2 py-2 text-center leading-tight shadow-2xs sm:min-h-0 sm:px-3.5 sm:py-1.5">
                  <Heart className="h-4 w-4 text-brand-orange" />
                  <span>Clean White Smoke for Pooja</span>
                </div>
                <div className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2 py-2 text-center leading-tight text-brand-primary sm:min-h-0 sm:px-3.5 sm:py-1.5">
                  <MapPin size={13} />
                  <span>Peelamedu, Coimbatore</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PURE CLEAN PHOTO GALLERY (NO FILTERS, NO TEXT PLASTERED ON IMAGES)     */}
        {/* ========================================================================= */}
        <section className="py-10 sm:py-16 bg-brand-surface-alt">
          <div className="page-container">
            {/* Gallery Heading */}
            <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border/70 pb-4">
              <div>
                <span className="font-brand text-xs font-bold uppercase tracking-wider text-brand-primary">
                  AUTHENTIC PHOTO ARCHIVE
                </span>
                <h2 className="font-brand text-xl sm:text-2xl font-bold text-brand-heading uppercase tracking-wide">
                  Workshop Journey in 12 Moments
                </h2>
              </div>
              <p className="text-xs text-brand-slate">
                Click any photo to view full craftsmanship story &amp; details
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
              {CRAFTSMANSHIP_IMAGES.map((item, idx) => (
                <article
                  key={item.id}
                  onClick={() => openLightbox(item, idx)}
                  className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DFD1] shadow-2xs cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-primary/50"
                >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />

                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="inline-flex items-center rounded-full bg-black/65 backdrop-blur-md text-white px-2 py-0.5 text-[10px] font-bold tracking-wide border border-white/20">
                        {String(item.index).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/20 shadow-xs">
                        <Maximize2 size={12} />
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-2.5 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100">
                      <p className="font-brand text-white text-xs font-bold tracking-wide truncate drop-shadow-xs">
                        {item.stageName}
                      </p>
                      <p className="text-[10px] text-brand-accent-soft truncate">
                        {item.highlight}
                      </p>
                    </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FACTORY VISIT & BULK ENQUIRY CTA BAR                                   */}
        {/* ========================================================================= */}
        <section className="bg-brand-primary text-white py-12 sm:py-16">
          <div className="page-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl mx-auto text-center md:text-left">
              <div>
                <span className="font-brand text-xs font-bold uppercase tracking-wider text-brand-accent-soft block mb-1">
                  WHOLESALE &amp; TEMPLE ENQUIRIES
                </span>
                <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide text-white leading-tight">
                  Interested in Bulk Orders or Visiting Our Workshop?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                  We supply authentic botanical agarbattis, pure Bhimseni camphor, and natural cup sambrani to retail shops, temples, and pooja stores across South India.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 justify-center">
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I saw your workshop craftsmanship photos and I want to enquire about bulk/wholesale orders.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-accent hover:bg-[#F4A220] text-brand-darkest font-sans font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition active:scale-95 whitespace-nowrap shadow-md cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Talk to Us on WhatsApp</span>
                </a>

                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 hover:bg-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition active:scale-95 whitespace-nowrap"
                >
                  <span>Browse Products</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 4. FULL-SCREEN LIGHTBOX MODAL                                             */}
      {/* ========================================================================= */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-3 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo preview"
            className="absolute top-4 right-4 z-50 rounded-full bg-white/20 hover:bg-white/30 text-white p-2.5 transition active:scale-95 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 z-50 rounded-full bg-black/60 hover:bg-black/90 text-white p-3 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
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
            {/* Image Viewport */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[66vh] bg-neutral-950 flex items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
                priority
              />

              <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 border border-white/20">
                Stage {selectedImage.index} of {totalImages} &middot; {selectedImage.stageName}
              </div>
            </div>

            {/* Narrative Story Section */}
            <div className="p-4 sm:p-6 bg-white text-brand-ink flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-border">
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                  {selectedImage.categoryLabel}
                </span>
                <h3 className="font-brand text-base sm:text-lg font-bold text-brand-heading leading-snug">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {selectedImage.story}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-brand-green font-semibold">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{selectedImage.highlight}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello HM Brand, I was inspecting workshop photo #${selectedImage.index} ("${selectedImage.title}") and I would like to ask a question.`
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
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-hover transition px-2 py-1"
                >
                  <span>Shop Collection</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

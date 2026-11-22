"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Search,
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
  Eye,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  CRAFTSMANSHIP_IMAGES,
  CRAFT_CATEGORIES,
  type CraftImage,
} from "@/lib/craftsmanship-data";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact-info";

export default function CraftsmanshipClientPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<CraftImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Filter curated milestone images
  const filteredImages = useMemo(() => {
    return CRAFTSMANSHIP_IMAGES.filter((img) => {
      const matchesCategory = activeCategory === "all" || img.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        img.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        img.story.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        img.stageName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        img.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const openLightbox = (item: CraftImage) => {
    const idx = filteredImages.findIndex((img) => img.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setSelectedImage(item);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showNext = useCallback(() => {
    if (filteredImages.length === 0) return;
    const nextIdx = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(nextIdx);
    setSelectedImage(filteredImages[nextIdx]);
  }, [lightboxIndex, filteredImages]);

  const showPrev = useCallback(() => {
    if (filteredImages.length === 0) return;
    const prevIdx = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(prevIdx);
    setSelectedImage(filteredImages[prevIdx]);
  }, [lightboxIndex, filteredImages]);

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
        {/* HERO BANNER: AUTHENTIC, HUMANIZED WORKSHOP STORY                          */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#FAF7F0] pt-7 sm:pt-12 pb-10 sm:pb-14 border-b border-brand-border">
          <div className="page-container">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3.5 flex items-center gap-1.5 text-xs text-brand-slate">
                <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link>
                <span>/</span>
                <span className="font-semibold text-brand-primary">Workshop Craftsmanship</span>
              </nav>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
                <Sparkles size={13} className="shrink-0 text-brand-accent" />
                <span>Peelamedu, Coimbatore Workshop</span>
              </div>

              <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-brand-heading leading-tight">
                Behind Every Stick: <span className="text-brand-primary">Crafted With Devotion</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed font-normal">
                An honest, step-by-step view inside our Coimbatore workshop. From blending raw tree gums and hand-rolling each bamboo stick to slow natural aeration racks and direct dispatch to South Indian homes.
              </p>

              {/* 3 Core Craft Guarantees */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-border px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                  <Leaf className="h-4 w-4 text-brand-green" />
                  <span>100% Tree Gums &amp; Resins</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-border px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-brand-primary" />
                  <span>Hand-Rolled on Natural Bamboo</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-border px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-2xs">
                  <Sparkles className="h-4 w-4 text-brand-orange" />
                  <span>Clean White Smoke for Pooja</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE CONTROLS: CATEGORIES & SEARCH                                  */}
        {/* ========================================================================= */}
        <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border py-3 shadow-2xs">
          <div className="page-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {CRAFT_CATEGORIES.map((tab) => {
                  const isActive = activeCategory === tab.id;
                  const count =
                    tab.id === "all"
                      ? CRAFTSMANSHIP_IMAGES.length
                      : CRAFTSMANSHIP_IMAGES.filter((img) => img.category === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-brand-primary text-white shadow-xs border border-brand-primary"
                          : "bg-brand-surface text-brand-ink/80 border border-brand-border hover:border-brand-primary/50 hover:bg-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-black/5 text-brand-slate"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workshop steps..."
                  className="w-full rounded-full border border-brand-border bg-brand-surface pl-8 pr-7 py-1.5 text-xs outline-none transition focus:border-brand-primary focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-ink"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLEAN EDITORIAL CARDS GRID (CURATED TOP CLEAR WORKSHOP MILESTONES)          */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-12 bg-brand-surface-alt">
          <div className="page-container">
            {/* Header / Results counter */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/70 pb-3">
              <div>
                <span className="font-brand text-xs font-bold uppercase tracking-wider text-brand-primary">
                  WORKSHOP MILESTONES
                </span>
                <h2 className="font-brand text-lg sm:text-2xl font-bold text-brand-heading uppercase tracking-wide">
                  Top Craftsmanship Stages
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-brand-slate">
                <span>Showing <strong>{filteredImages.length}</strong> curated milestones</span>
                {activeCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className="text-brand-primary font-semibold hover:underline cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Clean Workshop Cards */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredImages.map((item, idx) => (
                  <article
                    key={item.id}
                    onClick={() => openLightbox(item)}
                    className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EADBBD] bg-white shadow-2xs transition-all duration-300 hover:shadow-card hover:border-brand-primary/60 cursor-pointer"
                  >
                    {/* Image Container with Crisp Overlays */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-surface-soft">
                      <Image
                        src={item.thumb}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={idx < 4 ? "eager" : "lazy"}
                      />

                      {/* Top Step Pill & Preview Button */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-brand-primary text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {item.step}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-xs p-1.5 text-white opacity-80 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={13} />
                      </div>

                      {/* Bottom Category Pill */}
                      <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-ink shadow-2xs border border-brand-border/60">
                        {item.categoryLabel}
                      </div>
                    </div>

                    {/* Content Section: Humanized & Descriptive */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-brand-green uppercase tracking-wide block mb-1">
                          {item.stageName}
                        </span>
                        <h3 className="font-brand text-base sm:text-lg font-bold text-brand-heading leading-snug group-hover:text-brand-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-[13px] text-brand-slate leading-relaxed font-normal">
                          {item.story}
                        </p>
                      </div>

                      {/* Highlight Box with Checkmark */}
                      <div className="pt-2 border-t border-[#F0E8D8]">
                        <div className="flex items-start gap-1.5 text-xs font-semibold text-[#1B4332] bg-[#EAF5EC] px-3 py-1.5 rounded-xl border border-[#D1E7DD]">
                          <CheckCircle2 size={14} className="shrink-0 text-brand-green mt-0.5" />
                          <span className="leading-tight">{item.highlight}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-brand-slate">
                          <span className="text-[11px] text-brand-slate/80">Peelamedu, Coimbatore</span>
                          <span className="inline-flex items-center gap-1 font-bold text-brand-primary group-hover:translate-x-0.5 transition-transform">
                            <span>Inspect Photo</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-brand-border bg-white p-12 text-center max-w-md mx-auto">
                <p className="text-base font-bold text-brand-ink">No workshop stages match your search</p>
                <p className="mt-1 text-xs text-brand-slate">Try selecting another chapter or clear your search term.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-primary text-white text-xs font-bold uppercase px-4 py-2 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM FACTORY VISIT & BULK ENQUIRY CTA                                   */}
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

      {/* ─── FULL-SCREEN LIGHTBOX MODAL ─── */}
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
            aria-label="Previous milestone"
            className="absolute left-2 sm:left-6 z-50 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 sm:p-3 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next milestone"
            className="absolute right-2 sm:right-6 z-50 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 sm:p-3 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>

          {/* Modal Container */}
          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview Box */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[64vh] bg-neutral-950 flex items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
                priority
              />
            </div>

            {/* Bottom Caption and Actions */}
            <div className="p-4 sm:p-6 bg-white text-brand-ink flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-border">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                    {selectedImage.step}
                  </span>
                  <span className="rounded-full bg-[#EAF5EC] text-[#1B4332] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border border-[#D1E7DD]">
                    {selectedImage.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono text-brand-slate hidden sm:inline">
                    Milestone {lightboxIndex + 1} of {filteredImages.length}
                  </span>
                </div>
                <h3 className="font-brand text-base sm:text-xl font-bold text-brand-heading leading-snug">
                  {selectedImage.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mt-1">
                  {selectedImage.story}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green">
                  <CheckCircle2 size={13} />
                  <span>{selectedImage.highlight}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border">
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello HM Brand, I was viewing ${selectedImage.step}: ${selectedImage.title} in your workshop gallery. I would like more information on your craftsmanship.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#14532D] hover:bg-[#0F3F22] text-white text-xs font-bold px-4 py-2.5 transition active:scale-95 shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

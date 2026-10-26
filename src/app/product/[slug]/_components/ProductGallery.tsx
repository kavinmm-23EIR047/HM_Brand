"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Sparkles, Leaf } from "lucide-react";
import { Lotus } from "@/components/illustrations/Lotus";
import type { ProductImageItem } from "@/lib/products";

interface ProductGalleryProps {
  images?: ProductImageItem[];
  fallbackImage?: string;
  productName: string;
  badge?: string;
}

export function ProductGallery({
  images = [],
  fallbackImage,
  productName,
  badge,
}: ProductGalleryProps) {
  // Dynamically extract and deduplicate images strictly from props/backend (no hardcoded dummy fallbacks)
  const rawList: Array<{ url: string; altText?: string; isPrimary?: boolean }> = [];

  if (Array.isArray(images) && images.length > 0) {
    images.forEach((img) => {
      if (img?.url && typeof img.url === "string" && img.url.trim()) {
        rawList.push({
          url: img.url.trim(),
          altText: img.altText || productName,
          isPrimary: Boolean(img.isPrimary),
        });
      }
    });
  }

  if (rawList.length === 0 && fallbackImage && typeof fallbackImage === "string" && fallbackImage.trim()) {
    rawList.push({
      url: fallbackImage.trim(),
      altText: productName,
      isPrimary: true,
    });
  }

  // Deduplicate strictly by URL so no duplicate images appear
  const seenUrls = new Set<string>();
  const validImages: Array<{ url: string; altText?: string; isPrimary?: boolean }> = [];

  for (const img of rawList) {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      validImages.push(img);
    }
  }

  const initialIndex = Math.max(
    0,
    validImages.findIndex((img) => img.isPrimary)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  useEffect(() => {
    const idx = validImages.findIndex((img) => img.isPrimary);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [images, fallbackImage]);

  // Keep activeIndex within bounds if images change
  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(0);
    }
  }, [validImages.length, activeIndex]);

  const activeImage = validImages[activeIndex] || validImages[0];

  const handlePrev = () => {
    if (validImages.length <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    if (validImages.length <= 1) return;
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-4 w-full">
      {/* ── 1. MAIN ATMOSPHERIC PRODUCT IMAGE ── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3.8] lg:aspect-[4/4] overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-border bg-brand-surface-soft shadow-sm group">
        
        {/* Top-Left Badge (Only if badge provided from backend) */}
        {badge && (
          <div className="absolute top-3.5 left-3.5 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9E1830] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm border border-white/20">
              <Star size={11} fill="currentColor" />
              <span>{badge}</span>
            </span>
          </div>
        )}

        {/* Top-Right Counter Pill (only displayed when there are multiple images e.g. 1/2, 1/3) */}
        {validImages.length > 1 && (
          <div className="absolute top-3.5 right-3.5 z-20">
            <span className="inline-flex items-center rounded-full bg-black/45 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white border border-white/20 shadow-xs">
              {activeIndex + 1}/{validImages.length}
            </span>
          </div>
        )}

        {/* Main Image Display */}
        {activeImage?.url ? (
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <img
              key={activeImage.url}
              src={activeImage.url}
              alt={activeImage.altText || productName}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-[#173B3A]/40">
            <span className="text-6xl mb-2">🪔</span>
            <span className="font-playfair text-xl font-bold text-[#173B3A]">
              {productName}
            </span>
          </div>
        )}

        {/* Prev / Next Navigation Buttons */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 border border-[#EADBBD] text-[#173B3A] hover:bg-[#9E1830] hover:text-white hover:border-[#9E1830] shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 border border-[#EADBBD] text-[#173B3A] hover:bg-[#9E1830] hover:text-white hover:border-[#9E1830] shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ── 2. THUMBNAILS ROW ── */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-0.5 sm:pb-1 scrollbar-none">
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-14 w-14 sm:h-20 sm:w-20 aspect-square shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? "border-2 border-[#9E1830] ring-2 ring-[#9E1830]/25 shadow-sm scale-105"
                    : "border-[#EADBBD] opacity-80 hover:opacity-100 hover:border-[#9E1830]/60"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover aspect-square pointer-events-none"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ── 3. 4 FEATURE CARDS (CHARCOAL-FREE, HANDCRAFTED, PURE BOTANICALS, SAFE & NATURAL) ── */}
      {/* Compact 4-column trust row keeps the mobile product overview short. */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 pt-0.5 sm:pt-1">
        {/* Charcoal-Free */}
        <div className="min-w-0 rounded-lg sm:rounded-2xl border border-[#EADBBD] bg-white p-1.5 sm:p-3 text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5 shadow-2xs hover:border-[#287541] transition-colors">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#287541]/10 text-[#287541] flex items-center justify-center">
            <Leaf size={12} />
          </div>
          <span className="text-[9px] sm:text-xs font-bold text-[#173B3A] leading-tight block">
            Charcoal-Free
          </span>
        </div>

        {/* Handcrafted */}
        <div className="min-w-0 rounded-lg sm:rounded-2xl border border-[#EADBBD] bg-white p-1.5 sm:p-3 text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5 shadow-2xs hover:border-[#F47A20] transition-colors">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#F47A20]/10 text-[#F47A20] flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="text-[9px] sm:text-xs font-bold text-[#173B3A] leading-tight block">
            Handcrafted
          </span>
        </div>

        {/* Pure Botanicals */}
        <div className="min-w-0 rounded-lg sm:rounded-2xl border border-[#EADBBD] bg-white p-1.5 sm:p-3 text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5 shadow-2xs hover:border-[#9E1830] transition-colors">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#9E1830]/10 text-[#9E1830] flex items-center justify-center">
            <Lotus className="w-4 h-3.5 sm:w-5 sm:h-4" />
          </div>
          <span className="text-[9px] sm:text-xs font-bold text-[#173B3A] leading-tight block">
            Pure Botanicals
          </span>
        </div>

        {/* Safe & Natural */}
        <div className="min-w-0 rounded-lg sm:rounded-2xl border border-[#EADBBD] bg-white p-1.5 sm:p-3 text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5 shadow-2xs hover:border-[#287541] transition-colors">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#287541]/10 text-[#287541] flex items-center justify-center">
            <ShieldCheck size={12} />
          </div>
          <span className="text-[9px] sm:text-xs font-bold text-[#173B3A] leading-tight block">
            Safe &amp; Natural
          </span>
        </div>
      </div>
    </div>
  );
}

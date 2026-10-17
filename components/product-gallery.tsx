"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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
  // Normalize images list
  const validImages: Array<{ url: string; altText?: string; isPrimary?: boolean }> =
    images && images.length > 0
      ? images
      : fallbackImage
      ? [{ url: fallbackImage, altText: productName, isPrimary: true }]
      : [];

  // Determine initial index (primary image if found)
  const initialIndex = Math.max(
    0,
    validImages.findIndex((img) => img.isPrimary)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Sync if images change
  useEffect(() => {
    const idx = validImages.findIndex((img) => img.isPrimary);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [images, fallbackImage]);

  const activeImage = validImages[activeIndex] || validImages[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      {/* Main Image Container */}
      <div className="relative flex min-h-[320px] sm:min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#f8f0df] p-4 sm:p-8 shadow-sm border border-[#C89B3C]/20 group">
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-[#E85D04] text-[#FFF8E7] text-[10px] sm:text-xs font-bold tracking-wider uppercase px-3 py-1 rounded shadow-xs">
            {badge}
          </span>
        )}

        {/* Counter indicator */}
        {validImages.length > 1 && (
          <span className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            {activeIndex + 1} / {validImages.length}
          </span>
        )}

        {/* Active Image or Fallback */}
        {activeImage?.url ? (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <img
              key={activeImage.url}
              src={activeImage.url}
              alt={activeImage.altText || productName}
              className="max-h-[340px] sm:max-h-[400px] w-full object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="text-center text-[#6B4226] py-12">
            <span className="text-7xl block mb-4">🪔</span>
            <span className="font-display text-2xl font-bold block text-[#6B4226]">
              {productName}
            </span>
            <p className="text-xs text-[#292524]/60 mt-1 font-sans">
              Authentic HM Brand Formulation
            </p>
          </div>
        )}

        {/* Prev / Next navigation buttons (visible on hover or mobile) */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-[#6B4226] hover:bg-white hover:text-[#a90c35] shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-[#6B4226] hover:bg-white hover:text-[#a90c35] shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Quality Badges */}
        <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-[#C89B3C]/30 pt-4 text-[9px] font-semibold text-[#6B4226] sm:text-xs">
          <span>✦ Charcoal-Free</span>
          <span>✦ Coimbatore Made</span>
          <span>✦ Pure Resins</span>
        </div>
      </div>

      {/* Thumbnails row (shown when multiple images exist) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-thin">
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f8f0df] p-1 transition-all ${
                  isSelected
                    ? "border-[#a90c35] ring-2 ring-[#a90c35]/30 shadow-md scale-105"
                    : "border-[#C89B3C]/30 hover:border-[#C89B3C] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
                {img.isPrimary && (
                  <span className="absolute bottom-0.5 right-0.5 bg-[#a90c35] text-white text-[8px] font-black px-1 rounded">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

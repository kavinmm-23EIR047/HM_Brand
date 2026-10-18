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
      <div className="relative flex min-h-[320px] sm:min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#FAF3E0]/60 p-4 sm:p-8 transition-colors group">
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-[#9E1830] text-[#FFF8E7] text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            {badge}
          </span>
        )}

        {/* Counter indicator */}
        {validImages.length > 1 && (
          <span className="absolute top-4 right-4 z-10 bg-[#173B3A]/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
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
              className="max-h-[340px] sm:max-h-[400px] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="text-center text-[#6B4226] py-12">
            <span className="text-7xl block mb-4">🪔</span>
            <span className="font-playfair text-2xl font-bold block text-[#173B3A]">
              {productName}
            </span>
            <p className="text-xs text-[#52625A] mt-1 font-sans">
              Authentic HM Brand Formulation
            </p>
          </div>
        )}

        {/* Prev / Next navigation buttons */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 text-[#173B3A] hover:text-[#9E1830] shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 text-[#173B3A] hover:text-[#9E1830] shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row (shown when multiple images exist) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 px-0.5">
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-[#FAF3E0]/70 p-1.5 transition-all ${
                  isSelected
                    ? "ring-2 ring-[#9E1830] opacity-100 scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

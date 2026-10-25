"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/products";

interface RelatedProductsSliderProps {
  products: Product[];
}

export function RelatedProductsSlider({ products }: RelatedProductsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.85;
    const newScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const totalDots = Math.min(5, products.length);
    const index = Math.round((scrollLeft / maxScroll) * (totalDots - 1));
    setActiveDot(Math.min(totalDots - 1, Math.max(0, index)));
  };

  const totalDots = Math.min(5, products.length);

  return (
    <section className="w-full pt-4 sm:pt-6 font-sans">
      {/* ── HEADER ROW: TITLE & ACTION BUTTONS (NO CONTAINER) ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="font-space text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1">
            SACRED HARMONY
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-bold text-brand-ink tracking-tight leading-snug">
            Complete Your Sacred Altar
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-brand-ink/70">
            Handcrafted pure botanicals and complementary fragrances to elevate your ritual space.
          </p>
        </div>

        {/* Action Controls: View All + Prev/Next Arrows */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start sm:self-end">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white hover:bg-brand-primary hover:text-white hover:border-brand-primary text-xs font-bold text-brand-ink px-4 py-2 sm:px-5 sm:py-2.5 transition-all shadow-2xs active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>View Full Shop</span>
            <ArrowRight size={13} />
          </Link>

          {/* Prev / Next Slide Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous products"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-brand-border bg-white flex items-center justify-center text-brand-ink hover:border-brand-primary hover:bg-brand-primary hover:text-white transition shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next products"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-brand-border bg-white flex items-center justify-center text-brand-ink hover:border-brand-primary hover:bg-brand-primary hover:text-white transition shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── SLIDE BASED TRACK (BORDER-CUTTING HORIZONTAL SCROLL) ── */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth py-3 px-1 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex-none w-[210px] min-[420px]:w-[230px] sm:w-[250px] md:w-[270px] lg:w-[280px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* ── PAGINATION DOTS ── */}
      {totalDots > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalDots }).map((_, dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => {
                if (!scrollRef.current) return;
                const { scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (maxScroll > 0) {
                  scrollRef.current.scrollTo({
                    left: (dot / (totalDots - 1)) * maxScroll,
                    behavior: "smooth",
                  });
                }
                setActiveDot(dot);
              }}
              aria-label={`Go to slide ${dot + 1}`}
              className={`block rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === dot ? "h-2 w-8 bg-brand-primary" : "h-2 w-2 bg-brand-border hover:bg-brand-primary/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

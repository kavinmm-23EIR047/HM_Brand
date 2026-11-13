"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/components/store";

function safeBannerHref(value?: string | null) {
  if (!value) return "/shop";
  const path = value.split(/[?#]/, 1)[0];
  return ["/", "/about", "/shop", "/contact"].includes(path) ? value : "/shop";
}

interface SlideItem {
  id?: string;
  title?: string;
  desktopImage: string;
  mobileImage?: string;
  href: string;
}

export function HeroBannerSlider() {
  const { dbBanners, isBannersLoading } = useStore();

  const activeSlides: SlideItem[] =
    dbBanners && dbBanners.length > 0
      ? dbBanners.map((b: any) => ({
        id: b.id,
        title: b.title || "HM Brand Sacred Fragrances",
        desktopImage: b.desktopImage || b.image,
        mobileImage: b.mobileImage,
        href: safeBannerHref(b.ctaLink),
      }))
      : [];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keep the current index valid when banners change.
  useEffect(() => {
    if (current >= total) {
      setCurrent(0);
    }
  }, [current, total]);

  // Autoplay
  useEffect(() => {
    if (paused || total <= 1) return;

    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, [paused, total, nextSlide]);

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) {
    if (!isBannersLoading) return null;
    return (
      <section aria-label="Loading promotional banner" aria-busy="true" className="w-full bg-brand-surface-alt">
        <div className="w-full h-[220px] sm:h-[380px] lg:h-[520px] animate-pulse bg-brand-border/40" />
      </section>
    );
  }

  return (
    <section
      aria-label="Promotional Hero Banners"
      className="relative w-full overflow-hidden bg-brand-surface-alt select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-width edge-to-edge hero slider */}
      <div className="group relative w-full overflow-hidden">

          {/* Carousel track */}
          <div
            className="flex w-full items-stretch transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {activeSlides.map((slide, index) => {
              const content = (
                <div className="relative w-full">
                  {/* Desktop / tablet banner */}
                  <img
                    src={slide.desktopImage}
                    alt={slide.title || "HM Brand Banner"}
                    draggable={false}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={`block w-full h-auto max-w-none ${slide.mobileImage
                        ? "hidden sm:block"
                        : "block"
                      }`}
                  />

                  {/* Mobile banner */}
                  {slide.mobileImage && (
                    <img
                      src={slide.mobileImage}
                      alt={slide.title || "HM Brand Banner"}
                      draggable={false}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="block w-full h-auto max-w-none sm:hidden"
                    />
                  )}
                </div>
              );

              return (
                <div
                  key={slide.id || index}
                  className="w-full min-w-0 flex-[0_0_100%]"
                >
                  {slide.href ? (
                    <Link
                      href={slide.href}
                      aria-label={slide.title || "Explore collection"}
                      className="block w-full"
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous banner"
                className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-brand-ink/85 text-white shadow-md transition hover:scale-105 hover:bg-brand-primary sm:left-4 sm:h-11 sm:w-11 lg:left-6"
              >
                <ChevronLeft size={22} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-brand-ink/85 text-white shadow-md transition hover:scale-105 hover:bg-brand-primary sm:right-4 sm:h-11 sm:w-11 lg:right-6"
              >
                <ChevronRight size={22} strokeWidth={2.4} />
              </button>
            </>
          )}

          {/* Bottom slide indicators */}
          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-brand-ink/80 px-3 py-1.5 shadow-md sm:bottom-5">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={current === i ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${current === i
                      ? "w-6 bg-brand-accent"
                      : "w-2 bg-white/70 hover:bg-white"
                    }`}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}

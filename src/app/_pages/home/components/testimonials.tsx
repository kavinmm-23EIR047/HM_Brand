"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Leaf } from "@/components/illustrations";

export function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      location: "Coimbatore",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      quote: "The fragrance is so soothing. It instantly creates a positive vibe at home during morning puja. Highly recommended!",
      rating: 5,
      tag: "Paal Sambrani",
    },
    {
      name: "Rahul Mehta",
      location: "Chennai",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      quote: "Pure and long-lasting agarbattis. I love the natural ingredients and chemical-free formula. The Paal Sambrani is authentic temple quality.",
      rating: 5,
      tag: "Super Series Agarbattis",
    },
    {
      name: "Anita Nair",
      location: "Bengaluru",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      quote: "Best Bhimseni camphor I have used. It burns cleanly with zero ash and leaves a divine, refreshing aroma in the entire house.",
      rating: 5,
      tag: "Bhimseni Camphor",
    },
    {
      name: "Karthik R.",
      location: "Madurai",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      quote: "The 10-in-1 family pack is phenomenal. Every single fragrance has a distinct, authentic temple scent without any smoky headache.",
      rating: 5,
      tag: "10-in-1 Family Pack",
    },
    {
      name: "Meenakshi S.",
      location: "Hyderabad",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      quote: "Kesar Loban sambrani cups fill the entire home with divine positivity. Perfect for evening pooja and meditation.",
      rating: 5,
      tag: "Kesar Loban",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Autoplay on mobile
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setIsPaused(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-12 sm:py-14 bg-brand-surface-warm border-b border-brand-orange/15 relative w-full overflow-hidden">
      <Leaf className="pointer-events-none absolute left-0 bottom-0 w-44 h-44 text-brand-green/10 rotate-12" />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="font-brand text-ui-11 sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1">
              REAL PEOPLE. REAL EXPERIENCES.
            </span>
            <h2 className="font-brand text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide text-brand-heading">
              What Our Customers Say
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-orange-deep bg-white px-4 py-2 rounded-full border border-brand-orange-deep/30 shadow-xs self-start sm:self-auto">
            <Star size={16} fill="currentColor" />
            <span>4.9 / 5 Overall Rating from 1,200+ Homes</span>
          </div>
        </div>

        {/* ========================================================
            MOBILE VIEW: Interactive Touch Swiper / Slides (< md)
            ======================================================== */}
        <div
          className="md:hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Viewport */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {reviews.map((rev, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-orange/25 shadow-sm flex flex-col justify-between min-h-[250px] relative overflow-hidden">
                    <Quote className="absolute right-4 top-4 text-brand-orange/10 w-14 h-14 pointer-events-none" />

                    <div>
                      {/* Top: Stars & Product Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                        <div className="flex text-brand-orange gap-1">
                          {Array(rev.rating).fill(null).map((_, i) => (
                            <Star key={i} size={15} fill="currentColor" />
                          ))}
                        </div>
                        {rev.tag && (
                          <span className="font-brand text-ui-10 sm:text-ui-11 font-bold uppercase tracking-wider text-brand-primary bg-brand-surface-warm px-3 py-1 rounded-full">
                            {rev.tag}
                          </span>
                        )}
                      </div>

                      {/* Quote */}
                      <p className="font-sans text-xs min-[360px]:text-sm text-brand-slate leading-relaxed font-medium italic relative z-10">
                        "{rev.quote}"
                      </p>
                    </div>

                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 pt-3.5 mt-3 border-t border-brand-surface-warm relative z-10">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover border border-brand-orange/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-brand font-bold text-xs min-[360px]:text-sm uppercase tracking-wide text-brand-heading flex items-center gap-1 break-words">
                          <span>{rev.name}</span>
                          <CheckCircle2 size={13} className="text-brand-green shrink-0" />
                        </h4>
                        <span className="font-sans text-xs text-brand-green-dark font-semibold block break-words">
                          {rev.role} • {rev.location}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Controls: Prev/Next Buttons + Slide Dots + Counter */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    current === i
                      ? "w-6 h-2 bg-brand-primary"
                      : "w-2 h-2 bg-brand-ink/20 hover:bg-brand-ink/40"
                  }`}
                />
              ))}
            </div>

            {/* Counter and Arrows */}
            <div className="flex items-center gap-2">
              <span className="font-space text-xs font-bold text-brand-ink/60 mr-1">
                {current + 1} / {reviews.length}
              </span>
              <button
                onClick={prevSlide}
                aria-label="Previous review"
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-ink border border-brand-orange/30 shadow-xs active:scale-95 transition hover:bg-brand-primary hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next review"
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-ink border border-brand-orange/30 shadow-xs active:scale-95 transition hover:bg-brand-primary hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            DESKTOP / TABLET VIEW: 3-Card Grid (>= md)
            ======================================================== */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-brand-orange/20 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <Quote className="absolute right-4 top-4 text-brand-orange/10 w-16 h-16 pointer-events-none" />

              <div>
                {/* 5 Stars & Tag */}
                <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                  <div className="flex text-brand-orange gap-1">
                    {Array(rev.rating).fill(null).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  {rev.tag && (
                    <span className="font-brand text-ui-10 sm:text-ui-11 font-bold uppercase tracking-wider text-brand-primary bg-brand-surface-warm px-3 py-1 rounded-full">
                      {rev.tag}
                    </span>
                  )}
                </div>

                <p className="font-sans text-sm sm:text-base text-brand-slate leading-relaxed font-medium italic mb-6 relative z-10">
                  "{rev.quote}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-surface-warm relative z-10">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-brand-orange/30 shrink-0"
                />
                <div>
                  <h4 className="font-brand font-bold text-sm sm:text-base uppercase tracking-wide text-brand-heading flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 size={14} className="text-brand-green" />
                  </h4>
                  <span className="font-sans text-xs text-brand-green-dark font-semibold block">
                    {rev.role} • {rev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

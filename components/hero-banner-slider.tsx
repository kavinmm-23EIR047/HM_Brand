"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { Leaf } from "./illustrations";

import { useStore } from "./store";

const slides = [
  {
    badge: "🇮🇳 1ST TIME IN INDIA",
    eyebrow: "SMELL OF PURITY • HM BRAND",
    script: "Beyond Form,",
    heading: "Fragrance Speaks",
    quote: "உருவத்திற்கு அப்பால், வாசனை பேசுகிறது; உங்கள் இதயத்தால் கேளுங்கள்.",
    copy: "Introducing India's First 10-in-1 Aroma Family Pack. 10 divine botanical fragrances crafted for daily prayers and mindful living.",
    cta: "Explore 10-in-1 Pack",
    href: "/shop",
    image: "/images/mascot_1.png",
    product: "/images/camphor_cutout.jpg",
    side: "Listen With Your Heart",
  },
  {
    badge: "100% BOTANICAL RESINS",
    eyebrow: "PURE, NATURAL & CHARCOAL-FREE",
    script: "A Little Calm,",
    heading: "Everyday Rituals",
    quote: "Pure Bhimseni Camphor, Cup Sambrani & Flora Agarbattis from Coimbatore.",
    copy: "Bring a softer, more mindful feeling to your home with sacred fragrances inspired by the pure goodness of nature.",
    cta: "Shop Camphor & Sambrani",
    href: "/category/Camphor",
    image: "/images/mascot_3.png",
    product: "/images/camphor_cutout.jpg",
    side: "Coimbatore Crafted 🇮🇳",
  },
  {
    badge: "SACRED TEMPLE HERITAGE",
    eyebrow: "INDULGE WITH NEW FRAGRANCE",
    script: "Find Your God",
    heading: "Within Your Soul",
    quote: "Ancient Agamic formulations for daily prayer, meditation & festive moments.",
    copy: "From morning Brahma Muhurta prayers to peaceful evenings, discover sacred aromas that elevate your home with divine peace.",
    cta: "Shop Pooja Essentials",
    href: "/collections",
    image: "/images/mascot_4.png",
    product: "/images/agarbatti_cutout.jpg",
    side: "Smell of Purity",
  },
];

export function HeroBannerSlider() {
  const { dbBanners } = useStore();

  const activeSlides = dbBanners && dbBanners.length > 0
    ? dbBanners.map((b) => ({
        eyebrow: b.subtitle || "NATURAL FRAGRANCES FOR A CALMER, HAPPIER YOU",
        script: "Good Scents",
        heading: b.title,
        copy: b.subtitle || "Handcrafted agarbattis & divine essentials made with pure ingredients.",
        cta: b.ctaText || "Explore Collection",
        href: b.ctaLink || "/shop",
        image: b.desktopImage || "/images/mascot_1.png",
        product: "/images/camphor_cutout.jpg",
        side: "A Piece of Peace, Everyday",
      }))
    : slides;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
<<<<<<< HEAD
    const timer = setInterval(() => setCurrent((n) => (n + 1) % activeSlides.length), 6000);
    return () => clearInterval(timer);
  }, [paused, activeSlides.length]);
  const slide = activeSlides[current] || activeSlides[0];
  const move = (by: number) => setCurrent((n) => (n + by + activeSlides.length) % activeSlides.length);
=======
    const timer = setInterval(() => setCurrent((n) => (n + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[current];
  const move = (by: number) => setCurrent((n) => (n + by + slides.length) % slides.length);
>>>>>>> d4c37a685181678238b0d3fac10872588c366b67

  return (
    <section
      className="home-hero relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Leaf className="pointer-events-none absolute -left-9 bottom-0 h-48 w-36 rotate-[-24deg] text-[#287345]/25" />
      
      <div className="relative mx-auto grid min-h-[280px] max-w-[1440px] w-full grid-cols-1 items-center gap-1 px-3 py-6 min-[360px]:px-4 sm:min-h-[300px] sm:gap-2 sm:px-10 sm:py-8 lg:min-h-[340px] lg:grid-cols-[1fr_1fr] lg:px-14 lg:py-8">
        
        {/* Left Column Text */}
        <div className="relative z-10 mx-auto w-full max-w-[580px] py-2 text-center lg:mx-0 lg:text-left space-y-2">
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="rounded-full bg-[#F6C84C] px-3 py-1 text-[10px] font-black tracking-wider text-[#173B3A] shadow-xs uppercase">
              {slide.badge}
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-[#9E1830] uppercase">
              {slide.eyebrow}
            </span>
          </div>

          <div>
            <p className="font-script text-[38px] sm:text-5xl lg:text-[56px] leading-[0.95] text-[#9E1830]">
              {slide.script}
            </p>
            <h1 className="mt-0.5 text-[30px] sm:text-4xl lg:text-[50px] font-extrabold leading-[1.05] tracking-tight text-[#173B3A] font-heading">
              {slide.heading}
            </h1>
          </div>

          {slide.quote && (
            <p className="font-sans text-[11px] sm:text-xs text-[#9E1830] font-semibold italic">
              &ldquo;{slide.quote}&rdquo;
            </p>
          )}

          <p className="mx-auto mt-2 max-w-[490px] text-xs sm:text-[13px] leading-relaxed text-[#292524]/85 lg:mx-0 font-sans">
            {slide.copy}
          </p>

          <div className="pt-2">
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#9E1830] hover:bg-[#F47A20] px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:scale-105 active:scale-95"
            >
              <span>{slide.cta}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
<<<<<<< HEAD
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:left-14 lg:translate-x-0">
          {activeSlides.map((item, i) => <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${current === i ? "w-7 bg-[#bd0b43]" : "w-2 bg-[#173b3a]/25"}`} />)}
=======

        {/* Right Column Mascot & Product Preview */}
        <div className="relative flex min-h-[180px] w-full items-center justify-center sm:min-h-[240px] lg:min-h-[320px]">
          <div className="absolute inset-x-8 bottom-2 h-28 rounded-[50%] bg-[#f3ca72]/35 blur-2xl" />
          
          <Image
            src={slide.image}
            alt="HM Agarbattis divine mascot"
            width={340}
            height={340}
            priority
            className="relative z-10 h-[180px] w-[180px] max-w-full object-contain sm:h-[280px] sm:w-[280px] lg:h-[330px] lg:w-[330px] drop-shadow-lg"
          />

          {/* Floating Product Badge */}
          <div className="absolute bottom-0 left-[4%] z-20 flex items-center gap-2 rounded-2xl border border-[#F6C84C]/60 bg-white/95 p-2 shadow-lg sm:bottom-3 sm:left-[12%]">
            <Image
              src={slide.product}
              alt="Featured HM fragrance"
              width={56}
              height={56}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#9E1830]">
                Smell of Purity
              </p>
              <p className="text-[11px] font-extrabold text-[#173B3A]">
                100% Botanical
              </p>
            </div>
          </div>

          {/* Side Script Accent */}
          <div className="absolute right-[4%] top-1/2 hidden -translate-y-1/2 rotate-6 text-center font-script text-2xl sm:text-3xl leading-none text-[#9E1830] sm:block">
            {slide.side}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => move(-1)}
            aria-label="Previous slide"
            className="absolute left-1 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#173B3A] shadow-md transition hover:bg-[#9E1830] hover:text-white sm:h-9 sm:w-9"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Next slide"
            className="absolute right-1 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#173B3A] shadow-md transition hover:bg-[#9E1830] hover:text-white sm:h-9 sm:w-9"
          >
            <ChevronRight size={18} />
          </button>
>>>>>>> d4c37a685181678238b0d3fac10872588c366b67
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:left-14 lg:translate-x-0">
          {slides.map((item, i) => (
            <button
              key={item.heading}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                current === i ? "w-8 bg-[#9E1830]" : "w-2 bg-[#173B3A]/25"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

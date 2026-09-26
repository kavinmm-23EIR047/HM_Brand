"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Leaf } from "./illustrations";

const slides = [
  { eyebrow: "NATURAL FRAGRANCES FOR A CALMER, HAPPIER YOU", script: "Good Scents", heading: "Brighter Days", copy: "Handcrafted agarbattis, camphor and pooja essentials made with pure ingredients to bring peace, positivity and good energy to your home.", cta: "Explore Collection", href: "/shop", image: "/images/mascot_1.png", product: "/images/camphor_cutout.jpg", side: "A Piece of Peace, Everyday" },
  { eyebrow: "PURE, NATURAL & THOUGHTFULLY MADE", script: "A little calm", heading: "Everyday Rituals", copy: "Bring a softer, more mindful feeling to your home with fragrances inspired by the goodness of nature.", cta: "Shop Camphor", href: "/category/Camphor", image: "/images/mascot_3.png", product: "/images/camphor_cutout.jpg", side: "Made with care in India" },
  { eyebrow: "MAKE SPACE FOR WHAT MATTERS", script: "Find your peace", heading: "Mindful Living", copy: "From morning prayers to quiet evenings, discover beautiful aromas for the moments that make a home.", cta: "Shop Pooja Essentials", href: "/category/Special Collections", image: "/images/mascot_4.png", product: "/images/agarbatti_cutout.jpg", side: "A ritual for every day" },
];

export function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);
  const slide = slides[current];
  const move = (by: number) => setCurrent((n) => (n + by + slides.length) % slides.length);

  return (
    <section className="home-hero relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Leaf className="absolute -left-9 bottom-0 h-48 w-36 rotate-[-24deg] text-[#287345]/25" />
      <div className="relative mx-auto grid min-h-[260px] max-w-[1440px] grid-cols-1 items-center gap-1 px-3 py-6 min-[360px]:px-4 sm:min-h-[280px] sm:gap-2 sm:px-10 sm:py-8 lg:min-h-[320px] lg:grid-cols-[.9fr_1.1fr] lg:px-14 lg:py-6">
        <div className="relative z-10 mx-auto w-full max-w-[560px] py-2 text-center lg:mx-0 lg:text-left">
          <p className="mb-2 text-[8px] font-extrabold tracking-[.16em] text-[#3f6653] min-[360px]:text-[9px] sm:text-xs sm:tracking-[.2em]">{slide.eyebrow}</p>
          <p className="font-script text-[40px] leading-[.95] text-[#b20d3b] min-[360px]:text-5xl sm:text-6xl lg:text-[68px]">{slide.script}</p>
          <h1 className="mt-1 text-[32px] font-extrabold leading-[1.02] tracking-[-.045em] text-[#176238] min-[360px]:text-4xl sm:text-5xl lg:text-[58px]">{slide.heading}</h1>
          <p className="mx-auto mt-2 max-w-[470px] text-xs leading-relaxed text-[#172b28] min-[360px]:mt-3 min-[360px]:text-[13px] sm:text-sm lg:mx-0">{slide.copy}</p>
          <Link href={slide.href} className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#bd0b43] px-5 py-2.5 text-[11px] font-extrabold text-white shadow-md transition hover:bg-[#930b35] min-[360px]:mt-4 min-[360px]:px-6 min-[360px]:py-3 min-[360px]:text-xs">
            {slide.cta}<ArrowRight size={16} />
          </Link>
        </div>
        <div className="relative flex min-h-[158px] items-center justify-center min-[360px]:min-h-[185px] sm:min-h-[225px] lg:min-h-[300px]">
          <div className="absolute inset-x-8 bottom-2 h-24 rounded-[50%] bg-[#f3ca72]/35 blur-2xl" />
          <Image src={slide.image} alt="HM Agarbattis wellness mascot" width={340} height={340} priority className="relative z-10 h-[170px] w-[170px] object-contain min-[360px]:h-[200px] min-[360px]:w-[200px] sm:h-[290px] sm:w-[290px] lg:h-[335px] lg:w-[335px]" />
          <div className="absolute bottom-0 left-[8%] z-20 flex items-center gap-1.5 rounded-xl border border-[#e7d7b2] bg-white/90 p-1.5 shadow-lg min-[360px]:bottom-1 min-[360px]:left-[13%] min-[360px]:gap-2 min-[360px]:rounded-2xl min-[360px]:p-2 sm:bottom-3 sm:left-[17%]">
            <Image src={slide.product} alt="Featured HM fragrance" width={62} height={56} className="h-9 w-10 object-contain min-[360px]:h-12 min-[360px]:w-14" />
            <div><p className="text-[8px] font-bold uppercase tracking-wider text-[#bd0b43] min-[360px]:text-[9px]">HM Essentials</p><p className="text-[10px] font-extrabold text-[#203e31] min-[360px]:text-xs">Pure & natural</p></div>
          </div>
          <div className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 rotate-6 text-center font-script text-3xl leading-none text-[#bd0b43] sm:block lg:right-[4%]">{slide.side}</div>
          <button onClick={() => move(-1)} aria-label="Previous slide" className="absolute left-0 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-[#173b3a] shadow-md transition hover:bg-[#bd0b43] hover:text-white min-[360px]:h-9 min-[360px]:w-9"><ChevronLeft size={18} /></button>
          <button onClick={() => move(1)} aria-label="Next slide" className="absolute right-0 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-[#173b3a] shadow-md transition hover:bg-[#bd0b43] hover:text-white min-[360px]:h-9 min-[360px]:w-9"><ChevronRight size={18} /></button>
        </div>
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:left-14 lg:translate-x-0">
          {slides.map((item, i) => <button key={item.heading} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${current === i ? "w-7 bg-[#bd0b43]" : "w-2 bg-[#173b3a]/25"}`} />)}
        </div>
      </div>
    </section>
  );
}

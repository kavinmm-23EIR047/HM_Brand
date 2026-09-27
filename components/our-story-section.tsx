"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

export function OurStorySection() {
  return (
    <section className="py-12 sm:py-16 bg-[#DDECCB] relative w-full overflow-hidden my-8 sm:my-12 border-y border-[#3F7D45]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="font-space text-[10px] sm:text-xs font-bold tracking-widest text-[#9E1830] uppercase block">
              ✦ OUR STORY &amp; HERITAGE ✦
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#173B3A] leading-tight">
              Bringing Nature, Tradition &amp; Wellbeing Together
            </h2>
            <p className="font-sans text-xs sm:text-base text-[#173B3A]/85 font-medium leading-relaxed max-w-xl">
              At HM Agarbattis, we believe in the power of natural fragrances to create a calmer, happier and more positive life. Our products are thoughtfully crafted with pure ingredients, inspired by India's rich traditions and a modern mindful lifestyle.
            </p>

            {/* 3 Horizontal Connected Phases (Yoga • God • Virtue) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1">
              {/* Phase 1: Yoga & Mindfulness */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-[#F6C84C]/80 bg-[#FFF8E7] p-2.5 sm:p-4 shadow-xs transition hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#3F7D45] text-white shadow-xs">
                    <Leaf size={14} className="sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#3F7D45]/70 uppercase">01</span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-[11px] sm:text-sm text-[#173B3A] block leading-tight">
                    Yoga &amp; Mind
                  </span>
                  <span className="font-sans text-[9px] sm:text-xs text-[#3F7D45] font-semibold block leading-tight mt-0.5">
                    Ancient Tradition
                  </span>
                </div>
              </div>

              {/* Phase 2: God & Devotion */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-[#F6C84C]/80 bg-[#FFF8E7] p-2.5 sm:p-4 shadow-xs transition hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#9E1830] text-white shadow-xs">
                    <Heart size={14} className="sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#9E1830]/70 uppercase">02</span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-[11px] sm:text-sm text-[#173B3A] block leading-tight">
                    God &amp; Prayer
                  </span>
                  <span className="font-sans text-[9px] sm:text-xs text-[#9E1830] font-semibold block leading-tight mt-0.5">
                    Sacred Wellbeing
                  </span>
                </div>
              </div>

              {/* Phase 3: Pure Virtue */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-[#F6C84C]/80 bg-[#FFF8E7] p-2.5 sm:p-4 shadow-xs transition hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#F47A20] text-white shadow-xs">
                    <Sparkles size={14} className="sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#F47A20]/70 uppercase">03</span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-[11px] sm:text-sm text-[#173B3A] block leading-tight">
                    Pure Virtue
                  </span>
                  <span className="font-sans text-[9px] sm:text-xs text-[#F47A20] font-semibold block leading-tight mt-0.5">
                    Better Tomorrow
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/our-story"
                className="bg-[#9E1830] hover:bg-[#F47A20] text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-[11px] sm:text-xs tracking-wider uppercase transition shadow-md inline-flex items-center gap-2 group active:scale-95"
              >
                <span>Know Our Story</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Crayonism Illustration Uniting Yoga, God & Virtue */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative aspect-square w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] flex items-center justify-center">
              <Image
                src="/images/hm_story_yoga_god_virtue.png"
                alt="HM feel-good crayonism art uniting Yoga meditation, sacred God devotion, and natural virtue"
                fill
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
                className="object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

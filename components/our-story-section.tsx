"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";
import { Leaf as LeafSVG } from "./illustrations";

export function OurStorySection() {
  return (
    <section className="py-16 sm:py-20 bg-[#DDECCB] relative overflow-hidden my-12 border-y border-[#3F7D45]/20">
      <LeafSVG className="absolute left-0 top-0 w-64 h-64 text-[#3F7D45]/10 -rotate-45" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block">
              OUR STORY
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#173B3A] leading-tight">
              Bringing Nature, Tradition & Wellbeing Together
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#173B3A]/85 font-medium leading-relaxed max-w-xl">
              At HM Agarbattis, we believe in the power of natural fragrances to create a calmer, happier and more positive life. Our products are thoughtfully crafted with pure ingredients, inspired by India's rich traditions and a modern mindful lifestyle.
            </p>

            {/* 3 Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FFF4D6] p-4 rounded-2xl border border-[#F6C84C] flex items-center gap-3 shadow-xs">
                <div className="p-2.5 rounded-full bg-[#3F7D45] text-white">
                  <Leaf size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-[#173B3A] block">Inspired</span>
                  <span className="font-sans text-[11px] text-[#3F7D45] font-semibold">by Tradition</span>
                </div>
              </div>

              <div className="bg-[#FFF4D6] p-4 rounded-2xl border border-[#F6C84C] flex items-center gap-3 shadow-xs">
                <div className="p-2.5 rounded-full bg-[#9E1830] text-white">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-[#173B3A] block">Driven</span>
                  <span className="font-sans text-[11px] text-[#9E1830] font-semibold">by Wellbeing</span>
                </div>
              </div>

              <div className="bg-[#FFF4D6] p-4 rounded-2xl border border-[#F6C84C] flex items-center gap-3 shadow-xs">
                <div className="p-2.5 rounded-full bg-[#F47A20] text-white">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-[#173B3A] block">Made for</span>
                  <span className="font-sans text-[11px] text-[#F47A20] font-semibold">a Better Tomorrow</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/our-story"
                className="bg-[#9E1830] hover:bg-[#F47A20] text-white px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition shadow-md inline-flex items-center gap-2 group"
              >
                <span>Know Our Story</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right SVG & Yoga Mascot Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[288px] overflow-hidden rounded-[28px] bg-[#fff4d6] sm:w-80 sm:rounded-[32px] lg:w-[340px]">
              <Image
                src="/images/mascot_4.png"
                alt="HM Agarbattis flame mascot resting among leaves"
                fill
                sizes="(max-width: 640px) 288px, 340px"
                className="object-contain p-3"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

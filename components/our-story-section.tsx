"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles, ShieldCheck } from "lucide-react";

export function OurStorySection() {
  const values = [
    {
      number: "01",
      title: "Yoga & Mind",
      subtitle: "Ancient Tradition",
      description: "Find natural balance and mental clarity through pure botanical aromas.",
      icon: Leaf,
      accentColor: "#3F7D45",
      badgeBg: "bg-[#EAF5EC]",
      badgeText: "text-[#287541]",
      iconBg: "bg-[#3F7D45]/12",
      borderHover: "hover:border-[#3F7D45]/50",
    },
    {
      number: "02",
      title: "God & Prayer",
      subtitle: "Sacred Wellbeing",
      description: "Infuse your home and daily prayer rituals with divine temple fragrances.",
      icon: Heart,
      accentColor: "#9E1830",
      badgeBg: "bg-[#FFF2F4]",
      badgeText: "text-[#9E1830]",
      iconBg: "bg-[#9E1830]/12",
      borderHover: "hover:border-[#9E1830]/50",
    },
    {
      number: "03",
      title: "Pure Virtue",
      subtitle: "Better Tomorrow",
      description: "Crafted charcoal-free with pure ingredients for healthy, conscious living.",
      icon: Sparkles,
      accentColor: "#D97706",
      badgeBg: "bg-[#FFF9EE]",
      badgeText: "text-[#B45309]",
      iconBg: "bg-[#F47A20]/12",
      borderHover: "hover:border-[#F47A20]/50",
    },
  ];

  return (
    <section className="relative my-8 w-full overflow-hidden bg-[#FAF7EE] py-14 sm:my-12 sm:py-18 lg:py-22 border-y border-[#EADBBD]/70 font-sans">
      {/* Soft decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#EADBBD]/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#9E1830]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* LEFT: STORY CONTENT */}
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            {/* Eyebrow */}
            <div className="mb-3.5 flex items-center gap-2">
              <span className="h-[2px] w-8 rounded-full bg-[#F47A20]" />
              <span className="font-space text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#9E1830]">
                OUR STORY &amp; HERITAGE
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="max-w-2xl font-heading text-2xl sm:text-4xl lg:text-[44px] font-bold leading-[1.18] tracking-tight text-[#173B3A]">
              Bringing Nature,
              <br className="hidden sm:block" /> Tradition &amp; Wellbeing
              <span className="text-[#3F7D45]"> Together.</span>
            </h2>

            {/* Sub-narrative */}
            <p className="mt-4 max-w-xl font-sans text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#173B3A]/80">
              At HM Agarbattis, we believe in the power of natural fragrances
              to create a calmer, happier and more positive life. Our products
              are thoughtfully crafted with pure ingredients, inspired by
              India&apos;s rich traditions and a modern mindful lifestyle.
            </p>

            {/* THREE VALUES — PREMIUM CLEAN CARDS */}
            <div className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.number}
                    className={`group relative flex flex-col justify-between rounded-2xl bg-white border border-[#EADBBD] ${value.borderHover} p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                  >
                    {/* Top Header: Icon & Step Number */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${value.iconBg} transition-transform duration-300 group-hover:scale-110`}
                          style={{ color: value.accentColor }}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <span className="font-space text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7EE] border border-[#EADBBD] text-stone-500 tabular-nums">
                          {value.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-sm sm:text-base font-bold text-[#173B3A] group-hover:text-[#9E1830] transition-colors leading-snug">
                        {value.title}
                      </h3>

                      {/* Subtitle Pill */}
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${value.badgeBg} ${value.badgeText}`}
                        >
                          {value.subtitle}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-2 font-sans text-xs text-[#173B3A]/70 leading-relaxed">
                        {value.description}
                      </p>
                    </div>

                    {/* Bottom subtle accent line */}
                    <div className="mt-3 pt-2.5 border-t border-[#FAF6EE] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#173B3A]/40 uppercase tracking-widest">
                        HM Purity
                      </span>
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150"
                        style={{ backgroundColor: value.accentColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Action Row */}
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#9E1830] hover:bg-[#800F23] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Know Our Story</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F7D45]">
                <ShieldCheck size={16} className="text-[#3F7D45]" />
                <span>100% Charcoal-Free Heritage</span>
              </span>
            </div>
          </div>

          {/* RIGHT: ILLUSTRATION WITH ELEGANT PEDESTAL FRAME */}
          <div className="order-1 flex min-w-0 justify-center lg:order-2 lg:col-span-5">
            <div className="relative w-full max-w-[290px] sm:max-w-[360px] lg:max-w-[420px]">
              
              {/* Soft ambient golden-green glow behind the sacred flame mascot */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[12%] rounded-full bg-gradient-to-tr from-[#F6C84C]/25 to-[#DDECCB]/50 blur-2xl"
              />

              <div className="relative aspect-square w-full">
                <Image
                  src="/images/hm_story_yoga_god_virtue.png"
                  alt="HM Agarbattis sacred flame mascot meditating on a lotus flower with diya and temple bell"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                  className="object-contain drop-shadow-xl transition-transform duration-500 hover:scale-[1.03]"
                  priority
                />
              </div>

              {/* Caption pill below */}
              <div className="mt-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#EADBBD] px-3.5 py-1 font-space text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#3F7D45] shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D45] animate-pulse" />
                  Rooted in Tradition · Made with Care
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

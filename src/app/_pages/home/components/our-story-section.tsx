"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

const STORY_VALUES = [
  {
    number: "01",
    title: "Yoga & Mind",
    desc: "Calm & focus.",
    icon: Leaf,
    accent: "var(--brand-green)",
    iconBg: "bg-[#EAF5EC]",
  },
  {
    number: "02",
    title: "God & Prayer",
    desc: "Temple aroma.",
    icon: Heart,
    accent: "var(--brand-primary)",
    iconBg: "bg-[#FFF2F4]",
  },
  {
    number: "03",
    title: "Pure Virtue",
    desc: "Charcoal-free.",
    icon: Sparkles,
    accent: "var(--brand-amber-bright)",
    iconBg: "bg-brand-surface-cream",
  },
];

export function OurStorySection() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-surface-alt py-6 sm:py-12 lg:py-14 font-sans">
      <div className="page-container">
        {/* TOP / MAIN SPLIT: LEFT IMAGE + RIGHT CONTENT (Mobile & Desktop) */}
        <div className="flex flex-row items-center gap-3.5 sm:gap-8 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* LEFT: ILLUSTRATION */}
          <div className="w-28 min-[400px]:w-32 sm:w-52 lg:w-auto lg:col-span-5 shrink-0 flex justify-center">
            <div className="relative w-full max-w-[340px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[8%] rounded-full border border-brand-border bg-white"
              />
              <div className="relative aspect-square w-full">
                <Image
                  src="/images/hm_story_yoga_god_virtue.png"
                  alt="HM Agarbattis sacred flame mascot meditating on a lotus flower with diya and temple bell"
                  fill
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 208px, 340px"
                  className="object-contain transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
              <div className="hidden sm:flex mt-3 justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3 py-1 font-tagline text-[10px] font-bold uppercase tracking-[0.08em] text-brand-green shadow-2xs whitespace-nowrap">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                  Coimbatore Heritage
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: SHORT CONTENT + VALUES + CTA */}
          <div className="flex-1 min-w-0 lg:col-span-7">
            <div className="mb-1.5 sm:mb-2.5 flex items-center gap-1.5">
              <span className="h-[2px] w-5 sm:w-7 rounded-full bg-brand-orange" />
              <span className="font-brand text-[9px] sm:text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
                OUR STORY
              </span>
            </div>

            <h2 className="font-brand text-base sm:text-2xl lg:text-3xl font-bold leading-tight tracking-wide text-brand-heading uppercase">
              Nature &amp; Tradition <span className="text-brand-green">Together.</span>
            </h2>

            <p className="mt-1 sm:mt-2 font-sans text-[11px] sm:text-sm leading-snug sm:leading-relaxed text-brand-slate font-normal max-w-lg">
              Coimbatore botanical resins crafted for calm, pure daily rituals.
            </p>

            {/* 3 VALUES: Compact 3-column mini-grid on sm+ */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 mt-5">
              {STORY_VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.number}
                    className="group flex flex-col justify-between gap-2 rounded-xl border border-brand-border bg-white p-3.5 transition hover:border-brand-primary/60"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border/80 ${value.iconBg}`}
                        style={{ color: value.accent }}
                      >
                        <Icon size={15} strokeWidth={2} />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-brand-gray">
                        {value.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-brand text-xs font-bold text-brand-heading uppercase tracking-wide group-hover:text-brand-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-[11px] text-brand-slate leading-snug mt-0.5">
                        {value.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Row */}
            <div className="mt-3 sm:mt-6 flex items-center gap-3">
              <Link
                href="/about"
                className="group inline-flex min-h-8 sm:min-h-10 items-center justify-center gap-1.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-3.5 py-1.5 sm:px-5 sm:py-2 font-brand text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs transition active:scale-95 whitespace-nowrap"
              >
                <span>Our Story</span>
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                />
              </Link>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-green whitespace-nowrap">
                Charcoal-Free
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE COMPACT 3-PILLAR STRIP (Zero stacking bloat) */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
          {STORY_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.number}
                className="flex flex-col gap-1 rounded-xl border border-brand-border bg-white p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${value.iconBg}`}
                    style={{ color: value.accent }}
                  >
                    <Icon size={12} strokeWidth={2.1} />
                  </span>
                  <span className="font-mono text-[9px] font-bold text-brand-gray">
                    {value.number}
                  </span>
                </div>
                <span className="font-brand text-[10px] font-bold uppercase text-brand-heading leading-tight">
                  {value.title}
                </span>
                <span className="text-[10px] text-brand-slate leading-tight">
                  {value.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


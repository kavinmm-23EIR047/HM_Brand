"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotNamaste } from "@/components/mascot-art";
import { Lotus } from "@/components/illustrations";

const values = [
  { icon: Leaf, label: "Pure by nature", title: "Botanical ingredients", copy: "A thoughtful blend of herbs, resins and fragrant woods, made for a clean, comforting everyday ritual.", color: "#287541", surface: "#e8f1df" },
  { icon: Sparkles, label: "Rooted in tradition", title: "Made for Indian rituals", copy: "Inspired by the familiar aromas and small moments that bring calm to prayer, meditation and home.", color: "#a90c35", surface: "#f8e7e2" },
  { icon: Heart, label: "Packed with care", title: "A little goodness in every box", copy: "Prepared with care in Coimbatore and sent to make your daily rituals feel special.", color: "#e7771b", surface: "#fff0d7" },
];

export default function AboutPage() {
  return (
    <InnerPage eyebrow="OUR COIMBATORE STORY" title="Bringing Nature, Tradition & Wellbeing Together" subtitle="We believe the smallest rituals can make everyday life feel grounded, fragrant and meaningful.">
      <div className="mx-auto max-w-[1368px] space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="relative isolate grid overflow-hidden rounded-[28px] bg-[#f6eedc] p-6 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-8 lg:p-14">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a90c35]">HERITAGE & ROOTS</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-.035em] text-[#173b3a] sm:text-4xl lg:text-[46px]">A familiar fragrance, made for the way we live today.</h2>
            <p className="mt-5 text-sm leading-7 text-[#52625a] sm:text-base">From our home in Peelamedu, Coimbatore, HM Agarbattis brings the warmth of traditional South Indian fragrance into modern homes. Our incense, camphor and sambrani are made to accompany everyday prayer, quiet reflection and time together.</p>
            <p className="mt-3 text-sm leading-7 text-[#52625a] sm:text-base">Every fragrance is selected with care, drawing on botanicals, sacred woods and resins to make a simple ritual feel a little more special.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-[#28563c]">
              {["Coimbatore crafted", "Botanical ingredients", "Made for daily rituals"].map((tag) => <span key={tag} className="rounded-full bg-white/75 px-4 py-2">{tag}</span>)}
            </div>
          </div>
          <div className="relative mt-4 flex min-h-[250px] items-center justify-center lg:mt-0 lg:min-h-[340px]">
            <div className="absolute h-64 w-64 rounded-full bg-[#e5edcf] sm:h-80 sm:w-80" />
            <div className="absolute h-56 w-56 rounded-full border border-[#93ad72]/35 sm:h-72 sm:w-72" />
            <Lotus className="absolute bottom-5 right-2 h-24 w-28 opacity-70 sm:right-8 sm:h-32 sm:w-36" />
            <div className="relative z-10 flex h-[240px] w-full max-w-[230px] items-end justify-center sm:h-[310px] sm:max-w-[290px]"><MascotNamaste size={230} /></div>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#28563c] shadow-sm">Find your calm, one ritual at a time</span>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-28">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a90c35]">WHY HM AGARBATTIS</span><h2 className="mt-2 text-2xl font-extrabold tracking-[-.03em] text-[#173b3a] sm:text-3xl">Good fragrance, thoughtfully made</h2></div>
            <p className="max-w-md text-sm leading-6 text-[#65716a]">Simple choices that make your home feel welcoming and your rituals feel your own.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, label, title, copy, color, surface }, index) => <article key={title} className="rounded-2xl bg-white p-6 shadow-[0_8px_28px_rgba(49,54,33,.07)] sm:p-7">
              <div className="mb-6 flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: surface, color }}><Icon size={23} /></span><span className="text-xs font-extrabold tracking-widest text-[#b3b8ae]">0{index + 1}</span></div>
              <span className="text-[10px] font-extrabold uppercase tracking-[.16em]" style={{ color }}>{label}</span>
              <h3 className="mt-2 text-xl font-extrabold leading-tight text-[#173b3a]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#65716a]">{copy}</p>
            </article>)}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-[24px] bg-[#a90c35] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
          <div><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#ffd34e]">MAKE IT A RITUAL</span><h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Bring a little calm into your day.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/80">Explore incense, camphor and pooja essentials selected for everyday moments.</p></div>
          <Link href="/shop" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ffd34e] px-6 py-3 text-sm font-extrabold text-[#173b3a] transition hover:bg-white">Explore the shop <ArrowRight size={16} /></Link>
        </section>
      </div>
    </InnerPage>
  );
}

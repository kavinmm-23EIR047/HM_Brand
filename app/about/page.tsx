"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, FlaskConical, Award, Sparkles, Heart, Sun, Flame } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MandalaMotif } from "@/components/illustrations";

const storyPillars = [
  {
    num: "01",
    title: "Yoga & Mindful Living",
    subtitle: "Clarity & Inner Stillness",
    copy: "Fragrance creates an immediate sensory anchor for deep meditation, conscious breathing, and mindful presence. Our pure botanical aromas calm the nervous system and awaken serene mental focus.",
    badge: "INNER PEACE",
    color: "#9E1830",
    bg: "#FFF4D6",
  },
  {
    num: "02",
    title: "God & Sacred Devotion",
    subtitle: "Temple Aura at Home",
    copy: "Handcrafted according to sacred Agamic traditions, our agarbattis and Bhimseni camphor transform everyday morning and evening prayers into divine temple-like spiritual experiences.",
    badge: "DIVINE GRACE",
    color: "#F47A20",
    bg: "#FFF8E7",
  },
  {
    num: "03",
    title: "Pure Botanical Virtue",
    subtitle: "Clean & Charcoal-Free",
    copy: "We reject all synthetic chemicals, artificial musk, and black charcoal. Every single stick is lovingly rolled using pure flower petals, sacred resins, and essential oils.",
    badge: "100% PURITY",
    color: "#287541",
    bg: "#EBF3E4",
  },
];

const naturalBenefits = [
  {
    icon: Leaf,
    title: "100% Natural Botanicals",
    desc: "Crafted with pure herbal powders, sacred wood barks, and naturally fragrant flower petals sourced ethically from South Indian soil.",
    highlight: "Zero Artificial Musk",
  },
  {
    icon: ShieldCheck,
    title: "Charcoal & Toxin Free",
    desc: "Burns cleanly with light, gentle white aromatic smoke that purifies indoor air without causing throat irritation or black soot.",
    highlight: "Clean Indoor Air",
  },
  {
    icon: FlaskConical,
    title: "Ayurvedic Aromatherapy",
    desc: "Enriched with therapeutic essential oils and Bhimseni camphor crystals to dispel negative energy and elevate positive vibrational prana.",
    highlight: "Prana Elevating",
  },
  {
    icon: Award,
    title: "Handcrafted in Coimbatore",
    desc: "Carrying forward decades of artisanal craftsmanship from the sacred foothills of the Western Ghats with deep respect for tradition.",
    highlight: "Artisanal Heritage",
  },
];

export default function AboutPage() {
  return (
    <InnerPage
      eyebrow="OUR SACRED STORY & HERITAGE"
      title="Bringing Pure Nature, Devotion & Wellbeing Into Every Home"
      subtitle="From our spiritual home in Coimbatore, HM Agarbattis preserves the timeless art of pure botanical fragrance for mindful living, daily prayer, and sacred peace."
    >
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* HERO STORY SECTION WITH CRAYONISM ARTWORK */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-10 lg:p-12 border-2 border-[#F6C84C]/60 shadow-lg">
          {/* Subtle Rotating Mandala */}
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 opacity-15">
            <MandalaMotif speed={100} strokeColor="#9E1830" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Story Copy */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9E1830]/30 bg-[#9E1830]/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#9E1830] uppercase">
                <Sparkles size={12} className="text-[#F47A20]" />
                <span>ROOTED IN COIMBATORE TRADITION</span>
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173B3A] leading-tight">
                Crafted with pure devotion at the foothills of the Western Ghats.
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#292524]/85 leading-relaxed">
                HM Agarbattis was born out of a simple, heartfelt commitment: to restore the sacred purity of traditional Indian incense. In a world full of mass-produced synthetic chemicals and black charcoal, we handcraft every stick and dhoop cone using pure botanical ingredients, authentic herbs, and natural resins.
              </p>

              <p className="font-sans text-sm sm:text-base text-[#292524]/85 leading-relaxed">
                Whether you are lighting an agarbatti for your morning puja, creating a serene environment for yoga and meditation, or filling your home with welcoming fragrance, HM Agarbattis brings you an uplifting, peaceful experience that connects you with the divine within.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#9E1830] border border-[#F6C84C]/50 shadow-2xs">
                  ✦ Coimbatore Heritage
                </span>
                <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#287541] border border-[#287541]/40 shadow-2xs">
                  ✦ 100% Charcoal-Free
                </span>
                <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#F47A20] border border-[#F47A20]/40 shadow-2xs">
                  ✦ Pure Botanical Resins
                </span>
              </div>
            </div>

            {/* Right Column: Storybook Artwork */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[360px] aspect-square rounded-2xl overflow-hidden border-2 border-[#F6C84C]/60 bg-white/60 p-4 shadow-md flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/hm_story_yoga_god_virtue.png"
                    alt="HM Brand: Yoga, God, and Pure Virtue Storybook Art"
                    fill
                    unoptimized
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THREE SACRED PILLARS */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E1830]">
              THE 3 SACRED PILLARS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              Mindfulness, Devotion &amp; Pure Virtue
            </h2>
            <p className="text-sm text-[#292524]/80">
              Every creation from HM Agarbattis is designed to nourish your daily spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyPillars.map((pillar) => (
              <div
                key={pillar.num}
                className="rounded-2xl p-6 border-2 border-[#F6C84C]/50 shadow-sm transition hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
                style={{ backgroundColor: pillar.bg }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#9E1830]/30 font-heading">
                    {pillar.num}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ backgroundColor: pillar.color, color: "#fff" }}
                  >
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-[#173B3A]">
                  {pillar.title}
                </h3>
                <p className="text-xs font-bold text-[#9E1830] mt-0.5">
                  {pillar.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed mt-3">
                  {pillar.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* NATURAL BENEFITS SECTION */}
        <section id="benefits" className="scroll-mt-28 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#287541]">
              HOLISTIC WELLBEING
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              Why Choose HM Agarbattis?
            </h2>
            <p className="text-sm text-[#292524]/80">
              Experience the clean, uplifting difference of pure botanical fragrance in your daily rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {naturalBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-6 border border-[#F6C84C]/50 shadow-sm hover:border-[#9E1830] transition hover:shadow-md space-y-3"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#FFF4D6] border border-[#F6C84C]/50 flex items-center justify-center text-[#9E1830]">
                    <Icon size={24} />
                  </div>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#287541] bg-[#EBF3E4] px-2 py-0.5 rounded-full">
                    {item.highlight}
                  </span>
                  <h3 className="font-heading text-base font-extrabold text-[#173B3A]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#292524]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-8 sm:p-12 text-white border-2 border-[#F6C84C]/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-script text-2xl sm:text-3xl text-[#F6C84C]">
              Find Your God Within
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
              Elevate Your Daily Rituals With Sacred Fragrance
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Explore our complete handcrafted collection of agarbattis, camphor, and sambrani.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-[#F47A20] hover:text-white text-[#173B3A] px-7 py-3.5 font-bold text-xs sm:text-sm transition shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Explore The Shop</span>
            <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

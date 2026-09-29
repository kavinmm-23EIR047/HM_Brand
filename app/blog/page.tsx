"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Leaf, Sparkles, Clock, Flame, Heart, Sun } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MandalaMotif } from "@/components/illustrations";

const journalEntries = [
  {
    id: "bhimseni-camphor-science",
    label: "AYURVEDIC WISDOM",
    title: "The Sacred Science of Pure Bhimseni Camphor",
    excerpt: "Why edible-grade crystalline camphor has been burned in South Indian temples for thousands of years to clear airborne pathogens and elevate prana.",
    time: "4 min read",
    tag: "PURITY",
    icon: Flame,
    color: "#9E1830",
    bg: "#FFF4D6",
    highlight: "Leaves zero ash residue when pure",
  },
  {
    id: "charcoal-free-incense-guide",
    label: "WELLNESS & HEALTH",
    title: "Why 100% Charcoal-Free Incense Matters for Your Family",
    excerpt: "Commercial black agarbattis release carbon soot and harsh chemicals. Discover how pure flower petal and resin incense protects delicate lungs and indoor air quality.",
    time: "5 min read",
    tag: "CLEAN AIR",
    icon: Leaf,
    color: "#287541",
    bg: "#EBF3E4",
    highlight: "Zero throat irritation",
  },
  {
    id: "sambrani-positive-energy",
    label: "SACRED RITUALS",
    title: "Ancient Sambrani Dhoopam: Cleansing Home Energy",
    excerpt: "The traditional Friday evening ritual of spreading Benzoin resin smoke throughout the house to ward off negativity, reduce dampness, and bring auspicious peace.",
    time: "3 min read",
    tag: "AURA CLEANSING",
    icon: Sparkles,
    color: "#F47A20",
    bg: "#FFF8E7",
    highlight: "Traditional Agamic remedy",
  },
  {
    id: "morning-meditation-ritual",
    label: "MINDFUL LIVING",
    title: "Designing a Serene Morning Brahma Muhurta Sanctuary",
    excerpt: "How a single flame of a brass diya, a stick of pure sandalwood agarbatti, and 10 minutes of quiet breathing can transform the trajectory of your entire day.",
    time: "6 min read",
    tag: "DHYANA",
    icon: Sun,
    color: "#9E1830",
    bg: "#FFF0D7",
    highlight: "Mindful daily habit",
  },
];

export default function BlogPage() {
  return (
    <InnerPage
      eyebrow="THE HM JOURNAL &amp; WELLNESS"
      title="Sacred Notes for a Mindful, Fragrant Home"
      subtitle="Explore the timeless science of Indian aromatics, Ayurvedic wellness rituals, and spiritual insights for modern daily living."
    >
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* FEATURED EDITORIAL HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-10 lg:p-12 border-2 border-[#F6C84C]/60 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9E1830]/30 bg-[#9E1830]/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#9E1830] uppercase">
                <Sparkles size={12} className="text-[#F47A20]" />
                <span>FEATURED AYURVEDIC ESSAY</span>
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173B3A] leading-tight">
                Fragrance as Medicine: How Sacred Aromas Heal the Subtle Mind
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#292524]/85 leading-relaxed">
                In classical Sanskrit scriptures, aroma (*Gandha*) is regarded as the primordial essence of the Earth element (*Prithvi Tattva*). When pure herbs like tulsi, sandalwood, and frankincense are ignited, they stimulate the olfactory bulb directly connected to the brain's limbic center, immediately dissolving stress and restoring emotional equanimity.
              </p>

              <div className="flex items-center gap-4 pt-2 text-xs font-bold text-[#6B4226]">
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} className="text-[#F47A20]" /> 5 min read
                </span>
                <span>•</span>
                <span className="text-[#9E1830]">By HM Heritage Research</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[380px] aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-[#F6C84C]/60 bg-white/70 p-4 shadow-md flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/hm_ayurvedic_journal_scene.png"
                    alt="Ayurvedic Botanical Ingredients and Urli Lamp"
                    fill
                    unoptimized
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E1830]">
              EXPLORE THE JOURNAL
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              Ritual Wisdom, Guides &amp; Health Insights
            </h2>
            <p className="text-sm text-[#292524]/80">
              Discover simple, practical ways to bring the peace of traditional Indian wellness into your daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journalEntries.map((post) => {
              const Icon = post.icon;
              return (
                <article
                  key={post.id}
                  id={post.id}
                  className="rounded-3xl border-2 border-[#F6C84C]/50 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ backgroundColor: post.bg, color: post.color }}
                      >
                        {post.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#6B7280] font-medium">
                        <Clock size={13} /> {post.time}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest text-[#9E1830] uppercase">
                        {post.label}
                      </span>
                      <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#173B3A] mt-1 leading-snug">
                        {post.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans">
                      {post.excerpt}
                    </p>

                    <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#F6C84C]/30 text-xs font-bold text-[#173B3A] flex items-center gap-2">
                      <Sparkles size={14} className="text-[#F47A20] shrink-0" />
                      <span>Key Takeaway: {post.highlight}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F6C84C]/20 flex items-center justify-between">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#9E1830] hover:text-[#F47A20] transition hover:translate-x-1"
                    >
                      <span>Explore Related Fragrances</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA TO EXPERIENCE RITUALS */}
        <section className="rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-8 sm:p-12 text-white border-2 border-[#F6C84C]/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-script text-2xl sm:text-3xl text-[#F6C84C]">
              Ready to Begin Your Ritual?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
              Bring Botanical Purity Into Your Everyday Living
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Handcrafted in Coimbatore with pure herbs, sacred wood barks, and natural resins.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-[#F47A20] hover:text-white text-[#173B3A] px-7 py-3.5 font-bold text-xs sm:text-sm transition shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Shop Sacred Incense</span>
            <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

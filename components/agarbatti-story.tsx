"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, RefreshCw } from "lucide-react";
import { MascotAgarbatti, MascotMeditate, MascotNamaste, MascotDiya } from "@/components/mascot-art";
import { BrassDiya, TempleBell, LotusMotif } from "@/components/divine-motifs";

export function AgarbattiStory() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Step 1: Choose with Intention",
      desc: "Our little guide selects a stick rolled with natural halmaddi, sandalwood resin, and fresh floral oils.",
      mascot: <MascotNamaste size={220} />,
      accent: "Temple Orange",
    },
    {
      title: "Step 2: Light the Sacred Ember",
      desc: "A gentle flame touches the tip. As it is blown out, a glowing crimson ember reveals pure aromatic botanicals.",
      mascot: <MascotAgarbatti size={220} />,
      accent: "Sacred Saffron",
    },
    {
      title: "Step 3: Sacred Fragrance Rises",
      desc: "Delicate curls of smoke drift upwards, carrying prayers, clearing mental fatigue, and purifying the air.",
      mascot: <MascotDiya size={220} />,
      accent: "Antique Gold",
    },
    {
      title: "Step 4: Stillness & Inner Peace",
      desc: "Your home transforms into a peaceful temple sanctum. A quiet breath, a sacred pause, and deep devotion.",
      mascot: <MascotMeditate size={220} />,
      accent: "Tulsi Green",
    },
  ];

  return (
    <section className="bg-turmeric py-20 px-4 sm:px-6 lg:px-8 border-y-2 border-antiqueGold/40 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.25em] text-saffron uppercase block">
            A SACRED MOMENT WITH HM AGARBATTIS
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-earthBrown mt-3">
            Let Your Space Tell a Different Story
          </h2>
          <p className="text-sm text-earthBrown/80 mt-3 max-w-xl mx-auto leading-relaxed">
            Follow our little guide through the timeless ritual of lighting an incense stick and turning ordinary rooms into sacred sanctuaries.
          </p>
        </div>

        {/* Interactive Story Container */}
        <div className="bg-sacredCream/40 rounded-2xl border-2 border-earthBrown p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-solid-md">
          {/* Left: Animated Mascot & Ritual Environment */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[340px] bg-sacredCream rounded-xl border-2 border-antiqueGold p-8 overflow-hidden">
            {/* Background Motifs */}
            <div className="absolute top-4 left-4 opacity-70">
              <TempleBell size={36} />
            </div>
            <div className="absolute top-4 right-4 opacity-70">
              <LotusMotif size={36} />
            </div>
            <div className="absolute bottom-4 left-6 opacity-80">
              <BrassDiya size={48} />
            </div>

            {/* Current Step Mascot Display */}
            <div className="relative z-10 transition-all duration-500 transform scale-105">
              {steps[step].mascot}
            </div>

            {/* Step Counter Pill */}
            <div className="absolute bottom-4 right-4 bg-earthBrown text-sacredCream text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Step {step + 1} of 4
            </div>
          </div>

          {/* Right: Step Description & Step Navigation */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step Selector Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.title}
                  onClick={() => setStep(idx)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    step === idx
                      ? "bg-saffron border-earthBrown text-sacredCream shadow-sm"
                      : "bg-sacredCream border-antiqueGold text-earthBrown hover:bg-templeOrange hover:text-sacredCream"
                  }`}
                >
                  <span>0{idx + 1}</span>
                  <span className="text-[10px] hidden sm:inline truncate max-w-full">
                    {idx === 0 ? "Select" : idx === 1 ? "Ignite" : idx === 2 ? "Purify" : "Tranquility"}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className="bg-sacredCream p-6 rounded-xl border border-antiqueGold/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-saffron uppercase tracking-wider">
                <Sparkles size={15} />
                <span>HM Agarbattis Ritual Guide</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-earthBrown">
                {steps[step].title}
              </h3>
              <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
                {steps[step].desc}
              </p>
            </div>

            {/* Controls & CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setStep((prev) => (prev + 1) % steps.length)}
                className="btn-saffron px-5 py-3 rounded-md text-xs font-bold tracking-wider uppercase flex items-center gap-2"
              >
                <span>{step === steps.length - 1 ? "Replay Ritual" : "Next Ritual Step"}</span>
                {step === steps.length - 1 ? <RefreshCw size={14} /> : <ArrowRight size={14} />}
              </button>

              <Link
                href="/category/agarbatti"
                className="btn-outline-earth px-5 py-3 rounded-md text-xs font-bold tracking-wider uppercase"
              >
                Explore Agarbattis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

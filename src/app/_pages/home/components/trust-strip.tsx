"use client";

import React from "react";
import { Leaf, ShieldCheck, Sparkles, Landmark } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    icon: Leaf,
    title: "100% Natural",
    desc: "Pure herbs & forest resins.",
    accent: "var(--brand-green)",
    iconBg: "bg-[#EAF5EC]",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Zero Charcoal",
    desc: "Clean burn, zero black soot.",
    accent: "var(--brand-primary)",
    iconBg: "bg-[#FFF2F4]",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Chemical-Free",
    desc: "Gentle for daily family pooja.",
    accent: "var(--brand-amber-bright)",
    iconBg: "bg-brand-surface-cream",
  },
  {
    num: "04",
    icon: Landmark,
    title: "Made in India",
    desc: "Coimbatore Vedic craft.",
    accent: "var(--brand-ink)",
    iconBg: "bg-[#E6F0EE]",
  },
];

export function TrustStrip() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-surface-alt py-7 sm:py-12 font-sans">
      <div className="page-container">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 sm:mb-7">
          <div>
            <span className="font-brand text-[10px] sm:text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-1">
              THE HM PURITY PROMISE
            </span>
            <h2 className="font-brand text-lg sm:text-2xl lg:text-3xl font-bold text-brand-heading uppercase tracking-wide leading-tight">
              Pure Devotion. <span className="text-brand-primary">Zero Compromise.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate font-normal sm:text-right max-w-sm">
            Natural herbs, pure resins &amp; charcoal-free recipes.
          </p>
        </div>

        {/* Architectural Ledger Grid: 2x2 Mobile, 4-Col Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs divide-x divide-y lg:divide-y-0 divide-brand-border">
          {PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group flex flex-col justify-between gap-3 p-3.5 sm:p-5 bg-white hover:bg-brand-surface-soft/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-brand-border/80 ${item.iconBg}`}
                    style={{ color: item.accent }}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-brand-gray">
                    {item.num}
                  </span>
                </div>

                <div>
                  <h3 className="font-brand text-xs sm:text-base font-bold uppercase tracking-wide text-brand-heading leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs font-medium leading-snug text-brand-slate">
                    {item.desc}
                  </p>
                </div>

                <span
                  className="h-[2px] w-7 rounded-full transition-all duration-300 group-hover:w-12"
                  style={{ backgroundColor: item.accent }}
                />
              </div>
            );
          })}
        </div>

        {/* Compact Soho Heritage Quote Bar */}
        <div className="mt-4 sm:mt-6 relative overflow-hidden rounded-xl sm:rounded-2xl bg-brand-primary text-white px-4 py-3 sm:px-7 sm:py-4 border border-brand-accent/35 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-center sm:text-left">
            <div className="space-y-0.5 min-w-0">
              <p className="font-brand text-xs sm:text-base text-brand-accent-soft font-bold tracking-wider uppercase leading-snug">
                &ldquo;Beyond Form, Fragrance Speaks.&rdquo;
              </p>
              <p className="font-sans text-[10px] sm:text-xs text-white/95 font-medium leading-snug">
                &ldquo;உருவத்தைத் தாண்டி, வாசனை பேசுகிறது.&rdquo;
              </p>
            </div>
            <span className="inline-flex self-center sm:self-auto shrink-0 items-center rounded-full border border-brand-accent-soft bg-brand-accent text-brand-darkest px-2.5 py-0.5 sm:px-3.5 sm:py-1 font-brand text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.12em] whitespace-nowrap select-none">
              Coimbatore Heritage
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

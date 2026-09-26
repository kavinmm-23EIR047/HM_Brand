"use client";

import React from "react";
import { Leaf as LeafSVG } from "./illustrations";
import { RitualArt } from "./illustrations/RitualArt";

export function TrustStrip() {
  const trustFeatures = [
    {
      art: "natural" as const,
      title: "100%",
      subtitle: "Natural Ingredients",
      badgeColor: "bg-white border-[#3F7D45]/30",
    },
    {
      art: "clean" as const,
      title: "No",
      subtitle: "Charcoal",
      badgeColor: "bg-white border-[#3F7D45]/30",
    },
    {
      art: "chemical-free" as const,
      title: "No",
      subtitle: "Toxic Chemicals",
      badgeColor: "bg-white border-[#9E1830]/30",
    },
    {
      art: "india" as const,
      title: "Made",
      subtitle: "in India",
      badgeColor: "bg-white border-[#F47A20]/30",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-[#3F7D45]/20 bg-[#DDECCB] py-5 sm:py-8">
      <LeafSVG className="absolute right-0 top-0 w-40 h-40 text-[#3F7D45]/10 rotate-45" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid items-center gap-3 lg:grid-cols-12 lg:gap-6">
          
          {/* Left: 4 Trust Icon Badges */}
          <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4 min-[480px]:gap-3 lg:col-span-7 lg:gap-4">
            {trustFeatures.map((item, idx) => (
              <div
                key={idx}
                className="flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-[#3F7D45]/20 bg-white p-2 text-center shadow-sm transition duration-300 hover:-translate-y-1 min-[360px]:min-h-[100px] min-[360px]:rounded-2xl min-[360px]:p-3 sm:p-4"
              >
                <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border shadow-xs min-[360px]:mb-2 min-[360px]:h-10 min-[360px]:w-10 sm:h-12 sm:w-12 ${item.badgeColor}`}>
                  <RitualArt kind={item.art} className="h-7 w-7 min-[360px]:h-8 min-[360px]:w-8 sm:h-10 sm:w-10" />
                </div>
                <span className="block font-heading text-[11px] font-extrabold leading-tight text-[#173B3A] min-[360px]:text-xs sm:text-sm">
                  {item.title}
                </span>
                <span className="mt-0.5 block font-sans text-[9px] font-semibold leading-tight text-[#3F7D45] min-[360px]:text-[10px] sm:text-xs">
                  {item.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Script Quote Box */}
          <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-[#F6C84C] bg-[#FFF4D6] p-3 shadow-sm min-[360px]:gap-4 min-[360px]:p-4 sm:p-6 lg:col-span-5">
            <div className="space-y-1">
                <span className="block font-script text-lg font-normal leading-snug text-[#9E1830] min-[360px]:text-xl sm:text-3xl">
                "Fragrance that brings calm, clarity and positivity."
              </span>
              <span className="mt-1 inline-block rounded-full bg-[#3F7D45] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-white min-[360px]:px-3 min-[360px]:text-[9px] sm:text-[11px] sm:tracking-wider">
                PURE ENERGY RITUALS ✨
              </span>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3F7D45] p-1.5 text-center font-heading text-[8px] font-bold text-white shadow-md min-[360px]:h-14 min-[360px]:w-14 min-[360px]:text-[9px] sm:h-20 sm:w-20 sm:p-2 sm:text-xs">
              100% PURE
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

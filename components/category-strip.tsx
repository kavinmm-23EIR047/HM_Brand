"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RitualArt } from "./illustrations/RitualArt";

export function CategoryStrip() {
  const categories = [
    {
      name: "Agarbatti & Flora",
      subtitle: "Divine Handcrafted",
      href: "/category/Agarbatti",
      circleBg: "bg-[#9E1830]",
      arrowBg: "bg-[#F47A20]",
      textColor: "text-[#9E1830]",
      art: "incense" as const,
    },
    {
      name: "Bhimseni Camphor",
      subtitle: "99.9% Pure Pine",
      href: "/category/Camphor",
      circleBg: "bg-[#4C7FA8]",
      arrowBg: "bg-[#F47A20]",
      textColor: "text-[#4C7FA8]",
      art: "camphor" as const,
    },
    {
      name: "Sambrani",
      subtitle: "Pure Resin Cups",
      href: "/category/Sambrani",
      circleBg: "bg-[#F47A20]",
      arrowBg: "bg-[#9E1830]",
      textColor: "text-[#F47A20]",
      art: "sambrani" as const,
    },
    {
      name: "Loban & Dhoop",
      subtitle: "Sacred Air Cleanser",
      href: "/category/Loban",
      circleBg: "bg-[#3F7D45]",
      arrowBg: "bg-[#F47A20]",
      textColor: "text-[#3F7D45]",
      art: "loban" as const,
    },
    {
      name: "Sandalwood",
      subtitle: "Calming Aroma",
      href: "/category/Dhoop",
      circleBg: "bg-[#F6C84C]",
      arrowBg: "bg-[#9E1830]",
      textColor: "text-[#173B3A]",
      art: "sandalwood" as const,
    },
    {
      name: "Pooja Essentials",
      subtitle: "Daily Temple Needs",
      href: "/category/Special Collections",
      circleBg: "bg-[#7653A6]",
      arrowBg: "bg-[#F47A20]",
      textColor: "text-[#7653A6]",
      art: "diya" as const,
    },
    {
      name: "Gift Sets",
      subtitle: "Festive Bundles",
      href: "/collections#sacred-gifts",
      circleBg: "bg-[#DDECCB]",
      arrowBg: "bg-[#3F7D45]",
      textColor: "text-[#3F7D45]",
      art: "gift" as const,
    },
  ];

  return (
    <section className="overflow-hidden bg-[#fffaf0] py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-3"><span className="font-space text-[10px] font-bold tracking-[.18em] text-[#9E1830] uppercase">SHOP BY CATEGORY</span></div>

        {/* 7 Circle Badges Container */}
        <div className="hide-scrollbar -mx-3 flex snap-x snap-mandatory items-start gap-2 overflow-x-auto px-3 pb-3 sm:mx-0 sm:justify-between sm:gap-6 sm:overflow-visible sm:px-0">
          {categories.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex w-[92px] shrink-0 snap-start flex-col items-center px-1 py-1 text-center transition duration-300 sm:w-auto"
            >
              {/* Solid Color Circle with Icon & Arrow Badge */}
              <div className="relative mb-2 h-[64px] w-[64px] min-[360px]:h-[72px] min-[360px]:w-[72px] sm:h-[94px] sm:w-[94px]">
                <div className={`h-full w-full overflow-hidden rounded-full ${item.circleBg} shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-105`}>
                  <RitualArt kind={item.art} className="h-full w-full scale-[1.12] p-1" />
                </div>

                {/* Round Arrow Badge */}
                <div className={`absolute bottom-0 right-0 w-7 h-7 rounded-full ${item.arrowBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white`}>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className={`font-heading text-[10px] font-bold leading-tight ${item.textColor} group-hover:underline min-[360px]:text-[11px] sm:text-sm`}>
                {item.name}
              </div>
              <span className="sr-only">{item.subtitle}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

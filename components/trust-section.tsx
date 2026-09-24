"use client";

import React from "react";
import { ShieldCheck, Leaf, Sparkles, Truck, HeartHandshake } from "lucide-react";

export function TrustSection() {
  const values = [
    {
      icon: Leaf,
      title: "100% Pure & Charcoal-Free",
      desc: "Made with natural wood resins, flower oils, and herbs without toxic black soot or synthetic charcoal.",
      textClass: "text-tulsi",
    },
    {
      icon: Sparkles,
      title: "Authentic Temple Fragrance",
      desc: "Formulations crafted in Coimbatore that recreate the sacred serenity of ancient temple sanctums.",
      textClass: "text-saffron",
    },
    {
      icon: ShieldCheck,
      title: "Carefully & Joyfully Packed",
      desc: "Each item is inspected, blessed with care, and packed securely for damage-free transit.",
      textClass: "text-antiqueGold",
    },
    {
      icon: Truck,
      title: "Fast Pan-India Delivery",
      desc: "Swift dispatch directly from our Coimbatore hub to your mandir with live parcel tracking.",
      textClass: "text-peacock",
    },
  ];

  return (
    <section className="bg-templeOrange/10 py-16 px-4 sm:px-6 lg:px-8 border-t-2 border-marigold/40">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-earthBrown uppercase block">
            THE HM AGARBATTIS PROMISE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-earthBrown mt-2">
            Made With Care. Chosen With Purpose.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-sacredCream p-6 rounded-xl border-2 border-marigold/35 hover:border-earthBrown transition duration-300 flex flex-col justify-between hover:shadow-solid-sm"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-earthBrown/20 bg-marigold/30 ${v.textClass}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-xl text-earthBrown font-semibold">{v.title}</h3>
                  <p className="text-xs text-charcoal/75 mt-2 leading-relaxed font-sans">{v.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-marigold/20 text-[10px] font-bold text-templeOrange tracking-wider uppercase">
                  ✦ PURE DEVOTION
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

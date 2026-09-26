"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Leaf } from "./illustrations";

export function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      location: "Coimbatore",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      quote: "The fragrance is so soothing. It instantly creates a positive vibe at home during morning puja. Highly recommended!",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      location: "Chennai",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      quote: "Pure and long-lasting agarbattis. I love the natural ingredients and chemical-free formula. The Paal Sambrani is authentic temple quality.",
      rating: 5,
    },
    {
      name: "Anita Nair",
      location: "Bengaluru",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      quote: "Best Bhimseni camphor I have used. It burns cleanly with zero ash and leaves a divine, refreshing aroma in the entire house.",
      rating: 5,
    },
  ];

  return (
    <section className="py-14 bg-[#FFF4D6] border-b border-[#F47A20]/15 relative overflow-hidden">
      <Leaf className="absolute left-0 bottom-0 w-44 h-44 text-[#3F7D45]/10 rotate-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-1">
              REAL PEOPLE. REAL EXPERIENCES.
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#173B3A]">
              What Our Customers Say
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F47A20] bg-white px-4 py-2 rounded-full border border-[#F47A20]/20 shadow-xs">
            <Star size={16} fill="currentColor" />
            <span>4.9 / 5 Overall Rating from 1,200+ Homes</span>
          </div>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#F47A20]/20 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex text-[#F47A20] gap-1 mb-4">
                  {Array(rev.rating).fill(null).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#173B3A]/85 leading-relaxed font-medium italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#FFF4D6]">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#F47A20]/30"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[#173B3A] flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 size={13} className="text-[#3F7D45]" />
                  </h4>
                  <span className="font-sans text-[11px] text-[#3F7D45] font-semibold block">
                    {rev.role} • {rev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

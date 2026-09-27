"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { useStore } from "@/components/store";
import { Leaf } from "./illustrations";

export function PromoBanners() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showNotification } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showNotification("Subscribed successfully! Check your inbox for 10% OFF code.");
      setEmail("");
    }
  };

  return (
    <section className="py-10 bg-[#FFF4D6] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Special Offers Just for You */}
          <div className="group relative flex flex-row items-center justify-between gap-3 overflow-hidden rounded-3xl border border-[#F6C84C] bg-[#FFF8E7] p-5 shadow-sm sm:p-7">
            <div className="space-y-2.5 relative z-10 max-w-[55%] sm:max-w-[58%]">
              <span className="font-space text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9E1830] block">
                SPECIAL OFFERS
              </span>
              <h3 className="font-heading text-xl sm:text-3xl font-extrabold text-[#173B3A] leading-tight">
                Just for You
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#173B3A]/80 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Great deals on your favorite fragrances and pooja essentials.
              </p>
              <div className="pt-1.5">
                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#9E1830] px-4 py-2 text-[11px] font-bold tracking-wide text-white shadow-sm transition hover:bg-[#F47A20] sm:px-6 sm:py-2.5 sm:text-xs active:scale-95"
                >
                  <span>View Offers</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Animated GIF Graphic (Enlarged & Clean) */}
            <div className="relative h-28 w-28 min-[380px]:h-36 min-[380px]:w-36 sm:h-44 sm:w-44 md:h-40 md:w-40 lg:h-48 lg:w-48 shrink-0 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
              <Image
                src="/images/special_offer_gift.gif"
                alt="HM Special Offers festive gift box with incense and dhoop"
                fill
                unoptimized
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 220px"
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Right: Subscribe & Save Extra 10% */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#3F7D45]/30 bg-[#DDECCB] p-4 shadow-sm sm:p-8">
            <Leaf className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 text-[#3F7D45]/15" />

            <div className="space-y-3 relative z-10">
              <span className="font-space text-xs font-bold uppercase tracking-widest text-[#3F7D45] block">
                GET EXCLUSIVE DISCOUNTS
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A] leading-tight">
                Subscribe & Save Extra 10%
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#173B3A]/80 leading-relaxed">
                Get exclusive offers, new launches and wellness tips directly to your inbox.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="mt-4 relative z-10">
              {subscribed ? (
                <div className="bg-white text-[#3F7D45] px-4 py-3 rounded-full text-xs font-bold flex items-center gap-2 border border-[#3F7D45]">
                  <CheckCircle2 size={16} className="text-[#3F7D45]" />
                  <span>Thank you! 10% OFF discount code sent.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex min-w-0 items-center gap-1 rounded-full border border-[#3F7D45]/40 bg-white p-1 shadow-sm sm:gap-2 sm:p-1.5">
                  <Mail size={16} className="ml-1 shrink-0 text-[#3F7D45] sm:ml-3 sm:h-[18px] sm:w-[18px]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full min-w-0 bg-transparent px-1 text-[10px] font-medium text-[#173B3A] focus:outline-none sm:px-2 sm:text-xs"
                  />
                  <button
                    type="submit"
                    className="shrink-0 whitespace-nowrap rounded-full bg-[#3F7D45] px-2.5 py-2.5 text-[10px] font-bold tracking-wide text-white transition hover:bg-[#173B3A] min-[400px]:px-4 sm:px-5 sm:text-xs"
                  >
                    Subscribe →
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, Heart, ArrowRight,
  Leaf, FlaskConical, ShieldCheck, Award, MessageCircle, Truck
} from "lucide-react";
import { Lotus, MandalaMotif } from "./illustrations";

export function Footer() {
  return (
    <footer className="bg-[#9E1830] text-white relative overflow-hidden font-sans border-t-4 border-[#F6C84C]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 overflow-hidden" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1440 240" preserveAspectRatio="none" fill="none">
          <path className="footer-ridge footer-ridge-back" d="M0 112C115 75 157 123 259 99c104-25 139-85 244-64 89 18 111 88 208 81 87-6 116-71 210-63 99 8 124 65 221 48 108-19 162-64 298-23v162H0V112Z" fill="#771027" fillOpacity=".68" />
          <path className="footer-ridge footer-ridge-mid" d="M0 145c122-43 202-9 298-32 95-23 132-57 220-41 96 17 139 74 234 54 98-21 125-63 216-41 89 21 142 74 239 47 83-23 150-50 233-22v130H0V145Z" fill="#84102C" fillOpacity=".72" />
          <path className="footer-ridge footer-ridge-front" d="M0 183c114-20 179-54 278-34 95 20 154 41 245 15 95-26 142-37 222-13 99 30 148 51 246 22 103-30 155-53 249-27 77 21 133 49 200 37v57H0v-57Z" fill="#921432" fillOpacity=".78" />
        </svg>
      </div>
      <MandalaMotif className="mandala-footer absolute -bottom-36 -right-24 z-[1] h-[440px] w-[440px] opacity-[.22]" speed={64} strokeColor="#FFD974" strokeWidth={2} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/20 pb-12">
          
          {/* COLUMN 1: Brand & Tagline */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#F6C84C] bg-[#FFF4D6] sm:h-14 sm:w-14">
                <Lotus className="h-9 w-9 sm:h-10 sm:w-10" />
              </div>
              <div>
                <span className="block whitespace-nowrap font-heading text-base font-extrabold leading-none tracking-wide text-white sm:text-2xl">
                  HM AGARBATTIS
                </span>
                <span className="mt-1 block font-script text-sm font-normal text-[#F6C84C] sm:text-base">
                  Find Your God Within
                </span>
              </div>
            </div>

            <p className="font-sans text-sm text-white/90 leading-relaxed font-normal">
              Handcrafted with pure botanical ingredients, sacred herbs, and natural resins. HM Agarbattis brings you an authentic Indian fragrance experience for daily prayers, meditation, and mindful living.
            </p>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-semibold">
                <Leaf size={16} className="text-[#F6C84C]" />
                <span>100% Natural</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck size={16} className="text-[#F6C84C]" />
                <span>No Charcoal</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-semibold">
                <FlaskConical size={16} className="text-[#F6C84C]" />
                <span>No Chemicals</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-semibold">
                <Award size={16} className="text-[#F6C84C]" />
                <span>Made in India</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-lg text-[#F6C84C] uppercase tracking-wider text-xs">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/90">
              <li><Link href="/category/Agarbatti" className="hover:text-[#F6C84C] transition">Agarbatti & Flora</Link></li>
              <li><Link href="/category/Camphor" className="hover:text-[#F6C84C] transition">Bhimseni Camphor</Link></li>
              <li><Link href="/category/Sambrani" className="hover:text-[#F6C84C] transition">Cup Sambrani</Link></li>
              <li><Link href="/category/Loban" className="hover:text-[#F6C84C] transition">Loban & Dhoop</Link></li>
              <li><Link href="/category/Dhoop" className="hover:text-[#F6C84C] transition">Sandalwood Cones</Link></li>
              <li><Link href="/collections" className="hover:text-[#F6C84C] transition">Pooja Essentials</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition">Gift Sets & Bundles</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: Company Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-lg text-[#F6C84C] uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/90">
              <li><Link href="/about" className="hover:text-[#F6C84C] transition">About Us & Story</Link></li>
              <li><Link href="/about#benefits" className="hover:text-[#F6C84C] transition">Natural Benefits</Link></li>
              <li><Link href="/blog" className="hover:text-[#F6C84C] transition">Blog & Wellness</Link></li>
              <li><Link href="/offers" className="hover:text-[#F6C84C] transition">Special Offers</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Customer Support */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-lg text-[#F6C84C] uppercase tracking-wider text-xs">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/90">
              <li><Link href="/orders" className="hover:text-[#F6C84C] transition">Track Your Order</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition">Shipping Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-[#F6C84C] transition">FAQs & Support</Link></li>
            </ul>
          </div>

          {/* COLUMN 5: Newsletter & Social */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-lg text-[#F6C84C] uppercase tracking-wider text-xs">
              Join Our Community
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Get updates on new launches, offers and wellness tips.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs text-[#173B3A] bg-[#FFF4D6] px-3.5 py-2.5 rounded-xl focus:outline-none font-medium placeholder:text-[#173B3A]/60"
              />
              <button className="w-full bg-[#F47A20] hover:bg-[#F6C84C] hover:text-[#173B3A] text-white py-2.5 rounded-xl font-bold text-xs transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} HM AGARBATTIS COIMBATORE. All Rights Reserved.</p>
          <div className="flex items-center gap-1 font-script text-base text-[#F6C84C]">
            <span>Find Your God Within</span>
            <Heart size={14} className="text-[#F47A20] fill-[#F47A20] ml-1" />
          </div>
          <p>Handcrafted in India 🇮🇳</p>
        </div>

      </div>
    </footer>
  );
}

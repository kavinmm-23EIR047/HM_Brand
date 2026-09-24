"use client";

import React from "react";
import Link from "next/link";

import { 
  Phone, Mail, MapPin, Sparkles, Heart, ChevronRight, ArrowRight,
  Leaf, FlaskConical, Flower2, Wind, Box, Droplets, Grid, 
  Diamond, Calendar, Users, BookOpen, Clock,
  Headset, MessageCircle, Truck, RotateCcw, Package, Building, HelpCircle
} from "lucide-react";
import { LotusMotif, MandalaMotif } from "@/components/divine-motifs";

export function Footer() {
  return (
    <footer className="bg-deepRed text-sacredCream relative overflow-hidden font-sans border-t-[6px] border-marigold">
      {/* Elegant Top Border Glow instead of the messy ToranBorder */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-marigold/60 to-transparent z-10 shadow-[0_0_15px_rgba(249,199,79,0.5)]"></div>
      
      {/* High-Resolution Background Mandalas with internal counter-rotation */}
      <div className="absolute -top-[450px] -right-[450px] pointer-events-none z-0 opacity-15 text-marigold">
        <MandalaMotif size={1200} speed={120} />
      </div>
      <div className="absolute -bottom-[350px] -left-[350px] pointer-events-none z-0 opacity-10 text-marigold">
        <MandalaMotif size={900} speed={180} counterRotate={false} />
      </div>

      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pt-28 pb-12 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-8 border-b border-white/20 pb-16">
          
          {/* COLUMN 1: Brand (lg: 4, xl: 3) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-marigold flex items-center justify-center text-marigold text-4xl shadow-[0_0_20px_rgba(249,199,79,0.4)] relative bg-deepRed group">
                <div className="absolute inset-1 rounded-full border border-marigold/40"></div>
                <div className="animate-[spin_30s_linear_infinite]">
                  <LotusMotif size={44} />
                </div>
              </div>
              <div>
                <span className="font-cinzel text-3xl lg:text-4xl font-bold tracking-wider text-white block leading-none drop-shadow-md">
                  HM AGARBATTIS
                </span>
                <span className="text-[13px] uppercase tracking-[0.35em] text-marigold font-bold block mt-3 drop-shadow-sm">
                  Find Your God Within
                </span>
              </div>
            </div>

            <p className="text-[17px] text-white leading-relaxed font-medium">
              Handcrafted with pure botanical ingredients, sacred herbs, and natural extracts. HM Agarbattis brings you a divine fragrance experience for your peaceful moments.
            </p>

            {/* Badges - Larger & More Visible */}
            <div className="grid grid-cols-4 gap-3 pt-6">
              {[
                { icon: <Leaf size={26}/>, text: "100% Natural" },
                { icon: <Heart size={26}/>, text: "Charcoal Free" },
                { icon: <Leaf size={26}/>, text: "Eco Friendly" },
                { icon: <FlaskConical size={26}/>, text: "No Chemicals" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-marigold hover:scale-110 hover:bg-marigold hover:text-deepRed transition-all shadow-lg cursor-pointer">
                    {badge.icon}
                  </div>
                  <span className="text-[12px] font-bold leading-tight text-white">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNS 2, 3, 4: Links (lg: 8, xl: 6) */}
          <div className="lg:col-span-8 xl:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8 xl:gap-6 pl-0 xl:pl-8">
            
            {/* Sacred Categories */}
            <div>
              <h3 className="font-cinzel text-2xl text-white mb-8 font-bold flex items-center gap-3 drop-shadow-md">
                <LotusMotif size={28} className="text-marigold animate-pulse"/>
                Categories
              </h3>
              <ul className="space-y-6 text-[17px] font-semibold text-white">
                {[
                  { name: "Agarbatti & Flora", icon: <Flower2 size={20}/> },
                  { name: "Dhoop & Cones", icon: <Wind size={20}/> },
                  { name: "Bhimseni Camphor", icon: <Box size={20}/> },
                  { name: "Cup Sambrani", icon: <Droplets size={20}/> },
                  { name: "Resins & Samagri", icon: <Leaf size={20}/> },
                  { name: "Chandan Dhoop Cones", icon: <Sparkles size={20}/> },
                  { name: "Pooja Essentials", icon: <LotusMotif size={20}/> },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="group flex items-center gap-4 hover:text-marigold transition-all duration-300 transform hover:translate-x-2">
                      <span className="text-marigold/70 group-hover:text-marigold transition-colors">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-cinzel text-2xl text-white mb-8 font-bold flex items-center gap-3 drop-shadow-md">
                <Diamond size={28} className="text-marigold"/>
                Experience
              </h3>
              <ul className="space-y-6 text-[17px] font-semibold text-white">
                {[
                  { name: "All Products", icon: <Grid size={20}/> },
                  { name: "Divine Collections", icon: <Diamond size={20}/> },
                  { name: "Festival Calendar", icon: <Calendar size={20}/> },
                  { name: "Our Craftsmanship", icon: <Heart size={20}/> },
                  { name: "Sustainability", icon: <Leaf size={20}/> },
                  { name: "Customer Stories", icon: <Users size={20}/> },
                  { name: "Blog & Spiritual Living", icon: <BookOpen size={20}/> },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="group flex items-center gap-4 hover:text-marigold transition-all duration-300 transform hover:translate-x-2">
                      <span className="text-marigold/70 group-hover:text-marigold transition-colors">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="font-cinzel text-2xl text-white mb-8 font-bold flex items-center gap-3 drop-shadow-md">
                <Headset size={28} className="text-marigold"/>
                Support
              </h3>
              <ul className="space-y-6 text-[17px] font-semibold text-white">
                {[
                  { name: "Contact Us", icon: <Mail size={20}/> },
                  { name: "Track Your Order", icon: <Truck size={20}/> },
                  { name: "Returns & Refunds", icon: <RotateCcw size={20}/> },
                  { name: "Shipping Information", icon: <Package size={20}/> },
                  { name: "Bulk & Corporate", icon: <Building size={20}/> },
                  { name: "FAQs", icon: <HelpCircle size={20}/> },
                  { name: "Store Locator", icon: <MapPin size={20}/> },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href="#" className="group flex items-center gap-4 hover:text-marigold transition-all duration-300 transform hover:translate-x-2">
                      <span className="text-marigold/70 group-hover:text-marigold transition-colors">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 5: Newsletter & Contact (lg: 12, xl: 3) */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-8">
            
            {/* Stay Connected Box */}
            <div className="bg-black/20 border border-white/20 rounded-2xl p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
              {/* Rotating card background accent */}
              <div className="absolute -top-4 -right-4 text-marigold opacity-15 animate-[spin_40s_linear_infinite] pointer-events-none">
                <LotusMotif size={140} />
              </div>

              <h4 className="text-white font-cinzel text-2xl font-bold mb-3 flex items-center gap-3 relative z-10 drop-shadow-md">
                Stay Connected
              </h4>
              <p className="text-sm text-sacredCream/90 mb-8 leading-relaxed relative z-10 font-medium">
                Get updates on new products, festivals & special offers.
              </p>
              
              <div className="flex items-center bg-black/60 border border-white/20 rounded-full p-1.5 pl-5 mb-8 focus-within:border-marigold transition-colors relative z-10 shadow-inner">
                <Mail size={20} className="text-white/60 shrink-0" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-transparent border-none text-sm text-white px-4 py-3 w-full outline-none placeholder:text-white/50" 
                />
                <button className="bg-marigold text-deepRed p-3.5 rounded-full hover:bg-white hover:scale-105 transition-all shrink-0 font-bold shadow-md">
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Socials */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                {[
                  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
                  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
                  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
                  <MessageCircle key="4" size={20} />
                ].map((icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-marigold hover:border-marigold hover:text-deepRed hover:scale-110 transition-all text-white shrink-0 shadow-md">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Customer Care */}
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-black/20 border border-white/20 shadow-xl">
              <Phone size={32} className="text-marigold mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-sacredCream/80 mb-1.5">Need help with an order?</p>
                <p className="text-2xl font-bold text-white tracking-wide mb-1">+91 98765 43210</p>
                <p className="text-xs font-medium text-sacredCream/60">Mon - Sat, 9:00 AM - 7:30 PM</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-semibold text-sacredCream/70 text-center md:text-left">
            <p className="mb-2">© {new Date().getFullYear()} HM AGARBATTIS. All Rights Reserved.</p>
            <p>Designed with <Heart size={14} className="inline text-marigold fill-marigold mx-1 animate-pulse"/> for peaceful living.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold text-sacredCream/80">
            <Link href="#" className="hover:text-marigold hover:underline transition-all">Privacy Policy</Link>
            <Link href="#" className="hover:text-marigold hover:underline transition-all">Terms & Conditions</Link>
            <Link href="#" className="hover:text-marigold hover:underline transition-all">Refund Policy</Link>
            <Link href="#" className="hover:text-marigold hover:underline transition-all">Shipping</Link>
          </div>

          <div className="flex items-center gap-8 text-xs font-bold text-sacredCream/90 tracking-widest uppercase">
            <div className="flex items-center gap-3">
               <svg width="28" height="18" viewBox="0 0 32 20" fill="currentColor" className="text-white">
                 <path d="M16 2 L20 18 L16 14 L12 18 Z" />
               </svg>
               <span>Make in India</span>
            </div>
            <div className="flex items-center gap-3">
               <Leaf size={18} className="text-leaf" fill="currentColor"/>
               <span>Go Green</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, Flower2, Heart, Flame, Truck } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { AgarbattiStory } from "@/components/agarbatti-story";
import { TrustSection } from "@/components/trust-section";
import { Carousel } from "@/components/carousel";
import { TempleGopuram, LotusMotif, MarigoldGarland, TemplePillar } from "@/components/divine-motifs";
import {
  MascotNamaste,
  MascotDiya,
  MascotMeditate,
  MascotAgarbatti,
  MascotBasket,
  MascotDelivery,
} from "@/components/mascot-art";
import { products, festivalsList } from "@/lib/products";

// Helper for the countdown timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hr", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sc", value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="bg-white text-earthBrown flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-16 rounded-lg shadow-sm">
          <span className="font-display font-bold text-lg sm:text-2xl leading-none">{item.value.toString().padStart(2, '0')}</span>
          <span className="text-[10px] sm:text-xs font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(heroTimer);
  }, []);

  const heroCards = [
    {
      id: 1,
      title: "Pure Devotion",
      mascot: <MascotNamaste size={300} />,
      color: "bg-[#D35435]",
    },
    {
      id: 2,
      title: "Sacred Aura",
      mascot: <MascotAgarbatti size={300} />,
      color: "bg-[#7F9E6C]",
    },
    {
      id: 3,
      title: "Divine Light",
      mascot: <MascotDiya size={300} />,
      color: "bg-[#C1272D]",
    }
  ];

  const displayProducts =
    selectedCategory === "All"
      ? products.slice(0, 6)
      : products.filter((p) => p.category === selectedCategory).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5D1] to-[#FFE5B4] text-earthBrown flex flex-col justify-between overflow-x-hidden">
      {/* 0. TOP MARQUEE BANNER */}
      <div className="bg-marigold text-earthBrown py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-flex items-center text-xs font-bold tracking-wider">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="mx-4 inline-flex items-center gap-1">
              Next Day Dispatch – No minimum purchase required! <Flame size={14} className="text-[#C1272D]" />
            </span>
          ))}
        </div>
      </div>

      <Navigation />

      <main>
        {/* ========================================================
            1. GRAND HERO: BRING A LITTLE DIVINITY HOME
            ======================================================== */}
        <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Temple Pillars on sides */}
          <div className="absolute top-0 left-0 bottom-0 z-0 opacity-5 pointer-events-none hidden md:block">
             <TemplePillar height={800} />
          </div>
          <div className="absolute top-0 right-0 bottom-0 z-0 opacity-5 pointer-events-none hidden md:block transform scale-x-[-1]">
             <TemplePillar height={800} />
          </div>
          
          <div className="absolute top-10 left-1/4 opacity-[0.03] pointer-events-none z-0 transform rotate-12">
             <LotusMotif size={200} />
          </div>

          {/* Magical Background Elements */}
          <div className="absolute top-20 left-10 text-[#C1272D]/30 animate-pulse">
             <Sparkles size={32} />
          </div>
          <div className="absolute bottom-20 left-1/3 text-earthBrown/30 animate-bounce" style={{ animationDuration: '4s' }}>
             <Star size={24} />
          </div>
          <div className="absolute top-40 right-1/4 text-saffron/40 animate-pulse" style={{ animationDelay: '1s' }}>
             <Sparkles size={40} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 bg-white border border-antiqueGold text-earthBrown px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm mx-auto lg:mx-0">
                <Sparkles size={14} className="text-saffron" />
                <span>HM AGARBATTIS • COIMBATORE</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-[5rem] font-bold leading-[1.05] tracking-tight">
                <span className="text-earthBrown">Elevate Your</span> <br className="hidden sm:block" />
                <span className="text-saffron">Mind</span> <span className="text-[#C1272D]">& Spirit.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
                Experience profound peace, enhanced focus, and inner divinity. Handcrafted with pure botanicals, our sacred fragrances are the perfect companion for yoga, deep meditation, and your daily prayer.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/shop"
                  className="bg-[#C1272D] text-white px-8 py-4 rounded-md text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-solid-sm hover:bg-[#A11B22] transition w-full sm:w-auto"
                >
                  <span>Shop Sacred Essentials</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Mascot Carousel */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                 {/* Invisible dummy card to maintain container size */}
                 <div className="bg-white rounded-[2.5rem] p-8 border-4 border-white opacity-0 pointer-events-none w-full">
                    <div className="bg-transparent rounded-[2rem] w-full aspect-square"></div>
                 </div>

                 {/* Decorative background circle */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square bg-saffron/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
                 
                 {/* Actual Sliding Cards */}
                 {heroCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className={`absolute inset-0 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                        idx === heroIndex
                          ? "opacity-100 translate-x-0 rotate-0 scale-100 z-20"
                          : idx < heroIndex
                          ? "opacity-0 -translate-x-16 -rotate-6 scale-95 z-10 pointer-events-none"
                          : "opacity-0 translate-x-16 rotate-6 scale-95 z-10 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white relative w-full h-full flex flex-col justify-center items-center">
                        <div className={`absolute -top-6 -left-6 text-white font-display font-bold text-lg px-4 py-2 rounded-xl shadow-lg transform -rotate-6 z-30 transition-colors duration-500 ${card.color}`}>
                          {card.title}!
                        </div>
                        <div className="bg-[#FAF5E6] rounded-[2rem] w-full aspect-square flex items-center justify-center overflow-hidden border border-antiqueGold/30 relative shadow-inner">
                           <div className="relative z-10 transform scale-110 group-hover:scale-125 transition-transform duration-1000">
                             {card.mascot}
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                 ))}

                 {/* Pagination Dots */}
                 <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                    {heroCards.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setHeroIndex(idx)}
                        className={`h-3 rounded-full transition-all duration-300 ${idx === heroIndex ? 'bg-[#D35435] w-8' : 'bg-[#D35435]/30 w-3 hover:bg-[#D35435]/60'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            NEW: SACRED CATEGORIES SLIDER (From PDF)
            ======================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 border-y border-antiqueGold/20 relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#C1272D 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C1272D] uppercase block mb-3">
                DISCOVER YOUR PATH
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-earthBrown font-bold flex items-center justify-center gap-4">
                <LotusMotif size={36} className="text-saffron animate-pulse" />
                Explore Our Collections
                <LotusMotif size={36} className="text-saffron animate-pulse" />
              </h2>
            </div>
            
            <Carousel>
              {[
                {
                  title: "10-in-1 Family Pack",
                  desc: "10 unique flavours in one pack. Rose, Pineapple, Sandal, Glory & more.",
                  tag: "First in India",
                  color: "bg-[#C1272D]",
                  icon: <Star size={40} />
                },
                {
                  title: "HM Super Series",
                  desc: "6 exclusive premium flavours naturally made with no charcoal and no chemicals.",
                  tag: "Premium Sticks",
                  color: "bg-[#42884A]",
                  icon: <Flower2 size={40} />
                },
                {
                  title: "Bhimseni Camphor",
                  desc: "Distilled to 99.9% edible purity. Naturally sourced, hand-harvested pure camphor.",
                  tag: "99.9% Pure",
                  color: "bg-[#D35435]",
                  icon: <Sparkles size={40} />
                },
                {
                  title: "HM Exclusive",
                  desc: "Cardamom, Kasturi, Pancha Rudhra & Kesar Loban for deep meditation.",
                  tag: "Signature",
                  color: "bg-earthBrown",
                  icon: <Heart size={40} />
                },
                {
                  title: "Cup Sambrani",
                  desc: "Delivers dense, ancient smoke for environmental purification & aromatherapy.",
                  tag: "Purifier",
                  color: "bg-saffron",
                  icon: <Flame size={40} />
                },
                {
                  title: "Dhoop Sticks",
                  desc: "Indian Bakhoor & Italian Mehak. Intense aromatic smoke grounds your spirit.",
                  tag: "Exotic Fusion",
                  color: "bg-[#7F9E6C]",
                  icon: <Wind size={40} />
                }
              ].map((cat, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-antiqueGold/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group h-full">
                  <div className={`w-20 h-20 rounded-full ${cat.color} text-white flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-500`}>
                    {cat.icon}
                  </div>
                  <div className="bg-sacredCream text-earthBrown text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 border border-antiqueGold/40">
                    {cat.tag}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-earthBrown mb-3">{cat.title}</h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

        {/* ========================================================
            2. SPECIAL OFFERS SECTION (Products)
            ======================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C1272D] uppercase block mb-3">
                  SACRED OFFERS
                </span>
                <h2 className="font-display text-4xl sm:text-5xl text-earthBrown font-bold">
                  Today's Divine Deals
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-saffron hover:text-[#C1272D] flex items-center justify-center md:justify-start gap-1 uppercase tracking-wider transition border-b-2 border-transparent hover:border-[#C1272D] pb-1"
              >
                View All Offers <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 4).map((p) => (
                <div key={p.slug} className="relative">
                   <div className="absolute -top-3 -right-3 bg-[#C1272D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-20 shadow-md">
                     15% OFF
                   </div>
                   <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. BENEFITS & FEEL GOOD SECTION
            ======================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle background motif */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none transform translate-x-1/3 -translate-y-1/3">
             <LotusMotif size={400} />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-saffron uppercase block mb-3">
              THE HM DIFFERENCE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-earthBrown font-bold mb-12 max-w-2xl mx-auto">
              How Our Fragrances Enhance Your Everyday Life
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-antiqueGold/30 flex flex-col items-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-leaf/10 text-leaf rounded-2xl flex items-center justify-center mb-6">
                     <Flower2 size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-earthBrown mb-3">Purifies the Air</h3>
                  <p className="text-sm text-charcoal/70 font-sans leading-relaxed">
                    Made with natural botanicals, pure resins, and camphor, our blends actively clear stagnant energy and freshen your home naturally.
                  </p>
               </div>
               
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-antiqueGold/30 flex flex-col items-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-6">
                     <Star size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-earthBrown mb-3">Calms the Mind</h3>
                  <p className="text-sm text-charcoal/70 font-sans leading-relaxed">
                    The gentle aroma of sandalwood and halmaddi has been used for centuries to reduce stress, improve focus, and deepen meditation.
                  </p>
               </div>
               
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-antiqueGold/30 flex flex-col items-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-[#C1272D]/10 text-[#C1272D] rounded-2xl flex items-center justify-center mb-6">
                     <Heart size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-earthBrown mb-3">Sacred Ambience</h3>
                  <p className="text-sm text-charcoal/70 font-sans leading-relaxed">
                    Instantly transform any ordinary room into a divine temple sanctum, creating a warm, inviting, and highly positive atmosphere.
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. RELIGIOUS KIT EVENT (Moved down)
            ======================================================== */}
        <section className="bg-gradient-to-r from-[#C1272D] to-kumkum relative overflow-hidden text-sacredCream py-12 lg:py-20 shadow-lg">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          {/* Animated Marigold Garlands */}
          <div className="absolute top-0 left-4 z-50 hidden sm:block pointer-events-none" style={{ animationDelay: '0s' }}>
             <MarigoldGarland length={5} />
          </div>
          <div className="absolute top-0 left-16 z-50 hidden md:block pointer-events-none" style={{ animationDelay: '1s' }}>
             <MarigoldGarland length={3} />
          </div>
          <div className="absolute top-0 right-4 z-50 hidden sm:block pointer-events-none" style={{ animationDelay: '0.5s' }}>
             <MarigoldGarland length={6} />
          </div>
          <div className="absolute top-0 right-20 z-50 hidden lg:block pointer-events-none" style={{ animationDelay: '1.5s' }}>
             <MarigoldGarland length={4} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left side graphics */}
            <div className="flex justify-center lg:justify-start items-center relative">
               <div className="bg-white p-4 rounded-xl shadow-solid-sm relative transform rotate-2 w-full max-w-sm">
                  <div className="bg-saffron text-white absolute -top-3 -left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase z-20 shadow-sm">
                    First In India
                  </div>
                  <div className="bg-sacredCream/50 rounded-lg p-6 relative overflow-hidden h-64 flex items-center justify-center">
                      <MascotNamaste size={220} className="relative z-10 drop-shadow-md" />
                  </div>
               </div>
            </div>

            {/* Right side content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight drop-shadow-md text-white">
                The 10-in-1 Family Pack
              </h2>
              <p className="text-lg font-medium max-w-lg mx-auto lg:mx-0 text-white/90">
                Introducing for the first time in India: 10 beautiful flavours in one single pack! From Rose and Sandal to Kewda and Loban Super. 
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2 pb-2">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                  <Sparkles size={14} className="text-marigold" />
                  <span className="text-sm font-semibold text-white">10 Unique Fragrances</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                  <Flame size={14} className="text-marigold" />
                  <span className="text-sm font-semibold text-white">150 Grams / Pack</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                  <Flower2 size={14} className="text-marigold" />
                  <span className="text-sm font-semibold text-white">Premium Quality</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="bg-white text-[#C1272D] px-8 py-3.5 rounded-md text-sm font-bold tracking-wider flex items-center justify-center lg:justify-start gap-2 w-fit mx-auto lg:mx-0 hover:bg-sacredCream transition shadow-md"
                >
                  <span>Explore The Pack</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. PRODUCT HIGHLIGHT BANNER
            ======================================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-[#42884A] rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-sm flex flex-col lg:flex-row items-center gap-10">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-white" style={{ clipPath: 'circle(70% at 100% 50%)' }}></div>
            
            <div className="lg:w-1/2 space-y-6 relative z-10 text-center lg:text-left">
              <h2 className="font-display text-4xl sm:text-5xl font-bold">Bhimseni Camphor</h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-sans">
                Naturally Sourced Bhimseni: The purest form of camphor, hand-harvested and distilled to 99.9% edible purity. Preparing the way to find your God within.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                {["100% Pure", "Edible Purity", "Hand Harvested", "No Residue"].map(tag => (
                  <span key={tag} className="bg-white text-[#42884A] text-xs font-bold px-4 py-2 rounded-md shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative z-10 flex justify-center lg:justify-end pr-8">
              <div className="bg-white p-2 rounded-2xl shadow-lg transform rotate-6 border-4 border-white/20">
                <div className="bg-sacredCream rounded-xl w-64 h-64 flex items-center justify-center">
                  <MascotDiya size={180} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. KITS GRID
            ======================================================== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-r from-[#F05F2B] to-[#F57F26] rounded-2xl p-8 text-white flex justify-between items-center shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold mb-2 leading-tight drop-shadow-md">Kesar<br/>Loban</h3>
                <p className="text-xs text-white/90 mb-5 font-semibold">Rich Saffron & Resin</p>
                <Link href="/shop" className="bg-white text-earthBrown text-xs font-bold px-5 py-2.5 rounded-md hover:bg-sacredCream transition inline-block shadow-sm">
                  View Details
                </Link>
              </div>
              <div className="relative z-10 transform group-hover:scale-105 transition duration-300">
                <MascotBasket size={120} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-r from-[#C2285E] to-[#D53B75] rounded-2xl p-8 text-white flex justify-between items-center shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold mb-2 leading-tight drop-shadow-md">Pancha<br/>Rudhra</h3>
                <p className="text-xs text-white/90 mb-5 font-semibold">Sacred Inner Divinity</p>
                <Link href="/shop" className="bg-white text-earthBrown text-xs font-bold px-5 py-2.5 rounded-md hover:bg-sacredCream transition inline-block shadow-sm">
                  View Details
                </Link>
              </div>
              <div className="relative z-10 transform group-hover:scale-105 transition duration-300">
                <MascotNamaste size={120} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-r from-[#7F9E6C] to-[#588157] rounded-2xl p-8 text-white flex justify-between items-center shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold mb-2 leading-tight drop-shadow-md">Cardamom<br/>Exclusive</h3>
                <p className="text-xs text-white/90 mb-5 font-semibold">Focus & Meditation</p>
                <Link href="/shop" className="bg-white text-earthBrown text-xs font-bold px-5 py-2.5 rounded-md hover:bg-sacredCream transition inline-block shadow-sm">
                  View Details
                </Link>
              </div>
              <div className="relative z-10 transform group-hover:scale-105 transition duration-300">
                <MascotAgarbatti size={120} />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. MARKETPLACE BANNER
            ======================================================== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-[#362759] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-sm gap-8 relative overflow-hidden">
             {/* decorative background element */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')] mix-blend-overlay"></div>
             
             <div className="relative z-10 md:w-3/5 space-y-8 text-center md:text-left">
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight max-w-md mx-auto md:mx-0">
                  Fast & Secure Delivery All Over Tamil Nadu
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold">
                   <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                     <Truck size={18} className="text-marigold" />
                     <span>Coimbatore</span>
                   </div>
                   <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                     <Truck size={18} className="text-marigold" />
                     <span>Chennai</span>
                   </div>
                   <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                     <Truck size={18} className="text-marigold" />
                     <span>Madurai</span>
                   </div>
                   <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                     <Truck size={18} className="text-marigold" />
                     <span>Everywhere Else in TN</span>
                   </div>
                </div>
             </div>

             <div className="relative z-10 md:w-2/5 flex justify-center md:justify-end">
                <div className="bg-white p-2 rounded-2xl shadow-solid-sm transform -rotate-2 relative">
                   <div className="absolute -top-4 -left-4 bg-marigold text-earthBrown text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white transform -rotate-12 z-20">TN Delivery</div>
                   <div className="bg-sacredCream rounded-xl w-48 h-48 flex items-center justify-center">
                     <MascotDelivery size={160} />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ========================================================
            5. SACRED LIVING 
            ======================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
               <div className="bg-gradient-to-b from-[#7F9E6C] to-[#588157] text-white border-4 border-[#8CA97A] rounded-3xl p-6 pb-8 shadow-solid-md w-full max-w-sm text-center hover:-translate-y-1 transition duration-300">
                  <div className="bg-white rounded-2xl h-64 mb-6 flex items-center justify-center overflow-hidden border-2 border-white/20">
                     <MascotMeditate size={220} />
                  </div>
                  <h3 className="font-display font-bold text-2xl drop-shadow-sm">HM Coimbatore</h3>
                  <p className="text-xs text-white/90 mt-2 font-sans font-medium">Tradition of pure devotion since inception</p>
               </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8 space-y-8 text-earthBrown">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C1272D] uppercase block mb-3">
                  SACRED LIVING
                </span>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-xl">
                  Turn Everyday Moments Into Sacred Moments.
                </h2>
                <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-sans font-medium max-w-2xl">
                  In the rush of modern life, our morning and dusk prayers provide an anchor of peace. Lighting pure Bhimseni camphor or a hand-rolled HM agarbatti invites the sanctity of a thousand-year-old temple directly into your living room.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-antiqueGold/40 bg-white/60 p-6 rounded-2xl hover:bg-white transition backdrop-blur-sm shadow-sm">
                  <h4 className="font-display text-xl font-bold mb-2">Morning Sunrise</h4>
                  <p className="text-xs text-charcoal/70 font-sans font-medium">Awaken clarity and energy for the day ahead.</p>
                </div>
                <div className="border border-antiqueGold/40 bg-white/60 p-6 rounded-2xl hover:bg-white transition backdrop-blur-sm shadow-sm">
                  <h4 className="font-display text-xl font-bold mb-2">Evening Twilight</h4>
                  <p className="text-xs text-charcoal/70 font-sans font-medium">Settle the mind with sandalwood and sambrani.</p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/collections"
                  className="bg-[#D35435] text-white px-8 py-4 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 hover:bg-[#b04328] transition shadow-sm"
                >
                  <span>Explore Divine Collections</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. SACRED CALENDAR 
            ======================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C1272D] uppercase block mb-3">
                  SACRED CALENDAR
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-earthBrown">
                  Celebrate What Truly Matters
                </h2>
              </div>
              <Link
                href="/festivals"
                className="text-xs font-bold text-saffron hover:text-[#C1272D] flex items-center gap-2 uppercase tracking-wider transition pb-2 border-b-2 border-transparent hover:border-[#C1272D]"
              >
                View All Festivals <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {festivalsList.slice(0, 3).map((f) => (
                <article
                  key={f.id}
                  className="bg-[#932720] text-white p-8 rounded-3xl border border-white/10 hover:border-marigold/50 transition flex flex-col justify-between group h-full shadow-md"
                >
                  <div>
                    <span className="bg-[#B53C35] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-6 shadow-sm">
                      {f.dateText}
                    </span>
                    <h3 className="font-display text-3xl font-bold mb-4 group-hover:text-marigold transition leading-tight">
                      {f.name}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed font-sans font-medium">
                      {f.description}
                    </p>
                  </div>
                  <div className="mt-10 pt-6 border-t border-[#B53C35] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F4A261] flex items-center gap-1"><Sparkles size={12} /> {f.recommendedCategory}</span>
                    <Link
                      href={`/category/${f.recommendedCategory.toLowerCase()}`}
                      className="text-xs font-bold text-white group-hover:text-marigold flex items-center gap-1 transition"
                    >
                      Shop Essentials <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

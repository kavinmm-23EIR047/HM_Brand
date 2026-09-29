"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Plus, Heart, ShoppingBag, Sparkles, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CategoryStrip } from "@/components/category-strip";
import { HeroBannerSlider } from "@/components/hero-banner-slider";
import { TrustStrip } from "@/components/trust-strip";
import { BentoPromos } from "@/components/bento-promos";
import { PromoBanners } from "@/components/promo-banners";
import { Testimonials } from "@/components/testimonials";
import { OurStorySection } from "@/components/our-story-section";
import { products } from "@/lib/products";
import { useStore } from "@/components/store";

export default function HomePage() {
  const { add, toggleWishlist, isInWishlist, dbProducts } = useStore();

<<<<<<< HEAD
  const displayPicks = dbProducts && dbProducts.length > 0
    ? dbProducts.slice(0, 8).map((p, idx) => ({
        slug: p.slug,
        name: p.name,
        badge: p.couponCode ? `COUPON: ${p.couponCode}` : (p.badge || "Best Seller"),
        badgeBg: idx % 3 === 0 ? "bg-[#3F7D45]" : idx % 3 === 1 ? "bg-[#9E1830]" : "bg-[#7653A6]",
        rating: p.rating || 4.9,
        reviews: p.reviewCount || 48,
        note: p.note || p.description?.slice(0, 80),
        price: p.price,
        unit: p.quantity || "150 GMS",
        image: p.image || "/images/media_1790142713668.jpg",
        rawProduct: p,
      }))
    : [
        {
          slug: "bhimseni-camphor",
          name: "Bhimseni Camphor",
          badge: "Best Seller",
          badgeBg: "bg-[#3F7D45]",
          rating: 4.8,
          reviews: 120,
          note: "Distilled to 99.9% edible purity. Naturally sourced and hand-harvested.",
          price: 199,
          unit: "50 GMS",
          image: "/images/camphor_cutout.jpg",
          rawProduct: products[0],
        },
      ];
=======
  const popularPicks = [
    {
      slug: "bhimseni-camphor",
      name: "Bhimseni Camphor",
      badge: "Best Seller",
      badgeBg: "bg-[#3F7D45]",
      rating: 4.8,
      reviews: 120,
      note: "Distilled to 99.9% edible purity. Naturally sourced and hand-harvested.",
      price: 199,
      unit: "50 GMS",
      image: "/images/camphor_cutout.jpg",
    },
    {
      slug: "10-in-1-aroma-family-pack",
      name: "10 in 1 Aroma Family Pack",
      badge: "1st Time in India",
      badgeBg: "bg-[#9E1830]",
      rating: 4.9,
      reviews: 168,
      note: "10 divine fragrances in 1 box. Kewda, Loban, Rose, Sandalwood & more.",
      price: 100,
      unit: "10-IN-1 PACK",
      image: "/images/agarbatti_cutout.jpg",
    },
    {
      slug: "kesar-loban",
      name: "Kesar Loban",
      badge: "Popular",
      badgeBg: "bg-[#7653A6]",
      rating: 4.8,
      reviews: 76,
      note: "Rich saffron and purifying resin for a peaceful atmosphere.",
      price: 175,
      unit: "100 GMS",
      image: "/images/sambrani.jpg",
    },
    {
      slug: "pancha-rudhra",
      name: "Pancha Rudhra",
      badge: "New Arrival",
      badgeBg: "bg-[#4C7FA8]",
      rating: 4.7,
      reviews: 64,
      note: "Sacred blend for focus and spiritual well-being.",
      price: 110,
      unit: "50 NOS",
      image: "/images/camphor.jpg",
    },
  ];
>>>>>>> d4c37a685181678238b0d3fac10872588c366b67

  return (
    <div className="min-h-screen bg-[#FFF4D6] text-[#173B3A] flex flex-col justify-between w-full max-w-full overflow-x-hidden font-sans">
      
      {/* 1. ANNOUNCEMENT BAR & NAVBAR */}
      <Navigation />

      <main className="w-full max-w-full overflow-x-hidden">
        {/* 2. HERO CAROUSEL */}
        <HeroBannerSlider />

        {/* 3. VISUAL CATEGORY NAVIGATION (7 CIRCLES) */}
        <CategoryStrip />

        {/* 4. BENEFIT / TRUST STRIP */}
        <TrustStrip />

        {/* 5. BENTO PROMO GRID (10-IN-1 FAMILY PACK OFFER) */}
        <BentoPromos />

        {/* 6. BESTSELLERS PRODUCT SHOWCASE */}
        <section className="py-14 sm:py-16 bg-[#FFF4D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-1">
                  OUR BEST SELLERS
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#173B3A]">
                  Popular Picks for a <span className="text-[#9E1830]">Peaceful Home</span>
                </h2>
              </div>
              
              <Link
                href="/shop"
                className="font-sans text-xs font-bold text-[#F47A20] hover:text-[#9E1830] flex items-center gap-1 uppercase tracking-wider transition group"
              >
                <span>View All Products</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Product Cards Grid */}
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayPicks.map((item) => {
                const wishlisted = isInWishlist(item.slug);
                const originalProduct = item.rawProduct || products.find((p) => p.slug === item.slug) || products[0];

                return (
                  <div
                    key={item.slug}
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative border border-[#F6C84C]/30"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-square w-full rounded-xl bg-[#fffaf0] p-2.5 flex items-center justify-center overflow-hidden mb-2.5">
                      
                      {/* Refined Luxury Micro-Badge */}
                      <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#9E1830] shadow-xs border border-[#F6C84C]/50 backdrop-blur-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#9E1830]" />
                        {item.badge}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(item.slug);
                        }}
                        className={`absolute top-2 right-2 z-10 h-7 w-7 rounded-full flex items-center justify-center shadow-xs transition backdrop-blur-xs ${
                          wishlisted
                            ? "bg-[#9E1830] text-white"
                            : "bg-white/90 text-[#173B3A]/70 hover:bg-[#9E1830] hover:text-white border border-[#F6C84C]/30"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
                      </button>

                      <Link href={`/product/${item.slug}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-32 sm:max-h-40 object-contain group-hover:scale-105 transition duration-500"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs text-[#173B3A] mb-1">
                        <div className="flex text-[#F47A20]">
                          {Array(5).fill(null).map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                        <span className="font-bold text-[11px] sm:text-xs">{item.rating}</span>
                        <span className="text-[#173B3A]/50 text-[10px]">({item.reviews})</span>
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-heading font-extrabold text-xs min-[360px]:text-sm sm:text-base text-[#173B3A] group-hover:text-[#9E1830] transition leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="font-sans text-[11px] sm:text-xs text-[#173B3A]/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.note}
                      </p>
                    </div>

                    {/* Price & Add to Cart Action */}
                    <div className="mt-3 pt-2.5 border-t border-[#FFF4D6] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-heading text-base sm:text-lg font-extrabold text-[#9E1830] block leading-none">₹{item.price}</span>
                        <span className="font-space text-[9px] text-[#173B3A]/60 font-semibold block uppercase tracking-wider mt-0.5">
                          {item.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => add(originalProduct)}
                        className="bg-[#F47A20] hover:bg-[#9E1830] text-white text-[11px] sm:text-xs font-extrabold px-3 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
                      >
                        <ShoppingBag size={13} />
                        <span>Add</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 7. DUAL PROMO BANNERS */}
        <PromoBanners />

        {/* 8. CUSTOMER REVIEWS */}
        <Testimonials />

        {/* 9. BRAND STORY & WELLBEING */}
        <OurStorySection />

        {/* 10. FINAL CTA BANNER ("Find Your God Within") */}
        <section className="py-8 sm:py-12 bg-[#FFF4D6] px-3 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-2xl rounded-bl-2xl sm:rounded-tl-[52px] sm:rounded-br-[52px] sm:rounded-tr-3xl sm:rounded-bl-3xl border-2 border-[#F6C84C]/60 bg-gradient-to-r from-[#3e1b60] via-[#562d7c] to-[#351654] p-4 sm:p-8 lg:p-10 shadow-[0_20px_45px_-15px_rgba(53,22,84,0.6)]">
            
            {/* Background Ambient Glow & Mandala Watermark */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#F6C84C]/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-[#9E1830]/25 blur-3xl" />

            {/* True Horizontal Layout (Side-by-Side on Mobile & Desktop) */}
            <div className="relative z-10 flex flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-8">
              
              {/* Left Column: Concise Content & Action */}
              <div className="w-[58%] sm:w-[62%] lg:w-[65%] space-y-2 sm:space-y-3.5 pr-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F6C84C]/50 bg-white/10 px-2.5 py-0.5 text-[9px] sm:text-xs font-bold tracking-widest text-[#F6C84C] uppercase backdrop-blur-xs">
                  <Sparkles size={11} className="text-[#F6C84C] shrink-0" />
                  <span>SACRED TEMPLE HERITAGE</span>
                </span>

                <div>
                  <span className="font-script text-2xl sm:text-4xl lg:text-5xl text-[#F6C84C] font-normal block leading-tight">
                    Find Your God Within
                  </span>
                  <h2 className="mt-0.5 font-heading text-base sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
                    Bring Sacred Fragrance &amp; Peace Into Your Everyday Life
                  </h2>
                </div>

                <p className="font-sans text-[11px] sm:text-sm text-white/90 leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                  Pure handcrafted agarbattis, Bhimseni camphor &amp; sambrani delivered directly from Coimbatore.
                </p>

                {/* 2 Micro Badges on Tablet/Desktop */}
                <div className="hidden sm:flex items-center gap-2 pt-0.5 text-[11px] text-white/95 font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1">
                    <ShieldCheck size={13} className="text-[#F6C84C]" /> 100% Charcoal-Free
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1">
                    ✦ Pure Botanicals
                  </span>
                </div>

                <div className="pt-1.5 sm:pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#F6C84C] px-4 py-2 sm:px-7 sm:py-3 font-bold text-[11px] sm:text-xs tracking-wide text-[#173B3A] shadow-md transition hover:bg-[#F47A20] hover:text-white hover:scale-105 active:scale-95"
                  >
                    <span>Shop Sacred Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Die-Cut Arched Window Radius Frame */}
              <div className="w-[42%] sm:w-[38%] lg:w-[35%] flex items-center justify-center shrink-0">
                <div className="group relative aspect-[4/5] w-full max-w-[150px] min-[400px]:max-w-[180px] sm:max-w-[240px] lg:max-w-[280px] overflow-hidden rounded-t-full rounded-b-2xl sm:rounded-b-3xl border-2 border-[#F6C84C]/70 bg-gradient-to-t from-black/35 via-white/5 to-white/15 p-2 sm:p-3.5 shadow-2xl backdrop-blur-xs flex items-center justify-center">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#ffd54c]/20 via-transparent to-transparent" />
                  <div className="relative h-full w-full">
                    <Image
                      src="/images/hm_find_god_within_shrine.png"
                      alt="HM sacred temple shrine with glowing brass diya, incense smoke, lotus and temple bells"
                      fill
                      sizes="(max-width: 640px) 180px, 280px"
                      className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 11. GRAND MAROON FOOTER */}
      <Footer />

    </div>
  );
}

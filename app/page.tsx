"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, Plus, Heart, ShoppingBag } from "lucide-react";
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
  const { add, toggleWishlist, isInWishlist } = useStore();

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
      slug: "hm-super-series",
      name: "HM Super Series Agarbattis",
      badge: "Festival Special",
      badgeBg: "bg-[#9E1830]",
      rating: 4.7,
      reviews: 98,
      note: "10 premium fragrances in one pack. Naturally made. No chemicals.",
      price: 150,
      unit: "150 GMS",
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
      image: "/images/media_1790142713668.jpg",
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
      image: "/images/sambrani.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF4D6] text-[#173B3A] flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* 1. ANNOUNCEMENT BAR & NAVBAR */}
      <Navigation />

      <main>
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
              {popularPicks.map((item) => {
                const wishlisted = isInWishlist(item.slug);
                const originalProduct = products.find((p) => p.slug === item.slug) || products[0];

                return (
                  <div
                    key={item.slug}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-square w-full rounded-xl bg-[#fffaf0] p-3 flex items-center justify-center overflow-hidden mb-3">
                      
                      {/* Top Badge */}
                      <span className={`absolute top-3 left-3 ${item.badgeBg} text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs z-10`}>
                        {item.badge}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(item.slug);
                        }}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm transition ${
                          wishlisted
                            ? "bg-[#9E1830] text-white"
                            : "bg-white text-[#173B3A] hover:bg-[#9E1830] hover:text-white"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
                      </button>

                      <Link href={`/product/${item.slug}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-36 sm:max-h-40 object-contain group-hover:scale-105 transition duration-500"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-xs text-[#173B3A] mb-1.5">
                        <div className="flex text-[#F47A20]">
                          {Array(5).fill(null).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                        <span className="font-bold text-xs">{item.rating}</span>
                        <span className="text-[#173B3A]/60 text-[11px]">({item.reviews})</span>
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-heading font-bold text-base text-[#173B3A] group-hover:text-[#9E1830] transition leading-snug">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="font-sans text-xs text-[#173B3A]/75 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {item.note}
                      </p>
                    </div>

                    {/* Price & Add to Cart Action */}
                    <div className="mt-4 pt-3 border-t border-[#FFF4D6] flex items-center justify-between">
                      <div>
                        <span className="font-heading text-lg font-bold text-[#9E1830]">₹{item.price}</span>
                        <span className="font-space text-[10px] text-[#173B3A]/60 font-bold block uppercase">
                          {item.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => add(originalProduct)}
                        className="bg-[#F47A20] hover:bg-[#9E1830] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                      >
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
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
        <section className="py-12 bg-[#FFF4D6] px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-[#7653A6] text-white rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="font-script text-3xl sm:text-4xl text-[#F6C84C] font-normal block">
                Find Your God Within
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Bring Sacred Fragrance & Peace Into Your Everyday Life
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed">
                Handcrafted Indian incense, pure Bhimseni camphor, and sacred sambrani delivered straight from Coimbatore to your home.
              </p>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="bg-[#F6C84C] text-[#173B3A] hover:bg-[#F47A20] hover:text-white px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-md inline-flex items-center gap-2.5 group"
                >
                  <span>Shop Sacred Collection</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
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

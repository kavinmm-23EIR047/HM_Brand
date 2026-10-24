"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles, Tags, Percent, ShieldCheck, Heart } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { collectionsList } from "@/lib/products";
import { useStore } from "@/components/store";

export default function OffersPage() {
  const { dbProducts } = useStore();
  const allProducts = dbProducts || [];
  const [content, setContent] = useState<any>({});
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    Promise.all([
      fetch(`${api}/content/pages/offers`).then((r) => r.json()),
      fetch(`${api}/collections`).then((r) => r.json())
    ]).then(([page, cols]) => {
      if (page.success && page.data) setContent(page.data);
      if (cols.success && Array.isArray(cols.data)) setCollections(cols.data);
    }).catch(() => {});
  }, []);

  const curatedProducts = (content.productIds || []).map((id: string) => allProducts.find((product) => product.id === id)).filter(Boolean);
  const offerProducts = curatedProducts.length > 0
    ? curatedProducts
    : allProducts.filter((product) => {
        const mrp = Number((product.mrp || "").replace(/[^0-9.]/g, ""));
        return mrp > product.price || Boolean(product.couponCode);
      });
  const offerCollections = (content.collectionIds || []).map((id: string) => collections.find((collection) => collection.id === id)).filter(Boolean);

  return (
    <InnerPage
      eyebrow={content.eyebrow || "FESTIVE OFFERS & SPECIAL BUNDLES"}
      title={content.title || "Sacred Fragrances, Special Festive Blessings"}
      subtitle={content.subtitle || "Discover limited-time offers, value combos, and curated gift boxes for your daily puja, family celebrations, and wellness gifting."}
    >
      <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* HERO BANNER WITH ANIMATED FESTIVE GIFT BOX GIF */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-6 sm:p-10 lg:p-12 text-white border-2 border-[#F6C84C]/70 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6C84C] text-[#173B3A] px-3.5 py-1 text-[11px] font-black uppercase tracking-widest shadow-md">
                <Percent size={13} className="text-[#9E1830]" />
                <span>{content.badge || "LIMITED TIME FESTIVE PRICING"}</span>
              </span>

              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                {content.heroTitle || "A Little More Joy & Fragrance in Every Order."}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                {content.description || "Enjoy special prices on Coimbatore handcrafted agarbattis, pure Bhimseni camphor, and sacred sambrani cups. Handcrafted with zero charcoal and 100% pure botanical resins."}
              </p>

              {/* Offer Features */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-md">
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck size={16} className="text-[#F6C84C] shrink-0" />
                  <span>{content.featureOne || "Direct from Coimbatore"}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center gap-2 text-xs font-semibold">
                  <Gift size={16} className="text-[#F6C84C] shrink-0" />
                  <span>{content.featureTwo || "Free Samples Included"}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="#special-picks"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F6C84C] hover:bg-white text-[#173B3A] px-6 py-3 font-extrabold text-xs sm:text-sm transition shadow-md hover:scale-105 active:scale-95"
                >
                  <span>{content.cta || "Explore Offer Picks"}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Animated Festive Gift GIF */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-44 h-44 sm:w-60 sm:h-60 rounded-3xl bg-white/10 border-2 border-[#F6C84C]/50 p-4 shadow-2xl flex items-center justify-center backdrop-blur-xs">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/special_offer_gift_transparent.png"
                    alt="Festive Offer Gift Box"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SPECIAL DISCOUNTED PICKS */}
        <section id="special-picks" className="scroll-mt-28 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F6C84C]/30 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E1830]">
                HANDPICKED VALUE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A] mt-1">
                {content.picksTitle || "Popular Offer Picks"}
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#9E1830] hover:text-[#F47A20] transition hover:translate-x-1"
            >
              <span>View All Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {offerProducts.length > 0 ? (
              offerProducts.map((product: any) => (
                <ProductCard key={product.slug} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl bg-[#FFF8E7] p-8 text-center text-sm text-[#292524]/80 border border-[#F6C84C]/40">
                <p>No promotional offers available right now. Check back soon for festive specials!</p>
                <Link href="/shop" className="inline-flex items-center gap-1.5 font-bold text-[#9E1830] mt-3 hover:underline text-xs">
                  <span>Explore All Products</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* OCCASION BUNDLES */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#287541]">
              CURATED HAMPERS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A]">
              {content.bundlesTitle || "Shop By Pooja & Celebration Occasion"}
            </h2>
            <p className="text-sm text-[#292524]/80">
              {content.bundleDescription || "Specially paired fragrant sets for home warming, festivals, and personal wellness."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerCollections.map((collection: any) => (
              <Link
                key={collection.id}
                href={`/collections#${collection.slug}`}
                className="group rounded-3xl border-2 border-[#F6C84C]/50 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9E1830] bg-[#FFF4D6] px-2.5 py-0.5 rounded-full border border-[#F6C84C]/40">
                    {collection.subtitle || "CURATED COLLECTION"}
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-[#173B3A] group-hover:text-[#9E1830] transition">
                    {collection.title}
                  </h3>
                  <p className="text-xs text-[#292524]/80 leading-relaxed font-sans">
                    {collection.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F6C84C]/20 flex items-center justify-between text-xs font-bold text-[#9E1830] group-hover:text-[#F47A20]">
                  <span>Explore Bundle</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FESTIVAL GUIDE TEASER */}
        <section className="rounded-3xl bg-gradient-to-r from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-8 border-2 border-[#F6C84C]/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#9E1830] text-[#F6C84C] flex items-center justify-center shrink-0 shadow-md">
              <Gift size={26} />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#173B3A]">
                Planning a Festive Celebration or Griha Pravesh?
              </h3>
              <p className="text-xs sm:text-sm text-[#292524]/80 mt-0.5">
                Discover our festival guide and bulk pooja samagri essentials.
              </p>
            </div>
          </div>

          <Link
            href="/festivals"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#9E1830] hover:bg-[#851227] text-white px-6 py-3 font-bold text-xs sm:text-sm transition shadow-md hover:scale-105 active:scale-95"
          >
            <span>Explore Festival Guide</span>
            <Sparkles size={14} className="text-[#F6C84C]" />
          </Link>
        </section>

      </div>
    </InnerPage>
  );
}

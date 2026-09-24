"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { MascotBasket } from "@/components/mascot-art";
import { useStore } from "@/components/store";
import { products } from "@/lib/products";

export default function WishlistPage() {
  const { wishlist } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <InnerPage
      eyebrow="YOUR SACRED WISHLIST"
      title="Saved for Your Sacred Moments"
      subtitle="Keep track of your favorite handcrafted agarbattis, pure camphor, and spiritual essentials."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {wishlistedProducts.length === 0 ? (
          <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-solid-sm flex flex-col items-center">
            <MascotBasket size={180} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold mt-6">
              Your basket is waiting for something special
            </h2>
            <p className="text-sm text-[#292524]/75 mt-3 max-w-md font-sans leading-relaxed">
              Explore our handcrafted collections and click the heart icon on any sacred item to save it here for later.
            </p>
            <Link
              href="/shop"
              className="btn-saffron mt-8 px-8 py-4 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-solid-sm"
            >
              <span>Explore Sacred Essentials</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#C89B3C]/40">
              <p className="text-xs font-bold text-[#B23A48] uppercase tracking-wider">
                {wishlistedProducts.length} Saved Essentials
              </p>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#E85D04] hover:text-[#B23A48] flex items-center gap-1"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </InnerPage>
  );
}

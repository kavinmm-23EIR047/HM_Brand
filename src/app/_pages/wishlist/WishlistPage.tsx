"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";
import { ProductCard } from "@/app/product/[slug]/_components/ProductCard";

export default function WishlistPage() {
  const { wishlist, dbProducts, isInitialDataLoading } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const savedProducts = useMemo(
    () => wishlist
      .map((slug) => dbProducts.find((product) => product.slug === slug))
      .filter((product) => product !== undefined),
    [wishlist, dbProducts],
  );

  const isLoadingSavedProducts = isMounted && wishlist.length > 0 && savedProducts.length === 0 && isInitialDataLoading;

  return (
    <InnerPage
      eyebrow="YOUR SAVED COLLECTION"
      title="Wishlist"
      subtitle="Keep the fragrances and puja essentials you love close at hand."
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {!isMounted || isLoadingSavedProducts ? (
          <section aria-label="Loading wishlist" aria-busy="true" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-brand-border bg-white p-2.5">
                <div className="aspect-square animate-pulse rounded-xl bg-brand-border/45" />
                <div className="space-y-2 p-2 pt-3">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-brand-border/45" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-brand-border/45" />
                </div>
              </div>
            ))}
          </section>
        ) : savedProducts.length === 0 && wishlist.length === 0 ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-brand-border bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-primary/15 bg-brand-surface-soft text-brand-primary">
              <Heart size={26} />
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary">
              <Sparkles size={13} /> Saved for later
            </span>
            <h2 className="mt-2 font-brand text-xl font-bold text-brand-ink sm:text-2xl">Your wishlist is waiting</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-ink/70">
              Tap the heart on any product to keep it here for your next visit.
            </p>
            <Link href="/shop" className="btn-primary mt-6 gap-2">
              Explore products <ArrowRight size={16} />
            </Link>
          </section>
        ) : savedProducts.length > 0 ? (
          <section aria-label="Saved products" className="space-y-5">
            <div className="flex items-end justify-between gap-3 border-b border-brand-border/80 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/75">Saved for your next ritual</p>
                <h2 className="mt-1 font-brand text-lg font-bold text-brand-ink sm:text-xl">
                  {savedProducts.length} {savedProducts.length === 1 ? "product" : "products"}
                </h2>
              </div>
              <Link href="/shop" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-primary hover:underline sm:text-sm">
                Continue shopping <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {savedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-xl rounded-3xl border border-brand-border bg-white px-6 py-9 text-center shadow-sm">
            <Heart size={26} className="mx-auto mb-3 text-brand-primary" />
            <h2 className="font-brand text-lg font-bold text-brand-ink">Saved products are unavailable</h2>
            <p className="mt-2 text-sm text-brand-ink/70">Browse the collection and save any products you would like to revisit.</p>
            <Link href="/shop" className="btn-primary mt-5 gap-2">Explore products <ArrowRight size={16} /></Link>
          </section>
        )}
      </div>
    </InnerPage>
  );
}

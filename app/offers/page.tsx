"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles, Tags } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { collectionsList, products } from "@/lib/products";
import { RitualArt } from "@/components/illustrations/RitualArt";

export default function OffersPage() {
  const offerProducts = products.filter((product) => {
    const mrp = Number(product.mrp.replace(/[^0-9.]/g, ""));
    return mrp > product.price;
  });

  return (
    <InnerPage eyebrow="SPECIAL OFFERS" title="Good finds for your everyday rituals" subtitle="Browse current product prices, popular picks and ready-to-explore fragrance collections. Product prices and savings are shown on each item.">
      <div className="mx-auto max-w-[1368px] space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-[#a90c35] px-6 py-8 text-white sm:px-10 sm:py-11 lg:px-14">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd34e] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#173b3a]"><Tags size={13} /> HM special offers</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.035em] sm:text-4xl lg:text-5xl">A little more goodness in every order.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">Discover reduced prices on selected products and explore curated collections for puja, peaceful evenings and meaningful gifting.</p>
            <Link href="#offer-picks" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ffd34e] px-6 py-3 text-sm font-extrabold text-[#173b3a] transition hover:bg-white">See offer picks <ArrowRight size={16} /></Link>
          </div>
          <div className="absolute -bottom-5 right-4 hidden h-56 w-56 place-items-center rounded-full bg-white/10 sm:grid lg:right-16 lg:h-72 lg:w-72"><RitualArt kind="gift" className="h-48 w-48 lg:h-64 lg:w-64" /></div>
        </section>

        <section id="offer-picks" className="scroll-mt-28">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#a90c35]">SELECTED FOR YOU</span><h2 className="mt-1 text-2xl font-extrabold tracking-[-.03em] text-[#173b3a] sm:text-3xl">Popular picks & current prices</h2><p className="mt-2 text-sm text-[#65716a]">Compare the listed price with the MRP on each product card.</p></div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#a90c35]">Browse all products <ArrowRight size={14} /></Link>
          </div>
          {offerProducts.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">{offerProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="rounded-2xl bg-white p-5 text-center text-sm text-[#65716a] sm:p-8">No special product prices are available right now. Browse our popular picks in the shop.</div>}
        </section>

        <section>
          <div className="mb-5"><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#286b45]">CURATED TO MAKE CHOOSING EASY</span><h2 className="mt-1 text-2xl font-extrabold tracking-[-.03em] text-[#173b3a] sm:text-3xl">Shop by occasion</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collectionsList.slice(0, 3).map((collection, index) => <Link key={collection.id} href={`/collections#${collection.id}`} className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f4edda]"><RitualArt kind={index === 0 ? "incense" : index === 1 ? "sambrani" : "gift"} className="h-full w-full" /></span>
              <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#a90c35]">{collection.subtitle}</span><span className="mt-1 block text-sm font-extrabold leading-tight text-[#173b3a] group-hover:text-[#a90c35]">{collection.title}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#286b45]">Explore <ArrowRight size={13} /></span></span>
            </Link>)}
          </div>
        </section>

        <Link href="/festivals" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#e7efda] p-5 sm:p-7">
          <span className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#286b45]"><Gift size={22} /></span><span><span className="block text-lg font-extrabold text-[#173b3a]">Preparing for a festival?</span><span className="mt-1 block text-sm text-[#52625a]">See fragrance ideas and essentials for the season.</span></span></span><span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#a90c35]">Explore festival guide <Sparkles size={15} /></span>
        </Link>
      </div>
    </InnerPage>
  );
}


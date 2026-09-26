"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { collectionsList, products } from "@/lib/products";
import { RitualArt } from "@/components/illustrations/RitualArt";

const collectionArt = ["incense", "camphor", "sambrani", "gift"] as const;

export default function CollectionsPage() {
  return (
    <InnerPage eyebrow="CURATED RITUALS" title="Find a collection for every moment" subtitle="Thoughtful fragrance pairings for daily prayer, peaceful evenings, celebrations and thoughtful gifting.">
      <div className="mx-auto max-w-[1368px] space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav aria-label="Browse collections" className="flex gap-2 overflow-x-auto pb-2">
          {collectionsList.map((collection) => <a key={collection.id} href={`#${collection.id}`} className="shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#365349] shadow-sm transition hover:bg-[#e7efda] hover:text-[#a90c35]">{collection.title}</a>)}
        </nav>

        {collectionsList.map((collection, index) => {
          const collectionProducts = products.filter((product) => collection.items.includes(product.slug));
          const art = collectionArt[index % collectionArt.length];
          return <section key={collection.id} id={collection.id} className="scroll-mt-28 overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_8px_28px_rgba(49,54,33,.07)] sm:p-8 lg:p-9">
            <div className="grid gap-6 border-b border-[#edf0e7] pb-6 sm:grid-cols-[1fr_auto] sm:items-center sm:pb-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f4edda] sm:h-24 sm:w-24"><RitualArt kind={art} className="h-full w-full" /></div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#a90c35]"><Sparkles size={12} className="text-[#e28b2d]" />{collection.subtitle}</span>
                  <h2 className="mt-1 text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#173b3a] sm:text-3xl">{collection.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65716a]">{collection.description}</p>
                </div>
              </div>
              <Link href={`/collections#${collection.id}`} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e7efda] px-5 py-3 text-xs font-extrabold text-[#28563c] transition hover:bg-[#d9e7c7]">Explore this collection <ArrowRight size={14} /></Link>
            </div>
            {collectionProducts.length ? <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">{collectionProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="mt-6 rounded-xl bg-[#fffaf0] p-5 text-sm text-[#65716a]">Explore all products to build your ritual collection. <Link href="/shop" className="font-bold text-[#a90c35]">Browse the shop <ArrowRight size={13} className="inline" /></Link></div>}
          </section>;
        })}
      </div>
    </InnerPage>
  );
}


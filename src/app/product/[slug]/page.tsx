import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Home,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Package,
  Clock,
  Ruler,
  CheckCircle2,
  Leaf,
  Sun,
  Droplets,
  Lock,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "./_components/ProductCard";
import { ProductGallery } from "./_components/ProductGallery";
import { RelatedProductsSlider } from "./_components/RelatedProductsSlider";
import { AddPanel } from "./_components/AddPanel";
import { Lotus } from "@/components/illustrations/Lotus";
import { getProductSpecConfig, hasProductRating, mapDbProductToProduct, type Product } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return mapDbProductToProduct(json.data);
    }
  } catch {
    return null;
  }
  return null;
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  try {
    const catQuery = encodeURIComponent(product.category.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-"));
    const res = await fetch(`${API}/products?category=${catQuery}&limit=8`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data
          .filter((p: any) => p.slug !== product.slug)
          .slice(0, 8)
          .map(mapDbProductToProduct);
      }
    }
  } catch {
    return [];
  }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product not found | HM Agarbattis",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | HM Agarbattis`,
    description: product.note,
    alternates: { canonical: `/product/${encodeURIComponent(product.slug)}` },
    openGraph: {
      title: `${product.name} | HM Agarbattis`,
      description: product.note,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(product);
  const productContext = `${product.category} ${product.subCategory ?? ""} ${product.name}`.toLowerCase();
  const usageImage = /camphor|karpoor|karppor|kapoor/.test(productContext)
    ? "/images/camphor-lighting-steps-infographic.png"
    : productContext.includes("sambrani")
      ? "/images/sambrani-burning-instruction-guide.png"
      : "/images/two-step-incense-lighting-guide.png";

  return (
    <InnerPage
      eyebrow={product.category.toUpperCase()}
      title={product.name}
      subtitle={product.note}
      showHero={false}
    >
      <div className="page-container py-4 sm:py-8 pb-6 sm:pb-10 space-y-6 sm:space-y-10">

        {/* ─── 1. BREADCRUMB ─── */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-ui-13 font-medium text-stone-500">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-primary transition-colors">
            <Home size={13} className="text-stone-400" />
            <span>Home</span>
          </Link>
          <span className="text-stone-300">›</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-primary transition-colors truncate max-w-[120px] sm:max-w-none">
            {product.category}
          </Link>
          <span className="text-stone-300">›</span>
          <span className="font-semibold text-brand-ink truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* ─── 2. PRODUCT HERO: DUAL-COLUMN RESPONSIVE LAYOUT ─── */}
        <div className="grid grid-cols-1 items-start gap-4 sm:gap-8 lg:grid-cols-12 lg:gap-12">

          {/* ── LEFT: PRODUCT GALLERY & 4 FEATURE TILES (Sticky on desktop) ── */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-24 self-start">
            <ProductGallery
              images={product.images}
              fallbackImage={product.image}
              productName={product.name}
              badge={product.badge}
            />
          </div>

          {/* ── RIGHT: PRODUCT DETAILS PROPER CONTAINER ── */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl sm:rounded-3xl border border-[#EADBBD] bg-white p-3 sm:p-7 lg:p-8 shadow-sm space-y-3 sm:space-y-6">

              {/* Category Pill & Real Backend Reviews / Authentic Trust Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#FAF6EE]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9E1830]/25 bg-[#FFF5F5] px-3.5 py-1 text-xs font-bold text-[#9E1830] shadow-2xs">
                  <Sparkles size={12} className="text-[#9E1830]" />
                  {product.category}
                  {product.subCategory ? ` · ${product.subCategory}` : ""}
                </span>

                {hasProductRating(product) ? (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex text-[#D97706]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(product.rating || 0) ? "fill-[#D97706] text-[#D97706]" : "fill-stone-200 text-stone-200"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-[#173B3A]">{(product.rating).toFixed(1)}</span>
                    <span className="text-stone-400">({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173B3A] bg-[#FAF7EE] border border-[#EADBBD] px-3 py-1 rounded-full shadow-2xs">
                    <ShieldCheck size={14} className="text-[#287541]" />
                    <span>100% Genuine Devotional Grade</span>
                  </div>
                )}
              </div>

              {/* Title, Full Product Description & Conditional Bundle Notice */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="font-brand text-3xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-wide text-[#173B3A] uppercase">
                  {product.name}
                </h1>

                {product.tagline && (
                  <p className="font-playfair text-base sm:text-lg font-semibold text-[#6B4226] italic">
                    {product.tagline}
                  </p>
                )}

                <div className="space-y-2 font-sans text-sm sm:text-[15px] text-[#4A433E] leading-relaxed font-normal">
                  {(product.descriptionParagraphs && product.descriptionParagraphs.length > 0
                    ? product.descriptionParagraphs
                    : product.description
                      ? [product.description]
                      : ["A sacred fragrance crafted to bring divine peace, positivity and serenity into your home."]
                  ).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Complete Bundle Info Badge (Rendered ONLY when bundleQuantity > 1) */}
                {Boolean(product.bundleQuantity && product.bundleQuantity > 1) && (
                  <div className="inline-flex items-start sm:items-center gap-2 rounded-xl bg-[#FFF5F5] border border-[#9E1830]/30 px-3.5 py-2 text-xs text-[#9E1830] font-semibold shadow-2xs">
                    <Package size={14} className="text-[#9E1830] shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      Sold exclusively as a {product.bundleQuantity}-box bundle
                      {product.unitPrice
                        ? ` (₹${Math.round(product.price / (product.bundleQuantity || 1))}/box bundle rate · ₹${product.unitPrice} MRP/box)`
                        : ""}. Individual boxes are not sold separately.
                    </span>
                  </div>
                )}
              </div>

              {/* Specification Tiles */}
              {(() => {
                const specConfig = getProductSpecConfig(product);

                return (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2 sm:gap-3.5 pt-0.5 sm:pt-1">
                {/* Pack Size / Count */}
                <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2.5 sm:p-3.5 flex flex-row min-[420px]:flex-col sm:flex-row items-center gap-2.5 min-[420px]:gap-1.5 sm:gap-3 text-left min-[420px]:text-center sm:text-left shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Package size={16} className="sm:hidden" /><Package size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                      {specConfig.packLabel}
                    </span>
                    <span className="font-brand text-xs sm:text-sm font-bold text-[#111827] uppercase leading-tight block">
                      {product.quantity || "Standard Pack"}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2.5 sm:p-3.5 flex flex-row min-[420px]:flex-col sm:flex-row items-center gap-2.5 min-[420px]:gap-1.5 sm:gap-3 text-left min-[420px]:text-center sm:text-left shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Clock size={16} className="sm:hidden" /><Clock size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                      {specConfig.durationLabel}
                    </span>
                    <span className="font-brand text-xs sm:text-sm font-bold text-[#111827] uppercase leading-tight block">
                      {product.burnTime || specConfig.fallbackDuration}
                    </span>
                  </div>
                </div>

                {/* Size / Dimensions or Formulation */}
                {product.dimensions ? (
                  <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2.5 sm:p-3.5 flex flex-row min-[420px]:flex-col sm:flex-row items-center gap-2.5 min-[420px]:gap-1.5 sm:gap-3 text-left min-[420px]:text-center sm:text-left shadow-2xs hover:border-[#287541]/40 transition-colors">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#EAF5EC] text-[#287541] flex items-center justify-center">
                      <Ruler size={16} className="sm:hidden" /><Ruler size={18} className="hidden sm:block" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                        Size
                      </span>
                      <span className="font-brand text-xs sm:text-sm font-bold text-[#111827] uppercase leading-tight block">
                        {product.dimensions}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2.5 sm:p-3.5 flex flex-row min-[420px]:flex-col sm:flex-row items-center gap-2.5 min-[420px]:gap-1.5 sm:gap-3 text-left min-[420px]:text-center sm:text-left shadow-2xs hover:border-[#287541]/40 transition-colors">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#EAF5EC] text-[#287541] flex items-center justify-center">
                      <Leaf size={16} className="sm:hidden" /><Leaf size={18} className="hidden sm:block" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                        {specConfig.fallbackSpecLabel}
                      </span>
                      <span className="font-brand text-xs sm:text-sm font-bold text-[#111827] uppercase leading-tight block">
                        {specConfig.fallbackSpecValue}
                      </span>
                    </div>
                  </div>
                )}
              </div>
                );
              })()}

              {/* Exact Ingredients */}
              {product.ingredients && (
                <div className="rounded-xl border border-[#EADBBD]/80 bg-[#FAF7EE]/60 px-3.5 py-2.5 text-xs sm:text-sm text-[#3F3A36] leading-relaxed">
                  <span className="font-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#173B3A] mr-2">
                    Ingredients:
                  </span>
                  <span>{product.ingredients}</span>
                </div>
              )}

              {/* What's Inside / Why Choose (Multi-item Kits & Family Packs) */}
              {((product.whatsInside && product.whatsInside.length > 0) || (product.whyChoose && product.whyChoose.length > 0)) && (
                <div className="space-y-3">
                  {product.whatsInside && product.whatsInside.length > 0 && (
                    <div className="rounded-xl border border-[#EADBBD] bg-[#FAF7EE]/60 p-3.5 space-y-2">
                      <h2 className="font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-[#173B3A]">
                        What&apos;s Inside
                      </h2>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A433E]">
                        {product.whatsInside.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="shrink-0 text-[#287541] mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.whyChoose && product.whyChoose.length > 0 && (
                    <div className="rounded-xl border border-[#EADBBD] bg-[#FFF9EE]/60 p-3.5 space-y-2">
                      <h2 className="font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-[#9E1830]">
                        Why Choose
                      </h2>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A433E]">
                        {product.whyChoose.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Sparkles size={14} className="shrink-0 text-[#F47A20] mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Aromatic Notes Container */}
              <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                <span className="font-brand text-[13px] sm:text-sm font-bold uppercase tracking-wider text-[#111827] block">
                  Aromatic Notes
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {(product.fragranceNotes && product.fragranceNotes.length > 0
                    ? product.fragranceNotes
                    : ["Natural Resins", "Essential Oils", "Botanicals"]
                  ).slice(0, 3).map((note, idx) => (
                    <span
                      key={note}
                      title={note}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FAF7EE] border border-[#EADBBD] px-3.5 py-1.5 sm:px-4 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider leading-tight text-center text-[#111827] shadow-2xs hover:border-[#F6C84C] transition-colors"
                    >
                      {idx === 0 ? (
                        <Leaf size={11} className="shrink-0 text-[#287541] sm:h-[13px] sm:w-[13px]" />
                      ) : idx === 1 ? (
                        <Droplets size={11} className="shrink-0 text-[#0284C7] sm:h-[13px] sm:w-[13px]" />
                      ) : (
                        <Sparkles size={11} className="shrink-0 text-[#D97706] sm:h-[13px] sm:w-[13px]" />
                      )}
                      <span className="line-clamp-2 min-w-0 sm:line-clamp-none">{note}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Purchase Controls & Checkout Box */}
              <AddPanel product={product} />

            </div>
          </div>
        </div>

        {/* PRODUCT USE GUIDE */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-border bg-brand-surface-bright p-4 sm:p-9 shadow-xs">
          <div className="grid grid-cols-1 items-center gap-4 sm:gap-8 lg:grid-cols-12">
            <div className="space-y-2 sm:space-y-3 lg:col-span-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary">
                <Sparkles size={13} /> HOW TO USE
              </span>
              <h2 className="font-playfair text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                Make space for a calmer ritual
              </h2>
              <p className="text-sm leading-relaxed text-brand-charcoal/75">
                Follow the steps recommended for {product.name} and enjoy its fragrance safely.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-brand-border bg-white p-1.5 sm:p-2 shadow-sm lg:col-span-8">
              <Image
                src={usageImage}
                alt={`How to use ${product.name}: step-by-step product instructions`}
                width={2170}
                height={724}
                sizes="(max-width: 1023px) 100vw, 900px"
                className="h-auto w-full object-contain"
              />
            </div>
            <ol className="space-y-2 md:hidden">
              {(product.howToUse?.length ? product.howToUse : [
                "Place the product in a stable, heat-safe holder.",
                "Light it carefully and allow the fragrance to spread.",
                "Keep away from children, pets, and flammable materials.",
              ]).slice(0, 4).map((step, index) => (
                <li key={`${index}-${step}`} className="flex items-start gap-2.5 rounded-xl border border-brand-border/70 bg-white p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-brand-charcoal">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── 4. DUAL CARDS: BOTANICAL BENEFITS & NATURAL CARE (PREMIUM REDESIGN) ─── */}
        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          
          {/* Card 1: Sacred Botanical Benefits */}
          <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-white p-5 sm:p-7 shadow-2xs hover:shadow-md hover:border-[#C89B3C]/50 transition-all duration-300">
            {/* Subtle Golden Lotus Watermark in Background */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.06] select-none text-[#C89B3C]">
              <Lotus className="h-44 w-44" />
            </div>

            {/* Header */}
            <div className="relative z-10 space-y-1 pb-4 border-b border-[#EAE1D3]/80">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold tracking-[0.2em] text-brand-primary uppercase">
                <Leaf size={12} className="text-[#C89B3C]" />
                Wellbeing &amp; Purity
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#302923] tracking-tight">
                Sacred Botanical Benefits
              </h3>
            </div>

            {/* 3 Benefit Feature Blocks */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 pt-4">
              {/* Item 1 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-brand-primary flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-brand-primary/50 transition-all">
                  <Leaf size={18} className="text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    100% Natural Ingredients
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Pure plant extracts and essential oils.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-brand-primary flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-brand-primary/50 transition-all">
                  <ShieldCheck size={18} className="text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    Zero Harmful Chemicals
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Safe for family, children and pets.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-brand-primary flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-brand-primary/50 transition-all">
                  <Sparkles size={18} className="text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    Divine Ambience
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Purifies negative energies and restores peace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Preserving Maximum Fragrance */}
          <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-white p-5 sm:p-7 shadow-2xs hover:shadow-md hover:border-[#C89B3C]/50 transition-all duration-300">
            {/* Subtle Golden Lotus Watermark in Background */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.06] select-none text-[#C89B3C]">
              <Lotus className="h-44 w-44" />
            </div>

            {/* Header */}
            <div className="relative z-10 space-y-1 pb-4 border-b border-[#EAE1D3]/80">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold tracking-[0.2em] text-[#C89B3C] uppercase">
                <Sparkles size={12} className="text-[#C89B3C]" />
                Natural Care
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#302923] tracking-tight">
                Preserving Maximum Fragrance
              </h3>
            </div>

            {/* 3 Care Feature Blocks */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 pt-4">
              {/* Item 1 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-[#C89B3C] flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-[#C89B3C] transition-all">
                  <Sun size={18} className="text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    Keep in Shade
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Store in a cool place away from direct sunlight.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-[#C89B3C] flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-[#C89B3C] transition-all">
                  <Droplets size={18} className="text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    Resist Humidity
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Ensure packaging is resealed after each use.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="group/item flex flex-col justify-between rounded-xl p-3 bg-brand-surface-warm/30 hover:bg-[#F5EFE3]/70 border border-[#EAE1D3]/70 transition-all duration-200">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#C89B3C]/35 text-[#C89B3C] flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 group-hover/item:border-[#C89B3C] transition-all">
                  <Lock size={18} className="text-[#C89B3C]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-sans font-bold text-[#302923] leading-snug">
                    Preserve Freshness
                  </h4>
                  <p className="mt-1 text-[11px] font-sans text-stone-600 leading-relaxed">
                    Use within 12 months of opening pack.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ─── 5. RELATED PRODUCTS (SLIDE-BASED UI/UX, NO CONTAINER) ─── */}
        {relatedProducts.length > 0 && (
          <RelatedProductsSlider products={relatedProducts} />
        )}
      </div>
    </InnerPage>
  );
}

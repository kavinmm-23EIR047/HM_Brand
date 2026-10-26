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
import { mapDbProductToProduct, type Product } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
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
    const res = await fetch(`${API}/products?category=${catQuery}&limit=8`, { next: { revalidate: 60 } });
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
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1480px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-8 pb-28 md:pb-8 space-y-5 sm:space-y-12">

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
                </span>

                {Boolean(product.rating && product.reviewCount && product.reviewCount > 0) ? (
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

              {/* Title, Devotional Subtitle & Conditional Bundle Notice */}
              <div className="space-y-1.5 sm:space-y-2.5">
                <h1 className="font-brand text-3xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-wide text-[#173B3A] uppercase">
                  {product.name}
                </h1>

                {/* Devotional Subtitle / Fragrance Note */}
                <p className="font-sans text-sm text-[#5C534E] leading-relaxed font-normal">
                  {product.note && !product.note.toLowerCase().includes("complete bundle") && !product.note.toLowerCase().includes("cannot be purchased")
                    ? product.note
                    : "A sacred fragrance crafted to bring divine peace, positivity and serenity into your home."}
                </p>

                {/* Complete Bundle Info Badge (Rendered ONLY if product is actually a bundle) */}
                {Boolean(
                  (product.bundleQuantity && product.bundleQuantity > 1) ||
                  product.name.toLowerCase().includes("bundle") ||
                  product.note.toLowerCase().includes("bundle pack")
                ) && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#FFF5F5] border border-[#9E1830]/30 px-3.5 py-2 text-xs text-[#9E1830] font-semibold shadow-2xs">
                    <Package size={14} className="text-[#9E1830] shrink-0" />
                    <span>
                      Available as a complete bundle {product.bundleQuantity ? `(${product.bundleQuantity} units)` : ""} · Individual boxes cannot be purchased separately.
                    </span>
                  </div>
                )}
              </div>

              {/* 3 Specification Tiles with Ample Space and No Word Truncation */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3.5 pt-0.5 sm:pt-1">
                {/* Pack Size */}
                <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="mb-1 sm:mb-0 h-7 w-7 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Package size={15} className="sm:hidden" /><Package size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                      Pack Size
                    </span>
                    <span className="font-brand text-[11px] sm:text-sm font-bold text-[#111827] uppercase leading-tight line-clamp-2 block">
                      {product.quantity || "Standard Pack"}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="mb-1 sm:mb-0 h-7 w-7 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Clock size={15} className="sm:hidden" /><Clock size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                      Duration
                    </span>
                    <span className="font-brand text-[11px] sm:text-sm font-bold text-[#111827] uppercase leading-tight line-clamp-2 block">
                      {product.burnTime || (product.category.toLowerCase().includes("camphor") ? "Residue-Free Clean" : "45–50 min/stick")}
                    </span>
                  </div>
                </div>

                {/* Formulation */}
                <div className="min-w-0 rounded-xl sm:rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-2 sm:p-3.5 flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left shadow-2xs hover:border-[#287541]/40 transition-colors">
                  <div className="mb-1 sm:mb-0 h-7 w-7 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#EAF5EC] text-[#287541] flex items-center justify-center">
                    <Leaf size={15} className="sm:hidden" /><Leaf size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider text-[#6B7280] block">
                      Formulation
                    </span>
                    <span className="font-brand text-[11px] sm:text-sm font-bold text-[#111827] uppercase leading-tight line-clamp-2 block">
                      {product.category.toLowerCase().includes("camphor") ? "100% Pure Camphor" : "100% Charcoal-Free"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aromatic Notes Container */}
              <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
                <span className="font-brand text-[13px] sm:text-sm font-bold uppercase tracking-wider text-[#111827] block">
                  Aromatic Notes
                </span>
                <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                  {(product.fragranceNotes && product.fragranceNotes.length > 0
                    ? product.fragranceNotes
                    : ["Natural Resins", "Essential Oils", "Botanicals"]
                  ).slice(0, 3).map((note, idx) => (
                    <span
                      key={note}
                      title={note}
                      className="inline-flex min-w-0 w-full sm:w-auto items-center justify-center gap-1 rounded-full bg-[#FAF7EE] border border-[#EADBBD] px-1.5 py-1.5 sm:gap-1.5 sm:px-4 font-brand text-[10px] min-[390px]:text-[11px] sm:text-sm font-bold uppercase tracking-tight sm:tracking-wider leading-tight text-center text-[#111827] shadow-2xs hover:border-[#F6C84C] transition-colors"
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

        {/* ─── 4. DUAL CARDS: BOTANICAL BENEFITS & NATURAL CARE ─── */}
        <section className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
          
          {/* Left Card: Sacred Botanical Benefits (Mint Gradient + Leaf Motif) */}
          <div className="rounded-2xl sm:rounded-3xl border border-brand-positive-soft bg-gradient-to-br from-brand-surface-soft via-brand-positive-soft to-brand-positive-soft p-4 sm:p-8 relative overflow-hidden shadow-2xs space-y-3 sm:space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-green-dark uppercase mb-1">
                <Leaf size={13} />
                WELLBEING &amp; PURITY
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-brand-ink font-bold tracking-tight">
                Sacred Botanical Benefits
              </h3>
            </div>

            {/* 3 Benefit Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 sm:pt-2">
              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-green-dark/12 text-brand-green-dark flex items-center justify-center">
                  <Leaf size={15} className="sm:hidden" /><Leaf size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  100% natural ingredients
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Pure plant extracts and essential oils.
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-green-dark/12 text-brand-green-dark flex items-center justify-center">
                  <ShieldCheck size={15} className="sm:hidden" /><ShieldCheck size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  Zero harmful chemicals
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Safe for family, children and pets.
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-green-dark/12 text-brand-green-dark flex items-center justify-center">
                  <Sparkles size={15} className="sm:hidden" /><Sparkles size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  Uplifts clarity and divine ambience
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Purifies negative energies and restores peace.
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Preserving Maximum Fragrance (Peach Gradient + Lotus Motif) */}
          <div className="rounded-2xl sm:rounded-3xl border border-brand-surface-warm bg-gradient-to-br from-brand-surface-cream via-brand-surface-cream to-brand-surface-promo p-4 sm:p-8 relative overflow-hidden shadow-2xs space-y-3 sm:space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-primary uppercase mb-1">
                <Sparkles size={13} />
                NATURAL CARE
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-brand-ink font-bold tracking-tight">
                Preserving Maximum Fragrance
              </h3>
            </div>

            {/* 3 Care Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 sm:pt-2">
              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center">
                  <Sun size={15} className="sm:hidden" /><Sun size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  Keep in shade
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Store in a cool, dry place away from direct sunlight and heat.
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center">
                  <Droplets size={15} className="sm:hidden" /><Droplets size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  Resist humidity
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Ensure packaging is resealed after each use.
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center">
                  <Lock size={15} className="sm:hidden" /><Lock size={18} className="hidden sm:block" />
                </div>
                <strong className="text-xs font-bold text-brand-ink block leading-tight">
                  Preserve freshness
                </strong>
                <p className="text-ui-11 text-stone-600 leading-relaxed">
                  Use within 12 months of opening.
                </p>
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

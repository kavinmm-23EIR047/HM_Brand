import React from "react";
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
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { RelatedProductsSlider } from "@/components/related-products-slider";
import { AddPanel } from "@/app/products/[slug]/panel";
import { Lotus } from "@/components/illustrations/Lotus";
import { products, mapDbProductToProduct, type Product } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getProduct(slug: string): Promise<Product | null> {
  // 1. Try the backend API first
  try {
    const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return mapDbProductToProduct(json.data);
    }
  } catch {}
  // 2. Fallback to static array
  return products.find((p) => p.slug === slug) || null;
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  // Try to fetch DB products in the same category
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
  } catch {}
  // Fallback to static related
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 8);
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

  const usageImage = product.category.toLowerCase().includes("camphor")
    ? "/images/camphor-lighting-steps-infographic.png"
    : product.category.toLowerCase().includes("sambrani")
    ? "/images/sambrani-burning-instruction-guide.png"
    : "/images/two-step-incense-lighting-guide.png";

  return (
    <InnerPage
      eyebrow={product.category.toUpperCase()}
      title={product.name}
      subtitle={product.note}
      showHero={false}
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8 space-y-8 sm:space-y-12">

        {/* ─── 1. BREADCRUMB ─── */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-medium text-stone-500">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#9E1830] transition-colors">
            <Home size={13} className="text-stone-400" />
            <span>Home</span>
          </Link>
          <span className="text-stone-300">›</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#9E1830] transition-colors truncate max-w-[120px] sm:max-w-none">
            {product.category}
          </Link>
          <span className="text-stone-300">›</span>
          <span className="font-semibold text-[#173B3A] truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* ─── 2. PRODUCT HERO: DUAL-COLUMN CLEAN FLOW (AS IN MOCKUP) ─── */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">

          {/* ── LEFT: PRODUCT GALLERY & 4 FEATURE TILES ── */}
          <div className="w-full lg:col-span-5">
            <ProductGallery
              images={product.images}
              fallbackImage={product.image}
              productName={product.name}
              badge={product.badge}
            />
          </div>

          {/* ── RIGHT: PRODUCT DETAILS PROPER CONTAINER ── */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-3xl border border-[#EADBBD] bg-white p-5 sm:p-7 lg:p-8 shadow-xs space-y-5 sm:space-y-6">

              {/* Category Pill & 5-Star Reviews Row */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#FAF6EE]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9E1830]/25 bg-[#FFF5F5] px-3.5 py-1 text-xs font-bold text-[#9E1830] shadow-2xs">
                  <Sparkles size={12} className="text-[#9E1830]" />
                  {product.category}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-[#F47A20]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-bold text-[#173B3A]">{product.rating || "4.9"}</span>
                  <span className="text-stone-400">({product.reviewCount || 48} reviews)</span>
                </div>
              </div>

              {/* Title, Subtitle & Bundle Notice */}
              <div className="space-y-2.5">
                <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-[#173B3A]">
                  {product.name}
                </h1>

                {/* Fragrance Note */}
                <p className="font-serif italic text-base sm:text-lg text-[#8C6239] leading-snug">
                  {product.note && !product.note.toLowerCase().includes("complete bundle") && !product.note.toLowerCase().includes("cannot be purchased")
                    ? product.note
                    : "A sacred fragrance crafted to bring divine peace, positivity and serenity into your home."}
                </p>

                {/* Complete Bundle Info Badge (Rendered once, cleanly) */}
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#FFF9EE] border border-[#F6C84C]/60 px-3.5 py-2 text-xs text-[#8C6239] shadow-2xs">
                  <Package size={14} className="text-[#9E1830] shrink-0" />
                  <span className="font-medium">
                    Available as a complete bundle · Individual boxes cannot be purchased separately.
                  </span>
                </div>
              </div>

              {/* 3 Specification Tiles in a Clean Cohesive Container */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
                {/* Pack Size */}
                <div className="rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Package size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 block truncate">
                      Pack Size
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#173B3A] truncate block">
                      {product.quantity || "Budget Pack"}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#9E1830]/40 transition-colors">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FFF5F5] text-[#9E1830] flex items-center justify-center">
                    <Clock size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 block truncate">
                      Duration
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#173B3A] truncate block">
                      {product.burnTime || "45–50 min/stick"}
                    </span>
                  </div>
                </div>

                {/* Formulation */}
                <div className="rounded-2xl border border-[#EADBBD] bg-[#FAF7EE]/70 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#287541]/40 transition-colors">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-[#EAF5EC] text-[#287541] flex items-center justify-center">
                    <Leaf size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 block truncate">
                      Formulation
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#173B3A] truncate block">
                      100% Charcoal-Free
                    </span>
                  </div>
                </div>
              </div>

              {/* Aromatic Notes Container */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#173B3A] block">
                  Aromatic Notes
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {(product.fragranceNotes && product.fragranceNotes.length > 0
                    ? product.fragranceNotes
                    : ["Natural Resins", "Essential Oils", "Botanicals"]
                  ).map((note, idx) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7EE] border border-[#EADBBD] px-3.5 py-1 text-xs font-semibold text-[#8C6239] shadow-2xs hover:border-[#F6C84C] transition-colors"
                    >
                      {idx === 0 ? (
                        <Leaf size={12} className="text-[#8C6239]" />
                      ) : idx === 1 ? (
                        <Droplets size={12} className="text-[#8C6239]" />
                      ) : (
                        <Sparkles size={12} className="text-[#8C6239]" />
                      )}
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Purchase Controls & Checkout Box */}
              <AddPanel product={product} />

            </div>
          </div>
        </div>

        {/* ─── 3. THE SACRED RITUAL (WITH AUTHENTIC VISUAL GUIDE ILLUSTRATION) ─── */}
        <section className="rounded-3xl border border-[#EADBBD] bg-gradient-to-br from-[#FFFDF8] via-[#FFFBF2] to-[#FFF6E5] p-6 sm:p-9 shadow-xs relative overflow-hidden">
          {/* Subtle floral watermark in top right */}
          <div className="absolute top-2 right-2 pointer-events-none opacity-10">
            <Lotus className="w-44 h-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#9E1830] uppercase">
                <Sparkles size={13} className="text-[#9E1830]" />
                THE SACRED RITUAL
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-[#173B3A] font-bold tracking-tight">
                Kindling Peace with {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#52625A] leading-relaxed font-sans">
                Lighting incense is an ancient Vedic practice of cleansing the air, centering the mind, and inviting divine grace into every corner of your sanctuary.
              </p>
            </div>

            {/* Right: The authentic illustrated ritual guide infographic */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="w-full overflow-hidden rounded-2xl border border-[#EADBBD]/80 bg-white/80 backdrop-blur-xs p-2 sm:p-4 shadow-2xs">
                <img
                  src={usageImage}
                  alt={`Sacred usage ritual guide for ${product.name}`}
                  className="w-full h-auto object-contain rounded-xl mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. DUAL CARDS: BOTANICAL BENEFITS & NATURAL CARE ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Card: Sacred Botanical Benefits (Mint Gradient + Leaf Motif) */}
          <div className="rounded-3xl border border-[#CFE4D6] bg-gradient-to-br from-[#F4FAF5] via-[#EDF7F0] to-[#E3F2E7] p-6 sm:p-8 relative overflow-hidden shadow-2xs space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#287541] uppercase mb-1">
                <Leaf size={13} />
                WELLBEING &amp; PURITY
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-[#173B3A] font-bold tracking-tight">
                Sacred Botanical Benefits
              </h3>
            </div>

            {/* 3 Benefit Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#287541]/12 text-[#287541] flex items-center justify-center">
                  <Leaf size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  100% natural ingredients
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Pure plant extracts and essential oils.
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#287541]/12 text-[#287541] flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  Zero harmful chemicals
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Safe for family, children and pets.
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#287541]/12 text-[#287541] flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  Uplifts clarity and divine ambience
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Purifies negative energies and restores peace.
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Preserving Maximum Fragrance (Peach Gradient + Lotus Motif) */}
          <div className="rounded-3xl border border-[#F2D7C7] bg-gradient-to-br from-[#FFF8F3] via-[#FDF3EB] to-[#FCEAE0] p-6 sm:p-8 relative overflow-hidden shadow-2xs space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#9E1830] uppercase mb-1">
                <Sparkles size={13} />
                NATURAL CARE
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-[#173B3A] font-bold tracking-tight">
                Preserving Maximum Fragrance
              </h3>
            </div>

            {/* 3 Care Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#9E1830]/12 text-[#9E1830] flex items-center justify-center">
                  <Sun size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  Keep in shade
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Store in a cool, dry place away from direct sunlight and heat.
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#9E1830]/12 text-[#9E1830] flex items-center justify-center">
                  <Droplets size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  Resist humidity
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Ensure packaging is resealed after each use.
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-9 w-9 rounded-full bg-[#9E1830]/12 text-[#9E1830] flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <strong className="text-xs font-bold text-[#173B3A] block leading-tight">
                  Preserve freshness
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
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

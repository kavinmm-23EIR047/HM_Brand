import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Package,
  Clock,
  Leaf,
  Flame,
  Sun,
  Droplets,
  Wind,
  Lock,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { AddPanel } from "@/app/products/[slug]/panel";
import { MascotAgarbatti, MascotDiya, MascotMeditate } from "@/components/mascot-art";
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
    const res = await fetch(`${API}/products?category=${catQuery}&limit=4`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data
          .filter((p: any) => p.slug !== product.slug)
          .slice(0, 3)
          .map(mapDbProductToProduct);
      }
    }
  } catch {}
  // Fallback to static related
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
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

  const discountPercent =
    product.mrp && product.price
      ? Math.max(
          0,
          Math.round(
            ((parseFloat(product.mrp.replace(/[^0-9.]/g, "")) - product.price) /
              parseFloat(product.mrp.replace(/[^0-9.]/g, ""))) *
              100
          )
        )
      : 0;

  const MascotComponent =
    product.category === "Camphor" || product.category === "Sambrani"
      ? MascotDiya
      : product.category === "Dhoop" || product.category === "Special Collections"
      ? MascotMeditate
      : MascotAgarbatti;

  // Category-specific usage image
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
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* ─── BREADCRUMB ─── */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#748078]">
          <Link href="/" className="hover:text-[#9E1830] transition-colors">Home</Link>
          <span className="text-[#C89B3C]">›</span>
          <Link href="/shop" className="hover:text-[#9E1830] transition-colors">Shop</Link>
          <span className="text-[#C89B3C]">›</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#9E1830] transition-colors">{product.category}</Link>
          <span className="text-[#C89B3C]">›</span>
          <span className="font-bold text-[#9E1830]">{product.name}</span>
        </nav>
        {/* ─── PRODUCT HERO GRID ─── */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">

          {/* ── LEFT: PRODUCT GALLERY & TRUST BADGES ── */}
          <div className="relative flex min-w-0 flex-col lg:col-span-5">
            <ProductGallery
              images={product.images}
              fallbackImage={product.image}
              productName={product.name}
              badge={product.badge}
            />

            {/* Clean inline trust line under image */}
            <div className="mt-4 flex w-full items-center justify-center gap-4 text-xs font-medium text-[#748078]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#2D6A4F]" />
                Charcoal-Free
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#F47A20]" />
                Handcrafted
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <Leaf size={14} className="text-[#3F7D45]" />
                Pure Resins
              </span>
            </div>
          </div>

          {/* ── RIGHT: PRODUCT DETAILS ── */}
          <div className="min-w-0 space-y-5 lg:col-span-7 lg:max-w-[640px]">

            {/* Category Eyebrow & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase">
                {product.category}
              </span>

              <div className="flex items-center gap-2">
                <div className="flex text-[#F47A20]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#173B3A]">{product.rating}</span>
                <span className="text-xs text-stone-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight text-[#173B3A]">
              {product.name}
            </h1>

            {/* Editorial Product Description */}
            <p className="text-base leading-relaxed text-[#52625A] font-sans">
              {product.description}
            </p>

            {/* ── CLEAN SPECIFICATIONS (Unboxed minimal format) ── */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-y border-stone-200/80 text-xs text-[#173B3A]">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-[#9E1830]" />
                <span>Pack Size: <strong className="font-semibold">{product.quantity}</strong></span>
              </div>

              {product.burnTime ? (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#9E1830]" />
                  <span>Burning Duration: <strong className="font-semibold">{product.burnTime}</strong></span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wind size={14} className="text-[#9E1830]" />
                  <span>Aroma: <strong className="font-semibold">Calm & Uplifting</strong></span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#9E1830]" />
                <span>Soot: <strong className="font-semibold">Zero Charcoal</strong></span>
              </div>
            </div>

            {/* ── FRAGRANCE NOTES ── */}
            {product.fragranceNotes && product.fragranceNotes.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-[#173B3A] tracking-wider uppercase block">
                  Aromatic Notes
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.fragranceNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1.5 bg-[#FAF3E0] text-[#6B4226] text-xs font-medium px-3 py-1 rounded-full"
                    >
                      <Sparkles size={11} className="text-[#F47A20]" />
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Add to Cart & Buy Now Panel */}
            <AddPanel product={product} />

          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SACRED USAGE RITUAL (Clean Editorial Format)
            ════════════════════════════════════════════════════ */}
        <section className="mt-20 pt-16 border-t border-stone-200/80">
          <div className="max-w-3xl mb-12">
            <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-2">
              THE SACRED RITUAL
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl text-[#173B3A] font-bold tracking-tight">
              Kindling Peace with {product.name}
            </h2>
            <p className="mt-3 text-base text-[#52625A] leading-relaxed">
              Lighting incense is an ancient Vedic practice of cleansing the air, centering the mind, and inviting divine grace into every corner of your sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Steps in clean unboxed layout */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {product.howToUse.map((step, i) => (
                <div key={i} className="space-y-2">
                  <span className="font-playfair text-2xl font-bold text-[#9E1830] block">
                    0{i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-[#173B3A] tracking-wide">
                    Step {i + 1}
                  </h3>
                  <p className="text-sm text-[#52625A] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual preview */}
            <div className="lg:col-span-4">
              <img
                src={usageImage}
                alt={`Sacred usage ritual for ${product.name}`}
                className="w-full h-auto rounded-3xl object-contain bg-[#FAF3E0]/50 p-4"
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            BENEFITS & PRESERVATION (Clean Open Layout)
            ════════════════════════════════════════════════════ */}
        <section className="mt-20 pt-16 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {/* Sacred Benefits */}
          <div className="space-y-6">
            <div>
              <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-1">
                WELLBEING & PURITY
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-[#173B3A] font-bold tracking-tight">
                Sacred Botanical Benefits
              </h3>
              <p className="mt-2 text-sm text-[#52625A] leading-relaxed">
                Handcrafted using pure temple herbs, natural essential oils, and unadulterated botanical resins.
              </p>
            </div>

            <ul className="space-y-4">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#2D6A4F] mt-2 shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-[#173B3A] block">{b}</span>
                    <p className="text-xs text-[#718078] leading-relaxed mt-0.5">
                      {i === 0
                        ? "100% natural composition honoring traditional Ayurvedic practices."
                        : i === 1
                        ? "Safe for daily indoor use around elders, children, and pets."
                        : "Purifies negative energies and restores tranquil mindfulness."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Preservation & Storage */}
          <div className="space-y-6">
            <div>
              <span className="font-space text-xs font-bold tracking-widest text-[#9E1830] uppercase block mb-1">
                NATURAL CARE
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl text-[#173B3A] font-bold tracking-tight">
                Preserving Maximum Fragrance
              </h3>
              <p className="mt-2 text-sm text-[#52625A] leading-relaxed">
                Because our incense and camphor are made from pure essential oils without artificial chemical fixatives, mindful storage ensures their aroma remains rich for months.
              </p>
            </div>

            <div className="space-y-4 text-sm text-[#52625A]">
              <div className="flex items-start gap-3">
                <Sun size={16} className="text-[#F47A20] mt-0.5 shrink-0" />
                <p>
                  <strong className="text-[#173B3A] font-semibold">Keep in shade:</strong> Store in a cool, dry place away from direct sunlight and heat radiators.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Droplets size={16} className="text-[#4C7FA8] mt-0.5 shrink-0" />
                <p>
                  <strong className="text-[#173B3A] font-semibold">Resist humidity:</strong> Ensure the packaging or container is resealed after each prayer to lock in aromatic oils.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Lock size={16} className="text-[#9E1830] mt-0.5 shrink-0" />
                <p>
                  <strong className="text-[#173B3A] font-semibold">Preserve freshness:</strong> Use within 12 months of opening to enjoy peak botanical fragrance intensity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            RELATED PRODUCTS
            ════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-[#C89B3C]/30">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-2xl sm:text-3xl text-[#173b3a] font-bold">
                Complete Your Sacred Altar
              </h3>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#9E1830] hover:text-[#6B4226] transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </InnerPage>
  );
}

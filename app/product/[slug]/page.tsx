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

            {/* Trust strip under image */}
            <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#C89B3C]/20 px-4 py-3 shadow-sm text-[10px] sm:text-xs font-semibold text-[#6B4226]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#2D6A4F]" />
                Charcoal-Free
              </span>
              <span className="w-px h-4 bg-[#C89B3C]/30" />
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#E85D04]" />
                Handcrafted
              </span>
              <span className="w-px h-4 bg-[#C89B3C]/30" />
              <span className="flex items-center gap-1.5">
                <Leaf size={14} className="text-[#588157]" />
                Pure Resins
              </span>
            </div>
          </div>

          {/* ── RIGHT: PRODUCT DETAILS ── */}
          <div className="min-w-0 space-y-4 lg:col-span-7 lg:max-w-[660px] lg:space-y-3.5">

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="#F47A20" stroke="#F47A20" />
                ))}
              </div>
              <span className="text-sm font-extrabold text-[#173b3a]">{product.rating}</span>
              <span className="text-xs text-[#718078] font-medium">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Product Name */}
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-[-.03em] text-[#173b3a] sm:text-4xl lg:text-[40px]">
              {product.name}
            </h1>

            {/* Price & Discount */}
            <div className="mt-2 flex items-baseline gap-3">
              {product.price > 0 ? (
                <span className="text-3xl font-extrabold text-[#a90c35]">₹{product.price}</span>
              ) : (
                <span className="text-2xl font-extrabold text-[#a90c35]">
                  {product.subCategory?.toLowerCase().includes("exclusive") ? "Exclusive Edition" : "Price on Request"}
                </span>
              )}
              {product.mrp && product.mrp !== `₹${product.price}` && (
                <span className="text-base text-[#292524]/50 line-through">{product.mrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-[#e1edcf] px-2.5 py-1 text-xs font-extrabold text-[#286b45]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Product-Specific Coupon Offer Banner */}
            {product.couponCode && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#E85D04] bg-[#FFF8E7] p-3 sm:p-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E85D04]/10 text-[#E85D04]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#173B3A]">
                      Special Sacred Discount Available!
                    </p>
                    <p className="text-[11px] text-[#52625A]">
                      Use coupon code <span className="font-mono font-black text-[#9E1830] bg-[#FFF0D0] px-1.5 py-0.5 rounded border border-[#C89B3C]/50">{product.couponCode}</span> for extra discount on this item at checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="max-w-2xl text-sm leading-6 text-[#52625a]">
              {product.description}
            </p>

            {/* ── KEY SPECS ROW (with circular icons, like reference) ── */}
            <div className="grid max-w-xl grid-cols-2 gap-2.5 pt-0.5">
              <div className="flex min-h-[64px] min-w-0 items-center gap-2.5 rounded-xl border border-[#C89B3C]/25 bg-[#FFF8E7] p-3 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4D35E]/30 text-[#6B4226]">
                  <Package size={16} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#173b3a] block leading-tight">{product.quantity}</span>
                  <span className="text-[10px] text-[#718078] font-medium">Pack Size</span>
                </div>
              </div>




              {product.burnTime ? (
                <div className="flex min-h-[64px] min-w-0 items-center gap-2.5 rounded-xl border border-[#C89B3C]/25 bg-[#FFF8E7] p-3 shadow-xs">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4D35E]/30 text-[#6B4226]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#173b3a] block leading-tight">{product.burnTime}</span>
                    <span className="text-[10px] text-[#718078] font-medium">Burning Time</span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[64px] min-w-0 items-center gap-2.5 rounded-xl border border-[#C89B3C]/25 bg-[#FFF8E7] p-3 shadow-xs">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4D35E]/30 text-[#6B4226]">
                    <Wind size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold leading-tight text-[#173b3a]">Calm &amp; uplifting</span>
                    <span className="text-[10px] font-medium text-[#718078]">A spiritual experience</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── FRAGRANCE NOTES ── */}
            {product.fragranceNotes && product.fragranceNotes.length > 0 && (
              <div className="pt-0.5">
                <span className="text-xs font-bold text-[#6B4226] uppercase tracking-widest block mb-2.5">
                  Fragrance Notes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.fragranceNotes.map((note, i) => {
                    const icons = [Droplets, Flame, Leaf];
                    const NoteIcon = icons[i % icons.length];
                    return (
                      <span
                        key={note}
                        className="inline-flex items-center gap-1.5 bg-white border border-[#C89B3C]/40 text-[#6B4226] text-xs font-semibold pl-2.5 pr-3.5 py-2 rounded-full shadow-xs hover:bg-[#FFF8E7] transition-colors"
                      >
                        <NoteIcon size={13} className="text-[#E85D04]" />
                        {note}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Add to Cart & Buy Now Panel — includes price, quantity, coupon, buttons */}
            <AddPanel product={product} />

          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SACRED USAGE GUIDE  
            ════════════════════════════════════════════════════ */}
        <section className="mt-20 overflow-hidden rounded-[28px] border border-[#C89B3C]/25 bg-gradient-to-br from-[#faf5e8] via-[#f8f0df] to-[#f0e6c8] shadow-lg">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            {/* Left: Mascot / decorative visual */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-[#6B4226]/5 to-[#C89B3C]/10 p-6 sm:p-8 lg:col-span-4 lg:p-6 xl:p-8">
              <div className="relative max-w-full">
                <div className="absolute -inset-4 rounded-full bg-[#F4D35E]/15 blur-2xl" />
                <div className="relative rounded-3xl border-2 border-[#C89B3C]/30 bg-white/80 p-5 shadow-md backdrop-blur-sm sm:p-7">
                  <MascotComponent size={180} className="max-w-full" />
                </div>
              </div>
            </div>

            {/* Right: Steps */}
            <div className="min-w-0 space-y-5 p-6 sm:p-8 lg:col-span-8 lg:p-8 xl:p-10">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#9E1830] tracking-[.2em] uppercase mb-3">
                  <span className="w-6 h-px bg-[#9E1830]" />
                  Sacred Usage Guide
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#6B4226] font-bold leading-tight">
                  How to Use {product.name}
                </h2>
                <p className="mt-2 text-sm text-[#52625a] max-w-lg">
                  Brings purity, positivity and a divine aura to your space.
                </p>
              </div>

              {/* Numbered steps */}
              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 sm:gap-4">
                {product.howToUse.map((step, i) => (
                  <div key={i} className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#C89B3C]/20 bg-white/70 p-3 shadow-xs backdrop-blur-sm sm:gap-4 sm:p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E85D04] text-sm font-extrabold text-white shadow-md sm:h-10 sm:w-10">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-[#173b3a] block mb-1">
                        Step {i + 1}
                      </span>
                      <p className="text-xs text-[#52625a] leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Usage image */}
              <div className="pt-1">
                <img
                  src={usageImage}
                  alt={`Sacred usage guide for ${product.name}`}
                  className="mx-auto block h-auto w-full rounded-2xl border border-[#C89B3C]/30 bg-white/50 object-contain shadow-sm lg:mx-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            BENEFITS & PACKAGING CARE  
            ════════════════════════════════════════════════════ */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sacred Benefits */}
          <div className="rounded-[24px] bg-white border border-[#e8e0d0] p-7 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display text-2xl text-[#173b3a] font-bold mb-2">
              Sacred Benefits
            </h3>
            <p className="text-xs text-[#718078] mb-5">
              A symbol of purity and positivity, used in homes, temples and spiritual practices.
            </p>
            <ul className="space-y-4 font-sans text-sm text-[#292524]/85">
              {product.benefits.map((b, i) => {
                const benefitIcons = [Leaf, ShieldCheck, Sun];
                const BIcon = benefitIcons[i % benefitIcons.length];
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] mt-0.5">
                      <BIcon size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-[#173b3a] block text-sm">{b}</span>
                      <span className="text-[11px] text-[#718078]">
                        {i === 0 ? "Pure and ethically sourced ingredients." :
                         i === 1 ? "Safe for indoor use." :
                         "Creates a calm and positive environment."}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Auspicious Packaging & Care */}
          <div className="rounded-[24px] bg-white border border-[#e8e0d0] p-7 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-display text-2xl text-[#173b3a] font-bold mb-2">
              Auspicious Packaging & Care
            </h3>
            <p className="text-xs text-[#718078] mb-5">
              Store in a cool, dry place away from direct sunlight. To preserve maximum fragrance intensity, keep the package sealed after daily use.
            </p>

            {/* Product image + care tips layout */}
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              {/* Product image in packaging card */}
              <div className="flex items-center justify-center rounded-2xl bg-[#faf5e8] border border-[#C89B3C]/20 p-4 min-h-[180px]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`${product.name} packaging`}
                    className="max-h-[150px] w-auto object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="text-center text-[#6B4226]">
                    <span className="text-5xl block">📦</span>
                    <span className="text-xs font-semibold mt-2 block">{product.name}</span>
                  </div>
                )}
              </div>

              {/* Care tips */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4D35E]/25 text-[#6B4226]">
                    <Sun size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#52625a] leading-tight">Keep away from<br/>direct sunlight</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4D35E]/25 text-[#6B4226]">
                    <Droplets size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#52625a] leading-tight">Store in a cool,<br/>dry place</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4D35E]/25 text-[#6B4226]">
                    <Lock size={14} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#52625a] leading-tight">Keep the package<br/>sealed</span>
                </div>
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

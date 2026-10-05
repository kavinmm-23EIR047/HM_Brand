import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, Sparkles, Truck, Heart, ArrowRight, CheckCircle2, Tag } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
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

  return (
    <InnerPage
      eyebrow={product.category.toUpperCase()}
      title={product.name}
      subtitle={product.note}
      showHero={false}
    >
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#748078]">
          <Link href="/" className="hover:text-[#a90c35]">Home</Link><span>/</span>
          <Link href="/shop" className="hover:text-[#a90c35]">Shop</Link><span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#a90c35]">{product.category}</Link><span>/</span>
          <span className="text-[#a90c35]">{product.name}</span>
        </nav>
        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Gallery Image Card */}
          <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-[#f8f0df] p-4 sm:min-h-[440px] sm:rounded-[28px] sm:p-8 lg:col-span-5">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#E85D04] text-[#FFF8E7] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                {product.badge}
              </span>
            )}

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[400px] w-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-center text-[#6B4226] py-12">
                <span className="text-7xl block mb-4">🪔</span>
                <span className="font-display text-2xl font-bold block text-[#6B4226]">
                  {product.name}
                </span>
                <p className="text-xs text-[#292524]/60 mt-1 font-sans">
                  Authentic HM Brand Formulation
                </p>
              </div>
            )}

            <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-[#C89B3C]/30 pt-4 text-[9px] font-semibold text-[#6B4226] sm:text-xs">
              <span>✦ Charcoal-Free</span>
              <span>✦ Coimbatore Made</span>
              <span>✦ Pure Resins</span>
            </div>
          </div>

          {/* Right Product Overview & Add to Cart */}
          <div className="space-y-5 lg:col-span-7">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-[#f47a20]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-[#173b3a]">{product.rating}</span>
                <span className="text-xs text-[#718078]">({product.reviewCount} customer reviews)</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-[1.08] tracking-[-.04em] text-[#173b3a] sm:text-4xl lg:text-[42px]">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#a90c35]">₹{product.price}</span>
                {product.mrp && (
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
                      <Tag size={18} />
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
            </div>

            <p className="text-sm leading-relaxed text-[#52625a] sm:text-base">
              {product.description}
            </p>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#F4D35E]/20 p-3 rounded-lg border border-[#C89B3C]/30">
                <span className="text-[10px] font-bold text-[#6B4226]/70 uppercase block">Packaging</span>
                <span className="text-xs font-bold text-[#6B4226]">{product.quantity}</span>
              </div>
              {product.burnTime && (
                <div className="bg-[#F4D35E]/20 p-3 rounded-lg border border-[#C89B3C]/30">
                  <span className="text-[10px] font-bold text-[#6B4226]/70 uppercase block">Burn Duration</span>
                  <span className="text-xs font-bold text-[#6B4226]">{product.burnTime}</span>
                </div>
              )}
              <div className="bg-[#F4D35E]/20 p-3 rounded-lg border border-[#C89B3C]/30">
                <span className="text-[10px] font-bold text-[#6B4226]/70 uppercase block">Ritual Essence</span>
                <span className="text-xs font-bold text-[#6B4226]">Calm • Pure • Uplifting</span>
              </div>
            </div>

            {/* Fragrance Notes */}
            {product.fragranceNotes && product.fragranceNotes.length > 0 && (
              <div>
                <span className="text-xs font-bold text-[#6B4226] uppercase tracking-wider block mb-2">
                  Fragrance Notes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.fragranceNotes.map((note) => (
                    <span
                      key={note}
                      className="bg-[#FFF8E7] border border-[#C89B3C] text-[#6B4226] text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Add to Cart & Buy Now Panel */}
            <AddPanel product={product} />
          </div>
        </div>

        {/* ========================================================
            ILLUSTRATED "HOW TO USE" RITUAL WITH MASCOT
            ======================================================== */}
        <section className="mt-16 bg-[#F4D35E]/15 rounded-2xl border-2 border-[#6B4226] p-8 sm:p-10 shadow-solid-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#C89B3C] shadow-sm">
                <MascotComponent size={180} />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B23A48] tracking-widest uppercase">
                <Sparkles size={14} />
                <span>Sacred Usage Guide</span>
              </div>
              <h2 className="font-display text-3xl text-[#6B4226] font-bold">
                How to Use {product.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {product.howToUse.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFF8E7] p-4 rounded-xl border border-[#C89B3C]/50 flex gap-3"
                  >
                    <span className="font-display text-lg font-bold text-[#E85D04]">
                      0{idx + 1}
                    </span>
                    <p className="text-xs text-[#292524]/80 leading-relaxed font-sans">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BENEFITS & INGREDIENTS
            ======================================================== */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FFF8E7] p-7 rounded-xl border-2 border-[#C89B3C]/40">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold mb-4">
              Sacred Benefits
            </h3>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-[#292524]/80">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#588157] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFF8E7] p-7 rounded-xl border-2 border-[#C89B3C]/40">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold mb-4">
              Auspicious Packaging & Care
            </h3>
            <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans mb-4">
              Store in a cool, dry place away from direct sunlight. To preserve maximum fragrance intensity, keep the package sealed after daily use.
            </p>
            <div className="p-3 bg-[#F4D35E]/20 rounded-lg border border-[#C89B3C]/30 text-xs text-[#6B4226] font-semibold">
              Packed with love and traditional Vedic mantras in Coimbatore.
            </div>
          </div>
        </section>

        {/* ========================================================
            RELATED PRODUCTS
            ======================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#C89B3C]/40">
            <h3 className="font-display text-3xl text-[#6B4226] font-bold mb-8">
              Complete Your Sacred Altar
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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


import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, Sparkles, Truck, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import { AddPanel } from "@/app/products/[slug]/panel";
import { MascotAgarbatti, MascotDiya, MascotMeditate } from "@/components/mascot-art";
import { products, type Product } from "@/lib/products";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

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
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Gallery Image Card */}
          <div className="lg:col-span-5 bg-[#FFF8E7] rounded-2xl border-2 border-[#C89B3C] p-8 shadow-solid-md flex flex-col items-center justify-center min-h-[440px] relative">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#E85D04] text-[#FFF8E7] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded">
                {product.badge}
              </span>
            )}

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-xl"
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

            <div className="w-full mt-6 pt-4 border-t border-[#C89B3C]/30 flex items-center justify-between text-xs font-semibold text-[#6B4226]">
              <span>✦ Charcoal-Free</span>
              <span>✦ Coimbatore Made</span>
              <span>✦ Pure Resins</span>
            </div>
          </div>

          {/* Right Product Overview & Add to Cart */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-[#E85D04]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="font-bold text-xs text-[#6B4226]">{product.rating}</span>
                <span className="text-xs text-[#292524]/50">({product.reviewCount} customer reviews)</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl text-[#6B4226] font-bold leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#E85D04]">₹{product.price}</span>
                {product.mrp && (
                  <span className="text-base text-[#292524]/50 line-through">{product.mrp}</span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#588157] text-[#FFF8E7] text-xs font-bold px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#292524]/80 leading-relaxed font-sans">
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
                <span className="text-[10px] font-bold text-[#6B4226]/70 uppercase block">Origin</span>
                <span className="text-xs font-bold text-[#6B4226]">Coimbatore, TN</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

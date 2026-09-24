import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { ProductCard } from "@/components/product-card";
import {
  MascotAgarbatti,
  MascotDiya,
  MascotBasket,
  MascotMeditate,
} from "@/components/mascot-art";
import { products, categories } from "@/lib/products";

const categoryRituals: Record<
  string,
  {
    title: string;
    description: string;
    mascotType: "agarbatti" | "diya" | "meditate" | "basket";
    steps: { num: string; title: string; desc: string }[];
  }
> = {
  agarbatti: {
    title: "Agarbatti & Sacred Flora",
    description:
      "Hand-rolled masala and floral incense sticks made with pure sandalwood, halmaddi, and dried flower petals for deep devotion and peaceful rooms.",
    mascotType: "agarbatti",
    steps: [
      {
        num: "01",
        title: "Prepare Your Stand",
        desc: "Place the agarbatti securely in a ceramic or brass incense stand away from drafts.",
      },
      {
        num: "02",
        title: "Light the Tip",
        desc: "Ignite the coated end with a gentle flame for 5–10 seconds until an ember forms.",
      },
      {
        num: "03",
        title: "Gently Blow Out",
        desc: "Gently blow out the flame. The crimson ember will begin releasing sacred aroma.",
      },
      {
        num: "04",
        title: "Enjoy the Fragrance",
        desc: "Let the soothing natural smoke diffuse throughout your prayer space and home.",
      },
    ],
  },
  camphor: {
    title: "Pure Bhimseni Camphor",
    description:
      "Untainted crystalline raw Bhimseni camphor that burns completely without residue, clearing negative vibrations and sanctifying aartis.",
    mascotType: "diya",
    steps: [
      {
        num: "01",
        title: "Place in Aarti Thali",
        desc: "Place a few crystalline chunks into a brass camphor burner or center of your puja plate.",
      },
      {
        num: "02",
        title: "Ignite the Chunk",
        desc: "Light with a clean matchstick. Observe the pure, bright white flame with zero soot.",
      },
      {
        num: "03",
        title: "Offer the Aarti",
        desc: "Present the camphor aarti in a gentle clockwise circle before the deities.",
      },
      {
        num: "04",
        title: "Circulate Energy",
        desc: "Wave the fragrant warmth gently around your family and sanctum.",
      },
    ],
  },
  sambrani: {
    title: "Temple Cup Sambrani",
    description:
      "Wild Paal Sambrani and pure benzoin packed into mess-free herbal cups, recreating the ancient sanctum aroma of South Indian temples.",
    mascotType: "diya",
    steps: [
      {
        num: "01",
        title: "Set on Fireproof Stand",
        desc: "Place the enclosed fiber or ceramic holder on a heat-resistant surface.",
      },
      {
        num: "02",
        title: "Light the Cup Rim",
        desc: "Tilt the cup and hold a match to the top circular rim until it glows red.",
      },
      {
        num: "03",
        title: "Blow Out Flame",
        desc: "Blow out the active flame, allowing the dense Paal Sambrani smoke to billow.",
      },
      {
        num: "04",
        title: "Purify All Corners",
        desc: "Carry the stand carefully to every room to cleanse dampness and stagnant air.",
      },
    ],
  },
  loban: {
    title: "Sacred Kesar Loban",
    description:
      "Natural Boswellia tree resins infused with saffron essence and holy herbs for prosperity, positivity, and evening worship.",
    mascotType: "meditate",
    steps: [
      {
        num: "01",
        title: "Choose Coal or Cone",
        desc: "Prepare a hot coconut shell ember or use our ready-to-burn dhoop cones.",
      },
      {
        num: "02",
        title: "Sprinkle Golden Crystals",
        desc: "Gently sprinkle a pinch of loban resin onto the hot charcoal surface.",
      },
      {
        num: "03",
        title: "Cover with Dhoopdhani",
        desc: "Close the brass dhoop burner with perforated lid to disperse the smoke evenly.",
      },
      {
        num: "04",
        title: "Dusk Purification",
        desc: "Perform this ritual every evening at Sandhya (twilight) for divine blessings.",
      },
    ],
  },
  dhoop: {
    title: "Chandan & Herbal Dhoop",
    description:
      "Bamboo-free pure sandalwood paste cones and sticks crafted for uninterrupted meditation, pranayama, and sacred homams.",
    mascotType: "meditate",
    steps: [
      {
        num: "01",
        title: "Position on Tile",
        desc: "Set the cone base flat on the provided ceramic tile.",
      },
      {
        num: "02",
        title: "Ignite the Cone Apex",
        desc: "Light the pointed tip for 15 seconds until the whole apex glows.",
      },
      {
        num: "03",
        title: "Extinguish Flame",
        desc: "Blow out the flame and let the dense sandalwood fragrance diffuse.",
      },
      {
        num: "04",
        title: "Deep Japa & Chant",
        desc: "Begin your daily japa or mantra recitation surrounded by pure chandan.",
      },
    ],
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = slug.toLowerCase();
  const categoryName = decodedSlug.replaceAll("-", " ");

  const matchingProducts = products.filter(
    (p) =>
      p.category.toLowerCase().replaceAll(" ", "-") === decodedSlug ||
      p.category.toLowerCase() === categoryName
  );

  const ritualData = categoryRituals[decodedSlug] || {
    title: categoryName.replace(/\b\w/g, (x) => x.toUpperCase()),
    description: `Explore our handcrafted ${categoryName} collection, formulated with authentic botanicals in Coimbatore for meaningful moments of devotion.`,
    mascotType: "agarbatti" as const,
    steps: [
      {
        num: "01",
        title: "Prepare Your Space",
        desc: "Clear your prayer altar and set your sacred intent.",
      },
      {
        num: "02",
        title: "Light Safely",
        desc: "Ignite carefully on heat-safe surfaces away from flammable objects.",
      },
      {
        num: "03",
        title: "Offer with Devotion",
        desc: "Offer before your Ishta Devata during your morning or evening ritual.",
      },
      {
        num: "04",
        title: "Enjoy Inner Calm",
        desc: "Let the pure aroma envelop your senses and still your mind.",
      },
    ],
  };

  const MascotComponent =
    ritualData.mascotType === "diya"
      ? MascotDiya
      : ritualData.mascotType === "meditate"
      ? MascotMeditate
      : ritualData.mascotType === "basket"
      ? MascotBasket
      : MascotAgarbatti;

  return (
    <InnerPage
      eyebrow="SACRED CATEGORY"
      title={ritualData.title}
      subtitle={ritualData.description}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Hero / How to Use Section */}
        <section className="bg-[#F4D35E]/20 p-8 sm:p-10 rounded-2xl border-2 border-[#6B4226] mb-14 shadow-solid-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#C89B3C] shadow-solid-sm">
              <MascotComponent size={200} />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B23A48] tracking-widest uppercase">
              <Sparkles size={14} />
              <span>How to Use • A Simple Sacred Ritual</span>
            </div>
            <h2 className="font-display text-3xl text-[#6B4226] font-bold">
              Bringing Sacred Harmony Into Your Home
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {ritualData.steps.map((s) => (
                <div
                  key={s.num}
                  className="bg-[#FFF8E7] p-4 rounded-xl border border-[#C89B3C]/50 flex gap-3"
                >
                  <span className="font-display text-xl font-bold text-[#E85D04]">
                    {s.num}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-[#6B4226]">
                      {s.title}
                    </h4>
                    <p className="text-xs text-[#292524]/75 mt-0.5 leading-relaxed font-sans">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products in this category */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl text-[#6B4226] font-bold">
                Available {ritualData.title}
              </h2>
              <p className="text-xs text-[#292524]/60 mt-1">
                Showing {matchingProducts.length} authentic items
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(matchingProducts.length > 0 ? matchingProducts : products.slice(0, 6)).map(
              (p) => (
                <ProductCard key={p.slug} product={p} />
              )
            )}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mt-16 pt-10 border-t border-[#C89B3C]/40">
          <h3 className="font-display text-2xl text-[#6B4226] font-bold mb-6">
            Explore Other Sacred Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => {
              const cSlug = c.toLowerCase().replaceAll(" ", "-");
              if (cSlug === decodedSlug) return null;
              return (
                <Link
                  key={c}
                  href={`/category/${cSlug}`}
                  className="btn-outline-earth px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>{c}</span>
                  <ArrowRight size={12} />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </InnerPage>
  );
}

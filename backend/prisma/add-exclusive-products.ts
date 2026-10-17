import prisma from '../src/shared/database/prisma';

const EXCLUSIVE_PRODUCTS = [
  {
    name: "Cardamom",
    slug: "cardamom",
    sku: "HM-EX-CARDAMOM",
    description: "HM Exclusive Cardamom Agarbatti is infused with pure green cardamom essence and herbal extracts. Renowned for its uplifting sweet-spicy aroma that cleanses the surroundings and brings warmth to holy prayers.",
    shortDescription: "Exclusive Series · Green Cardamom Essence",
    displayOrder: 1,
  },
  {
    name: "Fancy Flora",
    slug: "fancy-flora",
    sku: "HM-EX-FANCY-FLORA",
    description: "HM Exclusive Fancy Flora Agarbatti is handcrafted with a bouquet of sacred temple blooms and fragrant botanicals, evoking a festive and devotional atmosphere ideal for morning and evening worship.",
    shortDescription: "Exclusive Series · Temple Floral Bouquet",
    displayOrder: 2,
  },
  {
    name: "Karpoor Loban",
    slug: "karpoor-loban",
    sku: "HM-EX-KARPOOR-LOBAN",
    description: "HM Exclusive Karpoor Loban Agarbatti combines the purifying vibrancy of Bhimseni camphor with sacred benzoin loban resin, clearing negative vibrations and creating divine peace.",
    shortDescription: "Exclusive Series · Camphor & Loban Resin",
    displayOrder: 3,
  },
  {
    name: "Kasturi",
    slug: "kasturi",
    sku: "HM-EX-KASTURI",
    description: "HM Exclusive Kasturi Agarbatti captures the mythical, deep earthy aroma of sacred musk herbs and rare forest woods, deeply revered for meditation and inner focus.",
    shortDescription: "Exclusive Series · Sacred Herbal Kasturi",
    displayOrder: 4,
  },
  {
    name: "Kesar Loban",
    slug: "kesar-loban",
    sku: "HM-EX-KESAR-LOBAN",
    description: "HM Exclusive Kesar Loban Agarbatti marries the royal opulence of saffron (kesar) with purifying loban resin, offering a sanctified fragrance fit for deity offerings.",
    shortDescription: "Exclusive Series · Royal Saffron & Loban",
    displayOrder: 5,
  },
  {
    name: "Pancha Rudhra",
    slug: "pancha-rudhra",
    sku: "HM-EX-PANCHA-RUDHRA",
    description: "HM Exclusive Pancha Rudhra Agarbatti is an auspicious Pancha formulation of five sacred Vedic herbs and temple woods dedicated to Lord Shiva's divine peace and supreme blessings.",
    shortDescription: "Exclusive Series · Five Sacred Vedic Herbs",
    displayOrder: 6,
  },
  {
    name: "Real Stone",
    slug: "real-stone",
    sku: "HM-EX-REAL-STONE",
    description: "HM Exclusive Real Stone Agarbatti is crafted with earth minerals and natural stone-extracted resins, radiating a long-lasting serene earthy grounding note for home sanctity.",
    shortDescription: "Exclusive Series · Earth Mineral & Resin",
    displayOrder: 7,
  },
];

async function main() {
  console.log("Looking up Agarbatti and Exclusive category IDs...");
  const agarbattiCat = await prisma.category.findUnique({ where: { slug: "agarbatti" } });
  if (!agarbattiCat) {
    throw new Error("Agarbatti category not found");
  }

  const exclusiveSubcat = await prisma.category.findUnique({ where: { slug: "exclusive" } });
  if (!exclusiveSubcat) {
    throw new Error("Exclusive subcategory not found");
  }

  console.log(`Agarbatti ID: ${agarbattiCat.id}, Exclusive Subcat ID: ${exclusiveSubcat.id}`);

  for (const item of EXCLUSIVE_PRODUCTS) {
    // Check if exists
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Product "${item.name}" already exists (${existing.id}), updating...`);
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          sku: item.sku,
          description: item.description,
          shortDescription: item.shortDescription,
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: exclusiveSubcat.id,
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
        },
      });
      // Ensure ProductCategory relationship
      const rel = await prisma.productCategory.findFirst({
        where: { productId: existing.id, categoryId: agarbattiCat.id },
      });
      if (!rel) {
        await prisma.productCategory.create({
          data: { productId: existing.id, categoryId: agarbattiCat.id },
        });
      }
    } else {
      console.log(`Creating product "${item.name}"...`);
      const created = await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          description: item.description,
          shortDescription: item.shortDescription,
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: exclusiveSubcat.id,
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
          categories: {
            create: [{ categoryId: agarbattiCat.id }],
          },
          // Image: Leave empty (no product_images records)
        },
      });
      console.log(`Created "${created.name}" with ID: ${created.id}`);
    }
  }

  console.log("All 7 Exclusive products have been saved successfully to the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

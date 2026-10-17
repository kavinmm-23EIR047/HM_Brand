import prisma from '../src/shared/database/prisma';

const CAMPHOR_PRODUCTS = [
  {
    name: "Camphor — ₹12",
    slug: "camphor-12",
    sku: "HM-CAMPHOR-12",
    price: 12,
    mrp: 12,
    shortDescription: "₹12 Pack · Pure Sacred Camphor",
    description: "Pure devotional camphor tablets for auspicious daily puja rituals, aarti, and purifying sacred atmosphere without black residue.",
    displayOrder: 1,
  },
  {
    name: "Camphor — ₹55",
    slug: "camphor-55",
    sku: "HM-CAMPHOR-55",
    price: 55,
    mrp: 55,
    shortDescription: "₹55 Pack · Pure Sacred Camphor",
    description: "Pure devotional camphor tablets for auspicious daily puja rituals, aarti, and purifying sacred atmosphere without black residue.",
    displayOrder: 2,
  },
  {
    name: "Camphor — ₹85",
    slug: "camphor-85",
    sku: "HM-CAMPHOR-85",
    price: 85,
    mrp: 85,
    shortDescription: "₹85 Economy Pack · Pure Sacred Camphor",
    description: "Pure devotional camphor tablets for auspicious daily puja rituals, aarti, and purifying sacred atmosphere without black residue.",
    displayOrder: 3,
  },
  {
    name: "Pacha Karpoor — ₹55",
    slug: "pacha-karpoor-55",
    sku: "HM-PACHA-KARPOOR-55",
    price: 55,
    mrp: 55,
    shortDescription: "₹55 Pack · Pure Bhimseni Pacha Karpoor",
    description: "Natural crystalline Pacha Karpoor (Bhimseni green camphor) revered for temple prasad, Ayurvedic healing, and divine tranquil fragrance.",
    displayOrder: 4,
  },
  {
    name: "Pacha Karpoor — ₹185",
    slug: "pacha-karpoor-185",
    sku: "HM-PACHA-KARPOOR-185",
    price: 185,
    mrp: 185,
    shortDescription: "₹185 Economy Jar · Pure Bhimseni Pacha Karpoor",
    description: "Natural crystalline Pacha Karpoor (Bhimseni green camphor) revered for temple prasad, Ayurvedic healing, and divine tranquil fragrance.",
    displayOrder: 5,
  },
  {
    name: "Karppor dani machine",
    slug: "karppor-dani-machine",
    sku: "HM-KARPPOR-DANI-MACHINE",
    price: 0,
    mrp: 0,
    shortDescription: "Electric Diffuser · Price on Request",
    description: "Premium Kapoor Dani electric burner and aroma diffuser for diffusing camphor and sacred resins evenly throughout your home.",
    displayOrder: 6,
  },
];

async function main() {
  console.log("Looking up Camphor category...");
  const camphorCat = await prisma.category.findUnique({ where: { slug: "camphor" } });
  if (!camphorCat) {
    throw new Error("Camphor category not found");
  }

  console.log(`Found Camphor Category: ID = ${camphorCat.id}, Name = "${camphorCat.name}"`);

  for (const item of CAMPHOR_PRODUCTS) {
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
          price: item.price,
          mrp: item.mrp,
          stockQuantity: 100,
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
        },
      });
      const rel = await prisma.productCategory.findFirst({
        where: { productId: existing.id, categoryId: camphorCat.id },
      });
      if (!rel) {
        await prisma.productCategory.create({
          data: { productId: existing.id, categoryId: camphorCat.id },
        });
      }
    } else {
      console.log(`Creating product "${item.name}" (${item.slug})...`);
      const created = await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          description: item.description,
          shortDescription: item.shortDescription,
          price: item.price,
          mrp: item.mrp,
          stockQuantity: 100,
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
          categories: {
            create: [{ categoryId: camphorCat.id }],
          },
          // Images: leave empty
        },
      });
      console.log(`Created "${created.name}" with ID: ${created.id}`);
    }
  }

  console.log("All 6 Camphor products have been successfully stored in the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

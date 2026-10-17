import prisma from '../src/shared/database/prisma';

const DHOOP_PRODUCTS = [
  {
    name: "Indian Bakhoor",
    slug: "indian-bakhoor",
    sku: "HM-DHOOP-INDIAN-BAKHOOR",
    price: 0,
    mrp: 0,
    shortDescription: "Bamboo-less Dhoop · Price on Request",
    description: "Handcrafted traditional Indian Bakhoor bamboo-less dhoop stick with deep oriental exotic notes, sacred resins, and woody warmth.",
    displayOrder: 1,
  },
  {
    name: "Italian Mehak",
    slug: "italian-mehak",
    sku: "HM-DHOOP-ITALIAN-MEHAK",
    price: 0,
    mrp: 0,
    shortDescription: "Bamboo-less Dhoop · Price on Request",
    description: "Exquisite Italian Mehak bamboo-less dhoop stick infused with fine floral and Mediterranean aromatic extracts for meditation and serene ambiance.",
    displayOrder: 2,
  },
];

const FAMILY_PACK_PRODUCTS = [
  {
    name: "4 in 1 Loban",
    slug: "4-in-1-loban",
    sku: "HM-FP-4-IN-1-LOBAN",
    price: 0,
    mrp: 0,
    shortDescription: "Family Pack · Price on Request",
    description: "Value family pack featuring 4 auspicious Loban fragrance variants for continuous daily home purification and sacred rituals.",
    displayOrder: 1,
  },
  {
    name: "10 in 1 Family Pack",
    slug: "10-in-1-family-pack",
    sku: "HM-FP-10-IN-1-FAMILY-PACK",
    price: 0,
    mrp: 0,
    shortDescription: "Family Pack · Price on Request",
    description: "Grand multi-fragrance 10-in-1 family collection containing 10 divine traditional aromas to bless every day of the week and festive gatherings.",
    displayOrder: 2,
  },
];

async function main() {
  console.log("Looking up Dhoop Stick and Family Pack categories...");
  const dhoopCat = await prisma.category.findUnique({ where: { slug: "dhoop-stick-bamboo-less-stick" } });
  if (!dhoopCat) {
    throw new Error("Dhoop Stick category not found");
  }

  const familyCat = await prisma.category.findUnique({ where: { slug: "family-pack" } });
  if (!familyCat) {
    throw new Error("Family Pack category not found");
  }

  console.log(`Dhoop Stick Category ID: ${dhoopCat.id}, Family Pack Category ID: ${familyCat.id}`);

  // Insert Dhoop Stick Products
  for (const item of DHOOP_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Product "${item.name}" already exists, updating...`);
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
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
        },
      });
      const rel = await prisma.productCategory.findFirst({
        where: { productId: existing.id, categoryId: dhoopCat.id },
      });
      if (!rel) {
        await prisma.productCategory.create({
          data: { productId: existing.id, categoryId: dhoopCat.id },
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
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
          categories: {
            create: [{ categoryId: dhoopCat.id }],
          },
          // Images: leave empty
        },
      });
      console.log(`Created "${created.name}" with ID: ${created.id}`);
    }
  }

  // Insert Family Pack Products
  for (const item of FAMILY_PACK_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Product "${item.name}" already exists, updating...`);
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
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
        },
      });
      const rel = await prisma.productCategory.findFirst({
        where: { productId: existing.id, categoryId: familyCat.id },
      });
      if (!rel) {
        await prisma.productCategory.create({
          data: { productId: existing.id, categoryId: familyCat.id },
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
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: null, // Subcategory: None
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
          categories: {
            create: [{ categoryId: familyCat.id }],
          },
          // Images: leave empty
        },
      });
      console.log(`Created "${created.name}" with ID: ${created.id}`);
    }
  }

  console.log("All Dhoop Stick and Family Pack products successfully added to the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

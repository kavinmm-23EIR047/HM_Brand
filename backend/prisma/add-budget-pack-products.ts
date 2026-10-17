import prisma from '../src/shared/database/prisma';

const BUDGET_PACK_PRODUCTS = [
  {
    name: "Ecstasy",
    slug: "ecstasy-budget-pack",
    sku: "HM-BP-ECSTASY",
    displayOrder: 1,
  },
  {
    name: "Fantasy",
    slug: "fantasy-budget-pack",
    sku: "HM-BP-FANTASY",
    displayOrder: 2,
  },
  {
    name: "Glory",
    slug: "glory-budget-pack",
    sku: "HM-BP-GLORY",
    displayOrder: 3,
  },
  {
    name: "Jasmine",
    slug: "jasmine-budget-pack",
    sku: "HM-BP-JASMINE",
    displayOrder: 4,
  },
  {
    name: "Kewda",
    slug: "kewda-budget-pack",
    sku: "HM-BP-KEWDA",
    displayOrder: 5,
  },
  {
    name: "Lavender",
    slug: "lavender-budget-pack",
    sku: "HM-BP-LAVENDER",
    displayOrder: 6,
  },
  {
    name: "Loban Super",
    slug: "loban-super-budget-pack",
    sku: "HM-BP-LOBAN-SUPER",
    displayOrder: 7,
  },
  {
    name: "Pineapple",
    slug: "pineapple-budget-pack",
    sku: "HM-BP-PINEAPPLE",
    displayOrder: 8,
  },
  {
    name: "Rose",
    slug: "rose-budget-pack",
    sku: "HM-BP-ROSE",
    displayOrder: 9,
  },
  {
    name: "Sandal Wood",
    slug: "sandal-wood-budget-pack",
    sku: "HM-BP-SANDAL-WOOD",
    displayOrder: 10,
  },
];

const DESCRIPTION = "Available for purchase only as a complete bundle. Individual boxes cannot be purchased separately.";
const SHORT_DESC = "Budget Pack · Complete Bundle Only";

async function main() {
  console.log("Looking up Agarbatti category and Budget Pack subcategory...");
  const agarbattiCat = await prisma.category.findUnique({ where: { slug: "agarbatti" } });
  if (!agarbattiCat) {
    throw new Error("Agarbatti category not found");
  }

  const budgetPackSubcat = await prisma.category.findUnique({ where: { slug: "budget-pack" } });
  if (!budgetPackSubcat) {
    throw new Error("Budget Pack subcategory not found");
  }

  console.log(`Agarbatti ID: ${agarbattiCat.id}, Budget Pack ID: ${budgetPackSubcat.id}`);

  for (const item of BUDGET_PACK_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Product "${item.name}" already exists (${existing.id}), updating...`);
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          sku: item.sku,
          description: DESCRIPTION,
          shortDescription: SHORT_DESC,
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: budgetPackSubcat.id,
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
        },
      });
      const rel = await prisma.productCategory.findFirst({
        where: { productId: existing.id, categoryId: agarbattiCat.id },
      });
      if (!rel) {
        await prisma.productCategory.create({
          data: { productId: existing.id, categoryId: agarbattiCat.id },
        });
      }
    } else {
      console.log(`Creating product "${item.name}" (${item.slug})...`);
      const created = await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          description: DESCRIPTION,
          shortDescription: SHORT_DESC,
          price: 0,
          mrp: 0,
          stockQuantity: 100,
          subcategoryId: budgetPackSubcat.id,
          isActive: true,
          isFeatured: true,
          displayOrder: item.displayOrder,
          categories: {
            create: [{ categoryId: agarbattiCat.id }],
          },
          // Images: leave empty
        },
      });
      console.log(`Created "${created.name}" with ID: ${created.id}`);
    }
  }

  console.log("All 10 Budget Pack products have been successfully stored in the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

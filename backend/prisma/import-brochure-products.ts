import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  subCategories?: CategoryInput[];
}

interface BrochureProduct {
  sku: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  quantity: string;
  description?: string;
  categorySlugs: string[];
}

function flattenCategories(categories: CategoryInput[]) {
  const rows: Array<CategoryInput & { displayOrder: number }> = [];
  const visit = (category: CategoryInput, order: number, parentOrder?: number) => {
    const displayOrder = parentOrder === undefined
      ? (category.displayOrder ?? order)
      : parentOrder * 10 + (category.displayOrder ?? order);
    rows.push({ ...category, displayOrder });
    category.subCategories?.forEach((child, index) => visit(child, index + 1, displayOrder));
  };
  categories.forEach((category, index) => visit(category, index + 1));
  return rows;
}

async function importBrochureProducts() {
  const categories: CategoryInput[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf-8'),
  );
  const catalog = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'brochure-products.json'), 'utf-8'),
  ) as { products: BrochureProduct[] };
  const categoryRows = flattenCategories(categories);

  console.log(`Syncing ${categoryRows.length} categories...`);
  await Promise.all(categoryRows.map((category) => prisma.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      description: category.description ?? null,
      displayOrder: category.displayOrder,
      isActive: category.isActive !== false,
      deletedAt: null,
    },
    create: {
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
      displayOrder: category.displayOrder,
      isActive: category.isActive !== false,
    },
  })));

  const savedCategories = await prisma.category.findMany({
    where: { slug: { in: categoryRows.map((category) => category.slug) } },
  });
  const categoryIds = new Map(savedCategories.map((category) => [category.slug, category.id]));
  const productCategoryIds = catalog.products.map((product) => product.categorySlugs.map((slug) => {
    const id = categoryIds.get(slug);
    if (!id) throw new Error(`Unknown category slug "${slug}" for product "${product.name}"`);
    return id;
  }));

  console.log(`Upserting ${catalog.products.length} products...`);
  const savedProducts = await Promise.all(catalog.products.map(async (product, index) => {
    const leafSlug = product.categorySlugs[product.categorySlugs.length - 1];
    const leaf = categoryRows.find((category) => category.slug === leafSlug);
    const shortDescription = `${product.quantity} · ${leaf?.name ?? 'Brochure product'}`;
    const description = product.description
      ?? `${product.name} as listed in the HM brochure. MRP ₹${product.mrp}; quantity ${product.quantity}.`;

    return prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description,
        shortDescription,
        price: product.price,
        mrp: product.mrp,
        isActive: true,
        isFeatured: false,
        displayOrder: index + 1,
        deletedAt: null,
      },
      create: {
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        description,
        shortDescription,
        price: product.price,
        mrp: product.mrp,
        stockQuantity: 0,
        isActive: true,
        isFeatured: false,
        displayOrder: index + 1,
      },
      select: { id: true, name: true },
    });
  }));

  const productIds = savedProducts.map((product) => product.id);
  await prisma.productCategory.deleteMany({ where: { productId: { in: productIds } } });
  await prisma.productCategory.createMany({
    data: savedProducts.flatMap((product, index) =>
      productCategoryIds[index].map((categoryId) => ({ productId: product.id, categoryId })),
    ),
    skipDuplicates: true,
  });

  const currentSlugs = catalog.products.map((product) => product.slug);
  const removedProducts = await prisma.product.deleteMany({
    where: { slug: { notIn: currentSlugs } },
  });
  const removedCategories = await prisma.category.deleteMany({
    where: { slug: { notIn: categoryRows.map((category) => category.slug) } },
  });

  const verifiedProducts = await prisma.product.findMany({
    where: {},
    select: { slug: true, categories: { select: { category: { select: { name: true } } } } },
  });
  if (verifiedProducts.length !== catalog.products.length) {
    throw new Error(`Expected ${catalog.products.length} products after import; found ${verifiedProducts.length}`);
  }
  const counts = new Map<string, number>();
  for (const product of verifiedProducts) {
    for (const link of product.categories) {
      const categoryName = link.category.name;
      counts.set(categoryName, (counts.get(categoryName) ?? 0) + 1);
    }
  }

  console.log(`Imported and verified ${verifiedProducts.length} products; removed ${removedProducts.count} old products and ${removedCategories.count} obsolete categories.`);
  console.log(`Category links: ${Array.from(counts.entries()).map(([name, count]) => `${name}: ${count}`).join('; ')}`);
}

importBrochureProducts()
  .catch((error) => {
    console.error('Failed to import brochure products:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

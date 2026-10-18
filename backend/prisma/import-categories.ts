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

async function importCategories() {
  const jsonPath = path.join(__dirname, 'categories.json');
  const categories: CategoryInput[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  let syncedCount = 0;

  const syncCategory = async (category: CategoryInput, order: number, parentOrder?: number) => {
    const displayOrder = parentOrder === undefined
      ? (category.displayOrder ?? order)
      : parentOrder * 10 + (category.displayOrder ?? order);

    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description ?? null,
        displayOrder,
        isActive: category.isActive !== false,
        deletedAt: null,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
        displayOrder,
        isActive: category.isActive !== false,
      },
    });
    syncedCount++;

    for (let index = 0; index < (category.subCategories?.length ?? 0); index++) {
      await syncCategory(category.subCategories![index], index + 1, displayOrder);
    }
  };

  for (let index = 0; index < categories.length; index++) {
    await syncCategory(categories[index], index + 1);
  }

  console.log(`Synced ${syncedCount} brochure categories. Existing categories and product assignments were preserved.`);
}

importCategories()
  .catch((error) => {
    console.error('Failed to import categories:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

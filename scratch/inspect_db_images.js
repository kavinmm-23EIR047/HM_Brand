const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes(':5432')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(':5432', ':6543');
}

const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function inspectImages() {
  console.log('--- PRODUCT IMAGES IN DB ---');
  const images = await prisma.productImage.findMany({
    include: { product: true }
  });
  images.forEach(img => {
    console.log(`Product: ${img.product?.name} (Slug: ${img.product?.slug})`);
    console.log(`  ID: ${img.id}`);
    console.log(`  URL: ${img.url}`);
    console.log(`  StorageKey: ${img.storageKey}`);
  });

  console.log('\n--- CATEGORY IMAGES IN DB ---');
  const categories = await prisma.category.findMany();
  categories.forEach(c => {
    console.log(`Category: ${c.name} (Slug: ${c.slug})`);
    console.log(`  ImageUrl: ${c.imageUrl}`);
    console.log(`  StorageKey: ${c.storageKey}`);
  });

  console.log('\n--- BANNERS IN DB ---');
  const banners = await prisma.banner.findMany();
  banners.forEach(b => {
    console.log(`Banner: ${b.title}`);
    console.log(`  DesktopImage: ${b.desktopImage}`);
    console.log(`  StorageKey: ${b.storageKey}`);
  });

  await prisma.$disconnect();
}

inspectImages().catch(console.error);

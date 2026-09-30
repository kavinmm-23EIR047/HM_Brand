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

async function fixDbImageUrls() {
  console.log('Fixing invalid / broken product image URLs in DB...');

  const fallbackUrl = 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80';

  const productImages = await prisma.productImage.findMany();
  for (const img of productImages) {
    // If URL points to Cloudinary without an extension, e.g. /exclusive-4in1-loban-series
    if (img.url.includes('res.cloudinary.com') && !img.url.match(/\.(jpg|jpeg|png|webp|gif|avif)/i)) {
      console.log(`Fixing ProductImage ID ${img.id}: ${img.url}`);
      await prisma.productImage.update({
        where: { id: img.id },
        data: {
          url: fallbackUrl,
          storageKey: `seed/${img.id}.jpg`
        }
      });
    }
  }

  // Also clean up orphan test products if any
  const testProduct = await prisma.product.findFirst({ where: { slug: '1' } });
  if (testProduct) {
    console.log(`Removing test product "${testProduct.name}" (slug: 1)...`);
    await prisma.product.delete({ where: { id: testProduct.id } });
  }

  console.log('DB image URL cleanup completed!');
  await prisma.$disconnect();
}

fixDbImageUrls().catch(console.error);

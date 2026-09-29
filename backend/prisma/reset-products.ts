import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting all existing products...');

  // Delete in correct order to respect FK constraints
  await prisma.productCategory.deleteMany({});
  await prisma.productImage.deleteMany({});
  // Delete order items referencing products first
  try { await (prisma as any).orderItem.deleteMany({}); } catch {}
  await prisma.product.deleteMany({});

  console.log('✅ All products removed.');

  // Fetch category IDs
  const cats = await prisma.category.findMany({ where: { deletedAt: null } });
  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c.id;

  console.log('📁 Available categories:', Object.keys(catMap));

  const products = [
    // ── CAMPHOR ──────────────────────────────────────────────────────────
    {
      sku: 'HM-CAMP-001',
      name: 'HM Super Series Camphor',
      slug: 'hm-super-series-camphor',
      description: 'Premium HM Super Series camphor tablets, ideal for daily aartis, puja rituals and home purification. 50 GMS pack.',
      shortDescription: '50 GMS · Premium Camphor',
      price: 162,
      mrp: 180,
      stockQuantity: 200,
      isFeatured: true,
      displayOrder: 1,
      categorySlug: 'bhimseni-camphor',
      unit: '50 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-CAMP-002',
      name: 'Bhimseni Camphor',
      slug: 'bhimseni-camphor-15g',
      description: 'Pure naturally sourced Bhimseni camphor. 15 GMS convenient pocket pack — perfect for pooja and travel.',
      shortDescription: '15 GMS · Natural Bhimseni',
      price: 50,
      mrp: 55,
      stockQuantity: 300,
      isFeatured: true,
      displayOrder: 2,
      categorySlug: 'bhimseni-camphor',
      unit: '15 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-CAMP-003',
      name: 'Camphor Tablets',
      slug: 'camphor-tablets-80nos',
      description: 'Pack of 80 pure camphor tablets. Long lasting burn, clean white smoke — ideal for aartis & purification.',
      shortDescription: '80 NOS · Camphor Tablets',
      price: 78,
      mrp: 85,
      stockQuantity: 250,
      isFeatured: false,
      displayOrder: 3,
      categorySlug: 'bhimseni-camphor',
      unit: '80 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-CAMP-004',
      name: 'Camphor Tablets Small',
      slug: 'camphor-tablets-50nos',
      description: 'Compact pack of 50 camphor tablets. Slow burning, minimal residue. Great for temples and home shrines.',
      shortDescription: '50 NOS · Camphor Tablets',
      price: 50,
      mrp: 55,
      stockQuantity: 300,
      isFeatured: false,
      displayOrder: 4,
      categorySlug: 'bhimseni-camphor',
      unit: '50 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-CAMP-005',
      name: 'Pure Camphor Rounds',
      slug: 'pure-camphor-rounds',
      description: '16 round pure camphor discs. Easy to use, burns cleanly and completely for home and temple use.',
      shortDescription: '16 NOS · Pure Round Camphor',
      price: 11,
      mrp: 12,
      stockQuantity: 500,
      isFeatured: false,
      displayOrder: 5,
      categorySlug: 'bhimseni-camphor',
      unit: '16 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    },
    // ── DHOOP STICKS ────────────────────────────────────────────────────
    {
      sku: 'HM-DHOOP-006',
      name: 'HM Super Series Dhoop Stick – 6 Flavours',
      slug: 'hm-dhoop-stick-6-flavours',
      description: 'Premium charcoal-free dhoop sticks in 6 divine fragrances: Rose, Glory, Lavender, Sandalwood, Guggal and Loban. 100 GMS pack.',
      shortDescription: '6 Flavours · 100 GMS Dhoop Stick',
      price: 68,
      mrp: 75,
      stockQuantity: 150,
      isFeatured: true,
      displayOrder: 6,
      categorySlug: 'loban-dhoop',
      unit: '100 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-DHOOP-007',
      name: 'HM Super Series Dhoop Stick – 10 Flavours',
      slug: 'hm-dhoop-stick-10-flavours',
      description: 'Mega pack dhoop sticks in 10 exotic fragrances: Rose, Pineapple, Sandal, Glory, Fantasy, Jasmine, Lavender, Ecstasy, Kewda and Loban. 150 GMS.',
      shortDescription: '10 Flavours · 150 GMS Dhoop Stick',
      price: 108,
      mrp: 120,
      stockQuantity: 120,
      isFeatured: true,
      displayOrder: 7,
      categorySlug: 'loban-dhoop',
      unit: '150 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
    },
    // ── SAMBRANI ─────────────────────────────────────────────────────────
    {
      sku: 'HM-SAM-008',
      name: 'Exclusive Cardamom Sambrani',
      slug: 'exclusive-cardamom-sambrani',
      description: 'Premium Sambrani cups infused with the warm, sweet aroma of pure cardamom. 65 pieces for divine purification.',
      shortDescription: '65 NOS · Cardamom Sambrani',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 8,
      categorySlug: 'sambrani',
      unit: '65 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-009',
      name: 'Kasturi Sambrani',
      slug: 'kasturi-sambrani',
      description: 'Traditional Kasturi musk-infused sambrani cups. Calming, rich and sacred fragrance for daily prayers. 50 pieces.',
      shortDescription: '50 NOS · Kasturi Sambrani',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 9,
      categorySlug: 'sambrani',
      unit: '50 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-010',
      name: 'Karpoor Loban Sambrani',
      slug: 'karpoor-loban-sambrani',
      description: 'Dual blend of camphor & loban for powerful room purification and positive energy. 50 cups.',
      shortDescription: '50 NOS · Karpoor + Loban',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 10,
      categorySlug: 'sambrani',
      unit: '50 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-011',
      name: 'Kesar Loban Sambrani',
      slug: 'kesar-loban-sambrani',
      description: 'Premium blend of saffron (kesar) and loban resin in convenient cups. Luxurious sacred aroma for temples & homes. 50 cups.',
      shortDescription: '50 NOS · Kesar + Loban',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 11,
      categorySlug: 'sambrani',
      unit: '50 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-012',
      name: 'Pancha Rudhra Sambrani',
      slug: 'pancha-rudhra-sambrani',
      description: 'Sacred 5-ingredient Pancha Rudhra blend sambrani cups for powerful Shiva worship and home purification. 65 cups.',
      shortDescription: '65 NOS · Pancha Rudhra',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: true,
      displayOrder: 12,
      categorySlug: 'sambrani',
      unit: '65 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-013',
      name: 'Real Stone Sambrani',
      slug: 'real-stone-sambrani',
      description: 'Premium natural stone resin sambrani cups with earthy, grounding fragrance. Long slow burn, no chemicals. 65 cups.',
      shortDescription: '65 NOS · Real Stone Resin',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 13,
      categorySlug: 'sambrani',
      unit: '65 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-014',
      name: 'Fancy Flora Sambrani',
      slug: 'fancy-flora-sambrani',
      description: 'Floral blend sambrani cups with notes of jasmine, rose and parijata. Elegant fragrance for home and pooja. 65 cups.',
      shortDescription: '65 NOS · Fancy Flora',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: false,
      displayOrder: 14,
      categorySlug: 'sambrani',
      unit: '65 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-015',
      name: 'Cup Sambrani – 250 GMS',
      slug: 'cup-sambrani-250gms',
      description: 'Large economy pack of premium natural Cup Sambrani. 250 GMS of pure aromatic resin cups — ideal for daily use.',
      shortDescription: '250 GMS · Cup Sambrani Bulk',
      price: 162,
      mrp: 180,
      stockQuantity: 100,
      isFeatured: true,
      displayOrder: 15,
      categorySlug: 'sambrani',
      unit: '250 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
      sku: 'HM-SAM-016',
      name: 'Cup Sambrani – 15 NOS',
      slug: 'cup-sambrani-15nos',
      description: 'Convenient 15-cup sambrani pack. Easy to carry, slow burning, perfect for pooja rooms and travel.',
      shortDescription: '15 NOS · Cup Sambrani',
      price: 112,
      mrp: 125,
      stockQuantity: 200,
      isFeatured: false,
      displayOrder: 16,
      categorySlug: 'sambrani',
      unit: '15 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    // ── AGARBATTI ───────────────────────────────────────────────────────
    {
      sku: 'HM-AGB-017',
      name: 'Mehak Italian Agarbatti',
      slug: 'mehak-italian-agarbatti',
      description: 'Exotic Italian-inspired fragrance blend in premium handcrafted agarbatti sticks. Sophisticated aroma for modern homes. 55 GMS.',
      shortDescription: '55 GMS · Mehak Italian Aroma',
      price: 108,
      mrp: 120,
      stockQuantity: 180,
      isFeatured: true,
      displayOrder: 17,
      categorySlug: 'agarbatti-flora',
      unit: '55 GMS',
      imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
    },
    // ── LOBAN ───────────────────────────────────────────────────────────
    {
      sku: 'HM-LOB-018',
      name: 'Exclusive 4-in-1 Loban Series',
      slug: 'exclusive-4in1-loban-series',
      description: 'Four powerful loban variants in one premium pack — purifying, grounding and deeply sacred. 65 pieces for extended use.',
      shortDescription: '65 NOS · 4-in-1 Loban Blend',
      price: 100,
      mrp: 110,
      stockQuantity: 150,
      isFeatured: true,
      displayOrder: 18,
      categorySlug: 'loban-dhoop',
      unit: '65 NOS',
      imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=600&q=80',
    },
  ];

  let created = 0;
  for (const prod of products) {
    const { categorySlug, unit, imageUrl, ...prodData } = prod;
    const categoryId = catMap[categorySlug];

    const createdProd = await prisma.product.create({
      data: {
        ...prodData,
        images: {
          create: [
            {
              url: imageUrl,
              storageKey: `seed/${prod.sku.toLowerCase()}.jpg`,
              altText: prod.name,
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
        ...(categoryId
          ? {
              categories: {
                create: [{ categoryId }],
              },
            }
          : {}),
      },
    });

    created++;
    console.log(`✅ [${created}/18] Created: ${createdProd.name}`);
  }

  console.log(`\n🎉 Done! ${created} products seeded into the database.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

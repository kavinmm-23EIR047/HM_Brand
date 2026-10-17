const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    name: 'Agarbatti',
    slug: 'agarbatti',
    description: 'Traditional handcrafted divine fragrance agarbatti incense sticks',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Camphor',
    slug: 'camphor',
    description: '100% Pure divine camphor tablets and bhimseni camphor for sacred aartis and rituals',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Dhoop Stick / Bamboo-less Stick',
    slug: 'dhoop-stick-bamboo-less-stick',
    description: 'Eco-friendly pure bamboo-less dhoop sticks with long-lasting sacred aroma',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Incense Cones',
    slug: 'incense-cones',
    description: 'Natural aromatic incense cones for meditation, prayer, and relaxation',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Havan Cups',
    slug: 'havan-cups',
    description: 'Pure sambrani and herbal resin havan cups for auspicious homams and home purification',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Sambrani Powder',
    slug: 'sambrani-powder',
    description: 'Traditional aromatic sambrani powder resin for sacred dhoop and cleansing rituals',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'Pooja Essentials',
    slug: 'pooja-essentials',
    description: 'Authentic daily prayer essentials and spiritual temple offerings',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Exquisite festive fragrance and prayer gift boxes for special occasions',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'Family Pack',
    slug: 'family-pack',
    description: 'Value family economy packs of premium agarbatti and prayer items',
    displayOrder: 9,
    isActive: true,
  },
];

async function main() {
  console.log('🌱 Starting category addition as Admin...\n');

  // 1. Locate Admin User
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    throw new Error('No admin user found in database!');
  }
  console.log(`👤 Operating as Admin: ${admin.fullName} (${admin.email}) [ID: ${admin.id}]\n`);

  // 2. Insert or Upsert the 9 Categories
  const createdCategories = [];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
        deletedAt: null,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
    });

    createdCategories.push(category);
    console.log(`✅ Category [${category.displayOrder}] ${category.name} (slug: ${category.slug}) - ID: ${category.id}`);

    // 3. Record Admin Audit Log
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_CATEGORY',
        targetType: 'CATEGORY',
        targetId: category.id,
        details: JSON.stringify({
          name: category.name,
          slug: category.slug,
          displayOrder: category.displayOrder,
          createdBy: admin.email,
        }),
        ipAddress: '127.0.0.1',
      },
    });
  }

  console.log(`\n🎉 Successfully added ${createdCategories.length} categories to Prisma Postgres!`);

  // 4. Verify Total Categories
  const count = await prisma.category.count({ where: { deletedAt: null } });
  const all = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`\n📊 Total Active Categories in Database: ${count}`);
  all.forEach((c) => {
    console.log(`   ${c.displayOrder}. ${c.name} (slug: /category/${c.slug})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error adding categories:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

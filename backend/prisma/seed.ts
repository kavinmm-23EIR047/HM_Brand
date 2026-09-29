import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HM Agarbattis Database Seeding...');

  // 1. Create Default Admin User
  const adminPassword = await bcrypt.hash('AdminPass123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hmagarbattis.com' },
    update: {},
    create: {
      email: 'admin@hmagarbattis.com',
      passwordHash: adminPassword,
      fullName: 'HM Store Administrator',
      phone: '+91 9876543210',
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user created:', admin.email);

  // 2. Create Categories
  const categoryData = [
    { name: 'Agarbatti & Flora', slug: 'agarbatti-flora', description: 'Divine Handcrafted traditional agarbattis & floral fragrances', displayOrder: 1 },
    { name: 'Bhimseni Camphor', slug: 'bhimseni-camphor', description: '99.9% Pure pine bhimseni camphor for auspicious rituals', displayOrder: 2 },
    { name: 'Sambrani', slug: 'sambrani', description: 'Pure natural resin sambrani cups & dhoop', displayOrder: 3 },
    { name: 'Loban & Dhoop', slug: 'loban-dhoop', description: 'Sacred air cleansing loban & charcoal-free dhoop cones', displayOrder: 4 },
    { name: 'Sandalwood', slug: 'sandalwood', description: 'Calming Mysore sandalwood incense & products', displayOrder: 5 },
    { name: 'Pooja Essentials', slug: 'pooja-essentials', description: 'Daily temple needs & sacred puja essentials', displayOrder: 6 },
    { name: 'Gift Sets', slug: 'gift-sets', description: 'Festive luxury fragrance gift packs & boxes', displayOrder: 7 },
  ];

  const categories = [];
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(created);
  }
  console.log(`📁 ${categories.length} Categories seeded.`);

  // 3. Create Sample Products with Images
  const sampleProducts = [
    {
      sku: 'HM-INC-001',
      name: 'Royal Chandan Incense Sticks',
      slug: 'royal-chandan-incense-sticks',
      description: 'Experience the serene and rich fragrance of pure Mysore sandalwood. Ideal for daily prayers and meditation.',
      shortDescription: 'Pure Mysore Sandalwood Agarbatti',
      price: 150.00,
      mrp: 180.00,
      stockQuantity: 250,
      couponCode: 'CHANDAN10',
      isFeatured: true,
      displayOrder: 1,
      categorySlug: 'agarbatti-flora',
      images: [
        { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', storageKey: 'seed/chandan-1.jpg', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80', storageKey: 'seed/chandan-2.jpg', isPrimary: false },
      ],
    },
    {
      sku: 'HM-INC-002',
      name: 'Kewda Delight Agarbatti',
      slug: 'kewda-delight-agarbatti',
      description: 'Refreshing and uplifting kewda extract sticks that linger in your room for hours.',
      shortDescription: 'Refreshing Kewda Aroma',
      price: 120.00,
      mrp: 145.00,
      stockQuantity: 180,
      couponCode: 'FLORA15',
      isFeatured: true,
      displayOrder: 2,
      categorySlug: 'agarbatti-flora',
      images: [
        { url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80', storageKey: 'seed/kewda-1.jpg', isPrimary: true },
      ],
    },
    {
      sku: 'HM-CONE-001',
      name: 'Organic Guggal Dhoop Cones',
      slug: 'organic-guggal-dhoop-cones',
      description: 'Traditional charcoal-free Guggal dhoop cones created using pure herbs and resins.',
      shortDescription: 'Charcoal-free Organic Dhoop Cones',
      price: 199.00,
      mrp: 240.00,
      stockQuantity: 100,
      couponCode: 'DHOOP20',
      isFeatured: true,
      displayOrder: 3,
      categorySlug: 'loban-dhoop',
      images: [
        { url: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=600&q=80', storageKey: 'seed/guggal-1.jpg', isPrimary: true },
      ],
    },
    {
      sku: 'HM-GIFT-001',
      name: 'Divine Festive Gift Pack',
      slug: 'divine-festive-gift-pack',
      description: 'Exclusive hamper featuring Sandalwood, Mogra, Rose, and Loban sticks in an elegant golden box.',
      shortDescription: 'Assorted Festive Luxury Box',
      price: 499.00,
      mrp: 650.00,
      stockQuantity: 50,
      couponCode: 'FESTIVE25',
      isFeatured: true,
      displayOrder: 4,
      categorySlug: 'gift-sets',
      images: [
        { url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80', storageKey: 'seed/gift-1.jpg', isPrimary: true },
      ],
    },
  ];

  for (const prod of sampleProducts) {
    const category = categories.find((c) => c.slug === prod.categorySlug);
    const { categorySlug, images, ...prodData } = prod;

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prodData,
      create: {
        ...prodData,
        images: {
          create: images,
        },
      },
    });

    if (category) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: createdProd.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          productId: createdProd.id,
          categoryId: category.id,
        },
      });
    }
  }
  console.log('🛍️ Sample Products & Images seeded.');

  // 4. Create Banners
  const banners = [
    {
      title: 'Experience Pure Fragrance & Peace',
      subtitle: 'Handcrafted incense sticks made with 100% natural herbs',
      position: 'HERO_MAIN' as const,
      desktopImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1400&q=80',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      displayOrder: 1,
    },
    {
      title: 'Diwali Special Puja Collections',
      subtitle: 'Flat 20% OFF on all festive hampers',
      position: 'HERO_MAIN' as const,
      desktopImage: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1400&q=80',
      ctaText: 'Shop Festival Pack',
      ctaLink: '/festivals/diwali-special',
      displayOrder: 2,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({ data: banner });
  }
  console.log('🖼️ Banners seeded.');

  // 5. Create Default Homepage Sections
  const sections = [
    { sectionType: 'HERO_SLIDER' as const, title: 'Hero Banners', displayOrder: 1, isActive: true },
    { sectionType: 'FEATURED_CATEGORIES' as const, title: 'Explore by Categories', subtitle: 'Find incense crafted for your mood', displayOrder: 2, isActive: true },
    { sectionType: 'FEATURED_PRODUCTS' as const, title: 'Featured Products', subtitle: 'Customer favorites handcrafted to perfection', displayOrder: 3, isActive: true },
    { sectionType: 'BEST_SELLERS' as const, title: 'Best Sellers', subtitle: 'Most loved aromas across India', displayOrder: 4, isActive: true },
  ];

  for (const sec of sections) {
    await prisma.homepageSection.create({ data: sec });
  }
  console.log('📐 Homepage Sections configured.');

  console.log('✅ Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

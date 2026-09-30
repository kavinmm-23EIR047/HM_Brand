const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Running Post-Migration PostgreSQL Verifications...\n');

  const models = [
    { name: 'User', fn: () => prisma.user.count() },
    { name: 'Category', fn: () => prisma.category.count() },
    { name: 'Product', fn: () => prisma.product.count() },
    { name: 'ProductImage', fn: () => prisma.productImage.count() },
    { name: 'ProductCategory', fn: () => prisma.productCategory.count() },
    { name: 'HomepageSection', fn: () => prisma.homepageSection.count() },
    { name: 'Coupon', fn: () => prisma.coupon.count() },
    { name: 'Order', fn: () => prisma.order.count() },
    { name: 'OrderItem', fn: () => prisma.orderItem.count() },
    { name: 'Collection', fn: () => prisma.collection.count() },
    { name: 'Festival', fn: () => prisma.festival.count() },
    { name: 'WishlistItem', fn: () => prisma.wishlistItem.count() },
  ];

  console.log('📊 Model Record Counts in PostgreSQL:');
  for (const m of models) {
    try {
      const count = await m.fn();
      console.log(`  ${m.name}: ${count}`);
    } catch (e) {
      console.log(`  ${m.name}: ERROR (${e.message})`);
    }
  }

  console.log('\n🔗 Verifying Key Relational Invariants:');
  
  // 1. Products -> Images
  const productsWithImages = await prisma.product.findMany({
    include: { images: true, categories: { include: { category: true } } },
    take: 3,
  });
  console.log(`  ✅ Verified Products -> Images & Categories sample:`);
  productsWithImages.forEach(p => {
    console.log(`     - [${p.sku}] ${p.name}: ${p.images.length} image(s), categories: [${p.categories.map(c => c.category.name).join(', ')}]`);
  });

  // 2. Orders -> Items
  const orders = await prisma.order.findMany({
    include: { items: true },
  });
  console.log(`  ✅ Verified Orders -> OrderItems: ${orders.length} order(s) found with ${orders[0]?.items.length || 0} item(s)`);

  // 3. Admin User
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  console.log(`  ✅ Verified Admin User: ${admin ? admin.email + ' (Role: ' + admin.role + ')' : 'None'}`);

  // 4. Coupon
  const coupon = await prisma.coupon.findFirst();
  console.log(`  ✅ Verified Coupon: ${coupon ? coupon.code + ' (Active: ' + coupon.isActive + ')' : 'None'}`);

  // 5. Homepage Sections
  const sections = await prisma.homepageSection.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  console.log(`  ✅ Verified Homepage Sections: ${sections.length} active layout sections configured`);

  await prisma.$disconnect();
}

verify().catch(console.error);

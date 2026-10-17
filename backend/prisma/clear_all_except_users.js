const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Inspecting current database state before cleanup...\n');

  // Verify users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });

  console.log(`👤 Users to preserve (${users.length}):`);
  users.forEach((u) => {
    console.log(`   - [${u.role}] ${u.email} (${u.fullName}) - ID: ${u.id}`);
  });

  console.log('\n🗑️  Starting deletion of all records except User accounts...\n');

  // Delete in reverse topological order to respect foreign key constraints
  console.log('1. Deleting OrderItems...');
  const deletedOrderItems = await prisma.orderItem.deleteMany({});
  console.log(`   Deleted ${deletedOrderItems.count} OrderItems.`);

  console.log('2. Deleting Orders...');
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`   Deleted ${deletedOrders.count} Orders.`);

  console.log('3. Deleting WishlistItems...');
  const deletedWishlist = await prisma.wishlistItem.deleteMany({});
  console.log(`   Deleted ${deletedWishlist.count} WishlistItems.`);

  console.log('4. Deleting AdminAuditLogs...');
  const deletedAuditLogs = await prisma.adminAuditLog.deleteMany({});
  console.log(`   Deleted ${deletedAuditLogs.count} AdminAuditLogs.`);

  console.log('5. Deleting Addresses...');
  const deletedAddresses = await prisma.address.deleteMany({});
  console.log(`   Deleted ${deletedAddresses.count} Addresses.`);

  console.log('6. Deleting ProductCategories (junction)...');
  const deletedProductCategories = await prisma.productCategory.deleteMany({});
  console.log(`   Deleted ${deletedProductCategories.count} ProductCategories.`);

  console.log('7. Deleting ProductImages...');
  const deletedProductImages = await prisma.productImage.deleteMany({});
  console.log(`   Deleted ${deletedProductImages.count} ProductImages.`);

  console.log('8. Deleting CollectionProducts...');
  const deletedCollectionProducts = await prisma.collectionProduct.deleteMany({});
  console.log(`   Deleted ${deletedCollectionProducts.count} CollectionProducts.`);

  console.log('9. Deleting FestivalProducts...');
  const deletedFestivalProducts = await prisma.festivalProduct.deleteMany({});
  console.log(`   Deleted ${deletedFestivalProducts.count} FestivalProducts.`);

  console.log('10. Deleting Products...');
  const deletedProducts = await prisma.product.deleteMany({});
  console.log(`   Deleted ${deletedProducts.count} Products.`);

  console.log('11. Deleting Categories...');
  const deletedCategories = await prisma.category.deleteMany({});
  console.log(`   Deleted ${deletedCategories.count} Categories.`);

  console.log('12. Deleting Collections...');
  const deletedCollections = await prisma.collection.deleteMany({});
  console.log(`   Deleted ${deletedCollections.count} Collections.`);

  console.log('13. Deleting Festivals...');
  const deletedFestivals = await prisma.festival.deleteMany({});
  console.log(`   Deleted ${deletedFestivals.count} Festivals.`);

  console.log('14. Deleting Banners...');
  const deletedBanners = await prisma.banner.deleteMany({});
  console.log(`   Deleted ${deletedBanners.count} Banners.`);

  console.log('15. Deleting HomepageSections...');
  const deletedSections = await prisma.homepageSection.deleteMany({});
  console.log(`   Deleted ${deletedSections.count} HomepageSections.`);

  console.log('16. Deleting Coupons...');
  const deletedCoupons = await prisma.coupon.deleteMany({});
  console.log(`   Deleted ${deletedCoupons.count} Coupons.`);

  console.log('17. Deleting NewsletterSubscribers...');
  const deletedSubscribers = await prisma.newsletterSubscriber.deleteMany({});
  console.log(`   Deleted ${deletedSubscribers.count} NewsletterSubscribers.`);

  console.log('18. Deleting ContactMessages...');
  const deletedMessages = await prisma.contactMessage.deleteMany({});
  console.log(`   Deleted ${deletedMessages.count} ContactMessages.`);

  console.log('\n📊 Verifying final table counts in Prisma Postgres:');
  const tables = [
    { name: 'User (PRESERVED)', fn: () => prisma.user.count() },
    { name: 'Address', fn: () => prisma.address.count() },
    { name: 'Category', fn: () => prisma.category.count() },
    { name: 'Product', fn: () => prisma.product.count() },
    { name: 'ProductImage', fn: () => prisma.productImage.count() },
    { name: 'ProductCategory', fn: () => prisma.productCategory.count() },
    { name: 'Collection', fn: () => prisma.collection.count() },
    { name: 'CollectionProduct', fn: () => prisma.collectionProduct.count() },
    { name: 'Festival', fn: () => prisma.festival.count() },
    { name: 'FestivalProduct', fn: () => prisma.festivalProduct.count() },
    { name: 'Banner', fn: () => prisma.banner.count() },
    { name: 'HomepageSection', fn: () => prisma.homepageSection.count() },
    { name: 'Order', fn: () => prisma.order.count() },
    { name: 'OrderItem', fn: () => prisma.orderItem.count() },
    { name: 'Coupon', fn: () => prisma.coupon.count() },
    { name: 'WishlistItem', fn: () => prisma.wishlistItem.count() },
    { name: 'NewsletterSubscriber', fn: () => prisma.newsletterSubscriber.count() },
    { name: 'ContactMessage', fn: () => prisma.contactMessage.count() },
    { name: 'AdminAuditLog', fn: () => prisma.adminAuditLog.count() },
  ];

  for (const t of tables) {
    const count = await t.fn();
    console.log(`  ${t.name.padEnd(25)}: ${count}`);
  }

  const preservedUsers = await prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: true },
  });
  console.log('\n✅ Confirmed preserved user accounts:');
  preservedUsers.forEach((u) => {
    console.log(`  - [${u.role}] ${u.email} (${u.fullName})`);
  });

  console.log('\n✨ All data successfully cleared! Only user login accounts remain in the database.');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

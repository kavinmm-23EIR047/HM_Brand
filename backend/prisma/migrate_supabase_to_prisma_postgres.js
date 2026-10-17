const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');

/**
 * Migration Script: Supabase PostgreSQL -> Prisma Postgres
 * 
 * Usage:
 *   SOURCE_DATABASE_URL="postgresql://..." node prisma/migrate_supabase_to_prisma_postgres.js
 * 
 * Target database URL is automatically loaded from backend/.env (DATABASE_URL).
 */

const sourceDbUrl = process.env.SOURCE_DATABASE_URL || process.argv[2];
const targetDbUrl = process.env.DATABASE_URL;

if (!sourceDbUrl) {
  console.error('❌ Error: SOURCE_DATABASE_URL environment variable or command line argument is required.');
  console.error('Usage: SOURCE_DATABASE_URL="postgresql://..." node prisma/migrate_supabase_to_prisma_postgres.js');
  process.exit(1);
}

if (!targetDbUrl) {
  console.error('❌ Error: Target DATABASE_URL is not configured in backend/.env');
  process.exit(1);
}

const sourcePrisma = new PrismaClient({
  datasources: { db: { url: sourceDbUrl } },
});

const targetPrisma = new PrismaClient({
  datasources: { db: { url: targetDbUrl } },
});

function toDate(val) {
  if (!val) return null;
  return new Date(val);
}

async function runMigration() {
  console.log('🚀 Starting Data Migration from Source PostgreSQL -> Target Prisma Postgres...\n');

  // Step 1: Backup all data from Source to JSON
  console.log('📦 Step 1: Creating snapshot backup from Source PostgreSQL...');
  const backup = {};
  
  backup.users = await sourcePrisma.user.findMany();
  backup.categories = await sourcePrisma.category.findMany();
  backup.products = await sourcePrisma.product.findMany();
  backup.productImages = await sourcePrisma.productImage.findMany();
  backup.productCategories = await sourcePrisma.productCategory.findMany();
  backup.collections = await sourcePrisma.collection.findMany();
  backup.collectionProducts = await sourcePrisma.collectionProduct.findMany();
  backup.festivals = await sourcePrisma.festival.findMany();
  backup.festivalProducts = await sourcePrisma.festivalProduct.findMany();
  backup.banners = await sourcePrisma.banner.findMany();
  backup.homepageSections = await sourcePrisma.homepageSection.findMany();
  backup.coupons = await sourcePrisma.coupon.findMany();
  backup.addresses = await sourcePrisma.address.findMany();
  backup.orders = await sourcePrisma.order.findMany();
  backup.orderItems = await sourcePrisma.orderItem.findMany();
  backup.wishlistItems = await sourcePrisma.wishlistItem.findMany();
  backup.newsletterSubscribers = await sourcePrisma.newsletterSubscriber.findMany();
  backup.contactMessages = await sourcePrisma.contactMessage.findMany();
  backup.adminAuditLogs = await sourcePrisma.adminAuditLog.findMany();

  const backupDir = path.resolve(__dirname, '../../scratch');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `backup_data_${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`✅ Snapshot saved to ${backupPath}\n`);

  // Step 2: Migrate Level 1 Independent Entities
  console.log('📦 Step 2: Migrating Level 1 Entities (Users, Categories, Products, etc.)...');

  // 1. Users
  console.log(`   Migrating Users (${backup.users.length})...`);
  for (const u of backup.users) {
    await targetPrisma.user.upsert({
      where: { id: u.id },
      update: {
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        phone: u.phone,
        role: u.role,
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      },
      create: {
        id: u.id,
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        phone: u.phone,
        role: u.role,
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      },
    });
  }

  // 2. Categories
  console.log(`   Migrating Categories (${backup.categories.length})...`);
  for (const c of backup.categories) {
    await targetPrisma.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        displayOrder: c.displayOrder,
        isActive: c.isActive,
        createdAt: toDate(c.createdAt),
        updatedAt: toDate(c.updatedAt),
        deletedAt: toDate(c.deletedAt),
      },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        displayOrder: c.displayOrder,
        isActive: c.isActive,
        createdAt: toDate(c.createdAt),
        updatedAt: toDate(c.updatedAt),
        deletedAt: toDate(c.deletedAt),
      },
    });
  }

  // 3. Products
  console.log(`   Migrating Products (${backup.products.length})...`);
  for (const p of backup.products) {
    await targetPrisma.product.upsert({
      where: { id: p.id },
      update: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        mrp: p.mrp,
        stockQuantity: p.stockQuantity,
        couponCode: p.couponCode,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        displayOrder: p.displayOrder,
        createdAt: toDate(p.createdAt),
        updatedAt: toDate(p.updatedAt),
        deletedAt: toDate(p.deletedAt),
      },
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        mrp: p.mrp,
        stockQuantity: p.stockQuantity,
        couponCode: p.couponCode,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        displayOrder: p.displayOrder,
        createdAt: toDate(p.createdAt),
        updatedAt: toDate(p.updatedAt),
        deletedAt: toDate(p.deletedAt),
      },
    });
  }

  // 4. Collections
  console.log(`   Migrating Collections (${backup.collections.length})...`);
  for (const col of backup.collections) {
    await targetPrisma.collection.upsert({
      where: { id: col.id },
      update: {
        title: col.title,
        slug: col.slug,
        description: col.description,
        bannerUrl: col.bannerUrl,
        displayOrder: col.displayOrder,
        isActive: col.isActive,
        startDate: toDate(col.startDate),
        endDate: toDate(col.endDate),
        createdAt: toDate(col.createdAt),
        updatedAt: toDate(col.updatedAt),
      },
      create: {
        id: col.id,
        title: col.title,
        slug: col.slug,
        description: col.description,
        bannerUrl: col.bannerUrl,
        displayOrder: col.displayOrder,
        isActive: col.isActive,
        startDate: toDate(col.startDate),
        endDate: toDate(col.endDate),
        createdAt: toDate(col.createdAt),
        updatedAt: toDate(col.updatedAt),
      },
    });
  }

  // 5. Festivals
  console.log(`   Migrating Festivals (${backup.festivals.length})...`);
  for (const f of backup.festivals) {
    await targetPrisma.festival.upsert({
      where: { id: f.id },
      update: {
        title: f.title,
        slug: f.slug,
        description: f.description,
        bannerUrl: f.bannerUrl,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
        startDate: toDate(f.startDate),
        endDate: toDate(f.endDate),
        createdAt: toDate(f.createdAt),
        updatedAt: toDate(f.updatedAt),
      },
      create: {
        id: f.id,
        title: f.title,
        slug: f.slug,
        description: f.description,
        bannerUrl: f.bannerUrl,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
        startDate: toDate(f.startDate),
        endDate: toDate(f.endDate),
        createdAt: toDate(f.createdAt),
        updatedAt: toDate(f.updatedAt),
      },
    });
  }

  // 6. Banners
  console.log(`   Migrating Banners (${backup.banners.length})...`);
  for (const b of backup.banners) {
    await targetPrisma.banner.upsert({
      where: { id: b.id },
      update: {
        title: b.title,
        subtitle: b.subtitle,
        position: b.position,
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage,
        ctaText: b.ctaText,
        ctaLink: b.ctaLink,
        displayOrder: b.displayOrder,
        isActive: b.isActive,
        startDate: toDate(b.startDate),
        endDate: toDate(b.endDate),
        createdAt: toDate(b.createdAt),
        updatedAt: toDate(b.updatedAt),
      },
      create: {
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        position: b.position,
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage,
        ctaText: b.ctaText,
        ctaLink: b.ctaLink,
        displayOrder: b.displayOrder,
        isActive: b.isActive,
        startDate: toDate(b.startDate),
        endDate: toDate(b.endDate),
        createdAt: toDate(b.createdAt),
        updatedAt: toDate(b.updatedAt),
      },
    });
  }

  // 7. Homepage Sections
  console.log(`   Migrating Homepage Sections (${backup.homepageSections.length})...`);
  for (const hs of backup.homepageSections) {
    await targetPrisma.homepageSection.upsert({
      where: { id: hs.id },
      update: {
        sectionType: hs.sectionType,
        title: hs.title,
        subtitle: hs.subtitle,
        referenceId: hs.referenceId,
        displayOrder: hs.displayOrder,
        isActive: hs.isActive,
        createdAt: toDate(hs.createdAt),
        updatedAt: toDate(hs.updatedAt),
      },
      create: {
        id: hs.id,
        sectionType: hs.sectionType,
        title: hs.title,
        subtitle: hs.subtitle,
        referenceId: hs.referenceId,
        displayOrder: hs.displayOrder,
        isActive: hs.isActive,
        createdAt: toDate(hs.createdAt),
        updatedAt: toDate(hs.updatedAt),
      },
    });
  }

  // 8. Coupons
  console.log(`   Migrating Coupons (${backup.coupons.length})...`);
  for (const cp of backup.coupons) {
    await targetPrisma.coupon.upsert({
      where: { id: cp.id },
      update: {
        code: cp.code,
        discountPercent: cp.discountPercent,
        discountAmount: cp.discountAmount,
        minOrderAmount: cp.minOrderAmount,
        maxDiscount: cp.maxDiscount,
        expiryDate: toDate(cp.expiryDate),
        usageLimit: cp.usageLimit,
        usageCount: cp.usageCount,
        isActive: cp.isActive,
        createdAt: toDate(cp.createdAt),
      },
      create: {
        id: cp.id,
        code: cp.code,
        discountPercent: cp.discountPercent,
        discountAmount: cp.discountAmount,
        minOrderAmount: cp.minOrderAmount,
        maxDiscount: cp.maxDiscount,
        expiryDate: toDate(cp.expiryDate),
        usageLimit: cp.usageLimit,
        usageCount: cp.usageCount,
        isActive: cp.isActive,
        createdAt: toDate(cp.createdAt),
      },
    });
  }

  // 9. Newsletter Subscribers
  console.log(`   Migrating Newsletter Subscribers (${backup.newsletterSubscribers.length})...`);
  for (const ns of backup.newsletterSubscribers) {
    await targetPrisma.newsletterSubscriber.upsert({
      where: { email: ns.email },
      update: {
        email: ns.email,
        isSubscribed: ns.isSubscribed,
        createdAt: toDate(ns.createdAt),
      },
      create: {
        id: ns.id,
        email: ns.email,
        isSubscribed: ns.isSubscribed,
        createdAt: toDate(ns.createdAt),
      },
    });
  }

  // 10. Contact Messages
  console.log(`   Migrating Contact Messages (${backup.contactMessages.length})...`);
  for (const cm of backup.contactMessages) {
    await targetPrisma.contactMessage.upsert({
      where: { id: cm.id },
      update: {
        name: cm.name,
        email: cm.email,
        subject: cm.subject,
        message: cm.message,
        isRead: cm.isRead,
        createdAt: toDate(cm.createdAt),
      },
      create: {
        id: cm.id,
        name: cm.name,
        email: cm.email,
        subject: cm.subject,
        message: cm.message,
        isRead: cm.isRead,
        createdAt: toDate(cm.createdAt),
      },
    });
  }

  // Step 3: Migrate Level 2 Entities (Dependent on Level 1)
  console.log('\n📦 Step 3: Migrating Level 2 Entities (Addresses, Product Images, Junctions, Orders)...');

  // 11. Addresses
  console.log(`   Migrating Addresses (${backup.addresses.length})...`);
  for (const a of backup.addresses) {
    await targetPrisma.address.upsert({
      where: { id: a.id },
      update: {
        userId: a.userId,
        recipientName: a.recipientName,
        phone: a.phone,
        street: a.street,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        isDefault: a.isDefault,
        createdAt: toDate(a.createdAt),
      },
      create: {
        id: a.id,
        userId: a.userId,
        recipientName: a.recipientName,
        phone: a.phone,
        street: a.street,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        isDefault: a.isDefault,
        createdAt: toDate(a.createdAt),
      },
    });
  }

  // 12. Product Images
  console.log(`   Migrating Product Images (${backup.productImages.length})...`);
  for (const img of backup.productImages) {
    await targetPrisma.productImage.upsert({
      where: { id: img.id },
      update: {
        productId: img.productId,
        url: img.url,
        storageKey: img.storageKey,
        altText: img.altText,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
        createdAt: toDate(img.createdAt),
        updatedAt: toDate(img.updatedAt),
      },
      create: {
        id: img.id,
        productId: img.productId,
        url: img.url,
        storageKey: img.storageKey,
        altText: img.altText,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
        createdAt: toDate(img.createdAt),
        updatedAt: toDate(img.updatedAt),
      },
    });
  }

  // 13. Product Categories Junction
  console.log(`   Migrating Product Categories Junctions (${backup.productCategories.length})...`);
  for (const pc of backup.productCategories) {
    await targetPrisma.productCategory.upsert({
      where: {
        productId_categoryId: {
          productId: pc.productId,
          categoryId: pc.categoryId,
        },
      },
      update: {
        createdAt: toDate(pc.createdAt),
      },
      create: {
        productId: pc.productId,
        categoryId: pc.categoryId,
        createdAt: toDate(pc.createdAt),
      },
    });
  }

  // 14. Collection Products
  console.log(`   Migrating Collection Products (${backup.collectionProducts.length})...`);
  for (const cp of backup.collectionProducts) {
    await targetPrisma.collectionProduct.upsert({
      where: {
        collectionId_productId: {
          collectionId: cp.collectionId,
          productId: cp.productId,
        },
      },
      update: {
        displayOrder: cp.displayOrder,
      },
      create: {
        collectionId: cp.collectionId,
        productId: cp.productId,
        displayOrder: cp.displayOrder,
      },
    });
  }

  // 15. Festival Products
  console.log(`   Migrating Festival Products (${backup.festivalProducts.length})...`);
  for (const fp of backup.festivalProducts) {
    await targetPrisma.festivalProduct.upsert({
      where: {
        festivalId_productId: {
          festivalId: fp.festivalId,
          productId: fp.productId,
        },
      },
      update: {
        displayOrder: fp.displayOrder,
      },
      create: {
        festivalId: fp.festivalId,
        productId: fp.productId,
        displayOrder: fp.displayOrder,
      },
    });
  }

  // 16. Orders
  console.log(`   Migrating Orders (${backup.orders.length})...`);
  for (const o of backup.orders) {
    await targetPrisma.order.upsert({
      where: { id: o.id },
      update: {
        orderNumber: o.orderNumber,
        userId: o.userId,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        shippingAddress: o.shippingAddress,
        subtotal: o.subtotal,
        discountAmount: o.discountAmount,
        shippingCost: o.shippingCost,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        razorpayOrderId: o.razorpayOrderId,
        razorpayPaymentId: o.razorpayPaymentId,
        createdAt: toDate(o.createdAt),
        updatedAt: toDate(o.updatedAt),
      },
      create: {
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        shippingAddress: o.shippingAddress,
        subtotal: o.subtotal,
        discountAmount: o.discountAmount,
        shippingCost: o.shippingCost,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        razorpayOrderId: o.razorpayOrderId,
        razorpayPaymentId: o.razorpayPaymentId,
        createdAt: toDate(o.createdAt),
        updatedAt: toDate(o.updatedAt),
      },
    });
  }

  // 17. Wishlist Items
  console.log(`   Migrating Wishlist Items (${backup.wishlistItems.length})...`);
  for (const w of backup.wishlistItems) {
    await targetPrisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: w.userId,
          productId: w.productId,
        },
      },
      update: {
        createdAt: toDate(w.createdAt),
      },
      create: {
        id: w.id,
        userId: w.userId,
        productId: w.productId,
        createdAt: toDate(w.createdAt),
      },
    });
  }

  // 18. Admin Audit Logs
  console.log(`   Migrating Admin Audit Logs (${backup.adminAuditLogs.length})...`);
  for (const l of backup.adminAuditLogs) {
    await targetPrisma.adminAuditLog.upsert({
      where: { id: l.id },
      update: {
        adminId: l.adminId,
        action: l.action,
        targetType: l.targetType,
        targetId: l.targetId,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: toDate(l.createdAt),
      },
      create: {
        id: l.id,
        adminId: l.adminId,
        action: l.action,
        targetType: l.targetType,
        targetId: l.targetId,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: toDate(l.createdAt),
      },
    });
  }

  // Step 4: Migrate Level 3 Entities (OrderItems)
  console.log('\n📦 Step 4: Migrating Level 3 Entities (Order Items)...');
  console.log(`   Migrating Order Items (${backup.orderItems.length})...`);
  for (const oi of backup.orderItems) {
    await targetPrisma.orderItem.upsert({
      where: { id: oi.id },
      update: {
        orderId: oi.orderId,
        productId: oi.productId,
        productNameSnapshot: oi.productNameSnapshot,
        skuSnapshot: oi.skuSnapshot,
        unitPriceSnapshot: oi.unitPriceSnapshot,
        imageUrlSnapshot: oi.imageUrlSnapshot,
        quantity: oi.quantity,
        totalPrice: oi.totalPrice,
      },
      create: {
        id: oi.id,
        orderId: oi.orderId,
        productId: oi.productId,
        productNameSnapshot: oi.productNameSnapshot,
        skuSnapshot: oi.skuSnapshot,
        unitPriceSnapshot: oi.unitPriceSnapshot,
        imageUrlSnapshot: oi.imageUrlSnapshot,
        quantity: oi.quantity,
        totalPrice: oi.totalPrice,
      },
    });
  }

  console.log('\n🎉 All rows successfully migrated to Prisma Postgres!\n');

  // Step 5: Verification & Comparison
  console.log('🔍 Step 5: Verifying Table Row Counts Between Source and Target...');
  const models = [
    { name: 'User', s: () => sourcePrisma.user.count(), t: () => targetPrisma.user.count() },
    { name: 'Category', s: () => sourcePrisma.category.count(), t: () => targetPrisma.category.count() },
    { name: 'Product', s: () => sourcePrisma.product.count(), t: () => targetPrisma.product.count() },
    { name: 'ProductImage', s: () => sourcePrisma.productImage.count(), t: () => targetPrisma.productImage.count() },
    { name: 'ProductCategory', s: () => sourcePrisma.productCategory.count(), t: () => targetPrisma.productCategory.count() },
    { name: 'Collection', s: () => sourcePrisma.collection.count(), t: () => targetPrisma.collection.count() },
    { name: 'CollectionProduct', s: () => sourcePrisma.collectionProduct.count(), t: () => targetPrisma.collectionProduct.count() },
    { name: 'Festival', s: () => sourcePrisma.festival.count(), t: () => targetPrisma.festival.count() },
    { name: 'FestivalProduct', s: () => sourcePrisma.festivalProduct.count(), t: () => targetPrisma.festivalProduct.count() },
    { name: 'Banner', s: () => sourcePrisma.banner.count(), t: () => targetPrisma.banner.count() },
    { name: 'HomepageSection', s: () => sourcePrisma.homepageSection.count(), t: () => targetPrisma.homepageSection.count() },
    { name: 'Order', s: () => sourcePrisma.order.count(), t: () => targetPrisma.order.count() },
    { name: 'OrderItem', s: () => sourcePrisma.orderItem.count(), t: () => targetPrisma.orderItem.count() },
    { name: 'Coupon', s: () => sourcePrisma.coupon.count(), t: () => targetPrisma.coupon.count() },
    { name: 'Address', s: () => sourcePrisma.address.count(), t: () => targetPrisma.address.count() },
    { name: 'WishlistItem', s: () => sourcePrisma.wishlistItem.count(), t: () => targetPrisma.wishlistItem.count() },
    { name: 'NewsletterSubscriber', s: () => sourcePrisma.newsletterSubscriber.count(), t: () => targetPrisma.newsletterSubscriber.count() },
    { name: 'ContactMessage', s: () => sourcePrisma.contactMessage.count(), t: () => targetPrisma.contactMessage.count() },
    { name: 'AdminAuditLog', s: () => sourcePrisma.adminAuditLog.count(), t: () => targetPrisma.adminAuditLog.count() },
  ];

  let allMatch = true;
  for (const m of models) {
    const [sc, tc] = await Promise.all([m.s(), m.t()]);
    const match = sc === tc;
    if (!match) allMatch = false;
    console.log(`  ${match ? '✅' : '❌'} ${m.name.padEnd(22)} Source: ${String(sc).padStart(4)} | Target: ${String(tc).padStart(4)}`);
  }

  if (allMatch) {
    console.log('\n🌟 SUCCESS: All tables match 100% with exact row counts!');
  } else {
    console.error('\n⚠️ WARNING: Some table counts do not match!');
  }

  await sourcePrisma.$disconnect();
  await targetPrisma.$disconnect();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

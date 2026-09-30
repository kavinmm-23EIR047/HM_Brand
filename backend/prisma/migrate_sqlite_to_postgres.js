const path = require('path');
require('dotenv').config();
const { DatabaseSync } = require('node:sqlite');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const sqliteDb = new DatabaseSync(path.join(__dirname, 'dev.db'));

function toBool(val) {
  if (val === null || val === undefined) return false;
  return val === 1 || val === true || val === '1' || val === 'true';
}

function toDate(val) {
  if (!val) return null;
  return new Date(val);
}

async function migrateData() {
  console.log('🚀 Starting SQLite (dev.db) -> Supabase PostgreSQL Data Migration...');
  let totalTransferred = 0;

  try {
    // 1. Users
    const users = sqliteDb.prepare('SELECT * FROM users').all();
    console.log(`\n📦 Migrating Users (${users.length})...`);
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          fullName: u.fullName,
          phone: u.phone || null,
          role: u.role || 'CUSTOMER',
          createdAt: toDate(u.createdAt) || new Date(),
          updatedAt: toDate(u.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Users transferred: ${users.length}`);

    // 2. Categories
    const categories = sqliteDb.prepare('SELECT * FROM categories').all();
    console.log(`\n📦 Migrating Categories (${categories.length})...`);
    for (const c of categories) {
      await prisma.category.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || null,
          imageUrl: c.imageUrl || null,
          displayOrder: Number(c.displayOrder) || 0,
          isActive: toBool(c.isActive),
          createdAt: toDate(c.createdAt) || new Date(),
          updatedAt: toDate(c.updatedAt) || new Date(),
          deletedAt: toDate(c.deletedAt),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Categories transferred: ${categories.length}`);

    // 3. Products
    const products = sqliteDb.prepare('SELECT * FROM products').all();
    console.log(`\n📦 Migrating Products (${products.length})...`);
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDescription: p.shortDescription || null,
          price: Number(p.price),
          mrp: Number(p.mrp),
          stockQuantity: Number(p.stockQuantity) || 0,
          couponCode: p.couponCode || null,
          isActive: toBool(p.isActive),
          isFeatured: toBool(p.isFeatured),
          displayOrder: Number(p.displayOrder) || 0,
          createdAt: toDate(p.createdAt) || new Date(),
          updatedAt: toDate(p.updatedAt) || new Date(),
          deletedAt: toDate(p.deletedAt),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Products transferred: ${products.length}`);

    // 4. Product Images
    const productImages = sqliteDb.prepare('SELECT * FROM product_images').all();
    console.log(`\n📦 Migrating Product Images (${productImages.length})...`);
    for (const img of productImages) {
      await prisma.productImage.upsert({
        where: { id: img.id },
        update: {},
        create: {
          id: img.id,
          productId: img.productId,
          url: img.url,
          storageKey: img.storageKey,
          altText: img.altText || null,
          displayOrder: Number(img.displayOrder) || 0,
          isPrimary: toBool(img.isPrimary),
          createdAt: toDate(img.createdAt) || new Date(),
          updatedAt: toDate(img.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Product Images transferred: ${productImages.length}`);

    // 5. Product Categories (Composite PK)
    const productCategories = sqliteDb.prepare('SELECT * FROM product_categories').all();
    console.log(`\n📦 Migrating Product-Category Junctions (${productCategories.length})...`);
    for (const pc of productCategories) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: pc.productId,
            categoryId: pc.categoryId,
          },
        },
        update: {},
        create: {
          productId: pc.productId,
          categoryId: pc.categoryId,
          createdAt: toDate(pc.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Product-Category Junctions transferred: ${productCategories.length}`);

    // 6. Homepage Sections
    const homepageSections = sqliteDb.prepare('SELECT * FROM homepage_sections').all();
    console.log(`\n📦 Migrating Homepage Sections (${homepageSections.length})...`);
    for (const hs of homepageSections) {
      await prisma.homepageSection.upsert({
        where: { id: hs.id },
        update: {},
        create: {
          id: hs.id,
          sectionType: hs.sectionType,
          title: hs.title || null,
          subtitle: hs.subtitle || null,
          referenceId: hs.referenceId || null,
          displayOrder: Number(hs.displayOrder) || 0,
          isActive: toBool(hs.isActive),
          createdAt: toDate(hs.createdAt) || new Date(),
          updatedAt: toDate(hs.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Homepage Sections transferred: ${homepageSections.length}`);

    // 7. Coupons
    const coupons = sqliteDb.prepare('SELECT * FROM coupons').all();
    console.log(`\n📦 Migrating Coupons (${coupons.length})...`);
    for (const cp of coupons) {
      await prisma.coupon.upsert({
        where: { id: cp.id },
        update: {},
        create: {
          id: cp.id,
          code: cp.code,
          discountPercent: cp.discountPercent !== null ? Number(cp.discountPercent) : null,
          discountAmount: cp.discountAmount !== null ? Number(cp.discountAmount) : null,
          minOrderAmount: Number(cp.minOrderAmount) || 0,
          maxDiscount: cp.maxDiscount !== null ? Number(cp.maxDiscount) : null,
          expiryDate: toDate(cp.expiryDate) || new Date(),
          usageLimit: cp.usageLimit !== null ? Number(cp.usageLimit) : null,
          usageCount: Number(cp.usageCount) || 0,
          isActive: toBool(cp.isActive),
          createdAt: toDate(cp.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Coupons transferred: ${coupons.length}`);

    // 8. Orders
    const orders = sqliteDb.prepare('SELECT * FROM orders').all();
    console.log(`\n📦 Migrating Orders (${orders.length})...`);
    for (const o of orders) {
      await prisma.order.upsert({
        where: { id: o.id },
        update: {},
        create: {
          id: o.id,
          orderNumber: o.orderNumber,
          userId: o.userId || null,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          shippingAddress: o.shippingAddress,
          subtotal: Number(o.subtotal),
          discountAmount: Number(o.discountAmount) || 0,
          shippingCost: Number(o.shippingCost) || 0,
          totalAmount: Number(o.totalAmount),
          status: o.status || 'PENDING',
          paymentStatus: o.paymentStatus || 'PENDING',
          paymentMethod: o.paymentMethod || 'COD',
          razorpayOrderId: o.razorpayOrderId || null,
          razorpayPaymentId: o.razorpayPaymentId || null,
          createdAt: toDate(o.createdAt) || new Date(),
          updatedAt: toDate(o.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Orders transferred: ${orders.length}`);

    // 9. Order Items
    const orderItems = sqliteDb.prepare('SELECT * FROM order_items').all();
    console.log(`\n📦 Migrating Order Items (${orderItems.length})...`);
    for (const oi of orderItems) {
      await prisma.orderItem.upsert({
        where: { id: oi.id },
        update: {},
        create: {
          id: oi.id,
          orderId: oi.orderId,
          productId: oi.productId || null,
          productNameSnapshot: oi.productNameSnapshot,
          skuSnapshot: oi.skuSnapshot,
          unitPriceSnapshot: Number(oi.unitPriceSnapshot),
          imageUrlSnapshot: oi.imageUrlSnapshot || null,
          quantity: Number(oi.quantity),
          totalPrice: Number(oi.totalPrice),
        },
      });
      totalTransferred++;
    }
    console.log(`✅ Order Items transferred: ${orderItems.length}`);

    // 10. Collections (if any exist)
    const collections = sqliteDb.prepare('SELECT * FROM collections').all();
    for (const col of collections) {
      await prisma.collection.upsert({
        where: { id: col.id },
        update: {},
        create: {
          id: col.id,
          title: col.title,
          slug: col.slug,
          description: col.description || null,
          bannerUrl: col.bannerUrl || null,
          displayOrder: Number(col.displayOrder) || 0,
          isActive: toBool(col.isActive),
          startDate: toDate(col.startDate),
          endDate: toDate(col.endDate),
          createdAt: toDate(col.createdAt) || new Date(),
          updatedAt: toDate(col.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 11. Collection Products (if any exist)
    const collectionProducts = sqliteDb.prepare('SELECT * FROM collection_products').all();
    for (const cp of collectionProducts) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: cp.collectionId,
            productId: cp.productId,
          },
        },
        update: {},
        create: {
          collectionId: cp.collectionId,
          productId: cp.productId,
          displayOrder: Number(cp.displayOrder) || 0,
        },
      });
      totalTransferred++;
    }

    // 12. Festivals (if any exist)
    const festivals = sqliteDb.prepare('SELECT * FROM festivals').all();
    for (const f of festivals) {
      await prisma.festival.upsert({
        where: { id: f.id },
        update: {},
        create: {
          id: f.id,
          title: f.title,
          slug: f.slug,
          description: f.description || null,
          bannerUrl: f.bannerUrl || null,
          displayOrder: Number(f.displayOrder) || 0,
          isActive: toBool(f.isActive),
          startDate: toDate(f.startDate),
          endDate: toDate(f.endDate),
          createdAt: toDate(f.createdAt) || new Date(),
          updatedAt: toDate(f.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 13. Festival Products (if any exist)
    const festivalProducts = sqliteDb.prepare('SELECT * FROM festival_products').all();
    for (const fp of festivalProducts) {
      await prisma.festivalProduct.upsert({
        where: {
          festivalId_productId: {
            festivalId: fp.festivalId,
            productId: fp.productId,
          },
        },
        update: {},
        create: {
          festivalId: fp.festivalId,
          productId: fp.productId,
          displayOrder: Number(fp.displayOrder) || 0,
        },
      });
      totalTransferred++;
    }

    // 14. Banners (if any exist)
    const banners = sqliteDb.prepare('SELECT * FROM banners').all();
    for (const b of banners) {
      await prisma.banner.upsert({
        where: { id: b.id },
        update: {},
        create: {
          id: b.id,
          title: b.title,
          subtitle: b.subtitle || null,
          position: b.position || 'HERO_MAIN',
          desktopImage: b.desktopImage,
          mobileImage: b.mobileImage || null,
          ctaText: b.ctaText || null,
          ctaLink: b.ctaLink || null,
          displayOrder: Number(b.displayOrder) || 0,
          isActive: toBool(b.isActive),
          startDate: toDate(b.startDate),
          endDate: toDate(b.endDate),
          createdAt: toDate(b.createdAt) || new Date(),
          updatedAt: toDate(b.updatedAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 15. Wishlist Items (if any exist)
    const wishlistItems = sqliteDb.prepare('SELECT * FROM wishlist_items').all();
    for (const w of wishlistItems) {
      await prisma.wishlistItem.upsert({
        where: {
          userId_productId: {
            userId: w.userId,
            productId: w.productId,
          },
        },
        update: {},
        create: {
          id: w.id,
          userId: w.userId,
          productId: w.productId,
          createdAt: toDate(w.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 16. Newsletter Subscribers (if any exist)
    const subscribers = sqliteDb.prepare('SELECT * FROM newsletter_subscribers').all();
    for (const s of subscribers) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: s.email },
        update: {},
        create: {
          id: s.id,
          email: s.email,
          isSubscribed: toBool(s.isSubscribed),
          createdAt: toDate(s.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 17. Contact Messages (if any exist)
    const messages = sqliteDb.prepare('SELECT * FROM contact_messages').all();
    for (const m of messages) {
      await prisma.contactMessage.upsert({
        where: { id: m.id },
        update: {},
        create: {
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject || null,
          message: m.message,
          isRead: toBool(m.isRead),
          createdAt: toDate(m.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    // 18. Admin Audit Logs (if any exist)
    const logs = sqliteDb.prepare('SELECT * FROM admin_audit_logs').all();
    for (const l of logs) {
      await prisma.adminAuditLog.upsert({
        where: { id: l.id },
        update: {},
        create: {
          id: l.id,
          adminId: l.adminId,
          action: l.action,
          targetType: l.targetType,
          targetId: l.targetId || null,
          details: l.details || null,
          ipAddress: l.ipAddress || null,
          createdAt: toDate(l.createdAt) || new Date(),
        },
      });
      totalTransferred++;
    }

    console.log(`\n🎉 Data migration finished! Total rows processed: ${totalTransferred}`);
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();

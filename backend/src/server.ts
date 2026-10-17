import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './shared/database/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to Prisma Postgres Database via Prisma ORM.');

    // Auto-migrate schema columns if missing in target database
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "parentId" TEXT;
        ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
        ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unitPrice" DOUBLE PRECISION;
        ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bundleQuantity" INTEGER DEFAULT 1;
        ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subcategoryId" TEXT;
        ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
        ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
      `);
      console.log('✅ Database schema columns verified and up-to-date.');
    } catch (migErr) {
      console.warn('⚠️ Auto-migration note:', migErr);
    }

    app.listen(PORT, () => {
      console.log(`🚀 HM Agarbattis Backend running on http://localhost:${PORT}`);
      console.log(`📡 API Base Route: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
    });
  } catch (error) {
    console.error('❌ Database connection failure during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();

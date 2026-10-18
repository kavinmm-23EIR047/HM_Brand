import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './shared/database/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  app.listen(PORT, () => {
    console.log(`🚀 HM Agarbattis Backend running on http://localhost:${PORT}`);
    console.log(`📡 API Base Route: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
  });

  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL Database via Prisma ORM.');

    // Auto-migrate schema columns if missing in target database
    const migrationStatements = [
      'ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "parentId" TEXT',
      'ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)',
      'ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unitPrice" DOUBLE PRECISION',
      'ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bundleQuantity" INTEGER DEFAULT 1',
      'ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subcategoryId" TEXT',
      'ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "couponCode" TEXT',
      'ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)',
    ];

    for (const statement of migrationStatements) {
      try {
        await prisma.$executeRawUnsafe(statement);
      } catch (stmtErr: any) {
        console.warn(`⚠️ Auto-migration statement note (${statement}):`, stmtErr?.message || stmtErr);
      }
    }
    console.log('✅ Database schema columns verified and up-to-date.');
  } catch (error: any) {
    console.warn('⚠️  Database connection is pending or paused.');
    console.warn(`   If using Supabase, check if your project is paused at: https://supabase.com/dashboard/project/tedtqdwlmuzdgbngboas`);
    console.warn(`   Error details: ${error.message || error}`);
  }
}

bootstrap();

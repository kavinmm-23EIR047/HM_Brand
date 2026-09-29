import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './shared/database/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to SQLite Database via Prisma ORM.');

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

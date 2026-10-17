"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./shared/database/prisma"));
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    try {
        // Verify DB connection
        await prisma_1.default.$connect();
        console.log('✅ Connected to Prisma Postgres Database via Prisma ORM.');
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
                await prisma_1.default.$executeRawUnsafe(statement);
            }
            catch (stmtErr) {
                console.warn(`⚠️ Auto-migration statement note (${statement}):`, stmtErr?.message || stmtErr);
            }
        }
        console.log('✅ Database schema columns verified and up-to-date.');
        app_1.default.listen(PORT, () => {
            console.log(`🚀 HM Agarbattis Backend running on http://localhost:${PORT}`);
            console.log(`📡 API Base Route: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
        });
    }
    catch (error) {
        console.error('❌ Database connection failure during bootstrap:', error);
        process.exit(1);
    }
}
bootstrap();

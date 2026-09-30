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
        console.log('✅ Connected to SQLite Database via Prisma ORM.');
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

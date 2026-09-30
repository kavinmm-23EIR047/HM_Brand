"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class AuthRepository {
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
        });
    }
    async createUser(data) {
        return prisma_1.default.user.create({
            data: {
                email: data.email.toLowerCase().trim(),
                passwordHash: data.passwordHash,
                fullName: data.fullName,
                phone: data.phone,
                role: data.role || 'CUSTOMER',
            },
        });
    }
    async updateUser(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data: {
                ...(data.fullName !== undefined ? { fullName: data.fullName.trim() } : {}),
                ...(data.email !== undefined ? { email: data.email.toLowerCase().trim() } : {}),
                ...(data.phone !== undefined ? { phone: data.phone ? data.phone.trim() : null } : {}),
                ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
            },
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();

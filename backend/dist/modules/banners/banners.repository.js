"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannersRepository = exports.BannersRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class BannersRepository {
    async findAll(position, includeInactive = false) {
        return prisma_1.default.banner.findMany({
            where: {
                ...(position ? { position } : {}),
                ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findById(id) {
        return prisma_1.default.banner.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma_1.default.banner.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.default.banner.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.banner.delete({
            where: { id },
        });
    }
}
exports.BannersRepository = BannersRepository;
exports.bannersRepository = new BannersRepository();

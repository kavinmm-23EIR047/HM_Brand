"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRepository = exports.CategoriesRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class CategoriesRepository {
    async findAll(includeInactive = false) {
        return prisma_1.default.category.findMany({
            where: {
                deletedAt: null,
                ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findBySlug(slug) {
        return prisma_1.default.category.findUnique({
            where: { slug },
            include: {
                products: {
                    include: {
                        product: {
                            include: { images: true },
                        },
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.default.category.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma_1.default.category.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.default.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.productCategory.deleteMany({ where: { categoryId: id } });
            return tx.category.delete({
                where: { id },
            });
        }, {
            maxWait: 15000,
            timeout: 30000,
        });
    }
}
exports.CategoriesRepository = CategoriesRepository;
exports.categoriesRepository = new CategoriesRepository();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRepository = exports.CategoriesRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class CategoriesRepository {
    async findAll(includeInactive = false, parentId) {
        const where = {
            deletedAt: null,
            ...(includeInactive ? {} : { isActive: true }),
        };
        if (parentId !== undefined) {
            where.parentId = parentId;
        }
        return prisma_1.default.category.findMany({
            where,
            orderBy: { displayOrder: 'asc' },
            include: {
                children: {
                    where: {
                        deletedAt: null,
                        ...(includeInactive ? {} : { isActive: true }),
                    },
                    orderBy: { displayOrder: 'asc' },
                },
                parent: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    }
    async findBySlug(slug) {
        return prisma_1.default.category.findUnique({
            where: { slug },
            include: {
                children: {
                    where: { deletedAt: null, isActive: true },
                    orderBy: { displayOrder: 'asc' },
                },
                parent: {
                    select: { id: true, name: true, slug: true },
                },
                products: {
                    include: {
                        product: {
                            include: { images: true, subcategory: true },
                        },
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.default.category.findUnique({
            where: { id },
            include: {
                children: {
                    where: { deletedAt: null },
                    orderBy: { displayOrder: 'asc' },
                },
                parent: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    }
    async create(data) {
        return prisma_1.default.category.create({
            data,
            include: {
                parent: { select: { id: true, name: true, slug: true } },
                children: true,
            },
        });
    }
    async update(id, data) {
        return prisma_1.default.category.update({
            where: { id },
            data,
            include: {
                parent: { select: { id: true, name: true, slug: true } },
                children: true,
            },
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

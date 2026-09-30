"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionsRepository = exports.CollectionsRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class CollectionsRepository {
    async findAll(includeInactive = false) {
        return prisma_1.default.collection.findMany({
            where: {
                ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findBySlug(slug) {
        return prisma_1.default.collection.findUnique({
            where: { slug },
            include: {
                products: {
                    orderBy: { displayOrder: 'asc' },
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
        return prisma_1.default.collection.findUnique({
            where: { id },
        });
    }
    async create(data) {
        const { productIds = [], ...colData } = data;
        return prisma_1.default.collection.create({
            data: {
                ...colData,
                products: {
                    create: productIds.map((productId, index) => ({
                        productId,
                        displayOrder: index,
                    })),
                },
            },
            include: {
                products: { include: { product: true } },
            },
        });
    }
    async update(id, data) {
        const { productIds, ...updateData } = data;
        return prisma_1.default.$transaction(async (tx) => {
            if (productIds) {
                await tx.collectionProduct.deleteMany({ where: { collectionId: id } });
                await tx.collectionProduct.createMany({
                    data: productIds.map((productId, index) => ({
                        collectionId: id,
                        productId,
                        displayOrder: index,
                    })),
                });
            }
            return tx.collection.update({
                where: { id },
                data: updateData,
                include: {
                    products: { include: { product: true } },
                },
            });
        });
    }
    async delete(id) {
        return prisma_1.default.collection.delete({
            where: { id },
        });
    }
}
exports.CollectionsRepository = CollectionsRepository;
exports.collectionsRepository = new CollectionsRepository();

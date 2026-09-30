"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = exports.WishlistService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const custom_error_1 = require("../../shared/errors/custom.error");
class WishlistService {
    async getWishlist(userId) {
        return prisma_1.default.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: { images: { orderBy: { displayOrder: 'asc' } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addToWishlist(userId, productIdOrSlug) {
        const product = await prisma_1.default.product.findFirst({
            where: {
                OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
                deletedAt: null,
            },
        });
        if (!product || !product.isActive) {
            throw new custom_error_1.NotFoundError('Product not found');
        }
        return prisma_1.default.wishlistItem.upsert({
            where: {
                userId_productId: { userId, productId: product.id },
            },
            create: { userId, productId: product.id },
            update: {},
            include: { product: true },
        });
    }
    async removeFromWishlist(userId, productIdOrSlug) {
        const product = await prisma_1.default.product.findFirst({
            where: {
                OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
            },
        });
        const targetProductId = product ? product.id : productIdOrSlug;
        return prisma_1.default.wishlistItem.deleteMany({
            where: { userId, productId: targetProductId },
        });
    }
    async syncWishlist(userId, items) {
        if (Array.isArray(items) && items.length > 0) {
            for (const item of items) {
                if (!item || typeof item !== 'string')
                    continue;
                const product = await prisma_1.default.product.findFirst({
                    where: {
                        OR: [{ id: item }, { slug: item }],
                        deletedAt: null,
                    },
                });
                if (product && product.isActive) {
                    await prisma_1.default.wishlistItem.upsert({
                        where: {
                            userId_productId: { userId, productId: product.id },
                        },
                        create: { userId, productId: product.id },
                        update: {},
                    });
                }
            }
        }
        return this.getWishlist(userId);
    }
}
exports.WishlistService = WishlistService;
exports.wishlistService = new WishlistService();

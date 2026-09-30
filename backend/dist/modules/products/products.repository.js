"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRepository = exports.ProductsRepository = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
class ProductsRepository {
    async findPaginated(filters) {
        const { page, limit, search, categorySlug, collectionSlug, festivalSlug, sort, isFeatured, includeInactive } = filters;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(includeInactive ? {} : { isActive: true }),
            ...(isFeatured !== undefined ? { isFeatured } : {}),
        };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { sku: { contains: search } },
            ];
        }
        if (categorySlug) {
            where.categories = {
                some: {
                    category: { slug: categorySlug },
                },
            };
        }
        if (collectionSlug) {
            where.collections = {
                some: {
                    collection: { slug: collectionSlug },
                },
            };
        }
        if (festivalSlug) {
            where.festivals = {
                some: {
                    festival: { slug: festivalSlug },
                },
            };
        }
        let orderBy = { displayOrder: 'asc' };
        if (sort === 'price_asc')
            orderBy = { price: 'asc' };
        if (sort === 'price_desc')
            orderBy = { price: 'desc' };
        if (sort === 'newest')
            orderBy = { createdAt: 'desc' };
        const [items, totalItems] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    images: { orderBy: { displayOrder: 'asc' } },
                    categories: { include: { category: true } },
                    collections: { include: { collection: true } },
                },
            }),
            prisma_1.default.product.count({ where }),
        ]);
        return { items, totalItems };
    }
    async findBySlug(slug) {
        return prisma_1.default.product.findUnique({
            where: { slug },
            include: {
                images: { orderBy: { displayOrder: 'asc' } },
                categories: { include: { category: true } },
                collections: { include: { collection: true } },
                festivals: { include: { festival: true } },
            },
        });
    }
    async findById(id) {
        return prisma_1.default.product.findUnique({
            where: { id },
            include: {
                images: { orderBy: { displayOrder: 'asc' } },
                categories: { include: { category: true } },
            },
        });
    }
    async findBySku(sku) {
        return prisma_1.default.product.findUnique({
            where: { sku },
        });
    }
    async create(data) {
        const { categoryIds = [], images = [], ...productData } = data;
        const validCategoryIds = categoryIds.filter((cid) => Boolean(cid) && typeof cid === 'string' && cid.trim() !== '');
        return prisma_1.default.product.create({
            data: {
                ...productData,
                categories: {
                    create: validCategoryIds.map((categoryId) => ({ categoryId })),
                },
                images: {
                    create: images.map((img, index) => ({
                        url: img.url,
                        storageKey: img.storageKey || 'admin/product.jpg',
                        altText: img.altText || data.name,
                        isPrimary: img.isPrimary || index === 0,
                        displayOrder: img.displayOrder || index,
                    })),
                },
            },
            include: {
                images: true,
                categories: { include: { category: true } },
            },
        });
    }
    async update(id, data) {
        const { categoryIds, images, ...updateData } = data;
        return prisma_1.default.$transaction(async (tx) => {
            if (Array.isArray(categoryIds)) {
                const validCategoryIds = categoryIds.filter((cid) => Boolean(cid) && typeof cid === 'string' && cid.trim() !== '');
                await tx.productCategory.deleteMany({ where: { productId: id } });
                if (validCategoryIds.length > 0) {
                    await tx.productCategory.createMany({
                        data: validCategoryIds.map((categoryId) => ({ productId: id, categoryId })),
                    });
                }
            }
            if (Array.isArray(images) && images.length > 0) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                await tx.productImage.createMany({
                    data: images.map((img, index) => ({
                        productId: id,
                        url: img.url,
                        storageKey: img.storageKey || 'admin/product.jpg',
                        altText: img.altText || updateData.name || '',
                        isPrimary: img.isPrimary || index === 0,
                        displayOrder: img.displayOrder || index,
                    })),
                });
            }
            return tx.product.update({
                where: { id },
                data: updateData,
                include: {
                    images: true,
                    categories: { include: { category: true } },
                },
            });
        });
    }
    async addImage(productId, imageData) {
        if (imageData.isPrimary) {
            await prisma_1.default.productImage.updateMany({
                where: { productId },
                data: { isPrimary: false },
            });
        }
        return prisma_1.default.productImage.create({
            data: {
                productId,
                url: imageData.url,
                storageKey: imageData.storageKey,
                altText: imageData.altText,
                isPrimary: imageData.isPrimary || false,
                displayOrder: imageData.displayOrder || 0,
            },
        });
    }
    async removeImage(imageId) {
        return prisma_1.default.productImage.delete({
            where: { id: imageId },
        });
    }
    async softDelete(id) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.productCategory.deleteMany({ where: { productId: id } });
            await tx.productImage.deleteMany({ where: { productId: id } });
            await tx.wishlistItem.deleteMany({ where: { productId: id } });
            try {
                await tx.orderItem.deleteMany({ where: { productId: id } });
            }
            catch { }
            return tx.product.delete({
                where: { id },
            });
        });
    }
}
exports.ProductsRepository = ProductsRepository;
exports.productsRepository = new ProductsRepository();

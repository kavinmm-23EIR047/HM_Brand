"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = exports.MediaService = exports.mediaTypes = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const cloudinary_1 = require("../../shared/cloudinary");
const custom_error_1 = require("../../shared/errors/custom.error");
const slug_util_1 = require("../../shared/utils/slug.util");
const image_optimizer_1 = require("../../shared/image-optimizer");
exports.mediaTypes = ['PRODUCT', 'CATEGORY', 'BANNER', 'HOMEPAGE', 'COLLECTION', 'FESTIVAL', 'OTHER'];
function safeSlug(value, label) {
    const slug = (0, slug_util_1.generateSlug)(value);
    if (!slug)
        throw new custom_error_1.BadRequestError(`${label} must contain letters or numbers.`);
    return slug.slice(0, 120);
}
function asType(value) {
    if (typeof value !== 'string' || !exports.mediaTypes.includes(value)) {
        throw new custom_error_1.BadRequestError('Unsupported image type.');
    }
    return value;
}
class MediaService {
    async upload(file, data) {
        const type = asType(data.type);
        const entityId = typeof data.entityId === 'string' ? data.entityId : undefined;
        const imageId = typeof data.imageId === 'string' ? data.imageId : undefined;
        let folder;
        let filename;
        let applyUpload = async () => undefined;
        if (type === 'PRODUCT') {
            if (!entityId)
                throw new custom_error_1.BadRequestError('A product ID is required for product images.');
            const product = await prisma_1.default.product.findUnique({
                where: { id: entityId },
                include: { categories: { include: { category: true } }, images: { orderBy: { displayOrder: 'asc' } } },
            });
            if (!product || product.deletedAt)
                throw new custom_error_1.NotFoundError('Product not found.');
            const categorySlug = product.categories[0]?.category.slug || 'uncategorized';
            const requestedImage = imageId ? product.images.find((image) => image.id === imageId) : undefined;
            if (imageId && !requestedImage)
                throw new custom_error_1.NotFoundError('Product image not found.');
            const primary = requestedImage?.isPrimary ?? (data.isPrimary === 'true' || product.images.length === 0);
            const productSlug = safeSlug(product.slug, 'Product slug');
            folder = `hm_brand/products/${safeSlug(categorySlug, 'Category slug')}/${productSlug}`;
            const hasBaseSlug = product.images.some((image) => image.id !== requestedImage?.id && image.storageKey.endsWith(`/${productSlug}`));
            let suffix = 1;
            while (product.images.some((image) => image.id !== requestedImage?.id &&
                (image.storageKey.endsWith(`/${productSlug}-${suffix}`) ||
                    image.storageKey.endsWith(`/${productSlug}-${suffix}.webp`)))) {
                suffix += 1;
            }
            const existingFilename = requestedImage?.storageKey?.split('/').pop();
            filename = requestedImage
                ? (existingFilename || (primary && !hasBaseSlug ? productSlug : `${productSlug}-${suffix}`))
                : (primary && !hasBaseSlug && product.images.length === 0
                    ? productSlug
                    : `${productSlug}-${suffix}-${Date.now().toString().slice(-4)}`);
            const position = requestedImage?.displayOrder ?? Math.max(-1, ...product.images.map((image) => image.displayOrder)) + 1;
            applyUpload = async (url, id) => {
                if (requestedImage) {
                    if (requestedImage.storageKey && requestedImage.storageKey !== id) {
                        await (0, cloudinary_1.deleteImage)(requestedImage.storageKey).catch(() => undefined);
                    }
                    else if (requestedImage.url) {
                        await this.deleteStoredImage(requestedImage.url).catch(() => undefined);
                    }
                    if (primary)
                        await prisma_1.default.productImage.updateMany({ where: { productId: product.id }, data: { isPrimary: false } });
                    return prisma_1.default.productImage.update({ where: { id: requestedImage.id }, data: { url, storageKey: id, isPrimary: primary } });
                }
                if (primary)
                    await prisma_1.default.productImage.updateMany({ where: { productId: product.id }, data: { isPrimary: false } });
                return prisma_1.default.productImage.create({ data: { productId: product.id, url, storageKey: id, altText: product.name, isPrimary: primary, displayOrder: position } });
            };
        }
        else if (type === 'CATEGORY') {
            if (!entityId)
                throw new custom_error_1.BadRequestError('A category ID is required.');
            const category = await prisma_1.default.category.findUnique({ where: { id: entityId } });
            if (!category || category.deletedAt)
                throw new custom_error_1.NotFoundError('Category not found.');
            const slug = safeSlug(category.slug, 'Category slug');
            folder = `hm_brand/categories/${slug}`;
            filename = slug;
            applyUpload = async (url) => {
                if (category.imageUrl) {
                    await this.deleteStoredImage(category.imageUrl).catch(() => undefined);
                }
                return prisma_1.default.category.update({ where: { id: category.id }, data: { imageUrl: url } });
            };
        }
        else if (type === 'BANNER') {
            if (!entityId)
                throw new custom_error_1.BadRequestError('A banner ID is required.');
            const banner = await prisma_1.default.banner.findUnique({ where: { id: entityId } });
            if (!banner)
                throw new custom_error_1.NotFoundError('Banner not found.');
            folder = 'hm_brand/banners';
            filename = safeSlug(banner.title, 'Banner title');
            applyUpload = async (url) => {
                if (banner.desktopImage) {
                    await this.deleteStoredImage(banner.desktopImage).catch(() => undefined);
                }
                return prisma_1.default.banner.update({ where: { id: banner.id }, data: { desktopImage: url } });
            };
        }
        else if (type === 'COLLECTION' || type === 'FESTIVAL') {
            if (!entityId)
                throw new custom_error_1.BadRequestError(`A ${type.toLowerCase()} ID is required.`);
            const record = type === 'COLLECTION'
                ? await prisma_1.default.collection.findUnique({ where: { id: entityId } })
                : await prisma_1.default.festival.findUnique({ where: { id: entityId } });
            if (!record)
                throw new custom_error_1.NotFoundError(`${type === 'COLLECTION' ? 'Collection' : 'Festival'} not found.`);
            const slug = safeSlug(record.slug, `${type} slug`);
            folder = `hm_brand/${type === 'COLLECTION' ? 'collections' : 'festivals'}/${slug}`;
            filename = slug;
            applyUpload = async (url) => {
                if (record.bannerUrl) {
                    await this.deleteStoredImage(record.bannerUrl).catch(() => undefined);
                }
                return type === 'COLLECTION'
                    ? prisma_1.default.collection.update({ where: { id: record.id }, data: { bannerUrl: url } })
                    : prisma_1.default.festival.update({ where: { id: record.id }, data: { bannerUrl: url } });
            };
        }
        else if (type === 'HOMEPAGE') {
            const section = safeSlug(String(data.sectionSlug || ''), 'Section slug');
            const image = safeSlug(String(data.imageSlug || ''), 'Image slug');
            folder = `hm_brand/homepage/${section}`;
            filename = image;
        }
        else {
            folder = 'hm_brand/other';
            filename = safeSlug(String(data.imageSlug || ''), 'Image slug');
        }
        const optimized = await (0, image_optimizer_1.optimizeImageToWebp)(file.buffer, {
            maxDimension: 1600,
            quality: 85,
            effort: 5,
        });
        const uploaded = await (0, cloudinary_1.uploadImage)(optimized.buffer, { folder, publicId: filename });
        try {
            const record = await applyUpload(uploaded.secureUrl, uploaded.publicId);
            return {
                ...uploaded,
                format: optimized.format,
                width: optimized.width,
                height: optimized.height,
                size: optimized.size,
                originalSize: optimized.originalSize,
                record,
            };
        }
        catch (error) {
            await (0, cloudinary_1.deleteImage)(uploaded.publicId).catch(() => undefined);
            throw error;
        }
    }
    async deleteProductImage(imageId, productId) {
        const image = await prisma_1.default.productImage.findUnique({ where: { id: imageId } });
        if (!image)
            throw new custom_error_1.NotFoundError('Product image not found.');
        if (productId && image.productId !== productId)
            throw new custom_error_1.BadRequestError('Product image does not belong to this product.');
        await (0, cloudinary_1.deleteImage)(image.storageKey).catch(() => undefined);
        await prisma_1.default.productImage.delete({ where: { id: image.id } });
        if (image.isPrimary) {
            const remainingImage = await prisma_1.default.productImage.findFirst({
                where: { productId: image.productId },
                orderBy: { displayOrder: 'asc' },
            });
            if (remainingImage) {
                await prisma_1.default.productImage.update({
                    where: { id: remainingImage.id },
                    data: { isPrimary: true },
                });
            }
        }
    }
    async delete(typeValue, entityId, data) {
        const type = asType(typeValue);
        if (type === 'PRODUCT') {
            const imageId = typeof data.imageId === 'string' ? data.imageId : '';
            if (!imageId)
                throw new custom_error_1.BadRequestError('A product image ID is required.');
            return this.deleteProductImage(imageId, entityId);
        }
        if (type === 'CATEGORY') {
            const category = await prisma_1.default.category.findUnique({ where: { id: entityId } });
            if (!category || category.deletedAt)
                throw new custom_error_1.NotFoundError('Category not found.');
            await this.deleteStoredImage(category.imageUrl);
            await prisma_1.default.category.update({ where: { id: category.id }, data: { imageUrl: null } });
            return;
        }
        if (type === 'BANNER') {
            const banner = await prisma_1.default.banner.findUnique({ where: { id: entityId } });
            if (!banner)
                throw new custom_error_1.NotFoundError('Banner not found.');
            await this.deleteStoredImage(banner.desktopImage);
            // Banner.desktopImage is required by the current schema; an empty value activates its existing frontend fallback.
            await prisma_1.default.banner.update({ where: { id: banner.id }, data: { desktopImage: '' } });
            return;
        }
        if (type === 'COLLECTION' || type === 'FESTIVAL') {
            const record = type === 'COLLECTION'
                ? await prisma_1.default.collection.findUnique({ where: { id: entityId } })
                : await prisma_1.default.festival.findUnique({ where: { id: entityId } });
            if (!record)
                throw new custom_error_1.NotFoundError(`${type === 'COLLECTION' ? 'Collection' : 'Festival'} not found.`);
            await this.deleteStoredImage(record.bannerUrl);
            if (type === 'COLLECTION') {
                await prisma_1.default.collection.update({ where: { id: record.id }, data: { bannerUrl: null } });
            }
            else {
                await prisma_1.default.festival.update({ where: { id: record.id }, data: { bannerUrl: null } });
            }
            return;
        }
        const folder = type === 'HOMEPAGE'
            ? `hm_brand/homepage/${safeSlug(String(data.sectionSlug || ''), 'Section slug')}`
            : 'hm_brand/other';
        const filename = safeSlug(String(data.imageSlug || ''), 'Image slug');
        await (0, cloudinary_1.deleteImage)(`${folder}/${filename}`);
    }
    async deleteStoredImage(url) {
        if (!url)
            return;
        const match = decodeURIComponent(url).match(/(?:^|\/)hm_brand\/[^?]+/);
        if (!match)
            return; // A legacy/external URL was not uploaded by this application.
        const publicId = match[0].replace(/^\//, '').replace(/\.[a-z0-9]+(?:\?.*)?$/i, '');
        await (0, cloudinary_1.deleteImage)(publicId);
    }
}
exports.MediaService = MediaService;
exports.mediaService = new MediaService();

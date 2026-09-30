"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsService = exports.ProductsService = void 0;
const products_repository_1 = require("./products.repository");
const slug_util_1 = require("../../shared/utils/slug.util");
const custom_error_1 = require("../../shared/errors/custom.error");
class ProductsService {
    repo;
    constructor(repo = products_repository_1.productsRepository) {
        this.repo = repo;
    }
    async getProducts(filters) {
        const page = Math.max(1, parseInt(filters.page || '1', 10));
        const limit = Math.min(500, Math.max(1, parseInt(filters.limit || '12', 10)));
        const parsedFilters = {
            page,
            limit,
            search: filters.search,
            categorySlug: filters.category,
            collectionSlug: filters.collection,
            festivalSlug: filters.festival,
            sort: filters.sort,
            isFeatured: filters.isFeatured === 'true' ? true : filters.isFeatured === 'false' ? false : undefined,
            includeInactive: filters.includeInactive || false,
        };
        const { items, totalItems } = await this.repo.findPaginated(parsedFilters);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items,
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async getProductBySlug(slug) {
        const product = await this.repo.findBySlug(slug);
        if (!product || product.deletedAt) {
            throw new custom_error_1.NotFoundError('Product not found');
        }
        return product;
    }
    async createProduct(data) {
        const slug = (0, slug_util_1.generateSlug)(data.name);
        // Auto-generate description from name if not provided
        const description = data.description && data.description.trim().length > 0
            ? data.description
            : data.name;
        // Auto-generate SKU if not provided or too short
        const sku = data.sku && data.sku.trim().length > 0
            ? data.sku.trim()
            : `HM-${Date.now().toString().slice(-8)}`;
        const existingSlug = await this.repo.findBySlug(slug);
        if (existingSlug && !existingSlug.deletedAt) {
            throw new custom_error_1.ConflictError(`Product with slug '${slug}' already exists.`);
        }
        const existingSku = await this.repo.findBySku(sku);
        if (existingSku) {
            throw new custom_error_1.ConflictError(`Product with SKU '${sku}' already exists.`);
        }
        const created = await this.repo.create({
            ...data,
            description,
            sku,
            slug,
        });
        return created;
    }
    async updateProduct(id, data) {
        const product = await this.repo.findById(id);
        if (!product || product.deletedAt) {
            throw new custom_error_1.NotFoundError('Product not found');
        }
        let slug = product.slug;
        if (data.name && data.name !== product.name) {
            slug = (0, slug_util_1.generateSlug)(data.name);
        }
        const updated = await this.repo.update(id, {
            ...data,
            slug,
        });
        return updated;
    }
    async addProductImage(productId, imageData) {
        const product = await this.repo.findById(productId);
        if (!product || product.deletedAt) {
            throw new custom_error_1.NotFoundError('Product not found');
        }
        const res = await this.repo.addImage(productId, imageData);
        return res;
    }
    async removeProductImage(imageId) {
        return this.repo.removeImage(imageId);
    }
    async deleteProduct(id) {
        const product = await this.repo.findById(id);
        if (!product || product.deletedAt) {
            throw new custom_error_1.NotFoundError('Product not found');
        }
        const res = await this.repo.softDelete(id);
        return res;
    }
}
exports.ProductsService = ProductsService;
exports.productsService = new ProductsService();

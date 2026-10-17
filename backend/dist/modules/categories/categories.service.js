"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesService = exports.CategoriesService = void 0;
const categories_repository_1 = require("./categories.repository");
const slug_util_1 = require("../../shared/utils/slug.util");
const custom_error_1 = require("../../shared/errors/custom.error");
class CategoriesService {
    repo;
    constructor(repo = categories_repository_1.categoriesRepository) {
        this.repo = repo;
    }
    async getAllCategories(includeInactive = false, parentId) {
        return this.repo.findAll(includeInactive, parentId);
    }
    async getCategoryBySlug(slug) {
        const category = await this.repo.findBySlug(slug);
        if (!category || category.deletedAt) {
            throw new custom_error_1.NotFoundError('Category not found');
        }
        return category;
    }
    async createCategory(data) {
        const slug = (0, slug_util_1.generateSlug)(data.name);
        const existing = await this.repo.findBySlug(slug);
        if (existing) {
            throw new custom_error_1.ConflictError(`Category with slug '${slug}' already exists.`);
        }
        if (data.parentId) {
            const parent = await this.repo.findById(data.parentId);
            if (!parent) {
                throw new custom_error_1.NotFoundError('Parent category not found');
            }
        }
        return this.repo.create({
            ...data,
            slug,
            parentId: data.parentId || null,
        });
    }
    async updateCategory(id, data) {
        const category = await this.repo.findById(id);
        if (!category || category.deletedAt) {
            throw new custom_error_1.NotFoundError('Category not found');
        }
        let slug = category.slug;
        if (data.name && data.name !== category.name) {
            slug = (0, slug_util_1.generateSlug)(data.name);
        }
        if (data.parentId && data.parentId !== id) {
            const parent = await this.repo.findById(data.parentId);
            if (!parent) {
                throw new custom_error_1.NotFoundError('Parent category not found');
            }
        }
        return this.repo.update(id, {
            ...data,
            slug,
            parentId: data.parentId !== undefined ? (data.parentId || null) : undefined,
        });
    }
    async deleteCategory(id) {
        const category = await this.repo.findById(id);
        if (!category) {
            throw new custom_error_1.NotFoundError('Category not found');
        }
        return this.repo.delete(id);
    }
}
exports.CategoriesService = CategoriesService;
exports.categoriesService = new CategoriesService();

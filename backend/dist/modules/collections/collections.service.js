"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionsService = exports.CollectionsService = void 0;
const collections_repository_1 = require("./collections.repository");
const slug_util_1 = require("../../shared/utils/slug.util");
const custom_error_1 = require("../../shared/errors/custom.error");
class CollectionsService {
    repo;
    constructor(repo = collections_repository_1.collectionsRepository) {
        this.repo = repo;
    }
    async getAllCollections(includeInactive = false) {
        return this.repo.findAll(includeInactive);
    }
    async getCollectionBySlug(slug) {
        const col = await this.repo.findBySlug(slug);
        if (!col) {
            throw new custom_error_1.NotFoundError('Collection not found');
        }
        return col;
    }
    async createCollection(data) {
        const slug = (0, slug_util_1.generateSlug)(data.title);
        const existing = await this.repo.findBySlug(slug);
        if (existing) {
            throw new custom_error_1.ConflictError(`Collection with slug '${slug}' already exists.`);
        }
        return this.repo.create({
            ...data,
            slug,
        });
    }
    async updateCollection(id, data) {
        const col = await this.repo.findById(id);
        if (!col) {
            throw new custom_error_1.NotFoundError('Collection not found');
        }
        let slug = col.slug;
        if (data.title && data.title !== col.title) {
            slug = (0, slug_util_1.generateSlug)(data.title);
        }
        return this.repo.update(id, {
            ...data,
            slug,
        });
    }
    async deleteCollection(id) {
        const col = await this.repo.findById(id);
        if (!col) {
            throw new custom_error_1.NotFoundError('Collection not found');
        }
        return this.repo.delete(id);
    }
}
exports.CollectionsService = CollectionsService;
exports.collectionsService = new CollectionsService();

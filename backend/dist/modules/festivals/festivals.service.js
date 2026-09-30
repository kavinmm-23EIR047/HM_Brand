"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.festivalsService = exports.FestivalsService = void 0;
const festivals_repository_1 = require("./festivals.repository");
const slug_util_1 = require("../../shared/utils/slug.util");
const custom_error_1 = require("../../shared/errors/custom.error");
class FestivalsService {
    repo;
    constructor(repo = festivals_repository_1.festivalsRepository) {
        this.repo = repo;
    }
    async getAllFestivals(includeInactive = false) {
        return this.repo.findAll(includeInactive);
    }
    async getFestivalBySlug(slug) {
        const fest = await this.repo.findBySlug(slug);
        if (!fest) {
            throw new custom_error_1.NotFoundError('Festival campaign not found');
        }
        return fest;
    }
    async createFestival(data) {
        const slug = (0, slug_util_1.generateSlug)(data.title);
        const existing = await this.repo.findBySlug(slug);
        if (existing) {
            throw new custom_error_1.ConflictError(`Festival campaign with slug '${slug}' already exists.`);
        }
        return this.repo.create({
            ...data,
            slug,
        });
    }
    async updateFestival(id, data) {
        const fest = await this.repo.findById(id);
        if (!fest) {
            throw new custom_error_1.NotFoundError('Festival campaign not found');
        }
        let slug = fest.slug;
        if (data.title && data.title !== fest.title) {
            slug = (0, slug_util_1.generateSlug)(data.title);
        }
        return this.repo.update(id, {
            ...data,
            slug,
        });
    }
    async deleteFestival(id) {
        const fest = await this.repo.findById(id);
        if (!fest) {
            throw new custom_error_1.NotFoundError('Festival campaign not found');
        }
        return this.repo.delete(id);
    }
}
exports.FestivalsService = FestivalsService;
exports.festivalsService = new FestivalsService();

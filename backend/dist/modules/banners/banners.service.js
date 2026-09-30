"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannersService = exports.BannersService = void 0;
const banners_repository_1 = require("./banners.repository");
const custom_error_1 = require("../../shared/errors/custom.error");
class BannersService {
    repo;
    constructor(repo = banners_repository_1.bannersRepository) {
        this.repo = repo;
    }
    async getBanners(position, includeInactive = false) {
        return this.repo.findAll(position, includeInactive);
    }
    async createBanner(data) {
        return this.repo.create(data);
    }
    async updateBanner(id, data) {
        const banner = await this.repo.findById(id);
        if (!banner) {
            throw new custom_error_1.NotFoundError('Banner not found');
        }
        return this.repo.update(id, data);
    }
    async deleteBanner(id) {
        const banner = await this.repo.findById(id);
        if (!banner) {
            throw new custom_error_1.NotFoundError('Banner not found');
        }
        return this.repo.delete(id);
    }
}
exports.BannersService = BannersService;
exports.bannersService = new BannersService();

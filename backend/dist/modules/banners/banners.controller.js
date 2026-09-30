"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannersController = exports.BannersController = void 0;
const banners_service_1 = require("./banners.service");
const response_util_1 = require("../../shared/utils/response.util");
class BannersController {
    service;
    constructor(service = banners_service_1.bannersService) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const position = req.query.position;
            const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
            const banners = await this.service.getBanners(position, includeInactive);
            return (0, response_util_1.sendSuccess)(res, banners, 'Banners retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const banner = await this.service.createBanner(req.body);
            return (0, response_util_1.sendSuccess)(res, banner, 'Banner created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const banner = await this.service.updateBanner(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, banner, 'Banner updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteBanner(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Banner deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.BannersController = BannersController;
exports.bannersController = new BannersController();

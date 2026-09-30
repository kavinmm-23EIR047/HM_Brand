"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.festivalsController = exports.FestivalsController = void 0;
const festivals_service_1 = require("./festivals.service");
const response_util_1 = require("../../shared/utils/response.util");
class FestivalsController {
    service;
    constructor(service = festivals_service_1.festivalsService) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
            const festivals = await this.service.getAllFestivals(includeInactive);
            return (0, response_util_1.sendSuccess)(res, festivals, 'Festivals retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getBySlug = async (req, res, next) => {
        try {
            const festival = await this.service.getFestivalBySlug(req.params.slug);
            return (0, response_util_1.sendSuccess)(res, festival, 'Festival campaign retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const festival = await this.service.createFestival(req.body);
            return (0, response_util_1.sendSuccess)(res, festival, 'Festival campaign created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const festival = await this.service.updateFestival(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, festival, 'Festival campaign updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteFestival(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Festival campaign deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.FestivalsController = FestivalsController;
exports.festivalsController = new FestivalsController();

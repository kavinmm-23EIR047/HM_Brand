"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homepageController = exports.HomepageController = void 0;
const homepage_service_1 = require("./homepage.service");
const response_util_1 = require("../../shared/utils/response.util");
class HomepageController {
    service;
    constructor(service = homepage_service_1.homepageService) {
        this.service = service;
    }
    getHomepage = async (req, res, next) => {
        try {
            const data = await this.service.getHomepagePayload();
            return (0, response_util_1.sendSuccess)(res, data, 'Homepage content retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    updateSections = async (req, res, next) => {
        try {
            const updated = await this.service.updateHomepageSections(req.body.sections);
            return (0, response_util_1.sendSuccess)(res, updated, 'Homepage sections updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.HomepageController = HomepageController;
exports.homepageController = new HomepageController();

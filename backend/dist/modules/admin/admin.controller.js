"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const response_util_1 = require("../../shared/utils/response.util");
class AdminController {
    service;
    constructor(service = admin_service_1.adminService) {
        this.service = service;
    }
    getDashboard = async (req, res, next) => {
        try {
            const metrics = await this.service.getDashboardMetrics();
            return (0, response_util_1.sendSuccess)(res, metrics, 'Admin dashboard metrics retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getAuditLogs = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '20', 10);
            const result = await this.service.getAuditLogs(page, limit);
            return (0, response_util_1.sendPaginated)(res, result.items, result.meta, 'Admin audit logs retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();

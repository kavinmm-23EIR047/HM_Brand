"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsController = exports.CouponsController = void 0;
const coupons_service_1 = require("./coupons.service");
const response_util_1 = require("../../shared/utils/response.util");
class CouponsController {
    service;
    constructor(service = coupons_service_1.couponsService) {
        this.service = service;
    }
    validate = async (req, res, next) => {
        try {
            const { code, cartAmount } = req.body;
            const result = await this.service.validateCoupon(code, Number(cartAmount || 0));
            return (0, response_util_1.sendSuccess)(res, result, 'Coupon applied successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const coupons = await this.service.getAllCoupons();
            return (0, response_util_1.sendSuccess)(res, coupons, 'Coupons retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const coupon = await this.service.createCoupon(req.body);
            return (0, response_util_1.sendSuccess)(res, coupon, 'Coupon created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const coupon = await this.service.updateCoupon(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, coupon, 'Coupon updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteCoupon(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Coupon deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.CouponsController = CouponsController;
exports.couponsController = new CouponsController();

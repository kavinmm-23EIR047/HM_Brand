"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsService = exports.CouponsService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const custom_error_1 = require("../../shared/errors/custom.error");
class CouponsService {
    async getAllCoupons() {
        return prisma_1.default.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async validateCoupon(code, cartAmount) {
        const coupon = await prisma_1.default.coupon.findUnique({
            where: { code: code.toUpperCase().trim() },
        });
        if (!coupon || !coupon.isActive) {
            throw new custom_error_1.NotFoundError('Invalid or inactive coupon code');
        }
        if (new Date(coupon.expiryDate) < new Date()) {
            throw new custom_error_1.BadRequestError('This coupon code has expired');
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new custom_error_1.BadRequestError('Coupon usage limit reached');
        }
        if (cartAmount < coupon.minOrderAmount) {
            throw new custom_error_1.BadRequestError(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
        }
        let discount = 0;
        if (coupon.discountPercent) {
            discount = (cartAmount * coupon.discountPercent) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }
        else if (coupon.discountAmount) {
            discount = coupon.discountAmount;
        }
        return {
            code: coupon.code,
            discountAmount: discount,
            discountPercent: coupon.discountPercent,
            finalAmount: Math.max(0, cartAmount - discount),
        };
    }
    async createCoupon(data) {
        const formattedCode = data.code.toUpperCase().trim();
        const existing = await prisma_1.default.coupon.findUnique({ where: { code: formattedCode } });
        if (existing) {
            throw new custom_error_1.ConflictError(`Coupon code '${formattedCode}' already exists`);
        }
        return prisma_1.default.coupon.create({
            data: {
                code: formattedCode,
                discountPercent: data.discountPercent,
                discountAmount: data.discountAmount,
                minOrderAmount: data.minOrderAmount || 0,
                maxDiscount: data.maxDiscount,
                expiryDate: new Date(data.expiryDate),
                usageLimit: data.usageLimit,
                isActive: data.isActive ?? true,
            },
        });
    }
    async updateCoupon(id, data) {
        const coupon = await prisma_1.default.coupon.findUnique({ where: { id } });
        if (!coupon) {
            throw new custom_error_1.NotFoundError('Coupon not found');
        }
        return prisma_1.default.coupon.update({
            where: { id },
            data: {
                ...data,
                ...(data.code ? { code: data.code.toUpperCase().trim() } : {}),
                ...(data.expiryDate ? { expiryDate: new Date(data.expiryDate) } : {}),
            },
        });
    }
    async deleteCoupon(id) {
        const coupon = await prisma_1.default.coupon.findUnique({ where: { id } });
        if (!coupon) {
            throw new custom_error_1.NotFoundError('Coupon not found');
        }
        return prisma_1.default.coupon.delete({ where: { id } });
    }
}
exports.CouponsService = CouponsService;
exports.couponsService = new CouponsService();

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
        if (cartAmount > 0 && coupon.minOrderAmount > 0 && cartAmount < coupon.minOrderAmount) {
            throw new custom_error_1.BadRequestError(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
        }
        let discount = 0;
        if (coupon.discountPercent) {
            discount = cartAmount > 0 ? Math.round((cartAmount * coupon.discountPercent) / 100) : 0;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }
        else if (coupon.discountAmount) {
            discount = cartAmount > 0 ? Math.min(cartAmount, coupon.discountAmount) : coupon.discountAmount;
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
        const minOrder = Number(data.minOrderAmount);
        const discPct = data.discountPercent !== undefined && data.discountPercent !== null && !isNaN(Number(data.discountPercent))
            ? Number(data.discountPercent)
            : null;
        const discAmt = data.discountAmount !== undefined && data.discountAmount !== null && !isNaN(Number(data.discountAmount))
            ? Number(data.discountAmount)
            : null;
        const maxDisc = data.maxDiscount !== undefined && data.maxDiscount !== null && !isNaN(Number(data.maxDiscount))
            ? Number(data.maxDiscount)
            : null;
        return prisma_1.default.coupon.create({
            data: {
                code: formattedCode,
                discountPercent: discPct,
                discountAmount: discAmt,
                minOrderAmount: isNaN(minOrder) || minOrder < 0 ? 0 : minOrder,
                maxDiscount: maxDisc,
                expiryDate: new Date(data.expiryDate),
                usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
                isActive: data.isActive ?? true,
            },
        });
    }
    async updateCoupon(id, data) {
        const coupon = await prisma_1.default.coupon.findUnique({ where: { id } });
        if (!coupon) {
            throw new custom_error_1.NotFoundError('Coupon not found');
        }
        const updateData = {};
        if (data.code !== undefined && data.code !== null && String(data.code).trim() !== '') {
            updateData.code = String(data.code).toUpperCase().trim();
        }
        if (data.discountPercent !== undefined && data.discountPercent !== null && !isNaN(Number(data.discountPercent))) {
            updateData.discountPercent = Number(data.discountPercent);
        }
        if (data.discountAmount !== undefined && data.discountAmount !== null && !isNaN(Number(data.discountAmount))) {
            updateData.discountAmount = Number(data.discountAmount);
        }
        if (data.minOrderAmount !== undefined && data.minOrderAmount !== null) {
            const parsedMin = Number(data.minOrderAmount);
            updateData.minOrderAmount = isNaN(parsedMin) || parsedMin < 0 ? 0 : parsedMin;
        }
        if (data.maxDiscount !== undefined && data.maxDiscount !== null) {
            const parsedMax = Number(data.maxDiscount);
            updateData.maxDiscount = isNaN(parsedMax) ? null : parsedMax;
        }
        if (data.expiryDate) {
            const parsedDate = new Date(data.expiryDate);
            if (!isNaN(parsedDate.getTime())) {
                updateData.expiryDate = parsedDate;
            }
        }
        if (data.isActive !== undefined) {
            updateData.isActive = Boolean(data.isActive);
        }
        if (data.usageLimit !== undefined) {
            const parsedLimit = Number(data.usageLimit);
            updateData.usageLimit = isNaN(parsedLimit) ? null : parsedLimit;
        }
        return prisma_1.default.coupon.update({
            where: { id },
            data: updateData,
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

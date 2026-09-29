import prisma from '../../shared/database/prisma';
import { NotFoundError, BadRequestError, ConflictError } from '../../shared/errors/custom.error';

export class CouponsService {
  async getAllCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateCoupon(code: string, cartAmount: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      throw new NotFoundError('Invalid or inactive coupon code');
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new BadRequestError('This coupon code has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestError('Coupon usage limit reached');
    }

    if (cartAmount < coupon.minOrderAmount) {
      throw new BadRequestError(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = (cartAmount * coupon.discountPercent) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    return {
      code: coupon.code,
      discountAmount: discount,
      discountPercent: coupon.discountPercent,
      finalAmount: Math.max(0, cartAmount - discount),
    };
  }

  async createCoupon(data: {
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    expiryDate: string;
    usageLimit?: number;
    isActive?: boolean;
  }) {
    const formattedCode = data.code.toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code: formattedCode } });
    if (existing) {
      throw new ConflictError(`Coupon code '${formattedCode}' already exists`);
    }

    return prisma.coupon.create({
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

  async updateCoupon(id: string, data: any) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundError('Coupon not found');
    }

    return prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        ...(data.code ? { code: data.code.toUpperCase().trim() } : {}),
        ...(data.expiryDate ? { expiryDate: new Date(data.expiryDate) } : {}),
      },
    });
  }

  async deleteCoupon(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundError('Coupon not found');
    }
    return prisma.coupon.delete({ where: { id } });
  }
}

export const couponsService = new CouponsService();

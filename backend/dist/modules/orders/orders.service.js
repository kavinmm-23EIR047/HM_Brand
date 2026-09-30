"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersService = exports.OrdersService = void 0;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
const orders_repository_1 = require("./orders.repository");
const custom_error_1 = require("../../shared/errors/custom.error");
class OrdersService {
    repo;
    constructor(repo = orders_repository_1.ordersRepository) {
        this.repo = repo;
    }
    async createOrder(data) {
        // Transaction execution for atomic order placement & stock deduction
        return prisma_1.default.$transaction(async (tx) => {
            let subtotal = 0;
            const orderItemsToCreate = [];
            for (const item of data.items) {
                const product = await tx.product.findFirst({
                    where: {
                        OR: [{ id: item.productId }, { slug: item.productId }, { sku: item.productId }],
                        deletedAt: null,
                    },
                    include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
                });
                if (!product || !product.isActive) {
                    throw new custom_error_1.BadRequestError(`Product with ID or Slug '${item.productId}' is not available.`);
                }
                if (product.stockQuantity < item.quantity) {
                    throw new custom_error_1.BadRequestError(`Insufficient stock for '${product.name}'. Available: ${product.stockQuantity}`);
                }
                const unitPrice = Number(product.price);
                const totalPrice = unitPrice * item.quantity;
                subtotal += totalPrice;
                const primaryImage = product.images[0]?.url || null;
                // Snapshot line item metadata at purchase time
                orderItemsToCreate.push({
                    productId: product.id,
                    productNameSnapshot: product.name,
                    skuSnapshot: product.sku,
                    unitPriceSnapshot: unitPrice,
                    imageUrlSnapshot: primaryImage,
                    quantity: item.quantity,
                    totalPrice,
                });
                // Deduct inventory stock
                await tx.product.update({
                    where: { id: product.id },
                    data: { stockQuantity: product.stockQuantity - item.quantity },
                });
            }
            // Calculate discounts if coupon applied
            let discountAmount = 0;
            if (data.couponCode) {
                const coupon = await tx.coupon.findUnique({
                    where: { code: data.couponCode.toUpperCase().trim() },
                });
                if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date()) {
                    if (coupon.discountPercent) {
                        discountAmount = (subtotal * coupon.discountPercent) / 100;
                        if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                            discountAmount = Number(coupon.maxDiscount);
                        }
                    }
                    else if (coupon.discountAmount) {
                        discountAmount = Number(coupon.discountAmount);
                    }
                    // Increment coupon usage count
                    await tx.coupon.update({
                        where: { id: coupon.id },
                        data: { usageCount: coupon.usageCount + 1 },
                    });
                }
            }
            const shippingCost = subtotal >= 500 ? 0 : 50; // Free shipping over ₹500
            const totalAmount = subtotal - discountAmount + shippingCost;
            const orderNumber = `HM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: data.userId || null,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    shippingAddress: typeof data.shippingAddress === 'string' ? data.shippingAddress : JSON.stringify(data.shippingAddress),
                    subtotal,
                    discountAmount,
                    shippingCost,
                    totalAmount,
                    paymentMethod: data.paymentMethod,
                    status: 'PENDING',
                    paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
                    items: {
                        create: orderItemsToCreate,
                    },
                },
                include: { items: true },
            });
            return order;
        });
    }
    async getOrders(page = 1, limit = 10, userId) {
        const { items, totalItems } = await this.repo.findPaginated(page, limit, userId);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            items,
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async getOrderById(id) {
        let order = await this.repo.findById(id);
        if (!order) {
            order = await this.repo.findByOrderNumber(id);
        }
        if (!order) {
            throw new custom_error_1.NotFoundError('Order not found');
        }
        return order;
    }
    async updateOrderStatus(id, status, paymentStatus) {
        const order = await this.repo.findById(id);
        if (!order) {
            throw new custom_error_1.NotFoundError('Order not found');
        }
        return this.repo.updateStatus(id, status, paymentStatus);
    }
}
exports.OrdersService = OrdersService;
exports.ordersService = new OrdersService();

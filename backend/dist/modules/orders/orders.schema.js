"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerEmail: zod_1.z.string().email('Invalid email address'),
        customerPhone: zod_1.z.string().min(5, 'Valid phone number required'),
        shippingAddress: zod_1.z.union([
            zod_1.z.object({
                recipientName: zod_1.z.string().optional(),
                phone: zod_1.z.string().optional(),
                street: zod_1.z.string().optional(),
                city: zod_1.z.string().optional(),
                state: zod_1.z.string().optional(),
                postalCode: zod_1.z.string().optional(),
            }),
            zod_1.z.string(),
            zod_1.z.record(zod_1.z.any()),
        ]),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().min(1, 'Invalid product ID or slug'),
            quantity: zod_1.z.number().int().positive('Quantity must be at least 1'),
        })).min(1, 'Cart cannot be empty'),
        paymentMethod: zod_1.z.string().default('COD'),
        couponCode: zod_1.z.string().optional(),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Invalid order ID'),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
        paymentStatus: zod_1.z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
    }),
});
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string().min(1, 'Order ID is required'),
        razorpayOrderId: zod_1.z.string().min(1, 'Razorpay Order ID is required'),
        razorpayPaymentId: zod_1.z.string().min(1, 'Razorpay Payment ID is required'),
        razorpaySignature: zod_1.z.string().min(1, 'Razorpay Signature is required'),
    }),
});

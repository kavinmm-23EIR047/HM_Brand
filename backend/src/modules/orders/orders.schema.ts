import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(5, 'Valid phone number required'),
    shippingAddress: z.union([
      z.object({
        recipientName: z.string().optional(),
        phone: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
      }),
      z.string(),
      z.record(z.any()),
    ]),
    items: z.array(z.object({
      productId: z.string().min(1, 'Invalid product ID or slug'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })).min(1, 'Cart cannot be empty'),
    paymentMethod: z.string().default('COD'),
    couponCode: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid order ID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  }),
});


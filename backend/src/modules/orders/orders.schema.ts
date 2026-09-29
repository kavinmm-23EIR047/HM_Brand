import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(10, 'Valid 10-digit phone number required'),
    shippingAddress: z.object({
      recipientName: z.string().min(2),
      phone: z.string().min(10),
      street: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      postalCode: z.string().min(6),
    }),
    items: z.array(z.object({
      productId: z.string().min(1, 'Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })).min(1, 'Cart cannot be empty'),
    paymentMethod: z.enum(['COD', 'ONLINE']).default('COD'),
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


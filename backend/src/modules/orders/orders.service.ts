import prisma from '../../shared/database/prisma';
import { ordersRepository, OrdersRepository } from './orders.repository';
import { BadRequestError, NotFoundError } from '../../shared/errors/custom.error';
import { OrderStatus, PaymentStatus } from '../../shared/types';

export class OrdersService {
  constructor(private repo: OrdersRepository = ordersRepository) {}

  async createOrder(data: {
    userId?: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: any;
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: string;
    couponCode?: string;
  }) {
    // Transaction execution for atomic order placement & stock deduction
    return prisma.$transaction(async (tx: any) => {
      let subtotal = 0;
      const orderItemsToCreate: any[] = [];

      for (const item of data.items) {
        const product = await tx.product.findFirst({
          where: {
            OR: [{ id: item.productId }, { slug: item.productId }, { sku: item.productId }],
            deletedAt: null,
          },
          include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
        });

        if (!product || !product.isActive) {
          throw new BadRequestError(`Product with ID or Slug '${item.productId}' is not available.`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestError(`Insufficient stock for '${product.name}'. Available: ${product.stockQuantity}`);
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
          } else if (coupon.discountAmount) {
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

  async getOrders(page: number = 1, limit: number = 10, userId?: string) {
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

  async getOrderById(id: string) {
    let order = await this.repo.findById(id);
    if (!order) {
      order = await this.repo.findByOrderNumber(id);
    }
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const order = await this.repo.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return this.repo.updateStatus(id, status, paymentStatus);
  }
}

export const ordersService = new OrdersService();

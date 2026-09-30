import prisma from '../../shared/database/prisma';
import { Order } from '@prisma/client';
import { OrderStatus, PaymentStatus } from '../../shared/types';

export class OrdersRepository {
  async findPaginated(page: number = 1, limit: number = 10, userId?: string, email?: string) {
    const skip = (page - 1) * limit;
    let where: any = {};
    if (userId && email) {
      where = {
        OR: [
          { userId },
          { customerEmail: { equals: email, mode: 'insensitive' } },
        ],
      };
    } else if (userId) {
      where = { userId };
    } else if (email) {
      where = { customerEmail: { equals: email, mode: 'insensitive' } };
    }

    const [items, totalItems] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { items, totalItems };
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  }

  async updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      include: { items: true },
    });
  }
}

export const ordersRepository = new OrdersRepository();

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

  async updateStatus(
    id: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    courierData?: { courierName?: string; trackingNumber?: string; courierNote?: string }
  ) {
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    let shippingAddressStr = existingOrder?.shippingAddress || '';

    if (courierData && (courierData.courierName || courierData.trackingNumber || courierData.courierNote)) {
      let parsedAddress: any = {};
      try {
        parsedAddress = typeof shippingAddressStr === 'string' ? JSON.parse(shippingAddressStr) : (shippingAddressStr || {});
      } catch {
        parsedAddress = { rawAddress: shippingAddressStr };
      }
      if (courierData.courierName !== undefined) parsedAddress.courierName = courierData.courierName;
      if (courierData.trackingNumber !== undefined) parsedAddress.trackingNumber = courierData.trackingNumber;
      if (courierData.courierNote !== undefined) parsedAddress.courierNote = courierData.courierNote;
      parsedAddress.dispatchedAt = new Date().toISOString();

      shippingAddressStr = JSON.stringify(parsedAddress);
    }

    return prisma.order.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
        shippingAddress: shippingAddressStr,
      },
      include: { items: true },
    });
  }
}

export const ordersRepository = new OrdersRepository();

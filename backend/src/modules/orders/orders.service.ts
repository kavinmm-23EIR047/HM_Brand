import prisma from '../../shared/database/prisma';
import { ordersRepository, OrdersRepository } from './orders.repository';
import { BadRequestError, NotFoundError } from '../../shared/errors/custom.error';
import { OrderStatus, PaymentStatus } from '../../shared/types';
import { shippingConfig } from '../../shared/config/shipping.config';
import { razorpayService } from '../../shared/payment/razorpay.service';
import { emailService, OrderEmailData } from '../../shared/messaging/email.service';
import { telegramService } from '../../shared/messaging/telegram.service';
import { pushService } from '../../shared/notifications/push.service';

const LEGACY_SLUG_MAP: Record<string, string> = {
  '10-in-1-aroma-family-pack': 'hm-dhoop-stick-10-flavours',
  'bhimseni-camphor': 'bhimseni-camphor-15g',
  'cup-sambrani': 'cup-sambrani-250gms',
  'kesar-loban': 'kesar-loban-sambrani',
  'cardamom': 'exclusive-cardamom-sambrani',
  'kasturi': 'kasturi-sambrani',
  'karpoor-loban': 'karpoor-loban-sambrani',
  'pancha-rudhra': 'pancha-rudhra-sambrani',
  'real-stone': 'real-stone-sambrani',
  'fancy-flora': 'fancy-flora-sambrani',
  'mehak-italian': 'mehak-italian-agarbatti',
  'chandan-pure-dhoop': 'hm-dhoop-stick-6-flavours',
};

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
    // 1. Validate all products and calculate line items & subtotal
    let subtotal = 0;
    const itemsWithProduct: any[] = [];
    const orderItemsToCreate: any[] = [];

    for (const item of data.items) {
      const target = LEGACY_SLUG_MAP[item.productId] || item.productId;
      let product = await prisma.product.findFirst({
        where: {
          OR: [
            { id: target },
            { slug: target },
            { sku: target },
            { id: item.productId },
            { slug: item.productId },
            { sku: item.productId },
          ],
          deletedAt: null,
        },
        include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
      });

      // Fallback: search by normalized name or slug match if exact lookup misses
      if (!product) {
        const normalized = item.productId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const allActive = await prisma.product.findMany({
          where: { deletedAt: null, isActive: true },
          include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
        });
        product = allActive.find((p) => {
          const pNorm = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          const pNameNorm = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return pNorm.includes(normalized) || normalized.includes(pNorm) || pNameNorm.includes(normalized);
        }) || null;
      }

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

      orderItemsToCreate.push({
        productId: product.id,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        unitPriceSnapshot: unitPrice,
        imageUrlSnapshot: primaryImage,
        quantity: item.quantity,
        totalPrice,
      });

      itemsWithProduct.push({
        id: product.id,
        quantity: item.quantity,
      });
    }

    // 2. Calculate discounts if coupon applied
    let discountAmount = 0;
    let couponToUpdateId: string | null = null;
    let effectiveCouponCode = data.couponCode ? data.couponCode.toUpperCase().trim() : null;

    // Automatic fallback: check if any product in order has an active coupon attached
    if (!effectiveCouponCode) {
      for (const item of itemsWithProduct) {
        const prod = await prisma.product.findUnique({
          where: { id: item.id },
          select: { couponCode: true },
        });
        if (prod?.couponCode) {
          effectiveCouponCode = prod.couponCode.toUpperCase().trim();
          break;
        }
      }
    }

    if (effectiveCouponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: effectiveCouponCode },
      });

      if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date()) {
        const minOrder = Number(coupon.minOrderAmount || 0);
        if (subtotal >= minOrder) {
          if (coupon.discountPercent) {
            discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
              discountAmount = Number(coupon.maxDiscount);
            }
          } else if (coupon.discountAmount) {
            discountAmount = Math.min(subtotal, Number(coupon.discountAmount));
          }
          couponToUpdateId = coupon.id;
        }
      }
    }

    // 3. Dynamic shipping calculation using central configuration (calibrated after coupon discount)
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shippingCost = shippingConfig.calculate(discountedSubtotal);
    const totalAmount = Math.max(0, discountedSubtotal + shippingCost);
    const orderNumber = `HM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Check if online payment via Razorpay is requested (External API call done before DB lock)
    const paymentMethodUpper = (data.paymentMethod || 'COD').toUpperCase();
    const isOnlinePayment = paymentMethodUpper !== 'COD';
    let razorpayOrderData: any = null;
    let razorpayOrderId: string | null = null;

    if (isOnlinePayment && razorpayService.isConfigured() && totalAmount > 0) {
      try {
        razorpayOrderData = await razorpayService.createOrder({
          amount: totalAmount,
          receipt: orderNumber,
          notes: {
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
          },
        });
        razorpayOrderId = razorpayOrderData.id;
      } catch (rzpErr: any) {
        console.error('[OrdersService] Razorpay order creation failed:', rzpErr.message);
        throw new BadRequestError(`Payment initialization failed: ${rzpErr.message}`);
      }
    }

    // Validate if userId exists in database to prevent foreign key errors
    let validUserId: string | null = null;
    if (data.userId) {
      const userExists = await prisma.user.findUnique({ where: { id: data.userId } });
      if (userExists) {
        validUserId = userExists.id;
      }
    }
    // Fallback: Link order by customer email if user exists in database
    if (!validUserId && data.customerEmail) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: data.customerEmail.toLowerCase().trim() },
      });
      if (userByEmail) {
        validUserId = userByEmail.id;
      }
    }

    // 5. Fast Atomic DB Transaction (stock decrement + order insertion)
    const order = await prisma.$transaction(
      async (tx: any) => {
        // Deduct inventory stock
        for (const item of itemsWithProduct) {
          await tx.product.update({
            where: { id: item.id },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }

        // Increment coupon count if used
        if (couponToUpdateId) {
          await tx.coupon.update({
            where: { id: couponToUpdateId },
            data: { usageCount: { increment: 1 } },
          });
        }

        // Create the order record
        return tx.order.create({
          data: {
            orderNumber,
            userId: validUserId,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            shippingAddress: typeof data.shippingAddress === 'string' ? data.shippingAddress : JSON.stringify(data.shippingAddress),
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount,
            paymentMethod: paymentMethodUpper,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            razorpayOrderId,
            items: {
              create: orderItemsToCreate,
            },
          },
          include: { items: true },
        });
      },
      {
        maxWait: 10000,
        timeout: 15000,
      }
    );

    if (!isOnlinePayment) {
      this.dispatchNewOrderNotifications(order);
    }

    return {
      ...order,
      razorpay: razorpayOrderData
        ? {
            orderId: razorpayOrderData.id,
            amount: razorpayOrderData.amount,
            currency: razorpayOrderData.currency,
            keyId: razorpayService.getKeyId(),
          }
        : null,
    };
  }

  async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const order = await this.getOrderById(data.orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const isValid = razorpayService.verifySignature({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
    });

    if (!isValid) {
      throw new BadRequestError('Payment signature verification failed');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayPaymentId: data.razorpayPaymentId,
        razorpayOrderId: data.razorpayOrderId,
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
      },
      include: { items: true },
    });

    this.dispatchNewOrderNotifications(updatedOrder);

    return updatedOrder;
  }

  async processRazorpayWebhook(eventData: any) {
    const event = eventData?.event;
    console.log(`[OrdersService] Webhook event received: ${event}`);

    const paymentEntity = eventData?.payload?.payment?.entity;
    const orderEntity = eventData?.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;
    const orderReceipt = orderEntity?.receipt;

    if (!razorpayOrderId && !orderReceipt) {
      console.warn('[OrdersService] Webhook payload missing order references');
      return { status: 'skipped', reason: 'Missing order identifiers' };
    }

    // Find the matching order by razorpayOrderId or orderNumber receipt
    let order = null;
    if (razorpayOrderId) {
      order = await prisma.order.findFirst({
        where: { razorpayOrderId },
        include: { items: true },
      });
    }

    if (!order && orderReceipt) {
      order = await prisma.order.findFirst({
        where: { orderNumber: orderReceipt },
        include: { items: true },
      });
    }

    if (!order) {
      console.warn(`[OrdersService] No order found for Razorpay order ID: ${razorpayOrderId} / Receipt: ${orderReceipt}`);
      return { status: 'not_found', razorpayOrderId, orderReceipt };
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
          razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
          razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
        },
        include: { items: true },
      });
      console.log(`[OrdersService] Webhook confirmed payment for order: ${updatedOrder.orderNumber}`);
      this.dispatchNewOrderNotifications(updatedOrder);
      return { status: 'confirmed', orderId: updatedOrder.id, orderNumber: updatedOrder.orderNumber };
    }

    if (event === 'payment.failed') {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      console.log(`[OrdersService] Webhook marked payment as FAILED for order: ${updatedOrder.orderNumber}`);
      return { status: 'failed', orderId: updatedOrder.id, orderNumber: updatedOrder.orderNumber };
    }

    return { status: 'unhandled_event', event };
  }

  getShippingConfig() {
    return shippingConfig.getPublicConfig();
  }

  async getOrders(page: number = 1, limit: number = 10, userId?: string, email?: string) {
    const { items, totalItems } = await this.repo.findPaginated(page, limit, userId, email);
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

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    courierData?: { courierName?: string; trackingNumber?: string; courierNote?: string }
  ) {
    const order = await this.repo.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const effectivePaymentStatus = paymentStatus || order.paymentStatus;
    const isOnlinePayment = (order.paymentMethod || '').toUpperCase() !== 'COD';
    const isAdvancingToShipping = ['READY_TO_SHIP', 'PROCESSING', 'SHIPPED', 'DISPATCHED', 'DELIVERED'].includes(status);

    if (isOnlinePayment && effectivePaymentStatus === 'PENDING' && isAdvancingToShipping) {
      throw new BadRequestError('Cannot move order to shipping: Payment is still pending. Please confirm payment first.');
    }

    if (order.status === 'PENDING' && isAdvancingToShipping) {
      throw new BadRequestError('Cannot move pending order directly to shipping stages. Please confirm the order first.');
    }

    const updated = await this.repo.updateStatus(id, status, paymentStatus, courierData);
    if (updated) {
      this.dispatchStatusUpdateNotifications(updated, status, courierData);
    }
    return updated;
  }

  private parseShippingAddress(raw: any) {
    if (!raw) return { fullName: 'Valued Devotee', email: '', phone: '', street: '', city: 'Coimbatore', state: 'Tamil Nadu', postalCode: '' };
    if (typeof raw === 'object') return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return { fullName: 'Valued Devotee', street: String(raw), city: '', state: '', postalCode: '', phone: '', email: '' };
    }
  }

  private formatOrderForMessaging(order: any): OrderEmailData {
    const addr = this.parseShippingAddress(order.shippingAddress);
    return {
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount || 0),
      shippingCost: Number(order.shippingCost || 0),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      razorpayPaymentId: order.razorpayPaymentId || undefined,
      createdAt: order.createdAt,
      customer: {
        fullName: addr.fullName || addr.name || order.customerEmail || 'Valued Devotee',
        email: order.customerEmail,
        phone: order.customerPhone || addr.phone || '',
        street: addr.addressLine1 ? `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}` : (addr.street || ''),
        city: addr.city || '',
        state: addr.state || 'Tamil Nadu',
        postalCode: addr.postalCode || addr.pincode || addr.zipCode || '',
      },
      items: (order.items || []).map((item: any) => ({
        name: item.productNameSnapshot || item.product?.name || 'Sacred Agarbatti',
        quantity: item.quantity,
        unitPrice: Number(item.unitPriceSnapshot || item.unitPrice || 0),
        totalPrice: Number(item.totalPrice || 0),
        image: item.imageUrlSnapshot || undefined,
      })),
    };
  }

  private async dispatchNewOrderNotifications(order: any) {
    try {
      const formatted = this.formatOrderForMessaging(order);
      const customerName = formatted.customer.fullName;

      Promise.allSettled([
        // 1. Brevo Email to Admin
        emailService.sendAdminNewOrderAlert(formatted),
        // 2. Brevo Email to Customer
        emailService.sendCustomerOrderConfirmation(formatted),
        // 3. Telegram Bot to Admin Chat
        telegramService.sendOrderAlert(formatted),
        // 4. Web Push Notification to Admin devices
        pushService.notifyAdmins({
          title: `🛒 New Order: ${order.orderNumber}`,
          body: `₹${Number(order.totalAmount).toLocaleString('en-IN')} from ${customerName} (${order.paymentMethod})`,
          url: '/admin',
          data: { orderId: order.id, orderNumber: order.orderNumber },
        }),
      ]).catch((err) => console.error('[OrdersService] Error dispatching new order notifications:', err));
    } catch (err) {
      console.error('[OrdersService] Failed to format order for notifications:', err);
    }
  }

  private async dispatchStatusUpdateNotifications(
    order: any,
    newStatus: string,
    courierData?: { courierName?: string; trackingNumber?: string; courierNote?: string }
  ) {
    try {
      const addr = this.parseShippingAddress(order.shippingAddress);
      const customerName = addr.fullName || addr.name || 'Valued Devotee';

      const statusTitles: Record<string, string> = {
        CONFIRMED: 'Order Confirmed',
        PROCESSING: 'Order Packing in Progress',
        READY_TO_SHIP: 'Awaiting Courier Handover',
        SHIPPED: 'Sacred Parcel Dispatched from Coimbatore!',
        DISPATCHED: 'Sacred Parcel Dispatched from Coimbatore!',
        DELIVERED: 'Sacred Fragrance Delivered to Your Home!',
        CANCELLED: 'Order Cancelled',
      };

      const statusMsg = statusTitles[newStatus] || `Status updated to ${newStatus}`;

      Promise.allSettled([
        // 1. Brevo Email to Customer
        emailService.sendCustomerStatusUpdate(
          {
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
          },
          customerName,
          newStatus,
          courierData
        ),
        // 2. Web Push to Customer
        order.userId
          ? pushService.notifyCustomer(order.userId, {
              title: `🚚 ${order.orderNumber}: ${statusMsg}`,
              body: courierData?.trackingNumber
                ? `Tracking AWB: ${courierData.trackingNumber} via ${courierData.courierName || 'Courier'}. View live updates in your account.`
                : `Your sacred parcel status is now ${newStatus}. Tap to view live order tracking.`,
              url: '/account',
              data: { orderId: order.id, orderNumber: order.orderNumber, newStatus },
            })
          : Promise.resolve({ sent: 0, failed: 0 }),
      ]).catch((err) => console.error('[OrdersService] Error dispatching status update notifications:', err));
    } catch (err) {
      console.error('[OrdersService] Failed to dispatch status update notifications:', err);
    }
  }
}

export const ordersService = new OrdersService();

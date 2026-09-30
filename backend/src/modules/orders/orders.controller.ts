import { Request, Response, NextFunction } from 'express';
import { ordersService, OrdersService } from './orders.service';
import { sendSuccess, sendPaginated } from '../../shared/utils/response.util';

export class OrdersController {
  constructor(private service: OrdersService = ordersService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.createOrder({
        ...req.body,
        userId: req.user?.userId || req.body.userId,
      });
      return sendSuccess(res, order, 'Order placed successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedOrder = await this.service.verifyPayment({
        orderId: req.body.orderId,
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
        razorpaySignature: req.body.razorpaySignature,
      });
      return sendSuccess(res, updatedOrder, 'Payment verified successfully');
    } catch (error) {
      return next(error);
    }
  };

  getShippingConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = this.service.getShippingConfig();
      return sendSuccess(res, config, 'Shipping configuration retrieved');
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const isMyOrders = req.query.myOrders === 'true' || req.query.userId === 'me';
      
      let filterUserId: string | undefined = undefined;
      let filterEmail: string | undefined = undefined;

      if (isMyOrders) {
        filterUserId = req.user?.userId;
        filterEmail = req.user?.email;
      } else if (req.user && req.user.role !== 'ADMIN') {
        filterUserId = req.user.userId;
        filterEmail = req.user.email;
      }

      if (req.query.email && typeof req.query.email === 'string') {
        filterEmail = req.query.email.trim();
      }

      const result = await this.service.getOrders(page, limit, filterUserId, filterEmail);
      return sendPaginated(res, result.items, result.meta, 'Orders retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.getOrderById(req.params.id);
      return sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, paymentStatus } = req.body;
      const order = await this.service.updateOrderStatus(req.params.id, status, paymentStatus);
      return sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const ordersController = new OrdersController();

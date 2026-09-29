import { Request, Response, NextFunction } from 'express';
import { ordersService, OrdersService } from './orders.service';
import { sendSuccess, sendPaginated } from '../../shared/utils/response.util';

export class OrdersController {
  constructor(private service: OrdersService = ordersService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.createOrder({
        ...req.body,
        userId: req.user?.userId,
      });
      return sendSuccess(res, order, 'Order placed successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;

      const result = await this.service.getOrders(page, limit, userId);
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

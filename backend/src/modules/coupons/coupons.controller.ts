import { Request, Response, NextFunction } from 'express';
import { couponsService, CouponsService } from './coupons.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class CouponsController {
  constructor(private service: CouponsService = couponsService) {}

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, cartAmount } = req.body;
      const result = await this.service.validateCoupon(code, Number(cartAmount || 0));
      return sendSuccess(res, result, 'Coupon applied successfully');
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await this.service.getAllCoupons();
      return sendSuccess(res, coupons, 'Coupons retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await this.service.createCoupon(req.body);
      return sendSuccess(res, coupon, 'Coupon created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupon = await this.service.updateCoupon(req.params.id, req.body);
      return sendSuccess(res, coupon, 'Coupon updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteCoupon(req.params.id);
      return sendSuccess(res, null, 'Coupon deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const couponsController = new CouponsController();

import { Request, Response, NextFunction } from 'express';
import { adminService, AdminService } from './admin.service';
import { sendSuccess, sendPaginated } from '../../shared/utils/response.util';

export class AdminController {
  constructor(private service: AdminService = adminService) {}

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.service.getDashboardMetrics();
      return sendSuccess(res, metrics, 'Admin dashboard metrics retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const result = await this.service.getAuditLogs(page, limit);
      return sendPaginated(res, result.items, result.meta, 'Admin audit logs retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const adminController = new AdminController();

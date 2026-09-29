import { Request, Response, NextFunction } from 'express';
import { bannersService, BannersService } from './banners.service';
import { sendSuccess } from '../../shared/utils/response.util';
import { BannerPosition } from '../../shared/types';

export class BannersController {
  constructor(private service: BannersService = bannersService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const position = req.query.position as BannerPosition | undefined;
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const banners = await this.service.getBanners(position, includeInactive);
      return sendSuccess(res, banners, 'Banners retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await this.service.createBanner(req.body);
      return sendSuccess(res, banner, 'Banner created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banner = await this.service.updateBanner(req.params.id, req.body);
      return sendSuccess(res, banner, 'Banner updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteBanner(req.params.id);
      return sendSuccess(res, null, 'Banner deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const bannersController = new BannersController();

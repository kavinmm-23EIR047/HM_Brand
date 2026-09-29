import { Request, Response, NextFunction } from 'express';
import { festivalsService, FestivalsService } from './festivals.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class FestivalsController {
  constructor(private service: FestivalsService = festivalsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const festivals = await this.service.getAllFestivals(includeInactive);
      return sendSuccess(res, festivals, 'Festivals retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const festival = await this.service.getFestivalBySlug(req.params.slug);
      return sendSuccess(res, festival, 'Festival campaign retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const festival = await this.service.createFestival(req.body);
      return sendSuccess(res, festival, 'Festival campaign created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const festival = await this.service.updateFestival(req.params.id, req.body);
      return sendSuccess(res, festival, 'Festival campaign updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteFestival(req.params.id);
      return sendSuccess(res, null, 'Festival campaign deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const festivalsController = new FestivalsController();

import { Request, Response, NextFunction } from 'express';
import { homepageService, HomepageService } from './homepage.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class HomepageController {
  constructor(private service: HomepageService = homepageService) {}

  getHomepage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getHomepagePayload();
      return sendSuccess(res, data, 'Homepage content retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  updateSections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.service.updateHomepageSections(req.body.sections);
      return sendSuccess(res, updated, 'Homepage sections updated successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const homepageController = new HomepageController();

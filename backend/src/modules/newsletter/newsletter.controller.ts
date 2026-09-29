import { Request, Response, NextFunction } from 'express';
import { newsletterService, NewsletterService } from './newsletter.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class NewsletterController {
  constructor(private service: NewsletterService = newsletterService) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriber = await this.service.subscribe(req.body.email);
      return sendSuccess(res, subscriber, 'Successfully subscribed to newsletter!', 201);
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscribers = await this.service.getAllSubscribers();
      return sendSuccess(res, subscribers, 'Newsletter subscribers retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const newsletterController = new NewsletterController();

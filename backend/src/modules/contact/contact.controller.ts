import { Request, Response, NextFunction } from 'express';
import { contactService, ContactService } from './contact.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class ContactController {
  constructor(private service: ContactService = contactService) {}

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.service.submitMessage(req.body);
      return sendSuccess(res, message, 'Thank you for contacting HM Agarbattis. We will respond shortly!', 201);
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await this.service.getAllMessages();
      return sendSuccess(res, messages, 'Contact messages retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.service.markAsRead(req.params.id);
      return sendSuccess(res, message, 'Message marked as read');
    } catch (error) {
      return next(error);
    }
  };
}

export const contactController = new ContactController();

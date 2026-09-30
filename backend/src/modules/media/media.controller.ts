import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../shared/utils/response.util';
import { BadRequestError } from '../../shared/errors/custom.error';
import { mediaService } from './media.service';

export class MediaController {
  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new BadRequestError('An image file is required.');
      const result = await mediaService.upload(req.file, req.body);
      return sendSuccess(res, result, 'Image uploaded successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await mediaService.delete(req.params.type, req.params.entityId, { ...req.query, ...req.body });
      return sendSuccess(res, null, 'Image deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const mediaController = new MediaController();

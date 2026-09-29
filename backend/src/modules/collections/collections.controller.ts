import { Request, Response, NextFunction } from 'express';
import { collectionsService, CollectionsService } from './collections.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class CollectionsController {
  constructor(private service: CollectionsService = collectionsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const collections = await this.service.getAllCollections(includeInactive);
      return sendSuccess(res, collections, 'Collections retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await this.service.getCollectionBySlug(req.params.slug);
      return sendSuccess(res, collection, 'Collection retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await this.service.createCollection(req.body);
      return sendSuccess(res, collection, 'Collection created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await this.service.updateCollection(req.params.id, req.body);
      return sendSuccess(res, collection, 'Collection updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteCollection(req.params.id);
      return sendSuccess(res, null, 'Collection deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const collectionsController = new CollectionsController();

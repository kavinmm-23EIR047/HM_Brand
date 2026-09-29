import { Request, Response, NextFunction } from 'express';
import { categoriesService, CategoriesService } from './categories.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class CategoriesController {
  constructor(private service: CategoriesService = categoriesService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const categories = await this.service.getAllCategories(includeInactive);
      return sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.getCategoryBySlug(req.params.slug);
      return sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.createCategory(req.body);
      return sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.updateCategory(req.params.id, req.body);
      return sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteCategory(req.params.id);
      return sendSuccess(res, null, 'Category archived successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const categoriesController = new CategoriesController();

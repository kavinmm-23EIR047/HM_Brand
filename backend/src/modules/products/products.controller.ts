import { Request, Response, NextFunction } from 'express';
import { productsService, ProductsService } from './products.service';
import { sendSuccess, sendPaginated } from '../../shared/utils/response.util';

export class ProductsController {
  constructor(private service: ProductsService = productsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const result = await this.service.getProducts({
        ...req.query,
        includeInactive,
      } as any);

      return sendPaginated(res, result.items, result.meta, 'Products retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.getProductBySlug(req.params.slug);
      return sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.createProduct(req.body);
      return sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.updateProduct(req.params.id, req.body);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = await this.service.addProductImage(req.params.id, req.body);
      return sendSuccess(res, image, 'Product image added successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  removeImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.removeProductImage(req.params.imageId);
      return sendSuccess(res, null, 'Product image deleted successfully');
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteProduct(req.params.id);
      return sendSuccess(res, null, 'Product archived successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const productsController = new ProductsController();

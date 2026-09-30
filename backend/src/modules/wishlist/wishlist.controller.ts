import { Request, Response, NextFunction } from 'express';
import { wishlistService, WishlistService } from './wishlist.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class WishlistController {
  constructor(private service: WishlistService = wishlistService) {}

  getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getWishlist(req.user!.userId);
      return sendSuccess(res, items, 'Wishlist retrieved successfully');
    } catch (error) {
      return next(error);
    }
  };

  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = req.body.productId || req.body.slug;
      const item = await this.service.addToWishlist(req.user!.userId, target);
      return sendSuccess(res, item, 'Product added to wishlist', 201);
    } catch (error) {
      return next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.removeFromWishlist(req.user!.userId, req.params.productId);
      return sendSuccess(res, null, 'Product removed from wishlist');
    } catch (error) {
      return next(error);
    }
  };

  sync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = Array.isArray(req.body.items)
        ? req.body.items
        : Array.isArray(req.body.slugs)
        ? req.body.slugs
        : [];
      const wishlist = await this.service.syncWishlist(req.user!.userId, items);
      return sendSuccess(res, wishlist, 'Wishlist synced successfully');
    } catch (error) {
      return next(error);
    }
  };
}

export const wishlistController = new WishlistController();

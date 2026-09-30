"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistController = exports.WishlistController = void 0;
const wishlist_service_1 = require("./wishlist.service");
const response_util_1 = require("../../shared/utils/response.util");
class WishlistController {
    service;
    constructor(service = wishlist_service_1.wishlistService) {
        this.service = service;
    }
    getWishlist = async (req, res, next) => {
        try {
            const items = await this.service.getWishlist(req.user.userId);
            return (0, response_util_1.sendSuccess)(res, items, 'Wishlist retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    add = async (req, res, next) => {
        try {
            const target = req.body.productId || req.body.slug;
            const item = await this.service.addToWishlist(req.user.userId, target);
            return (0, response_util_1.sendSuccess)(res, item, 'Product added to wishlist', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.service.removeFromWishlist(req.user.userId, req.params.productId);
            return (0, response_util_1.sendSuccess)(res, null, 'Product removed from wishlist');
        }
        catch (error) {
            return next(error);
        }
    };
    sync = async (req, res, next) => {
        try {
            const items = Array.isArray(req.body.items)
                ? req.body.items
                : Array.isArray(req.body.slugs)
                    ? req.body.slugs
                    : [];
            const wishlist = await this.service.syncWishlist(req.user.userId, items);
            return (0, response_util_1.sendSuccess)(res, wishlist, 'Wishlist synced successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.WishlistController = WishlistController;
exports.wishlistController = new WishlistController();

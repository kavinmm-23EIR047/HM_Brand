"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = exports.ProductsController = void 0;
const products_service_1 = require("./products.service");
const response_util_1 = require("../../shared/utils/response.util");
class ProductsController {
    service;
    constructor(service = products_service_1.productsService) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
            const result = await this.service.getProducts({
                ...req.query,
                includeInactive,
            });
            return (0, response_util_1.sendPaginated)(res, result.items, result.meta, 'Products retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getBySlug = async (req, res, next) => {
        try {
            const product = await this.service.getProductBySlug(req.params.slug);
            return (0, response_util_1.sendSuccess)(res, product, 'Product retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const product = await this.service.createProduct(req.body);
            return (0, response_util_1.sendSuccess)(res, product, 'Product created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const product = await this.service.updateProduct(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, product, 'Product updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    addImage = async (req, res, next) => {
        try {
            const image = await this.service.addProductImage(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, image, 'Product image added successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    removeImage = async (req, res, next) => {
        try {
            await this.service.removeProductImage(req.params.imageId);
            return (0, response_util_1.sendSuccess)(res, null, 'Product image deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteProduct(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Product archived successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.ProductsController = ProductsController;
exports.productsController = new ProductsController();

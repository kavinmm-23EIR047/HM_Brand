"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = exports.ProductsController = void 0;
const products_service_1 = require("./products.service");
const products_search_1 = require("./products.search");
const response_util_1 = require("../../shared/utils/response.util");
class ProductsController {
    service;
    constructor(service = products_service_1.productsService) {
        this.service = service;
    }
    search = async (req, res, next) => {
        try {
            const q = typeof req.query.q === 'string' ? req.query.q : '';
            const type = req.query.type === 'autocomplete' ? 'autocomplete' : 'full';
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
            const category = typeof req.query.category === 'string' ? req.query.category : undefined;
            const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
            const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
            const result = await (0, products_search_1.searchProducts)({
                q,
                type,
                limit,
                offset,
                category,
                minPrice,
                maxPrice,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return next(error);
        }
    };
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

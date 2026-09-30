"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = exports.CategoriesController = void 0;
const categories_service_1 = require("./categories.service");
const response_util_1 = require("../../shared/utils/response.util");
class CategoriesController {
    service;
    constructor(service = categories_service_1.categoriesService) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
            const categories = await this.service.getAllCategories(includeInactive);
            return (0, response_util_1.sendSuccess)(res, categories, 'Categories retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getBySlug = async (req, res, next) => {
        try {
            const category = await this.service.getCategoryBySlug(req.params.slug);
            return (0, response_util_1.sendSuccess)(res, category, 'Category retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const category = await this.service.createCategory(req.body);
            return (0, response_util_1.sendSuccess)(res, category, 'Category created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const category = await this.service.updateCategory(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, category, 'Category updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteCategory(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Category archived successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.CategoriesController = CategoriesController;
exports.categoriesController = new CategoriesController();

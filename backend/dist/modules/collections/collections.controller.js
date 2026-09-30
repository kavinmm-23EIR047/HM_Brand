"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionsController = exports.CollectionsController = void 0;
const collections_service_1 = require("./collections.service");
const response_util_1 = require("../../shared/utils/response.util");
class CollectionsController {
    service;
    constructor(service = collections_service_1.collectionsService) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
            const collections = await this.service.getAllCollections(includeInactive);
            return (0, response_util_1.sendSuccess)(res, collections, 'Collections retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getBySlug = async (req, res, next) => {
        try {
            const collection = await this.service.getCollectionBySlug(req.params.slug);
            return (0, response_util_1.sendSuccess)(res, collection, 'Collection retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const collection = await this.service.createCollection(req.body);
            return (0, response_util_1.sendSuccess)(res, collection, 'Collection created successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const collection = await this.service.updateCollection(req.params.id, req.body);
            return (0, response_util_1.sendSuccess)(res, collection, 'Collection updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.deleteCollection(req.params.id);
            return (0, response_util_1.sendSuccess)(res, null, 'Collection deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.CollectionsController = CollectionsController;
exports.collectionsController = new CollectionsController();

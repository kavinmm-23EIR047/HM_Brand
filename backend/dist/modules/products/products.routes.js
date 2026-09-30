"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("./products.controller");
const validation_middleware_1 = require("../../shared/middlewares/validation.middleware");
const products_schema_1 = require("./products.schema");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', auth_middleware_1.optionalAuthenticateJWT, (0, validation_middleware_1.validateRequest)(products_schema_1.productQuerySchema), products_controller_1.productsController.getAll);
router.get('/:slug', products_controller_1.productsController.getBySlug);
// Admin Routes
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validateRequest)(products_schema_1.createProductSchema), products_controller_1.productsController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validateRequest)(products_schema_1.updateProductSchema), products_controller_1.productsController.update);
router.post('/admin/:id/images', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), products_controller_1.productsController.addImage);
router.delete('/admin/images/:imageId', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), products_controller_1.productsController.removeImage);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), products_controller_1.productsController.delete);
exports.default = router;

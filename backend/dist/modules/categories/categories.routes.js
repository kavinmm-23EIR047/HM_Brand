"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("./categories.controller");
const validation_middleware_1 = require("../../shared/middlewares/validation.middleware");
const categories_schema_1 = require("./categories.schema");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', auth_middleware_1.optionalAuthenticateJWT, categories_controller_1.categoriesController.getAll);
router.get('/:slug', categories_controller_1.categoriesController.getBySlug);
// Admin Routes
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validateRequest)(categories_schema_1.createCategorySchema), categories_controller_1.categoriesController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), (0, validation_middleware_1.validateRequest)(categories_schema_1.updateCategorySchema), categories_controller_1.categoriesController.update);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), categories_controller_1.categoriesController.delete);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collections_controller_1 = require("./collections.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/', collections_controller_1.collectionsController.getAll);
router.get('/:slug', collections_controller_1.collectionsController.getBySlug);
// Admin Routes
router.post('/admin', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), collections_controller_1.collectionsController.create);
router.patch('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), collections_controller_1.collectionsController.update);
router.delete('/admin/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.requireRole)('ADMIN'), collections_controller_1.collectionsController.delete);
exports.default = router;
